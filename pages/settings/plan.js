import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import moment from 'moment'
import ICONS from '../../components/icon/IconPaths';
import styles from './settings.module.scss'
import 'react-toastify/dist/ReactToastify.css';
import ManageButton from './components/manageButton';
import UpgradeButton from './components/upgradeButton';
import RenewButton from './components/renewButton';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import SettingsLayout from './components/settingsLayout';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loader.json'
import Head from 'next/head';

const Plan = () => {
  const router = useRouter();
  const [userData, setUserData] = useState('');
  const [allUserData, setAllUserData] = useState('');

  const [sectionsLoading, setSectionsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState('');
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelAt, setCancelAt] = useState('');
  const [redirectToStripe, setRedirectToStripe] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    mixpanel.init(mixpanelConfig);
    mixpanel.track('Settings');
    if (router.query.upgrade == 'success') {
      toast("Upgraded to Premium")
    }
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          loggedInRoute(user)
          getSubscription(user)
          setUserData(user)
        } else {
          router.push('/users/login')
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
        setAllUserData(doc.data())
      } else {
        console.log("No such document!");
      }
    })
      .then(() => {
        setSectionsLoading(false)
        //console.log('Retreived display info from database')
        //console.log('stripe product is' + process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM)
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })
  }

  const getSubscription = (user) => {
    var docRef = fire.firestore().collection('users').doc(user.uid).collection('subscriptions')
    //docRef.get()
    docRef.where("status", "==", "active").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setProduct(doc.data().items[0].plan.product)
          setActive(doc.data().items[0].plan.active)
          setStatus(doc.data().status)
          setCancelAtPeriodEnd(doc.data().cancel_at_period_end)
          setCancelAt(doc.data().cancel_at.seconds)
          // console.log(doc.id, " => ", doc.data());
          // console.log(doc.data().items[0].plan.product);
          // console.log(doc.data().items[0].plan.active)
          // prod_Jdg7o4VDoipc7d = Premium
          // prod_Jdg7ZdcmfuNm0P = Free
        });
      })
      .then(() => {
        // console.log('Retreived subscription data from database')
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })
  }

// Dev Premium Subscription Start
  
  /*async function handleUpgrade(e){
    e.preventDefault();
    const functionRef = fire.app().functions('europe-west2').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
    const { data } = await functionRef({ returnUrl: window.location.origin });
    window.location.assign(data.url);
  }*/

  async function handleUpgrade(e, user) {
    e.preventDefault();
    setRedirectToStripe(true);

    //New stripe checkout start
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
    docRef.onSnapshot((snap) => {
      const { error, url } = snap.data();
      if (error) {
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`);
      }
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
      }
    });
    //New stripe checkout end
    
    //Old stripe checkout start
      // const docRef = await fire.firestore()
      //   .collection('users')
      //   .doc(userData.uid)
      //   .collection('checkout_sessions')
      //   .add({
      //     price: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
      //     success_url: window.location.origin + '/settings?upgrade=success',
      //     cancel_url: window.location.origin + '/settings?upgrade=cancelled',
      //   });
      // // Wait for the CheckoutSession to get attached by the extension
      // docRef.onSnapshot(async (snap) => {
      //   const { error, sessionId } = snap.data();
      //   if (error) {
      //     // Show an error to your customer and 
      //     // inspect your Cloud Function logs in the Firebase console.
      //     alert(`An error occured: ${error.message}`);
      //   }
      //   if (sessionId) {
      //     // We have a session, let's redirect to Checkout
      //     // Init Stripe
      //     const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);
      //     stripe.redirectToCheckout({ sessionId });
      //   }
      // });
    // Old Stripe checkout end

  }
  // Dev Premium Subscription End

  // Customer Portal Start
  async function handleUpdate(e) {
    e.preventDefault();
    setRedirectToStripe(true);
    const functionRef = fire.app()
      .functions('europe-west2')
      .httpsCallable('ext-firestore-stripe-payments-createPortalLink');
    const { data } = await functionRef({
      returnUrl: window.location.origin + '/settings' 
    });
    window.location.assign(data.url);
  }
  // Customer Portal End

  const CurrentPlan = () => {
    return (
      <div className="tag primary medium">Current</div>
    )
  }

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
        <title>Plan | Expertpage.io</title>
      </Head>
      <SettingsLayout>
        {cancelAtPeriodEnd ? (
          <>
            <div className="card d-flex flex-column bg-primary-900 mx-auto mb-5 p-4">
              <h5 className="text-light-high">Premium expiring {moment.unix(cancelAt).startOf('hour').fromNow()}</h5>
              <p className="text-light-high mb-0">Your Premium plan is set to expire on <b>{moment.unix(cancelAt).format('Do MMMM YYYY')}</b>. You won't be able to re-sync your profile with LinkedIn. Renew your subscription to keep access to all Premium features.</p>
              <div>
                <RenewButton handleUpdate={handleUpdate} className="w-md-auto light" />
              </div>
            </div>
          </>
        )
          : null}

        <div id="plan" className="card mx-auto mb-5">
          <div className="d-flex flex-column m-4">
            <div className="d-flex flex-column w-100 gap-4">
              {/* <div className="d-flex flex-column gap-0">
                <h5 className="mb-1">Plan</h5>
                <p className="text-dark-low mb-0">Manage your plan and payment information</p>
              </div> */}
          
              <div className="d-flex flex-column flex-md-row" style={{ gap: "24px" }}>
                {!sectionsLoading ? 
                  <>
                    <div className={`${styles.planCard} radius-3 p-4 w-100 w-md-50 ${product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? '' : styles.active) : styles.active) : styles.active}`}>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <h6 className="text-primary-high mb-1">Basic</h6>
                        {product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? null : <CurrentPlan />) : <CurrentPlan />) : <CurrentPlan />}
                      </div>
                      <h4 className="text-dark-high mb-4">Free</h4>
                      {[
                        {'string': "Expertpage.io domain", 'included': true},
                        {'string': "Create your page", 'included': true},
                        {'string': "Connect your own domain", 'included': false},
                        {'string': "Remove Expertpage.io branding", 'included': false},
                      ].map((feature, index) =>
                        <div key={index} className="d-flex align-items-start mt-2">
                          <svg viewBox="0 0 24 24" style={{width: '24px', minWidth: '24px'}} className={`mr-2 ${feature.included ? 'fill-dark-800' : 'fill-dark-600'}`}>
                            <path d={feature.included ? ICONS.CHECK : ICONS.CLOSE}></path>
                          </svg>
                          <p className={`${!feature.included && 'text-dark-dis'} mb-0`}>
                            {feature.string}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className={`${styles.planCard} radius-3 p-4 w-100 w-md-50 ${product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? styles.active : '') : '') : ''}`}>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <h6 className="text-primary-high mb-1">Premium</h6>
                        {product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? <CurrentPlan /> : null) : null) : null}
                      </div>
                      <div className="d-flex align-items-end mb-4">
                        <h4 className="text-dark-high mr-1 mb-0">$5.99</h4>
                        <p className="text-dark-high mb-0">/month</p>
                      </div>
                      {[
                        {'string': "Expertpage.io domain", 'included': true},
                        {'string': "Create your page", 'included': true},
                        {'string': "Connect your own domain", 'included': true},
                        {'string': "Remove Expertpage.io branding", 'included': true},
                        {'string': "More coming soon", 'included': true}
                      ].map((feature, index) =>
                        <div key={index} className="d-flex align-items-start mt-2">
                          <svg viewBox="0 0 24 24" style={{width: '24px', minWidth: '24px'}} className={`mr-2 ${feature.included ? 'fill-dark-800' : 'fill-dark-600'}`}>
                            <path d={feature.included ? ICONS.CHECK : ICONS.CLOSE}></path>
                          </svg>
                          <p className={`${!feature.included && 'text-dark-dis'} mb-0`}>{feature.string}</p>
                        </div>
                      )}
                      {cancelAtPeriodEnd ? (
                        <>
                          <div className="tag error medium mt-3">Expires on {moment.unix(cancelAt).format('Do MMMM YYYY')}</div>
                        </>
                      )
                        : null}
                      {product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? (cancelAtPeriodEnd ? <RenewButton handleUpdate={handleUpdate} /> : <ManageButton handleUpdate={handleUpdate} />) : <UpgradeButton handleUpgrade={handleUpgrade} />) : <UpgradeButton handleUpgrade={handleUpgrade} />) : <UpgradeButton handleUpgrade={handleUpgrade} />}
                    </div>
                  </>
                :
                  <>
                    <div className="bg-dark-200 radius-2 p-4 loadingAnimation w-100" style={{height: '390px'}}></div>
                    {/* <div className="bg-dark-200 radius-2 p-4 loadingAnimation w-100" style={{height: '390px'}}></div> */}
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </SettingsLayout>
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

export default Plan