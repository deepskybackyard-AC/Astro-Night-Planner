const CACHE = 'astro-night-planner-v10';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH_DE.html', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH_DE.pdf', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH_EN.html', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH_EN.pdf'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request)));
});
