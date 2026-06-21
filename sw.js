/* Astro Night Planner 1.0.2 – expliziter Produktiv-Cache */
'use strict';
const ENV = 'prod';
const VERSION = '1.0.2';
const CACHE_NAME = `astro-night-planner-${ENV}-${VERSION}`;
const CORE = [
  './', './index.html', './manifest.webmanifest', './VERSION.json', './icon.svg', './icon-192.png', './icon-512.png',
  './assets/build-config.js', './assets/styles.css', './assets/app.js', './assets/catalog.generated.json', './assets/andreas-cordt-logo.png', './aladin-frame.html', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH.html', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH.pdf', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH_DE.html', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH_DE.pdf', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH_EN.html', './docs/ASTRO_NIGHT_PLANNER_HANDBUCH_EN.pdf'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(`astro-night-planner-${ENV}-`) && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(event.request).catch(() => new Response('', {status:503,statusText:'Offline'})));
    return;
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      const copy=response.clone(); caches.open(CACHE_NAME).then(cache => cache.put('./index.html',copy)); return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request,response.clone()));
    return response;
  })));
});
