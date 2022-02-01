import { useState, useEffect } from 'react'; 
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';

const Register = () => {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passConf, setPassConf] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [termsAndPrivacy, setTermsAndPrivacy] = useState(false);
  // const [receiveEmails, setReceiveEmails] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passConfError, setPassConfError] = useState('');
  const [creating, setCreating] = useState(false);

  const [notify, setNotification] = useState('');

  useEffect(() => {
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
    mixpanel.track('Get started');
    const unsubscribe =  fire.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true)
        addUserDocument(user)
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
      mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
      mixpanel.track('Register');
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

  const passConfChange = (value) => {
    setPassConf(value)
    setPasswordError('')
    setPassConfError('')
  }

  const termsAndPrivacyChange = () => {
    setTermsAndPrivacy(termsAndPrivacy => !termsAndPrivacy)
    setNotification('')
  }

  const handleLogin = (e) => {
    e.preventDefault();

    if (password !== passConf) {
      setPasswordError('Password and confirm password do not match')
      setPassConfError('Password and confirm password do not match')
      return null;
    }

    if (!termsAndPrivacy) {
      setNotification('Please accept the terms and conditions')
      return null;
    }

    setCreating(true)

    fire.auth()
      .createUserWithEmailAndPassword(username, password)
      .then(() => {
        setCreating(false)
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          setEmailError('This email is already in use')
        }
        if (err.code === 'auth/invalid-email') {
          setEmailError('Please enter a valid email address')
        }
        if (err.code === 'auth/weak-password') {
          setPasswordError('The password must be at least 6 characters long')
        }
        setCreating(false)
        console.log(err.code, err.message)
      })
  }

  return (
    <div>
      <Head>
        <title>Create an account</title>
      </Head>
      <Header/>
      <Container className="py-5">
        <div className="card m-auto" style={{maxWidth: "640px"}}>
          <div className="py-4 px-4 px-md-5">
            <h5 className="text-dark-high mb-0">Sign up</h5>
          </div>
          <hr className="m-0"/>
          <div className="p-4 p-md-5">
            <p className="mb-4">Already got an account? <Link href="/users/login">Sign in</Link></p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <p className="large text-dark-high">Email</p>
                <input type="text" className={emailError !== '' ? `error w-100` : `w-100`} value={username} onChange={({target}) => usernameChange(target.value)} />
                {emailError !== '' ? <p className="small text-error-high mt-2">{emailError}</p> : null}
              </div>
              <div className="mb-4">
                <p className="large text-dark-high">Password</p>
                <input type="password" className={passwordError !== '' ? `error w-100` : `w-100`} value={password} onChange={({target}) => passwordChange(target.value)} />
                {passwordError !== '' ? <p className="small text-error-high mt-2">{passwordError}</p> : null}
              </div>
              <div className="mb-4">
                <p className="large text-dark-high">Confirm password</p>
                <input type="password" className={passConfError !== '' ? `error w-100` : `w-100`} value={passConf} onChange={({target}) => passConfChange(target.value)} />
                {passConfError !== '' ? <p className="small text-error-high mt-2">{passConfError}</p> : null}
              </div>
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

export default Register