import fire from '../../config/fire-config';
import Link from 'next/link'
import { Accordion, Container, useAccordionToggle } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router'

import styles from './Freelance.module.scss'
import profileStyles from './Freelance.module.scss'
import SurveyBanner from '../banner/SurveyBanner';
import { useEffect, useState, useContext } from 'react';
import ICONS from '../icon/IconPaths';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import { UserContext } from '../../pages/_app';
import Icon from '../icon/Icon';
import convertToLink from '../../utils/convertToLink';

const Freelance = (props) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [currentUserId, setCurrentUserId] = useState('')
  const [showMore, setShowMore] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [headerImageError, setHeaderImageError] = useState(false);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  useEffect(() => {
    checkUser();
    mixpanel.init(mixpanelConfig);
    mixpanel.track('Profile');
  }, [])

  const checkUser = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setCurrentUserId(user.uid)
        setLoggedIn(true)
        // ...
      } else {
        setLoggedIn(false)
        // User is signed out
        // ...
      }
    });
  }

  const getSummaryText = () => {
    // For Text that is shorter than desired length
    if (props.summary.length <= 258) return (
      <p className={`large mb-0 ` + styles.summary}>
        {props.summary}
      </p>
    );
    // If text is longer than desired length & showMore is true
    if (props.summary.length > 258 && showMore) {
      return (
        <>
          <p className={`large mb-0 ` + styles.summary}>
            {props.summary} <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setShowMore(false)}>Show less</u>
          </p>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (props.summary.length > 258) {
      return (
        <>
          <p className={`large mb-0 ` + styles.summary}>
            {props.summary.slice(0, 258)}... <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setShowMore(true)}>Read more</u>
          </p>
        </>
      );
    }
  };

  const getDescriptionText = (description, descriptionShowMore, setDescriptionShowMore) => {
    // For Text that is shorter than desired length
    if (description.length <= 258) return (
      <span>
        {description}
      </span>
    );
    // If text is longer than desired length & showMore is true
    if (description.length > 258 && descriptionShowMore) {
      return (
        <>
          <span>
            {description} <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setDescriptionShowMore(false)}>Show less</u>
          </span>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (description.length > 258) {
      return (
        <>
          <span>
            {description.slice(0, 258)}... <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setDescriptionShowMore(true)}>Read more</u>
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

  return (
    // <body className={profileStyles.body}>
      <div className={profileStyles.body} style={{paddingTop: '66px'}}>
        {props.email !== undefined ?
          <>
            <Head>
              <title>{props.full_name} {props.headline && `| ${props.headline}`}</title>
              {props.summary ? <meta name="description" content={props.summary} /> : null}
              {props.full_name && <meta name="author" content={props.full_name} />}
              <meta property="og:title" content={`${props.full_name} | ${props.headline}`} />
              {props.summary ? <meta property="og:description" content={props.summary} /> : null}
              {props.level == "profile" && <meta property="og:url" content={`https://www.expertpage.io/profile/${props.pageId}`} />}
              {props.level == "baseLevel" && <meta property="og:url" content={`https://www.expertpage.io/${props.pageId}`} />}
              {props.background_cover_image_url ? <meta property="og:image" content={props.background_cover_image_url} /> : null}
              <meta property="og:type" content="website" />
            </Head>
            <div>
              {props.pageId === currentUserId && !props.surveyOnSignUpHide ? <SurveyBanner /> : ''}
              <Container>
                <div className="mb-5 d-flex flex-column">
                  {/* {(props.background_cover_image_url && !headerImageError) &&
                    <>
                      <img
                        src={props.background_cover_image_url}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          setHeaderImageError(true)
                          // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/ExpertPage-me/128x128_ExpertPage-me.webp?1653343176406";
                        }}
                        style={{ display: 'none' }}
                      />
                      <div
                        className={styles.headerImage}
                        style={{ backgroundImage: `url(${props.background_cover_image_url})` }}
                      />
                    </>
                  } */}
                  {!profilePictureError | props.profile_pic_url !== '' | props.profile_pic_url !== null &&
                    // <img
                    //   src={userContext && userContext.profile && userContext.profile.profile_pic_url !== undefined ? userContext.profile.profile_pic_url : props.profile_pic_url}
                    //   onError={({ currentTarget }) => {
                    //     currentTarget.onerror = null; // prevents looping
                    //     setProfilePictureError(true)
                    //     // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/ExpertPage-me/128x128_ExpertPage-me.webp?1653343176406";
                    //   }}
                    //   style={props.background_cover_image_url ? { marginTop: '-72px' } : { marginTop: '48px' }}
                    //   className={styles.profilePicture}
                    // />
                    <>
                      {/* <img
                        src={props.profile_pic_url}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.className = 'd-none'
                          // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/ExpertPage-me/128x128_ExpertPage-me.webp?1653343176406";
                        }}
                        // style={props.background_cover_image_url ? { marginTop: '-72px' } : { marginTop: '48px' }}
                        style={{marginTop: '48px' }}
                        className={styles.profilePicture}
                      /> */}
                      <div
                        style={{
                          backgroundImage: `url(${props.profile_pic_url})`,
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
                  <div className="mb-5 d-flex flex-column">
                    {props.full_name &&
                      <h1 className="display2 text-gradient-2 mb-1">
                        {`Hi, I'm ${props.full_name}.`}<br></br>
                        { props.headline && <h1 className="display2 text-gradient-0">{props.headline}</h1> }
                      </h1>
                    }
                    {/* {props.headline &&
                      <h5 className="mb-0" style={{ maxWidth: '640px' }}>{props.headline}</h5>
                    } */}
                  </div>
                  {props.email &&
                    <div className="d-flex justify-content-start flex-column flex-md-row" style={{ gap: '12px' }}>
                      {props.email &&
                        <a href={'mailto:' + props.email} target="_blank" className="btn primary high large w-100 w-md-auto">Contact me</a>
                      }
                      {props.links &&
                        props.links.map((link, index) => {
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
                  }
                </div>
                {/* {props.summary &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    <h4>About</h4>
                    <div className={styles.profileCard + ' card p-4'}>
                      {getSummaryText()}
                    </div>
                    <br /><br />
                  </div>
                } */}
                {(props.products && props.products.length > 0) &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    <h1 className="mb-5 pb-3">Products</h1>
                    <div className={`${styles.layoutGrid}`}>
                        {props.products.map((product, index) => {
                          const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                          return (
                            <div key={index} className={`d-flex flex-column align-items-start`}>
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
                              <div className="w-100">
                                <h3 className="mb-3">{product.name}</h3>
                                {product.description ? <p className="large mb-0">{getDescriptionText(product.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                              </div>
                              { product.url && <a target="_blank" href={convertToLink(product.url)} className="btn primary high w-100 w-md-auto mt-4">Buy now</a>}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                }
                {(props.services && props.services.length > 0) &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    <h1 className="mb-5 pb-3">Services</h1>
                    <div className={`${styles.layoutGrid}`}>
                        {props.services.map((service, index) => {
                          const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                          return (
                            <div key={index} className={`d-flex flex-column align-items-start`}>
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
                              <div className="w-100">
                                <h3 className="mb-3">{service.name}</h3>
                                {service.description ? <p className="large mb-0">{getDescriptionText(service.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                              </div>
                              <a href={service.url ? convertToLink(service.url) : 'mailto:' + props.email} className="btn primary high w-100 w-md-auto mt-4">{service.url ? 'Learn more' : 'Contact me'}</a>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                }
                {/* {(props.projects && props.projects.length > 0) &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    <h1 className="mb-5 pb-3">Projects</h1>
                    <div className={`${styles.layoutGrid}`}>
                        {props.projects.sort(sortByDate).map((project, index) => {
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
                {(props.testimonials && props.testimonials.length > 0) &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    <h1 className="mb-5 pb-3">Testimonials</h1>
                    <div className={`${styles.layoutGrid}`}>
                        {props.testimonials.sort(sortPosts).map((testimonial, index) => {
                          const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                          return (
                            <div key={index} className={`d-flex flex-column align-items-start`}>
                              {testimonial.avatar_url ?
                                <div className="mb-4">
                                  <a target="_blank" href={convertToLink(testimonial.url)}>
                                    <div>
                                      <div className={`position-relative overflow-hidden ${profileStyles.avatarImage}`} style={{ backgroundImage: `url(${testimonial.avatar_url ? testimonial.avatar_url : null})`, width: '80px', height: '80px' }}></div>
                                    </div>
                                  </a>
                                </div>
                                : null
                              }
                              <div className="w-100">
                                <div className="d-flex flex-column mb-3">
                                  <h3 className="mb-2">{testimonial.name}</h3>
                                  {testimonial.title ? <p className="large text-dark-high mb-0">{testimonial.title}</p> : null}
                                </div>
                                {testimonial.description ? <p className="large mb-0">{getDescriptionText(testimonial.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                                {testimonial.posted_at && 
                                  <p className="text-dark-low large mt-3">
                                    {testimonial.posted_at ? (testimonial.posted_at.month ? convertMonth(testimonial.posted_at.month) + " " : '') : null}
                                    {testimonial.posted_at ? (testimonial.posted_at.year ? testimonial.posted_at.year + " " : null) : null}
                                  </p>
                                }
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                }
                {(props.posts && props.posts.length > 0) &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    <h1 className="mb-5 pb-3">Posts</h1>
                    <div className={`${styles.layoutGrid}`}>
                        {props.posts.sort(sortPosts).map((post, index) => {
                          const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                          return (
                            <div key={index} className={`d-flex flex-column align-items-start`}>
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
                                <h3 className="mb-3">{post.name}</h3>
                                {post.description ? <p className="large mb-0">{getDescriptionText(post.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                                {post.posted_at && 
                                  <p className="text-dark-low large mt-3">
                                    {post.posted_at ? (post.posted_at.month ? convertMonth(post.posted_at.month) + " " : '') : null}
                                    {post.posted_at ? (post.posted_at.year ? post.posted_at.year + " " : null) : null}
                                  </p>
                                }
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                }
                {(props.featured && props.featured.length > 0) &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    {/* <h1 className="mb-5 pb-3">Featured in</h1> */}
                    <div className={`${styles.featuredGrid}`}>
                        {props.featured.map((feature, index) => {
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
                }
                {/* {props.email &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    <div className="mb-5 d-flex flex-column">
                      {props.full_name &&
                        <h1 className="display2 text-gradient-2 mb-1">
                          <span className="display2 text-gradient-0">{'Find out how we could work together'}</span>
                        </h1>
                      }
                    </div>
                    <div className="d-flex justify-content-start">
                      <a href={'mailto:' + props.email} target="_blank" className="btn primary large high">Contact me</a>
                    </div>
                    <br /><br />
                  </div>
                } */}
              </Container>
              <div className='py-5 text-center'>
                <Container>
                  <a href="/" style={{textDecoration: 'none'}}>
                    <svg height="48" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        className="fill-dark-700"
                        fill-rule="evenodd" 
                        clip-rule="evenodd" 
                        d={ICONS.LOGO} 
                      />
                    </svg>
                    <p className="text-dark-low mt-2 mb-0">Powered by ExpertPage</p>
                  </a>
                  {/* <p className="text-dark-low mb-0">Powered by <Link href="/">ExpertPage</Link></p> */}
                </Container>
              </div>
            </div>
          </>
          :
          <div className="d-flex justify-content-center align-items-center bg-light-900 py-5" style={{ minHeight: '100vh' }}>
            <Container>
              <div className="py-5 background-light">
                <div className="d-flex flex-column align-items-center container text-center">
                  {props.screenWidth && props.screenWidth > 767 ?
                    <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Page not found</h2>
                    :
                    <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Page not found</h2>
                  }
                  <p className="mx-auto mb-5 text-dark-med large">Turn your Linkedin profile into a landing page in two minutes</p>
                  <Link href="/users/register">
                    <a className="btn primary high large">Get started</a>
                  </Link>
                </div>
              </div>
            </Container>
          </div>
        }
      </div>
    // </body>
  )
}

export default Freelance