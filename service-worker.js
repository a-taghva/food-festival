const APP_PREFIX = "FoodFest-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js"
];

self.addEventListener('install', e => {
  console.log('service worker installed!');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('installing cache: ' + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  )
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      let cacheKeeplist = keyList.filter(key => key.indexOf(APP_PREFIX));
      cacheKeeplist.push(CACHE_NAME);
      
      return Promise.all(keyList.map((key, i) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          console.log('deleting cache: ', + keyList[i]);
          return cache.delete(keyList[i]);
        }
      }));
    })
  )
});

self.addEventListener('fetch', e => {
  console.log('event: ' + e);
  console.log('fetch request url: ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(request => {
      console.log('request: ' + request);
      if (request) {
        console.log('responding with cache: ' + e.request.url);
        return request;
      } else {
        console.log('file is not cached, fetching: ' + e.request.url);
        return fetch(e.request);
      }
    })
    // caches.match(e.request).then(request => request || fetch(e.request))
  )
})