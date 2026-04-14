const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'index.html',
  'projeler.html',
  'hakkimizda.html',
  'iletisim.html',
  'hizmetler.html',
  'tasarim.html',
  'galeri.html',
  'kurumsal.html'
];

const topBarHTML = `
    <!-- Header -->
    <header class="header">
      <div class="top-bar">
        <div class="container top-bar-container">
          <div class="top-bar-left">
            <a href="mailto:erolsuzen@hotmail.com">✉️ erolsuzen@hotmail.com</a>
            <a href="tel:+905324052877">📞 +90 532 405 28 77</a>
          </div>
          <div class="top-bar-right">
            <a href="https://maps.app.goo.gl/f9twghMtnYGKgav76" target="_blank" rel="noopener noreferrer">📍 Yol Tarifi Al</a>
            <div class="top-bar-lang">
              <a href="#" class="active" title="TR"><img src="https://flagcdn.com/w80/tr.png" width="16" height="11" alt="TR"></a>
              <a href="en/index.html" title="EN"><img src="https://flagcdn.com/w80/gb.png" width="16" height="11" alt="EN"></a>
            </div>
          </div>
        </div>
      </div>`;

for (const file of filesToProcess) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Insert top-bar
  content = content.replace(/<!-- Header -->\s*<header class="header">/, topBarHTML);

  // Remove nav-directions-btn and lang-switcher
  content = content.replace(/<a href="[^"]*"[^>]*class="nav-directions-btn"[\s\S]*?<\/a>\s*/gi, '');
  content = content.replace(/<div class="lang-switcher">[\s\S]*?<\/div>\s*/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
}
