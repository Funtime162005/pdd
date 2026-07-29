const fs = require('fs');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  // Find where line 280 (or PICTURE_GAME_POOLS) ends and CULTURE_DATA begins
  const newLines = [];
  let skipping = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("kannada: build5000PictureQuestions('kannada')")) {
      newLines.push(line);
      newLines.push('};');
      skipping = true;
      continue;
    }
    if (skipping) {
      if (line.includes('export const CULTURE_DATA')) {
        skipping = false;
        newLines.push('');
        newLines.push(line);
      }
      continue;
    }
    newLines.push(line);
  }

  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  console.log(`Fixed ${filePath}`);
}

fixFile('c:\\Users\\dines\\Downloads\\Deebak Client\\constants\\translations.ts');
fixFile('c:\\Users\\dines\\Downloads\\Deebak Client\\nri-language-learning-main\\constants\\translations.ts');
