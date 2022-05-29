import { useState, useEffect } from 'react'; 
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import Head from 'next/head';

const Emails = () => {

  const router = useRouter();

  const [receiveEmails, setReceiveEmails] = useState(false);
  const [user, setUser] = useState('')
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [notify, setNotification] = useState('');

  useEffect(() => {
    // const unsubscribe =  fire.auth()
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        // User is signed out
        // ...
      }
    });

  }, []);

/*
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
*/
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true)
    if (receiveEmails) {
        fire.firestore().collection('users').doc(user.uid).get()
        .then((doc) => {
          fire.firestore().collection('mailingList').doc(user.uid).set({
            // firstName: doc.data().profile.first_name,
            // lastName: doc.data().profile.last_name,
            stage: 'sync',
            subscriberEmail: doc.data().email,
            subscribed: fire.firestore.FieldValue.serverTimestamp(),
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
        })
        .then(() => {
          fire.firestore().collection('users').doc(user.uid).update({
          receiveEmails,
          stage: '/setup/sync',
          lastUpdated: fire.firestore.FieldValue.serverTimestamp()
        })
      })
      .then(() => {
        setSubmitting(false)
      })
      .then(() => {
        router.push('/setup/sync')
      })
      .catch((err) => {
        setSubmitting(false)
        console.log(err.code, err.message)
      })
    } else {
      fire.firestore().collection('users').doc(user.uid).update({
        receiveEmails,
        stage: '/setup/sync',
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        setSubmitting(false)
      })
      .then(() => {
        router.push('/setup/sync')
      })
      .catch((err) => {
        setSubmitting(false)
        console.log(err.code, err.message)
      })
    }
    // If "receiveEmails" = true then:
    // Create document in 'mailingList' collection with:
    // email, userId, firstName, lastName
  }

  return (
    <div>
      <Head>
        <title>Create an account</title>
      </Head>
      <Container className="py-5">
        <div className="card m-auto" style={{maxWidth: "640px"}}>
          <div className="py-4 px-4 px-md-5">
            <h5 className="text-dark-high mb-0">Opt-in to emails</h5>
            {/* <p>{user ? fire.auth().currentUser.uid : 'null'}</p> */}
          </div>
          <hr className="m-0"/>
          <div className="p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <label className="checkbox-container small mb-4">I would like to receive emails about news and updates
                <input type="checkbox" onChange={() => setReceiveEmails(receiveEmails => !receiveEmails)} checked={receiveEmails}></input>
                <span className="checkmark"></span>
              </label>
               <br />
              <button type="submit" className="btn primary high" disabled={submitting}>{submitting ? 'Submitting...' : 'Continue'}</button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Emails