import { useState, useEffect } from 'react'; 
import fire from '../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../components/header/Header';
import { Container } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import styles from './index.module.scss'

const Dashboard = () => {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [passConf, setPassConf] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [termsAndPrivacy, setTermsAndPrivacy] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passConfError, setPassConfError] = useState('');
  const [creating, setCreating] = useState(false);

  const [notify, setNotification] = useState('');

  useEffect(() => {
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Register');
    const unsubscribe =  fire.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        var docRef = fire.firestore().collection('users').doc(user.uid)
      
          docRef.get().then((doc) => {
            if (doc.data().stage === "complete") {
              router.push("/profile");
            } else {
              router.push(doc.data().stage);
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
          })
        }
    })
      return () => {
        // Unmouting
        unsubscribe();
      };
  }, []);

  useEffect(() => {
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Get started');
    const unsubscribe =  fire.auth()
    .onAuthStateChanged((user) => {

      if (user) {
        setLoggedIn(true)
        var docRef = fire.firestore().collection('users').doc(user.uid)
      
          docRef.get().then((doc) => {
            if (doc.data().stage === "complete") {
              router.push("/profile");
            } else {
              router.push(doc.data().stage);
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
          })
      } else {
        setLoggedIn(false)
      }
    })
      return () => {
        // Unmouting
        unsubscribe();
      };
  }, []);

  const addUserDocument = (user) => {
    fire.firestore().collection('users').doc(user.uid).set({
      //receiveEmails,
      email: user.email,
      stage: '/setup/emails',
      created: fire.firestore.FieldValue.serverTimestamp(),
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      mixpanel.init(mixpanelConfig); 
      mixpanel.track('Registered');
    })
    .then(() => {
      router.push("/setup/emails")
    })
  }

  const usernameChange = (value) => {
    setUsername(value),
    setEmailError('')
  }

  const passwordChange = (value) => {
    setPassword(value)
    setPasswordError('')
    setPassConfError('')
  }

  // const passConfChange = (value) => {
  //   setPassConf(value)
  //   setPasswordError('')
  //   setPassConfError('')
  // }

  const termsAndPrivacyChange = () => {
    setTermsAndPrivacy(termsAndPrivacy => !termsAndPrivacy)
    setNotification('')
  }

  const receiveEmailsChange = () => {
    setReceiveEmails(receiveEmails => !receiveEmails)
  }

  const handleLogin = (e) => {
    e.preventDefault();

    // if (password !== passConf) {
    //   setPasswordError('Password and confirm password do not match')
    //   setPassConfError('Password and confirm password do not match')
    //   return null;
    // }

    if (!termsAndPrivacy) {
      setNotification('Please accept the terms and conditions')
      return null;
    }

    setCreating(true)

    fire.auth()
      .createUserWithEmailAndPassword(username, password)
      .then((userCredential) => {
        if (receiveEmails) {
          fire.firestore().collection('mailingList').doc(userCredential.user.uid).set({
            email: userCredential.user.email,
            stage: '/setup/handle',
            signUpSurveyComplete: false,
            subscribed: fire.firestore.FieldValue.serverTimestamp(),
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
        }
        fire.firestore().collection('users').doc(userCredential.user.uid).set({
          receiveEmails: receiveEmails,
          email: userCredential.user.email,
          stage: '/setup/handle',
          created: fire.firestore.FieldValue.serverTimestamp(),
          lastUpdated: fire.firestore.FieldValue.serverTimestamp()
        })
      })
      .then(() => {
        mixpanel.init(mixpanelConfig); 
        mixpanel.track('Register');
      })
      .then(() => {
        router.push("/setup/handle")
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          setEmailError('This email is already in use')
        }
        if (err.code === 'auth/invalid-email') {
          setEmailError('Please enter a valid email address')
        }
        if (err.code === 'auth/weak-password') {
          setPasswordError('Your password must be at least 6 characters long')
        }
        setCreating(false)
        console.log(err.code, err.message)
      })
  }

  return (
    <div style={{minHeight: "100vh"}}>
      <Header/>
      <Head>
        <title>Create an account</title>
      </Head>
      <div className="d-flex flex-row p-5 gap-4">
        <div className={`${styles.sectionList} p-4 d-flex flex-column`} style={{minWidth: "320px", maxWidth: "640px"}}>
          <h3 className="text-dark-high">Profile</h3>
          <div className="d-flex flex-column gap-2 w-100">
            <div className="d-flex flex-row align-items-center bg-light-900 p-3 shadow-2 radius-3 w-100">
              <p className="mb-0 font-weight-semibold text-dark-high ">Products</p>
            </div>
            <div className="d-flex flex-row align-items-center bg-light-900 p-3 shadow-2 radius-3 w-100">
              <p className="mb-0 font-weight-semibold text-dark-high ">Products</p>
            </div>
            <div className="d-flex flex-row align-items-center bg-light-900 p-3 shadow-2 radius-3 w-100">
              <p className="mb-0 font-weight-semibold text-dark-high ">Products</p>
            </div>
            <div className="d-flex flex-row align-items-center bg-light-900 p-3 shadow-2 radius-3 w-100">
              <p className="mb-0 font-weight-semibold text-dark-high ">Products</p>
            </div>
            <div className="d-flex flex-row align-items-center bg-light-900 p-3 shadow-2 radius-3 w-100">
              <p className="mb-0 font-weight-semibold text-dark-high ">Products</p>
            </div>
            <div className="d-flex flex-row align-items-center bg-light-900 p-3 shadow-2 radius-3 w-100">
              <p className="mb-0 font-weight-semibold text-dark-high ">Products</p>
            </div>
          </div>
        </div>
        <div className="card w-100 p-5">
          <h3 className="text-dark-high">This is where the profile goes</h3>
          <div className="">
            <p className="mb-4">Already got an account? <Link href="/users/login">Sign in</Link></p>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard