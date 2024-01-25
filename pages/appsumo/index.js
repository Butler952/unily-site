import { useState, useEffect } from 'react'; 
import fire from '/config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '/components/header/Header';
import { Container } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import ICONS from 'components/icon/IconPaths';

const AppSumo = () => {

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

  const [appsumoCode, setAppsumoCode] = useState('');
  const [appsumoCodeError, setAppsumoError] = useState('');

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

  const appsumoChange = (value) => {
    setAppsumoCode(value),
    setAppsumoError('')
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
            subscriberEmail: userCredential.user.email,
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
        mixpanel.track('Registered');
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
      {/* <Header /> */}
      <Head>
        <title>Create an account</title>
      </Head>
      <Container className="py-5">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mb-5">
          <img className="mb-2 mb-md-0 mr-md-3" style={{height: '40px'}} src={'/images/vitaely-logo-icon-square.svg'}></img>
          {/* <div className="d-none d-md-block bg-dark-300" style={{height: '48px', width:'1px'}}></div> */}
          <svg height='24' viewBox="0 0 24 24">
            <path className="fill-dark-600" d={ICONS.PLUS}></path>
          </svg>

          <img style={{height: '48px'}} src={'/images/partners/appsumo-logo.svg'}></img>
        </div>
        <div className="card m-auto p-4 p-md-5" style={{maxWidth: "640px"}}>
          {/* <h3 className="text-dark-high">Hey Sumo-lings!</h3> */}
          <h4 className="text-dark-high">Create your account</h4>
          <div>
            <div className="mx-auto p-3 p-md-4 bg-primary-100 radius-3 mb-4" style={{maxWidth: "640px"}}>
              <p className="">To activate your <span className="font-weight-medium text-gradient-3">lifetime access</span> to Vitaely, just create your account and enter your AppSumo code below. We're so excited for you to get started!</p>
              <div className="d-flex flex-column flex-md-row justify-content-start align-items-md-center gap-3 mt-4">
                <div className="d-flex flex-row">
                  <img className="radius-5 border-2 border-solid border-light-900" style={{height: '40px'}} src={'/images/avatars/aaron-butler-founder-expertpage.jpeg'}></img>
                  {/* <img className="radius-5 border-2 border-solid border-light-900" style={{height: '40px'}} src={'/images/avatars/felipe-aranguiz-founder-expertpage.jpeg'}></img> */}
                </div>
                <div className="d-flex flex-column">
                  <p className="mb-0 font-weight-medium"><span className="">Aaron</span></p>
                  <p className="mb-0 text-dark-low">Co-Founder of <span className="">Vitaely</span></p>
                </div>
              </div>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input type="text" placeholder="Email" className={`${emailError !== '' ? 'error w-100' : 'w-100'}`} value={username} onChange={({target}) => usernameChange(target.value)} />
                {emailError !== '' ? <p className="small text-error-high mt-2">{emailError}</p> : null}
              </div>
              <div className="mb-4">
                <input type="password" placeholder="Password" className={passwordError !== '' ? `error w-100` : `w-100`} value={password} onChange={({target}) => passwordChange(target.value)} />
                {passwordError !== '' ? <p className="small text-error-high mt-2">{passwordError}</p> : null}
              </div>
              <div className="mb-4">
                <input type="text" placeholder="Appsumo Code" className={appsumoCodeError !== '' ? `error w-100` : `w-100`} value={appsumoCode} onChange={({target}) => appsumoChange(target.value)} />
                {appsumoCodeError !== '' ? <p className="small text-error-high mt-2">{appsumoCodeError}</p> : null}
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
              <br/>
              <button type="submit" className="btn primary high" disabled={creating}>{creating ? 'Creating account...' : 'Create account'}</button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AppSumo