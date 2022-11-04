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
import styles from '../settings/settings.module.scss'
import Image from 'next/image';

const Template = () => {
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

  const [saving, setSaving] = useState('');

  const [templateChanged, setTemplateChanged] = useState(false);
  const [templateSelection, setTemplateSelection] = useState('');


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
              stage: 'complete',
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
            stage: 'complete',
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
          router.push(currentProfile.profileUrl)
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

  const changeTemplate = (template) => {
    setTemplateChanged(true)
    setTemplateSelection(template)
  }

  let templates = [
    {
      'id': 0,
      'label': 'Original',
      'string': 'original',
      'img': '/images/profile-preview.png',
      'active': templateSelection == 'original'
    },
    {
      'id': 1,
      'label': 'Metro',
      'string': 'metro',
      'img': '/images/metro-template.jpeg',
      'active': templateSelection == 'metro'
    },
    {
      'id': 2,
      'label': 'Metro Night',
      'string': 'metro_night',
      'img': '/images/metro-night-template.jpeg',
      'active': templateSelection == 'metro_night'
    },
    {
      'id': 3,
      'label': 'Document',
      'string': 'document',
      'img': '/images/document-template.jpeg',
      'active': templateSelection == 'document'
    },
  ]

  const handleSave = (e) => {
    e.preventDefault();

    if (!templateChanged) {
      setChoiceError('Please choose a template')
    }

    fire.firestore().collection('users').doc(userData.uid).update({
      'stage': 'complete',
      'template': templateSelection,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      let newUserContext = userContext;
      newUserContext.stage = 'complete'
      newUserContext.template = templateSelection;
      setUserContext(newUserContext)
    })
    .then(() => {
      router.push(currentProfile.profileUrl)
    })
    .catch((err) => {
      // console.log(err.code, err.message)
      toast(err.message)
    })
  }

  return (
    <div>
     
      <Head>
        <title>Choose a template</title>
      </Head>
      <Container className="py-5">
        <div className="card m-auto" style={{ maxWidth: "640px" }}>
          <div className="py-4 px-4 px-md-5">
            <h5 className="text-dark-high mb-0">Choose a template</h5>
          </div>
          <hr className="m-0" />
          <div className="d-flex flex-column p-4 p-md-5" style={{gap: '16px'}}>
            {templates.map((template, index) => 
              <div role="button" onClick={() => changeTemplate(template.string)} className={`d-flex flex-column radius-3 p-3 w-100 ${styles.planCard} ${template.active && styles.active}`}>
                <p className="large font-weight-bold text-dark-high">{template.label}</p>
                <div className={styles.imageWrapper}>
                  <Image
                    src={template.img}
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
              </div>
            )}
            <div className="mt-4">
              <button type="button" onClick={handleSave} className="btn primary high w-100 w-md-auto" disabled={!templateChanged || saving}>{!saving ? 'Create my profile' : 'Saving'}</button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )

}

export default Template