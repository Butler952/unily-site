import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCYHEaIkkkkyBa1Ew6Ofi_49jX01gdTvMo",
  authDomain: "personal-page-generator-v1.firebaseapp.com",
  projectId: "personal-page-generator-v1",
  storageBucket: "personal-page-generator-v1.appspot.com",
  messagingSenderId: "366460827972",
  appId: "1:366460827972:web:c022a76894ce26ba677f11",
  measurementId: "G-W0LCZHKE68"
};

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