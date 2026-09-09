#!/usr/bin/env node

/**
 * RhyRhy English - Modular Popcorn Lesson Scaffolding CLI
 *
 * Usage:
 *   npm run popcorn --type conversation
 *   npm run popcorn --type conversation --expression "on the fly"
 *   node scripts/scaffold-popcorn.js --type conversation
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const POPCORN_DIR = path.join(ROOT_DIR, 'popcorn');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates', 'popcorn');
const METADATA_PATH = path.join(POPCORN_DIR, 'metadata.json');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: 'conversation',
    expression: '',
    title: ''
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--type' && args[i + 1]) {
      options.type = args[++i].toLowerCase().trim();
    } else if (arg.startsWith('--type=')) {
      options.type = arg.split('=')[1].toLowerCase().trim();
    } else if (arg === '--expression' && args[i + 1]) {
      options.expression = args[++i].trim();
    } else if (arg.startsWith('--expression=')) {
      options.expression = arg.split('=')[1].trim();
    } else if (arg === '--title' && args[i + 1]) {
      options.title = args[++i].trim();
    } else if (arg.startsWith('--title=')) {
      options.title = arg.split('=')[1].trim();
    }
  }

  return options;
}

function getAvailableTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) return [];
  return fs.readdirSync(TEMPLATES_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.basename(file, '.md'));
}

function loadMetadata() {
  if (!fs.existsSync(METADATA_PATH)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(METADATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('⚠️  Failed to parse popcorn/metadata.json. Initializing empty list.', err.message);
    return [];
  }
}

function saveMetadata(data) {
  fs.writeFileSync(METADATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function getNextId(metadata, typeDir) {
  let maxNum = 0;

  // 1. Scan metadata
  for (const item of metadata) {
    const m = (item.id || '').match(/popcorn-(\d+)/i);
    if (m) {
      const num = parseInt(m[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  // 2. Scan disk files
  if (fs.existsSync(typeDir)) {
    const files = fs.readdirSync(typeDir);
    for (const file of files) {
      const m = file.match(/popcorn-(\d+)\.md$/i);
      if (m) {
        const num = parseInt(m[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `popcorn-${String(nextNum).padStart(3, '0')}`;
}

function main() {
  const options = parseArgs();
  const availableTemplates = getAvailableTemplates();

  if (!availableTemplates.includes(options.type)) {
    console.error(`❌ Unknown lesson type: "${options.type}"`);
    console.error(`Available types in templates/popcorn/: ${availableTemplates.join(', ')}`);
    process.exit(1);
  }

  const templatePath = path.join(TEMPLATES_DIR, `${options.type}.md`);
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template file not found: ${templatePath}`);
    process.exit(1);
  }

  const typeDir = path.join(POPCORN_DIR, options.type);
  if (!fs.existsSync(typeDir)) {
    fs.mkdirSync(typeDir, { recursive: true });
  }

  const metadata = loadMetadata();
  const nextId = getNextId(metadata, typeDir);

  const expression = options.expression || 'sample expression';
  const title = options.title || `${expression} (${options.type})`;

  let templateContent = fs.readFileSync(templatePath, 'utf-8');
  templateContent = templateContent
    .replace(/\{ID\}/g, nextId)
    .replace(/\{EXPRESSION\}/g, expression)
    .replace(/\{TITLE\}/g, title);

  const newFileName = `${nextId}.md`;
  const newFilePath = path.join(typeDir, newFileName);

  fs.writeFileSync(newFilePath, templateContent, 'utf-8');

  // Update metadata.json
  const relativeFilePath = `${options.type}/${newFileName}`;
  metadata.push({
    id: nextId,
    type: options.type,
    expression: expression,
    title: title,
    file: relativeFilePath,
    createdAt: new Date().toISOString()
  });

  saveMetadata(metadata);

  console.log('🍿 Popcorn Lesson Scaffolded Successfully!');
  console.log(`   - ID:         ${nextId}`);
  console.log(`   - Type:       ${options.type}`);
  console.log(`   - Expression: ${expression}`);
  console.log(`   - File:       popcorn/${relativeFilePath}`);
  console.log(`   - Registry:   popcorn/metadata.json`);
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  getNextId
};
