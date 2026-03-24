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
const navBtn = `<a href="https://maps.app.goo.gl/f9twghMtnYGKgav76" target="_blank" rel="noopener noreferrer" class="nav-directions-btn" aria-label="Yol Tarifi Al"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-right:5px;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>Yol Tarifi</a>`;

let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('nav-directions-btn')) return; // already done

    // Find lang-switcher closing div and inject after it
    const marker = '</div>\n        </nav>';
    const marker2 = '</div>\n      </nav>';
    if (content.includes(marker)) {
        content = content.replace(marker, `</div>\n        ${navBtn}\n        </nav>`);
        fs.writeFileSync(file, content, 'utf8');
        count++; return;
    }
    if (content.includes(marker2)) {
        content = content.replace(marker2, `</div>\n      ${navBtn}\n      </nav>`);
        fs.writeFileSync(file, content, 'utf8');
        count++;
    }
});
console.log(`Injected nav directions button in ${count} files.`);
