import fire from '../../config/fire-config';
import { useEffect, useState, useContext } from 'react';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import { UserContext } from './../_app';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loader.json'
import Header from '../../components/header/Header';
import Freelance from '../../components/profile/Freelance';
import { Container } from 'react-bootstrap';
import Link from 'next/link';

const Profile = (props) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [currentUserId, setCurrentUserId] = useState('')
  const [showMore, setShowMore] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [headerImageError, setHeaderImageError] = useState(false);

  const [userData, setUserData] = useState(undefined);
  const [gettingUserProfile, setGettingUserProfile] = useState(true);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [editProfileModalState, setEditProfileModalState] = useState('default')
  const [editProfileModalSubtitle, setEditProfileModalSubtitle] = useState('')
  const [editProfileModalIndex, setEditProfileModalIndex] = useState('')

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
    checkUser();
    mixpanel.init(mixpanelConfig);
    mixpanel.track('Profile');
    // if (empty) router.push
  }, [])

  const checkUser = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setCurrentUserId(user.uid)
        setLoggedIn(true)
        getUserProfile(user)
        // ...
      } else {
        setGettingUserProfile(false)
        setLoggedIn(false)
        // User is signed out
        // ...
      }
    });
  }

  // get logged in user's profile
  const getUserProfile = (user) => {
    setGettingUserProfile(true)
    fire.firestore().collection('users').doc(user.uid).get().then((doc) => {
      if (doc.exists) {
        setUserData(doc.data())
      } else {
        setGettingUserProfile(false)
        console.log("No such document!");
      }
    })
      .then(() => {
        setGettingUserProfile(false)
      })
      .catch((error) => {
        setGettingUserProfile(false)
        console.log("Error getting document:", error);
      })
  }

  const handleEditProfileClose = () => {
    setShowEditProfileModal(false);
    // setEditProfileModalState('default')
  };

  const handleEditProfileShow = (page) => {
    setShowEditProfileModal(true)
    !page ? setEditProfileModalState('default') : setEditProfileModalState(page)
    setEditProfileModalIndex('')
    mixpanel.init(mixpanelConfig);
    mixpanel.track('Launch edit profile modal');
  };

  const handleEditProfileChangeView = (page, subtitle, index) => {
    setEditProfileModalState(page)
    setEditProfileModalSubtitle(subtitle)
    setEditProfileModalIndex(index)
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div>
      {/* { loggedIn && */}
        <Header 
          positionFixed 
          showEditProfileModal={showEditProfileModal}
          setShowEditProfileModal={setShowEditProfileModal}
          editProfileModalState={editProfileModalState} 
          setEditProfileModalState={setEditProfileModalState}
          editProfileModalSubtitle={editProfileModalSubtitle} 
          setEditProfileModalSubtitle={setEditProfileModalSubtitle}
          editProfileModalIndex={editProfileModalIndex} 
          setEditProfileModalIndex={setEditProfileModalIndex}
          handleEditProfileClose={handleEditProfileClose}
          handleEditProfileShow={handleEditProfileShow}
          handleEditProfileChangeView={handleEditProfileChangeView}
        />
      {/* } */}
      { !gettingUserProfile ? 
        (
          userData !== undefined ?
            <Freelance
              level="baseLevel"
              screenWidth={screenWidth}
              pageId={currentUserId}
              // template={userData.profile.template}
              theme={userData.theme}
              email={userData.email}
              linksPrimary={userData.linksPrimary}
              links={userData.links}
              profile_pic_url={userData.profile.profile_pic_url}
              background_cover_image_url={userData.profile.background_cover_image_url}
              full_name={userData.profile.full_name}
              first_name={userData.profile.first_name}
              last_name={userData.profile.last_name}
              headline={userData.profile.headline}
              summary={userData.profile.summary}
              products={userData.profile.products}
              services={userData.profile.services}
              featured={userData.profile.featured}
              experiences={userData.profile.experiences}
              projects={userData.profile.projects}
              side_projects={userData.profile.side_projects}
              testimonials={userData.profile.testimonials}
              posts={userData.profile.posts}
              education={userData.profile.education}
              logoVisibility={userData.profile.logoVisibility}
              volunteer_work={userData.profile.volunteer_work}
              surveyOnSignUpHide={userData.profile.surveyOnSignUpHide}
              showEditProfileModal={showEditProfileModal}
              setShowEditProfileModal={setShowEditProfileModal}
              editProfileModalState={editProfileModalState} 
              setEditProfileModalState={setEditProfileModalState}
              editProfileModalSubtitle={editProfileModalSubtitle} 
              setEditProfileModalSubtitle={setEditProfileModalSubtitle}
              editProfileModalIndex={editProfileModalIndex} 
              setEditProfileModalIndex={setEditProfileModalIndex}
              handleEditProfileClose={handleEditProfileClose}
              handleEditProfileShow={handleEditProfileShow}
              handleEditProfileChangeView={handleEditProfileChangeView}
            />
          :
              <div className="d-flex justify-content-center align-items-center bg-light-900 py-5" style={{ minHeight: '100vh' }}>
                <Container>
                  <div className="py-5 background-light">
                    <div className="d-flex flex-column align-items-center container text-center">
                      {screenWidth && screenWidth > 767 ?
                        <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Create your page in two minutes</h2>
                        :
                        <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{ maxWidth: '560px' }}>Create your page in two minutes</h2>
                      }
                      <p className="mx-auto mb-5 text-dark-med large" style={{ maxWidth: '720px' }}>Build trust and sell more. Simple web pages for freelancers and consultants. No tech skills required.</p>
                      <Link href="/users/register" className="btn primary high large">Create my page</Link>
                    </div>
                  </div>
                </Container>
              </div>
          )    
        : 
          <div className="bg-light-900 position-fixed w-100 h-100" style={{ top: 0, left: 0, zIndex: 1100 }}>
            <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
              <Lottie options={defaultOptions} height={160} width={160} />
            </div>
          </div>
      }
    </div>
  )
}

export default Profile