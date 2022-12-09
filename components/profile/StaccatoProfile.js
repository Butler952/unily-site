import fire from '../../config/fire-config';
import Link from 'next/link'
import { Accordion, Container, useAccordionToggle } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router'

import styles from './profile.module.scss'
import profileStyles from './StaccatoProfile.module.scss'
import SurveyBanner from '../banner/SurveyBanner';
import { useEffect, useState, useContext } from 'react';
import ICONS from '../icon/IconPaths';
import mixpanel from 'mixpanel-browser';
import { UserContext } from '../../pages/_app';
import Icon from '../icon/Icon';
import convertToLink from '../../utils/convertToLink';

const StaccatoProfile = (props) => {

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
      <p className={`mb-0 ${styles.summary} ${profileStyles.body}`}>
        {props.summary}
      </p>
    );
    // If text is longer than desired length & showMore is true
    if (props.summary.length > 258 && showMore) {
      return (
        <>
          <p className={`mb-0 ${styles.summary} ${profileStyles.body}`}>
            {props.summary} <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setShowMore(false)}>Show less</u>
          </p>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (props.summary.length > 258) {
      return (
        <>
          <p className={`mb-0 ${styles.summary} ${profileStyles.body}`}>
            {props.summary.slice(0, 258)}... <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setShowMore(true)}>Read more</u>
          </p>
        </>
      );
    }
  };

  const getDescriptionText = (description, descriptionShowMore, setDescriptionShowMore) => {
    // For Text that is shorter than desired length
    if (description.length <= 258) return (
      <p className={`mb-0 ${profileStyles.body}`}>
        {description}
      </p>
    );
    // If text is longer than desired length & showMore is true
    if (description.length > 258 && descriptionShowMore) {
      return (
        <>
          <p className={`mb-0 ${profileStyles.body}`}>
            {description} <u style={{ cursor: 'pointer' }} className="text-dark-low" onClick={() => setDescriptionShowMore(false)}>Show less</u>
          </p>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (description.length > 258) {
      return (
        <>
          <p className={`mb-0 ${profileStyles.body}`}>
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
    <div style={{backgroundColor: '#fbfbf8'}} >
      {props.email !== undefined ?
        <>
          <Head>
            <title>{props.full_name} {props.headline && `| ${props.headline}`}</title>
            {props.summary ? <meta name="description" content={props.summary} /> : null}
            {props.full_name && <meta name="author" content={props.full_name} />}
            <meta property="og:title" content={`${props.full_name} | ${props.headline}`} />
            {props.summary ? <meta property="og:description" content={props.summary} /> : null}
            {props.level == "profile" && <meta property="og:url" content={`https://www.vitaely.me/profile/${props.pageId}`} />}
            {props.level == "baseLevel" && <meta property="og:url" content={`https://www.vitaely.me/${props.pageId}`} />}
            {props.background_cover_image_url ? <meta property="og:image" content={props.background_cover_image_url} /> : null}
            <meta property="og:type" content="website" />
          </Head>
          <div>
          {/* <div style={{ marginTop: '66px' }}> */}
            {props.pageId === currentUserId && !props.surveyOnSignUpHide ? <SurveyBanner /> : ''}
            <Container className="py-5 px-3 px-md-5 mx-auto" style={{maxWidth: '1440px'}}>
              {/* <div className="d-flex flex-row justify-content-between align-items-center">
              <svg width="24" viewBox="0 0 24 24">
                <path 
                  className="fill-dark-900"
                  fill-rule="evenodd" 
                  clip-rule="evenodd" 
                  d={ICONS.STACCATO}
                ></path>
              </svg>
              <button className="btn dark high">say hello</button>
              </div> */}
              <div className="">
                <div className="d-flex flex-column px-0" style={{gap: '160px'}}>
                  <div className="d-flex flex-column mt-0 mt-md-5 pt-5" style={{gap: '64px'}}>
                    <div className="d-flex flex-column">
                      {props.full_name &&
                        <h1 className={`mb-5 ${profileStyles.heading} ${profileStyles.heading1}`}>{props.first_name}<br></br>{props.last_name}</h1>
                      }
                      {props.headline &&
                        // <h3 className="text-error-med mb-5" style={{ maxWidth: '640px', fontWeight: 400 }}>{props.headline}</h3>
                        <h3 className={`mb-0 ${profileStyles.subheading}`} style={{ maxWidth: '640px', color: '#7B8386' }}>{props.headline}</h3>
                      }
                    </div>
                    {/* {props.background_cover_image_url && <div className="w-100 position-relative radius-4 overflow-hidden" style={{ paddingTop: '56.25%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${props.background_cover_image_url})` }}></div>} */}
                  </div>
                  {props &&
                  props.displayInfo &&
                  props.displayInfo.basicInfo &&
                  props.displayInfo.basicInfo.each &&
                  props.displayInfo.basicInfo.each.email &&
                  props.displayInfo.basicInfo.each.email
                  || props.links ?
                  <div className="d-flex flex-column" style={{ gap: '16px' }}>
                    {props.email && props.displayInfo.basicInfo.each.email &&
                      <a href={'mailto:' + props.email} target="_blank" className={`${profileStyles.link} ${profileStyles.subheading}`}>
                        Email
                        <svg width="32" viewBox="0 0 24 24">
                          <path d={ICONS.ARROW_RIGHT_STACCATO}></path>
                        </svg>
                      </a>
                    }
                    {props.links &&
                      props.links.map((link, index) => {
                        return (
                          <a key={index} href={convertToLink(link.url)} target="_blank" className={`${profileStyles.link} ${profileStyles.subheading}`}>
                            {link.label}
                            <svg width="32" viewBox="0 0 24 24">
                              <path d={ICONS.ARROW_RIGHT_STACCATO}></path>
                            </svg>
                          </a>
                        )
                      })}
                  </div>
                  : ''}
                  {props.summary &&
                  <div className="">
                    <h4 className={`mb-5 pb-4 ${profileStyles.heading} ${profileStyles.heading2}`}>About</h4>
                      <div className="">
                        {getSummaryText()}
                      </div>
                  </div>
                  }
                  {(props.side_projects && props.side_projects.length > 0) &&
                    <div className="">
                      <h4 className={`mb-5 pb-4 ${profileStyles.heading} ${profileStyles.heading2}`}>Side Projects</h4>
                      <div className="d-flex flex-column" style={{gap: '64px'}}>
                        {props.side_projects.sort(sortByDate).map((sideProject, index) => {
                          return (
                            <div key={index} className="d-flex flex-column align-items-start w-100">
                              <a target="_blank" href={sideProject.url && convertToLink(sideProject.url)} className={`${profileStyles.link}`}>
                                <p className={`${profileStyles.subheading}`}>
                                  {sideProject.name} {sideProject.starts_at ? (sideProject.starts_at.year ? sideProject.starts_at.year + " " : null) : null}{sideProject.starts_at && sideProject.ends_at == null ? ' / Now' : null} {sideProject.starts_at && sideProject.ends_at && sideProject.ends_at.month && sideProject.ends_at.year ? (sideProject.starts_at.month == sideProject.ends_at.month || sideProject.starts_at.year == sideProject.ends_at.year ? null : ` / ${sideProject.ends_at.year}`) : null}
                                </p>
                              </a>
                              <p className={`mb-0 ${profileStyles.body}`}>{sideProject.tagline}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  }
                  {(props.experiences && props.experiences.length > 0) &&
                    <div className="">
                      <h4 className={`mb-5 pb-4 ${profileStyles.heading} ${profileStyles.heading2}`}>Experience</h4>
                      <div className="d-flex flex-column" style={{gap: '64px'}}>
                        {props.experiences.sort(sortByDate).map((job, index) => {
                          return (
                            <div key={index} className="d-flex flex-column align-items-start w-100">
                              <a target="_blank" href={job.company_linkedin_profile_url && convertToLink(job.company_linkedin_profile_url)} className={`${profileStyles.link}`}>
                                <p className={`${profileStyles.subheading}`}>
                                  {job.company} {job.starts_at ? (job.starts_at.year ? job.starts_at.year + " " : null) : null} {job.starts_at && job.ends_at == null ? ' / Now' : null} {job.starts_at && job.ends_at && job.ends_at.month && job.ends_at.year ? (job.starts_at.month == job.ends_at.month || job.starts_at.year == job.ends_at.year ? null : ` / ${job.ends_at.year}`) : null}
                                </p>
                              </a>
                              <p className={`mb-0 ${profileStyles.body}`}>{job.title}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  }
                  {(props.projects && props.projects.length > 0) &&
                    <div className="5">
                      <h4 className={`mb-5 pb-4 ${profileStyles.heading} ${profileStyles.heading2}`}>Projects</h4>
                      <div className="d-flex flex-column" style={{gap: '64px'}}>
                        {props.projects.sort(sortByDate).map((project, index) => {
                          const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                          return (
                            <div key={index} className="d-flex flex-column align-items-start w-100">
                              {project.logo_url ?
                                <div className="mb-4 pb-4 w-100">
                                  <a target="_blank" href={convertToLink(project.url)} className="d-block position-relative w-100">
                                    <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                                      <div className="w-100 position-relative radius-4 overflow-hidden" style={{ paddingTop: '56.25%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${project.logo_url ? project.logo_url : null})` }}>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                : null
                              }
                              <a target="_blank" href={project.url && convertToLink(project.url)} className={`${profileStyles.link}`}>
                                <p className={`${profileStyles.subheading}`}>
                                  {project.name} {project.starts_at ? (project.starts_at.year ? project.starts_at.year + " " : null) : null}{project.starts_at && project.ends_at == null ? ' / Now' : null} {project.starts_at && project.ends_at && project.ends_at.month && project.ends_at.year ? (project.starts_at.month == project.ends_at.month || project.starts_at.year == project.ends_at.year ? null : ` / ${project.ends_at.year}`) : null}
                                </p>
                              </a>
                              {/* <p className={`mb-0 ${profileStyles.body}`}>{project.tagline}</p> */}
                              {project.description ? <p className={`mb-0 ${profileStyles.body}`}>{getDescriptionText(project.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}

                            </div>
                          )
                        })}
                      </div>
                    </div>
                  }
                  {(props.education && props.education.length > 0) &&
                    <div className="">
                      <h4 className={`mb-5 pb-4 ${profileStyles.heading} ${profileStyles.heading2}`}>Education</h4>
                      <div className="d-flex flex-column" style={{gap: '64px'}}>
                        {props.education.sort(sortByDate).map((school, index) => {
                          return (
                            <div key={index} className="d-flex flex-column align-items-start w-100">
                              <a target="_blank" href={school.school_linkedin_profile_url && convertToLink(school.school_linkedin_profile_url)} className={`${profileStyles.link}`}>
                                <p className={`${profileStyles.subheading}`}>
                                  {school.school} {school.starts_at ? (school.starts_at.year ? school.starts_at.year + " " : null) : null} {school.starts_at && school.ends_at == null ? ' / Now' : null} {school.starts_at && school.ends_at && school.ends_at.month && school.ends_at.year ? (school.starts_at.month == school.ends_at.month || school.starts_at.year == school.ends_at.year ? null : ` / ${school.ends_at.year}`) : null}
                                </p>
                              </a>
                              <p className={`mb-0 ${profileStyles.body}`}>{`${school.field_of_study ? school.field_of_study : ''} ${school.field_of_study && school.degree_name ? `(${school.degree_name})` : (school.degree_name ? school.degree_name : '')}`}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  }
                   {(props.volunteer_work && props.volunteer_work.length > 0) &&
                    <div className="">
                      <h4 className={`mb-5 pb-4 ${profileStyles.heading} ${profileStyles.heading2}`}>Volunteering</h4>
                      <div className="d-flex flex-column" style={{gap: '64px'}}>
                        {props.volunteer_work.sort(sortByDate).map((volunteer, index) => {
                          return (
                            <div key={index} className="d-flex flex-column align-items-start w-100">
                              <a target="_blank" href={volunteer.company_linkedin_profile_url && convertToLink(volunteer.company_linkedin_profile_url)} className={`${profileStyles.link}`}>
                                <p className={`${profileStyles.subheading}`}>
                                  {volunteer.company} {volunteer.starts_at ? (volunteer.starts_at.year ? volunteer.starts_at.year + " " : null) : null} {volunteer.starts_at && volunteer.ends_at == null ? ' / Now' : null} {volunteer.starts_at && volunteer.ends_at && volunteer.ends_at.month && volunteer.ends_at.year ? (volunteer.starts_at.month == volunteer.ends_at.month || volunteer.starts_at.year == volunteer.ends_at.year ? null : ` / ${volunteer.ends_at.year}`) : null}
                                </p>
                              </a>
                              <p className={`mb-0 ${profileStyles.body}`}>{volunteer.title}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  }
                </div>
              </div>
            </Container>
            <br></br>
            <br></br>
            <br></br>
            <div className='py-5 text-center'>
              <Container>
                <a href="/" style={{ textDecoration: 'none' }}>
                  <svg height="32" viewBox="0 0 85 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      className="fill-dark-700"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d={ICONS.LOGO}
                    />
                  </svg>
                  <p className="text-dark-low mt-2 mb-0">Powered by Vitaely</p>
                </a>
              </Container>
            </div>
          </div>
        </>
        :
        <div className="d-flex justify-content-center align-items-center bg-light-900 py-5" style={{ minHeight: '100vh' }}>
          <Container>
            <div className="py-5 background-light">
              <div className="d-flex flex-column align-items-center container text-center">
                {props.screenWidth > 767 ?
                  <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Page not found</h2>
                  :
                  <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Page not found</h2>
                }
                <p className="mx-auto mb-5 text-dark-low large">Turn your Linkedin profile into a landing page in two minutes</p>
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

export default StaccatoProfile