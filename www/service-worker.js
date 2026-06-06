const CACHE_NAME = 'anon-ht-cache-v7';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'images/logo.png',
  'images/user.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  if (!url.startsWith('https://anonht.com') &&
      !url.startsWith(self.location.origin)) {
    return;
  }

  if (
    url.endsWith('.js') ||
    url.endsWith('.html') ||
    url.includes('config') ||
    url.includes('admin')
  ) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyDbAYctYxiv3mTUlpfdY4ZeZDNxH89nklk",
  authDomain:        "anon-ht.firebaseapp.com",
  projectId:         "anon-ht",
  storageBucket:     "anon-ht.firebasestorage.app",
  messagingSenderId: "214497552351",
  appId:             "1:214497552351:web:9645cd0ce48b9d5466a1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || 'Anon',
    {
      body:  payload.notification?.body || 'إشعار جديد',
      icon:  '/images/logo.png',
      badge: '/images/logo.png',
      data:  { url: payload.data?.url || '/' }
    }
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow(event.notification.data?.url || '/');
    })
  );
});