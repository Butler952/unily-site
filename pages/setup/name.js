import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { Container, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
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
    document.body.style.background = '#FFFFFF';
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Name');
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
          router.push("/profile")
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
          let newUserContext = userContext;
          newUserContext.profile = {},
          newUserContext.profile.first_name = firstName,
          newUserContext.profile.last_name = lastName,
          newUserContext.profile.full_name = `${firstName} ${lastName}`,
          newUserContext.stage = '/setup/avatar';
          setUserContext(newUserContext)
        })
        .then(() => {
          if (currentProfile.receiveEmails) {
            fire.firestore().collection('mailingList').doc(userData.uid).update({
              first_name: firstName,
              last_name: lastName,
              'custom_fields.stage': '/setup/avatar',
              lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
            })
          }
        })
        .then(() => {
          mixpanel.init(mixpanelConfig); 
          mixpanel.track('Name added');
        })
        .then(() => {
          router.push('/setup/avatar')
        })
        .catch(error => console.log('error', error));
    }
  }

  const handleBack = (e) => {
    e.preventDefault();

    setSaving(true);

    fire.firestore().collection('users').doc(userData.uid).update({
      stage: '/setup/sync',
      lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.stage = '/setup/sync';
        setUserContext(newUserContext)
      })
      .then(() => {
        router.push('/setup/sync')
      })
      .catch(error => console.log('error', error));
  }

  return (
    <div className="bg-light-900" style={{minHeight:'100vh'}}>
     
      <Head>
        <title>What’s your name?</title>
      </Head>
      <Header hideShadow />

      <Container className="d-flex flex-column align-items-start my-5 py-5" style={{ maxWidth: "560px"}}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high mb-2">Your name</h2>
          :
          <h3 className="text-dark-high mb-2">Your name</h3>
        }
        <p className="large" style={{maxWidth: '560px'}}>This will be displayed on your page</p>

        {/* <div className="card m-auto" style={{ maxWidth: "640px" }}> */}
        <div className="d-flex flex-column w-100 my-4" style={{maxWidth: '560px'}}>
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
                <div className="d-flex flex-column flex-sm-row align-items-start justify-content-between my-4 my-sm-5 gap-3">
                  <button type="submit" className="btn primary high w-100 w-sm-auto order-0 order-sm-1" disabled={saving}>{!saving ? 'Continue' : 'Saving'}</button>
                  {screenWidth > 575 ?
                    <button type="button" onClick={(e) => handleBack(e)} disabled={saving} className="btn dark medium icon-only mr-3">
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.ARROW_LEFT}></path>
                      </svg>
                    </button>
                  :
                    <button type="button" onClick={(e) => handleBack(e)} disabled={saving} className="btn dark medium w-100 w-sm-auto order-1 order-sm-0">Back</button>
                  }
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