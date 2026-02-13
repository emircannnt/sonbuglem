const fs = require('fs');
const path = require('path');

const WEB_DIR = path.join('assets', 'web');
const INDEX_PATH = path.join(WEB_DIR, 'index.html');
const OUTPUT_PATH = path.join(WEB_DIR, 'bundled_index.html');

function getBase64Image(imgPath) {
    try {
        const fileData = fs.readFileSync(imgPath);
        return fileData.toString('base64');
    } catch (e) {
        console.error(`Error encoding image ${imgPath}:`, e);
        return '';
    }
}

function inlineAssets(htmlContent, baseDir) {
    // Inline CSS
    htmlContent = htmlContent.replace(/<link\s+rel="stylesheet"\s+href="([^"]+)">/g, (match, href) => {
        const cssPath = path.join(baseDir, href);
        if (fs.existsSync(cssPath)) {
            const css = fs.readFileSync(cssPath, 'utf8');
            return `<style>\n${css}\n</style>`;
        }
        return match;
    });

    // Inline JS
    htmlContent = htmlContent.replace(/<script\s+src="([^"]+)"><\/script>/g, (match, src) => {
        const jsPath = path.join(baseDir, src);
        if (fs.existsSync(jsPath)) {
            const js = fs.readFileSync(jsPath, 'utf8');
            // Check for specific strings that might break embedding (like </script>)
            // But usually this regex replacement is safe enough for standard JS files.
            return `<script>\n${js}\n</script>`;
        }
        return match;
    });

    // Inline Images
    htmlContent = htmlContent.replace(/src="([^"]+\.(?:png|jpg|jpeg|svg))"/g, (match, src) => {
        if (src.startsWith('data:') || src.startsWith('http')) return match;

        const imgPath = path.join(baseDir, src);
        if (fs.existsSync(imgPath)) {
            const ext = path.extname(src).substring(1).toLowerCase();
            let mimeType = 'image/png';
            if (ext === 'jpeg' || ext === 'jpg') mimeType = 'image/jpeg';
            if (ext === 'svg') mimeType = 'image/svg+xml';

            const b64 = getBase64Image(imgPath);
            return `src="data:${mimeType};base64,${b64}"`;
        }
        return match;
    });

    return htmlContent;
}

if (!fs.existsSync(INDEX_PATH)) {
    console.error(`Error: ${INDEX_PATH} not found.`);
    process.exit(1);
}

const html = fs.readFileSync(INDEX_PATH, 'utf8');
const bundled = inlineAssets(html, WEB_DIR);

fs.writeFileSync(OUTPUT_PATH, bundled, 'utf8');
console.log(`Bundled HTML saved to ${OUTPUT_PATH}`);
