const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..', '..'); // Points to backend/
const distDir = path.join(baseDir, 'dist'); // Points to backend/dist/

const assetsToCopy = [
    { src: path.join(baseDir, 'src', 'assets', 'audio'), dest: path.join(distDir, 'backend', 'src', 'assets', 'audio') },
    { src: path.join(baseDir, 'src', 'assets', '6trece'), dest: path.join(distDir, 'backend', 'src', 'assets', '6trece') },
    { src: path.join(baseDir, 'src', 'assets', 'images'), dest: path.join(distDir, 'backend', 'src', 'assets', 'images') },
    { src: path.join(baseDir, 'public', 'assets-optimized', 'image'), dest: path.join(distDir, 'backend', 'public', 'assets-optimized', 'image') },
    { src: path.join(process.cwd(), 'test.txt'), dest: path.join(distDir, 'test.txt') }, // New test file
];

const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        ensureDirExists(dest);
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName),
                             path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

assetsToCopy.forEach(({ src, dest }) => {
    console.log(`Copying from ${src} to ${dest}`);
    copyRecursiveSync(src, dest);
});

console.log('Asset copying complete.');