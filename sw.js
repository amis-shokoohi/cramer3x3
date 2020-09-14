const staticCacheName = 'site-static-v9.8';
const dynamicCacheName = 'site-dynamic-v2';

const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/css/style.css',
  '/pages/fallback.html'
];

// listening for service worker installation
self.addEventListener('install', e => {
  e.waitUntil(caches.open(staticCacheName).then(cache => {
    cache.addAll(assets);
  }));
});

// listening for service worker activation
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => {
    return Promise.all(keys
      .filter(key => key !== staticCacheName && key !== dynamicCacheName)
      .map(key => caches.delete(key))
    );
  }));
});

// listening for fetch event a
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cacheRes => {
    return cacheRes || fetch(e.request).then(fetchRes => {
      return caches.open(dynamicCacheName).then(cache => {
        cache.put(e.request.url, fetchRes.clone());
        limitCacheSize(dynamicCacheName, 5);
        return fetchRes;
      });
    });
  }).catch(() => {
    if(e.request.url.indexOf('.html') > -1) {
      return caches.match('/pages/fallback.html')
    }
  })
  );
});

// chache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
}