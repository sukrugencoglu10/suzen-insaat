const fs = require('fs');
const path = require('path');

const trFiles = [
  'index.html', 'projeler.html', 'hakkimizda.html', 'iletisim.html', 'hizmetler.html', 'tasarim.html', 'galeri.html', 'kurumsal.html'
];
const enFiles = [
  'en/index.html', 'en/contact.html', 'en/corporate.html', 'en/gallery.html',
  'en/services/facade.html', 'en/services/laminate.html', 'en/services/roofing.html', 'en/services/solar.html'
];

function addAttribute(filePath, tooltipText) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the maps-float anchor and add data-tooltip if not present
  if (content.includes('class="maps-float"') && !content.includes('data-tooltip')) {
    content = content.replace(
      /class="maps-float"/,
      `class="maps-float"\n     data-tooltip="${tooltipText}"`
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

trFiles.forEach(f => addAttribute(path.join(__dirname, f), 'Yol Tarifi'));
enFiles.forEach(f => addAttribute(path.join(__dirname, f), 'Get Directions'));
