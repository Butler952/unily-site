import { useState, useEffect, forwardRef, Children } from 'react';
import fire from '../../config/fire-config';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { Dropdown } from 'react-bootstrap';
import styles from './Header.module.scss'
import Icon from '../icon/Icon';
import ICONS from '../icon/IconPaths';
import { loadStripe } from '@stripe/stripe-js';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loader.json'

const Header = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileUrl, setProfileUrl] = useState('/')
  const [profile, setProfile] = useState('')
  const [windowUrl, setWindowUrl] = useState('')
  const [userData, setUserData] = useState('')
  const [stage, setStage] = useState('')
  const router = useRouter();
  const [redirectToStripe, setRedirectToStripe] = useState(false);
  const [product, setProduct] = useState('');
  const [active, setActive] = useState('');
  const [status, setStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelAt, setCancelAt] = useState('');

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
          setLoggedIn(true)
          loggedInRoute(user)
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

  const loggedInRoute = (user) => {
    setUserData(user)
    var docRef = fire.firestore().collection('users').doc(user.uid)

    docRef.get()
      .then((doc) => {
        if (doc.exists) {
          setProfile(doc.data().profile)
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

  const handleLogout = () => {
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
    async function handleUpdate(e){
      e.preventDefault();
      const functionRef = fire.app().functions('europe-west2').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
      const { data } = await functionRef({ returnUrl: window.location.origin  + '/settings' });
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
    <div className="card rounded-0 d-flex flex-row justify-content-between align-items-center p-2 px-md-3" style={props.hideShadow ? { boxShadow: 'none', minHeight: '64px' } : {minHeight: '64px'}}>
      {loggedIn ?
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
        : null
      }
      {!loggedIn
        ?
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
        :
        <div className="d-flex">
          {/* {profile.profile_pic_url &&
            <img src={profile.profile_pic_url} style={{width: '48px', borderRadius:'100%'}} />
          } */}
          {stage !== 'complete' ?
            <button className="btn primary low small" onClick={handleLogout}>Logout</button>
            :
            <Dropdown align="end">
              <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                <img src={profile.profile_pic_url} style={{ width: '48px', borderRadius: '100%' }} />
              </Dropdown.Toggle>

              <Dropdown.Menu as={CustomMenu} className="mt-2">
                <Link href={profileUrl}>
                  <a className={styles.dropdownItem}>
                    <img src={profile.profile_pic_url} style={{ width: '48px', borderRadius: '100%' }} />
                    {profile.full_name}
                  </a>
                </Link>
                <hr className="m-0" />
                <Link href={"/settings"}>
                  <a className={styles.dropdownItem}>
                    <Icon icon={ICONS.SETTINGS} size='24' className="fill-dark-900" />
                    Settings
                  </a>
                </Link>
                <a onclick="$crisp.push(['do', 'chat:open'])" className={`${styles.dropdownItem}`}>
                  <Icon icon={ICONS.FEEDBACK} size='24' />
                  Submit feedback
                </a>
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
                          <a onClick={() => handleUpdate(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                            <Icon icon={ICONS.STAR} size='24' />
                            Renew subscription
                          </a> 
                        : 
                          null
                        ) 
                      : 
                        <a onClick={() => handleUpgrade(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                          <Icon icon={ICONS.STAR} size='24' />
                          Upgrade to premium
                        </a> 
                      ) 
                  : 
                    <a onClick={() => handleUpgrade(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                      <Icon icon={ICONS.STAR} size='24' />
                      Upgrade to premium
                    </a> 
                  ) 
                : 
                  <a onClick={() => handleUpgrade(event)} className={`${styles.dropdownItem} ${styles.dropdownItemHighlight}`}>
                    <Icon icon={ICONS.STAR} size='24' />
                    Upgrade to premium
                  </a> 
                }



                <hr className="m-0" />
                <a onClick={() => handleLogout()} className={`${styles.dropdownItem} ${styles.dropdownItemLow}`}>
                  <Icon icon={ICONS.LOG_OUT} size='24' />
                  Sign out
                </a>
              </Dropdown.Menu>
            </Dropdown>
          }
          {/* <Link href="/settings">
            <a className="btn primary low small">Settings</a>
          </Link>
           */}
        </div>
      }
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