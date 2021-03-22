// Step 1 -  Enter LinkedIn Profile URL (sync)
// Fail > Error message and try again
// Success > Continue to next step

import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import testResponse from './testResponse';

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
    setLoadingState('one');

    /*var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 535f6290-580a-42db-b7cb-93677b8c82e6");
    myHeaders.append("Cookie", "__cfduid=d3247c413fc882f7d1376996aa9c3f8401615645700");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://nubela.co/proxycurl/api/v2/linkedin?url=https%3A%2F%2Fwww.linkedin.com%2Fin%2F" + profileUrl, requestOptions)
      .then(res => res.json())
      .then((result) => {
          setLoadingState('two');
          fire.firestore().collection('users').doc(user.uid).set({
            profile: result,
            stage: '/profile/' + userData.uid
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
      })*/

    fetch("https://jsonplaceholder.typicode.com/todos/" + profileUrl)
      .then(res => res.json())
      .then((result) => {
        setLoadingState('two');
        fire.firestore().collection('users').doc(userData.uid).update({
          profile: result,
          stage: '/profile/' + userData.uid
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

  const handleTestDataSubmit = (e) => {
    e.preventDefault();
    fire.firestore().collection('users').doc(userData.uid).update({
      profile: testResponse,
      stage: '/profile/' + userData.uid
    })
    .then(() => {
      router.push('/profile/' + userData.uid)
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    })
  }

  return (
    <div>
      <Header />
      {loadingState === '' ?
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
        :
        <div>
          {loadingState}
        </div>
      }

    </div>
  )

}

export default Sync
