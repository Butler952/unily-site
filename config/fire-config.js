import firebase from 'firebase';

var firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Dev

  // var firebaseConfig = {
  //   apiKey: "AIzaSyCTUJSIu8Vj8Gys4xi_0rDqBYzbpUGPA1w",
  //   authDomain: "expertpage-dev.firebaseapp.com",
  //   projectId: "expertpage-dev",
  //   storageBucket: "expertpage-dev.appspot.com",
  //   messagingSenderId: "229798034948",
  //   appId: "1:229798034948:web:fd760cb4f79849abd8ff51",
  //   measurementId: "G-6FGDTP61N2"
  // };

// Production
/*
const firebaseConfig = {
  apiKey: "AIzaSyD-QfLx4G1JmkfdQJqeoCRQYbLVKyy8DNw",
  authDomain: "expertpage-a0df6.firebaseapp.com",
  projectId: "expertpage-a0df6",
  storageBucket: "expertpage-a0df6.appspot.com",
  messagingSenderId: "108076576813",
  appId: "1:108076576813:web:f2bd3d443482f0df9e48a4",
  measurementId: "G-DL3V22FJ7N"
};*/

try {
  firebase.initializeApp(firebaseConfig);
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}

try {
  firebase.analytics();
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase analytics error', err.stack)}
}

const fire = firebase;
export default fire;