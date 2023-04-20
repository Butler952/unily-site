import { useEffect, useState, useRef } from 'react';
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
  const ref = useRef(null)

  const [footerHeight, setFooterHeight] = useState(0)

  const [loggedIn, setLoggedIn] = useState(false);
  const [screenWidth, setScreenWidth] = useState('');
  // const [idList, setIdList] = useState("");
  const [profileUrl, setProfileUrl] = useState('');
  const [showNewStuff, setShowNewStuff] = useState(false);

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
    setFooterHeight(ref.current.clientHeight)
  };

  useEffect(() => {
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
    mixpanel.register_once({"home page": "original"});
    mixpanel.track('Landing page');
    setScreenWidth(window.innerWidth)
    setFooterHeight(ref.current.clientHeight)
    window.addEventListener('resize', handleResize);
    // window.addEventListener('scroll', handleScroll);
    // if (typeof window !== 'undefined') {
    //   document.getElementById('imageCarousel').style.left = `-${(window.scrollY + 640) / 2}px`
    // }
  }, []);

  const handleScroll = () => {
    if (typeof window !== 'undefined') {

      document.getElementById('imageCarousel') !== null ? document.getElementById('imageCarousel').style.left = `-${(window.scrollY + 640) / 2}px` : null

      // window.scrollY
      // window.innerWidth
      // carousel.offsetWidth
    }
  }

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
    <div className="overflow-hidden">
      <Header hideShadow />
      <Head>
        <title>ExpertPage | Build trust with your own personal freelance site</title>
        <meta name="description" content="Use your LinkedIn profile to create your very own professional website in just two minutes." />
        <meta property="og:title" content="ExpertPage | Build trust with your own personal freelance site" />
        <meta property="og:description" content="Use your LinkedIn profile to create your very own professional website in just two minutes." />
        <meta property="og:url" content="https://www.expertpage.io/" />
        <meta property="og:type" content="website" />
      </Head>
      {/* <a className={styles.productHunt} href="https://www.producthunt.com/posts/ExpertPage-me?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-ExpertPage-me" target="_blank">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=291936&theme=light" alt="expertpage.io - Turn your LinkedIn Profile into a landing page | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" />
      </a> */}
      <div className="bg-light-900" style={{marginBottom: footerHeight, zIndex: '2', position: 'relative'}}>
        <br></br>
        <br></br>
        <Container className="py-5">
          <div className="d-flex flex-column align-items-center justify-content-between">
            <div style={{ maxWidth: '720px' }} className="d-flex flex-column align-items-center pb-5 text-center">
              {screenWidth > 576 ? <h1>Build trust with your own personal freelance site</h1> : <h2>Build trust with your own personal freelance site</h2>}
              <p className="large mb-4" style={{ maxWidth: '640px' }}>Use your LinkedIn profile to create your very own professional website in just two minutes.</p>
              <div className="d-flex justify-content-center m-auto">
                <Link href="/users/register">
                  <a className="btn primary high large">Create my page</a>
                </Link>
              </div>
            </div>
            {/* <div className={styles.iframeWrapper}>
              <iframe className={styles.iframeContent}
                title="Example expertpage.io online CV profile"
                src="https://www.expertpage.io/aaronbutler">
              </iframe>
            </div> */}
          </div>
        </Container> 
        <br></br>
      </div>
      {/* <div className={`${styles.imageCarouselWrapper}`}>
        <div id="imageCarousel" className={`d-flex flex-row ${styles.imageCarousel}`} style={{gap: '24px'}}>
          <img src="/images/landing-page/template-previews/bento-template.png"></img>
          <img src="/images/landing-page/template-previews/staccato-template.png"></img>
          <img src="/images/landing-page/template-previews/original-desktop-preview.png"></img>
          <img src="/images/landing-page/template-previews/metro-night-preview.png"></img>
          <img src="/images/landing-page/template-previews/metro-template.png"></img>
        </div> 
      </div>*/}

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
      {/* <div className={`overflow-hidden ${styles.primaryBackground}`}>
        <Container className={styles.sectionWrapper}>
          <div className="text-center">
            { screenWidth > 576 ? <h1 className="text-light-high mx-auto mb-5 pb-5" style={{ maxWidth: '560px' }}>Why use ExpertPage?</h1> : <h2 className="text-light-high mx-auto mb-5 pb-5">Why use ExpertPage?</h2> }    
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
      </div> */}
      {/* <Container> */}
      {/* <div className={`text-center ${styles.sectionWrapper}`}>
        <div className={styles.stepsContainer}>
          <div className="d-flex flex-column align-items-center">
            <h2 className="mb-3">917+</h2>
            <h5>Professional profiles created</h5>
          </div>
          <div className="d-flex flex-column align-items-center">
            <h2 className="mb-3">150+</h2>
            <h5>Upvotes on Product Hunt</h5>
          </div>
          <div className="d-flex flex-column align-items-center">
            <h2 className="mb-3">6+</h2>
            <h5>Templates to choose from </h5>
          </div>
        </div>
      </div> */}
      {/* <div className={`text-center ${styles.sectionWrapper}`}>
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
        </div> */}
        {/* <div className={`container ${styles.sectionWrapper}`}>
          <div className="d-flex flex-column" style={{gap: '24px'}}>
            <div className={`${styles.featureCard}`} style={{background: '#FBFBF8'}}>
              <div className="w-100 order-1 order-lg-1">
                {screenWidth > 576 ? <h2>Show off your best work</h2> : <h3>Show off your best work</h3>}
                <p className="large">Choose the information from your Linkedin profile that you want to display on your resume.</p>
              </div>
              <div className="w-100 order-0 order-lg-1">
                <img className="w-100" src="/images/landing-page/project-highlight.png" style={{mixBlendMode: 'darken'}}></img>
              </div>
            </div>
            <div className={`${styles.featureCard}`} style={{background: '#FBFBF8'}}>
              <div className="w-100 order-1 order-lg-1">
                {screenWidth > 576 ? <h2>Links to your best content</h2> : <h3>Links to your best content</h3>}
                <p className="large">Choose the information from your Linkedin profile that you want to display on your resume.</p>
              </div>
              <div className="w-100 order-0 order-lg-1">
                <img className="w-100" src="/images/landing-page/links-highlight.png" style={{mixBlendMode: 'darken'}}></img>
              </div>
            </div>
            <div className={`align-items-end ${styles.featureCard}`} style={{background: '#FBFBF8'}}>
              <div className="w-100 order-1 order-lg-1">
                {screenWidth > 576 ? <h2>Sync your data from Linkedin</h2> : <h3>Sync your data from Linkedin</h3>}
                <p className="large">Choose the information from your Linkedin profile that you want to display on your resume.</p>
              </div>
              <div className="w-100 order-0 order-lg-1">
                <img className="w-100" src="/images/landing-page/sync-highlight.png"></img>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className={`container ${styles.sectionWrapper}`}>
          <h2 className="text-left mb-5" style={{ maxWidth: '560px' }}>Learn how to land your dream role</h2>
          <div className="d-flex flex-column flex-lg-row" style={{gap: '24px'}}>
            <Link href="/blog/four-things-to-research-about-a-company-before-an-interview">
              <a style={{textDecoration: 'none'}}>
                <div className={`${styles.postCard}`} style={{background: '#FBFBF8'}}>
                  <div className="w-100 order-1 order-lg-1">
                    {screenWidth > 576 ? <h4>How to ace recorded interviews</h4> : <h4>How to ace recorded interviews</h4>}
                    <p className="large text-dark-med">Recorded interviews are much like a phone or online video interview, except at no point in a recorded interview will you...</p>
                    <div className="d-flex flex-row align-items-center p-0" style={{gap: '8px'}}>
                      <p className="mb-0">Read more</p>
                      <Icon icon={ICONS.ARROW_RIGHT_STACCATO} size='24' className="fill-dark-900" />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
            <Link href="/blog/how-to-ace-recorded-interviews">
              <a style={{textDecoration: 'none'}}>
                <div className={`${styles.postCard}`} style={{background: '#FBFBF8'}}>
                  <div className="w-100 order-1 order-lg-1">
                    {screenWidth > 576 ? <h4>Four things to research about a company before an interview</h4> : <h4>Four things to research about a company before an interview</h4>}
                    <p className="large text-dark-med">When it comes to interviewing for a role, it pays to be prepared. We’ve already talked about what to do if you have to...</p>
                    <div className="d-flex flex-row align-items-center p-0" style={{gap: '8px'}}>
                      <p className="mb-0">Read more</p>
                      <Icon icon={ICONS.ARROW_RIGHT_STACCATO} size='24' className="fill-dark-900" />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
            <Link href="/blog/four-things-to-research-about-a-company-before-an-interview">
              <a style={{textDecoration: 'none'}}>
                <div className={`align-items-end ${styles.postCard}`} style={{background: '#FBFBF8'}}>
                  <div className="w-100 order-1 order-lg-1">
                    {screenWidth > 576 ? <h4>What to send in a follow up email after an interview</h4> : <h4>What to send in a follow up email after an interview</h4>}
                    <p className="large text-dark-med">So you just nailed the interview. You’re now enjoying a well-earned coffee. Your future is now in the hands of fate. All...</p>
                    <div className="d-flex flex-row align-items-center p-0" style={{gap: '8px'}}>
                      <p className="mb-0">Read more</p>
                      <Icon icon={ICONS.ARROW_RIGHT_STACCATO} size='24' className="fill-dark-900" />
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div> */}
        {/* <div className={`container ${styles.sectionWrapper}`}>
          <h2 className="text-left mb-5" style={{ maxWidth: '560px' }}>Learn how to land your dream role</h2>
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
        </div> */}
        {/* <div className={`text-center mx-auto ${styles.sectionWrapper}`} style={{ maxWidth: '720px' }}>
          {screenWidth > 576 ? <h1>Turn your Linkedin profile into a website</h1> : <h2>Turn your Linkedin profile into a website</h2>}
          <p className="large mx-auto mb-5" style={{ maxWidth: '640px' }}>Create your very own professional website in just two minutes</p>
          <div className="d-flex m-auto justify-content-center">
            <Link href="/users/register">
              <a className="btn primary high large m-auto">Get started</a>
            </Link>
          </div>
        </div> */}
      {/* </Container> */}
      <div ref={ref} className="w-100" style={{zIndex: '1', position: 'fixed', bottom: 0}}>
        <Footer />
      </div>
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