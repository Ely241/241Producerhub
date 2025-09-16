
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const assetsDir = path.join(__dirname, '../../src/assets');
const outputDir = path.join(__dirname, '../../public/assets-optimized');

async function optimizeImages(dir: string, outDir: string) {
  try {
    await fs.mkdir(outDir, { recursive: true });
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(dir, entry.name);
      const outPath = path.join(outDir, entry.name);

      if (entry.isDirectory()) {
        await optimizeImages(srcPath, outPath);
      } else if (entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name)) {
        const newPath = outPath.replace(/\.[^/.]+$/, ".webp");
        console.log(`Optimizing ${srcPath} -> ${newPath}`);
        await sharp(srcPath)
          .webp({ quality: 80 })
          .toFile(newPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

console.log('Starting image optimization...');
optimizeImages(assetsDir, outputDir)
  .then(() => {
    console.log('Image optimization complete!');
  })
  .catch(error => {
    console.error('Image optimization failed:', error);
  });
