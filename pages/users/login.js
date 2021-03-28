import { useState } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    fire.auth()
      .signInWithEmailAndPassword(username, password)
      .catch((err) => {

        console.log(err.code, err.message)
        setNotification(err.message)

        setTimeout(() => {
          setNotification('')
        }, 2000)
      })

    //setUsername('')
    //setPassword('')
  }

  return (
    <div>
      <Header/>
      <Container className="py-5">
        <div className="card m-auto" style={{maxWidth: "640px"}}>
          <div className="py-4 px-4 px-md-5">
            <h5 className="text-dark-high mb-0">Sign in</h5>
          </div>
          <hr className="m-0"/>
          <div className="p-4 p-md-5">
            <p className="mb-4">Not got an account? <Link href="/users/register">Sign up</Link></p>
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
              <br />
              <button type="submit" className="btn primary high">Login</button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  )

}

export default Login
