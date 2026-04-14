const fs = require('fs');
const path = require('path');

const enFiles = [
  'en/index.html',
  'en/contact.html',
  'en/corporate.html',
  'en/gallery.html'
];

const enServicesFiles = [
  'en/services/facade.html',
  'en/services/laminate.html',
  'en/services/roofing.html',
  'en/services/solar.html'
];

function processFile(filePath, level) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const assetsPath = level === 1 ? '../' : '../../';
  const trHomePath = level === 1 ? '../index.html' : '../../index.html';
  const enHomePath = level === 1 ? 'index.html' : '../index.html';

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
            <div class="top-bar-lang">
              <a href="${trHomePath}" title="TR"><img src="https://flagcdn.com/w80/tr.png" width="16" height="11" alt="TR"></a>
              <a href="${enHomePath}" class="active" title="EN"><img src="https://flagcdn.com/w80/gb.png" width="16" height="11" alt="EN"></a>
            </div>
          </div>
        </div>
      </div>`;

  // 1. Inject Top Bar
  content = content.replace(/<!-- Header -->\s*<header class="header">|<header class="header">/, topBarHTML);

  // 2. Remove old nav elements
  content = content.replace(/<a href="[^"]*"[^>]*class="nav-directions-btn"[\s\S]*?<\/a>\s*/gi, '');
  content = content.replace(/<div class="lang-switcher">[\s\S]*?<\/div>/gi, '');

  // 3. Move nav-design-btn before menu-toggle
  const designBtnMatch = content.match(/<a\s[^>]*class="nav-design-btn"[^>]*>[\s\S]*?<\/a>/);
  if (designBtnMatch) {
    const designBtnHTML = designBtnMatch[0];
    content = content.replace(designBtnHTML, '');
    content = content.replace(/<button class="menu-toggle"/, designBtnHTML + '\n          <button class="menu-toggle"');
  }

  // 4. Update Maps Float Button (only in en/*.html files, services might not need it or needs different path)
  const mapsFloatBtn = `
  <!-- Maps Float Button (Desktop Only) -->
  <a href="https://maps.app.goo.gl/f9twghMtnYGKgav76" target="_blank" rel="noopener noreferrer"
     class="maps-float" aria-label="Get Directions">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  </a>`;

  if (!content.includes('maps-float') && content.includes('whatsapp-float')) {
    content = content.replace(/\s*<!-- WhatsApp Float Button -->/, `\n${mapsFloatBtn}\n\n  <!-- WhatsApp Float Button -->`);
  }

  // 5. Update Firsat Float Link
  const firsatLink = assetsPath + 'index.html#firsat-urunleri';
  content = content.replace(/href="\.\.\/index\.html#firsat-urunleri"/g, `href="${firsatLink}"`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Synced ${filePath}`);
}

enFiles.forEach(f => processFile(f, 1));
enServicesFiles.forEach(f => processFile(f, 2));
