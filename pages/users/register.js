import { useState } from 'react'; 
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';

const Register = () => {

  const router = useRouter();

  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passConf, setPassConf] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [termsAndPrivacy, setTermsAndPrivacy] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);

  const [notify, setNotification] = useState('');

  fire.auth()
  .onAuthStateChanged((user) => {
    if (user) {
      setLoggedIn(true)
      addUserDocument(user)
    } else {
      setLoggedIn(false)
    }
  })

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
      <h1>Sign up</h1>
      <p>Already got an account? <Link href="/users/login">Sign in</Link></p>

      {notify}
      <form onSubmit={handleLogin}>
        Email: <input type="text" value={userName} onChange={({target}) => setUsername(target.value)} /> 
        <br />
        Password: <input type="password" value={password} onChange={({target}) => setPassword(target.value)} /> 
        <br />
        Password conf: <input type="password" value={passConf} onChange={({target}) => setPassConf(target.value)} /> 
        <br />
        <p><input type="checkbox" onChange={() => setTermsAndPrivacy(!termsAndPrivacy)} checked={termsAndPrivacy} />I agree to the terms and privacy policy</p>
        <p><input type="checkbox" onChange={() => setReceiveEmails(!receiveEmails)} checked={receiveEmails} />I would like to receive emails about news and updates</p>
        <br />
        <button type="submit">Create account</button>
      </form>
    </div>
  )
}

export default Register