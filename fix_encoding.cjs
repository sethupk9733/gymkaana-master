import fs from 'fs';
import path from 'path';

const directory = './src';

function fixFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixFiles(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Remove BOM if it exists
            const fixedContent = content.replace(/^\uFEFF/, '');
            fs.writeFileSync(fullPath, fixedContent, 'utf8');
            console.log(`Fixed encoding for: ${fullPath}`);
        }
    });
}

fixFiles(directory);
const indexHtml = './index.html';
if (fs.existsSync(indexHtml)) {
    const content = fs.readFileSync(indexHtml, 'utf8').replace(/^\uFEFF/, '');
    fs.writeFileSync(indexHtml, content, 'utf8');
    console.log(`Fixed encoding for: index.html`);
}
