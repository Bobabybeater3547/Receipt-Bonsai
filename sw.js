// Receipt Bonsai — cache-first service worker
const CACHE = "receipt-bonsai-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./manifest.webmanifest",
  "./favicon.png",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./.nojekyll"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k)))).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if(event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {
      const url = new URL(event.request.url);
      if(url.origin === location.origin){
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(()=>{});
      }
      return res;
    }))
  );
});
