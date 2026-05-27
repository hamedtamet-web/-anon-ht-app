const CACHE_NAME = 'anon-ht-cache-v2';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'config.js',
  'ads.js',
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
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  if (
    url.includes('firestore.googleapis.com') ||
    url.includes('firebase.googleapis.com') ||
    url.includes('firebaseapp.com') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com') ||
    url.includes('firebaseio.com') ||
    url.includes('identitytoolkit') ||
    url.includes('securetoken')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// ══════════════════════════════════════
// FCM — Push Notifications
// ══════════════════════════════════════
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey:            "AIzaSyDbAYctYxiv3mTUlpfdY4ZeZDNxH89nklk",
    authDomain:        "anon-ht.firebaseapp.com",
    projectId:         "anon-ht",
    storageBucket:     "anon-ht.firebasestorage.app",
    messagingSenderId: "214497552351",
    appId:             "1:214497552351:web:9645cd0ce48b9d5466a"
});

const messaging = firebase.messaging();

// إشعار لما المستخدم برا الموقع
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

// لما المستخدم يضغط على الإشعار
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