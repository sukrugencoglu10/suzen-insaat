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
let c = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const target = 'Mustafa Kemal Paşa Mah. Ata Cd. No: 20/A, Fatsa/Ordu</a></li>';
    const numMatches = content.split(target).length - 1;
    if (numMatches > 0) {
        const replacement = Object.values({
            0: 'Mustafa Kemal Paşa Mah. Ata Cd. No: 20/A, Fatsa/Ordu</a><br><a href="https://maps.app.goo.gl/f9twghMtnYGKgav76" target="_blank" rel="noopener noreferrer" style="color: var(--red-600); font-weight: 600; font-size: 0.9em; display: inline-block; margin-top: 4px;">➔ Yol Tarifi Al</a></li>'
        })[0];
        content = content.replaceAll(target, replacement);
        fs.writeFileSync(file, content, 'utf8');
        c++;
    }
});
console.log(`Replaced in ${c} files`);
