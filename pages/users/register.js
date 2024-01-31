import { useState, useEffect } from 'react'; 
import fire from '../../config/fire-config';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';

const Register = () => {

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
        docRef.get()
        .then((doc) => {
          if (doc.exists) {
            mixpanel.track("Registered", {"method": "Password"});
            if (doc.data().stage === "complete") {
              router.push("/profile");
            } else {
              router.push(doc.data().stage);
            }
          } else {
            if (receiveEmails) {
              fire.firestore().collection('mailingList').doc(user.uid).set({
                email: user.email,
                stage: '/setup/handle',
                signUpSurveyComplete: false,
                subscribed: fire.firestore.FieldValue.serverTimestamp(),
                lastUpdated: fire.firestore.FieldValue.serverTimestamp()
              })
            }
            fire.firestore().collection('users').doc(user.uid).set({
              receiveEmails: receiveEmails,
              email: user.email,
              stage: '/setup/handle',
              created: fire.firestore.FieldValue.serverTimestamp(),
              lastUpdated: fire.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              mixpanel.track("Registered", {"method": "Google"});
              router.push("/setup/handle");
            })
            .catch((error) => {
              console.log("Error getting document:", error);
            })
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        })
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
      // mixpanel.track('Registered');
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

  const handleLoginWithGoogle = (e) => {
    e.preventDefault();
    fire.auth().signInWithPopup(new fire.auth.GoogleAuthProvider())
    .then(() => {
      mixpanel.init(mixpanelConfig); 
      // mixpanel.track("Registered", {"method": "Google"});
    })
    .catch((err) => {
      console.log(err.code, err.message)
    });
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
        // mixpanel.track("Registered", {"method": "Password"})
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
    <div>
      <Header />
      <Head>
        <title>Create an account</title>
      </Head>
      <Container className="py-5">
        <div className="card m-auto p-4 p-md-5" style={{maxWidth: "560px"}}>
          <h3 className="text-dark-high">Create your account</h3>
          <div className="">
            <p className="mb-4">Already got an account? <Link href="/users/login">Sign in</Link></p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input type="text" placeholder="Email" className={emailError !== '' ? `error w-100` : `w-100`} value={username} onChange={({target}) => usernameChange(target.value)} />
                {emailError !== '' ? <p className="small text-error-high mt-2">{emailError}</p> : null}
              </div>
              <div className="mb-4">
                <input type="password" placeholder="Password" className={passwordError !== '' ? `error w-100` : `w-100`} value={password} onChange={({target}) => passwordChange(target.value)} />
                {passwordError !== '' ? <p className="small text-error-high mt-2">{passwordError}</p> : null}
              </div>
              {/* <div className="mb-4">
                <p className="large text-dark-high">Confirm password</p>
                <input type="password" className={passConfError !== '' ? `error w-100` : `w-100`} value={passConf} onChange={({target}) => passConfChange(target.value)} />
                {passConfError !== '' ? <p className="small text-error-high mt-2">{passConfError}</p> : null}
              </div> */}
              <label className="checkbox-container small mb-4">I would like to receive emails about news and updates
                <input type="checkbox" onChange={() => receiveEmailsChange()} checked={receiveEmails}></input>
                <span className="checkmark"></span>
              </label>
              <label className="checkbox-container small mb-4">I agree to the <a href="/legal/terms" target="_blank">Terms</a> and <a href="/legal/privacy" target="_blank">Privacy Policy</a>
                <input type="checkbox" onChange={() => termsAndPrivacyChange()} checked={termsAndPrivacy}></input>
                {notify !== '' ? <p className="small text-error-high">{notify}</p> : null}
                <span className="checkmark"></span>
              </label>
              {/*}
              <label className="checkbox-container small mb-4">I would like to receive emails about news and updates
                <input type="checkbox" onChange={() => setReceiveEmails(receiveEmails => !receiveEmails)} checked={receiveEmails}></input>
                <span className="checkmark"></span>
              </label>
              */}
              <button type="submit" className="btn primary high w-100" disabled={creating}>{creating ? 'Creating account...' : 'Create account'}</button>
            </form>
            <div className="d-flex flex-row align-items-center w-100 gap-3 my-3">
              <hr className="w-100 m-0"></hr>
              <p className="small mb-0">or</p>
              <hr className="w-100 m-0"></hr>
            </div>
            <button type="button" onClick={(e) => handleLoginWithGoogle(e)} className="btn dark medium w-100" disabled={creating}>
              <img className="mr-2" width="24" src="/images/third-party/google.svg"></img>
              Sign in with Google
            </button>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Register