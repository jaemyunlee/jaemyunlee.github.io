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

// Curated curiosity headline mapping for Open Graph previews (Issue #6)
const CURATED_HEADLINES = {
  'lesson-01-1': '"우연히 ~하다" 원어민은 일상에서 어떻게 말할까요?',
  'lesson-01-2': '"당연히, 명백하게" 영어 대화에서 자연스럽게 쓰는 표현은?',
  'lesson-01-3': '"하늘석(맨 꼭대기 좌석)"을 영어로 뭐라고 할까요?',
  'lesson-01-4': '"시야(뷰)가 꽤 괜찮아요" 원어민 실생활 표현은?',
  'lesson-01-5': '"시야 방해석(제한석)"을 공연장 예매할 때 뭐라고 부를까요?',
  'lesson-01-6': '"가격이 꽤 괜찮네!" 원어민이 가장 즐겨쓰는 단어는?',
  'lesson-01-7': '"적어도 내가 알기로는" 영어로 자연스럽게 말하면?',
  'lesson-01-8': '"그 노래를 좋아하기 시작했어" 영어로 뭐라고 할까요?',
  'lesson-01-9': '"다리에 깁스를 하고 있어" 영어로 뭐라고 할까요?',
  'lesson-01-10': '"절대 갈 수 있는 방법이 없었죠" 원어민 빈출 강조 표현은?',
  'lesson-01-11': '"알고 보니 ~였어요" 일상에서 가장 많이 쓰는 구동사는?',
  'lesson-01-12': '"콘서트 끝나고 하룻밤 자고 오다" 영어로 뭐라고 할까요?',
  'lesson-01-13': '"신경 쓰지 않았으면 좋겠어요" 영어로 어떻게 말할까요?',
  'lesson-01-14': '"언제 공식 판매가 시작되었나요?" 원어민 판매 시작 표현은?',
  'lesson-01-15': '"그 노래가 몇 년도에 나왔지?" 출시/발매되다는 영어로?',
  'lesson-01-16': '"대략 그 가격대쯤이었어" 대략을 나타내는 자연스러운 표현은?',
  'lesson-01-17': '"들을수록 점점 마음에 들어요" 시간이 갈수록 좋아진다는 영어로?',
  'lesson-01-18': '"일요일까지 제출해야 해" 마감/기한을 뜻하는 단어는?',
  'lesson-01-19': '"신곡이 발매되었을 때였어요" 원어민 발음 퀴즈! 영어로?',
  'lesson-01-20': '"가능성이 매우 희박해요" 희박하다는 영어로 뭐라고 할까요?',
  'lesson-01-21': '"결국 최고의 자리를 얻게 되었어요" 결국 ~한 결과가 되다는?',
  'lesson-02-1': '"여기 땅(부지)에는 아무것도 없었죠" 땅/부지는 영어로?',
  'lesson-02-2': '"어떻게든/간신히 ~해내다" 원어민 실생활 핵심 표현은?',
  'lesson-02-3': '"산골 언덕 위의 샘(샘물)" 영어로 뭐라고 부를까요?',
  'lesson-02-4': '"여름 한중간쯤에" 한창 진행 중일 때를 뜻하는 표현은?',
  'lesson-02-5': '"두 분이 돌아가신 뒤에" 돌아가시다는 완곡하게 영어로?',
  'lesson-02-6': '"물놀이용 타이어 튜브" 영어로 정확한 명칭은?',
  'lesson-02-7': '"오후 내내 물놀이했어요" 오후 내내는 영어로?',
  'lesson-02-8': '"아침 집안일/허드렛일을 끝내다" 집안일은 영어로?',
  'lesson-02-9': '"정말 큰 기쁨이자 특별한 즐거움이에요" 영어로 뭐라고 할까요?',
  'lesson-02-10': '"그 개울 그 자체"를 강조할 때 쓰는 표현은?',
  'lesson-02-11': '"호수로 물이 흘러 들어가다" 원어민이 쓰는 동사는?',
  'lesson-02-12': '"호수에 물고기를 방류하다" 영어로 뭐라고 할까요?',
  'lesson-02-13': '"세월이 흐르면서, 수년에 걸쳐" 영어 표현은?',
  'lesson-02-14': '"내장재를 모조리 다 뜯어내다" 영어로 뭐라고 할까요?',
  'lesson-02-15': '"곰팡이가 피지 않도록" 곰팡이 핀 상태는 영어로?',
  'lesson-02-16': '"경사 없이 평평하게 집을 짓다" 수평인/평평한은 영어로?',
  'lesson-02-17': '"나이가 들어감에 따라" 점진적 변화를 나타내는 접속사는?',
  'lesson-02-18': '"산 위의 광산(채굴) 장비" 광업/채굴은 영어로?',
  'lesson-02-19': '"마음껏 누리고 즐길 수 있게 되었어요" ~할 수 있게 되다는?'
};

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseQuizMarkdown(content) {
  const blocks = content.split(/##\s*Quiz\s*\d+/i).slice(1);
  return blocks.map((block, i) => {
    const typeM = block.match(/-\s*\*\*Type\*\*:\s*([^\n]+)/i);
    const enM = block.match(/-\s*\*\*English\*\*:\s*([^\n]+)/i);
    const koM = block.match(/-\s*\*\*Korean\*\*:\s*([^\n]+)/i);
    const ansM = block.match(/-\s*\*\*Answer\*\*:\s*([^\n]+)/i);
    const expM = block.match(/-\s*\*\*Explanation\*\*:\s*([^\n]+)/i);
    const audioM = block.match(/-\s*\*\*Audio\*\*:\s*([^\n]+)/i);

    const typeStr = typeM ? typeM[1].trim().toLowerCase() : 'multiple-choice';
    const english = enM ? enM[1].trim() : '';
    const korean = koM ? koM[1].trim() : '';
    let answer = ansM ? ansM[1].trim() : '';
    const explanation = expM ? expM[1].trim() : '';
    const audio = audioM ? audioM[1].trim() : '';

    let options = [];
    const bracketM = english.match(/\[(.*?)\]/);
    if (bracketM) {
      if (typeStr.includes('multiple') || typeStr.includes('choice')) {
        options = bracketM[1].split(',').map(s => s.trim()).filter(Boolean);
        if (!answer && options.length > 0) answer = options[0];
      } else {
        if (!answer) answer = bracketM[1].trim();
      }
    }

    return {
      num: i + 1,
      type: typeStr.includes('multiple') || typeStr.includes('choice') ? 'multiple-choice' : (typeStr.includes('listen') ? 'listening' : 'fill-in-the-blank'),
      english,
      korean,
      answer,
      options,
      explanation,
      audio
    };
  });
}

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
  const rootHtmlFiles = ['index.html', 'lessons.html', 'quiz.html', 'daily.html'];
  for (const htmlFile of rootHtmlFiles) {
    const src = path.join(ROOT_DIR, htmlFile);
    const dest = path.join(DIST_DIR, htmlFile);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  // 4b. Pre-Render Dedicated Static Quiz Pages (Issue #6: Share link)
  const quizTemplatePath = path.join(ROOT_DIR, 'quiz.html');
  let quizCount = 0;

  if (fs.existsSync(quizTemplatePath)) {
    const quizTemplate = fs.readFileSync(quizTemplatePath, 'utf8');
    const lessonsDir = path.join(ROOT_DIR, 'lessons');
    const lessonDirs = fs.readdirSync(lessonsDir).filter(f => f.startsWith('lesson-') && fs.statSync(path.join(lessonsDir, f)).isDirectory()).sort();

    for (const lessonId of lessonDirs) {
      const quizMdPath = path.join(lessonsDir, lessonId, 'quiz.md');
      if (!fs.existsSync(quizMdPath)) continue;

      const quizMdContent = fs.readFileSync(quizMdPath, 'utf8');
      const quizzes = parseQuizMarkdown(quizMdContent);

      for (const q of quizzes) {
        const headlineKey = `${lessonId}-${q.num}`;
        const headline = CURATED_HEADLINES[headlineKey] || `"${q.korean}" 영어로 뭐라고 할까요?`;
        const ogTitle = `[현서네 리얼 영어] ${headline}`;
        const ogDesc = `원어민 실생활 영어 퀴즈! "${q.korean}" 표현을 직접 맞혀보세요.`;
        const ogImg = `https://rhyrhyenglish.site/assets/img/og/${lessonId}-q${q.num}.png`;
        const ogUrl = `https://rhyrhyenglish.site/quiz/${lessonId}/q${q.num}.html`;

        // Render HTML for depth 2 (quiz/lesson-XX/qYY.html)
        let pageHtmlDepth2 = quizTemplate
          .replace(/href="\.\//g, 'href="../../')
          .replace(/src="\.\//g, 'src="../../')
          .replace(/<title>.*?<\/title>/, `<title>${escapeAttr(ogTitle)}</title>`)
          .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeAttr(ogTitle)}">`)
          .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeAttr(ogDesc)}">`)
          .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${ogImg}">`)
          .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${ogUrl}">`)
          .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeAttr(ogTitle)}">`)
          .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeAttr(ogDesc)}">`)
          .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${ogImg}">`);

        // Embed quiz data for zero-latency instant rendering
        const quizDataJson = JSON.stringify({ lessonId, num: q.num, ...q });
        const embeddedTag = `<script id="quiz-data" type="application/json">${quizDataJson}</script>\n</body>`;
        pageHtmlDepth2 = pageHtmlDepth2.replace('</body>', embeddedTag);

        // Render HTML for depth 3 (quiz/lesson-XX/qYY/index.html)
        const pageHtmlDepth3 = pageHtmlDepth2
          .replace(/href="\.\.\/\.\.\//g, 'href="../../../')
          .replace(/src="\.\.\/\.\.\//g, 'src="../../../');

        // Write to dist/quiz/lesson-XX/qYY.html and dist/quiz/lesson-XX/qYY/index.html
        const distLessonQuizDir = path.join(DIST_DIR, 'quiz', lessonId);
        fs.mkdirSync(distLessonQuizDir, { recursive: true });
        fs.writeFileSync(path.join(distLessonQuizDir, `q${q.num}.html`), pageHtmlDepth2, 'utf8');

        const distPrettyDir = path.join(distLessonQuizDir, `q${q.num}`);
        fs.mkdirSync(distPrettyDir, { recursive: true });
        fs.writeFileSync(path.join(distPrettyDir, 'index.html'), pageHtmlDepth3, 'utf8');

        // Also write to workspace ROOT_DIR/quiz/ for local dev server
        const rootLessonQuizDir = path.join(ROOT_DIR, 'quiz', lessonId);
        fs.mkdirSync(rootLessonQuizDir, { recursive: true });
        fs.writeFileSync(path.join(rootLessonQuizDir, `q${q.num}.html`), pageHtmlDepth2, 'utf8');

        const rootPrettyDir = path.join(rootLessonQuizDir, `q${q.num}`);
        fs.mkdirSync(rootPrettyDir, { recursive: true });
        fs.writeFileSync(path.join(rootPrettyDir, 'index.html'), pageHtmlDepth3, 'utf8');

        quizCount++;
      }
    }
    console.log(`  🎯 Pre-rendered ${quizCount} dedicated static quiz pages in dist/quiz/`);
  }

  // 5. Rewrite Asset References & Inject No-Cache Meta in all HTML files in dist/
  const htmlFiles = findFilesByExt(DIST_DIR, ['.html']);
  console.log(`\n  🔧 Processing ${htmlFiles.length} HTML files...`);

  for (const htmlPath of htmlFiles) {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // A. Rewrite CSS links
    for (const [origFile, info] of Object.entries(hashMap)) {
      if (info.type === 'css') {
        // Match href="...css/filename.css" (with optional query parameters)
        const cssRegex = new RegExp(`(href=["'][^"']*css/)${origFile}(?:\\?[^"']*)?(["'])`, 'g');
        htmlContent = htmlContent.replace(cssRegex, `$1${info.hashed}$2`);
      } else if (info.type === 'js') {
        // Match src="...js/filename.js" (with optional query parameters)
        const jsRegex = new RegExp(`(src=["'][^"']*js/)${origFile}(?:\\?[^"']*)?(["'])`, 'g');
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
