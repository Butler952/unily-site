import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import Link from 'next/link';
import { useRouter } from 'next/router'

const Header = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileUrl, setProfileUrl] = useState('/')
  const [windowUrl, setWindowUrl] = useState('')
  const router = useRouter();

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };


  useEffect(() => {
    setWindowUrl(window.location.pathname);
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
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
    <div className="card rounded-0 d-flex flex-row justify-content-between align-items-center p-2" style={props.hideShadow ? {boxShadow: 'none'} : null}>
      {(loggedIn && profileUrl !== '/') ? <div>
        <div className="d-flex">
          <Link href={profileUrl}>
            <a className="btn primary low small">Profile</a>
          </Link>
          <Link href="/settings">
            <a className="btn primary low small">Settings</a>
          </Link>
        </div>     
      </div>
        : null
      }
      {!loggedIn
        ?
        <div className="d-flex flex-row justify-content-between align-items-center w-100">
          <Link href="/">
            <a><img src={screenWidth > 767 ? "/images/vitaely-logo-full.svg" : "/images/vitaely-logo-icon.svg"} style={windowUrl === '/' ? {margin: '16px', height: '40px'} : {marginLeft: '16px', height: '32px'}}/></a>
          </Link>
          <div className="d-flex" style={{gap: '8px'}}>
            {screenWidth > 767 ? (
              <>
                <Link href="/blog">
                  <a className="btn dark low small">Blog</a>
                </Link> 
                <div className="bg-dark-300 mx-3" style={{width: '1px', height: '48px'}}></div>
              </>
            )
            : null }
           
            {/* <Link href="/users/register">
              <a className={`btn primary small ${windowUrl === '/' ? 'medium' : 'high'}`}>Register</a>
            </Link> */}
            <Link href="/users/login">
              <a className="btn primary medium small">Login</a>
            </Link>
            <Link href="/users/register">
              <a className="btn primary high small">Create my page</a>
            </Link>
          </div>
        </div>
        :
        <button className="btn primary low small" onClick={handleLogout}>Logout</button>
      }

    </div>
  )
}

export default Header;