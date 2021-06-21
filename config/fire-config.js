import firebase from 'firebase';

// Dev

  var firebaseConfig = {
    apiKey: "AIzaSyBOUU9jkhPTraVXBNAtZDvWaIm_p5LgMhk",
    authDomain: "vitaely-dev.firebaseapp.com",
    projectId: "vitaely-dev",
    storageBucket: "vitaely-dev.appspot.com",
    messagingSenderId: "825327873857",
    appId: "1:825327873857:web:fb7819ef359237bf30fbc0",
    measurementId: "G-HGYSFW8SCK"
  };


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