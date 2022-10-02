import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import { loadStripe } from '@stripe/stripe-js';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loader.json'
import Link from 'next/link';
import Header from '../../components/header/Header';
// import testResponse from './testResponse';
import styles from '../settings/settings.module.scss'
import { Container, Modal, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import ICONS from '../../components/icon/IconPaths';
import { UserContext } from '../_app';
import { toast } from 'react-toastify';
import UpgradeButton from '../settings/components/upgradeButton';

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

  let domainType = selectedDomainType;

  useEffect(() => {
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
          getSubscription(user)
        } else {
          setLoggedIn(false)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const getSubscription = (user) => {
    var docRef = fire.firestore().collection('users').doc(user.uid).collection('subscriptions')
    //docRef.get()
    docRef.where("status", "==", "active").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setProduct(doc.data().items[0].plan.product)
          setActive(doc.data().items[0].plan.active)
          setStatus(doc.data().status)
          setCancelAtPeriodEnd(doc.data().cancel_at_period_end)
          setCancelAt(doc.data().cancel_at.seconds)
        });
      })
      .then(() => {
        // console.log('Retreived subscription data from database')
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })
  }

  const domainChange = (value) => {
    setDomain(value)
    setDomainChanged(true)
    setDomainError('')
  }

  const setSelectedDomainTypeChange = (value) => {
    setChoiceError('')
    setSelectedDomainType(value)
    setSelectedDomainTypeChanged(true)
    if (value == 'standard') {
      setDomainError('')
    }
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

    if (selectedDomainType == '') {
      setChoiceError('Please select an option')
    }

    if (selectedDomainType == 'personalised') {
      if (domainChanged && domain === '') {
        setDomainError('Domain cannot be empty')
        return null;
      } else {

        if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
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
                setDomainError('This URL is not available 😔')
              } else {
                fire.firestore().collection('users').doc(userData.uid).update({
                  'stage': '/setup/sync',
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
                  router.push('/setup/sync')
                })
                .catch((err) => {
                  // console.log(err.code, err.message)
                  toast(err.message)
                })
              }
            })
        } else {
          handleUpsellShow()
        }
      }
    }
    if (selectedDomainType == 'standard') {
      setSaving(true)

      fire.firestore().collection('users').doc(userData.uid).update({
        'stage': '/setup/sync',
        'profileUrl': `/profile/${defaultDomain}`,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then(() => {
          fire.firestore()
          .collection('redirects')
          .doc(userData.uid)
          .delete()
          .catch((err) => {
            toast(err.message)
          })
        })
        .then(() => {
          let newUserContext = userContext;
          newUserContext.profileUrl = `/profile/${defaultDomain}`;
          setUserContext(newUserContext)
        })
        .then(() => {
          router.push('/setup/sync')
        })
        .catch((err) => {
          // console.log(err.code, err.message)
          toast(err.message)
        })
    }
  }

  async function handleUpgrade(e, user) {
    e.preventDefault();
    setRedirectToStripe(true);
    const docRef = await fire.firestore()
      .collection('users')
      .doc(userData.uid)
      .collection('checkout_sessions')
      .add({
        price: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
        success_url: window.location.origin + '/setup/handle?upgrade=success',
        cancel_url: window.location.origin + '/setup/handle?upgrade=cancelled',
      });
    // Wait for the CheckoutSession to get attached by the extension
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        // Show an error to your customer and 
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        // We have a session, let's redirect to Checkout
        // Init Stripe
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);
        stripe.redirectToCheckout({ sessionId });
      }
    });
  }
  // Dev Premium Subscription End

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div>
     
      <Head>
        <title>Choose your profile handle</title>
      </Head>

      <Container className="py-5">
        <div className="card m-auto" style={{ maxWidth: "640px" }}>
          <div className="py-4 px-4 px-md-5">
            <h5 className="text-dark-high mb-0">Choose your profile handle</h5>
          </div>
          <hr className="m-0" />
          <div className="d-flex flex-column p-4 p-md-5" style={{ gap: '16px' }}>
            <div role="button" onClick={() => { setSelectedDomainTypeChange('standard') }} className={`d-flex flex-column radius-3 p-4 w-100 ${styles.planCard} ${domainType == 'standard' ? styles.active : null}`}>
              <p className="large text-dark-high mb-0">Standard</p>
              <p className="text-dark-low mb-0">Standard profile URL on the vitaely.me domain</p>
              <p className="small text-dark-med mt-2 mb-0">vitaely.me/profile/{defaultDomain}</p>
              {/* <div className="mt-3">
                <input type="text" className="small w-100" value={domain} onChange={({ target }) => domainChange(target.value)} />
                <p className="small text-dark-med mt-2 mb-0">vitaely.me/profile/{domain}</p>
              </div> */}
            </div>
            <div role="button" onClick={() => { setSelectedDomainTypeChange('personalised') }} className={`d-flex flex-column radius-3 p-4 w-100 ${styles.planCard} ${domainType == 'personalised' ? styles.active : null}`}>
              <p className="large text-dark-high mb-0">Personalised</p>
              <p className="text-dark-low mb-0">Choose a custom URL on the vitaely.me domain</p>
              <div className="mt-3">
                <input
                  type="text"
                  className={`small w-100 ${domainError !== '' ? 'error' : null}`}
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
                <p className="small text-dark-med mt-2 mb-0">vitaely.me/
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
            {choiceError !== '' ? <p className="small text-error-high mt-2 mb-0">{choiceError}</p> : null}
            <div className="mt-4">
              <button type="button" onClick={handleSave} className="btn primary high w-100 w-md-auto" disabled={saving}>{!saving ? 'Continue' : 'Saving'}</button>
            </div>
          </div>
        </div>
      </Container>
      <Modal 
        show={showUpsellModal} 
        onHide={handleUpsellClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div>
            <h4 className="text-dark-high text-center mb-3">Make your profile your own</h4>
            <p className="text-center mb-4">Upgrade to Premium to customise your profile URL</p>
            <div className={`${styles.planCard} ${styles.active} radius-3 p-4 w-100 w-md-50 `}>
              <h5 className="text-primary-high mb-1">Premium</h5>
              <div className="d-flex align-items-end mb-4">
                <h4 className="text-dark-high mr-1 mb-0">$3</h4>
                <p className="text-dark-high mb-0">/month</p>
              </div>
              {[
                'All Basic features', 
                'Custom URL on vitaely.me domain', 
                'Logos for experience and education',
                'Unlimited re-syncing', 
                'More coming soon'
              ].map((feature, index) =>
                <div key={index} className="d-flex mt-2">
                  <svg viewBox="0 0 24 24" width={'24px'} className="mr-2 fill-dark-900" style={{minWidth: '24px'}}>
                    <path d={ICONS.CHECK}></path>
                  </svg>
                  <p className="text-dark-high font-weight-medium mb-0">{feature}</p>
                </div>
              )}
              <UpgradeButton handleUpgrade={handleUpgrade} />
            </div>
            <button type="button" className="btn dark low small w-100 mt-3" onClick={handleUpsellClose}>Not right now</button>
            {/*<div className="d-flex align-items-center jusify-content-start flex-column flex-md-row">
              <button type="button" className="btn primary high w-100 w-md-auto" onClick={handleUpdate}>Upgrade</button>
              <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleClose}>Close</button>
            </div>*/}
          </div>
        </Modal.Body>
      </Modal>
      {redirectToStripe ? (
          <div className="bg-light-900 position-fixed w-100 h-100" style={{ top: 0, left: 0, zIndex: 1100 }}>
            <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
              <Lottie options={defaultOptions} height={160} width={160} />
              <p>Redirecting to Stripe checkout</p>
            </div>
          </div>
        )
          : null}
    </div>
  )

}

export default Handle