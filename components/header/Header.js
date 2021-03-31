import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import Link from 'next/link';
import { useRouter } from 'next/router'

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileUrl, setProfileUrl] = useState('/')
  const [windowUrl, setWindowUrl] = useState('')
  const router = useRouter();


  useEffect(() => {
    setWindowUrl(window.location.pathname);
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setLoggedIn(true)
          loggedInRoute(user)
        } else {
          setLoggedIn(false)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const loggedInRoute = (user) => {
    var docRef = fire.firestore().collection('users').doc(user.uid)

    docRef.get().then((doc) => {
      if (doc.exists) {
        if (doc.data().stage !== 'complete') {
          router.push(doc.data().stage)
        }
        if (doc.data().profileUrl) {
          setProfileUrl(doc.data().profileUrl)
        }
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    })
  }

  const handleLogout = () => {
    fire.auth()
      .signOut()
      .then(() => {
        router.push("/")
      });
  }

  return (
    <div className="card rounded-0 d-flex flex-row justify-content-between align-items-center p-2" style={windowUrl === '/' ? {boxShadow: 'none'} : null}>
      <div>
        {(loggedIn && profileUrl !== '/') ? 
          <div className="d-flex">
            <Link href={profileUrl}>
              <a className="btn primary low small">Profile</a>
            </Link>
            <Link href="/settings">
              <a className="btn primary low small">Settings</a>
            </Link>
          </div>
            : null
        }
      </div>
      {!loggedIn
        ?
        <div className="d-flex">
          <Link href="/users/register">
            <a className={`btn primary small ml-2' ${windowUrl === '/' ? 'medium' : 'high'}`}>Register</a>
          </Link>
          <Link href="/users/login">
            <a className="btn primary low small ml-2">Login</a>
          </Link>
        </div>
        :
        <button className="btn primary low small" onClick={handleLogout}>Logout</button>
      }

    </div>
  )
}

export default Header;