import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCBz3mq7bVrU88lTdgnGuqKN51hq5MyVVk",
  authDomain: "blogapp-c9c07.firebaseapp.com",
  projectId: "blogapp-c9c07",
  storageBucket: "blogapp-c9c07.appspot.com",
  messagingSenderId: "640286703073",
  appId: "1:640286703073:web:14327125318fb9330626a0"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}

const fire = firebase;
export default fire;