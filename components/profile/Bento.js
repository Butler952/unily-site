import fire from '../../config/fire-config';
import Link from 'next/link'
import { Accordion, Container, useAccordionToggle } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router'

import styles from './profile.module.scss'
import profileStyles from './Bento.module.scss'
import SurveyBanner from '../banner/SurveyBanner';
import { useEffect, useState, useContext } from 'react';
import ICONS from '../icon/IconPaths';
import mixpanel from 'mixpanel-browser';
import { UserContext } from '../../pages/_app';
import Icon from '../icon/Icon';
import convertToLink from '../../utils/convertToLink';
import { v4 as uuidv4 } from 'uuid';

const Bento = (props) => {

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
      <p className={`mb-0 text-light-med` + styles.summary}>
        {props.summary}
      </p>
    );
    // If text is longer than desired length & showMore is true
    if (props.summary.length > 258 && showMore) {
      return (
        <>
          <p className={`mb-0 text-light-med` + styles.summary}>
            {props.summary} <u style={{ cursor: 'pointer' }} className="text-light-low" onClick={() => setShowMore(false)}>Show less</u>
          </p>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (props.summary.length > 258) {
      return (
        <>
          <p className={`mb-0 text-light-med` + styles.summary}>
            {props.summary.slice(0, 258)}... <u style={{ cursor: 'pointer' }} className="text-light-low" onClick={() => setShowMore(true)}>Read more</u>
          </p>
        </>
      );
    }
  };

  const getDescriptionText = (description, descriptionShowMore, setDescriptionShowMore) => {
    // For Text that is shorter than desired length
    if (description.length <= 258) return (
      <p className="text-light-low mb-0 mt-0">
        {description}
      </p>
    );
    // If text is longer than desired length & showMore is true
    if (description.length > 258 && descriptionShowMore) {
      return (
        <>
          <p className="text-light-low mb-0 mt-0">
            {description} <u style={{ cursor: 'pointer' }} className="text-light-low" onClick={() => setDescriptionShowMore(false)}>Show less</u>
          </p>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (description.length > 258) {
      return (
        <>
          <p className="text-light-low mb-0 mt-0">
            {description.slice(0, 258)}... <u style={{ cursor: 'pointer' }} className="text-light-low" onClick={() => setDescriptionShowMore(true)}>Read more</u>
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

  return (
    <div style={{ backgroundColor: '#000000' }}>
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
            <div className="p-3">
              <div className="">
                <div className="px-0">

                  <div className={`${profileStyles.bentoGrid}`}>

                    <div 
                      className={`${profileStyles.bentoCard} ${profileStyles.bentoCardLarge} ${profileStyles.bentoCardImage} p-4`} 
                      style={props.background_cover_image_url ? { backgroundImage: `url(${props.background_cover_image_url})` } : null}
                    >
                      <div className="d-flex flex-column justify-content-end h-100">
                        {props.full_name &&
                          <h2 className="mb-0 text-light-high font-weight-medium">{props.full_name}</h2>
                        }
                        {props.headline &&
                          <h5 className="mb-0 text-light-med">{props.headline}</h5>
                        }
                      </div>
                    </div>

                    {/* <div className={`${profileStyles.bentoCard} ${profileStyles.bentoCardLarge} p-4`}>
                      <div className="d-flex flex-column ">
                        {props.summary &&
                          <div className="mb-5 py-3 text-light-med">
                            <div className="">
                              {getSummaryText()}
                            </div>
                          </div>
                        }
                      </div>
                    </div> */}

                    { props &&
                      props.displayInfo &&
                      props.displayInfo.basicInfo &&
                      props.displayInfo.basicInfo.each &&
                      props.displayInfo.basicInfo.each.email &&
                      <>
                        <a href={'mailto:' + props.email} target="_blank" className={`${profileStyles.bentoCard} p-4`}>
                          <div className="d-flex flex-row justify-content-between">
                            <div className="bg-light-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}>
                              <Icon icon={ICONS.LINK} size='32' className="fill-light-700" />
                            </div>
                            <div className="tag light small medium">Link</div>
                          </div>
                          <div className="w-100">
                            <div className={`${profileStyles.jobContent}`}>
                              <div className="">
                                <p className="text-light-high font-weight-medium mb-0">Contact me</p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </>
                    } 

                    {(props.links && props.links.length > 0) &&
                      <>
                        {props.links.sort(sortByDate).map((link, index) => {
                          return (
                            <a key={uuidv4()} href={convertToLink(link.url)} target="_blank" className={`${profileStyles.bentoCard} p-4`}>
                              <div className="d-flex flex-row justify-content-between">
                                <div className="bg-light-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}>
                                  <Icon icon={ICONS.LINK} size='32' className="fill-light-700" />
                                </div>
                                <div className="tag light small medium">Link</div>
                              </div>
                              <div className="w-100">
                                <div className={`${profileStyles.jobContent}`}>
                                  <div className="">
                                    <p className="text-light-high font-weight-medium mb-0">{link.label}</p>
                                  </div>
                                </div>
                              </div>
                            </a>
                          )
                        })}
                      </>
                    } 

                    {(props.side_projects && props.side_projects.length > 0) &&
                      <>
                        {props.side_projects.sort(sortByDate).map((sideProject, index) => {
                          return (
                            <a key={uuidv4()} target="_blank" href={sideProject.url} className={`${profileStyles.bentoCard} p-4`}>
                              <div className="d-flex flex-row justify-content-between">
                                {sideProject.logo_url ?
                                  <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                                    <div  className="d-block position-relative" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', maxWidth: '56px', maxHeight: '56px', overflow: 'hidden' }}>
                                      <img
                                        className="radius-3 bg-dark-900"
                                        src={sideProject.logo_url ? sideProject.logo_url : null}
                                        onError={({ currentTarget }) => {
                                          currentTarget.className = 'd-none'
                                        }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px', zIndex: '1' }}
                                      />
                                      <div id="placeholder" className="bg-light-200 radius-3 align-items-center justify-content-center d-flex" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px' }}>
                                        <Icon icon={ICONS.SIDE_PROJECTS} size='32' className="fill-light-700" />
                                      </div>
                                    </div>
                                  </div>
                                  :
                                  <div className="bg-light-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}>
                                    <Icon icon={ICONS.SIDE_PROJECTS} size='32' className="fill-light-700" />
                                  </div>
                                }
                                <div className="tag light small medium">Side project</div>
                              </div>
                              <div className="w-100" style={props.logoVisibility && props.logoVisibility.sideProjects ? { marginTop: '10px' } : null}>
                                <div className={`${profileStyles.jobContent}`}>
                                  <div className="">
                                    <p className="text-light-high font-weight-medium mb-0">{sideProject.name}</p>
                                    {/* <p className="large text-light-low mb-0">{sideProject.tagline}</p> */}
                                    <p className="text-light-low mb-0">{sideProject.tagline}</p>
                                    <p className="text-light-low mb-0" style={{ whiteSpace: 'nowrap' }}>
                                      {sideProject.starts_at ? (sideProject.starts_at.month ? convertMonth(sideProject.starts_at.month) + " " : '') : null}
                                      {sideProject.starts_at ? (sideProject.starts_at.year ? sideProject.starts_at.year + " " : null) : null}
                                      {sideProject.starts_at && sideProject.ends_at == null ? ' – Present' : null}
                                      {sideProject.starts_at && sideProject.ends_at && sideProject.ends_at.month && sideProject.ends_at.year ? (sideProject.starts_at.month == sideProject.ends_at.month & sideProject.starts_at.year == sideProject.ends_at.year ? null : ` – ${convertMonth(sideProject.ends_at.month)} ${sideProject.ends_at.year}`) : null}
                                    </p>
                                  </div>
                                </div>
                                {/* {job.description ? <p className="text-light-low mb-0 mt-3">{getDescriptionText(job.description, descriptionShowMore, setDescriptionShowMore)}</p> : null} */}
                              </div>
                            </a>
                          )
                        })}
                      </>
                    }

                    {(props.experiences && props.experiences.length > 0) &&
                      <>
                        {props.experiences.sort(sortByDate).map((job, index) => {
                          return (
                            <a key={uuidv4()} target="_blank" href={job.company_linkedin_profile_url && convertToLink(job.company_linkedin_profile_url)} className={`${profileStyles.bentoCard} p-4`}>
                              <div className="d-flex flex-row justify-content-between">
                                {job.logo_url ?
                                  <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                                    <div className="d-block position-relative" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', maxWidth: '56px', maxHeight: '56px', overflow: 'hidden' }}>
                                      <img
                                        className="radius-3 bg-dark-900"
                                        src={job.logo_url ? job.logo_url : null}
                                        onError={({ currentTarget }) => {
                                          currentTarget.className = 'd-none'
                                        }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px', zIndex: '1' }}
                                      />
                                      <div id="placeholder" className="bg-light-200 radius-3 align-items-center justify-content-center d-flex" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px' }}>
                                        <Icon icon={ICONS.WORK} size='32' className="fill-light-700" />
                                      </div>
                                    </div>
                                  </div>
                                  :
                                  <div className="bg-light-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}>
                                    <Icon icon={ICONS.WORK} size='32' className="fill-light-700" />
                                  </div>
                                }
                                <div className="tag light small medium">Experience</div>
                              </div>
                              <div className="w-100" style={props.logoVisibility && props.logoVisibility.experience ? { marginTop: '10px' } : null}>
                                <div className={`${profileStyles.jobContent}`}>
                                  <div className="">
                                    <p className="text-light-high font-weight-medium mb-0">{job.title}</p>
                                    <p className="text-light-low mb-0">{job.company}</p>
                                    <p className="text-light-low mb-0">
                                      {job.starts_at ? (job.starts_at.month ? convertMonth(job.starts_at.month) + " " : '') : null}
                                      {job.starts_at ? (job.starts_at.year ? job.starts_at.year + " " : null) : null}
                                      {job.starts_at && job.ends_at == null ? ' – Present' : null}
                                      {job.starts_at && job.ends_at && job.ends_at.month && job.ends_at.year ? (job.starts_at.month == job.ends_at.month & job.starts_at.year == job.ends_at.year ? null : ` – ${convertMonth(job.ends_at.month)} ${job.ends_at.year}`) : null}
                                    </p>
                                  </div>
                                </div>
                                {/* {job.description ? <p className="text-light-low mb-0 mt-3">{getDescriptionText(job.description, descriptionShowMore, setDescriptionShowMore)}</p> : null} */}
                              </div>
                            </a>
                          )
                        })}
                      </>
                    }

                    {(props.projects && props.projects.length > 0) &&
                      <>
                        {props.projects.sort(sortByDate).map((project, index) => {
                          const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                          return (
                            <a key={uuidv4()} href={convertToLink(project.url)} target="_blank" className={`${profileStyles.bentoCard} ${profileStyles.bentoCardImage} p-4`} style={{ backgroundImage: `url(${project.logo_url})` }}>
                              <div className="d-flex flex-row justify-content-between">
                                {/* {project.logo_url ?
                                  <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                                    <div  className="d-block position-relative" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', maxWidth: '56px', maxHeight: '56px', overflow: 'hidden' }}>
                                      <img
                                        className="radius-3 bg-dark-900"
                                        src={project.logo_url ? project.logo_url : null}
                                        onError={({ currentTarget }) => {
                                          currentTarget.className = 'd-none'
                                        }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px', zIndex: '1' }}
                                      />
                                      <div id="placeholder" className="bg-light-200 radius-3 align-items-center justify-content-center d-flex" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px' }}>
                                        <Icon icon={ICONS.WORK} size='32' className="fill-light-700" />
                                      </div>
                                    </div>
                                  </div>
                                  :
                                  <div className="bg-light-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}>
                                    <Icon icon={ICONS.WORK} size='32' className="fill-light-700" />
                                  </div>
                                } */}
                                <div className="bg-light-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}>
                                  <Icon icon={ICONS.PROJECTS} size='32' className="fill-light-700" />
                                </div>
                                <div className="tag light small medium">Project</div>
                              </div>
                              <div className="w-100" style={props.logoVisibility && props.logoVisibility.experience ? { marginTop: '10px' } : null}>
                                <div className={`${profileStyles.jobContent}`}>
                                  <div className="">
                                    <p className="text-light-high font-weight-medium mb-0">{project.name}</p>
                                    <p className="text-light-low mb-0">
                                      {project.starts_at ? (project.starts_at.month ? convertMonth(project.starts_at.month) + " " : '') : null}
                                      {project.starts_at ? (project.starts_at.year ? project.starts_at.year + " " : null) : null}
                                      {project.starts_at && project.ends_at == null ? ' – Present' : null}
                                      {project.starts_at && project.ends_at && project.ends_at.month && project.ends_at.year ? (project.starts_at.month == project.ends_at.month & project.starts_at.year == project.ends_at.year ? null : ` – ${convertMonth(project.ends_at.month)} ${project.ends_at.year}`) : null}
                                    </p>
                                    {project.description ? <p className="text-light-low mb-0 mt-0">{getDescriptionText(project.description, descriptionShowMore, setDescriptionShowMore)}</p> : null}
                                  </div>
                                </div>
                              </div>
                            </a>
                          )
                        })}
                      </>
                    }

                    {(props.education && props.education.length > 0) &&
                      <>
                        {props.education.sort(sortByDate).map((school, index) => {
                          return (
                            <a key={uuidv4()} target="_blank" href={school.school_linkedin_profile_url && convertToLink(school.school_linkedin_profile_url)} className={`${profileStyles.bentoCard} p-4`}>
                              <div className="d-flex flex-row justify-content-between">
                                {school.logo_url ?
                                  <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                                    <div className="d-block position-relative" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', maxWidth: '56px', maxHeight: '56px', overflow: 'hidden' }}>
                                      <img
                                        className="radius-3 bg-dark-900"
                                        src={school.logo_url ? school.logo_url : null}
                                        onError={({ currentTarget }) => {
                                          currentTarget.className = 'd-none'
                                        }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px', zIndex: '1' }}
                                      />
                                      <div id="placeholder" className="bg-light-200 radius-3 align-items-center justify-content-center d-flex" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px' }}>
                                        <Icon icon={ICONS.SCHOOL} size='32' className="fill-light-700" />
                                      </div>
                                    </div>
                                  </div>
                                  :
                                  <div className="bg-light-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}>
                                    <Icon icon={ICONS.SCHOOL} size='32' className="fill-light-700" />
                                  </div>
                                }
                                <div className="tag light small medium">Education</div>
                              </div>
                              <div className="w-100" style={props.logoVisibility && props.logoVisibility.experience ? { marginTop: '10px' } : null}>
                                <div className={`${profileStyles.jobContent}`}>
                                  <div className="">
                                    <p className="text-light-high font-weight-medium mb-0">
                                      {`${school.field_of_study ? school.field_of_study : ''} ${school.field_of_study && school.degree_name ? `(${school.degree_name})` : (school.degree_name ? school.degree_name : '')}`}
                                    </p>
                                    <p className="text-light-low mb-0">{school.school}</p>
                                    <p className="text-light-low mb-0">
                                      {school.starts_at ? (school.starts_at.month ? convertMonth(school.starts_at.month) + " " : '') : null}
                                      {school.starts_at ? (school.starts_at.year ? school.starts_at.year + " " : null) : null}
                                      {school.starts_at && school.ends_at == null ? ' – Present' : null}
                                      {school.starts_at && school.ends_at && school.ends_at.month && school.ends_at.year ? (school.starts_at.month == school.ends_at.month & school.starts_at.year == school.ends_at.year ? null : ` – ${convertMonth(school.ends_at.month)} ${school.ends_at.year}`) : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </a>
                          )
                        })}
                      </>
                    }

                    {(props.volunteer_work && props.volunteer_work.length > 0) &&
                      <>
                        {props.volunteer_work.sort(sortByDate).map((volunteer, index) => {
                          return (
                            <div key={uuidv4()} className={`${profileStyles.bentoCard} p-4`}>
                              <div className="d-flex flex-row justify-content-between">
                                {volunteer.logo_url ?
                                  <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                                    <a target="_blank" href={volunteer.company_linkedin_profile_url && convertToLink(volunteer.company_linkedin_profile_url)} className="d-block position-relative" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', maxWidth: '56px', maxHeight: '56px', overflow: 'hidden' }}>
                                      <img
                                        className="radius-3 bg-dark-900"
                                        src={volunteer.logo_url ? volunteer.logo_url : null}
                                        onError={({ currentTarget }) => {
                                          currentTarget.className = 'd-none'
                                        }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px', zIndex: '1' }}
                                      />
                                      <div id="placeholder" className="bg-light-200 radius-3 align-items-center justify-content-center d-flex" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '56px', minHeight: '56px' }}>
                                        <Icon icon={ICONS.VOLUNTEERING} size='32' className="fill-light-700" />
                                      </div>
                                    </a>
                                  </div>
                                  :
                                  <div className="bg-light-200 radius-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mr-0 mr-lg-4" style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}>
                                    <Icon icon={ICONS.VOLUNTEERING} size='32' className="fill-light-700" />
                                  </div>
                                }
                                <div className="tag light small medium">Volunteering</div>
                              </div>
                              <div className="w-100" style={props.logoVisibility && props.logoVisibility.experience ? { marginTop: '10px' } : null}>
                                <div className={`${profileStyles.jobContent}`}>
                                  <div className="">
                                    <a target="_blank" href={volunteer.company_linkedin_profile_url && convertToLink(volunteer.company_linkedin_profile_url)} className={`${profileStyles.link}`}>
                                      <p className="text-light-high font-weight-medium mb-0">{volunteer.company}</p>
                                      {/* <svg width="24" viewBox="0 0 24 24">
                                        <path d={ICONS.ARROW_LINK}></path>
                                      </svg> */}
                                    </a>
                                    {/* <p className="large text-light-low mb-0">{sideProject.tagline}</p> */}
                                    <p className="text-light-low mb-0">{volunteer.title}</p>
                                    <p className="text-light-low mb-0">
                                      {volunteer.starts_at ? (volunteer.starts_at.month ? convertMonth(volunteer.starts_at.month) + " " : '') : null}
                                      {volunteer.starts_at ? (volunteer.starts_at.year ? volunteer.starts_at.year + " " : null) : null}
                                      {volunteer.starts_at && volunteer.ends_at == null ? ' – Present' : null}
                                      {volunteer.starts_at && volunteer.ends_at && volunteer.ends_at.month && volunteer.ends_at.year ? (volunteer.starts_at.month == volunteer.ends_at.month & volunteer.starts_at.year == volunteer.ends_at.year ? null : ` – ${convertMonth(volunteer.ends_at.month)} ${volunteer.ends_at.year}`) : null}
                                    </p>
                                  </div>
                                </div>
                                {/* {volunteer.description ? <p className="text-light-low mb-0 mt-3">{getDescriptionText(volunteer.description, descriptionShowMore, setDescriptionShowMore)}</p> : null} */}
                              </div>
                            </div>
                          )
                        })}
                      </>
                    }

                  </div>

                  

                  
                  {/* {props.email &&
                    <div className="text-center my-5">
                      <h2>Get in touch</h2>
                      <div className="d-flex m-auto justify-content-center">
                        <a href={'mailto:' + props.email} target="_blank" className="btn primary high">Contact me</a>
                      </div>
                      <br /><br />
                    </div>
                  } */}
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <div className='py-5 text-center'>
              <Container>
                <a href="/" style={{ textDecoration: 'none' }}>
                  <svg height="32" viewBox="0 0 85 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      className="fill-light-700"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d={ICONS.LOGO}
                    />
                  </svg>
                  <p className="text-light-low mt-2 mb-0">Powered by Vitaely</p>
                </a>
              </Container>
            </div>
          </div>
        </>
        :
        <div className="d-flex justify-content-center align-items-center bg-dark-900 py-5" style={{ minHeight: '100vh' }}>
          <Container>
            <div className="py-5 background-dark">
              <div className="d-flex flex-column align-items-center container text-center">
                {props.screenWidth > 767 ?
                  <h2 className="hero-title mx-auto mb-4 text-light-high" style={{ maxWidth: '560px' }}>Page not found</h2>
                  :
                  <h2 className="hero-title mx-auto mb-4 text-light-high" style={{ maxWidth: '560px' }}>Page not found</h2>
                }
                <p className="mx-auto mb-5 text-light-low large">Turn your Linkedin profile into a landing page in two minutes</p>
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

export default Bento