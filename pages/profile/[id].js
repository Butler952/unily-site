import fire from '../../config/fire-config';
import Link from 'next/link'
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import Head from 'next/head';

import styles from './profile.module.scss'
import { urlObjectKeys } from 'next/dist/next-server/lib/utils';
import SurveyBanner from '../../components/banner/SurveyBanner';
import { useEffect, useState } from 'react';

const Profile = (props) => {

  const [currentUserId, setCurrentUserId] = useState('')
  const [showMore, setShowMore] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  useEffect(() => {
    checkUser();
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
            {props.summary}... <u style={{cursor: 'pointer'}} className="text-dark-low" onClick={() => setShowMore(false)}>Show less</u>
          </p>
        </>
      );
    }
      // If text is longer than desired length & showMore is false
    if (props.summary.length > 258) {
      return (
        <>
          <p className={`large mb-0 ` + styles.summary}>
            {props.summary.slice(0, 258)}... <u style={{cursor: 'pointer'}} className="text-dark-low" onClick={() => setShowMore(true)}>Read more</u>
          </p>
        </>
      );
    }
  };



  return (
    <div>
      <Head>
        <title>{props.full_name} | {props.headline}</title>
        { props.summary ? <meta name="description" content={props.summary} /> : null }
        { (props.full_name && props.displayBasicInfo.each.name === true) ? <meta name="author" content={props.full_name} /> : null }
        <meta property="og:title" content={`${props.full_name} | ${props.headline}`} />
        { props.summary ? <meta property="og:description" content={props.summary} /> : null }
        <meta property="og:url" content={`https://www.vitaely.me/profile/${props.pageId}`} />
        { props.background_cover_image_url ? <meta property="og:image" content={props.background_cover_image_url} /> : null }
        <meta property="og:type" content="website" />
      </Head>
      { loggedIn ? <Header /> : '' }
      { props.pageId === currentUserId && !props.surveyOnSignUpHide ? <SurveyBanner /> : '' }
      <Container>
        <div className="text-center mb-5">
          {(props.background_cover_image_url && props.displayBasicInfo.each.headerImage === true) &&
            <div className={styles.headerImage} style={{ backgroundImage: `url(${props.background_cover_image_url})`}} />
          }
          {(props.profile_pic_url && props.displayBasicInfo.each.profilePic === true) &&
            <img src={props.profile_pic_url} style={(props.background_cover_image_url && props.displayBasicInfo.each.headerImage === true) ? {marginTop: '-80px'} : {marginTop: '48px'}} className={styles.profilePicture} />
          }
          <br /> <br />
          <div className="mb-1 d-flex flex-column align-items-center">
            {(props.full_name && props.displayBasicInfo.each.name === true) &&
              <h2 className="mb-1">{props.full_name}</h2>
            }
            {(props.headline && props.displayBasicInfo.each.headline === true) &&
              <h5 style={{maxWidth: '640px'}}>{props.headline}</h5>
            }
          </div>
          {(props.email && props.displayBasicInfo.each.email === true) &&
            <div className="d-flex m-auto justify-content-center">
              <a href={'mailto:' + props.email} className="btn primary high">Contact me</a>
            </div>
          }
          <br /><br />
        </div>
        {(props.summary && props.displayAbout === true) &&
          <div className="mb-5">
            <h4>About</h4>
            <div className={styles.profileCard + ' card p-4'}>
              {getSummaryText()}
            </div>
            <br /><br />
          </div>
        }
        {(props.experiences && props.displayExperience.section === true) &&
          <div className="mb-5">
            <h4>Experience</h4>
            <div className={styles.profileCard + ' card'}>
              {props.experiences.map((job, index) => (props.displayExperience.each[index].display) &&
                <div key={index} className={`${styles.job} d-flex flex-column flex-lg-row`}>
                  { (props.logoVisibility ? props.logoVisibility.experience : null) && job.logo_url ? 
                    <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                      <img className={styles.experienceImage} src={job.logo_url ? job.logo_url : null} />
                    </div>
                  : null }
                  <div>
                    <p className="large text-dark-high font-weight-semibold mb-0">{job.title}</p>
                    <p className="large mb-0">{job.company}</p>
                    <p className="text-dark-low mb-0">{job.location}</p>
                    <p className="text-dark-low mb-0">
                      {job.starts_at ? (job.starts_at.month ? convertMonth(job.starts_at.month) + " " : '') : null} 
                      {job.starts_at ? (job.starts_at.year ? job.starts_at.year + " " : null) : null}
                      {job.starts_at && job.ends_at == null ? ' – Present' : null}
                      {job.starts_at && job.ends_at ? " – " + (job.ends_at.month ? convertMonth(job.ends_at.month) : '') : null}
                      {job.starts_at && job.ends_at ? (job.ends_at.year ? " " + job.ends_at.year : null) : null}
                    </p>
                  </div>
                </div>
        )}
            </div>
            <br /><br />
          </div>
        }
        {(props.education && props.displayEducation.section === true) &&
          <div className="mb-5">
            <h4>Education</h4>
            <div className={styles.profileCard + ' card'}>
              {props.education.map((school, index) => (props.displayEducation.each[index].display) &&
                <div key={index} className={`${styles.job} d-flex flex-column flex-lg-row`}>
                  { (props.logoVisibility ? props.logoVisibility.education : null) && school.logo_url ? 
                    <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                      <img className={styles.experienceImage} src={school.logo_url ? school.logo_url : null} />
                    </div>
                  : null }
                  <div>
                    <p className="large text-dark-high font-weight-semibold mb-0">{school.field_of_study}</p>
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
        {(props.volunteer_work && props.displayVolunteering.section === true) &&
          <div className="mb-5">
            <h4>Volunteering</h4>
            <div className={styles.profileCard + ' card'}>
              {props.volunteer_work.map((volunteer, index) => (props.displayVolunteering.each[index].display) &&
                <div key={index} className={styles.job}>
                  <p className="large text-dark-high font-weight-semibold mb-0">{volunteer.title}</p>
                  <p className="large mb-0">{volunteer.company}</p>
                  <p className="text-dark-low mb-0">
                    {volunteer.starts_at ? (volunteer.starts_at.month ? convertMonth(volunteer.starts_at.month) + " " : '') : null} 
                    {volunteer.starts_at ? (volunteer.starts_at.year ? volunteer.starts_at.year + " " : null) : null}
                    {volunteer.starts_at && volunteer.ends_at == null ? ' – Present' : null}
                    {volunteer.starts_at && volunteer.ends_at ? " – " + (volunteer.ends_at.month ? convertMonth(volunteer.ends_at.month) : '') : null}
                    {volunteer.starts_at && volunteer.ends_at ? (volunteer.ends_at.year ? " " + volunteer.ends_at.year : null) : null}
                  </p>
                  {volunteer.description ? <p className="text-dark-high mb-0 mt-3">{volunteer.description}</p> : null}
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
    </div >
  )
}

export const getServerSideProps = async ({ query }) => {
  const content = {}
  await fire.firestore()
    .collection('users')
    .doc(query.id)
    .get()
    .then(result => {
      content['pageId'] = query.id ? query.id : null;
      content['email'] = result.data().email ? result.data().email : null;
      content['profile_pic_url'] = result.data().profile.profile_pic_url ? result.data().profile.profile_pic_url : null;
      content['background_cover_image_url'] = result.data().profile.background_cover_image_url ? result.data().profile.background_cover_image_url : null ;
      content['full_name'] = result.data().profile.full_name ? result.data().profile.full_name : null;
      content['headline'] = result.data().profile.headline ? result.data().profile.headline : null;
      content['summary'] = result.data().profile.summary ? result.data().profile.summary : null;
      content['experiences'] = result.data().profile.experiences ? result.data().profile.experiences : null;
      content['education'] = result.data().profile.education ? result.data().profile.education : null;
      content['volunteer_work'] = result.data().profile.volunteer_work ? result.data().profile.volunteer_work : null;
      content['logoVisibility'] = result.data().logoVisibility ? result.data().logoVisibility : null;
      content['displayBasicInfo'] = result.data().displayInfo.basicInfo ? result.data().displayInfo.basicInfo : null;
      content['displayAbout'] = result.data().displayInfo.about ? result.data().displayInfo.about : null;
      content['displayExperience'] = result.data().displayInfo.experience ? result.data().displayInfo.experience : null;
      content['displayEducation'] = result.data().displayInfo.education ? result.data().displayInfo.education : null;
      content['displayVolunteering'] = result.data().displayInfo.volunteering ? result.data().displayInfo.volunteering : null;
      content['surveyOnSignUpHide'] = result.data().surveys ? (result.data().surveys.surveyOnSignUp ? (result.data().surveys.surveyOnSignUp.surveyHide ? result.data().surveys.surveyOnSignUp.surveyHide : null) : null) : null;
    });

  return {
    props: {
      pageId: content.pageId,
      email: content.email,
      profile_pic_url: content.profile_pic_url,
      background_cover_image_url: content.background_cover_image_url,
      full_name: content.full_name,
      headline: content.headline,
      summary: content.summary,
      experiences: content.experiences,
      education: content.education,
      logoVisibility: content.logoVisibility,
      volunteer_work: content.volunteer_work,
      displayBasicInfo: content.displayBasicInfo,
      displayAbout: content.displayAbout,
      displayExperience: content.displayExperience,
      displayEducation: content.displayEducation,
      displayVolunteering: content.displayVolunteering,
      surveyOnSignUpHide: content.surveyOnSignUpHide,
    }
  }
}

export default Profile