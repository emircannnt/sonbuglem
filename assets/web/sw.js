const CACHE_NAME = 'buglem-cache-v1';
const urlsToCache = [
    './index.html',
    './css/style.css',
    './js/app.js',
    './js/data.js',
    './js/quran.js',
    './js/stories.js',
    './logo.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;
                return fetch(event.request);
            })
    );
});
