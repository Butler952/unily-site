import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
// import testResponse from './testResponse';
import { Container, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import ICONS from '../../components/icon/IconPaths';
import { UserContext } from '../_app';

const Sync = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const [saving, setSaving] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userResult, setUserResult] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');

  const [urlError, setUrlError] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Sync');
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setLoggedIn(true)
          loggedInRoute(user)
          setUserData(user)
        } else {
          setLoggedIn(false)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);


  const loggedInRoute = (user) => {
    var docRef = fire.firestore().collection('users').doc(user.uid)

    docRef.get().then((doc) => {
      setCurrentProfile(doc.data())
      if (doc.exists) {
        if (doc.data().stage !== 'complete') {
          router.push(doc.data().stage)
        } else {
          router.push(doc.data().profileUrl)
        }
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    })
  }

  const urlChange = (value) => {
    setProfileUrl(value),
      setUrlError('')
  }

  const onUrlInvalid = () => {
    setUrlError('Please enter a valid LinkedIn URL')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profileUrl !== '') {
      setLoadingState('Fetching data from LinkedIn');

      fetch("/api/linkedin?profileUrl=" + profileUrl)
        .then(res => res.json())
        // .then(result => setUserResult(result))
        .then((result) => {
          setLoadingState('Storing your data');
          if (currentProfile.receiveEmails) {
            fire.firestore().collection('mailingList').doc(userData.uid).update({
              firstName: result.first_name,
              lastName: result.last_name,
              stage: 'complete',
              lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
            })
          }
          fire.firestore().collection('users').doc(userData.uid).update({
            // links: [{
            //   'label': 'Contact me',
            //   'url': userData.email
            // }],
            profile: result,
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
              about: result.summary === null ? false : true,
              'experience': {
                'section': result.experiences < 1 ? false : true,
                'each': createExperienceList(result.experiences)
              },
              'education': {
                'section': result.education < 1 ? false : true,
                'each': createEducationList(result.education)
              },
              'volunteering': {
                'section': result.volunteer_work < 1 ? false : true,
                'each': createVolunteerList(result.volunteer_work)
              },
            },
            //syncsRemaining: 1,
            stage: 'complete',
            template: 'freelance',
            // profileUrl: '/profile/' + userData.uid,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
            lastSync: fire.firestore.FieldValue.serverTimestamp(),
          });
          return result;
        })
        // .then((result) => {
        //   console.log(result);
        //   return result;
        // })
        .then((result) => {
          if (currentProfile.receiveEmails) {
            fire.firestore().collection('mailingList').doc(userData.uid).update({
              firstName: result.first_name,
              lastName: result.last_name,
              stage: 'complete',
              lastUpdated: fire.firestore.FieldValue.serverTimestamp()
            })
          }
          return result;
        })
        .then((result) => {
          setUserContext({
            profile: result,
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
              about: result.summary === null ? false : true,
              'experience': {
                'section': result.experiences < 1 ? false : true,
                'each': createExperienceList(result.experiences)
              },
              'education': {
                'section': result.education < 1 ? false : true,
                'each': createEducationList(result.education)
              },
              'volunteering': {
                'section': result.volunteer_work < 1 ? false : true,
                'each': createVolunteerList(result.volunteer_work)
              },
            },
            stage: 'complete',
            template: 'freelance'
            // profileUrl: '/profile/' + userData.uid,
          })
        })
        .then(() => {
          mixpanel.init(mixpanelConfig); 
          mixpanel.register_once({"Profile data method": "LinkedIn"});
          mixpanel.track('Synced');
          setTimeout(
            setLoadingState('Sync successfully completed'), 2000
          )
        })
        .then(() => {
          router.push(userContext.profileUrl)
        })
        .catch(error => console.log('error', error));
    } else {
      setUrlError('Please enter the URL for your LinkedIn profile')
    }
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

  const handleManualSubmit = (e) => {
    e.preventDefault();

    setSaving(true);

    fire.firestore().collection('users').doc(userData.uid).update({
      stage: '/setup/name',
      template: 'freelance',
      lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.stage = '/setup/name';
        newUserContext.template = 'freelance';
        setUserContext(newUserContext)
      })
      .then(() => {
        mixpanel.init(mixpanelConfig); 
        mixpanel.register_once({"Profile data method": "Manual"});
      })
      .then(() => {
        router.push('/setup/name')
      })
      .catch(error => console.log('error', error));
  }

  return (
    <div className="bg-light-900" style={{minHeight:'100vh'}}>
     
      <Head>
        <title>Sync your data</title>
      </Head>
      <Header hideShadow />

      <Container className="d-flex flex-column align-items-center my-5 py-5" style={{ maxWidth: "640px"}}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high text-center mb-2">Import from LinkedIn</h2>
          :
          <h3 className="text-dark-high text-center mb-2">Import from LinkedIn</h3>
        }
        <p className="large text-center" style={{maxWidth: '640px'}}>Your Linkedin profile is used to create your ExpertPage page.</p>

        {/* <div className="card m-auto" style={{ maxWidth: "640px" }}> */}
        <div className="d-flex flex-column w-100 my-4" style={{maxWidth: '480px'}}>
          {loadingState === '' ?
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                <div>
                  <input type="text" className={urlError !== '' ? `error w-100` : `w-100`} pattern="http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?" onInvalid={onUrlInvalid} value={profileUrl} onChange={({ target }) => urlChange(target.value)} placeholder="Linkedin profile URL" />
                  {/* {urlError !== '' ? <p className="small text-error-high mt-2">{urlError}</p> : <p className="small text-dark-med mt-2">If you're already logged in on Linkedin you can get to your Linkedin profile <a href="https://www.linkedin.com/in/">here</a></p> } */}
                  {urlError !== '' ? <p className="small text-error-high mt-2">{urlError}</p> : <p className="small text-dark-med mt-2">E.g. https://www.linkedin.com/in/butler952</p> }
                </div>
                {/* <div className="d-flex flex-column bg-primary-100 radius-3 p-4 mt-4">
                  <p className="text-dark-high">Make sure that your LinkedIn profile's public visibility settings include all the data that you want to sync into ExpertPage.</p>
                  <a href="https://www.linkedin.com/public-profile/settings" target="_blank">
                    <div className="d-flex align-items-start">
                      <svg viewBox="0 0 24 24" width={'24px'} style={{minWidth: '24px'}} className="mr-2 fill-primary-900">
                        <path d={ICONS.EXTERNAL_LINK}></path>
                      </svg>
                      <p className="text-primary-high mb-0">Manage your LinkedIn profile's visibility</p>
                    </div>
                  </a>
                </div> */}
                
              </div>
              <div className="d-flex flex-column align-items-center mb-4 mb-sm-5 gap-3">
                <div className="d-flex flex-column gap-3">
                  <button type="submit" className="btn primary high w-100" disabled={profileUrl == ''}>Import from Linkedin</button>
                  <div className="d-flex flex-column bg-primary-100 radius-3 p-4">
                    <p className="text-dark-high">If you're already logged in on Linkedin you can click on the link below to get to your Linkedin profile.</p>
                    <a href="https://www.linkedin.com/in/" target="_blank">
                      <div className="d-flex align-items-start">
                        <svg viewBox="0 0 24 24" width={'24px'} style={{minWidth: '24px'}} className="mr-2 fill-primary-900">
                          <path d={ICONS.EXTERNAL_LINK}></path>
                        </svg>
                        <p className="text-primary-high font-weight-medium mb-0">Go to your Linkedin profile</p>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center w-100 gap-3">
                  <hr className="w-100 m-0"></hr>
                  <p className="small mb-0">or</p>
                  <hr className="w-100 m-0"></hr>
                </div>
                <button type="button" onClick={(e) => handleManualSubmit(e)} className="btn primary medium w-100" disabled={saving}>Add information manually</button>
              </div>
              <br />
            </form>
            :
            <div className="py-5">
              <p className="large text-dark-high">{loadingState}</p>
              {<ProgressBar animated now={loadingState === 'Fetching data from LinkedIn' ? 10 : (loadingState === 'Storing your data' ? 60 : (loadingState === 'Sync successfully completed' ? 100 : null))} /> }
            </div>
          }
        </div>
      </Container>
    </div>
  )

}

export default Sync