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

  const headlineChange = (value) => {
    setHeadline(value),
    setHeadlineError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setSaving(true);

    if (headline === '') {
      setHeadlineError('Please enter a headline')
      setSaving(false)
    } else {

      fire.firestore().collection('users').doc(userData.uid).update({
        'profile.headline': headline,
        stage: 'complete',
        template: 'freelance',
        lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
      })
        .then(() => {
          setUserContext({
            'profile.headline': headline,
            stage: 'complete',
            template: 'freelance'
          })
        })
        .then(() => {
          router.push(userContext.profileUrl ? userContext.profileUrl : userData.profileUrl)
          // router.push(
          //   userContext &&
          //   userContext.profileUrl &&
          //   userContext.profileUrl ||
          //   userData.profileUrl)
        })
        .catch(error => console.log('error', error));
    }
  }

  return (
    <div className="bg-light-900" style={{minHeight:'100vh'}}>
     
      <Head>
        <title>Your headline</title>
      </Head>
      <Header hideShadow />

      <Container className="d-flex flex-column align-items-left py-5" style={{ maxWidth: "480px"}}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high mb-3">Your headline</h2>
          :
          <h3 className="text-dark-high mb-3">Your headline</h3>
        }
        <p className="large" style={{maxWidth: '480px'}}>Write a short headline for your page. This should be a very short statement of who you are or what you do.</p>

        {/* <div className="card m-auto" style={{ maxWidth: "640px" }}> */}
        <div className="d-flex flex-column w-100 my-4" style={{maxWidth: '480px'}}>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column w-100 gap-4">
              <div>
                <textarea type="text" className={headlineError !== '' ? `error w-100` : `w-100`} value={headline} onChange={({ target }) => headlineChange(target.value)} placeholder="Headline" />
                {headlineError !== '' ? <p className="small text-error-high mt-2 mb-0">{headlineError}</p> : <p className="small text-dark-low mt-2 mb-0">E.g. “Product Designer & Indiemaker” or “I can help you to align strategy and sales.”</p>}
              </div>
              <div className="d-flex flex-column mb-4 mb-sm-5 gap-3">
                <div className="d-flex flex-column gap-3">
                  <button type="submit" className="btn primary high" disabled={saving}>{!saving ? 'Continue' : 'Saving'}</button>
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

export default Headline