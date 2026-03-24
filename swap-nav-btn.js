const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.html')) results.push(file);
        }
    });
    return results;
}

const files = walk('.');
let count = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('nav-directions-btn')) return;

    // Find the nav-directions-btn link line and remove it from current location
    const btnRegex = /\s*<a[^>]*class="nav-directions-btn"[^>]*>.*?<\/a>\s*/s;
    const btnMatch = content.match(btnRegex);
    if (!btnMatch) return;

    const btnHtml = btnMatch[0].trim();
    // Remove the button from its current position
    content = content.replace(btnRegex, '\n');

    // Insert it BEFORE the lang-switcher div
    const langMarker = '<div class="lang-switcher">';
    if (content.includes(langMarker)) {
        content = content.replace(langMarker, btnHtml + '\n        ' + langMarker);
        fs.writeFileSync(file, content, 'utf8');
        count++;
    }
});

console.log(`Swapped positions in ${count} files.`);
