import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Modal } from 'react-bootstrap';
import fire from '../../config/fire-config';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from '../../config/mixpanel-config';
import ICONS from '../icon/IconPaths';

const ProfilePreviewBanner = () => {

  const [showBanner, setShowBanner] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState('')
  const [userData, setUserData] = useState('');
  const [localProfile, setLocalProfile] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passConf, setPassConf] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [termsAndPrivacy, setTermsAndPrivacy] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);
  // const [receiveEmails, setReceiveEmails] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passConfError, setPassConfError] = useState('');
  const [loadingState, setLoadingState] = useState('');

  const [notify, setNotification] = useState('');

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  const router = useRouter()


  // useEffect(() => {
  //   setScreenWidth(window.innerWidth)
  //   window.addEventListener('resize', handleResize);
  //   const unsubscribe = fire.auth()
  //     .onAuthStateChanged((user) => {
  //       if (user) {
  //         setUser(user.uid)
  //       }
  //     })
  //   return () => {
  //     // Unmouting
  //     unsubscribe();
  //   };
  // }, []);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {

    mixpanel.init(mixpanelConfig); 
    mixpanel.track('View create account');
    const unsubscribe =  fire.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true)
        //addUserDocument(user)
        setUserData(user)
      } else {
        setLoggedIn(false)
        if (localStorage.profile !== undefined) {
          setLocalProfile(JSON.parse(localStorage.profile))
        }
      }
    })
      return () => {
        // Unmouting
        unsubscribe();
      };
  }, []);


  // const addUserDocument = (user) => {
  //     setLoadingState('Creating your profile');
  //     if (receiveEmails) {
  //       fire.firestore().collection('mailingList').doc(user.uid).set({
  //         firstName: localProfile.first_name,
  //         lastName: localProfile.last_name,
  //         subscriberEmail: user.email,
  //         stage: 'complete',
  //         subscribed: fire.firestore.FieldValue.serverTimestamp(),
  //         lastUpdated: fire.firestore.FieldValue.serverTimestamp()
  //       })
  //       .then(() => {
  //         fire.firestore().collection('users').doc(user.uid).set({
  //           profile: localProfile,
  //           displayInfo: {
  //             'basicInfo': {
  //               'section': true,
  //               'each': {
  //                 'profilePic': true,
  //                 'headerImage': true,
  //                 'name': true,
  //                 'headline': true,
  //                 'email': true
  //               }
  //             },
  //             about: localProfile.summary === null ? false : true,
  //             'experience': {
  //               'section': localProfile.experiences < 1 ? false : true,
  //               'each': createExperienceList(localProfile.experiences)
  //             },
  //             'education': {
  //               'section': localProfile.education < 1 ? false : true,
  //               'each': createEducationList(localProfile.education)
  //             },
  //             'volunteering': {
  //               'section': localProfile.volunteer_work < 1 ? false : true,
  //               'each': createVolunteerList(localProfile.volunteer_work)
  //             },
  //           },
  //           receiveEmails: receiveEmails,
  //           email: user.email,
  //           stage: 'complete',
  //           profileUrl: '/profile/' + user.uid,
  //           created: fire.firestore.FieldValue.serverTimestamp(),
  //           lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
  //           lastSync: fire.firestore.FieldValue.serverTimestamp(),
  //         })
  //         .then(() => {
  //           mixpanel.init(mixpanelConfig);
  //           mixpanel.track('Register');
  //           mixpanel.track('Synced');
  //           setLoadingState('Profile created');
  //           handleClose();
  //           router.push('/router')
  //         })
  //       })
  //     } else {
  //       fire.firestore().collection('users').doc(user.uid).set({
  //         profile: localProfile,
  //         displayInfo: {
  //           'basicInfo': {
  //             'section': true,
  //             'each': {
  //               'profilePic': true,
  //               'headerImage': true,
  //               'name': true,
  //               'headline': true,
  //               'email': true
  //             }
  //           },
  //           about: localProfile.summary === null ? false : true,
  //           'experience': {
  //             'section': localProfile.experiences < 1 ? false : true,
  //             'each': createExperienceList(localProfile.experiences)
  //           },
  //           'education': {
  //             'section': localProfile.education < 1 ? false : true,
  //             'each': createEducationList(localProfile.education)
  //           },
  //           'volunteering': {
  //             'section': localProfile.volunteer_work < 1 ? false : true,
  //             'each': createVolunteerList(localProfile.volunteer_work)
  //           },
  //         },
  //         receiveEmails: receiveEmails,
  //         email: user.email,
  //         stage: 'complete',
  //         profileUrl: '/profile/' + user.uid,
  //         created: fire.firestore.FieldValue.serverTimestamp(),
  //         lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
  //         lastSync: fire.firestore.FieldValue.serverTimestamp(),
  //       })
  //       .then(() => {
  //         mixpanel.init(mixpanelConfig);
  //         mixpanel.track('Register');
  //         mixpanel.track('Synced');
  //         setLoadingState('Profile created');
  //         handleClose();
  //         router.push('/router')
  //       })
  //     }
  // }

  const usernameChange = (value) => {
    setUsername(value),
      setEmailError('')
  }

  const passwordChange = (value) => {
    setPassword(value)
    setPasswordError('')
    setPassConfError('')
  }

  const passConfChange = (value) => {
    setPassConf(value)
    setPasswordError('')
    setPassConfError('')
  }

  const termsAndPrivacyChange = () => {
    setTermsAndPrivacy(termsAndPrivacy => !termsAndPrivacy)
    setNotification('')
  }

  const receiveEmailsChange = () => {
    setReceiveEmails(receiveEmails => !receiveEmails)
  }

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== passConf) {
      setPasswordError('Password and confirm password do not match')
      setPassConfError('Password and confirm password do not match')
      return null;
    }

    if (!termsAndPrivacy) {
      setNotification('Please accept the terms and conditions')
      return null;
    }

    setLoadingState('Creating account')
    
    fire.auth()
    .createUserWithEmailAndPassword(username, password)
    // .then((userCredential) => {
    //   fire.firestore().collection('users').doc(userCredential.user.uid).set({
    //     //receiveEmails,
    //     email: userCredential.user.email,
    //     stage: '/setup/emails',
    //     created: fire.firestore.FieldValue.serverTimestamp(),
    //     lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    //   })
    // })  
    .then((userCredential) => {
      setLoadingState('Creating your profile');
      if (receiveEmails) {
        fire.firestore().collection('mailingList').doc(userCredential.user.uid).set({
          firstName: localProfile.first_name,
          lastName: localProfile.last_name,
          subscriberEmail: userCredential.user.email,
          stage: 'complete',
          signUpSurveyComplete: false,
          subscribed: fire.firestore.FieldValue.serverTimestamp(),
          lastUpdated: fire.firestore.FieldValue.serverTimestamp()
        })
      }
      fire.firestore().collection('users').doc(userCredential.user.uid).set({
        profile: localProfile,
        displayInfo: {
          'basicInfo': {
            'section': true,
            'each': {
              'profilePic': true,
              'headerImage': true,
              'name': true,
              'headline': true,
              'email': true
            }
          },
          about: localProfile.summary === null ? false : true,
          'experience': {
            'section': localProfile.experiences < 1 ? false : true,
            'each': createExperienceList(localProfile.experiences)
          },
          'education': {
            'section': localProfile.education < 1 ? false : true,
            'each': createEducationList(localProfile.education)
          },
          'volunteering': {
            'section': localProfile.volunteer_work < 1 ? false : true,
            'each': createVolunteerList(localProfile.volunteer_work)
          },
        },
        receiveEmails: receiveEmails,
        email: userCredential.user.email,
        stage: 'complete',
        profileUrl: '/profile/' + userCredential.user.uid,
        created: fire.firestore.FieldValue.serverTimestamp(),
        lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
        lastSync: fire.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        mixpanel.init(mixpanelConfig);
        mixpanel.track('Register');
        mixpanel.track('Synced');
        setLoadingState('Profile created');
        handleClose();
        router.push('/router')
      })
    })
    .catch((err) => {
      if (err.code === 'auth/email-already-in-use') {
        setEmailError('This email is already in use')
      }
      if (err.code === 'auth/invalid-email') {
        setEmailError('Please enter a valid email address')
      }
      if (err.code === 'auth/weak-password') {
        setPasswordError('Your password must be at least 6 characters long')
      }
      setLoadingState('')
      console.log(err.code, err.message)
    })
  }

  const createExperienceList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'title': object.title,
      'company': object.company
    })
    )
  }

  const createEducationList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'name': object.field_of_study,
      'school': object.school
    })
    )
  }

  const createVolunteerList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'title': object.title,
      'company': object.company
    })
    )
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center bg-primary-900 w-100 p-3 position-sticky" style={{ zIndex: '1', top: '0' }}>
        <div className="d-flex flex-row align-items-center" style={{ gap: '24px' }}>
          <div>
            <p className="large text-light-high font-weight-bold mb-1">Want to save your beautiful profile?</p>
            <p className="text-light-med mb-0">Create an account to save your progress</p>
          </div>
        </div>
        <div className="d-flex flex-column flex-sm-row ml-md-3 mt-3 mt-md-0 w-100 w-sm-auto">
          <button onClick={handleShow} className="btn light high small w-100 w-sm-auto">Create account</button>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      // size="lg"
      >
        {/* {!submitted ? <Modal.Header closeButton>
                    <h5 className="text-dark-high mb-0">Feedback survey</h5>
                    <button onClick={handleClose} className="btn dark low small icon-only">
                        <svg viewBox="0 0 24 24">
                            <path d={ICONS.CLOSE}></path>
                        </svg>
                    </button>
                </Modal.Header> : ''} */}

        <Modal.Body>
          <div className="p-md-3">
            <div className="pb-5 d-flex flex-row justify-content-between align-items-center">
              <h4 className="text-dark-high mb-0">Sign up</h4>
              <button onClick={handleClose} className="btn dark ultraLow small icon-only ml-md-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.CLOSE}></path>
                </svg>
              </button>
            </div>
            {/* <p className="mb-4">Already got an account? <Link href="/users/login">Sign in</Link></p> */}
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <p className="large text-dark-high">Email</p>
                <input type="text" className={emailError !== '' ? `error w-100` : `w-100`} value={username} onChange={({ target }) => usernameChange(target.value)} />
                {emailError !== '' ? <p className="small text-error-high mt-2">{emailError}</p> : null}
              </div>
              <div className="mb-4">
                <p className="large text-dark-high">Password</p>
                <input type="password" className={passwordError !== '' ? `error w-100` : `w-100`} value={password} onChange={({ target }) => passwordChange(target.value)} />
                {passwordError !== '' ? <p className="small text-error-high mt-2">{passwordError}</p> : null}
              </div>
              <div className="mb-4">
                <p className="large text-dark-high">Confirm password</p>
                <input type="password" className={passConfError !== '' ? `error w-100` : `w-100`} value={passConf} onChange={({ target }) => passConfChange(target.value)} />
                {passConfError !== '' ? <p className="small text-error-high mt-2">{passConfError}</p> : null}
              </div>
              <label className="checkbox-container small mb-4">I would like to receive emails about news and updates
                <input type="checkbox" onChange={() => receiveEmailsChange()} checked={receiveEmails}></input>
                <span className="checkmark"></span>
              </label>
              <label className="checkbox-container small mb-4">I agree to the <a href="/legal/terms" target="_blank">Terms</a> and <a href="/legal/privacy" target="_blank">Privacy Policy</a>
                <input type="checkbox" onChange={() => termsAndPrivacyChange()} checked={termsAndPrivacy}></input>
                {notify !== '' ? <p className="small text-error-high">{notify}</p> : null}
                <span className="checkmark"></span>
              </label>
              <br />
              {/* <button type="submit" className={`btn high w-100 w-md-auto ${loadingState !== 'Profile created' ? primary : success}`} disabled={loadingState !== ''}>{loadingState == '' ? 'Create account' : loadingState }</button> */}
              { loadingState !== 'Profile created' ? 
                <button type="submit" className="btn primary high w-100 w-md-auto" disabled={loadingState !== ''}>{loadingState == '' ? 'Create account' : loadingState }</button>
              : 
                <button className="btn success high w-100 w-md-auto">Profile created</button>
              }
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ProfilePreviewBanner;