import { useEffect, useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from '../../pages/_app';
import pageStyles from '../../pages/setup/styling.module.scss'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import UpgradeButton from 'pages/settings/components/upgradeButton';
import { loadStripe } from '@stripe/stripe-js';
import Lottie from 'react-lottie';
import animationData from '/components/animations/loader.json'
import { Modal } from 'react-bootstrap';
import ICONS from 'components/icon/IconPaths';

const Template = ({
  user,
  handleEditProfileChangeView,
  template,
  setTemplate,
  templateChanged,
  setTemplateChanged
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [redirectToStripe, setRedirectToStripe] = useState(false);

  const [uid, setUid] = useState('');

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
          setUid(user.uid)
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

  let templates = [
    {
      "id": uuidv4(),
      'label': 'Original',
      'string': 'original',
      'img': '/images/profile-preview.jpeg',
      'active': !templateChanged ? userContext?.template == 'original' || !userContext?.template : template == 'original',
      // 'active': 
      //   templateChanged ? 
      //   !userContext.template ||
      //   userContext &&
      //   userContext.template && 
      //   userContext.template == 'original'
      //   :
      //   !template || template == 'original',
      'premium': false
    },
    {
      "id": uuidv4(),
      'label': 'Bento',
      'string': 'bento',
      'img': '/images/bento-template.jpeg',
      'active': !templateChanged ? userContext?.template == 'bento' : template == 'bento',
      'premium': true
    },
    {
      "id": uuidv4(),
      'label': 'Staccato',
      'string': 'staccato',
      'img': '/images/staccato-template.jpeg',
      'active': !templateChanged ? userContext?.template == 'staccato' : template == 'staccato',
      'premium': true
    },
    {
      "id": uuidv4(),
      'label': 'Metro',
      'string': 'metro',
      'img': '/images/metro-template.jpeg',
      'active': !templateChanged ? userContext?.template == 'metro' : template == 'metro',
      'premium': false
    },
    {
      "id": uuidv4(),
      'label': 'Metro Night',
      'string': 'metro_night',
      'img': '/images/metro-night-template.jpeg',
      'active': !templateChanged ? userContext?.template == 'metro_night' : template == 'metro_night',
      'premium': false
    },
    {
      "id": uuidv4(),
      'label': 'Document',
      'string': 'document',
      'img': '/images/document-template.jpeg',
      'active': !templateChanged ? userContext?.template == 'document' : template == 'document',
      'premium': false
    },
  ]

  // const templateChange = (value) => {
  //   setTemplate(value),
  //   setTemplateChanged(true)
  // }

  // value={aboutChanged ? about : (userContext.profile.summary !== undefined ? userContext.profile.summary : '')}


  const changeTemplate = (template) => {
    if (template.premium) {
      if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
        setTemplateChanged(true)
        setTemplate(template.string)
      } else {
        setShowUpsellModal(true)
      }
    } else {
      setTemplateChanged(true)
      setTemplate(template.string)
    }
  }

  const handleSave = (e) => {
    e.preventDefault();

    setSubmitting(true)

    fire.firestore().collection('users').doc(user).update({
      'template': !templateChanged ? userContext?.template : template,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        handleEditProfileChangeView('default')
        setSubmitting(false)
        toast("Template updated")
      })
      .catch((error) => {
        setSubmitting(false)
        toast("Unable to update template")
        //console.error("Error adding document: ", error);
      });
  }

  async function handleUpgrade(e, user) {
    e.preventDefault();
    setRedirectToStripe(true);
    const docRef = await fire.firestore()
      .collection('users')
      .doc(uid)
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
    <>
      <div className="p-4">
        <div className="d-flex flex-column w-100 mb-3 gap-3">

          {templates.map((template, index) => 
            <div key={index} role="button" onClick={() => changeTemplate(template)} className={`d-flex flex-column radius-3 p-3 w-100 ${pageStyles.planCard} ${template.active && pageStyles.active}`} style={{gap: '16px'}}>
              <label className="checkbox-container mb-4">
                <input type="checkbox" checked={template.active} />
                <span className="checkmark"></span>
              </label>
              <div className={pageStyles.imageWrapper}>
                <Image
                  src={template.img}
                  layout='fill'
                  objectFit='cover'
                />
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center">
                <h6 className="mb-0">{template.label}</h6>
                {template.premium && <div className="tag primary medium">Premium</div>}
              </div>
            </div>
          )}

          {/* {templates.map((template, index) => 
            <div key={index} role="button" onClick={() => changeTemplate(template)} className={`d-flex flex-column radius-3 p-3 w-100 ${pageStyles.planCard} ${template.active && pageStyles.active}`} style={{gap: '16px'}}>
              <label className="checkbox-container mb-4">
                <input type="checkbox" checked={template.active} />
                <span className="checkmark"></span>
              </label>
              <div className={pageStyles.imageWrapper}>
                <Image
                  src={template.img}
                  layout='fill'
                  objectFit='cover'
                />
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center">
                <h6 className="mb-0">{template.label}</h6>
              </div>
            </div>
          )} */}
        </div>
        <div className="d-flex flex-row justify-content-end">
          <button type="button" onClick={handleSave} className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Save' : 'Saving...'}</button>
        </div>
      </div>
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
            <div className={`${pageStyles.planCard} ${pageStyles.active} radius-3 p-4 w-100 w-md-50 `}>
              <h5 className="text-primary-high mb-1">Premium</h5>
              <div className="d-flex align-items-end mb-4">
                <h4 className="text-dark-high mr-1 mb-0">$3</h4>
                <p className="text-dark-high mb-0">/month</p>
              </div>
              {[
                'All Basic features', 
                'Connect your own domain', 
                'Premium templates',
                'More coming soon'
              ].map((feature, index) =>
                <div key={index} className="d-flex mt-2">
                  <svg viewBox="0 0 24 24" width={'24px'} className="mr-2 fill-dark-900" style={{minWidth: '24px'}}>
                    <path d={ICONS.CHECK}></path>
                  </svg>
                  <p className="text-dark-high mb-0">{feature}</p>
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
    </>
  )
}

export default Template;