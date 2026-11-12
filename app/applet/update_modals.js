const fs = require('fs');
const path = require('path');

const dir = './components';
fs.readdirSync(dir).forEach(file => {
  if (!file.endsWith('.tsx')) return;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let updated = content.replace(
    /className="([^"]*?fixed\s+inset-0\s+bg-black[^"]*?)"/g,
    (match, cls) => {
      if (!cls.includes('backdrop-blur')) {
        return `className="${cls} backdrop-blur-sm"`;
      }
      return match;
    }
  );
  
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated ${file}`);
  }
});
