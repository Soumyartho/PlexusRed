const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const brandingDir = path.join(__dirname, '../public/branding');

const files = [
  'logo_icon_bgremoved.svg',
  'logo_full_bgremoved.svg',
  'Logo_icon copy.svg',
  'Logo_full copy.svg'
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('--- Starting Branding SVG Optimization (Converting Embedded PNGs to WebP) ---');

files.forEach(file => {
  const filePath = path.join(brandingDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${file}, skipping.`);
    return;
  }

  const initialSize = fs.statSync(filePath).size;
  console.log(`\nProcessing ${file} (Initial size: ${formatBytes(initialSize)})...`);

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all embedded PNG matches: href="data:image/png;base64,..."
  // Also support xlink:href if present
  const regex = /(href|xlink:href)="data:image\/png;base64,([^"]+)"/g;
  let match;
  let matches = [];

  // Capture all matches first so we don't mess up search offsets
  while ((match = regex.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      hrefAttr: match[1],
      base64Data: match[2]
    });
  }

  if (matches.length === 0) {
    console.log(`No embedded PNGs found in ${file}.`);
    return;
  }

  console.log(`Found ${matches.length} embedded PNGs inside ${file}. Optimizing...`);

  let replacements = [];

  matches.forEach((item, index) => {
    const tempPngPath = path.join(brandingDir, `temp_${file}_${index}.png`);
    const tempWebpPath = path.join(brandingDir, `temp_${file}_${index}.webp`);

    try {
      // 1. Write the base64 PNG out to a temporary file
      fs.writeFileSync(tempPngPath, Buffer.from(item.base64Data, 'base64'));

      // 2. Run ffmpeg to convert it to lossy WebP at 80% quality
      execSync(`ffmpeg -y -i "${tempPngPath}" -codec:v libwebp -lossless 0 -q:v 80 "${tempWebpPath}"`, { stdio: 'ignore' });

      // 3. Read back the WebP file and encode to base64
      const webpData = fs.readFileSync(tempWebpPath);
      const webpBase64 = webpData.toString('base64');

      // 4. Record the replacement content
      const oldString = item.fullMatch;
      const newString = `${item.hrefAttr}="data:image/webp;base64,${webpBase64}"`;
      
      replacements.push({ oldString, newString });
      
      console.log(`  - Image ${index + 1}: PNG ${formatBytes(fs.statSync(tempPngPath).size)} -> WebP ${formatBytes(webpData.length)}`);

    } catch (err) {
      console.error(`  - Failed to optimize Image ${index + 1}:`, err.message);
    } finally {
      // Clean up temporary files
      if (fs.existsSync(tempPngPath)) fs.unlinkSync(tempPngPath);
      if (fs.existsSync(tempWebpPath)) fs.unlinkSync(tempWebpPath);
    }
  });

  // Apply all replacements to the SVG content
  replacements.forEach(rep => {
    content = content.replace(rep.oldString, rep.newString);
  });

  // Save the optimized SVG
  const tempSvgPath = path.join(brandingDir, `temp_optimized_${file}`);
  fs.writeFileSync(tempSvgPath, content, 'utf8');

  // Replace original file
  fs.unlinkSync(filePath);
  fs.renameSync(tempSvgPath, filePath);

  const finalSize = fs.statSync(filePath).size;
  const savings = ((initialSize - finalSize) / initialSize * 100).toFixed(1);
  console.log(`Finished ${file}. New size: ${formatBytes(finalSize)} (Reduced by ${savings}%)`);
});

// Clean up any remaining extracted PNG/WebP files from previous steps
const filesToClean = fs.readdirSync(brandingDir);
filesToClean.forEach(f => {
  if (f.endsWith('.png') || f.endsWith('.webp')) {
    const p = path.join(brandingDir, f);
    fs.unlinkSync(p);
  }
});

console.log('\n--- Branding SVG Optimization Complete! ---');
