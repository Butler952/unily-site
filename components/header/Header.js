import { useState, useEffect, forwardRef, Children, useContext } from 'react';
import fire from '../../config/fire-config';
import Link from 'next/link';
import { Router, useRouter } from 'next/router'
import { Dropdown, Modal } from 'react-bootstrap';
import styles from './Header.module.scss'
import Icon from '../icon/Icon';
import ICONS from '../icon/IconPaths';
import { loadStripe } from '@stripe/stripe-js';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import { Img } from 'react-image';

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
  const [shortlist, setShortlist] = useState([])
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
    // document.body.style.background = '#F6F6F4';
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          loggedInRoute(user)
          // getSubscription(user)
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
    console.log('got here')
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
            setShortlist(doc.data().shortlist)
            //setProfile(doc.data().profile)
            //setStage(doc.data().stage)
            // if (doc.data().stage !== 'complete') {
            //   router.push(doc.data().stage)
            // } else {
            //   setProfileUrl(doc.data().profileUrl)
            //   setCustomDomain(doc.data().domain?.name)
            // }
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
        localStorage.removeItem("shortlist");
        localStorage.removeItem("rejected");
        localStorage.removeItem("lastRandomDocumentId");
        localStorage.removeItem("emailForSignIn");
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

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice'
  //   }
  // };

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
    // !windowUrl.includes("/names") ?
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
            windowUrl == '' ? { minHeight: '64px', zIndex: '3', top: 0, position: 'relative' } : { minHeight: '64px', zIndex: '3', top: 0, position: 'relative'}
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
                          <div className="btn primary medium small icon-only">
                            <svg viewBox="0 0 24 24">
                              <path 
                                d={ICONS.MENU}
                              ></path>
                            </svg>
                          </div>
                        </>
                      

                      </Dropdown.Toggle>
                      <Dropdown.Menu as={CustomMenu} align="end" className={`${dark && 'menu-dark'} mt-2`}>
                        {/* <Dropdown.Item onClick={() => router.push(userContext && userContext.profileUrl)} className={styles.dropdownItem}> */}
                        {/* <div className="p-2">
                          <Dropdown.Item onClick={() => router.push('/profile')} className={`dropdownItem ${dark && 'dropdownItemDark'}`}>
                            <Img 
                              src={userContext?.profile?.profile_pic_url}
                              style={{width: "48px", height: "48px", borderRadius: "100%" }}
                            />
                            {userContext && userContext.profile && userContext.profile.full_name}
                          </Dropdown.Item>
                        </div> */}
                        {/* <hr className={`${dark && 'border-light-300'} m-0`} />
                        <div className="p-2"> */}
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
                        {/* <a 
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
                        </Dropdown.Item> */}
                      

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
                        {/* </div> */}
                        {/* <hr className={`${dark && 'border-light-300'} m-0`} /> */}
                        <div className="p-2">
                          <Dropdown.Item onClick={() => router.push('/shortlist')} className={`dropdownItem ${dark && 'dropdownItemDark'} d-flex justify-content-between`}>
                            <div className="d-flex flex-row align-items-center gap-3">
                              {/* <Icon icon={ICONS.WEBSITE} size='24' className="fill-dark-900" /> */}
                              Shortlist{" "}
                            </div>
                            <div className="tag dark medium small ml-2">{shortlist.length}</div>
                          </Dropdown.Item>
                          
                          <Dropdown.Item onClick={() => router.push('/settings')} className={`dropdownItem ${dark && 'dropdownItemDark'}`}>
                            Account
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleFeedbackShow()} className={`dropdownItem ${dark && 'dropdownItemDark'}`}>
                            Submit feedback
                          </Dropdown.Item>
                        </div>
                        <hr className={`${dark && 'border-light-300'} m-0`} />
                        <div className="p-2">
                          <Dropdown.Item onClick={() => handleLogout()} className={`dropdownItem dropdownItemLow ${dark && 'dropdownItemDark'}`}>
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
              </div>
              {screenWidth < 768 ?
                // Hamburger
                <Dropdown align="end">
                  <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" className="text-decoration-none">
                    <>
                      <div className={
                        `btn primary medium small d-flex flex-row align-items-center p-2`} style={{ gap: '4px' }}>
                        <div className="px-2">
                          <svg viewBox="0 0 24 24">
                            <path 
                              d={ICONS.MENU}
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </>
                  </Dropdown.Toggle>
                  <Dropdown.Menu as={CustomMenu} align="end" className={`${dark && 'menu-dark'} mt-2`}>      
                    <div className="p-2">
                      <Dropdown.Item onClick={() => router.push('/users/login')} className={`dropdownItem ${dark && 'dropdownItemDark'}`}>
                        Login
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => router.push('/users/register')} className={`dropdownItem dropdownItemHighlight ${dark && 'dropdownItemDark'}`}>
                        Create account
                      </Dropdown.Item>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              :
              <div className="d-flex" style={{ gap: '8px' }}>
                <Link href="/users/login" className={`${dark ? 'light' : 'dark'} btn low small`}>Login</Link>
                <Link href="/names" className={`btn primary ${topOfLanding ? 'low' : 'high'} small`}>Find a name</Link>
                {/* <Link href="/users/register" className={`btn primary ${topOfLanding ? 'low' : 'high'} small`}>Create account</Link> */}
              </div>
              }
            </div>
          }
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
                    <h3 className="text-dark-high mb-0">Feedback survey</h3>
                    <button onClick={handleFeedbackClose} className="btn dark low icon-only">
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.CLOSE}></path>
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={handleFeedbackSubmit}>
                    <div className="mb-4">
                      <p className="text-dark-high">Tell us what you love, tell us what you hate, tell us what you want to see more of, tell us about your child who has raised an army from the local shepherds and has begun forming an empire.</p>
                      <textarea className="w-100 small" style={{ minHeight: '10rem' }} disabled={submittingFeedback} value={commentsAndSuggestions} onChange={({ target }) => commentsAndSuggestionsChange(target.value)} />
                      {commentsAndSuggestionsError !== '' ? <p className="small text-error-high">{commentsAndSuggestionsError}</p> : null}
                    </div>
                    {/* <div className="mb-4">
                      <p className="text-dark-high">Are you willing to be contacted by a member of our team for further research?</p>
                      <label className="checkbox-container small mb-4">I agree to be contacted for further research
                        <input type="checkbox" disabled={submittingFeedback} onChange={() => furtherResearchChange()} checked={furtherResearch}></input>
                        <span className="checkmark"></span>
                      </label>
                    </div> */}
                    {/*}
                  <label className="checkbox-container small mb-4">I would like to receive emails about news and updates
                    <input type="checkbox" onChange={() => setReceiveEmails(receiveEmails => !receiveEmails)} checked={receiveEmails}></input>
                    <span className="checkmark"></span>
                  </label>
                  */}
                    <br />
                    <button type="submit" className="btn dark high w-100" disabled={submittingFeedback}>{submittingFeedback ? 'Submitting...' : 'Submit feedback'}</button>
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
                {/* <Lottie options={defaultOptions} height={160} width={160} /> */}
                <p>Redirecting to Stripe checkout</p>
              </div>
            </div>
          )
            : null}
        </div>
      </div> 
  //     :
  //     <div className="position-fixed d-flex flex-row align-items-center justify-content-center p-4 w-100">
	// 			<div
	// 				className="position-absolute d-flex flex-row"
	// 				style={{ left: "24px" }}
	// 			>
	// 				Used names{" "}
	// 				<div className="tag dark medium small ml-2">
	// 					{shortlist.length + rejected.length}
	// 				</div>
	// 			</div>
	// 			<button
	// 				onClick={() => changeGender(gender)}
	// 				className={`${styles.genderSwitchWrapper}`}
	// 				style={{
	// 					padding: "14px",
	// 					gap: "24px",
	// 					width: "100px",
	// 					height: "52px",
	// 				}}
	// 			>
	// 				<div
	// 					className={`${styles.genderSwitchStyles} ${
	// 						gender == "male"
	// 							? styles.genderSwitchStylesMale
	// 							: styles.genderSwitchStylesFemale
	// 					} position-absolute bg-light-900 radius-5`}
	// 					style={{ top: "2px", height: "48px", width: "48px" }}
	// 				></div>
	// 				<svg
	// 					className={`${styles.genderSwitchMaleIcon} ${
	// 						gender == "male" && styles.active
	// 					}`}
	// 					style={{ zIndex: "1" }}
	// 					height="24"
	// 					viewBox="0 0 24 24"
	// 					fill="none"
	// 					xmlns="http://www.w3.org/2000/svg"
	// 				>
	// 					<path fillRule="evenodd" clipRule="evenodd" d={ICONS.MALE} />
	// 				</svg>
	// 				<svg
	// 					className={`${styles.genderSwitchFemaleIcon} ${
	// 						gender == "female" && styles.active
	// 					}`}
	// 					style={{ zIndex: "1" }}
	// 					height="24"
	// 					viewBox="0 0 24 24"
	// 					fill="none"
	// 					xmlns="http://www.w3.org/2000/svg"
	// 				>
	// 					<path fillRule="evenodd" clipRule="evenodd" d={ICONS.FEMALE} />
	// 				</svg>
	// 			</button>
	// 			<div
	// 				className="position-absolute d-flex flex-row"
	// 				style={{ right: "24px" }}
	// 			>
	// 				<Link href="/shortlist" className="btn primary low small text-only">
	// 					View shortlist{" "}
	// 					<div className="tag dark medium small ml-2">{shortlist.length}</div>
	// 				</Link>
	// 			</div>
	// 		</div>
  )
}

export default Header;