/**
 * Service Worker for RhyRhy English PWA
 * Caches application shell, quizzes, scripts, audio files, and Lottie animations
 * so users can study offline.
 */
const CACHE_NAME = 'rhyrhy-cache-v13';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/main.css',
  './css/navigation.css',
  './css/quiz.css',
  './css/video-script.css',
  './css/review-player.css',
  './css/modal.css',
  './js/storage.js',
  './js/analytics.js',
  './js/markdown-quiz-parser.js',
  './js/quiz-engine.js',
  './js/video-script.js',
  './js/review-player.js',
  './js/youtube-comment.js',
  './js/celebration.js',
  './js/app.js',
  './assets/icons/icon.svg',
  './assets/img/family.jpeg',
  './assets/img/family-playful.jpg',
  './assets/img/family-studio.jpg',
  './assets/img/avatars/kelly.jpg',
  './assets/lottie/celebration.json',
  './assets/vendor/lottie.min.js',
  './lessons.html',
  './lessons/lesson-01/index.html',
  './lessons/lesson-01/metadata.json',
  './lessons/lesson-01/quiz.md',
  './lessons/lesson-01/script.json',
  './lessons/lesson-02/index.html',
  './lessons/lesson-02/metadata.json',
  './lessons/lesson-02/quiz.md',
  './lessons/lesson-02/script.json',
  './lessons/lesson-02/audio/coffee.wav',
  './lessons/lesson-02/audio/order.wav',
  './lessons/lesson-03/index.html',
  './lessons/lesson-03/metadata.json',
  './lessons/lesson-03/quiz.md',
  './lessons/lesson-03/script.json',
  './lessons/lesson-03/audio/travel.wav'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Pre-caching static assets');
      await Promise.allSettled(
        STATIC_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn('[SW] Could not pre-cache asset:', asset, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET, YouTube API, embeds, or chrome-extension requests
  if (
    event.request.method !== 'GET' ||
    url.hostname.includes('youtube.com') ||
    url.hostname.includes('googlevideo.com') ||
    url.hostname.includes('googleapis.com') ||
    event.request.url.startsWith('chrome-extension://')
  ) {
    return;
  }

  // Network-First for HTML navigation requests to prevent stale freezes
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Stale-while-revalidate / cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
