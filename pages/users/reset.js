import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import Head from 'next/head';

const Reset = () => {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = fire.auth()
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

  const usernameChange = (value) => {
    setUsername(value),
      setEmailError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreating(true)

    fire.auth()
      .sendPasswordResetEmail(username)
      .then(() => {
        setCreating(false);
        setEmailSent(true);
      })
      .catch((err) => {
        setCreating(false)
        if (err.code === 'auth/invalid-email') {
          setEmailError('Please enter a valid email address')
        } else {
          //setEmailError('There was an issue completing your request')
          //console.log(err.code, err.message)
          setEmailSent(true);
        }
      });
  }

  const resetForm = () => {
    setEmailSent(false);
  }

  return (
    <div>
      <Head>
        <title>Reset your password</title>
      </Head>
      <Container className="py-5">
        <div className="card m-auto" style={{ maxWidth: "640px" }}>
          <div className="py-4 px-4 px-md-5">
            <h5 className="text-dark-high mb-0">Reset your password</h5>
          </div>
          <hr className="m-0" />
          <div className="p-4 p-md-5">
            {!emailSent ?
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <p className="large text-dark-high">Email</p>
                  <input type="text" className={emailError !== '' ? `error w-100` : `w-100`} value={username} onChange={({ target }) => usernameChange(target.value)} />
                  {emailError !== '' ? <p className="small text-error-high mt-2">{emailError}</p> : null}
                </div>
                <br />
                <button type="submit" className="btn primary high" disabled={creating}>{creating ? 'Submitting...' : 'Reset password'}</button>
              </form>
              :
              <div>
                <p className="large text-dark-high">Password reset email sent</p>
                <p>Check your email inbox for further instructions</p>
                <br />
                <p className="mb-4">Didn't receive an email? <button onClick={resetForm} className="link">Request another email</button> or <Link href="/users/register">Create an account</Link></p>
              </div>
            }
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Reset