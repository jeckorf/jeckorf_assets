const staticCacheName = "trippyadiveCache";
const assets = [
  "/qrocde/",
  "/qrcode/index.html",
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  )
})
//fetch event
self.addEventListener("fetch", (evt) => {
});



self.addEventListener("beforeinstallprompt", function(event) { // 监听到可安装事件，进行触发提醒用户
  setTimeout(function() {
    event.prompt()
    event.userChoice //判断用户是否安装
      .then(function(e) {
        install = true
      })
  }, 2000)
}, {
  once: true
})
