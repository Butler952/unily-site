import { useEffect, useState } from 'react';
import Head from 'next/head';
import fire from '../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../components/header/Header';
import { Container } from 'react-bootstrap';
import Image from 'next/image'
import mixpanel from 'mixpanel-browser';

import styles from './index.module.scss'
import Icon from '../components/icon/Icon';
import ICONS from '../components/icon/IconPaths';
import Footer from '../components/Footer';
import PostCard from '../components/blog/PostCard';

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screenWidth, setScreenWidth] = useState('');
  // const [idList, setIdList] = useState("");
  const [profileUrl, setProfileUrl] = useState('');
  const [showNewStuff, setShowNewStuff] = useState(false);

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
    mixpanel.register_once({"home page": "original"});
    mixpanel.track('Landing page');
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);

  const router = useRouter();

  fire.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true)
        // loggedInRoute(user)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Sent');
  }

  const onUrlInvalid = () => {
    alert('Please enter a valid LinkedIn URL')
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

  const getProfileList = () => {
    let tempIdList = []
    fire.firestore().collection('users').where("stage", "==", "complete").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tempIdList.push(doc.id);
      })
    })
    // .then(() => {
    //   setIdList(tempIdList)
    // })
    .then(() => {
      console.log(tempIdList)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const getProfileListTwo = () => {
    fetch("/api/getProfileList")
      .then(res => console.log(res))
      .then(data => console.log(data))
  }

  // useEffect(() => {
  //     getProfileList()
  //   //.then(console.log(idList))
  // }, []);

  return (
    <div className="overflow-hidden" style={{ background: 'white' }}>
      <Header hideShadow />
      <Head>
        <title>Vitaely | Turn your LinkedIn profile into a landing page</title>
        <meta name="description" content="Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page." />
        <meta property="og:title" content="Vitaely | Turn your LinkedIn profile into a landing page" />
        <meta property="og:description" content="Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page." />
        <meta property="og:url" content="https://www.vitaely.me/" />
        <meta property="og:type" content="website" />
      </Head>
      <a className={styles.productHunt} href="https://www.producthunt.com/posts/vitaely-me?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-vitaely-me" target="_blank">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=291936&theme=light" alt="Vitaely.me - Turn your LinkedIn Profile into a landing page | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" />
      </a>
      <Container className="mt-5 py-5">
        <div className="d-flex flex-column align-items-center justify-content-between">
          <div style={{ maxWidth: '640px' }} className="mb-5 pb-5 text-center">
            {screenWidth > 576 ? <h1>Turn your resume into a landing page</h1> : <h2>Turn your resume into a landing page</h2>}
            <p className="large mb-4">Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page.</p>
            <div className="d-flex justify-content-center m-auto">
              <Link href="/users/register">
                <a className="btn primary high large">Get started</a>
              </Link>
            </div>
          </div>
          {/* <div className={styles.iframeWrapper}>
            <iframe className={styles.iframeContent}
              title="Example Vitaely.me online CV profile"
              src="https://www.vitaely.me/aaronbutler">
            </iframe>
          </div> */}
        </div>
        
        {/* <div className={`text-center ${styles.sectionWrapper}`}>
          { screenWidth > 576 ? <h1 className="mx-auto pb-5" style={{ maxWidth: '480px' }}>Stand out from the crowd</h1> : <h2 className="mx-auto pb-5">Stand out from the crowd</h2> }    
          <div className={styles.heroImageWrapper}>
            <Image
              src="/images/profile-preview.png"
              layout='fill'
              objectFit='cover'
            />
          </div>
        </div> */}
        </Container> 
        <div className={`overflow-hidden ${styles.primaryBackground}`}>
        <Container className={styles.sectionWrapper}>
          <div className="text-center">
          {/*{ idList ?? <p>{idList}</p> }*/}
            { screenWidth > 576 ? <h1 className="text-light-high mx-auto mb-5 pb-5" style={{ maxWidth: '560px' }}>Why use Vitaely?</h1> : <h2 className="text-light-high mx-auto mb-5 pb-5">Why use Vitaely?</h2> }    
            <div className={styles.stepsContainer}>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.STAR} size='64' className="fill-light-900" />
                <h3 className="text-light-high my-3">Stand out</h3>
                <h5 className="text-light-med">Get yourself noticed with a unique personal landing page.</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.FEEDBACK} size='64' className="fill-light-900" />
                <h3 className="text-light-high my-3">No data entry</h3>
                <h5 className="text-light-med">Syncing your information from your LinkedIn account.</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.FOCUS} size='64' className="fill-light-900" />
                <h3 className="text-light-high my-3">No distractions</h3>
                <h5 className="text-light-med">It’s your profile. It’s no place for other people’s profiles.</h5>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container>
      <div className={`text-center ${styles.sectionWrapper}`}>
        { screenWidth > 576 ? <h2 className="mx-auto pb-5" style={{ maxWidth: '560px' }}>Create your landing page in 2 minutes</h2> : <h2 className="mx-auto pb-5">Create your landing page in 2 minutes</h2> }    
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
        <div className={`container ${styles.sectionWrapper}`}>
          <h2 className="mx-auto text-center mb-5" style={{ maxWidth: '560px' }}>Learn how to land your dream role</h2>
          <div className="d-flex flex-column" style={{gap: '24px'}}>
            <PostCard 
              image='/images/blog/how-to-ace-recorded-interviews/how-to-ace-recorded-interviews.jpg'
              title="How to ace recorded interviews"
              duration="2"
              bodyPreview="Recorded interviews are much like a phone or online video interview, except at no point in a recorded interview will you..."
              postUrl="/blog/how-to-ace-recorded-interviews"
              screenWidth={screenWidth}
            />
            <PostCard 
              image='/images/blog/four-things-to-research-about-a-company-before-an-interview/four-things-to-research-about-a-company-before-an-interview.jpg'
              title="Four things to research about a company before an interview"
              duration="2"
              bodyPreview="When it comes to interviewing for a role, it pays to be prepared. We’ve already talked about what to do if you have to..."
              postUrl="/blog/four-things-to-research-about-a-company-before-an-interview"
              screenWidth={screenWidth}
            />
            <PostCard 
              image='/images/blog/what-to-send-in-a-follow-up-email-after-an-interview/what-to-send-in-a-follow-up-email-after-an-interview.jpg'
              title="What to send in a follow up email after an interview"
              duration="2"
              bodyPreview="So you just nailed the interview. You’re now enjoying a well-earned coffee. Your future is now in the hands of fate. All..."
              postUrl="/blog/what-to-send-in-a-follow-up-email-after-an-interview"
              screenWidth={screenWidth}
            />
          </div>
        </div>
        <div className={`text-center ${styles.sectionWrapper}`}>
          { screenWidth > 576 ? <h1 className="mx-auto" style={{ maxWidth: "720px" }}>Start turning your CV into a landing page</h1> : <h2 className="mx-auto">Start turning your CV into a landing page</h2> }    
          <p className="large mx-auto mb-5">Create your landing page in just 2 minutes</p>
          <div className="d-flex m-auto justify-content-center">
            <Link href="/users/register">
              <a className="btn primary high large m-auto">Get started</a>
            </Link>
          </div>
        </div>
      </Container>
      <Footer />
      <br/><br/>
    </div>
  )
}

// export const getServerSideProps = async ({ bucket }) => {
//   const buckets = LANDING_BUCKETS.filter((bucket) => bucket !== 'original')

//   return {
//     props: {
//       paths: buckets.map((bucket) => ({ params: { bucket } })),
//       fallback: false,
//     }
//   }
// }

export default Home;