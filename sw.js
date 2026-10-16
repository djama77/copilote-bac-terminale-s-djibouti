const CACHE = "copilote-bac-v2";
const BASE = new URL("./", self.registration.scope);
const ASSETS = ["", "index.html", "styles.css", "app.js", "manifest.webmanifest"].map(path => new URL(path, BASE).href);

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("copilote-bac-") && key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin || new URL(request.url).pathname.includes("/api/")) return;
  event.respondWith(
    fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === "navigate") return caches.match(new URL("index.html", BASE).href);
      return new Response("Ressource indisponible hors connexion.", {status: 503, headers: {"Content-Type": "text/plain; charset=utf-8"}});
    })
  );
});
