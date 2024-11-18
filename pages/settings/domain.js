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
import CustomDomainSection from './components/customDomainSection';
import PrettyUrlSection from './components/prettyUrlSection';
import CustomDomain from './components/customDomain';
import SettingsLayout from './components/settingsLayout';
import Head from 'next/head';

const Domain = () => {
  const router = useRouter();
  const [userData, setUserData] = useState('');
  const [allUserData, setAllUserData] = useState('');
  const [customDomain, setCustomDomain] = useState(undefined);
  const [domainInfo, setDomainInfo] = useState('');
  const [domainStatus, setDomainStatus] = useState('');
  const [gettingDomainInfo, setGettingDomainInfo] = useState('');

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
    mixpanel.track("Settings", {"page": "Domain"});
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

  return (
    <div>
      <Head>
        <title>Domain | Vitaely.me</title>
      </Head>
      <SettingsLayout>
        <div className="d-flex flex-column gap-4">
          <CustomDomain
            userData={userData}
            allUserData={allUserData}
            loggedInRoute={loggedInRoute}
            gettingDomainInfo={gettingDomainInfo}
            setDomainInfo={setDomainInfo}
            setDomainStatus={setDomainStatus}
            setGettingDomainInfo={setGettingDomainInfo}
            sectionsLoading={sectionsLoading}
            product={product}
            active={active}
            status={status}
            handleUpgrade={handleUpgrade}
          />
          <PrettyUrlSection
            userData={userData}
            allUserData={allUserData}
            product={product}
            active={active}
            status={status}
            handleUpgrade={handleUpgrade}
          />
        </div>
      </SettingsLayout>
    </div>
  )
}

export default Domain