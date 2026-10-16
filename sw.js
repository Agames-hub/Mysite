var CACHE = 'tuner-v5';
var FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'stroi.html', 'stroj-standartnyj.html', 'stroj-drop-d.html', 'stroj-polutona-vniz.html', 'stroj-ton-vniz.html', 'stroj-drop-c.html', 'stroj-dadgad.html', 'stroj-dadfad.html', 'stroj-open-g.html', 'stroj-open-d.html', 'stroj-cgcgcd.html'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});

// сначала сеть (чтобы обновления доходили сразу), без сети берём из кэша
self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(req, copy); });
      return res;
    }).catch(function(){ return caches.match(req); })
  );
});
