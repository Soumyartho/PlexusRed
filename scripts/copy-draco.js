// Copies the Draco decoder binaries from the installed `three` package into
// /public/draco so useGLTF.setDecoderPath('/draco/') resolves locally and we
// avoid a remote CDN round-trip during WebGL startup (PRD §5.1 / §7.3).
import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'node_modules', 'three', 'examples', 'jsm', 'libs', 'draco');
const dest = join(root, 'public', 'draco');

try {
  if (!existsSync(src)) {
    console.warn('[copy-draco] source not found, skipping:', src);
    process.exit(0);
  }
  mkdirSync(dest, { recursive: true });

  const copyDir = (from, to) => {
    mkdirSync(to, { recursive: true });
    for (const entry of readdirSync(from, { withFileTypes: true })) {
      const f = join(from, entry.name);
      const t = join(to, entry.name);
      if (entry.isDirectory()) copyDir(f, t);
      else copyFileSync(f, t);
    }
  };

  copyDir(src, dest);
  console.log('[copy-draco] Draco decoder copied to public/draco/');
} catch (err) {
  console.warn('[copy-draco] failed (non-fatal):', err.message);
}
