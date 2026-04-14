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

for (const file of filesToProcess) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Move nav-design-btn from AFTER menu-toggle to BEFORE menu-toggle (right of nav links)
  // Pattern: </ul><button class="menu-toggle"...>...</button> <a ...nav-design-btn...>...</a>
  // We want: </ul> <a ...nav-design-btn...>...</a> <button class="menu-toggle"...>...</button>

  // Extract the nav-design-btn anchor
  const designBtnMatch = content.match(/<a\s[^>]*class="nav-design-btn"[^>]*>[\s\S]*?<\/a>/);
  if (!designBtnMatch) {
    console.log(`No nav-design-btn found in ${file}, skipping.`);
    continue;
  }
  const designBtnHTML = designBtnMatch[0];

  // Remove it from its current position
  content = content.replace(designBtnHTML, '');

  // Insert it BEFORE the menu-toggle button
  content = content.replace(
    /<button class="menu-toggle"/,
    designBtnHTML + '\n          <button class="menu-toggle"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
