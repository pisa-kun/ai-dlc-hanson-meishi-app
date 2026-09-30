import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIRS = [
  'web/public/images/gallery',
  'web/public/images/hobby',
  'web/public/images/portfolio',
];
const MAX_WIDTH = 800;
const JPEG_QUALITY = 75;
const PNG_QUALITY = 80;

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const info = await stat(filePath);
  if (info.size < 200_000) return; // skip already small files

  const img = sharp(filePath);
  const meta = await img.metadata();
  
  let pipeline = img;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH);
  }

  if (ext === '.png') {
    pipeline = pipeline.png({ quality: PNG_QUALITY });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY });
  }

  const buf = await pipeline.toBuffer();
  const { writeFile } = await import('node:fs/promises');
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, buf);
  const { rename, unlink } = await import('node:fs/promises');
  try { await unlink(filePath); } catch {}
  await rename(tmpPath, filePath);
  console.log(`  ${path.basename(filePath)}: ${(info.size/1024).toFixed(0)}KB -> ${(buf.length/1024).toFixed(0)}KB`);
}

for (const dir of DIRS) {
  const fullDir = path.resolve(dir);
  let files;
  try { files = await readdir(fullDir); } catch { continue; }
  console.log(`\nOptimizing: ${dir}`);
  for (const f of files) {
    await optimizeFile(path.join(fullDir, f));
  }
}

// Also optimize icon.jpg
const iconPath = path.resolve('web/public/images/icon.jpg');
try {
  console.log('\nOptimizing: icon.jpg');
  await optimizeFile(iconPath);
} catch {}

console.log('\nDone!');
