const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components'];
const regex = /\brounded-(md|lg|xl|2xl|3xl)\b/g;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

let modifiedFiles = 0;

targetDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) return;
  
  const files = walk(dirPath);
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (regex.test(content)) {
      const newContent = content.replace(regex, 'rounded-sm');
      fs.writeFileSync(file, newContent, 'utf8');
      modifiedFiles++;
      console.log(`Updated ${file}`);
    }
  });
});

console.log(`Done! Modified ${modifiedFiles} files.`);
