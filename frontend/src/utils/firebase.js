// Import the functions you need from the SDKs you need

import firebase from 'firebase/app';
import 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: '',

  authDomain: '',

  projectId: '',

  storageBucket: '',

  messagingSenderId: '',

  appId: '',

  measurementId: ''
};

// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);

export const messaging = firebase.messaging(app);

// const analytics = getAnalytics(app);

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
