import firebase from 'firebase';

// var firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
// };

// Dev

  var firebaseConfig = {
    apiKey: "AIzaSyCTUJSIu8Vj8Gys4xi_0rDqBYzbpUGPA1w",
    authDomain: "expertpage-dev.firebaseapp.com",
    projectId: "expertpage-dev",
    storageBucket: "expertpage-dev.appspot.com",
    messagingSenderId: "229798034948",
    appId: "1:229798034948:web:fd760cb4f79849abd8ff51",
    measurementId: "G-6FGDTP61N2"
  };

  // var firebaseConfig = {
  //   apiKey: "AIzaSyBOUU9jkhPTraVXBNAtZDvWaIm_p5LgMhk",
  //   authDomain: "vitaely-dev.firebaseapp.com",
  //   projectId: "vitaely-dev",
  //   storageBucket: "vitaely-dev.appspot.com",
  //   messagingSenderId: "825327873857",
  //   appId: "1:825327873857:web:fb7819ef359237bf30fbc0",
  //   measurementId: "G-HGYSFW8SCK"
  // };
  

// Production
/*
const firebaseConfig = {
  apiKey: "AIzaSyCYHEaIkkkkyBa1Ew6Ofi_49jX01gdTvMo",
  authDomain: "personal-page-generator-v1.firebaseapp.com",
  projectId: "personal-page-generator-v1",
  storageBucket: "personal-page-generator-v1.appspot.com",
  messagingSenderId: "366460827972",
  appId: "1:366460827972:web:c022a76894ce26ba677f11",
  measurementId: "G-W0LCZHKE68"
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