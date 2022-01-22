// Scripts for firebase and firebase messaging
// importScripts('https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/9.6.2/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: '',

  authDomain: '',

  projectId: '',

  storageBucket: '',

  messagingSenderId: '',

  appId: '',

  measurementId: ''
};
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('notificationclick', function (event) {
  console.log('notificationclick', event);
  event.notification.close();

  var promise = new Promise(function (resolve) {
    setTimeout(resolve, 500);
  }).then(function () {
    return clients.openWindow(event.notification.data);
  });
  event.waitUntil(promise);
  return null;
});

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //      body: payload.notification.body,
  // };
  /**
   * The browser has a default push notificaiton, calling this function will
   * show two notifications
   */
  // self.registration.showNotification(notificationTitle,
  //      notificationOptions);
});
/**
 * This didn't work in local
 */
// self.onnotificationclick = function (event) {
//      console.log("notificationclick", event);
// }
/**
 * This didn't work in local
 */
// self.addEventListener('notificationclick', function (event) {
//   console.debug('SW notification click event', event)
//   const url = 'http://www.googl.com'
//   event.waitUntil(
//     clients.matchAll({ type: 'window' }).then(windowClients => {
//       // Check if there is already a window/tab open with the target URL
//       for (var i = 0; i < windowClients.length; i++) {
//         var client = windowClients[i];
//         // If so, just focus it.
//         if (client.url === url && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       // If not, then open the target URL in a new window/tab.
//       if (clients.openWindow) {
//         return clients.openWindow(url);
//       }
//     })
//   );
// })
/**
 * This worked
 */
// self.addEventListener("push", function (event) {
//      console.log("push", event);
//      // event.preventDefault();
//      return null;
// });
