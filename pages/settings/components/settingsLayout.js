import { useState, useEffect } from 'react';
import fire from '../../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../../components/header/Header';
import { loadStripe } from '@stripe/stripe-js';
import { Accordion, Container, ModalBody, useAccordionToggle } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import moment from 'moment'
import ICONS from '../../../components/icon/IconPaths';
import Lottie from 'react-lottie';
import animationData from '../../../components/animations/loader.json'
import styles from '../settings.module.scss'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { ProgressBar, Modal } from 'react-bootstrap';
import ResyncSection from '../components/resyncSection';
import ManageButton from '../components/manageButton';
import UpgradeButton from '../components/upgradeButton';
import RenewButton from '../components/renewButton';
import SurveyBanner from '../../../components/banner/SurveyBanner';
import LogosSection from '../components/logosSection';
import DownloadSection from '../components/downloadSection';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import TemplateSection from '../components/templateSection';
import CustomDomainSection from '../components/customDomainSection';
import PrettyUrlSection from '../components/prettyUrlSection';
import ChangeEmailSection from '../components/changeEmailSection';
import CustomDomain from '../components/customDomain';
// import { redirect } from 'next/dist/next-server/server/api-utils';


const SettingsLayout = ({children}) => {
  const router = useRouter();

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  const [screenWidth, setScreenWidth] = useState('');

  const [pathName, setPathName] = useState('');
  const [tagline, setTagline] = useState('');

  const [userData, setUserData] = useState('');
  const [allUserData, setAllUserData] = useState('');
  const [basicInfo, setBasicInfo] = useState(true);
  const [profilePic, setProfilePic] = useState(true);
  const [headerImage, setHeaderImage] = useState(true);
  const [fullname, setFullname] = useState(true);
  const [headline, setHeadline] = useState(true);
  const [email, setEmail] = useState(true);
  const [about, setAbout] = useState(true);
  const [experience, setExperience] = useState(true);
  const [experienceEach, setExperienceEach] = useState('');
  const [education, setEducation] = useState(true);
  const [educationEach, setEducationEach] = useState('');
  const [volunteering, setVolunteering] = useState(true);
  const [volunteeringEach, setVolunteeringEach] = useState('');
  const [linkedinId, setLinkedinId] = useState('');
  const [surveyHide, setSurveyHide] = useState(true);
  const [customDomain, setCustomDomain] = useState(undefined);
  const [domainInfo, setDomainInfo] = useState('');
  const [domainStatus, setDomainStatus] = useState('');
  const [gettingDomainInfo, setGettingDomainInfo] = useState('');

  //const [syncsRemaining, setSyncsRemaining] = useState(0);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState('');
  const [savingSections, setSavingSections] = useState(false);
  const [experienceLogos, setExperienceLogos] = useState(false);
  const [sideProjectsLogos, setSideProjectsLogos] = useState(false);
  const [educationLogos, setEducationLogos] = useState(false);
  const [volunteeringLogos, setVolunteeringLogos] = useState(false);
  const [savingLogos, setSavingLogos] = useState(false);
  const [syncError, setSyncError] = useState('');
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
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
    handleRoute()
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
        setLinkedinId(doc.data().profile.public_identifier)
        setSurveyHide(doc.data().surveys ? (doc.data().surveys.surveyOnSignUp ? (doc.data().surveys.surveyOnSignUp.surveyHide ? doc.data().surveys.surveyOnSignUp.surveyHide : false) : false) : false)
        // setCustomDomain(doc.data().customDomain ? doc.data().customDomain : undefined)
        // handleGetDomain(doc.data().customDomain)
        // console.log(`doc.data().customDomain ${doc.data().customDomain}`)
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


  const handleSectionsSubmit = (e) => {
    e.preventDefault();
    setSavingSections(true);
    fire.firestore().collection('users').doc(userData.uid).update({
      displayInfo: {
        'basicInfo': {
          'section': basicInfo,
          'each': {
            'profilePic': profilePic,
            'headerImage': headerImage,
            'name': fullname,
            'headline': headline,
            'email': email
          }
        },
        about,
        'experience': {
          'section': experience,
          'each': experienceEach,
        },
        'education': {
          'section': education,
          'each': educationEach,
        },
        'volunteering': {
          'section': volunteering,
          'each': volunteeringEach,
        }
      },
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        setSavingSections(false)
        toast("Sections updated")
      })
      .catch((err) => {
        console.log(err.code, err.message)
        //setNotification(err.message)
        toast(err.message)
      })
  }

  // Re-syncing Start

  const createExperienceList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'title': object.title,
      'company': object.company
    })
    )
  }

  const createEducationList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'name': object.field_of_study,
      'school': object.school
    })
    )
  }

  const createVolunteerList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'title': object.title,
      'company': object.company
    })
    )
  }

  const handleResyncSubmit = (e) => {
    e.preventDefault();
    if (syncsRemaining > 0) {
      setSyncLoading('Fetching data from LinkedIn');
      fetch("/api/linkedin?profileUrl=" + "https://www.linkedin.com/in/" + linkedinId)
        .then(res => res.json())
        .then((result) => {
          setSyncLoading('Storing your data');
          fire.firestore().collection('users').doc(userData.uid).update({
            profile: result,
            displayInfo: {
              'basicInfo': {
                'section': true,
                'each': {
                  'profilePic': true,
                  'headerImage': true,
                  'name': true,
                  'headline': true,
                  'email': true
                }
              },
              about: result.summary === null ? false : true,
              'experience': {
                'section': result.experiences < 1 ? false : true,
                'each': createExperienceList(result.experiences)
              },
              'education': {
                'section': result.education < 1 ? false : true,
                'each': createEducationList(result.education)
              },
              'volunteering': {
                'section': result.volunteer_work < 1 ? false : true,
                'each': createVolunteerList(result.volunteer_work)
              },
            },
            //syncsRemaining: (syncsRemaining - 1), 
            lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
            lastSync: fire.firestore.FieldValue.serverTimestamp(),
          })
        })
        .then(() => {
          setTimeout(
            setSyncLoading('Sync successfully completed'), 2000
          )
        })
        .then(() => {
          router.push('/settings')
        })
        .catch((error) => {
          console.log('error', error)
        });
    } else {
      setSyncError('You have no syncs remaining')
    }
  }
  // Re-syncing End

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

  const CustomToggle = ({ eventKey }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setDropdownOpen(!dropdownOpen)
    });

    return (
      <button type="button" onClick={decoratedOnClick} className="btn dark low small icon-only">
        <svg viewBox="0 0 24 24">
          <path d={dropdownOpen ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}></path>
        </svg>
      </button>
    );
  }

  {/*} const UpgradeButton = () => {
    return (
      <button type="button" className="btn primary high w-100 mt-5" onClick={handleUpgrade}>Upgrade</button>
    )
  }

  const ManageButton = () => {
    return (
      <button type="button" className="btn primary medium w-100 mt-5" onClick={handleUpdate}>Manage</button>
    )
  }*/}

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

  const handleRoute = () => {
    switch (router.pathname) {
      case '/settings/plan':
        setPathName('Plan')
        setTagline('Manage your plan and payment information')
        break;
      case '/settings/domain':
        setPathName('Domain')
        setTagline('Manage where can people find your profile')
        break;
      case '/settings/account':
        setPathName('Account')
        setTagline('Manage your account details')
        break;
    }
  }

  return (
    <div>
      {!surveyHide &&
        <SurveyBanner />
      }
      <Header />
        <div className={`${screenWidth > 767 && 'position-sticky'} rounded-0 d-flex flex-row justify-content-between align-items-center p-2 px-md-3 w-100 bg-light-900 border-bottom-1 border-solid border-0 border-dark-300`} style={{top: 0, left: 0, width: '100%', zIndex: 1}}>
          <div className='d-flex flex-row gap-1 w-100' style={{maxWidth: '240px'}}>
            <Link href="/settings/plan" className={`btn dark small justify-content-start ${pathName === 'Plan' ? 'medium' : 'low'}`}>Plan</Link>
            <Link href="/settings/domain" className={`btn dark small justify-content-start ${pathName === 'Domain' ? 'medium' : 'low'}`}>Domain</Link>
            <Link href="/settings/account" className={`btn dark small justify-content-start ${pathName === 'Account' ? 'medium' : 'low'}`}>Account</Link>
          </div>
        </div>
      <div style={screenWidth > 767 ? {paddingTop: '48px', paddingBottom: '48px'} : {paddingTop: 0}}>
        <div>
        {/* <div style={{ marginTop: '66px' }}> */}
          <Container className="py-5 d-flex flex-row" style={{maxWidth: '720px'}}>
            <div className="w-100">
              <div className="text-center pb-5">
                <h2 className="mb-3">{pathName}</h2>
                <p className="large text-dark-low">{tagline}</p>
              </div>
              

              {children}

              {/* <div className="d-flex flex-column gap-5">
                // { allUserData?.flags?.customDomain &&
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
                
                <ChangeEmailSection
                  userData={userData}
                  allUserData={allUserData}
                  product={product}
                  active={active}
                  status={status}
                  handleUpgrade={handleUpgrade}
                />
              </div> */}

            </div>
          </Container>
          <br /><br />
          <Modal
            show={showModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <h5 className="text-dark-high mb-0">Re-sync data</h5>
            </Modal.Header>
            <Modal.Body>
              <h5 className="text-dark-high">Are you sure you want to re-sync your data from LinkedIn?</h5>
              <p>Re-syncing your data will overwrite any changes you have made in the <b>Sections</b> settings.</p>
              <br />
              <div className="d-flex align-items-center jusify-content-start flex-column flex-md-row">
                <button type="button" className="btn primary high w-100 w-md-auto mr-0 mr-md-3 mb-3 mb-md-0" onClick={handleClose}>Re-sync data from Linkedin</button>
                <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleClose}>Close</button>
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
        <Container className="d-flex flex-column align-items-center pb-5 mb-5">
          <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between mb-4">
            <Link href="/" className="w-lg-100">
              <svg height="32" viewBox="0 0 580 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  className="fill-dark-600"
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d={ICONS.LOGO_FULL} 
                />
              </svg>
            </Link>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between">
            <p className="text-dark-dis mb-0">© Copyright ExpertPage {new Date().getFullYear()}</p>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default SettingsLayout