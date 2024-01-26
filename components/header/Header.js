import { useState, useEffect, forwardRef, Children, useContext } from 'react';
import fire from '../../config/fire-config';
import Link from 'next/link';
import { Router, useRouter } from 'next/router'
import { Dropdown, Modal } from 'react-bootstrap';
import styles from './Header.module.scss'
import Icon from '../icon/Icon';
import ICONS from '../icon/IconPaths';
import { loadStripe } from '@stripe/stripe-js';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loader.json'
import { UserContext } from '../../pages/_app';
import EditProfile from '../editProfile/EditProfile';
import { toast } from 'react-toastify';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';

const Header = ({
  dark,
  hideShadow,
  topOfLanding,
  positionFixed,
  showEditProfileModal, 
  setShowEditProfileModal,
  editProfileModalState, 
  setEditProfileModalState,
  editProfileModalSubtitle, 
  setEditProfileModalSubtitle,
  editProfileModalIndex, 
  setEditProfileModalIndex,
  handleEditProfileClose,
  handleEditProfileShow,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [loggedIn, setLoggedIn] = useState(false);
  const [profileUrl, setProfileUrl] = useState(userContext && userContext.profileUrl && userContext.profileUrl)
  const [customDomain, setCustomDomain] = useState(userContext?.domain?.name)
  const [windowUrl, setWindowUrl] = useState("")
  // const [profile, setProfile] = useState('')
  const [userData, setUserData] = useState('')
  const [stage, setStage] = useState(userContext && userContext.stage && userContext.stage)
  const router = useRouter();
  const [redirectToStripe, setRedirectToStripe] = useState(false);
  const [product, setProduct] = useState('');
  const [active, setActive] = useState('');
  const [status, setStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelAt, setCancelAt] = useState('');
  // const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  // const [editProfileModalState, setEditProfileModalState] = useState('default')
  // const [editProfileModalSubtitle, setEditProfileModalSubtitle] = useState('')
  // const [editProfileModalIndex, setEditProfileModalIndex] = useState('')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [commentsAndSuggestions, setCommentsAndSuggestions] = useState('');
  const [commentsAndSuggestionsError, setCommentsAndSuggestionsError] = useState('');
  const [furtherResearch, setFurtherResearch] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [headerImageError, setHeaderImageError] = useState(false);

  // const { profile, setProfile } = useContext(ProfileContext);

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    Router.events.on('routeChangeComplete', () => {
      setWindowUrl(window.location.pathname);
    })
    setWindowUrl(window.location.pathname);
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
    document.body.style.background = '#f9f9fd';
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          loggedInRoute(user)
          getSubscription(user)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  /* Start old useEffect */

  // useEffect(() => {
  //   setWindowUrl(window.location.pathname);
  //   setScreenWidth(window.innerWidth)
  //   window.addEventListener('resize', handleResize);
  //   const unsubscribe = fire.auth()
  //     .onAuthStateChanged((user) => {
  //       if (user) {
  //         setLoggedIn(true)
  //         loggedInRoute(user)
  //         getSubscription(user)
  //       } else {
  //         setLoggedIn(false)
  //       }
  //     })
  //   return () => {
  //     // Unmouting
  //     unsubscribe();
  //   };
  // }, []);

  /* End old useEffect */

  const loggedInRoute = (user) => {
    setUserData(user)
    if (userContext !== '') {
      // setStage(userContext && userContext.stage && userContext.stage)
      // setStage(userContext.stage)
      // if (userContext.profileUrl) {
      //   setProfileUrl(userContext.profileUrl)
      // }
    } else {

      var docRef = fire.firestore().collection('users').doc(user.uid)

      docRef.get()
        .then((doc) => {
          if (doc.exists) {
            setUserContext(doc.data())
            //setProfile(doc.data().profile)
            //setStage(doc.data().stage)
            if (doc.data().stage !== 'complete') {
              router.push(doc.data().stage)
            } else {
              setProfileUrl(doc.data().profileUrl)
              setCustomDomain(doc.data().domain?.name)
            }
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        })
    }
  }

  const handleLogout = () => {
    setUserContext("")
    fire.auth()
      .signOut()
      .then(() => {
        router.push("/")
      });
  }

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
          doc.data().cancel_at && doc.data().cancel_at.seconds && setCancelAt(doc.data().cancel_at.seconds)
        });
      })
      .then(() => {
        // console.log('Retreived subscription data from database')
      })
      .catch((error) => {
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
  // Dev Premium Subscription End

  // Dev Customer Portal Start
  async function handleUpdate(e) {
    e.preventDefault();
    const functionRef = fire.app().functions('europe-west2').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
    const { data } = await functionRef({ returnUrl: window.location.origin + '/settings' });
    window.location.assign(data.url);
  }
  // Dev Customer Portal End

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
  };
  const handleFeedbackShow = () => {
    setSubmittedFeedback(false);
    setShowFeedbackModal(true)
  };

  // const handleEditProfileClose = () => {
  //   setShowEditProfileModal(false);
  //   // setEditProfileModalState('default')
  // };

  // These two (above and below) need to be moved to the Profile page
  // const handleEditProfileShow = () => {
  //   setShowEditProfileModal(true)
  //   setEditProfileModalState('default')
  //   setEditProfileModalIndex('')
  //   mixpanel.init(mixpanelConfig);
  //   mixpanel.track('Launch edit profile modal');
  // };

  // const handleEditProfileChangeView = (page, subtitle, index) => {
  //   setEditProfileModalState(page)
  //   setEditProfileModalSubtitle(subtitle)
  //   setEditProfileModalIndex(index)
  // }

  const commentsAndSuggestionsChange = (value) => {
    setCommentsAndSuggestions(value)
    setCommentsAndSuggestionsError('')
  }

  const furtherResearchChange = () => {
    setFurtherResearch(furtherResearch => !furtherResearch)
  }

  const copyProfileAddress = () => {
    if (customDomain !== undefined) {
      navigator.clipboard.writeText(`${customDomain}`);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}${profileUrl}`);
    }
    toast("Copied profile link to clipboard")
  }

  const goToProfile = () => {
    if (customDomain !== undefined) {
      return customDomain
    } else {
      return `${window.location.origin}${profileUrl}`
    }
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();

    if (commentsAndSuggestions == ''
    ) {
      setCommentsAndSuggestionsError('Please provide a response')
      return null;
    }

    setSubmittingFeedback(true)

    fire.firestore().collection("surveys").doc('generalFeedback').collection("responses").add({
      'commentsAndSuggestions': commentsAndSuggestions,
      'furtherResearch': furtherResearch,
      userID: userData.uid,
      submitted: fire.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        setSubmittedFeedback(true)
        setSubmittingFeedback(false)
        setCommentsAndSuggestions('')
        setFurtherResearch(false)
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  // The forwardRef is important!!
  // Dropdown needs access to the DOM node in order to position the Menu
  const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <a
      className="toggleLink"
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ));

  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled m-0">
            {children}
          </ul>
        </div>
      );
    },
  );

  return (
    // windowUrl.includes("profile") && windowUrl.includes(userContext.profileUrl) ?
      <div
        // style={{paddingTop:'66px'}}
        // style={props.logoVisibility && props.logoVisibility.experience ? {marginTop: '10px'} : null}
      >
        <div 
          className={`rounded-0 d-flex flex-row justify-content-between align-items-center p-2 px-md-3 w-100 
            ${hideShadow ? 'shadow-0' : 'border-left-0 border-right-0 border-top-0 border-bottom-1 border-solid'}
            ${positionFixed && 'position-fixed'}
            ${dark ? ' border-light-300' : 'border-dark-300'}
            ${!hideShadow && dark ? 'bg-dark-800' : null}
            ${!dark && 'bg-light-900'}

          `} 
          style={
            windowUrl == '' ? { minHeight: '64px', zIndex: '3', top: 0, position: 'relative', backdropFilter: 'blur(10px)' } : { minHeight: '64px', zIndex: '3', top: 0, position: 'relative', backdropFilter: 'blur(10px)' }
          }>
          {userContext !== '' ?
            // {loggedIn ?
            <>
              <div className="d-flex flex-row align-items-center gap-2">
                <Link href="/">
                    {screenWidth > 767 ?
                      <svg height="48" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          className={`${dark ? 'fill-light-900' : 'fill-dark-900'}`}
                          fillRule="evenodd" 
                          clipRule="evenodd" 
                          d={ICONS.LOGO_ICON} 
                        />
                      </svg>
                      // <img src="/images/vitaely-logo-icon-square.svg" style={{ height: '32px' }} />
                    :
                    <svg height="40" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        className={`${dark ? 'fill-light-900' : 'fill-dark-900'}`}
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d={ICONS.LOGO_ICON} 
                      />
                    </svg>
                    }
                </Link>
                { windowUrl.includes("blog") || 
                  windowUrl.includes("legal") || 
                  windowUrl.includes("setup") ||
                  windowUrl.includes("users") ||
                  windowUrl.includes("pricing") ||
                  windowUrl.includes("templates") ||
                  windowUrl.includes("linkedin-to-resume") ||
                  windowUrl.includes("online-cv-builder") ||
                  windowUrl.includes("online-resume-builder") ||
                  windowUrl.includes("pdf-resume-builder") ||
                  windowUrl == '/' ?                 
                  <div className="d-flex align-items-center mx-4" style={{ gap: '8px' }}>
                    <Link href="/templates" className={`btn low small ${dark ? 'light' : 'dark'}`}>Templates</Link>
                    <Link href="/pricing" className={`btn low small ${dark ? 'light' : 'dark'}`}>Pricing</Link>
                    <Link href="/blog" className={`btn low small ${dark ? 'light' : 'dark'}`}>Blog</Link>
                  </div> 
                : null}
                {/* <div className={`${dark ? 'high' : 'medium'} tag small primary`}>Beta</div> */}

                {/* <div className="d-flex">
            <Link href={profileUrl}>
              <a className="btn primary low small">Profile</a>
            </Link>
            <Link href="/settings">
              <a className="btn primary low small">Settings</a>
            </Link>
            </div>      */}
              </div>
              <div className="d-flex">
                {/* {profile.profile_pic_url &&
              <img src={profile.profile_pic_url} style={{width: '48px', borderRadius:'100%'}} />
            } */}
                { (userContext && 
                  userContext.stage && 
                  userContext.stage !== undefined) 
                    && 
                  (userContext && 
                  userContext.stage && 
                  userContext.stage !== 'complete' && userContext.stage !== '/setup/template') 
                   ?
                  <button className="btn primary low small" onClick={handleLogout}>Logout</button>
                  :
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    {windowUrl.match(`/profile`) &&
                      <button 
                        type="button" 
                        onClick={() => handleEditProfileShow()}
                        className={`btn primary high small mr-2 ${screenWidth > 575 ? 'icon-left' : 'icon-only'}`}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d={ICONS.EDIT}></path>
                        </svg>
                        {screenWidth > 575 ? 'Edit profile' : null}
                      </button>
                    }
                    {/* <div className="d-flex flex-row" style={{ gap: '8px' }}>
                    <Link href="/blog">
                      <a className="btn dark low small">Blog</a>
                    </Link>
                    </div>
                    <div className="bg-dark-300 mx-3" style={{ width: '1px', height: '48px' }}></div> */}
                    <Dropdown align="end">
                      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" className="text-decoration-none">
                        <>
                          <div className={
                            ` d-flex flex-row align-items-center p-2 menuButton ${dark && 'menuButtonDark'}`} style={{ gap: '4px' }}>
                            <div className="px-2">
                              <svg viewBox="0 0 24 24" width='24px'>
                                <path 
                                  d={ICONS.MENU}
                                  className={`${dark ? 'fill-light-900' : 'fill-dark-900'}`}
                                ></path>
                                
                              </svg>
                            </div>
                            {!headerImageError || userContext.userContext.profile && userContext.profile.profile_pic_url !== '' ? 
                              <>
                                <div
                                  style={{
                                    backgroundImage: `url(${userContext && userContext.profile && userContext.profile.profile_pic_url})`,
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '100%'
                                  }}
                                  // className={styles.profilePicture}
                                ></div>
                                {/* <img
                                  className="bg-dark-200 radius-5"
                                  src={userContext && userContext.profileUrl && userContext.profile.profile_pic_url}
                                  onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    setHeaderImageError(true)
                                  }}
                                  style={{ width: '32px', height: '32px', borderRadius: '100%' }}
                                /> */}
                              </>
                              :
                              <div className="bg-dark-200 radius-5" style={{ width: '32px', height: '32px' }} />

                              // <button className="btn dark low small icon-only">
                              //   <svg viewBox="0 0 24 24">
                              //     <path d={ICONS.MENU}></path>
                              //   </svg>
                              // </button>
                            }
                          </div>
                        </>
                        {/* <img src="foo.jpg" onerror="if (this.src != 'error.jpg') this.src = 'error.jpg';"> */}

                      </Dropdown.Toggle>
                      <Dropdown.Menu as={CustomMenu} align="end" className={`${dark && 'menu-dark'} mt-2`}>
                        {/* <Dropdown.Item onClick={() => router.push(userContext && userContext.profileUrl)} className={styles.dropdownItem}> */}
                        <div className="p-2">
                          <Dropdown.Item onClick={() => router.push('/profile')} className={`dropdownItem ${dark && 'dropdownItemDark'}`}>
                            {!headerImageError ?
                              <div className="bg-dark-200" style={{ width: '48px', height: '48px', borderRadius: '100%' }}>
                                <img src={userContext && userContext.profile && userContext.profile.profile_pic_url} style={{ width: '48px', height: '48px', borderRadius: '100%' }} />
                              </div>
                              : null}
                            {userContext && userContext.profile && userContext.profile.full_name}
                          </Dropdown.Item>
                        </div>
                        <hr className={`${dark && 'border-light-300'} m-0`} />
                        <div className="p-2">
                        {/* <Dropdown.Item onClick={() => handleEditProfileShow()} className={styles.dropdownItem}>
                          <Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" />
                          Edit profile
                        </Dropdown.Item> */}
                        {/* <Dropdown.Item onClick={() => router.push('/settings')} className={styles.dropdownItem}>
                          <Icon icon={ICONS.SETTINGS} size='24' className="fill-dark-900" />
                          Settings
                        </Dropdown.Item> */}

                        {/* <Link href={"/settings"} >
                        <div className={styles.dropdownItem}>
                          <Icon icon={ICONS.SETTINGS} size='24' className="fill-dark-900" />
                          Settings
                        </div>
                      </Link> */}

                        {/* {product !== '' ?
                          (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ?
                            (status === 'active' ?
                              <Dropdown.Item onClick={() => router.push('/settings/plan')} className={styles.dropdownItem}>
                                <Icon icon={ICONS.STAR} size='24' className="fill-dark-900" />
                                Plan
                              </Dropdown.Item>
                              :
                              <a onClick={() => handleUpgrade(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                                <Icon icon={ICONS.STAR} size='24' />
                                Upgrade to premium
                              </a>
                            )
                            :
                            <Dropdown.Item onClick={() => router.push('/settings/plan')} className={styles.dropdownItem}>
                              <Icon icon={ICONS.STAR} size='24' className="fill-dark-900" />
                              Plan
                            </Dropdown.Item>
                          )
                          :
                          <Dropdown.Item onClick={() => router.push('/settings/plan')} className={styles.dropdownItem}>
                            <Icon icon={ICONS.STAR} size='24' className="fill-dark-900" />
                            Plan
                          </Dropdown.Item>
                        } */}
                        <a 
                          target="_blank"
                          href={customDomain !== undefined ? `https://${customDomain}` : `${window.location.origin}${profileUrl}`} 
                          className={`dropdownItem ${dark && 'dropdownItemDark'}`}
                        >
                          <Icon icon={ICONS.EXTERNAL_LINK} size='24' />
                          Go to my website
                        </a>
                        <Dropdown.Item onClick={() => copyProfileAddress()} className={`dropdownItem ${dark && 'dropdownItemDark'}`}>
                          <Icon icon={ICONS.COPY} size='24' className="fill-dark-900" />
                          Copy website link
                        </Dropdown.Item>
                      

                        {/* {product !== '' ?
                      (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ?
                        (status === 'active' ?
                          null
                          :
                          <a onClick={() => handleUpgrade(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                            <Icon icon={ICONS.STAR} size='24' />
                            Upgrade to premium
                          </a>
                        )
                        :
                        null
                      )
                      :
                      null
                    } */}

                        {/* {product !== '' ?
                          (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ?
                            (status === 'active' ?
                              (cancelAtPeriodEnd ?
                                <Dropdown.Item onClick={() => handleUpdate(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                                  <Icon icon={ICONS.STAR} size='24' />
                                  Renew subscription
                                </Dropdown.Item>
                                :
                                null
                              )
                              :
                              <Dropdown.Item onClick={() => handleUpgrade(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                                <Icon icon={ICONS.STAR} size='24' />
                                Upgrade to premium
                              </Dropdown.Item>
                            )
                            :
                            <Dropdown.Item onClick={() => handleUpgrade(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                              <Icon icon={ICONS.STAR} size='24' />
                              Upgrade to premium
                            </Dropdown.Item>
                          )
                          :
                          <Dropdown.Item onClick={() => handleUpgrade(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                            <Icon icon={ICONS.STAR} size='24' />
                            Upgrade to premium
                          </Dropdown.Item>
                        } */}
                        </div>
                        <hr className={`${dark && 'border-light-300'} m-0`} />
                        <div className="p-2">
                          <Dropdown.Item onClick={() => router.push('/settings/plan')} className={`dropdownItem ${dark && 'dropdownItemDark'} ${product !== '' && product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active' ? null : 'dropdownItemHighlight'}`}>
                            <Icon icon={ICONS.STAR} size='24' />
                            {product !== '' && product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active' ?
                              'Manage plan'
                                :
                              'Upgrade to premium'
                            }
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => router.push('/settings/domain')} className={`dropdownItem ${dark && 'dropdownItemDark'}`}>
                            <Icon icon={ICONS.WEBSITE} size='24' className="fill-dark-900" />
                            Domain
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => router.push('/settings/account')} className={`dropdownItem ${dark && 'dropdownItemDark'}`}>
                            <Icon icon={ICONS.USER} size='24' className="fill-dark-900" />
                            Account
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleFeedbackShow()} className={`dropdownItem ${dark && 'dropdownItemDark'}`}>
                            <Icon icon={ICONS.FEEDBACK} size='24' />
                            Submit feedback
                          </Dropdown.Item>
                        </div>
                        <hr className={`${dark && 'border-light-300'} m-0`} />
                        <div className="p-2">
                          <Dropdown.Item onClick={() => handleLogout()} className={`dropdownItem dropdownItemLow ${dark && 'dropdownItemDark'}`}>
                            <Icon icon={ICONS.LOG_OUT} size='24' />
                            Sign out
                          </Dropdown.Item>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                }
                {/* <Link href="/settings">
              <a className="btn primary low small">Settings</a>
            </Link>
            */}
              </div>
            </>
            :
            <div className="d-flex flex-row justify-content-between align-items-center w-100">
              <div className="d-flex flex-row align-items-center gap-2">
                <Link href="/">
                  {screenWidth > 767 ?
                    <svg height="48" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        className={`${dark ? 'fill-light-900' : 'fill-dark-900'}`}
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d={ICONS.LOGO_ICON} 
                      />
                    </svg>
                    // <img src="/images/vitaely-logo-icon-square.svg" style={{ height: '32px' }} />
                  :
                  <svg height="40" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      className={`${dark ? 'fill-light-900' : 'fill-dark-900'}`}
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d={ICONS.LOGO_ICON} 
                    />
                  </svg>
                  }
                    {/* <img src="/images/vitaely-logo-icon-square.svg" style={windowUrl == '' ? { margin: '16px', height: '40px' } : { marginLeft: '16px', height: '40px' }} /> */}
                </Link>
                {/* <div className={`${dark ? 'high' : 'medium'} tag small primary`}>Beta</div> */}
                {screenWidth > 767 && (
                  <div className="d-flex align-items-center mx-4" style={{ gap: '8px' }}>
                    <Link href="/templates" className="btn dark low small">Templates</Link>
                    <Link href="/pricing" className="btn dark low small">Pricing</Link>
                    <Link href="/blog" className="btn dark low small">Blog</Link>
                  </div>
                )}
              </div>
              <div className="d-flex" style={{ gap: '8px' }}>

                {/* <Link href="/users/register">
                <a className={`btn primary small ${windowUrl === '/' ? 'medium' : 'high'}`}>Register</a>
              </Link> */}
                <Link href="/users/login" className={`${dark ? 'light' : 'primary'} btn low small`}>Login</Link>
                <Link href="/users/register" className={`btn primary ${topOfLanding ? 'medium' : 'high'} small`}>Create my page</Link>
              </div>
            </div>
          }
          <EditProfile
            showEditProfileModal={showEditProfileModal}
            editProfileModalState={editProfileModalState}
            editProfileModalSubtitle={editProfileModalSubtitle}
            setEditProfileModalIndex={setEditProfileModalIndex}
            handleEditProfileChangeView={(page, subtitle, index) => handleEditProfileChangeView(page, subtitle, index)}
            handleEditProfileClose={() => handleEditProfileClose()}
            editProfileModalIndex={editProfileModalIndex}
          />
          <Modal
            show={showFeedbackModal}
            onHide={handleFeedbackClose}
            keyboard={false}
          // size="lg"
          >
            {!submittedFeedback ?
              <Modal.Body>
                <div>
                  <div className="d-flex flex-row align-items-center justify-content-between mb-4">
                    <h5 className="text-dark-high mb-0">Feedback survey</h5>
                    <button onClick={handleFeedbackClose} className="btn dark low icon-only">
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.CLOSE}></path>
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={handleFeedbackSubmit}>
                    <div className="mb-4">
                      <p className="text-dark-high">Do you have any other comments, feedback or suggestions for us?</p>
                      <textarea className="w-100 small" style={{ minHeight: '10rem' }} disabled={submittingFeedback} value={commentsAndSuggestions} onChange={({ target }) => commentsAndSuggestionsChange(target.value)} />
                      {commentsAndSuggestionsError !== '' ? <p className="small text-error-high">{commentsAndSuggestionsError}</p> : null}
                    </div>
                    <div className="mb-4">
                      <p className="text-dark-high">Are you willing to be contacted by a member of our team for further research?</p>
                      <label className="checkbox-container small mb-4">I agree to be contacted for further research
                        <input type="checkbox" disabled={submittingFeedback} onChange={() => furtherResearchChange()} checked={furtherResearch}></input>
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    {/*}
                  <label className="checkbox-container small mb-4">I would like to receive emails about news and updates
                    <input type="checkbox" onChange={() => setReceiveEmails(receiveEmails => !receiveEmails)} checked={receiveEmails}></input>
                    <span className="checkmark"></span>
                  </label>
                  */}
                    <br />
                    <button type="submit" className="btn primary high w-100" disabled={submittingFeedback}>{submittingFeedback ? 'Submitting...' : 'Submit feedback'}</button>
                  </form>
                  {/*<div className="d-flex align-items-center jusify-content-start flex-column flex-md-row">
                  <button type="button" className="btn primary high w-100 w-md-auto" onClick={handleUpdate}>Upgrade</button>
                  <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleClose}>Close</button>
                </div>*/}
                </div>
              </Modal.Body>
              :
              <Modal.Body>
                <div>
                  <h4 className="text-center">Feedback successfully submitted</h4>
                  <p className="text-center large mb-5">Thank you for taking the time to send over your comments and feedback. Your response will help us to make the product even better for you.</p>
                  <button type="button" onClick={handleFeedbackClose} className="btn primary high w-100">Close</button>
                </div>
              </Modal.Body>
            }
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
      </div>
  )
}

export default Header;