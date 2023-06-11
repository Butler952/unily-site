import fire from '../../config/fire-config';
import Link from 'next/link'
import { Accordion, Container, useAccordionToggle } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router'

import styles from './profile.module.scss'
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
      <p className="text-dark-med large mb-0">
        {description}
      </p>
    );
    // If text is longer than desired length & showMore is true
    if (description.length > 258 && descriptionShowMore) {
      return (
        <>
          <p className="text-dark-med large mb-0">
            {description} <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setDescriptionShowMore(false)}>Show less</u>
          </p>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (description.length > 258) {
      return (
        <>
          <p className="text-dark-med large mb-0">
            {description.slice(0, 258)}... <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setDescriptionShowMore(true)}>Read more</u>
          </p>
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
    <body style={{background: '#ffffff'}}>
      <div>
        {props.email !== undefined ?
          <>
            <Head>
              <title>{props.full_name} {`| Resume`}</title>
              {props.summary ? <meta name="description" content={props.summary} /> : null}
              {props.full_name && <meta name="author" content={props.full_name} />}
              <meta property="og:title" content={`${props.full_name} | Resume`} />
              {props.summary ? <meta property="og:description" content={props.summary} /> : null}
              {props.level == "profile" && <meta property="og:url" content={`https://www.expertpage.io/profile/${props.pageId}`} />}
              {props.level == "baseLevel" && <meta property="og:url" content={`https://www.expertpage.io/${props.pageId}`} />}
              {props.background_cover_image_url ? <meta property="og:image" content={props.background_cover_image_url} /> : null}
              <meta property="og:type" content="website" />
            </Head>
            <div>
              {props.pageId === currentUserId && !props.surveyOnSignUpHide ? <SurveyBanner /> : ''}
              <Container>
                <div className="d-flex flex-column" >
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
                  <div className="d-flex flex-column" style={{paddingTop: '240px', paddingBottom: '80px'}}>
                    <h1 className="display1 mb-0">Resume</h1>
                  </div>
                </div>
                {props.summary &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    <h1>About {props.first_name}</h1>
                    <div>
                      <p className="extra-large mb-0" style={{maxWidth: '720px'}}>{props.summary}</p>
                    </div>
                  </div>
                }
                
                {(props.experiences && props.experiences.length > 0) &&
                    <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                      <h1 className="mb-5 pb-3">Experience</h1>
                      <div className="d-flex flex-column" style={{gap: '56px'}}>
                        {props.experiences.sort(sortByDate).map((job, index) => {
                        const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                          return (
                            <div key={index} className="d-flex flex-column align-items-start w-100">
                              <a target="_blank" href={job.company_linkedin_profile_url && convertToLink(job.company_linkedin_profile_url)}>
                                <h3 className="mb-2">
                                  {job.company} {job.starts_at ? (job.starts_at.year ? job.starts_at.year + " " : null) : null} {job.starts_at && job.ends_at == null ? ' / Now' : null} {job.starts_at && job.ends_at && job.ends_at.month && job.ends_at.year ? (job.starts_at.month == job.ends_at.month || job.starts_at.year == job.ends_at.year ? null : ` / ${job.ends_at.year}`) : null}
                                </h3>
                              </a>
                              <p className="extra-large">{job.title}</p>
                              {job.description ? <p className="extra-large mb-0" style={{maxWidth: '720px'}}>{getDescriptionText(job.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  }
                {(props.education && props.education.length > 0) &&
                  <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
                    <h1 className="mb-5 pb-3">Education</h1>
                    <div className="d-flex flex-column" style={{gap: '56px'}}>
                      {props.education.sort(sortByDate).map((school, index) => {
                      const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                        return (
                          <div key={index} className="d-flex flex-column align-items-start w-100">
                            <a target="_blank" href={school.school_linkedin_profile_url && convertToLink(school.school_linkedin_profile_url)}>
                              <h3 className="mb-2">
                                {school.school} {school.starts_at ? (school.starts_at.year ? school.starts_at.year + " " : null) : null} {school.starts_at && school.ends_at == null ? ' / Now' : null} {school.starts_at && school.ends_at && school.ends_at.month && school.ends_at.year ? (school.starts_at.month == school.ends_at.month || school.starts_at.year == school.ends_at.year ? null : ` / ${school.ends_at.year}`) : null}
                              </h3>
                            </a>
                            {/* <p className="extra-large">{job.title}</p> */}
                            <p className="extra-large">{`${school.field_of_study ? school.field_of_study : ''} ${school.field_of_study && school.degree_name ? `(${school.degree_name})` : (school.degree_name ? school.degree_name : '')}`}</p>
                            {school.description ? <p className="extra-large mb-0" style={{maxWidth: '720px'}}>{getDescriptionText(school.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                }
                {props.email &&
                  <div className="my-5">
                    <div className="mb-5 d-flex flex-column">
                      {props.full_name &&
                        <h1 className="display2 text-gradient-2 mb-1">
                          {`Book a call `}<span className="display2 text-gradient-0">{'to find out how we could work together'}</span>
                        </h1>
                      }
                    </div>
                    <div className="d-flex justify-content-start">
                      <a href={'mailto:' + props.email} target="_blank" className="btn primary large high">Contact me</a>
                    </div>
                    <br /><br />
                  </div>
                }
              </Container>
              <div className='py-5 text-center'>
                <Container>
                  <a href="/" style={{textDecoration: 'none'}}>
                    <svg height="32" viewBox="0 0 85 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Nothing to see here</h2>
                    :
                    <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Nothing to see here</h2>
                  }
                  <p className="mx-auto mb-5 text-dark-med large">It's possible that this page was in the lighthouse at Alexandria.</p>
                  <Link href="/" className="btn primary high large">Head home</Link>
                </div>
              </div>
            </Container>
          </div>
        }
      </div>
    </body>
  )
}

export default Freelance