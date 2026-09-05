#!/usr/bin/env node

/**
 * RhyRhy English - Zero-Dependency Production Build & Asset Hashing Pipeline
 * 
 * Implements Issue #3 (Maximize Browser Caching):
 * - Generates unique SHA-256 content hashes (suffixes) for CSS and JS assets.
 * - Rewrites asset links in all HTML files to point to hashed filenames.
 * - Injects no-cache meta tags into HTML files for immediate deployment delivery.
 * - Updates Service Worker (dist/sw.js) cache name and pre-cached asset manifest.
 * - Copies static media, manifests, and deployment configuration to dist/.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const NO_CACHE_META_TAGS = `
  <!-- Cache Control (Issue #3: Maximize Browser Caching) -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">`;

/**
 * Computes an 8-character hex content hash for a buffer or string
 */
function getContentHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 8);
}

/**
 * Recursively copies a directory
 */
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Recursively finds all files with given extensions
 */
function findFilesByExt(dir, extList) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findFilesByExt(fullPath, extList));
    } else if (extList.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

function build() {
  const startTime = Date.now();
  console.log('🚀 Starting RhyRhy English Production Build & Asset Hashing...');

  // 1. Clean & Recreate dist/ directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  const hashMap = {}; // e.g. { 'main.css': { hashedName: 'main.a1b2c3d4.css', hash: 'a1b2c3d4' } }
  const allHashes = [];

  // 2. Hash & Process CSS files
  const cssSrcDir = path.join(ROOT_DIR, 'css');
  const cssDistDir = path.join(DIST_DIR, 'css');
  fs.mkdirSync(cssDistDir, { recursive: true });

  if (fs.existsSync(cssSrcDir)) {
    const cssFiles = fs.readdirSync(cssSrcDir).filter(f => f.endsWith('.css'));
    for (const file of cssFiles) {
      const filePath = path.join(cssSrcDir, file);
      const content = fs.readFileSync(filePath);
      const hash = getContentHash(content);
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const hashedName = `${base}.${hash}${ext}`;

      // Write both hashed version and unhashed fallback
      fs.writeFileSync(path.join(cssDistDir, hashedName), content);
      fs.writeFileSync(path.join(cssDistDir, file), content);

      hashMap[file] = {
        original: file,
        hashed: hashedName,
        hash,
        type: 'css',
        size: content.length
      };
      allHashes.push(hash);
      console.log(`  📦 CSS: css/${file} -> css/${hashedName}`);
    }
  }

  // 3. Hash & Process JS files
  const jsSrcDir = path.join(ROOT_DIR, 'js');
  const jsDistDir = path.join(DIST_DIR, 'js');
  fs.mkdirSync(jsDistDir, { recursive: true });

  if (fs.existsSync(jsSrcDir)) {
    const jsFiles = fs.readdirSync(jsSrcDir).filter(f => f.endsWith('.js'));
    for (const file of jsFiles) {
      const filePath = path.join(jsSrcDir, file);
      const content = fs.readFileSync(filePath);
      const hash = getContentHash(content);
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const hashedName = `${base}.${hash}${ext}`;

      // Write both hashed version and unhashed fallback
      fs.writeFileSync(path.join(jsDistDir, hashedName), content);
      fs.writeFileSync(path.join(jsDistDir, file), content);

      hashMap[file] = {
        original: file,
        hashed: hashedName,
        hash,
        type: 'js',
        size: content.length
      };
      allHashes.push(hash);
      console.log(`  📦 JS:  js/${file} -> js/${hashedName}`);
    }
  }

  // Global Build Hash derived from all asset hashes
  const globalBuildHash = getContentHash(allHashes.sort().join(''));
  console.log(`\n  🔑 Global Build Hash: ${globalBuildHash}`);

  // 4. Copy Static Assets, Lessons, and Config Directories
  const dirsToCopy = ['assets', 'lessons', 'templates'];
  for (const dirName of dirsToCopy) {
    const src = path.join(ROOT_DIR, dirName);
    const dest = path.join(DIST_DIR, dirName);
    if (fs.existsSync(src)) {
      copyDirSync(src, dest);
      console.log(`  📂 Copied directory: ${dirName}/`);
    }
  }

  // Copy Root Files
  const rootFilesToCopy = ['manifest.webmanifest', 'CNAME', '.nojekyll', '_headers', 'LICENSE', 'README.md'];
  for (const fileName of rootFilesToCopy) {
    const src = path.join(ROOT_DIR, fileName);
    const dest = path.join(DIST_DIR, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  📄 Copied root file: ${fileName}`);
    }
  }

  // Copy root HTML files
  const rootHtmlFiles = ['index.html', 'lessons.html'];
  for (const htmlFile of rootHtmlFiles) {
    const src = path.join(ROOT_DIR, htmlFile);
    const dest = path.join(DIST_DIR, htmlFile);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  // 5. Rewrite Asset References & Inject No-Cache Meta in all HTML files in dist/
  const htmlFiles = findFilesByExt(DIST_DIR, ['.html']);
  console.log(`\n  🔧 Processing ${htmlFiles.length} HTML files...`);

  for (const htmlPath of htmlFiles) {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // A. Rewrite CSS links
    for (const [origFile, info] of Object.entries(hashMap)) {
      if (info.type === 'css') {
        // Match href="...css/filename.css"
        const cssRegex = new RegExp(`(href=["'][^"']*css/)${origFile}(["'])`, 'g');
        htmlContent = htmlContent.replace(cssRegex, `$1${info.hashed}$2`);
      } else if (info.type === 'js') {
        // Match src="...js/filename.js"
        const jsRegex = new RegExp(`(src=["'][^"']*js/)${origFile}(["'])`, 'g');
        htmlContent = htmlContent.replace(jsRegex, `$1${info.hashed}$2`);
      }
    }

    // B. Inject No-Cache Meta tags into <head> if not already present
    if (!htmlContent.includes('http-equiv="Cache-Control"') && htmlContent.includes('<head>')) {
      htmlContent = htmlContent.replace('<head>', `<head>${NO_CACHE_META_TAGS}`);
    }

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    const relPath = path.relative(DIST_DIR, htmlPath);
    console.log(`     ✅ Rewritten: ${relPath}`);
  }

  // 6. Process Service Worker (dist/sw.js)
  const swSrcPath = path.join(ROOT_DIR, 'sw.js');
  const swDistPath = path.join(DIST_DIR, 'sw.js');

  if (fs.existsSync(swSrcPath)) {
    let swContent = fs.readFileSync(swSrcPath, 'utf8');

    // Update CACHE_NAME to include the build hash
    swContent = swContent.replace(
      /const CACHE_NAME = ['"][^'"]+['"];/,
      `const CACHE_NAME = 'rhyrhy-cache-${globalBuildHash}';`
    );

    // Update STATIC_ASSETS array in sw.js with hashed CSS and JS filenames
    for (const [origFile, info] of Object.entries(hashMap)) {
      if (info.type === 'css') {
        swContent = swContent.replace(
          new RegExp(`'\\./css/${origFile}'`, 'g'),
          `'./css/${info.hashed}'`
        );
      } else if (info.type === 'js') {
        swContent = swContent.replace(
          new RegExp(`'\\./js/${origFile}'`, 'g'),
          `'./js/${info.hashed}'`
        );
      }
    }

    // Enforce no-cache fetch in navigation requests
    swContent = swContent.replace(
      /fetch\(event\.request\)/g,
      `fetch(new Request(event.request, { cache: 'no-cache' }))`
    );

    fs.writeFileSync(swDistPath, swContent, 'utf8');
    console.log(`  ⚙️  Service Worker: dist/sw.js updated with cache rhyrhy-cache-${globalBuildHash}`);
  }

  // 7. Write build-manifest.json
  const manifest = {
    buildTime: new Date().toISOString(),
    buildHash: globalBuildHash,
    assets: hashMap
  };
  fs.writeFileSync(path.join(DIST_DIR, 'build-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('  📋 Generated: dist/build-manifest.json');

  const elapsed = Date.now() - startTime;
  console.log(`\n✨ Production build completed successfully in ${elapsed}ms!\n`);
}

if (require.main === module) {
  build();
}

module.exports = { build };
