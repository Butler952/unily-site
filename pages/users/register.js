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

  const [shortlist, setShortlist] = useState([])
  const [rejected, setRejected] = useState([])

  const [notify, setNotification] = useState('');

  useEffect(() => {
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Register');
    if (typeof localStorage.shortlist != "undefined") {
      setShortlist(JSON.parse(localStorage.shortlist))
    }
    if (typeof localStorage.rejected != "undefined") {
      setRejected(JSON.parse(localStorage.rejected))
    }
    const unsubscribe =  fire.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        var docRef = fire.firestore().collection('users').doc(user.uid)
        docRef.get()
        .then((doc) => {
          if (doc.exists) {
            mixpanel.track("Registered", {"method": "Password"});
            localStorage.removeItem("shortlist");
            localStorage.removeItem("rejected");
            router.push("/names");
          } else {
            fire.firestore().collection('users').doc(user.uid).set({
              email: userCredential.user.email,
              shortlist: shortlist,
              rejected: rejected,
              created: fire.firestore.FieldValue.serverTimestamp(),
              lastUpdated: fire.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              mixpanel.track("Registered", {"method": "Google"});
              localStorage.removeItem("shortlist");
              localStorage.removeItem("rejected");
              router.push("/names");
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

  const usernameChange = (value) => {
    setUsername(value),
    setEmailError('')
  }

  const passwordChange = (value) => {
    setPassword(value)
    setPasswordError('')
    setPassConfError('')
  }

  const termsAndPrivacyChange = () => {
    setTermsAndPrivacy(termsAndPrivacy => !termsAndPrivacy)
    setNotification('')
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

    if (!termsAndPrivacy) {
      setNotification('Please accept the terms and conditions')
      return null;
    }

    setCreating(true)

    fire.auth()
      .createUserWithEmailAndPassword(username, password)
      .then((userCredential) => {
        fire.firestore().collection('users').doc(userCredential.user.uid).set({
          email: userCredential.user.email,
          shortlist: shortlist,
          rejected: rejected,
          created: fire.firestore.FieldValue.serverTimestamp(),
          lastUpdated: fire.firestore.FieldValue.serverTimestamp()
        })
      })
      .then(() => {
        mixpanel.init(mixpanelConfig); 
        localStorage.removeItem("shortlist");
        localStorage.removeItem("rejected");
      })
      .then(() => {
        router.push("/names")
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
              <label className="checkbox-container small mb-4">I agree to the <a href="/legal/terms" target="_blank">Terms</a> and <a href="/legal/privacy" target="_blank">Privacy Policy</a>
                <input type="checkbox" onChange={() => termsAndPrivacyChange()} checked={termsAndPrivacy}></input>
                {notify !== '' ? <p className="small text-error-high">{notify}</p> : null}
                <span className="checkmark"></span>
              </label>
              <button type="submit" className="btn primary high w-100" disabled={creating}>{creating ? 'Creating account...' : 'Create account'}</button>
            </form>
            <div className="d-flex flex-row align-items-center w-100 gap-3 my-3">
              <hr className="w-100 m-0"></hr>
              <p className="small mb-0">or</p>
              <hr className="w-100 m-0"></hr>
            </div>
            <button type="button" onClick={(e) => handleLoginWithGoogle(e)} className="btn dark medium w-100" disabled={creating}>
              <img className="mr-2" width="24" src="/images/third-party/google.svg"></img>
              Continue with Google
            </button>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Register