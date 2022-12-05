import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import { loadStripe } from '@stripe/stripe-js';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loader.json'
import Link from 'next/link';
import Header from '../../components/header/Header';
// import testResponse from './testResponse';
import { Container, Modal, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import ICONS from '../../components/icon/IconPaths';
import { UserContext } from '../_app';
import styles from '../settings/settings.module.scss'
import pageStyles from './template.module.scss'
import Image from 'next/image';
import UpgradeButton from '../settings/components/upgradeButton';

const Template = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const [profileUrl, setProfileUrl] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userResult, setUserResult] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');
  const [showBuildingOverlay, setShowBuildingOverlay] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [redirectToStripe, setRedirectToStripe] = useState(false);
  const [showBuildingOverlayContentOne, setShowBuildingOverlayContentOne] = useState(true);
  const [showBuildingOverlayContentTwo, setShowBuildingOverlayContentTwo] = useState(false);

  const [product, setProduct] = useState('');
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelAt, setCancelAt] = useState('');

  const [urlError, setUrlError] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  const handleUpsellClose = () => setShowUpsellModal(false);
  const handleUpsellShow = () => setShowUpsellModal(true);

  const [saving, setSaving] = useState('');

  const [templateChanged, setTemplateChanged] = useState(false);
  const [templateSelection, setTemplateSelection] = useState('');
  const [buildingMessage, setBuildingMessage] = useState('Building your profile');

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
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

  async function handleUpgrade(e, user) {
    e.preventDefault();
    setRedirectToStripe(true);
    const docRef = await fire.firestore()
      .collection('users')
      .doc(userData.uid)
      .collection('checkout_sessions')
      .add({
        price: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
        success_url: window.location.origin + '/setup/template?upgrade=success',
        cancel_url: window.location.origin + '/setup/template?upgrade=cancelled',
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

  const changeTemplate = (template) => {
    if (template.premium) {
      if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
        setTemplateChanged(true)
        setTemplateSelection(template.string)
      } else {
        setShowUpsellModal(true)
      }
    } else {
      setTemplateChanged(true)
      setTemplateSelection(template.string)
    }
  }

  let templates = [
    {
      'id': 0,
      'label': 'Original',
      'string': 'original',
      'img': '/images/profile-preview.png',
      'active': templateSelection == 'original',
      'premium': false
    },
    {
      'id': 1,
      'label': 'Bento',
      'string': 'bento',
      'img': '/images/bento-template.jpg',
      'active': templateSelection == 'bento',
      'premium': true
    },
    {
      'id': 2,
      'label': 'Metro',
      'string': 'metro',
      'img': '/images/metro-template.jpeg',
      'active': templateSelection == 'metro',
      'premium': false
    },
    {
      'id': 3,
      'label': 'Metro Night',
      'string': 'metro_night',
      'img': '/images/metro-night-template.jpeg',
      'active': templateSelection == 'metro_night',
      'premium': false
    },
    {
      'id': 4,
      'label': 'Document',
      'string': 'document',
      'img': '/images/document-template.jpeg',
      'active': templateSelection == 'document',
      'premium': false
    },
  ]

  const handleShowBuildingOverlay = () => {
    document.body.style.overflowY = "hidden";
    setShowBuildingOverlay(true)
    setTimeout(
      () => setBuildingMessage('Sprinkling some magic'), 
      2000
    );
    setTimeout(
      () => setBuildingMessage('Applying finishing touches'), 
      4000
    );
    setTimeout(
      () => {
        setShowBuildingOverlayContentOne(false)
      },
      8000
    );
    setTimeout(
      () => {
        setShowBuildingOverlayContentTwo(true)
      },
      9000
    );
    setTimeout(
      () => {
        let newUserContext = userContext;
        newUserContext.stage = 'complete'
        newUserContext.template = templateSelection;
        setUserContext(newUserContext)
      },
      13000
    );
    setTimeout(
      () => {
        document.body.style.overflowY = "auto";
        router.push(currentProfile.profileUrl)
      },
      13001
    );

  }

  const handleSave = (e) => {
    e.preventDefault();

    if (!templateChanged) {
      setChoiceError('Please choose a template')
    }
    fire.firestore().collection('users').doc(userData.uid).update({
      'stage': 'complete',
      'template': templateSelection,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      handleShowBuildingOverlay()
    })
    // .then(() => {
    //   let newUserContext = userContext;
    //   newUserContext.stage = 'complete'
    //   newUserContext.template = templateSelection;
    //   setUserContext(newUserContext)
    // })
    // .then(() => {
    //   router.push(currentProfile.profileUrl)
    // })
    .catch((err) => {
      // console.log(err.code, err.message)
      toast(err.message)
    })
  }

  return (
    <div className="bg-light-900" style={{minHeight:'100vh'}}>
     
      <Head>
        <title>Choose a template</title>
      </Head>
      <Header hideShadow />
      <Container className="d-flex flex-column align-items-center py-5" style={{ maxWidth: "640px"}}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high text-center mb-2">Choose a template</h2>
          :
          <h3 className="text-dark-high text-center mb-2">Choose a template</h3>
        }
        <p className="large text-center" style={{maxWidth: '480px'}}>You can always change this later</p>
        <div className="w-100" style={{ maxWidth: "640px" }}>
          <div className="d-flex flex-column p-4 p-md-5 align-items-center" style={{gap: '16px'}}>
            {templates.map((template, index) => 
              <div role="button" onClick={() => changeTemplate(template)} className={`d-flex flex-column radius-3 p-3 w-100 ${styles.planCard} ${template.active && styles.active}`} style={{gap: '16px'}}>
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <p className="large font-weight-bold text-dark-high mb-0">{template.label}</p>
                  {template.premium && <div className="tag primary medium">Premium</div>}
                </div>
                <div className={styles.imageWrapper}>
                  <Image
                    src={template.img}
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
              </div>
            )}
            <div className="d-flex flex-column align-items-center my-4 my-sm-5 w-100">
              {screenWidth > 575 ?
                <button type="button" onClick={handleSave} className="btn primary high w-100" style={{maxWidth: '320px'}}disabled={!templateChanged || saving}>{!saving ? 'Create my profile' : 'Saving'}</button>
              :
                <button type="button" onClick={handleSave} className="btn primary high w-100" disabled={!templateChanged || saving}>{!saving ? 'Create my profile' : 'Saving'}</button>
              }
            </div>
          </div>
        </div>
      </Container>
      {showBuildingOverlay &&
      <div className="d-flex flex-column align-items-center justify-content-center position-fixed w-100 h-100" style={{top: 0, left:0}}>
        <div className={`d-flex flex-column align-items-center justify-content-center bg-primary-900 position-fixed ${pageStyles.overlayBackground}`} style={{ zIndex:2}}></div>
        { showBuildingOverlayContentOne &&
          <div className={`d-flex flex-column align-items-center justify-content-center position-fixed w-100 h-100 ${pageStyles.overlayContentOne}`} style={{top: 0, left:0, zIndex:3}}>
            <Lottie options={defaultOptions} height={160} width={160} />
            <h4 className="text-light-high text-center mb-3">{buildingMessage}</h4>
            {/* <button type="button" onClick={() => handleShowBuildingOverlay()}>Overflow hidden</button> */}
          </div>
        }
        { showBuildingOverlayContentTwo &&
          <div className={`d-flex flex-column align-items-center justify-content-center position-fixed w-100 h-100 ${pageStyles.overlayContentTwo}`} style={{top: 0, left:0, zIndex:2}}>
            <h4 className="text-light-high text-center mb-3">Welcome to your Vitaely profile</h4>
          </div>
        }
      </div>
      }
      <Modal 
        show={showUpsellModal} 
        onHide={handleUpsellClose}
        backdrop="static"
        keyboard={false}
        >
        <Modal.Body>
          <div>
            <h4 className="text-dark-high text-center mb-2">Spice up your profile</h4>
            <p className="text-center mb-4">Upgrade to get access to premium templates</p>
            <div className={`${styles.planCard} ${styles.active} radius-3 p-4 w-100 w-md-50 `}>
              <h5 className="text-primary-high mb-1">Premium</h5>
              <div className="d-flex align-items-end mb-4">
                <h4 className="text-dark-high mr-1 mb-0">$3</h4>
                <p className="text-dark-high mb-0">/month</p>
              </div>
              {[
                'All Basic features', 
                'Custom URL on vitaely.me domain', 
                'Premium templates',
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

export default Template