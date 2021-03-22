import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import Link from 'next/link';
import { useRouter } from 'next/router'

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
        router.push(doc.data().stage)
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
    <div className="card rounded-0 d-flex flex-row justify-content-between align-items-center p-2">
      <Link href="/">
        <a className="btn primary low small"> Home</a>
      </Link>
      {!loggedIn
        ?
        <div className="d-flex">
          <Link href="/users/register">
            <a className="btn primary high small ml-2">Register</a>
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