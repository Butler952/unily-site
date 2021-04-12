// Step 1 -  Enter LinkedIn Profile URL (sync)
// Fail > Error message and try again
// Success > Continue to next step

import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
// import testResponse from './testResponse';
import { Container, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';

const Sync = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

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
      if (doc.exists) {
        router.push(doc.data().stage)
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
        .then((result) => {
          setLoadingState('Storing your data');
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
            stage: 'complete',
            profileUrl: '/profile/' + userData.uid,
          })
        })
        .then(() => {
          setTimeout(
            setLoadingState('Sync successfully completed'), 2000
          )
        })
        .then(() => {
          router.push('/profile/' + userData.uid)
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
      <Header />

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
                  <p>We will use this to collect your information on your profile.</p>
                  <div>
                    <input type="text" className={urlError !== '' ? `error w-100` : `w-100`} pattern="http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?" onInvalid={onUrlInvalid} value={profileUrl} onChange={({ target }) => urlChange(target.value)} placeholder="https://www.linkedin.com/in/" />
                    {urlError !== '' ? <p className="small text-error-high mt-2">{urlError}</p> : null}
                  </div>
                </div>
                <br />
                <button type="submit" className="btn primary high">Sync data</button>
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