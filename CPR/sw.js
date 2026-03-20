// CPR Trainer Service Worker - Offline Support
const CACHE_NAME = 'cpr-trainer-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose_solution_packed_assets_loader.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose_landmark_full_complexity.binarypb',
  'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose_web.binarypb',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache critical assets first
      return cache.addAll(['./index.html', './manifest.json']).then(() => {
        // Try to cache external assets (may fail on first load without network)
        return Promise.allSettled(ASSETS.map(url => cache.add(url)));
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Return offline fallback for navigation
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
