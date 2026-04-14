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

const mapsFloatBtn = `
  <!-- Maps Float Button (Desktop Only) -->
  <a href="https://maps.app.goo.gl/f9twghMtnYGKgav76" target="_blank" rel="noopener noreferrer"
     class="maps-float" aria-label="Yol Tarifi Al">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  </a>`;

for (const file of filesToProcess) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove Yol Tarifi from top-bar
  content = content.replace(
    /<a href="https:\/\/maps\.app\.goo\.gl[^"]*"[^>]*>📍 Yol Tarifi Al<\/a>\s*/g,
    ''
  );

  // Add maps float button before WhatsApp float button (if not already present)
  if (!content.includes('maps-float') && content.includes('whatsapp-float')) {
    content = content.replace(
      /\s*<!-- WhatsApp Float Button -->/,
      `\n${mapsFloatBtn}\n\n  <!-- WhatsApp Float Button -->`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
