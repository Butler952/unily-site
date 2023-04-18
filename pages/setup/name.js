import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { Container, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import ICONS from '../../components/icon/IconPaths';
import { UserContext } from '../_app';

const Name = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userResult, setUserResult] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');

  const [urlError, setUrlError] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setLoggedIn(true)
          loggedInRoute(user)
          setUserData(user)
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
      setCurrentProfile(doc.data())
      if (doc.exists) {
        if (doc.data().stage !== 'complete') {
          router.push(doc.data().stage)
        } else {
          router.push(doc.data().profileUrl)
        }
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    })
  }

  const firstNameChange = (value) => {
    setFirstName(value),
    setFirstNameError('')
  }
  const lastNameChange = (value) => {
    setLastName(value),
    setLastNameError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setSaving(true);

    if (firstName === '') {
      setFirstNameError('Please enter a first name')
      setSaving(false)
    } else if (lastName === '') {
      setLastNameError('Please enter a last name')
      setSaving(false)
    } else {

      fire.firestore().collection('users').doc(userData.uid).update({
        profile: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`
        },
        stage: '/setup/avatar',
        lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
      })
        .then(() => {
          setUserContext({
            stage: '/setup/avatar',
            template: 'freelance'
          })
        })
        .then(() => {
          router.push('/setup/avatar')
        })
        .catch(error => console.log('error', error));
    }
  }

  return (
    <div className="bg-light-900" style={{minHeight:'100vh'}}>
     
      <Head>
        <title>What’s your name?</title>
      </Head>
      <Header hideShadow />

      <Container className="d-flex flex-column align-items-center py-5" style={{ maxWidth: "640px"}}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high text-center mb-2">What’s your name?</h2>
          :
          <h3 className="text-dark-high text-center mb-2">What’s your name?</h3>
        }
        <p className="large text-center" style={{maxWidth: '480px'}}>This will be displayed on your page</p>

        {/* <div className="card m-auto" style={{ maxWidth: "640px" }}> */}
        <div className="d-flex flex-column w-100 my-4" style={{maxWidth: '480px'}}>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column w-100 gap-4">
              <div>
                <input type="text" className={firstNameError !== '' ? `error w-100` : `w-100`} value={firstName} onChange={({ target }) => firstNameChange(target.value)} placeholder="First name" />
                {firstNameError !== '' && <p className="small text-error-high mt-2 mb-0">{firstNameError}</p> }
              </div>
              <div>
                <input type="text" className={lastNameError !== '' ? `error w-100` : `w-100`} value={lastName} onChange={({ target }) => lastNameChange(target.value)} placeholder="Last name" />
                {lastNameError !== '' && <p className="small text-error-high mt-2 mb-0">{lastNameError}</p> }
              </div>
              <div className="d-flex flex-column mb-4 mb-sm-5 gap-3">
                <div className="d-flex flex-column gap-3">
                  <button type="submit" className="btn primary high w-100" disabled={saving}>{!saving ? 'Continue' : 'Saving'}</button>
                </div>
              </div>
            </div>
            <br />
          </form>
        </div>
      </Container>
    </div>
  )

}

export default Name