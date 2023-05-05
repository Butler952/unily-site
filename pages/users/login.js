import { useEffect, useState } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [notify, setNotification] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const router = useRouter();

  const usernameChange = (value) => {
    setUsername(value),
    setEmailError('')
  }

  const passwordChange = (value) => {
    setPassword(value)
    setPasswordError('')
  }

  const handleLogin = (e) => {
    e.preventDefault();

    setSigningIn(true)

    fire.auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        mixpanel.init(mixpanelConfig); 
        mixpanel.track('Signed in');
      })
      .then(() => {
        setSigningIn(false)
      })
      .catch((err) => {

        if (err.code === 'auth/invalid-email') {
          setEmailError('Please enter a valid email address')
        }
        if (err.code === 'auth/user-disabled') {
          setEmailError('This account has been disabled')
        }
        if (err.code === 'auth/user-not-found') {
          //setEmailError('Please check you have entered your email correctly or sign up to create an account')
          setPasswordError('The email address and password do not match')
        }
        if (err.code === 'auth/wrong-password') {
          setPasswordError('The email address and password do not match')
        }
        setSigningIn(false)
        console.log(err.code, err.message)
      })
  }

  useEffect(() => {
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Login');
    const unsubscribe =  fire.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        var docRef = fire.firestore().collection('users').doc(user.uid)
      
          docRef.get().then((doc) => {
            if (doc.data().stage === "complete") {
              router.push(doc.data().profileUrl);
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

  return (
    <div>
      <Header />
      <Head>
        <title>Sign in to your account</title>
      </Head>
      <Container className="py-5">
      <div className="card m-auto p-4 p-md-5" style={{maxWidth: "640px"}}>
          <div className="">
          <h3 className="text-dark-high">Sign in</h3>

            <p className="mb-4">Not got an account? <Link href="/users/register">Sign up</Link></p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input type="text" placeholder="Email" className={emailError !== '' ? `error w-100` : `w-100`} value={username} onChange={({target}) => usernameChange(target.value)} />
                {emailError !== '' ? <p className="small text-error-high mt-2">{emailError}</p> : null}
              </div>
              <div className="mb-4">
                <input type="password" placeholder="Password" className={passwordError !== '' ? `error w-100` : `w-100`} value={password} onChange={({target}) => passwordChange(target.value)} />
                {passwordError !== '' ? <p className="small text-error-high mt-2">{passwordError}</p> : null}
              </div>
              <p className="mb-4">Forgot your password? <Link href="/users/reset">Reset your password</Link></p>
              <br />
              <button type="submit" className="btn primary high"disabled={signingIn}>{signingIn ? 'Logging in...' : 'Login'}</button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  )

}

export default Login
