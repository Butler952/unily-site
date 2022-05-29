import { useState, useEffect, forwardRef, Children, useContext } from 'react';
import fire from '../../config/fire-config';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { Dropdown, Modal } from 'react-bootstrap';
import styles from './Header.module.scss'
import Icon from '../icon/Icon';
import ICONS from '../icon/IconPaths';
import { loadStripe } from '@stripe/stripe-js';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loader.json'
import { UserContext } from '../../pages/_app';

const Header = (props) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [loggedIn, setLoggedIn] = useState(false);
  const [profileUrl, setProfileUrl] = useState(userContext && userContext.profileUrl && userContext.profileUrl)
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
    setWindowUrl(window.location.pathname);
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
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
            setStage(doc.data().stage)
            // if (doc.data().stage !== 'complete') {
            //   router.push(doc.data().stage)
            // }
            if (doc.data().profileUrl) {
              setProfileUrl(doc.data().profileUrl)
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

  const commentsAndSuggestionsChange = (value) => {
    setCommentsAndSuggestions(value)
    setCommentsAndSuggestionsError('')
  }

  const furtherResearchChange = () => {
    setFurtherResearch(furtherResearch => !furtherResearch)
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
      className={styles.toggleLink}
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
    <div className="card rounded-0 d-flex flex-row justify-content-between align-items-center p-2 px-md-3" style={windowUrl == '/' ? { boxShadow: 'none', minHeight: '64px' } : { minHeight: '64px' }}>
      {userContext !== '' ?
        // {loggedIn ?
        <>
          <div>
            <Link href={profileUrl}>
              <a><img src="/images/vitaely-logo-icon.svg" style={{ height: '32px' }} /></a>
            </Link>
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
            {stage !== 'complete' ?
              <button className="btn primary low small" onClick={handleLogout}>Logout</button>
              :
              <Dropdown align="end">
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                  <>
                    {!headerImageError ?
                      <img
                        src={userContext.profile.profile_pic_url}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          setHeaderImageError(true)
                          // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/vitaely-me/128x128_vitaely-me.webp?1653343176406";
                        }}
                        style={{ width: '48px', borderRadius: '100%' }}
                      />
                      :
                      <button className="btn dark low small icon-only">
                        <svg viewBox="0 0 24 24">
                          <path d={ICONS.MENU}></path>
                        </svg>
                      </button>
                    }
                  </>
                  {/* <img src="foo.jpg" onerror="if (this.src != 'error.jpg') this.src = 'error.jpg';"> */}

                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu} align="end" className="mt-2">
                  <Dropdown.Item onClick={() => router.push(profileUrl)} className={styles.dropdownItem}>
                      {!headerImageError ?
                        <div className="bg-dark-200" style={{ width: '48px', height: '48px', borderRadius: '100%' }}>
                          <img src={userContext.profile.profile_pic_url} style={{ width: '48px', borderRadius: '100%' }} />
                        </div>
                        : null}
                      {userContext.profile.full_name}
                  </Dropdown.Item>
                  <hr className="m-0" />
                  <Dropdown.Item onClick={() => router.push('/settings')} className={styles.dropdownItem}>
                    <Icon icon={ICONS.SETTINGS} size='24' className="fill-dark-900" />
                    Settings
                  </Dropdown.Item>
                  {/* <Link href={"/settings"} >
                    <div className={styles.dropdownItem}>
                      <Icon icon={ICONS.SETTINGS} size='24' className="fill-dark-900" />
                      Settings
                    </div>
                  </Link> */}
                  <Dropdown.Item onClick={() => handleFeedbackShow()} className={`${styles.dropdownItem}`}>
                    <Icon icon={ICONS.FEEDBACK} size='24' />
                    Submit feedback
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

                  {product !== '' ?
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
                  }



                  <hr className="m-0" />
                  <Dropdown.Item onClick={() => handleLogout()} className={`${styles.dropdownItem} ${styles.dropdownItemLow}`}>
                    <Icon icon={ICONS.LOG_OUT} size='24' />
                    Sign out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            }
            {/* <Link href="/settings">
            <a className="btn primary low small">Settings</a>
          </Link>
           */}
          </div>
        </>
        :
        <div className="d-flex flex-row justify-content-between align-items-center w-100">
          <Link href="/">
            <a><img src={screenWidth > 767 ? "/images/vitaely-logo-full.svg" : "/images/vitaely-logo-icon.svg"} style={windowUrl === '/' ? { margin: '16px', height: '40px' } : { marginLeft: '16px', height: '32px' }} /></a>
          </Link>
          <div className="d-flex" style={{ gap: '8px' }}>
            {screenWidth > 767 ? (
              <>
                <Link href="/blog">
                  <a className="btn dark low small">Blog</a>
                </Link>
                <div className="bg-dark-300 mx-3" style={{ width: '1px', height: '48px' }}></div>
              </>
            )
              : null}

            {/* <Link href="/users/register">
              <a className={`btn primary small ${windowUrl === '/' ? 'medium' : 'high'}`}>Register</a>
            </Link> */}
            <Link href="/users/login">
              <a className="btn primary medium small">Login</a>
            </Link>
            <Link href="/users/register">
              <a className="btn primary high small">Create my page</a>
            </Link>
          </div>
        </div>
      }
      <Modal
        show={showFeedbackModal}
        onHide={handleFeedbackClose}
        backdrop="static"
        keyboard={false}
      // size="lg"
      >
        {!submittedFeedback ? <Modal.Header closeButton>
          <h5 className="text-dark-high mb-0">Feedback survey</h5>
          <button onClick={handleFeedbackClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> : ''}
        {!submittedFeedback ?
          <Modal.Body>
            <div>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-4">
                  <p className="large text-dark-high">Do you have any other comments, feedback or suggestions for us?</p>
                  <textarea className="w-100 small" style={{ minHeight: '10rem' }} disabled={submittingFeedback} value={commentsAndSuggestions} onChange={({ target }) => commentsAndSuggestionsChange(target.value)} />
                  {commentsAndSuggestionsError !== '' ? <p className="small text-error-high">{commentsAndSuggestionsError}</p> : null}
                </div>
                <div className="mb-4">
                  <p className="large text-dark-high">Are you willing to be contacted by a member of our team for further research?</p>
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
  )
}

export default Header;