const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..'); // Points to C:\Users\Yvesj\Documents\jyls-241-beats-blast-main
const backendDir = path.resolve(__dirname, '..'); // Points to C:\Users\Yvesj\Documents\jyls-241-beats-blast-main\backend

const publicAssetsDir = path.join(backendDir, 'dist', 'public_assets'); // Points to backend/dist/public_assets

const assetsToCopy = [
    { src: path.join(projectRoot, 'src', 'assets', 'audio'), dest: path.join(publicAssetsDir, 'audio') },
    { src: path.join(projectRoot, 'src', 'assets', '6trece'), dest: path.join(publicAssetsDir, '6trece') },
    { src: path.join(projectRoot, 'src', 'assets', 'images'), dest: path.join(publicAssetsDir, 'images') },
    { src: path.join(projectRoot, 'public', 'assets-optimized', 'image'), dest: path.join(publicAssetsDir, 'assets-optimized', 'image') },
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
    copyRecursiveSync(src, dest);
});