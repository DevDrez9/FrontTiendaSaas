const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('http://localhost:3000')) {
    // Replace 'http://localhost:3000/path'
    content = content.replace(/'http:\/\/localhost:3000([^']*)'/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:3000\'}$1`');
    // Replace `http://localhost:3000/path`
    content = content.replace(/`http:\/\/localhost:3000([^`]*)`/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:3000\'}$1`');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
