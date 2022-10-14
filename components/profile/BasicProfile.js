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
import { UserContext } from '../../pages/_app';
import Icon from '../icon/Icon';



const BasicProfile = (props) => {

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
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e');
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
      <p className="text-dark-med mb-0 mt-3">
        {description}
      </p>
    );
    // If text is longer than desired length & showMore is true
    if (description.length > 258 && descriptionShowMore) {
      return (
        <>
          <p className="text-dark-med mb-0 mt-3">
            {description} <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setDescriptionShowMore(false)}>Show less</u>
          </p>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (description.length > 258) {
      return (
        <>
          <p className="text-dark-med mb-0 mt-3">
            {description.slice(0, 258)}... <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setDescriptionShowMore(true)}>Read more</u>
          </p>
        </>
      );
    }
  };

  const sortByDate = (a,b) => {
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
    <div>
      {props.email !== undefined ?
        <>
          <Head>
            <title>{props.full_name} {props.headline && `| ${props.headline}`}</title>
            {props.summary ? <meta name="description" content={props.summary} /> : null}
            {props.full_name && <meta name="author" content={props.full_name} />}
            <meta property="og:title" content={`${props.full_name} | ${props.headline}`} />
            {props.summary ? <meta property="og:description" content={props.summary} /> : null}
            {props.level == "profile" && <meta property="og:url" content={`https://www.vitaely.me/profile/${props.pageId}`} /> }
            {props.level == "baseLevel" && <meta property="og:url" content={`https://www.vitaely.me/${props.pageId}`} /> }
            {props.background_cover_image_url ? <meta property="og:image" content={props.background_cover_image_url} /> : null}
            <meta property="og:type" content="website" />
          </Head>
          <div style={{ marginTop: '66px' }}>
            {props.pageId === currentUserId && !props.surveyOnSignUpHide ? <SurveyBanner /> : ''}
            <Container>
              <div className="text-center mb-5">
                {(props.background_cover_image_url && !headerImageError) &&
                  <>
                    <img
                      src={props.background_cover_image_url}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        setHeaderImageError(true)
                        // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/vitaely-me/128x128_vitaely-me.webp?1653343176406";
                      }}
                      style={{ display: 'none' }}
                    />
                    <div
                      className={styles.headerImage}
                      style={{ backgroundImage: `url(${props.background_cover_image_url})` }}
                    />
                  </>
                }
                {!profilePictureError | props.profile_pic_url !== '' &&
                  // <img
                  //   src={userContext && userContext.profile && userContext.profile.profile_pic_url !== undefined ? userContext.profile.profile_pic_url : props.profile_pic_url}
                  //   onError={({ currentTarget }) => {
                  //     currentTarget.onerror = null; // prevents looping
                  //     setProfilePictureError(true)
                  //     // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/vitaely-me/128x128_vitaely-me.webp?1653343176406";
                  //   }}
                  //   style={props.background_cover_image_url ? { marginTop: '-80px' } : { marginTop: '48px' }}
                  //   className={styles.profilePicture}
                  // />
                  <img
                    src={userContext && userContext.profile && userContext.profile.profile_pic_url !== undefined ? userContext.profile.profile_pic_url : props.profile_pic_url}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.className = 'd-none'
                      // currentTarget.src="https://storage.googleapis.com/indie-hackers.appspot.com/product-avatars/vitaely-me/128x128_vitaely-me.webp?1653343176406";
                    }}
                    style={props.background_cover_image_url ? { marginTop: '-80px' } : { marginTop: '48px' }}
                    className={styles.profilePicture}
                  />
                }
                <br /> <br />
                <div className="mb-5 d-flex flex-column align-items-center">
                  {props.full_name &&
                    <h2 className="mb-1">{props.full_name}</h2>
                  }
                  {props.headline &&
                    <h5 className="mb-0" style={{ maxWidth: '640px' }}>{props.headline}</h5>
                  }
                </div>
                {props &&
                  props.displayInfo &&
                  props.displayInfo.basicInfo &&
                  props.displayInfo.basicInfo.each &&
                  props.displayInfo.basicInfo.each.email &&
                  props.displayInfo.basicInfo.each.email
                  || props.links ?
                  <div className="d-flex align-items-center flex-column flex-md-row m-auto justify-content-center" style={{ gap: '12px' }}>
                    {props.email && props.displayInfo.basicInfo.each.email &&
                      <a href={'mailto:' + props.email} className="btn primary high w-100 w-md-auto">Contact me</a>
                    }
                    {props.links &&
                      props.links.map((link, index) => {
                        return (
                          <a key={index} href={link.url} target="_blank" className="btn dark medium w-100 w-md-auto">{link.label}</a>
                        )
                      })}
                  </div>
                  : ''}
                <br /><br />
              </div>
              {props.summary &&
                <div className="mb-5">
                  <h4>About</h4>
                  <div className={styles.profileCard + ' card p-4'}>
                    {getSummaryText()}
                  </div>
                  <br /><br />
                </div>
              }
              {(props.experiences && props.experiences.length > 0) &&
                <div className="mb-5">
                  <h4>Experience</h4>
                  <div className={styles.profileCard + ' card'}>
                    {props.experiences.sort(sortByDate).map((job, index) => {
                      // {props.experiences.map((job, index) => {
                      const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                      return (
                        <Accordion key={index} className={`${styles.job} d-flex flex-column flex-lg-row align-items-start`}>
                          {/* {(props.logoVisibility ? props.logoVisibility.experience : null) && job.logo_url ?
                            <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                              <a target="_blank" href={job.company_linkedin_profile_url}>
                                <img className={styles.experienceImage} src={job.logo_url ? job.logo_url : null} />
                              </a>
                            </div>
                            : null} */}
                          {props.logoVisibility && props.logoVisibility.experience ? 
                            (job.logo_url ?
                            <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                              <a target="_blank" href={job.company_linkedin_profile_url} className="d-block position-relative" style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px', maxWidth: '80px', maxHeight: '80px', overflow: 'hidden' }}>
                                {/* <img 
                                className={styles.experienceImage} src={job.logo_url ? job.logo_url : null} 
                                style={{width: '80px', height: '80px', minWidth: '80px', minHeight: '80px'}}
                              /> */}
                                <img
                                  className="radius-3 bg-light-900"
                                  src={job.logo_url ? job.logo_url : null}
                                  onError={({ currentTarget }) => {
                                    // currentTarget.onerror = null; // prevents looping
                                    currentTarget.className = 'd-none'
                                    // currentTarget.style = "display: 'none'" 
                                    // placeholder.setAttribute("class", "bg-dark-200 radius-3 d-flex align-items-center justify-content-center d-none");
                                    // currentTarget.src="https://via.placeholder.com/150";
                                  }}
                                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '80px', minHeight: '80px', zIndex: '1' }}
                                />
                                <div id="placeholder" className="bg-dark-200 radius-3 align-items-center justify-content-center d-flex" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '80px', minHeight: '80px' }}>
                                  <Icon icon={ICONS.WORK} size='32' className="fill-dark-700" />
                                </div>
                              </a>
                            </div>
                            :
                            <div className="bg-dark-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px' }}>
                              <Icon icon={ICONS.WORK} size='32' className="fill-dark-700" />
                            </div>
                          ) : null}
                          <div className="w-100">
                            <p className="large text-dark-high font-weight-semibold mb-0">{job.title}</p>
                            <p className="large text-dark-med mb-0">{job.company}</p>
                            <p className="text-dark-low mb-0">{job.location}</p>
                            <p className="text-dark-low mb-0">
                              {job.starts_at ? (job.starts_at.month ? convertMonth(job.starts_at.month) + " " : '') : null}
                              {job.starts_at ? (job.starts_at.year ? job.starts_at.year + " " : null) : null}
                              {job.starts_at && job.ends_at == null ? ' – Present' : null}
                              {job.starts_at && job.ends_at ? " – " + (job.ends_at.month ? convertMonth(job.ends_at.month) : '') : null}
                              {job.starts_at && job.ends_at ? (job.ends_at.year ? " " + job.ends_at.year : null) : null}
                            </p>
                            {/* {job.description ? <p className="text-dark-med mb-0 mt-3">{job.description}</p> : null} */}
                            {job.description ? <p className="text-dark-med mb-0 mt-3">{getDescriptionText(job.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                          </div>
                        </Accordion>
                      )
                    })}
                    {/* { userContext && 
                userContext.profile && 
                userContext.profile.experiences !== undefined ? userContext.profile.experiences.map((job, index) => (props.displayExperience.each[index].display) && <Experience job={job} index={index}/>) : ''
              }
              { userContext && 
                userContext.profile && 
                userContext.profile.experiences == undefined ? (props.experiences).map((job, index) => (props.displayExperience.each[index].display) && <Experience job={job} index={index}/>) : '' 
              } */}
                    {/* <UserContext.Consumer>
              {({ userValue }) => (
                  userValue && 
                  userValue.profile && 
                  userValue.profile.experiences
                  .map((job, index) => (props.displayExperience.each[index].display) &&
                  <Accordion key={index} className={`${styles.job} d-flex flex-column flex-lg-row align-items-start`}>
                    {(props.logoVisibility ? props.logoVisibility.experience : null) && job.logo_url ?
                      <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                        <a target="_blank" href={job.company_linkedin_profile_url}>
                          <img className={styles.experienceImage} src={job.logo_url ? job.logo_url : null} />
                        </a>
                      </div>
                      : null}
                    <div className="w-100">
                      <p className="large text-dark-high font-weight-semibold mb-0">{job.title}</p>
                      <p className="large text-dark-med mb-0">{job.company}</p>
                      <p className="text-dark-low mb-0">{job.location}</p>
                      <p className="text-dark-low mb-0">
                        {job.starts_at ? (job.starts_at.month ? convertMonth(job.starts_at.month) + " " : '') : null}
                        {job.starts_at ? (job.starts_at.year ? job.starts_at.year + " " : null) : null}
                        {job.starts_at && job.ends_at == null ? ' – Present' : null}
                        {job.starts_at && job.ends_at ? " – " + (job.ends_at.month ? convertMonth(job.ends_at.month) : '') : null}
                        {job.starts_at && job.ends_at ? (job.ends_at.year ? " " + job.ends_at.year : null) : null}
                      </p>
                      {job.description ? <p className="text-dark-med mb-0 mt-3">{job.description}</p> : null}
  
  
                    </div>
                  </Accordion>
                )
              )}
              
              </UserContext.Consumer> */}
                  </div>
                  <br /><br />
                </div>
              }
              {(props.education && props.education.length > 0) &&
                <div className="mb-5">
                  <h4>Education</h4>
                  <div className={styles.profileCard + ' card'}>
                    {props.education.map((school, index) =>
                      <div key={index} className={`${styles.job} d-flex flex-column flex-lg-row`}>
                        {/* {(props.logoVisibility ? props.logoVisibility.education : null) && school.logo_url ?
                          <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                            <img className={styles.experienceImage} src={school.logo_url ? school.logo_url : null} />
                          </div>
                          : null} */}
                          {props.logoVisibility && props.logoVisibility.education ? 
                            (school.logo_url ?
                            <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                              <a target="_blank" href={school.school_linkedin_profile_url} className="d-block position-relative" style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px', maxWidth: '80px', maxHeight: '80px', overflow: 'hidden' }}>
                                <img
                                  className="radius-3"
                                  src={school.logo_url ? school.logo_url : null}
                                  onError={({ currentTarget }) => {
                                    // currentTarget.onerror = null; // prevents looping
                                    currentTarget.className = 'd-none'
                                    // currentTarget.style = "display: 'none'" 
                                    // placeholder.setAttribute("class", "bg-dark-200 radius-3 d-flex align-items-center justify-content-center d-none");
                                    // currentTarget.src="https://via.placeholder.com/150";
                                  }}
                                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '80px', minHeight: '80px', zIndex: '1' }}
                                />
                                <div id="placeholder" className="bg-dark-200 radius-3 align-items-center justify-content-center d-flex" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '80px', minHeight: '80px' }}>
                                  <Icon icon={ICONS.SCHOOL} size='32' className="fill-dark-700" />
                                </div>
                              </a>
                            </div>
                            :
                            <div className="bg-dark-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px' }}>
                              <Icon icon={ICONS.SCHOOL} size='32' className="fill-dark-700" />
                            </div>
                          ) : null}
                        <div>
                          <p className="large text-dark-high font-weight-semibold mb-0">
                            {`${school.field_of_study ? school.field_of_study : ''} ${school.field_of_study && school.degree_name ? `(${school.degree_name})` : (school.degree_name ? school.degree_name : '')}`}
                          </p>
                          <p className="large mb-0">{school.school}</p>
                          <p className="text-dark-low mb-0">
                            {school.starts_at ? (school.starts_at.month ? convertMonth(school.starts_at.month) + " " : '') : null}
                            {school.starts_at ? (school.starts_at.year ? school.starts_at.year + " " : null) : null}
                            {school.starts_at && school.ends_at == null ? ' – Present' : null}
                            {school.starts_at && school.ends_at ? " – " + (school.ends_at.month ? convertMonth(school.ends_at.month) : '') : null}
                            {school.starts_at && school.ends_at ? (school.ends_at.year ? " " + school.ends_at.year : null) : null}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <br /><br />
                </div>
              }
              {(props.volunteer_work && props.volunteer_work.length > 0) &&
                <div className="mb-5">
                  <h4>Volunteering</h4>
                  <div className={styles.profileCard + ' card'}>
                    {props.volunteer_work.map((volunteer, index) =>
                      <div key={index} className={`${styles.job} d-flex flex-column flex-lg-row`}>
                        {props.logoVisibility && props.logoVisibility.volunteering ? 
                          (volunteer.logo_url ?
                            <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                              <a target="_blank" href={volunteer.company_linkedin_profile_url} className="d-block position-relative" style={{width: '80px', height: '80px', minWidth: '80px', minHeight: '80px', maxWidth: '80px', maxHeight: '80px', overflow: 'hidden'}}>
                                {/* <img 
                                  className={styles.experienceImage} src={job.logo_url ? job.logo_url : null} 
                                  style={{width: '80px', height: '80px', minWidth: '80px', minHeight: '80px'}}
                                /> */}
                                <img 
                                  className="radius-3"
                                  src={volunteer.logo_url ? volunteer.logo_url : null}
                                  onError={({ currentTarget }) => {
                                    // currentTarget.onerror = null; // prevents looping
                                    currentTarget.className = 'd-none' 
                                    // currentTarget.style = "display: 'none'" 
                                    // placeholder.setAttribute("class", "bg-dark-200 radius-3 d-flex align-items-center justify-content-center d-none");
                                    // currentTarget.src="https://via.placeholder.com/150";
                                  }}
                                  style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '80px', minHeight:'80px', zIndex: '1'}}
                                />
                                <div id="placeholder" className="bg-dark-200 radius-3 align-items-center justify-content-center d-flex" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '80px', minHeight:'80px'}}>
                                  <Icon icon={ICONS.VOLUNTEERING} size='32' className="fill-dark-700" />
                                </div>
                              </a>
                            </div>
                            : 
                            <div className="bg-dark-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{width: '80px', height: '80px', minWidth: '80px', minHeight:'80px'}}>
                              <Icon icon={ICONS.VOLUNTEERING} size='32' className="fill-dark-700" />
                            </div>
                          ) : null}
                        <div>
                          <p className="large text-dark-high font-weight-semibold mb-0">{volunteer.title}</p>
                          <p className="large mb-0">{volunteer.company}</p>
                          <p className="text-dark-low mb-0">
                            {volunteer.starts_at ? (volunteer.starts_at.month ? convertMonth(volunteer.starts_at.month) + " " : '') : null}
                            {volunteer.starts_at ? (volunteer.starts_at.year ? volunteer.starts_at.year + " " : null) : null}
                            {volunteer.starts_at && volunteer.ends_at == null ? ' – Present' : null}
                            {volunteer.starts_at && volunteer.ends_at ? " – " + (volunteer.ends_at.month ? convertMonth(volunteer.ends_at.month) : '') : null}
                            {volunteer.starts_at && volunteer.ends_at ? (volunteer.ends_at.year ? " " + volunteer.ends_at.year : null) : null}
                          </p>
                          {volunteer.description ? <p className="text-dark-med mb-0 mt-3">{volunteer.description}</p> : null}
                        </div>
                      </div>
                    )}
                  </div>
                  <br /><br />
                </div>
              }
              {props.email &&
                <div className="text-center my-5">
                  <h2>Get in touch</h2>
                  <div className="d-flex m-auto justify-content-center">
                    <a href={'mailto:' + props.email} className="btn primary high">Contact me</a>
                  </div>
                  <br /><br />
                </div>
              }
            </Container>
            <div className='py-5 text-center'>
              <Container>
                <p className="text-dark-low mb-0">Powered by <Link href="/">Vitaely</Link></p>
              </Container>
            </div>
          </div>
        </>
        :
        <div className="d-flex justify-content-center align-items-center bg-light-900 py-5" style={{ minHeight: '100vh' }}>
          <Container>
            <div className="py-5 background-light">
              <div className="d-flex flex-column align-items-center container text-center">
                {screenWidth > 767 ?
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
  )
}

export default BasicProfile