importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
    apiKey: "AIzaSyD6djyrbNtjhf_ssrww2YkXITUgsS6sYmo",
    authDomain: "ebroker-wrteam.firebaseapp.com",
    projectId: "ebroker-wrteam",
    storageBucket: "ebroker-wrteam.appspot.com",
    messagingSenderId: "63168540332",
    appId: "1:63168540332:web:d183e9ca13866ec5623909",
    measurementId: "G-W05KYC2K8P"
};


firebase?.initializeApp(firebaseConfig)


// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker :call_me_hand:');
});

// Handle background messages
self.addEventListener('push', function (event) {
  const payload = event.data.json();
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});