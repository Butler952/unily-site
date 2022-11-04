import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
// import testResponse from './testResponse';
import { Container, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import ICONS from '../../components/icon/IconPaths';
import { UserContext } from '../_app';

const Sync = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const [profileUrl, setProfileUrl] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userResult, setUserResult] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');

  const [urlError, setUrlError] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  useEffect(() => {
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
              stage: '/setup/template',
              lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
            })
          }
          fire.firestore().collection('users').doc(userData.uid).update({
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
            stage: '/setup/template',
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
              stage: '/setup/template',
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
            stage: '/setup/template',
            // profileUrl: '/profile/' + userData.uid,
          })
        })
        .then(() => {
          mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
          mixpanel.track('Synced');
          setTimeout(
            setLoadingState('Sync successfully completed'), 2000
          )
        })
        .then(() => {
          router.push('/setup/template')
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

  return (
    <div>
     
      <Head>
        <title>Sync your data</title>
      </Head>

      <Container className="py-5">
        <div className="card m-auto" style={{ maxWidth: "640px" }}>
          <div className="py-4 px-4 px-md-5">
            <h5 className="text-dark-high mb-0">Sync data from LinkedIn</h5>
          </div>
          <hr className="m-0" />
          <div className="p-4 p-md-5">
            {loadingState === '' ?
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <p className="large text-dark-high">LinkedIn profile URL</p>
                  <p>The information on your Linkedin profile is used to create your Vitaely profile.</p>
                  <div>
                    <input type="text" className={urlError !== '' ? `error w-100` : `w-100`} pattern="http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?" onInvalid={onUrlInvalid} value={profileUrl} onChange={({ target }) => urlChange(target.value)} placeholder="e.g. https://www.linkedin.com/in/butler952" />
                    {urlError !== '' ? <p className="small text-error-high mt-2">{urlError}</p> : <p className="small text-dark-med mt-2">If you're already logged in on Linkedin you can access your profile <a href="https://www.linkedin.com/in/">here</a></p> }
                  </div>
                  <div className="d-flex flex-column bg-primary-100 radius-3 p-4 mt-4">
                    <p className="text-dark-high">Make sure that your LinkedIn profile's public visibility settings include all the data that you want to sync into Vitaely.</p>
                    <a href="https://www.linkedin.com/public-profile/settings" target="_blank">
                      <div className="d-flex align-items-start">
                        <svg viewBox="0 0 24 24" width={'24px'} style={{minWidth: '24px'}} className="mr-2 fill-primary-900">
                          <path d={ICONS.EXTERNAL_LINK}></path>
                        </svg>
                        {/*<a href="https://www.linkedin.com/public-profile/settings" className="text-primary-high">Manage your LinkedIn profile's visibility</a>*/}
                        <p className="text-primary-high mb-0">Manage your LinkedIn profile's visibility</p>
                      </div>
                    </a>
                  </div>
                  {/* <div className="d-flex flex-column bg-primary-100 radius-3 p-4 mt-4">
                    <p className="text-dark-high">If you're already logged in on Linkedin you click on the link below to access your profile.</p>
                    <a href="https://www.linkedin.com/in/" target="_blank">
                      <div className="d-flex align-items-start">
                        <svg viewBox="0 0 24 24" width={'24px'} style={{minWidth: '24px'}} className="mr-2 fill-primary-900">
                          <path d={ICONS.EXTERNAL_LINK}></path>
                        </svg>
                        <p className="text-primary-high mb-0">Go to your Linkedin profile</p>
                      </div>
                    </a>
                  </div> */}
                </div>
                <br />
                <button type="submit" className="btn primary high" disabled={profileUrl == ''}>Sync data</button>
              </form>
              :
              <div>
                <p className="large text-dark-high">{loadingState}</p>
                {<ProgressBar animated now={loadingState === 'Fetching data from LinkedIn' ? 10 : (loadingState === 'Storing your data' ? 60 : (loadingState === 'Sync successfully completed' ? 100 : null))} /> }
              </div>
            }
          </div>
        </div>
      </Container>
    </div>
  )

}

export default Sync