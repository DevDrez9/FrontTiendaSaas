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
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src', 'Pages', 'Storefront'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  if (content.includes('<img ')) {
    if (!content.includes('fixImageUrl')) {
      // Find the last import
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLastImport = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLastImport) + '\nimport { fixImageUrl } from \'../../config/api\';' + content.slice(endOfLastImport);
      } else {
        content = 'import { fixImageUrl } from \'../../config/api\';\n' + content;
      }
    }
    
    // Naive replace for known patterns
    content = content.replace(/src=\{producto\.imagenUrl\}/g, 'src={fixImageUrl(producto.imagenUrl)}');
    content = content.replace(/src=\{config\.logoUrl\}/g, 'src={fixImageUrl(config.logoUrl)}');
    content = content.replace(/src=\{activeImage\}/g, 'src={fixImageUrl(activeImage)}');
    content = content.replace(/src=\{img\.url\}/g, 'src={fixImageUrl(img.url)}');
    content = content.replace(/src=\{p\.imagenUrl\}/g, 'src={fixImageUrl(p.imagenUrl)}');
    content = content.replace(/src=\{config\?\.logoUrl\}/g, 'src={fixImageUrl(config?.logoUrl)}');
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed', file);
    }
  }
});
