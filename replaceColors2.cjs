const fs = require('fs');
const path = require('path');

const dir = 'src';

const replacements = [
  { pattern: /bg-\[\#050A14\]/g, replacement: 'bg-bg-primary' },
  { pattern: /bg-\[\#0A1628\]/g, replacement: 'bg-bg-secondary' },
  { pattern: /bg-\[\#0D1E35\]/g, replacement: 'bg-bg-card' },
  { pattern: /bg-\[\#0D1E35\]\/80/g, replacement: 'bg-bg-card/80' },
  { pattern: /bg-\[\#0D1E35\]\/95/g, replacement: 'bg-bg-card/95' },
  { pattern: /bg-\[\#050A14\]\/80/g, replacement: 'bg-bg-primary/80' },
  { pattern: /bg-\[\#050A14\]\/98/g, replacement: 'bg-bg-primary/98' },
  
  { pattern: /border-\[rgba\(14,165,233,0\.15\)\]/g, replacement: 'border-border-d' },
  { pattern: /border-\[rgba\(14,165,233,0\.3\)\]/g, replacement: 'border-border-h' },
  { pattern: /border-\[rgba\(14,165,233,0\.1\)\]/g, replacement: 'border-border-d' },
  { pattern: /border-\[rgba\(14,165,233,0\.2\)\]/g, replacement: 'border-border-h' },
  { pattern: /border-\[rgba\(14,165,233,0\.4\)\]/g, replacement: 'border-border-strong' },
  
  { pattern: /shadow-\[0_0_30px_rgba\(14,165,233,0\.1\)\]/g, replacement: 'shadow-glow-sm' },
  { pattern: /shadow-\[0_0_20px_rgba\(14,165,233,0\.3\)\]/g, replacement: 'shadow-glow' },
  { pattern: /shadow-\[0_0_20px_rgba\(14,165,233,0\.15\)\]/g, replacement: 'shadow-glow-sm' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const replace of replacements) {
        content = content.replace(replace.pattern, replace.replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(dir);
