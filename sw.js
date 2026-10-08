// つんつ君: オフラインでも開けるようにする簡単なキャッシュ。
// index.html を更新したら VERSION の数字を上げると、みんなの端末で新しいものに入れ替わる。
var VERSION = "v35";
var FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return Promise.all(FILES.map(function (f) { return c.add(new Request(f, { cache: "reload" })); })); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(function (r) { var cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, cp); }); return r; }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match("index.html"); }); }));
});
