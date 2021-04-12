import { useState } from 'react';
import Head from 'next/head';
import fire from '../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../components/header/Header';
import { Container } from 'react-bootstrap';
import Image from 'next/image'

import styles from './index.module.scss'
import Icon from '../components/icon/Icon';
import ICONS from '../components/icon/IconPaths';
import Footer from '../components/Footer';

const Home = () => {
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
    <div className="overflow-hidden" style={{ background: 'white' }}>
      <Head>
        <title>Vitaely | Turn your LinkedIn profile into a landing page</title>
      </Head>
      <Header />
      <Container className="mt-5 py-5">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div style={{ maxWidth: '560px' }} className="mb-5 mr-lg-4 text-center text-lg-left">
            <h1>Turn your CV into a landing page</h1>
            <p className="large mb-4">Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page.</p>
            <div className="d-flex justify-content-center justify-content-lg-start m-auto m-lg-0">
              <Link href="/users/register">
                <a className="btn primary high large">Get started</a>
              </Link>
            </div>
          </div>
          <div className="position-relative d-none d-lg-block" style={{background: 'rgba(35, 31, 32, 0.03)', height: '440px', width: '440px', minHeight: '440px', minWidth: '440px', borderRadius:'320px'}}>
            <img src="/images/aaron-butler.jpg" style={{width: '120px', height: '120px', borderRadius:'100%', border: '4px solid white', boxShadow: '0 0 1px 0 rgba(35, 31, 32, 0.08), 0 6px 6px -1px rgba(35, 31, 32, 0.08)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute'}}></img>
            <div className="card py-4 pl-4" style={{position: 'absolute', top: '140px', left: '-64px', paddingRight: '120px', transform: 'scale(0.8)', border: '1px solid rgba(35, 31, 32, 0.08)'}}>
              <p className="large text-dark-high font-weight-semibold mb-0">Junior Product Designer</p>
              <p className="large mb-0">Activate</p>
              <p className="text-dark-low mb-0">London, United Kingdom</p>
              <p className="text-dark-low mb-0">April 2018 – October 2019</p>
            </div>
            <div className="card py-4 pl-4" style={{position: 'absolute', top: '300px', left: '-24px', transform: 'scale(0.8)', paddingRight: '96px', border: '1px solid rgba(35, 31, 32, 0.08)'}}>
              <p className="large text-dark-high font-weight-semibold mb-0">Industrial Design & Technology</p>
              <p className="large mb-0">Loughborough University</p>
              <p className="text-dark-low mb-0">2013 – 2017</p>
            </div>
          </div>
        </div>
        <div className={`text-center ${styles.sectionWrapper}`}>
          <h1 className="mx-auto pb-5" style={{ maxWidth: '640px' }}>Create your landing page in 2 minutes</h1>
          <div className={styles.stepsContainer}>
            <div className="d-flex flex-column align-items-center">
              <div className={styles.stepNumber}>
                <h3 className="text-light-high m-0">1</h3>
              </div>
              <h3 className="text-primary-high">Sync with LinkedIn</h3>
            </div>
            <div className="d-flex flex-column align-items-center">
              <div className={styles.stepNumber}>
                <h3 className="text-light-high m-0">2</h3>
              </div>
              <h3 className="text-primary-high">Choose information to display</h3>
            </div>
            <div className="d-flex flex-column align-items-center">
              <div className={styles.stepNumber}>
                <h3 className="text-light-high m-0">3</h3>
              </div>
              <h3 className="text-primary-high">Share your profile</h3>
            </div>
          </div>
        </div>
        <div className={`text-center ${styles.sectionWrapper}`}>
          <h1 className="mx-auto pb-5" style={{ maxWidth: '480px' }}>Stand out from the crowd</h1>
          <div className={styles.heroImageWrapper}>
            <Image
              src="/images/profile-preview.png"
              layout='fill'
            />
          </div>
        </div>
      </Container>
      <div className={`overflow-hidden ${styles.primaryBackground}`}>
        <Container className={styles.sectionWrapper}>
          <div className="text-center">
            <h1 className="text-light-high mx-auto mb-5 pb-5" style={{ maxWidth: '560px' }}>Why use Vitaely?</h1>
            <div className={styles.stepsContainer}>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.STAR} size='64' className="iconLightHigh" />
                <h3 className="text-light-high my-3">Stand out</h3>
                <h5 className="text-light-med">Get yourself noticed with a unique personal landing page.</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.NO_DATA_ENTRY} size='64' className="iconLightHigh" />
                <h3 className="text-light-high my-3">No data entry</h3>
                <h5 className="text-light-med">Syncing your information from your LinkedIn account.</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.FOCUS} size='64' className="iconLightHigh" />
                <h3 className="text-light-high my-3">No distractions</h3>
                <h5 className="text-light-med">It’s your profile. It’s no place for other people’s profiles.</h5>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <div className={`text-center ${styles.sectionWrapper}`}>
          <h1 className="mx-auto" style={{ maxWidth: "720px" }}>Start turning your CV into a landing page</h1>
          <p className="large mx-auto mb-5">Create your landing page in just 2 minutes</p>
          <div className="d-flex m-auto justify-content-center">
            <Link href="/users/register">
              <a className="btn primary high large m-auto">Get started</a>
            </Link>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  )
}

export default Home;