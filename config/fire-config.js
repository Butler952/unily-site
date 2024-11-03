// import firebase from 'firebase';

import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";



// var firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
// };

//Dev

 var firebaseConfig = {
    apiKey: "AIzaSyB_7Da2BgAl0c1vY72swKCjJLWvjyBR6E4",
    authDomain: "homeric-name-picker-dev.firebaseapp.com",
    projectId: "homeric-name-picker-dev",
    storageBucket: "homeric-name-picker-dev.appspot.com",
    messagingSenderId: "658676294759",
    appId: "1:658676294759:web:5c5858b8e2910ce565e0c2",
    measurementId: "G-D8G921RD14"
  };

// Production

// var firebaseConfig = {
//   apiKey: "AIzaSyCtyPNHTPLN4xLAa5PS4nOqexDeNv_0rJg",
//   authDomain: "homeric-name-picker.firebaseapp.com",
//   projectId: "homeric-name-picker",
//   storageBucket: "homeric-name-picker.appspot.com",
//   messagingSenderId: "876041331330",
//   appId: "1:876041331330:web:d5dc237c6456b992b10a9b",
//   measurementId: "G-H15RKXV70W"
// };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);



try {
  firebase.initializeApp(firebaseConfig);
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}
try {
  firebase.auth();
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase authentication error', err.stack)}
}
try {
  firebase.firestore();
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase firestore error', err.stack)}
}
// try {
//   firebase.analytics();
// } catch(err){
//   if (!/already exists/.test(err.message)) {
//     console.error('Firebase analytics error', err.stack)}
// }

const fire = firebase;
export default fire;

// const app = initializeApp(firebaseConfig);