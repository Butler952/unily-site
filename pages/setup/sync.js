// Step 1 -  Enter LinkedIn Profile URL (sync)
// Fail > Error message and try again
// Success > Continue to next step

import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
// import testResponse from './testResponse';
import { Container } from 'react-bootstrap';

const Sync = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingState('Fetching data from LinkedIn');

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 535f6290-580a-42db-b7cb-93677b8c82e6");
    myHeaders.append("Access-Control-Allow-Origin", "https://personal-page-generator-v1.vercel.app, http://localhost:3000/, https://localhost:3000/, https://nubela.co/proxycurl/api/v2/");
    myHeaders.append('Access-Control-Allow-Credentials', 'true');
    myHeaders.append("Access-Control-Allow-Methods", "GET");
    myHeaders.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    var requestOptions = {
      mode: 'cors',
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://nubela.co/proxycurl/api/v2/linkedin?url=https%3A%2F%2Fwww.linkedin.com%2Fin%2F" + profileUrl, requestOptions)
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
            about: true, 
            'experience': {
              'section': true, 
              'each': createExperienceList(result.experiences)
            },
            'education': {
              'section': true, 
              'each': createEducationList(result.education)
            },
            'volunteering': {
              'section': true, 
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

    /*
      
    fetch("https://jsonplaceholder.typicode.com/todos/" + profileUrl)
      .then(res => res.json())
      .then((result) => {
        setLoadingState('two');
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
            about: true, 
            'experience': {
              'section': true, 
              'each': createExperienceList(result.experiences)
            },
            'education': {
              'section': true, 
              'each': createEducationList(result.education)
            },
            'volunteering': {
              'section': true, 
              'each': createVolunteerList(result.volunteer_work)
            },
          },
          stage: 'complete',
          profileUrl: '/profile/' + userData.uid,
        })
      },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setLoadingState('');
          setError(error);
        }
      )
      .then(() => {
        setLoadingState('three');
      })
      .then(() => {
        router.push('/profile/' + userData.uid)
      })

      */

    /*
          .then((response) => {
            fire.firestore().collection('users').doc(user.uid).set({
              receiveEmails,
              email: user.email,
              stage: '/setup/sync'
            })
          })
          .then((response) => {
            router.push("/setup/sync")
          })
    
    
    
          fetch("https://nubela.co/proxycurl/api/v2/linkedin?url=https%3A%2F%2Fwww.linkedin.com%2Fin%2F" + profileUrl)
            .then(res => res.json())
            .then(
              (result) => {
                setIsLoaded(true);
                setItems(result);
              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                setIsLoaded(true);
                setError(error);
              }
            )*/

    /* https://nubela.co/proxycurl/api/v2/linkedin?url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fbutler952*/

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

  /*
  const handleTestDataSubmit = (e) => {
    e.preventDefault();
    fire.firestore().collection('users').doc(userData.uid).update({
      profile: testResponse,
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
        about: true, 
        'experience': {
          'section': true, 
          'each': createExperienceList(testResponse.experiences)
        },
        'education': {
          'section': true, 
          'each': createEducationList(testResponse.education)
        },
        'volunteering': {
          'section': true, 
          'each': createVolunteerList(testResponse.volunteer_work)
        },
      },
      stage: 'complete',
      profileUrl: '/profile/' + userData.uid,
    })
      .then(() => {
        router.push('/profile/' + userData.uid)
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })
  }
  */

  return (
    <div>
      <Header />
      {loadingState === '' ?
        <Container className="py-5">
          <div className="card m-auto" style={{ maxWidth: "640px" }}>
            <div className="py-4 px-4 px-md-5">
              <h5 className="text-dark-high mb-0">Sync data from LinkedIn</h5>
            </div>
            <hr className="m-0" />
            <div className="p-4 p-md-5">
              {notify}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <p className="large text-dark-high">LinkedIn profile URL</p>
                  <p>We will use this to collect your information on your profile.</p>
                  <div>
                    https://www.linkedin.com/in/
              <input type="text" className="w-100" value={profileUrl} onChange={({ target }) => setProfileUrl(target.value)} />
                  </div>
                </div>
                <br />
                <button type="submit" className="btn primary high">Sync data</button>
              </form>
              <br />
              {notify}
              {/*}
              <hr />
              <br />
              <form onSubmit={handleTestDataSubmit}>
                <p className="large text-dark-high">Test Data</p>   
                <p>Add test data to logged in profile</p>
                <button type="submit" className="btn primary high">Add test response</button>
              </form>
              */}
            </div>

          </div>
        </Container>
        :
        <div>
          {loadingState}
        </div>
      }

    </div>
  )

}

export default Sync

{/*

          <div>
          <h1>Sync data from LinkedIn</h1>
          {notify}
          <form onSubmit={handleSubmit}>
            LinkedIn profile URL
        <p>We will use this to collect your information on your profile.</p>
            <div>
              https://www.linkedin.com/in/
          <input type="text" value={profileUrl} onChange={({ target }) => setProfileUrl(target.value)} />
            </div>
            <br />
            <button type="submit">Sync data</button>
          </form>
          <br />
          <form onSubmit={handleTestDataSubmit}>
            Test Data
            <p>Add test data to logged in profile</p>
            <button type="submit">Add test response</button>
          </form>
        </div>

*/}
