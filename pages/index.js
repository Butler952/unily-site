import { useState } from 'react';
import Head from 'next/head';
import fire from '../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../components/header/Header';
import { Container } from 'react-bootstrap';
import Image from 'next/image'

import styles from './index.module.scss'

const Home = () => {
  const [notification, setNotification] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  fire.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true)
        loggedInRoute(user)
      } else {
        setLoggedIn(false)
      }
    })


    const loggedInRoute = (user) => {
      var docRef = fire.firestore().collection('users').doc(user.uid)

      docRef.get().then((doc) => {
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
      });

      /*
      fire.firestore().collection('users').doc(user.uid).set({
        receiveEmails,
        email: user.email,
        stage: '/setup/sync'
      })
      .then(() => {
        router.push("/setup/sync")
      })*/
    }
    

  /*useEffect(() => {
    const unsubscribe =  fire.firestore()
      .collection('blog')
      .onSnapshot(snap => {
        const blogs = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogs);
      });
      return () => {
        // Unmouting
        unsubscribe();
      };
  }, []);*/

  return (
    <div style={{background: 'white'}}>
      <Head>
        <title>Personal Page Generator App</title>
      </Head>
      <Header/>
      <Container className="mt-5 py-5 text-center">
        <div style={{maxWidth: '720px'}} className="mx-auto mb-5">
          <h1>Your LinkedIn profile. But <span className={styles.headingUnderlineContainer}>better.</span></h1>
          <p className="large mb-4">Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page.</p>
          <div className="d-flex m-auto justify-content-center">
            <Link href="/users/register">
              <a className="btn primary high large m-auto">Get started</a>
            </Link>
          </div>
        </div>
        <br/>
        <div className={styles.heroImageWrapper}>
          <Image 
            src="/images/profile-preview.png" 
            layout='fill'
          />
        </div>
      </Container>
      {notification}
    </div>
  )
}

export default Home;