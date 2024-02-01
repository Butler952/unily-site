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

const Headline = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const [saving, setSaving] = useState(false);
  const [headline, setHeadline] = useState('');
  const [headlineError, setHeadlineError] = useState('');
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
    mixpanel.track('Headline');
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

  const headlineChange = (value) => {
    setHeadline(value),
    setHeadlineError('')
  }

  // Comment: Before Template changes
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   setSaving(true);

  //   if (headline === '') {
  //     setHeadlineError('Please enter a headline')
  //     setSaving(false)
  //   } else {

  //     fire.firestore().collection('users').doc(userData.uid).update({
  //       'profile.headline': headline,
  //       stage: 'complete',
  //       template: 'freelance',
  //       lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
  //     })
  //       .then(() => {
  //         let newUserContext = userContext;
  //         newUserContext.profile.headline = headline,
  //         newUserContext.stage = 'complete',
  //         newUserContext.template = 'freelance'
  //         setUserContext(newUserContext)
  //       })
  //       .then(() => {
  //         mixpanel.init(mixpanelConfig); 
  //         mixpanel.track('Headline added');
  //       })
  //       .then(() => {
  //         router.push(userContext.profileUrl !== '' ? userContext.profileUrl : userData.profileUrl)
  //         // router.push(
  //         //   userContext &&
  //         //   userContext.profileUrl &&
  //         //   userContext.profileUrl ||
  //         //   userData.profileUrl)
  //       })
  //       .catch(error => console.log('error', error));
  //   }
  // }

  const handleSubmit = (e) => {
    e.preventDefault();

    setSaving(true);

    if (headline === '') {
      setHeadlineError('Please enter a headline')
      setSaving(false)
    } else {

      fire.firestore().collection('users').doc(userData.uid).update({
        'profile.headline': headline,
        stage: '/setup/template',
        lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
      })
        .then(() => {
          let newUserContext = userContext;
          newUserContext.profile.headline = headline,
          newUserContext.stage = '/setup/template',
          setUserContext(newUserContext)
        })
        .then(() => {
          if (currentProfile.receiveEmails) {
            fire.firestore().collection('mailingList').doc(userData.uid).update({
              'custom_fields.stage': '/setup/template',
              lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
            })
          }
        })
        .then(() => {
          mixpanel.init(mixpanelConfig); 
          mixpanel.track('Headline added');
        })
        .then(() => {
          //Comment: before Styling
          // router.push(userContext.profileUrl !== '' ? userContext.profileUrl : userData.profileUrl)
          router.push('/setup/template')
          // router.push(
          //   userContext &&
          //   userContext.profileUrl &&
          //   userContext.profileUrl ||
          //   userData.profileUrl)
        })
        .catch(error => console.log('error', error));
    }
  }

  const handleBack = (e) => {
    e.preventDefault();

    setSaving(true);

    fire.firestore().collection('users').doc(userData.uid).update({
      stage: '/setup/avatar',
      lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.stage = '/setup/avatar';
        setUserContext(newUserContext)
      })
      .then(() => {
        if (currentProfile.receiveEmails) {
          fire.firestore().collection('mailingList').doc(userData.uid).update({
            'custom_fields.stage': '/setup/avatar',
            lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
          })
        }
      })
      .then(() => {
        router.push('/setup/avatar')
      })
      .catch(error => console.log('error', error));
  }

  return (
    <div className="bg-light-900" style={{minHeight:'100vh'}}>
     
      <Head>
        <title>Your headline</title>
      </Head>
      <Header hideShadow />

      <Container className="d-flex flex-column align-items-left my-5 py-5" style={{ maxWidth: "560px"}}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high mb-3">Your headline</h2>
          :
          <h3 className="text-dark-high mb-3">Your headline</h3>
        }
        <p className="large" style={{maxWidth: '560px'}}>Write a short headline for your page. This should be a very short statement of who you are or what you do.</p>
        {/* <div className="card m-auto" style={{ maxWidth: "640px" }}> */}
        <div className="d-flex flex-column w-100 my-4" style={{maxWidth: '560px'}}>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column w-100 gap-4">
              <div>
                <textarea type="text" className={headlineError !== '' ? `error w-100` : `w-100`} value={headline} onChange={({ target }) => headlineChange(target.value)} placeholder="Headline" />
                {headlineError !== '' ? <p className="small text-error-high mt-2 mb-0">{headlineError}</p> : <p className="small text-dark-low mt-2 mb-0">E.g. “Product Designer & Indiemaker” or “I can help you land more leads.”</p>}
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
                {/* <div className="d-flex flex-column gap-3">
                  <button type="submit" className="btn primary high" disabled={saving}>{!saving ? 'Continue' : 'Saving'}</button>
                </div> */}
              </div>
            </div>
            <br />
          </form>
        </div>
      </Container>
    </div>
  )

}

export default Headline