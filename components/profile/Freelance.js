import fire from '../../config/fire-config';
import Link from 'next/link'
import { Accordion, Container, useAccordionToggle } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router'

import styles from './Freelance.module.scss'
import profileStyles from './Freelance.module.scss'
import lightThemeStyles from './FreelanceLightTheme.module.scss'
import darkThemeStyles from './FreelanceDarkTheme.module.scss'
import SurveyBanner from '../banner/SurveyBanner';
import { useEffect, useState, useContext } from 'react';
import ICONS from '../icon/IconPaths';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import { UserContext } from '../../pages/_app';
import Icon from '../icon/Icon';
import convertToLink from '../../utils/convertToLink';
import Cal, { getCalApi } from "@calcom/embed-react";

const Freelance = ({
  level,
  screenWidth,
  pageId,
  template,
  theme,
  subscriptionProduct,
  subscriptionActive,
  subscriptionStatus,
  email,
  linksPrimary,
  links,
  profile_pic_url,
  background_cover_image_url,
  full_name,
  first_name,
  last_name,
  headline,
  summary,
  products,
  services,
  featured,
  experiences,
  projects,
  side_projects,
  testimonials,
  posts,
  book_call_url,
  education,
  logoVisibility,
  volunteer_work,
  surveyOnSignUpHide,
  displayInfo,
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

  const [currentUserId, setCurrentUserId] = useState('')
  const [showMore, setShowMore] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [headerImageError, setHeaderImageError] = useState(false);

  const [product, setProduct] = useState('');
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelAt, setCancelAt] = useState('');

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const router = useRouter();

  useEffect(() => {
    // checkUser();
    document.body.style.background = theme?.mode == 'dark' ? '#1F2430 ' : '#ffffff';

    mixpanel.init(mixpanelConfig);
    mixpanel.track('Profile');

    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setCurrentUserId(user.uid)
          getSubscription(user)
          setLoggedIn(true)
        } else {
          setLoggedIn(false)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, [])

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


  // const checkUser = () => {
  //   fire.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User
  //       setCurrentUserId(user.uid)
  //       getSubscription(user)
  //       setLoggedIn(true)
  //       // ...
  //     } else {
  //       setLoggedIn(false)
  //       // User is signed out
  //       // ...
  //     }
  //   });
  // }

  const getSummaryText = () => {
    // For Text that is shorter than desired length
    if (summary.length <= 480) return (
      <p className={` mb-0 ${styles.summary} ${theme?.mode == 'dark' && 'text-light-med'}`}>
        {summary}
      </p>
    );
    // If text is longer than desired length & showMore is true
    if (summary.length > 480 && showMore) {
      return (
        <>
          <p className={` mb-0 ${styles.summary} ${theme?.mode == 'dark' && 'text-light-med'}`}>
            {summary} <u style={{ cursor: 'pointer' }} className={`${theme?.mode !== 'dark' ? 'text-dark-low' : 'text-light-med'}`} onClick={() => setShowMore(false)}>Show less</u>
          </p>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (summary.length > 480) {
      return (
        <>
          <p className={` mb-0 ${styles.summary} ${theme?.mode == 'dark' && 'text-light-med'}`}>
            {summary.slice(0, 480)}... <u style={{ cursor: 'pointer' }} className={`${theme?.mode !== 'dark' ? 'text-dark-low' : 'text-light-med'}`} onClick={() => setShowMore(true)}>Read more</u>
          </p>
        </>
      );
    }
  };

  const getDescriptionText = (description, descriptionShowMore, setDescriptionShowMore) => {
    // For Text that is shorter than desired length
    if (description.length <= 480) return (
      <span>
        {description}
      </span>
    );
    // If text is longer than desired length & showMore is true
    if (description.length > 480 && descriptionShowMore) {
      return (
        <>
          <span>
            {description} <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setDescriptionShowMore(false)}>Show less</u>
          </span>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (description.length > 480) {
      return (
        <>
          <span>
            {description.slice(0, 480)}... <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setDescriptionShowMore(true)}>Read more</u>
          </span>
        </>
      );
    }
  };

  const sortByDate = (a, b) => {
    if (a.starts_at &&
      b.starts_at) {
      // console.log(`sorted ${a.company}`)
      if (a.ends_at == undefined & b.ends_at == undefined) {
        if (b.starts_at.year < a.starts_at.year)
          return -1;
        if (b.starts_at.year > a.starts_at.year)
          return 1;
        if (b.starts_at.year == a.starts_at.year) {
          if (b.starts_at.month < a.starts_at.month)
            return -1;
          if (b.starts_at.month > a.starts_at.month)
            return 1;
        }
      }
      if (a.ends_at == undefined) {
        return -1;
      }
      if (b.ends_at == undefined) {
        return 1;
      }
      if (b.ends_at.year < a.ends_at.year) {
        // console.log(`${b.company} end year is earlier than ${a.company}`)
        return -1;
      }
      if (b.ends_at.year > a.ends_at.year) {
        // console.log(`${b.company} end year is later than ${a.company}`)
        return 1;
      }
      if (b.ends_at.year == a.ends_at.year) {
        // console.log(`${b.company} end year is the same as ${a.company}`)
        if (b.ends_at.month < a.ends_at.month) {
          // console.log(`${b.company} end month is the earlier as ${a.company}`)
          return -1;
        }
        if (b.ends_at.month > a.ends_at.month) {
          // console.log(`${b.company} end month is later than ${a.company}`)
          return 1;
        }
        if (b.ends_at.month == a.ends_at.month) {
          // console.log(`${b.company} end month is the same as ${a.company}`)
          if (b.starts_at.year < a.starts_at.year)
            return -1;
          if (b.starts_at.year > a.starts_at.year)
            return 1;
          if (b.starts_at.year == a.starts_at.year) {
            if (b.starts_at.month < a.starts_at.month)
              return -1;
            if (b.starts_at.month > a.starts_at.month)
              return 1;
          }
        }
      }
    }
    return 1;
  }

  const sortPosts = (a,b) => {
    if (a.posted_at &&
        b.posted_at) {
      // console.log(`sorted ${a.company}`)
      if (a.ends_at == undefined & b.ends_at == undefined) {
        if (b.posted_at.year < a.posted_at.year)
          return -1;
        if (b.posted_at.year > a.posted_at.year)
          return 1;
        if (b.posted_at.year == a.posted_at.year) {
          if (b.posted_at.month < a.posted_at.month)
            return -1;
          if (b.posted_at.month > a.posted_at.month)
            return 1;
        }
      }
      if (a.ends_at == undefined) {
        return -1;
      }
      if (b.ends_at == undefined) {
        return 1;
      }
      if (b.ends_at.year < a.ends_at.year){
        // console.log(`${b.company} end year is earlier than ${a.company}`)
        return -1;
      }
      if (b.ends_at.year > a.ends_at.year) {
        // console.log(`${b.company} end year is later than ${a.company}`)
        return 1;
      }
      if (b.ends_at.year == a.ends_at.year) {
        // console.log(`${b.company} end year is the same as ${a.company}`)
        if (b.ends_at.month < a.ends_at.month) {
          // console.log(`${b.company} end month is the earlier as ${a.company}`)
          return -1;
        }
        if (b.ends_at.month > a.ends_at.month) {
          // console.log(`${b.company} end month is later than ${a.company}`)
          return 1;
        }
        if (b.ends_at.month == a.ends_at.month) {
          // console.log(`${b.company} end month is the same as ${a.company}`)
          if (b.posted_at.year < a.posted_at.year)
            return -1;
          if (b.posted_at.year > a.posted_at.year)
            return 1;
          if (b.posted_at.year == a.posted_at.year) {
            if (b.posted_at.month < a.posted_at.month)
              return -1;
            if (b.posted_at.month > a.posted_at.month)
              return 1;
          }
        }
      }
    }
    return 1;
  }

  const CustomToggle = ({ eventKey }) => {
    // const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const CalEmbed = ({bookCallUrl}) => {
    let calLink = bookCallUrl.split("cal.com/").pop()

    useEffect(()=>{
      (async function () {
      const cal = await getCalApi();
      cal("ui", {"theme":theme?.mode == 'dark' ? "dark" : "light","styles":{"branding":{"brandColor":"#000000"}},"hideEventTypeDetails":false,"layout":"month_view"});
      })();
    }, [])
    return <Cal
      calLink={calLink}
      style={{width:"100%",height:"100%",overflow:"scroll"}}
      config={{layout: 'month_view'}}
    />;
    };

  return (
    // <body className={theme?.mode !== 'dark' ? lightThemeStyles.body : darkThemeStyles.body}>
      <>
        {email !== undefined ?
          <div className={theme?.mode !== 'dark' ? lightThemeStyles.body : darkThemeStyles.body} style={{paddingTop: '66px'}}>

            <Head>
              <title>{full_name} {headline && `| ${headline}`}</title>
              {summary ? <meta name="description" content={summary} /> : null}
              {full_name && <meta name="author" content={full_name} />}
              <meta property="og:title" content={`${full_name} | ${headline}`} />
              {summary ? <meta property="og:description" content={summary} /> : null}
              {level == "profile" && <meta property="og:url" content={`https://www.expertpage.io/profile/${pageId}`} />}
              {level == "baseLevel" && <meta property="og:url" content={`https://www.expertpage.io/${pageId}`} />}
              {background_cover_image_url ? <meta property="og:image" content={background_cover_image_url} /> : null}
              <meta property="og:type" content="website" />
            </Head>
            <div>
              {/* {userContext?.profileUrl && <p>{userContext?.profileUrl.substr(1)}</p>}
              {<p>{pageId}</p>} */}
              {/* Check if current user profileUrl matches pageId */}
              {router.pathname == '/profile' && !surveyOnSignUpHide ? <SurveyBanner /> : ''}
              <div className="container" style={{maxWidth: '640px'}}>
                <div className="mb-5 d-flex flex-column align-items-center">
                  {/* {(background_cover_image_url && !headerImageError) &&
                    <>
                      <img
                        src={background_cover_image_url}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          setHeaderImageError(true)
                          // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/ExpertPage-me/128x128_ExpertPage-me.webp?1653343176406";
                        }}
                        style={{ display: 'none' }}
                      />
                      <div
                        className={styles.headerImage}
                        style={{ backgroundImage: `url(${background_cover_image_url})` }}
                      />
                    </>
                  } */}
                  {!profilePictureError | profile_pic_url !== '' | profile_pic_url !== null &&
                    // <img
                    //   src={userContext && userContext.profile && userContext.profile.profile_pic_url !== undefined ? userContext.profile.profile_pic_url : profile_pic_url}
                    //   onError={({ currentTarget }) => {
                    //     currentTarget.onerror = null; // prevents looping
                    //     setProfilePictureError(true)
                    //     // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/ExpertPage-me/128x128_ExpertPage-me.webp?1653343176406";
                    //   }}
                    //   style={background_cover_image_url ? { marginTop: '-72px' } : { marginTop: '48px' }}
                    //   className={styles.profilePicture}
                    // />
                    <>
                      {/* <img
                        src={profile_pic_url}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.className = 'd-none'
                          // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/ExpertPage-me/128x128_ExpertPage-me.webp?1653343176406";
                        }}
                        // style={background_cover_image_url ? { marginTop: '-72px' } : { marginTop: '48px' }}
                        style={{marginTop: '48px' }}
                        className={styles.profilePicture}
                      /> */}
                      <div
                        style={{
                          backgroundImage: `url(${profile_pic_url})`,
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          marginTop: '48px'
                        }}
                        className={styles.profilePicture}
                      >
                      </div>
                    </>
                  }
                  <br />
                  <div className="mb-5 d-flex flex-column align-items-center justify-content-center" style={{maxWidth: '720px'}}>
                    {full_name &&
                      screenWidth && screenWidth > 767 ? 
                        <>
                          <h2 className={`${theme?.mode !== 'dark' ? 'text-dark-high' : 'text-light-high'} text-center mb-3`}>
                            {`${full_name}`}<br></br>
                          </h2>
                          { headline && <p className={`large text-center mb-0 ${theme?.mode !== 'dark' ? 'text-dark-med' : 'text-light-med'}`} style={{maxWidth: '640px'}}>{headline}</p> }
                        </>
                        :
                        <>
                          <h2 className={`${theme?.mode !== 'dark' ? 'text-dark-high' : 'text-light-high'} text-center mb-3`}>
                            {`${full_name}`}<br></br>
                          </h2>
                          { headline && <p className={`large text-center mb-0 ${theme?.mode !== 'dark' ? 'text-dark-med' : 'text-light-med'}`} style={{maxWidth: '640px'}}>{headline}</p> }
                        </>
                      }
                    {/* {headline &&
                      <h5 className="mb-0" style={{ maxWidth: '640px' }}>{headline}</h5>
                    } */}
                  </div>
                  {(linksPrimary || email || links) &&
                    <div className="d-flex justify-content-center flex-column flex-md-row flex-wrap" style={{ gap: '12px' }}>
                      {linksPrimary ?
                        <a href={convertToLink(linksPrimary.url)} target="_blank" className={`btn ${theme?.mode == 'dark' ? 'light' : 'dark'} high w-100 w-sm-auto`}>{linksPrimary.label}</a>
                      
                      :
                        <a href={'mailto:' + email} target="_blank" className={`btn ${theme?.mode == 'dark' ? 'light' : 'dark'} high w-100 w-sm-auto`}>Contact me</a>
                      }
                      {links &&
                        links.map((link, index) => {
                          return (
                            <a 
                            key={index} 
                            href={convertToLink(link.url)}
                            target="_blank" 
                            className={`btn ${theme?.mode !== 'dark' ? 'dark' : 'light'} medium w-100 w-sm-auto`}>
                              {link.label}
                            </a>
                          )
                        })}
                    </div>
                  }
                  {/* originalLinksPrimary?.label ? originalLinksPrimary.label : 'Contact me' */}
                  {/* {email &&
                    <div className="d-flex justify-content-start flex-column flex-md-row" style={{ gap: '12px' }}>
                      {email &&
                        <a href={'mailto:' + email} target="_blank" className="btn primary high large w-100 w-md-auto">Contact me</a>
                      }
                      {links &&
                        links.map((link, index) => {
                          return (
                            <a 
                            key={index} 
                            href={convertToLink(link.url)}
                            target="_blank" 
                            className="btn dark medium large w-100 w-md-auto">
                              {link.label}
                            </a>
                          )
                        })}
                    </div>
                  } */}
                </div>
                {/* {summary &&
                  <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                    <h4>About</h4>
                    <div className={styles.profileCard + ' card p-4'}>
                      {getSummaryText()}
                    </div>
                    <br /><br />
                  </div>
                } */}
                {summary &&
                  <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                    {/* <h1>About {first_name}</h1> */}
                    <div className="d-block position-relative w-100">
                      <div className={`${styles.contentCard} ${theme?.mode == 'dark' && styles.contentCardDark} p-4`}>
                        <div className="w-100 my-2">
                          <h4 className={`mb-2 ${theme?.mode == 'dark' && 'text-light-high'}`}>About</h4>
                          <p className={` mb-0 ${theme?.mode == 'dark' && 'text-light-med'}`}>{getSummaryText()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {(products && products.length > 0) &&
                  pageId === currentUserId || products && products?.length > 0 ?
                  // {products && products?.length > 0 ?
                    <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                      {/* <h2 className={`mb-5 ${products?.length > 0 ? (theme?.mode == 'dark' ? 'text-light-high' : 'text-dark-high') : (theme?.mode == 'dark' ? 'text-light-low' : 'text-dark-low')}`}>Products</h2> */}
                      <h3 className={`mb-5 ${theme?.mode == 'dark' ? 'text-light-high' : 'text-dark-high'}`}>Products</h3>
                      
                      <div className={`${styles.layoutGrid}`}>
                          {products && products?.length > 0 ? products.map((product, index) => {
                            // const [productDescriptionShowMore, setProductDescriptionShowMore] = useState(false);
                            return (
                              <a target="_blank"  key={index} href={convertToLink(product.url)} className="d-block position-relative w-100">
                                <div className={`${styles.contentCard} ${theme?.mode == 'dark' && styles.contentCardDark} p-4`}>
                                  {product.logo_url ?
                                    <div className="mb-4 w-100">
                                      <a target="_blank" href={convertToLink(product.url)} className="d-block position-relative w-100">
                                        <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                                          <div className={`w-100 position-relative overflow-hidden ${profileStyles.heroImage}`} style={{ backgroundImage: `url(${product.logo_url ? product.logo_url : null})` }}>
                                          </div>
                                        </div>
                                      </a>
                                    </div>
                                    : null
                                  }
                                  <div className="w-100 my-2">
                                    <h4 className={`mb-2 ${theme?.mode == 'dark' && 'text-light-high'}`}>{product.name}</h4>
                                    {/* {product.description ? <p className={`large mb-0 ${theme?.mode == 'dark' && 'text-light-med'}`}>{getDescriptionText(product.description, productDescriptionShowMore, setProductDescriptionShowMore)}</p> : null} */}
                                    {product.description ? <p className={` mb-0 ${theme?.mode == 'dark' && 'text-light-med'}`}>{product.description}</p> : null}
                                  </div>
                                  {/* { product.url && <a target="_blank" href={convertToLink(product.url)} className="btn dark high w-100 w-sm-auto mt-4">Buy now</a>} */}
                                </div>
                              </a>
                            )
                          })
                        : 
                        null
                          // pageId === currentUserId && (
                          //   <button 
                          //     type="button" 
                          //     onClick={() => handleEditProfileShow('Add product')}
                          //     className={`d-flex flex-column align-items-start ${profileStyles.heroImagePlaceholderSection}`}
                          //   >
                          //     <div className="mb-4 w-100">
                          //       <div className="d-block position-relative w-100">
                          //         <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                          //           <div 
                          //             className={`w-100 position-relative overflow-hidden ${profileStyles.heroImagePlaceholder}`}
                          //           >
                          //             <svg height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          //               <path 
                          //                 className={`${theme?.mode !== 'dark' ? 'fill-dark-700' : 'fill-light-700'}`}
                          //                 fillRule="evenodd" 
                          //                 clipRule="evenodd" 
                          //                 d={ICONS.PLUS} 
                          //               />
                          //             </svg>
                          //           </div>
                          //         </div>
                          //       </div>
                          //     </div>
                          //     <div className="w-100">
                          //       <h3 className={`mb-3 ${products?.length > 0 ? (theme?.mode == 'dark' ? 'text-light-high' : 'text-dark-high') : (theme?.mode == 'dark' ? 'text-light-low' : 'text-dark-low')}`}>Add product</h3>
                          //     </div>
                          //   </button>
                          // )
                        }
                      </div>
                    </div>
                    :
                    null
                  }
                {(services && services.length > 0) &&
                  <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                    <h3 className={`mb-5 ${theme?.mode == 'dark' && 'text-light-high'}`}>Services</h3>
                    <div className={`${styles.layoutGrid}`}>
                        {services.map((service, index) => {
                          // const [serviceDescriptionShowMore, setServiceDescriptionShowMore] = useState(false);
                          return (
                            <a key={index} target="_blank" href={convertToLink(service.url)} className="d-block position-relative w-100">
                              <div className={`${styles.contentCard} ${theme?.mode == 'dark' && styles.contentCardDark} p-4`}>
                                {service.logo_url ? (
                                  service.url ? 
                                    <div className="mb-4 w-100">
                                      <a target="_blank" href={convertToLink(service.url)} className="d-block position-relative w-100">
                                        <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                                          <div className={`w-100 position-relative overflow-hidden ${profileStyles.heroImage}`} style={{ backgroundImage: `url(${service.logo_url ? service.logo_url : null})` }}>
                                          </div>
                                        </div>
                                      </a>
                                    </div>
                                  :
                                    <div className="mb-4 w-100">
                                      <div className="d-block position-relative w-100">
                                        <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                                          <div className={`w-100 position-relative overflow-hidden ${profileStyles.heroImage}`} style={{ backgroundImage: `url(${service.logo_url ? service.logo_url : null})` }}>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                  : null
                                }
                                <div className="w-100 my-2">
                                  <h4 className={`mb-2 ${theme?.mode == 'dark' && 'text-light-high'}`}>{service.name}</h4>
                                  {/* {service.description ? <p className={`large mb-0 ${theme?.mode == 'dark' && 'text-light-med'}`}>{getDescriptionText(service.description, serviceDescriptionShowMore, setServiceDescriptionShowMore)}</p> : null} */}
                                  {service.description ? <p className={` mb-0 ${theme?.mode == 'dark' && 'text-light-med'}`}>{service.description}</p> : null}
                                </div>
                                {/* <a href={service.url ? convertToLink(service.url) : 'mailto:' + email} className="btn primary high w-100 w-sm-auto mt-4">{service.url ? 'Learn more' : 'Contact me'}</a> */}
                              </div>
                            </a>
                          )
                        })}
                    </div>
                  </div>
                }
                {/* {(projects && projects.length > 0) &&
                  <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                    <h1 className="mb-5">Projects</h1>
                    <div className={`${styles.layoutGrid}`}>
                        {projects.sort(sortByDate).map((project, index) => {
                          const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                          return (
                            <div key={index} className={`d-flex flex-column align-items-start`}>
                              {project.logo_url ?
                                <div className="mb-4 w-100">
                                  <a target="_blank" href={convertToLink(project.url)} className="d-block position-relative w-100">
                                    <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                                      <div className={`w-100 position-relative overflow-hidden ${profileStyles.heroImage}`} style={{ backgroundImage: `url(${project.logo_url ? project.logo_url : null})` }}>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                : null
                              }
                              <div className="w-100">
                                <h3 className="mb-3">{project.name}</h3>
                                {project.description ? <p className="large mb-0">{getDescriptionText(project.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                    <br /><br />
                  </div>
                } */}
                {(testimonials && testimonials.length > 0) &&
                  <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                    <h3 className={`mb-5 ${theme?.mode == 'dark' && 'text-light-high'}`}>Testimonials</h3>
                    <div className={`${styles.layoutGrid}`}>
                        {testimonials.sort(sortPosts).map((testimonial, index) => {
                          // const [testimonialDescriptionShowMore, setTestimonialDescriptionShowMore] = useState(false);
                          return (
                            <a key={index} target="_blank" href={convertToLink(testimonial.url)}>
                              <div  className={`${styles.contentCard} ${theme?.mode == 'dark' && styles.contentCardDark} p-4`}>
                                {testimonial.description &&
                                  <div className={`radius-3 p-4 shadow-2 ${theme?.mode == 'dark' ? 'bg-dark-900' : 'bg-light-900'}  mb-4`}>
                                    <p className={` mb-0 ${theme?.mode == 'dark' && 'text-light-med'}`}>{testimonial.description}</p> 
                                  </div>
                                }
                                <div className="d-flex flex-row align-items-center gap-4">
                                  {testimonial.avatar_url ?
                                    <a target="_blank" href={convertToLink(testimonial.url)}>
                                      <div>
                                        <div className={`position-relative overflow-hidden ${profileStyles.avatarImage}`} style={{ backgroundImage: `url(${testimonial.avatar_url ? testimonial.avatar_url : null})`, width: '48px', height: '48px' }}></div>
                                      </div>
                                    </a>
                                    : null
                                  }
                                  <div className="w-100">
                                    <div className="d-flex flex-column">
                                      <h6 className={`mb-1 ${theme?.mode !== 'dark' ? 'text-dark-high' : 'text-light-high'}`}>{testimonial.name}</h6>
                                      {testimonial.title ? <p className={` ${theme?.mode !== 'dark' ? 'text-dark-med' : 'text-light-med'} mb-0`}>{testimonial.title}</p> : null}
                                    </div>
                                    {/* {testimonial.description ? <p className={`large mb-0 ${theme?.mode == 'dark' && 'text-light-med'}`}>{getDescriptionText(testimonial.description, testimonialDescriptionShowMore, setTestimonialDescriptionShowMore)}</p> : null} */}
                                    {/* {testimonial.posted_at && 
                                      <p className={`${theme?.mode !== 'dark' ? 'text-dark-low' : 'text-light-low'} mt-3`}>
                                        {testimonial.posted_at ? (testimonial.posted_at.month ? convertMonth(testimonial.posted_at.month) + " " : '') : null}
                                        {testimonial.posted_at ? (testimonial.posted_at.year ? testimonial.posted_at.year + " " : null) : null}
                                      </p>
                                    } */}
                                  </div>
                                </div>
                              </div>
                            </a>
                          )
                        })}
                    </div>
                  </div>
                }
                {(posts && posts.length > 0) &&
                  <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                    <h3 className={`mb-5 ${theme?.mode == 'dark' && 'text-light-high'}`}>Posts</h3>
                    <div className={`${styles.layoutGrid}`}>
                        {posts.sort(sortPosts).map((post, index) => {
                          const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                          return (
                            <a key={index} target="_blank" href={convertToLink(post.url)} className="d-block position-relative w-100">
                              <div  className={`${styles.contentCard} ${theme?.mode == 'dark' && styles.contentCardDark} p-4`}>
                                {post.logo_url ?
                                  <div className="mb-4 w-100">
                                    <a target="_blank" href={convertToLink(post.url)} className="d-block position-relative w-100">
                                      <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                                        <div className={`w-100 position-relative overflow-hidden ${profileStyles.heroImage}`} style={{ backgroundImage: `url(${post.logo_url ? post.logo_url : null})` }}>
                                        </div>
                                      </div>
                                    </a>
                                  </div>
                                  : null
                                }
                                <div className="w-100">
                                  <h4 className={`mb-2 ${theme?.mode == 'dark' && 'text-light-high'}`}>{post.name}</h4>
                                  {post.description ? <p className={`mb-0 ${theme?.mode == 'dark' && 'text-light-med'}`}>{getDescriptionText(post.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                                  {post.posted_at && 
                                    <p className={`text-dark-low mt-3 ${theme?.mode !== 'dark' ? 'text-dark-low' : 'text-light-low'}`}>
                                      {post.posted_at ? (post.posted_at.month ? convertMonth(post.posted_at.month) + " " : '') : null}
                                      {post.posted_at ? (post.posted_at.year ? post.posted_at.year + " " : null) : null}
                                    </p>
                                  }
                                </div>
                              </div>
                            </a>
                          )
                        })}
                    </div>
                  </div>
                }
                {book_call_url &&
                  <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                    <h3 className={`mb-5 ${theme?.mode == 'dark' && 'text-light-high'}`}>Book a call</h3>
                    <div className={`${styles.layoutGrid}`}>
                      <div className="d-block position-relative w-100">
                        <div  className={`${styles.contentCard} ${theme?.mode == 'dark' && styles.contentCardDark} p-4`}>
                          <div className="overflow-hidden w-100" >
                            <CalEmbed bookCallUrl={book_call_url} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {/* {(featured && featured.length > 0) &&
                  <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                    <div className={`${styles.featuredGrid}`}>
                        {featured.map((feature, index) => {
                          return (
                            <div key={index} className={`d-flex flex-column justify-content-center align-items-start`}>
                              {feature.logo_url ? (
                                feature.url ? 
                                  <div className="w-100">
                                    <a target="_blank" href={convertToLink(feature.url)} className="d-flex align-items-center justify-content-center position-relative w-100">
                                      <img src={feature.logo_url} alt={feature.name} className="p-4" style={{maxWidth: '240px'}} />
                                    </a>
                                  </div>
                                :
                                  <div className="w-100">
                                    <div className="d-flex align-items-center justify-content-center position-relative w-100">
                                      <img src={feature.logo_url} alt={feature.name} className="p-4" style={{maxWidth: '240px'}} />
                                    </div>
                                  </div>
                                )
                                : null
                              }
                            </div>
                          )
                        })}
                    </div>
                  </div>
                } */}
                {/* {email &&
                  <div style={{paddingTop: '64px', paddingBottom: '64px'}}>
                    <div className="mb-5 d-flex flex-column">
                      {full_name &&
                        <h1 className="display2 text-gradient-3 mb-1">
                          <span className="display2 text-gradient-0">{'Find out how we could work together'}</span>
                        </h1>
                      }
                    </div>
                    <div className="d-flex justify-content-start">
                      <a href={'mailto:' + email} target="_blank" className="btn primary large high">Contact me</a>
                    </div>
                    <br /><br />
                  </div>
                } */}
              </div>
              {/* <svg height="32" viewBox="0 0 580 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  className={`${theme?.mode == 'dark' ? 'fill-light-600' : 'fill-dark-600'}`}
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d={ICONS.LOGO_FULL} 
                />
              </svg> */}
              {product ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ?  
                // <div className='py-5 text-center'>
                //   <Container>
                //     <a href={process.env.NEXT_PUBLIC_BASE_URL} style={{textDecoration: 'none'}}>
                //       <svg height="48" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                //         <path 
                //           className={`${theme?.mode !== 'dark' ? 'fill-dark-700' : 'fill-light-700'}`}
                //           fillRule="evenodd" 
                //           clipRule="evenodd" 
                //           d={ICONS.LOGO} 
                //         />
                //       </svg>
                //       <p className={`${theme?.mode !== 'dark' ? 'text-dark-low' : 'text-light-low'} mt-2 mb-0`}>Powered by ExpertPage</p>
                //     </a>
                //     {/* <p className="text-dark-low mb-0">Powered by <Link href="/">ExpertPage</Link></p> */}
                //   </Container>
                // </div>
                null
              : null) : null ) : 
              <div className={`${theme?.mode == 'dark' ? styles.footerLinkDark : styles.footerLink} d-flex flex-center flex-column text-center mx-auto`} style={{marginTop: '96px', marginBottom: '120px'}}>
                {/* <a href="/">
                  <svg height="32" viewBox="0 0 580 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      className={`${theme?.mode == 'dark' ? 'fill-light-600' : 'fill-dark-600'}`}
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d={ICONS.LOGO_FULL} 
                    />
                  </svg>
                </a> */}
                <a className="mx-auto align-items-center flex-wrap" href="/users/register">
                  <span className="">{`Create your `}</span><svg viewBox="0 0 580 112" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '110px', height: 'auto', marginLeft: '0px', marginRight: '2px', marginBottom: '3px' }}>
                    <path 
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d={ICONS.LOGO_FULL} 
                    />
                  </svg>
                  <span className="">{` today`}</span>
                </a>

              </div>
              }
            </div>
          </div>
          :
          <div className="d-flex justify-content-center align-items-center bg-light-900 py-5" style={{ minHeight: '100vh' }}>
            <Container>
              <div className="py-5 background-light">
                <div className="d-flex flex-column align-items-center container text-center">
                  {screenWidth && screenWidth > 767 ?
                    <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Page not found</h2>
                    :
                    <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Page not found</h2>
                  }
                  <p className="mx-auto mb-5 text-dark-med large">Turn your Linkedin profile into a landing page in two minutes</p>
                  <Link href="/users/register" className="btn primary high large">Get started</Link>
                </div>
              </div>
            </Container>
          </div>
        }
      </>
    // </body>
  )
}

export default Freelance