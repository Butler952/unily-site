import { useState, useEffect } from 'react'; 
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';

const Register = () => {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passConf, setPassConf] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [termsAndPrivacy, setTermsAndPrivacy] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);

  const [notify, setNotification] = useState('');

  useEffect(() => {
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
      receiveEmails,
      email: user.email,
      stage: '/setup/sync'
    })
    .then(() => {
      router.push("/setup/sync")
    })
  }

  const handleLogin = (e) => {
    e.preventDefault();

    if (password !== passConf) {
      setNotification('Password and password confirmation does not match')

      setTimeout(() => {
        setNotification('')
      }, 2000)

      setPassword('');
      setPassConf('');
      return null;

    }

    if (!termsAndPrivacy) {
      setNotification('Please accept the terms and conditions')

      setTimeout(() => {
        setNotification('')
      }, 2000)

      return null;

    }

    fire.auth()
      .createUserWithEmailAndPassword(userName, password)
      .catch((err) => {
        console.log(err.code, err.message)
      })
  }

  return (
    <div>
      <Header/>
      <Container className="py-5">
        <div className="card m-auto" style={{maxWidth: "640px"}}>
          <div className="py-4 px-5">
            <p className="extra-large text-dark-high mb-0">Sign up</p>
          </div>
          <hr className="m-0"/>
          <div className="p-5">
            <p className="mb-4">Already got an account? <Link href="/users/login">Sign in</Link></p>
            {notify}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <p className="large text-dark-high">Email</p>
                <input type="text" className="w-100" value={username} onChange={({target}) => setUsername(target.value)} />
              </div>
              <div className="mb-4">
                <p className="large text-dark-high">Password</p>
                <input type="password" className="w-100" value={password} onChange={({target}) => setPassword(target.value)} />
              </div>
              <div className="mb-4">
                <p className="large text-dark-high">Confirm password</p>
                <input type="password" className="w-100" value={passConf} onChange={({target}) => setPassConf(target.value)} />
              </div>
              <label class="checkbox-container small mb-4">I agree to the terms and privacy policy
                <input type="checkbox" onChange={() => setTermsAndPrivacy(!termsAndPrivacy)} checked={termsAndPrivacy}></input>
                <span class="checkmark"></span>
              </label>
              <label class="checkbox-container small mb-4">I would like to receive emails about news and updates
                <input type="checkbox" onChange={() => setReceiveEmails(!receiveEmails)} checked={receiveEmails}></input>
                <span class="checkmark"></span>
              </label>
               <br />
              <button type="submit" className="btn primary high">Create account</button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Register