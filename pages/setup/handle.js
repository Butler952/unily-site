import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
// import testResponse from './testResponse';
import styles from '../settings/settings.module.scss'
import { Container, Modal, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import ICONS from '../../components/icon/IconPaths';
import { UserContext } from '../_app';
import { toast } from 'react-toastify';

const Handle = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const [profileUrl, setProfileUrl] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userResult, setUserResult] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');

  const [domain, setDomain] = useState('');
  const [domainChanged, setDomainChanged] = useState('');
  const [domainError, setDomainError] = useState('');
  const [defaultDomain, setDefaultDomain] = useState('');
  const [selectedDomainType, setSelectedDomainType] = useState('');
  const [selectedDomainTypeChanged, setSelectedDomainTypeChanged] = useState(false);
  const [saving, setSaving] = useState('');
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [product, setProduct] = useState('');
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelAt, setCancelAt] = useState('');
  const [redirectToStripe, setRedirectToStripe] = useState(false);
  const [choiceError, setChoiceError] = useState('');

  const [urlError, setUrlError] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  const handleUpsellClose = () => setShowUpsellModal(false);
  const handleUpsellShow = () => setShowUpsellModal(true);

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  let domainType = selectedDomainType;

  useEffect(() => {
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Handle');
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
    setDefaultDomain(userData && userData.uid)
    // setDomain(
    //   userContext && 
    //   userContext.profileUrl &&
    //   userContext.profileUrl.includes("profile") ?
    //     (userContext.profileUrl.split('/profile/')[1]) :
    //     userContext.profileUrl
    // )
    // setSelectedDomainType(
    //   userContext &&
    //     userContext.profileUrl &&
    //     userContext.profileUrl.includes("profile") ? 'standard' : 'personalised');
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setLoggedIn(true)
          loggedInRoute(user)
          setUserData(user)
          setDefaultDomain(user.uid)
        } else {
          setLoggedIn(false)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const domainChange = (value) => {
    setDomain(value)
    setDomainChanged(true)
    setDomainError('')
  }


  const loggedInRoute = (user) => {
    var docRef = fire.firestore().collection('users').doc(user.uid)

    docRef.get().then((doc) => {
      setCurrentProfile(doc.data())
      if (doc.exists) {
        router.push(doc.data().stage)
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    })
  }

  const urlChange = (value) => {
    setProfileUrl(value),
      setUrlError('')
  }

  const onUrlInvalid = () => {
    setUrlError('Please enter a valid LinkedIn URL')
  }

  let matchingUrls = []

  const handleSave = (e) => {
    e.preventDefault();

      if (domainChanged && domain === '') {
        setDomainError('Domain cannot be empty')
        return null;
      } else {

          setSaving(true)

          fire.firestore()
            .collection('users')
            .where("profileUrl", "==", `/${domain}`)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                matchingUrls = [...matchingUrls, doc.id];
              })
            })
            .then(() => {
              if ((matchingUrls && matchingUrls).length > 0) {
                setSaving(false)
                setDomainError('This handle is not available 😔')
              } else {
                fire.firestore().collection('users').doc(userData.uid).update({
                  'stage': '/setup/source',
                  'profileUrl': `/${domain}`,
                  lastUpdated: fire.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                  fire.firestore()
                  .collection('redirects')
                  .doc(userData.uid)
                  .set({ 
                    'source': `/profile/${defaultDomain}`, 
                    'destination': `/${domain}`,
                    'permanent': true
                  })
                  .catch((err) => {
                    toast(err.message)
                  })
                })
                .then(() => {
                  let newUserContext = userContext;
                  newUserContext.profileUrl = `/${domain}`;
                  setUserContext(newUserContext)
                })
               .then(() => {
                  router.push('/setup/source')
                })
                .catch((err) => {
                  // console.log(err.code, err.message)
                  toast(err.message)
                })
              }
            })
      }
  }


  return (
    <div className="bg-light-900" style={{minHeight:'100vh'}}>
     
      <Head>
        <title>Choose your profile handle</title>
      </Head>
      <Header hideShadow />

      <Container className="d-flex flex-column align-items-start py-5" style={{ maxWidth: "560px"}}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high mb-2">Choose your handle</h2>
          :
          <h3 className="text-dark-high mb-2">Choose your handle</h3>
        }
        <p className="large" style={{maxWidth: '560px'}}>Choose how people will find your profile</p>
        <form onSubmit={handleSave} className="w-100">
        <div className="d-flex flex-column pb-4 w-100" style={{ gap: '16px' }}>
          <div className={`d-flex flex-column w-100`}>
            {/* <p className="text-dark-low mb-0">Choose a custom URL on the expertpage.io domain</p> */}
            <div className="mt-3">
              <input
                type="text"
                className={`w-100 ${domainError !== '' ? 'error' : null}`}
                disabled={saving}
                value={domainChanged ? domain :
                  (
                    userContext &&
                      userContext.profileUrl &&
                      userContext.profileUrl.includes("profile") ?
                      userContext &&
                      userContext.profileUrl.split('/profile/')[1]
                      :
                      userContext &&
                      userContext.profileUrl &&
                      userContext.profileUrl.substring(1)
                  )
                }
                onChange={({ target }) => domainChange(target.value)}
              />
              <p className="small text-dark-med mt-2 mb-0" style={{lineBreak: 'anywhere'}}>expertpage.io/
                {domainChanged ? domain :
                  (
                    userContext &&
                      userContext.profileUrl &&
                      userContext.profileUrl.includes("profile") ?
                      userContext &&
                      userContext.profileUrl.split('/profile/')[1]
                      :
                      userContext &&
                      userContext.profileUrl &&
                      userContext.profileUrl.substring(1)
                  )
                }
              </p>
              {domainError !== '' ? <p className="small text-error-high mt-2 mb-0">{domainError}</p> : null}
            </div>
          </div>
          {/* {choiceError !== '' ? <p className="small text-error-high mt-2 mb-0">{choiceError}</p> : null} */}
        </div>
        {screenWidth > 575 ?
          <button type="submit" className="btn primary high" disabled={domain == '' || saving}>{!saving ? 'Continue' : 'Saving'}</button>
        :
          <button type="submit" className="btn primary high w-100" disabled={domain == '' || saving}>{!saving ? 'Continue' : 'Saving'}</button>
        }
        </form>
          </Container>
    
    </div>
  )

}

export default Handle