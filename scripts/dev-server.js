#!/usr/bin/env node

/**
 * RhyRhy English - Zero-Dependency Live-Reload Dev Server
 *
 * Features:
 * - Pure Node.js (http, fs, path, url) with ZERO npm dependencies
 * - Serves source files directly without requiring a build step
 * - Watches source files (HTML, CSS, JS, JSON, Markdown) and automatically
 *   reloads connected browser tabs via Server-Sent Events (SSE)
 * - Zero-cache headers to ensure immediate reflection of code edits
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT, 10) || 8855;
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const RELOAD_SCRIPT = `
<!-- RhyRhy English Live-Reload -->
<script>
(function() {
  if (window.location.protocol === 'file:') return;
  try {
    var es = new EventSource('/_reload');
    es.onmessage = function(e) {
      if (e.data === 'reload') {
        console.log('[LiveReload] Change detected, reloading page...');
        window.location.reload();
      }
    };
    es.onerror = function() {
      // Silent error handler: do NOT reload on error to prevent infinite reload loops
    };
  } catch (_) {}
})();
</script>
`;

// Active SSE client connections
const sseClients = new Set();

function broadcastReload() {
  for (const res of sseClients) {
    try {
      res.write('data: reload\n\n');
    } catch (_) {
      sseClients.delete(res);
    }
  }
}

// Debounced file watcher
let debounceTimer = null;
function handleFileChange(eventType, filename) {
  if (!filename) return;

  // Ignore dist, git, logs, scratch, temporary files, test-results, tests
  if (
    filename.startsWith('.git') ||
    filename.startsWith('dist') ||
    filename.startsWith('node_modules') ||
    filename.startsWith('scratch') ||
    filename.startsWith('.temp') ||
    filename.startsWith('test-results') ||
    filename.startsWith('tests') ||
    filename.endsWith('.tmp') ||
    filename.endsWith('~')
  ) {
    return;
  }

  const ext = path.extname(filename).toLowerCase();
  const watchedExts = ['.html', '.css', '.js', '.json', '.md', '.png', '.jpg', '.svg'];
  if (!watchedExts.includes(ext) && filename !== 'sw.js') {
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log(`⚡ [LiveReload] Detected change in ${filename} -> Reloading browser...`);
    broadcastReload();
  }, 100);
}

// Watch key source directories
const WATCH_DIRS = ['', 'css', 'js', 'lessons', 'templates', 'assets'];
WATCH_DIRS.forEach(dir => {
  const fullPath = path.join(ROOT_DIR, dir);
  if (fs.existsSync(fullPath)) {
    try {
      fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
        const relPath = dir ? path.join(dir, filename || '') : (filename || '');
        handleFileChange(eventType, relPath);
      });
    } catch (e) {
      console.warn(`[Watcher] Could not watch ${fullPath}:`, e.message);
    }
  }
});

// HTTP Request Handler
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // SSE Live-Reload Endpoint
  if (pathname === '/_reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('data: connected\n\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // Self-cleaning Service Worker for local development
  // Ensures stale caches never intercept localhost dev requests
  if (pathname === '/sw.js') {
    res.writeHead(200, {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(`
      self.addEventListener('install', () => self.skipWaiting());
      self.addEventListener('activate', (e) => {
        e.waitUntil(
          caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
            .then(() => self.registration.unregister())
            .then(() => self.clients.claim())
        );
      });
    `);
    return;
  }

  // Resolve file path
  let filePath = path.join(ROOT_DIR, pathname);

  // Security: prevent path traversal outside ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Directory index resolution
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${pathname}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // For HTML files, inject the live reload script before </body> or </html>
  if (ext === '.html') {
    fs.readFile(filePath, 'utf8', (err, html) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      let modifiedHtml = html;
      if (modifiedHtml.includes('</body>')) {
        modifiedHtml = modifiedHtml.replace('</body>', RELOAD_SCRIPT + '\n</body>');
      } else if (modifiedHtml.includes('</html>')) {
        modifiedHtml = modifiedHtml.replace('</html>', RELOAD_SCRIPT + '\n</html>');
      } else {
        modifiedHtml += RELOAD_SCRIPT;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(modifiedHtml);
    });
    return;
  }

  // Static assets: serve with no-cache headers for instant local development updates
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
  readStream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  });
});

server.listen(PORT, () => {
  console.log(`
🚀 RhyRhy English Live-Reload Dev Server running at:
   👉 http://localhost:${PORT}/
   👉 http://localhost:${PORT}/lessons/lesson-01/index.html

💡 Features:
   - Auto-detects changes in HTML, CSS, JS, JSON, and Markdown files
   - Auto-reloads browser instantly without rebuilding
   - Press Ctrl+C to stop
  `);
});
