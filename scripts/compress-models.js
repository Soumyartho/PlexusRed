const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '../public/models');

const modelsToOptimize = [
  {
    filename: 'sci-_fi_surveillance_drone.glb',
    options: '--compress draco --texture-compress webp',
    resizeWidth: null
  },
  {
    filename: 'd.s.e.v._drone.glb',
    options: '--compress draco --texture-compress webp',
    resizeWidth: null
  },
  {
    filename: 'bot_mecha_warrior_3d_by_oscar_creativo.glb',
    options: '--compress draco --texture-compress webp',
    resizeWidth: 512 // Complex model, resize textures to 512px first
  }
];

function runCommand(cmd) {
  console.log(`Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${cmd}`, error.message);
    throw error;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('--- starting GLB Model Optimization ---');

modelsToOptimize.forEach((model) => {
  const inputPath = path.join(MODELS_DIR, model.filename);
  if (!fs.existsSync(inputPath)) {
    console.warn(`File not found: ${model.filename}, skipping.`);
    return;
  }

  const initialSize = fs.statSync(inputPath).size;
  console.log(`\nOptimizing ${model.filename} (Initial size: ${formatBytes(initialSize)})...`);

  const tempPath = path.join(MODELS_DIR, `temp_${model.filename}`);
  const outputPath = path.join(MODELS_DIR, `optimized_${model.filename}`);

  try {
    let currentInput = inputPath;

    // Step 1: Resize textures if required
    if (model.resizeWidth) {
      console.log(`Resizing textures to ${model.resizeWidth}x${model.resizeWidth}...`);
      runCommand(`npx @gltf-transform/cli resize "${inputPath}" "${tempPath}" --width ${model.resizeWidth} --height ${model.resizeWidth}`);
      currentInput = tempPath;
    }

    // Step 2: Optimize (Draco compression + WebP textures)
    console.log('Applying Draco and WebP compression...');
    runCommand(`npx @gltf-transform/cli optimize "${currentInput}" "${outputPath}" ${model.options}`);

    // Clean up temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    // Replace original file with optimized one
    const finalSize = fs.statSync(outputPath).size;
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);

    const savings = ((initialSize - finalSize) / initialSize * 100).toFixed(1);
    console.log(`Successfully optimized ${model.filename}!`);
    console.log(`Final size: ${formatBytes(finalSize)} (Reduced by ${savings}%)`);

  } catch (error) {
    console.error(`Failed to optimize ${model.filename}. Retaining original file.`);
    // Cleanup any temporary files left behind
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
});

console.log('\n--- Optimization complete! ---');
