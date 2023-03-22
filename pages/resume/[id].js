import fire from '../../config/fire-config';
import { useEffect, useState, useContext } from 'react';
import mixpanel from 'mixpanel-browser';
import { UserContext } from '../_app';
import BasicProfile from '../../components/profile/BasicProfile';
import DocumentProfile from '../../components/profile/DocumentProfile';
import MetroProfile from '../../components/profile/MetroProfile';
import MetroProfileDark from '../../components/profile/MetroProfileDark';
import Header from '../../components/header/Header';
import Bento from '../../components/profile/Bento';
import StaccatoProfile from '../../components/profile/StaccatoProfile';
import Freelance from '../../components/resume/Freelance';
// import Freelance from '../../components/profile/Freelance';

const Profile = (props) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [currentUserId, setCurrentUserId] = useState('')
  const [showMore, setShowMore] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [headerImageError, setHeaderImageError] = useState(false);

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
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

  return (
    <div>
      <Header positionFixed />
      { (props.template == undefined ||
        props.template == 'original') ?
        <BasicProfile
          level="baseLevel"
          screenWidth={screenWidth}
          pageId={props.pageId}
          template={props.template}
          email={props.email}
          links={props.links}
          profile_pic_url={props.profile_pic_url}
          background_cover_image_url={props.background_cover_image_url}
          full_name={props.full_name}
          headline={props.headline}
          summary={props.summary}
          experiences={props.experiences}
          projects={props.projects}
          side_projects={props.side_projects}
          education={props.education}
          logoVisibility={props.logoVisibility}
          volunteer_work={props.volunteer_work}
          surveyOnSignUpHide={props.surveyOnSignUpHide}
          displayInfo={props.displayInfo}
        />
        : null
      }
      { props.template == 'document' &&
        <DocumentProfile
          level="baseLevel"
          screenWidth={screenWidth}
          pageId={props.pageId}
          template={props.template}
          email={props.email}
          links={props.links}
          profile_pic_url={props.profile_pic_url}
          background_cover_image_url={props.background_cover_image_url}
          full_name={props.full_name}
          headline={props.headline}
          summary={props.summary}
          experiences={props.experiences}
          projects={props.projects}
          side_projects={props.side_projects}
          education={props.education}
          logoVisibility={props.logoVisibility}
          volunteer_work={props.volunteer_work}
          surveyOnSignUpHide={props.surveyOnSignUpHide}
          displayInfo={props.displayInfo}
        />
      }
      { props.template == 'metro' &&
        <MetroProfile
          level="baseLevel"
          screenWidth={screenWidth}
          pageId={props.pageId}
          template={props.template}
          email={props.email}
          links={props.links}
          profile_pic_url={props.profile_pic_url}
          background_cover_image_url={props.background_cover_image_url}
          full_name={props.full_name}
          headline={props.headline}
          summary={props.summary}
          experiences={props.experiences}
          projects={props.projects}
          side_projects={props.side_projects}
          education={props.education}
          logoVisibility={props.logoVisibility}
          volunteer_work={props.volunteer_work}
          surveyOnSignUpHide={props.surveyOnSignUpHide}
          displayInfo={props.displayInfo}
        />
      }
      { props.template == 'metro_night' &&
        <MetroProfileDark
          level="baseLevel"
          screenWidth={screenWidth}
          pageId={props.pageId}
          template={props.template}
          email={props.email}
          links={props.links}
          profile_pic_url={props.profile_pic_url}
          background_cover_image_url={props.background_cover_image_url}
          full_name={props.full_name}
          headline={props.headline}
          summary={props.summary}
          experiences={props.experiences}
          projects={props.projects}
          side_projects={props.side_projects}
          education={props.education}
          logoVisibility={props.logoVisibility}
          volunteer_work={props.volunteer_work}
          surveyOnSignUpHide={props.surveyOnSignUpHide}
          displayInfo={props.displayInfo}
        />
      }
      { props.template == 'bento' &&
        <Bento
          level="baseLevel"
          screenWidth={screenWidth}
          pageId={props.pageId}
          template={props.template}
          email={props.email}
          links={props.links}
          profile_pic_url={props.profile_pic_url}
          background_cover_image_url={props.background_cover_image_url}
          full_name={props.full_name}
          headline={props.headline}
          summary={props.summary}
          experiences={props.experiences}
          projects={props.projects}
          side_projects={props.side_projects}
          education={props.education}
          logoVisibility={props.logoVisibility}
          volunteer_work={props.volunteer_work}
          surveyOnSignUpHide={props.surveyOnSignUpHide}
          displayInfo={props.displayInfo}
        />
      }
      { props.template == 'staccato' &&
        <StaccatoProfile
          level="baseLevel"
          screenWidth={screenWidth}
          pageId={props.pageId}
          template={props.template}
          email={props.email}
          links={props.links}
          profile_pic_url={props.profile_pic_url}
          background_cover_image_url={props.background_cover_image_url}
          full_name={props.full_name}
          first_name={props.first_name}
          last_name={props.last_name}
          headline={props.headline}
          summary={props.summary}
          experiences={props.experiences}
          projects={props.projects}
          side_projects={props.side_projects}
          education={props.education}
          logoVisibility={props.logoVisibility}
          volunteer_work={props.volunteer_work}
          surveyOnSignUpHide={props.surveyOnSignUpHide}
          displayInfo={props.displayInfo}
        />
      }
      { props.template == 'freelance' &&
        <Freelance
          level="baseLevel"
          screenWidth={screenWidth}
          pageId={props.pageId}
          template={props.template}
          email={props.email}
          links={props.links}
          profile_pic_url={props.profile_pic_url}
          background_cover_image_url={props.background_cover_image_url}
          full_name={props.full_name}
          first_name={props.first_name}
          last_name={props.last_name}
          headline={props.headline}
          summary={props.summary}
          products={props.products}
          services={props.services}
          featured={props.featured}
          experiences={props.experiences}
          projects={props.projects}
          posts={props.posts}
          side_projects={props.side_projects}
          education={props.education}
          logoVisibility={props.logoVisibility}
          volunteer_work={props.volunteer_work}
          surveyOnSignUpHide={props.surveyOnSignUpHide}
          displayInfo={props.displayInfo}
        />
      }
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const content = {}
  await fire.firestore()
    .collection('users')
    .where("profileUrl", "==", `/profile/${query.id}`)
    .limit(1)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        content['pageId'] = query.id ? query.id : null;
        content['template'] = doc.data().template ? doc.data().template : null;
        content['email'] = doc.data().email ? doc.data().email : null;
        content['links'] = doc.data().links ? doc.data().links : null;
        content['profile_pic_url'] = doc.data().profile.profile_pic_url ? doc.data().profile.profile_pic_url : null;
        content['background_cover_image_url'] = doc.data().profile.background_cover_image_url ? doc.data().profile.background_cover_image_url : null;
        content['full_name'] = doc.data().profile.full_name ? doc.data().profile.full_name : null;
        content['first_name'] = doc.data().profile.first_name ? doc.data().profile.first_name : null;
        content['last_name'] = doc.data().profile.last_name ? doc.data().profile.last_name : null;
        content['headline'] = doc.data().profile.headline ? doc.data().profile.headline : null;
        content['summary'] = doc.data().profile.summary ? doc.data().profile.summary : null;
        content['products'] = doc.data().profile.products ? doc.data().profile.products : null;
        content['services'] = doc.data().profile.services ? doc.data().profile.services : null;
        content['featured'] = doc.data().profile.featured ? doc.data().profile.featured : null;
        content['experiences'] = doc.data().profile.experiences ? doc.data().profile.experiences : null;
        content['projects'] = doc.data().profile.projects ? doc.data().profile.projects : null;
        content['posts'] = doc.data().profile.posts ? doc.data().profile.posts : null;
        content['side_projects'] = doc.data().profile.side_projects ? doc.data().profile.side_projects : null;
        content['education'] = doc.data().profile.education ? doc.data().profile.education : null;
        content['volunteer_work'] = doc.data().profile.volunteer_work ? doc.data().profile.volunteer_work : null;
        content['featured'] = doc.data().profile.featured ? doc.data().profile.featured : null;
        content['logoVisibility'] = doc.data().logoVisibility ? doc.data().logoVisibility : null;
        content['surveyOnSignUpHide'] = doc.data().surveys ? (doc.data().surveys.surveyOnSignUp ? (doc.data().surveys.surveyOnSignUp.surveyHide ? doc.data().surveys.surveyOnSignUp.surveyHide : null) : null) : null;
        content['displayInfo'] = doc.data().displayInfo ? doc.data().displayInfo : null;
      })
    })
    .catch((err) => {
      console.log(err.code, err.message)
    })

  const props = {
    pageId: content.pageId,
    template: content.template,
    email: content.email,
    links: content.links,
    profile_pic_url: content.profile_pic_url,
    background_cover_image_url: content.background_cover_image_url,
    full_name: content.full_name,
    first_name: content.first_name,
    last_name: content.last_name,
    headline: content.headline,
    summary: content.summary,
    products: content.products,
    services: content.services,
    featured: content.featured,
    experiences: content.experiences,
    projects: content.projects,
    posts: content.posts,
    side_projects: content.side_projects,
    education: content.education,
    volunteer_work: content.volunteer_work,
    featured: content.featured,
    logoVisibility: content.logoVisibility,
    surveyOnSignUpHide: content.surveyOnSignUpHide,
    displayInfo: content.displayInfo
  }

  return {
    props: JSON.parse(JSON.stringify(props)) 
  }
}

export default Profile