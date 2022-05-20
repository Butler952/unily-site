import fire from '../../config/fire-config';
import Link from 'next/link'
import { Container } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loader.json'


const Router = () => {

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const router = useRouter()

  useEffect(() => {
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          loggedInRoute(user)
        } 
        // else {
        //   router.push("/")
        // }
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
        if (doc.data().stage !== 'complete') {
          router.push(doc.data().stage)
        } else {
          router.push(doc.data().profileUrl)
        }
      } else {
        // if there is no user document
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    })
  }

  return (
    <div>
      <Head>
        <title>Routing | Vitaely</title>
      </Head>
      {/* <Head>
        <title>{localProfile.full_name} | {localProfile.headline}</title>
        { localProfile.summary ? <meta name="description" content={localProfile.summary} /> : null }
        { localProfile.full_name ? <meta name="author" content={localProfile.full_name} /> : null }
        <meta property="og:title" content={`${localProfile.full_name} | ${localProfile.headline}`} />
        { localProfile.summary ? <meta property="og:description" content={localProfile.summary} /> : null }
        <meta property="og:url" content={`https://www.vitaely.me/profile/${localProfile.pageId}`} />
        { localProfile.background_cover_image_url ? <meta property="og:image" content={localProfile.background_cover_image_url} /> : null }
        <meta property="og:type" content="website" />
      </Head> */}
      <Container>
        <div className="bg-light-900 position-fixed w-100 h-100" style={{top: 0, left: 0, zIndex: 101}}>
          <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
          <Lottie options={defaultOptions} height={160} width={160} />
            {/* <p>Redirecting to Stripe checkout</p> */}
          </div> 
        </div>
      </Container>
    </div >
  )
}

export default Router;