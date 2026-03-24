const fs = require('fs');
const path = require('path');

const dir = 'src';

const replacements = [
  { pattern: /bg-\[\#020B18\]/g, replacement: 'bg-bg-primary' },
  { pattern: /bg-navy-950/g, replacement: 'bg-bg-primary' },
  { pattern: /bg-\[\#040F20\]/g, replacement: 'bg-bg-secondary' },
  { pattern: /bg-navy-900/g, replacement: 'bg-bg-secondary' },
  { pattern: /bg-\[\#061428\]/g, replacement: 'bg-bg-card' },
  { pattern: /bg-navy-800/g, replacement: 'bg-bg-card' },
  { pattern: /bg-\[\#0A1E40\]/g, replacement: 'bg-bg-card hover:bg-bg-card-hover' },
  { pattern: /bg-white\/\[0\.04\]/g, replacement: 'bg-bg-glass' },
  { pattern: /text-\[\#EEF4FF\]/g, replacement: 'text-text-primary' },
  { pattern: /text-slate-100/g, replacement: 'text-text-primary' },
  { pattern: /text-\[\#A8C4E8\]/g, replacement: 'text-text-secondary' },
  { pattern: /text-slate-200/g, replacement: 'text-text-secondary' },
  { pattern: /text-\[\#5A7FA8\]/g, replacement: 'text-text-muted' },
  { pattern: /text-slate-400/g, replacement: 'text-text-muted' },
  { pattern: /text-\[\#2C4A6B\]/g, replacement: 'text-text-faint' },
  { pattern: /text-slate-600/g, replacement: 'text-text-faint' },
  { pattern: /border-\[rgba\(45,143,255,0\.18\)\]/g, replacement: 'border-border-d' },
  { pattern: /border-\[rgba\(45,143,255,0\.40\)\]/g, replacement: 'border-border-h' },
  { pattern: /border-\[rgba\(29,111,232,0\.18\)\]/g, replacement: 'border-border-d' },
  { pattern: /shadow-\[0_8px_32px_rgba\(29,111,232,0\.35\)\]/g, replacement: 'shadow-glow' },
  { pattern: /shadow-\[0_4px_16px_rgba\(29,111,232,0\.20\)\]/g, replacement: 'shadow-glow-sm' },
  { pattern: /from-\[\#1D6FE8\]\s+to-\[\#00D4FF\]/g, replacement: 'from-blue-500 to-accent-cyan dark:from-blue-600 dark:to-accent-cyan' }
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
