import { useState, useContext, useEffect } from 'react';
import fire from '../../../config/fire-config';
import ICONS from '../../../components/icon/IconPaths';
import { Modal } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import styles from '../settings.module.scss'
import Image from 'next/image'
import { toast } from 'react-toastify';
import { UserContext } from '../../_app';
import UpgradeButton from './upgradeButton';
import { loadStripe } from '@stripe/stripe-js';
import Lottie from 'react-lottie';
import animationData from '../../../components/animations/loader.json'

const TemplateSection = ({
  userData,
  allUserData
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const [notificationRequested, setNotificationRequested] = useState(false);

  const [templateChanged, setTemplateChanged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [templateSelection, setTemplateSelection] = useState(userContext.template);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [redirectToStripe, setRedirectToStripe] = useState(false);

  const [product, setProduct] = useState('');
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelAt, setCancelAt] = useState('');

  useEffect(() => {
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          getSubscription(user)
        } else {
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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const handleUpsellClose = () => setShowUpsellModal(false);
  const handleUpsellShow = () => setShowUpsellModal(true);

  const handleClose = () => {
    setShowModal(false)
  };
  const handleShow = () => setShowModal(true);

  const handleClick = () => {
    // Send mixpanel event for PDF Download
    mixpanel.init(mixpanelConfig); 
    mixpanel.track("False door", {
      "experiment": "Templates",
      "stage": "click",
    });
    handleShow()
  }

  const handleNotifyMe = () => {
    // make new document in 
    setSendingData(true)
      fire.firestore().collection('falseDoors').doc('templates').collection('responses').add({
        userId: userData.uid,
        requestedAt: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        mixpanel.init(mixpanelConfig); 
        mixpanel.track("False door", {
          "experiment": "Templates",
          "stage": "notify",
        });
        setSendingData(false)
        setNotificationRequested(true)
      })
      .catch((err) => {
        console.log(err.code, err.message)
        toast(err.message)
      })
  }

  let templates = [
    {
      'id': 0,
      'label': 'Original',
      'string': 'original',
      'img': '/images/profile-preview.png',
      'active': 
        templateChanged ? 
        !userContext.template ||
        userContext &&
        userContext.template && 
        userContext.template == 'original'
        :
        allUserData &&
        !allUserData.template ||
        allUserData &&
        allUserData.template && 
        allUserData.template == 'original',
      'premium': false
    },
    {
      'id': 1,
      'label': 'Bento',
      'string': 'bento',
      'img': '/images/bento-template.jpg',
      'active':     
        templateChanged ?    
        userContext &&
        userContext.template && 
        userContext.template == 'bento' 
        :
        allUserData &&
        allUserData.template && 
        allUserData.template == 'bento',
      'premium': true
    },
    {
      'id': 2,
      'label': 'Staccato',
      'string': 'staccato',
      'img': '/images/staccato-template.jpeg',
      'active':     
        templateChanged ?    
        userContext &&
        userContext.template && 
        userContext.template == 'staccato' 
        :
        allUserData &&
        allUserData.template && 
        allUserData.template == 'staccato',
      'premium': true
    },
    {
      'id': 3,
      'label': 'Metro',
      'string': 'metro',
      'img': '/images/metro-template.jpeg',
      'active':     
        templateChanged ?    
        userContext &&
        userContext.template && 
        userContext.template == 'metro' 
        :
        allUserData &&
        allUserData.template && 
        allUserData.template == 'metro',
      'premium': false
    },
    {
      'id': 4,
      'label': 'Metro Night',
      'string': 'metro_night',
      'img': '/images/metro-night-template.jpeg',
      'active':     
        templateChanged ?
        userContext &&
        userContext.template && 
        userContext.template == 'metro_night' 
        :
        allUserData &&
        allUserData.template && 
        allUserData.template == 'metro_night',
      'premium': false
    },
    {
      'id': 5,
      'label': 'Document',
      'string': 'document',
      'img': '/images/document-template.jpeg',
      'active':     
        templateChanged ?    
        userContext &&
        userContext.template && 
        userContext.template == 'document' 
        :
        allUserData &&
        allUserData.template && 
        allUserData.template == 'document',
      'premium': false
    },
  ]

  const updateTemplate = (template) => {
    setSubmitting(true)
      fire.firestore().collection('users').doc(userData.uid).update({
        template: template.string,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then((result) => {
        let newUserContext = userContext;
        newUserContext.template = template.string;
        setUserContext(newUserContext)
      })
      .then(() => {
        setSubmitting(false)
        setTemplateChanged(true)
        toast("Template updated")
      })
      .catch((err) => {
        console.log(err.code, err.message)
        //setNotification(err.message)
        toast(err.message)
      })
  }

  const changeTemplate = (template) => {
    if (template.premium) {
      if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
        updateTemplate(template)
      } else {
        setShowUpsellModal(true)
      }
    } else {
      updateTemplate(template)
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
        success_url: window.location.origin + '/settings?upgrade=success',
        cancel_url: window.location.origin + '/settings?upgrade=cancelled',
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

  return (
    <div>
      <div className="card mx-auto mb-5">
        <div className="p-4">
          <h5 className="text-dark-high mb-0">Template</h5>
          <p className="text-dark-low mb-0">Change the template for your profile</p>
        </div>
        <hr className="m-0"/>
        <div className="d-flex flex-column m-4" style={{gap: '16px'}}>
        
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

          {/* <div className={`d-flex flex-column radius-3 p-3 w-100 ${styles.planCard} ${styles.active}`}>
            <p className="large font-weight-bold text-dark-high">Original</p>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/profile-preview.png"
                layout='fill'
                objectFit='cover'
              />
            </div>
          </div>
          <div className={`d-flex flex-column radius-3 p-3 w-100 ${styles.planCard}`}>
            <p className="large font-weight-bold text-dark-high">Document</p>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/document-template.jpeg"
                layout='fill'
                objectFit='cover'
              />
            </div>
          </div> */}
          {/* <div className={`d-flex align-items-center justify-content-center radius-3 p-3 w-100 ${styles.planCard}`}>
            <button type="button" onClick={() => handleClick()} className="btn primary medium w-100 w-md-auto">Browse more</button>
          </div> */}
        </div>
        <hr className="m-0"/>
        <div className="m-4">
          <button type="button" onClick={() => handleClick()} className="btn primary medium w-100 w-md-auto">Browse more</button>
        </div>
      </div>
      <Modal 
        show={showModal} 
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        { !notificationRequested ?
          <Modal.Body>
            <div className="d-flex flex-column align-items-center">
              <div className="bg-primary-200 p-4 radius-5 mb-4" style={{width: 'fit-content'}}>
                <svg viewBox="0 0 24 24" style={{width: '64px'}}>
                  <path d={ICONS.BOLT} className="fill-primary-900"></path>
                </svg>
              </div>
              <div className="mx-auto" style={{maxWidth: '320px'}}>
                <h4 className="text-dark-high text-center mb-2">Wow, you're fast!</h4>
                <p className="text-center mb-4">Unfortunately our new templates are not quite ready yet</p>
              </div>
              <button type="button" className="btn primary high small w-100 mt-3" disabled={sendingData} onClick={() => handleNotifyMe()}>{ !sendingData ? 'Notify me when this is ready' : 'Saving...'}</button>
              <button type="button" className="btn dark low small w-100 mt-3" onClick={handleClose}>No thanks</button>
            </div>
          </Modal.Body>
        : 
          <Modal.Body>
            <div className="d-flex flex-column align-items-center">
              <div className="mx-auto">
                <h4 className="text-dark-high text-center mb-2">You're first in line</h4>
                <p className="text-center mb-4">Thanks for letting us know that you're interested. Once the feature is ready to go, you'll be the first to know!</p>
              </div>
              <button type="button" className="btn primary high small w-100 mt-3" onClick={handleClose}>Close</button>
            </div>
          </Modal.Body>
        }
      </Modal>
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

export default TemplateSection