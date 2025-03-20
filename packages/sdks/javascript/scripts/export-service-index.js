const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '..', 'src', 'services');
const indexFile = path.join(servicesDir, 'index.ts');

// Get all .ts files except index.ts
const files = fs.readdirSync(servicesDir)
  .filter(file => file.endsWith('.ts') && file !== 'index.ts')
  .sort();

// Generate export statements
const exports = files.map(file => {
  const basename = path.basename(file, '.ts');
  return `export * from './${basename}';`;
}).join('\n');

// Write to index.ts
fs.writeFileSync(indexFile, exports + '\n');
