import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import fire from '../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../components/header/Header';
import Image from 'next/image'
import mixpanel from 'mixpanel-browser';
import { Accordion, Container, useAccordionToggle } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss'
import Icon from '../components/icon/Icon';
import ICONS from '../components/icon/IconPaths';
import Footer from '../components/Footer';
import PostCard from '../components/blog/PostCard';

const Home = () => {
  const ref = useRef(null)
  const heroRef = useRef(null)

  const [footerHeight, setFooterHeight] = useState(0)
  const [heroHeight, setHeroHeight] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [useCaseFeature, setUseCaseFeature] = useState(0)

  const [loggedIn, setLoggedIn] = useState(false);
  const [screenWidth, setScreenWidth] = useState('');
  // const [idList, setIdList] = useState("");
  const [profileUrl, setProfileUrl] = useState('');
  const [showNewStuff, setShowNewStuff] = useState(false);

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
    if (ref?.current?.clientHeight) {
      setFooterHeight(ref.current.clientHeight)
      setHeroHeight(heroRef.current.clientHeight)
    }
  };

  useEffect(() => {
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
    mixpanel.register_once({"home page": "original"});
    mixpanel.track('Landing page');
    setScreenWidth(window.innerWidth)
    if (ref?.current?.clientHeight) {
      setFooterHeight(ref.current.clientHeight)
      setHeroHeight(heroRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    // if (typeof window !== 'undefined') {
    //   document.getElementById('imageCarousel').style.left = `-${(window.scrollY + 640) / 2}px`
    // }
  }, []);

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      setScrollPosition(window.scrollY)

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

  const testData = [
    {
      name: 'Build trust',
      logo_url: '../../images/landing-page/photo-1664575198308-3959904fa430.jpeg',
      description: 'A personal branding site allows you to build trust with potential clients by providing them with a platform to learn more about you and view your portfolio. This transparency helps to establish trust and ultimately lead to more opportunities.',
      url: 'bbc.co.uk'
    },
    {
      name: 'Easy setup',
      logo_url: '../../images/landing-page/photo-1588064549181-755cf87668ab.jpeg',
      description: 'Setting up your personal site is easy and only takes two minutes, you can even use information from your LinkedIn profile to get you started. No coding skills required!',
      url: 'bbc.co.uk'
    },
  ]

  const CustomToggle = ({ eventKey }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setDropdownOpen(!dropdownOpen)
    });

    return (
      <button type="button" onClick={decoratedOnClick} className="btn dark low small icon-only">
        <svg viewBox="0 0 24 24">
          <path d={dropdownOpen ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}></path>
        </svg>
      </button>
    );
  }

  const useCases = [
    {
      id: uuidv4(),
      title: 'Land more in-bound sales calls',
      description: 'Set up your page to link to your calendar booking page',
    },
    {
      id: uuidv4(),
      title: 'Land more in-bound sales calls',
      description: 'Set up your page to link to your calendar booking page',
    },
    {
      id: uuidv4(),
      title: 'Land more in-bound sales calls',
      description: 'Set up your page to link to your calendar booking page',
    },
  ]

  const forwardUseCase = () => {
    if (useCaseFeature < useCases.length - 1) {
      let newUseCase = useCaseFeature;
      newUseCase++
      setUseCaseFeature(newUseCase)
    }
  }
  const backwardUseCase = () => {
    if (useCaseFeature > 0 ) {
      let newUseCase = useCaseFeature;
      newUseCase--
      setUseCaseFeature(newUseCase)
    }
  }

  return (
    <div style={{overflowX: 'hidden'}}>
      <Header hideShadow/>
      <div className={`${styles.fixedHeader} ${scrollPosition > heroHeight + 66 && styles.fixedHeaderScrolled}`}>
        <Header hideShadow={scrollPosition < heroHeight + 66} />
      </div>
      <Head>
        <title>ExpertPage | Build trust and sell more with your own professional site</title>
        <meta name="description" content="Create your very own professional website for freelancers, consultants and small business owners in just two minutes." />
        <meta property="og:title" content="ExpertPage | Build trust and sell more with your own professional site" />
        <meta property="og:description" content="Create your very own professional website for freelancers, consultants and small business owners in just two minutes." />
        <meta property="og:url" content="https://www.expertpage.io/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.expertpage.io"/>
      </Head>
      {/* <a className={styles.productHunt} href="https://www.producthunt.com/posts/ExpertPage-me?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-ExpertPage-me" target="_blank">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=291936&theme=light" alt="expertpage.io - Turn your LinkedIn Profile into a landing page | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" />
      </a> */}
      <div className="bg-light-900" style={{marginBottom: footerHeight, zIndex: '2', position: 'relative'}}>
        <Container className="py-5">
          <div ref={heroRef} className="d-flex flex-column align-items-center justify-content-between pt-5">
            <div style={{ maxWidth: '800px' }} className="d-flex flex-column align-items-center text-center">
              {screenWidth > 576 ? <h1  className="">Professional websites in two minutes</h1> : <h2 className="">Websites for freelancers and consultants</h2>}
              <p className="extra-large mb-4" style={{ maxWidth: '640px' }}>Build trust and sell more. Create your own website in two minutes. No tech skills required.</p>
              <div className="d-flex justify-content-center">
                <Link href="/users/register">
                  <a className="btn primary high">Create my page</a>
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
        <div className={`d-flex flex-column text-center align-items-center border-solid border-0 border-bottom-1 border-dark-300 ${styles.gradientSection}`} style={{ overflow: 'visible'}}>
          <Container>
            <div className="w-100">
              <div className="d-block position-relative w-100">
                <div className="d-flex flex-column w-100 gap-3">
                  <div className="d-block position-relative px-lg-5">
                    <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage}`} style={{ backgroundImage: `url(../../images/landing-page/profile-preview-landing.png)`, boxShadow: 'none', borderRadius: 0 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
        <Container>
          {/* <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
            <div className={`d-flex flex-column flex-lg-row align-items-center gap-5`}>
              <div className="mb-4 w-100">
                <a target="_blank" className="d-block position-relative w-100">
                  <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                    <div className={`w-100 position-relative overflow-hidden ${styles.sectionImage}`} style={{ backgroundImage: `url(../../images/landing-page/photo-1664575198308-3959904fa430.jpeg)` }}>
                    </div>
                  </div>
                </a>
              </div>
              <div className="w-100">
                <h2 className="mb-3 ">Build trust</h2>
                <p className="large mb-0">A personal branding site allows you to build trust with potential clients by providing them with a platform to learn more about you and view your portfolio. This transparency can help establish trust and ultimately lead to more opportunities.</p>
                <Link href="/users/register">
                  <a className="btn primary high medium mt-5">Create my page</a>
                </Link>
              </div>
            </div>
           
          </div>
          <div style={{paddingBottom: '120px'}}>
            <div className={`d-flex flex-column flex-lg-row align-items-center gap-5`}>
              <div className="w-100 order-1 order-lg-0">
                <h2 className="mb-3 ">Easy setup</h2>
                <p className="large mb-0">Setting up your personal freelance site is easy and only takes two minutes using your LinkedIn profile. No coding skills required!</p>
                <Link href="/users/register">
                  <a className="btn primary high medium mt-5">Create my page</a>
                </Link>
              </div>
              <div className="mb-4 w-100 order-0 order-lg-1">
                <a target="_blank" className="d-block position-relative w-100">
                  <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                    <div className={`w-100 position-relative overflow-hidden ${styles.sectionImage}`} style={{ backgroundImage: `url(../../images/landing-page/photo-1588064549181-755cf87668ab.jpeg)` }}>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div> */}
          <div className="d-flex flex-column align-items-start" style={{paddingTop: '120px', paddingBottom: '120px'}}>
            <h2 className="mb-5 pb-3" style={{maxWidth: '560px'}}>Show the world what you have to offer</h2>
            <div className={`${styles.layoutGrid}`}>
              <p className="large mb-0">ExpertPage allows you to build a website to learn more about you and your products and services, without the need to know how to code or any technical skills.</p>
              <p className="large mb-0">Setting up your personal site is easy and only takes two minutes, you can even use information from your LinkedIn profile to get you started.</p>
            </div>
            <Link href="/users/register">
              <a className="btn primary high medium mt-5">Create my page</a>
            </Link>
          </div>
        </Container> 
        {/* <div className="bg-light-900">
          <div className="bg-primary-100">
            <div className={`container ${styles.sectionWrapper}`}>
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
            </div>
          </div>
        </div> */}
        {/* <div className="bg-light-900">
          <div className="">
            <div className={`container ${styles.sectionWrapper} d-flex flex-lg-row flex-column justify-content-between gap-3 gap-lg-5`}>
              <div>
                <h2 className="text-left mb-5 w-100" style={{ minWidth: '320px', maxWidth: '320px' }}>Use cases</h2>
                <div className="d-flex flex-row gap-3">
                  <button role="button" onClick={backwardUseCase} className="btn dark medium icon-only">
                    <svg viewBox="0 0 24 24">
                      <path d={ICONS.ARROW_LEFT}></path>
                    </svg>
                  </button>
                  <button role="button" onClick={forwardUseCase} className="btn dark medium icon-only">
                    <svg viewBox="0 0 24 24">
                      <path d={ICONS.ARROW_RIGHT}></path>
                    </svg>
                  </button>
                </div>
                {useCaseFeature}
              </div>
              <div className="position-relative w-100" style={{height: '560px'}}>
                <div className="d-flex flex-row gap-3 position-absolute" style={{left: 0, width: 'max-content'}}>
                  {useCases.map((useCase, index) => {
                    return (
                      <div key={index} className={`d-flex flex-column justify-content-between bg-primary-300 radius-4 p-5 w-100 ${styles.useCaseCard} ${useCaseFeature > index && styles.useCaseCardHide}`} style={{maxWidth: '440px', height: '560px'}}>
                        <div>
                          <h3>{useCase.title}</h3>
                          <p className="mb-0 extra-large text-dark-high font-weight-medium">{useCase.description}</p>
                        </div>
                        <Link href="/users/register">
                          <a className="btn primary high mt-5">Create my page</a>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="d-block position-relative w-100 p-0">
          <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage}`} style={{ backgroundImage: `url(../../images/landing-page/thisisengineering-raeng-TXxiFuQLBKQ-unsplash.jpg)`, borderRadius: 0, boxShadow: 'none' }}>
            <a href="https://unsplash.com/@thisisengineering" target="_blank" className={`${styles.sectionImageTag}`} style={{bottom: 16, left: 16, zIndex: 1}}>
              <div className="tag small light high icon-left">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PHOTO}></path>
                </svg>
                ThisisEngineering RAEng
              </div>
            </a>
          </div>
        </div>
        <div className="bg-light-900">
          <div className="bg-primary-100">
            <div className={`container ${styles.sectionWrapper} d-flex flex-lg-row flex-column justify-content-between gap-3 gap-lg-5`}>
              <h2 className="text-left mb-5 " style={{ maxWidth: '560px' }}>Got a question?</h2>
              <Accordion style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
              <div className={`d-flex flex-column gap-4 w-100 ${styles.accordionWrapper}`}>
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row align-items-center justify-content-between w-100">
                    <p className="mb-0 extra-large text-dark-high font-weight-medium">How much does it cost?</p>
                    <CustomToggle eventKey="0">Click me!</CustomToggle>
                  </div>
                  <Accordion.Collapse eventKey="0">
                    <p className="mt-3 mb-0 large">It's free to create your ExpertPage site! In the future, we plan to offer a paid plan that will allow you to connect your own domain.</p>
                  </Accordion.Collapse>
                  <hr className="mb-0 w-100"></hr>
                </div>
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row align-items-center justify-content-between w-100">
                    <p className="mb-0 extra-large text-dark-high font-weight-medium">Who is this for?</p>
                    <CustomToggle eventKey="1">Click me!</CustomToggle>
                  </div>
                  <Accordion.Collapse eventKey="1">
                    <p className="mt-3 mb-0 large">Freelancers, consultants, small business owners, or anyone who wants to build a website to show off their products, services and customer testimonials but doesn't have the time or technical skills to build it on their own.</p>
                  </Accordion.Collapse>      
                  <hr className="mb-0 w-100"></hr>          
                </div>
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row align-items-center justify-content-between w-100">
                    <p className="mb-0 extra-large text-dark-high font-weight-medium">What makes this different?</p>
                    <CustomToggle eventKey="2">Click me!</CustomToggle>
                  </div>
                  <Accordion.Collapse eventKey="2">
                    <>
                      <p className="mt-3 large">Your ExpertPage site is optimised to promote you and your services, and make it easy for potential clients and customers to take the next step. Save time on wondering how you should style your page and make use of our template designed just for freelancers, consultants and small business owners.</p> 
                      <p className="mb-0 large">You can create your site in under two minutes, making this the fastest way to get your page up and running.</p>
                    </>
                  </Accordion.Collapse>      
                  <hr className="mb-0 w-100"></hr>                 
                </div>
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row align-items-center justify-content-between w-100">
                    <p className="mb-0 extra-large text-dark-high font-weight-medium">Why not use Wix or Squarespace?</p>
                    <CustomToggle eventKey="3">Click me!</CustomToggle>
                  </div>
                  <Accordion.Collapse eventKey="3">
                    <p className="mt-3 mb-0 large">We are only focused on helping you build your Personal Branding website. Meaning that the experience and speed are optimized for that purpose. If you want to ecommerce this won't be the right tool for you, but if you want to build your own personal website, this will be the fastest website you have ever built.</p>
                  </Accordion.Collapse>             
                </div>
              </div>
              </Accordion>
            </div>
          </div>
        </div>
        <Container>
          {/* <div className="d-flex flex-column align-items-start" style={{paddingTop: '120px', paddingBottom: '120px'}}>
            <h2 className="mb-5 pb-3" style={{maxWidth: '560px'}}>Start building trust in just a few minutes</h2>
            <div className={`${styles.layoutGrid}`}>
              <div className="d-flex flex-column gap-5">
                <div className="d-block position-relative p-0">
                  <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage}`} style={{ backgroundImage: `url(https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80)` }}></div>
                </div>
                <p className="large mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
              <div className="d-flex flex-column gap-5">
                <div className="d-block position-relative p-0">
                  <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage}`} style={{ backgroundImage: `url(https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80)` }}></div>
                </div>
                <p className="large mb-0">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              </div>
            </div>
            <Link href="/users/register">
              <a className="btn primary high medium mt-5">Create my page</a>
            </Link>
          </div> */}
          <div className="d-flex flex-column align-items-start" style={{paddingTop: '120px', paddingBottom: '120px'}}>
            <h2 className="mb-5 pb-3" style={{maxWidth: '560px'}}>Build trust with potential clients</h2>
            <div className={`${styles.layoutGrid}`}>
              <p className="large mb-0">Your customers are your best proof of the quality of service that you deliver. With ExpertPage you can add customer testimonials to help build trust with potential clients and land more sales. </p>
              <p className="large mb-0">Written excellent content that you think potential clients would love to read? You can feature your best content on your ExpertPage site and and add links for readers to explore the full thing. </p>
            </div>
            <Link href="/users/register">
              <a className="btn primary high medium mt-5">Create my page</a>
            </Link>
            <div className="d-none d-lg-block mb-4 w-100 mt-5 pt-5">
              <div className="d-block position-relative w-100">
                <div className="d-flex flex-column flex-lg-row w-100 gap-3">
                  <div className="d-block position-relative col-12 col-lg-3 p-0">
                    <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage} ${styles.sectionImageVerticle}`} style={{ backgroundImage: `url(../../images/landing-page/good-faces-BWMxkGvbd_Y-unsplash.jpg)` }}>
                      <a href="https://unsplash.com/@goodfacesagency" target="_blank" className={`${styles.sectionImageTag}`} style={{bottom: 16, left: 16, zIndex: 1}}>
                        <div className="tag small light high icon-left">
                          <svg viewBox="0 0 24 24">
                            <path d={ICONS.PHOTO}></path>
                          </svg>
                          Good Faces
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="d-block position-relative col-12 col-lg-5 p-0">
                    <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage} ${styles.sectionImageVerticle}`} style={{ backgroundImage: `url(../../images/landing-page/good-faces-J1r-0xdoEZY-unsplash.jpg)` }}>
                      <a href="https://unsplash.com/@goodfacesagency" target="_blank" className={`${styles.sectionImageTag}`} style={{bottom: 16, left: 16, zIndex: 1}}>
                        <div className="tag small light high icon-left">
                          <svg viewBox="0 0 24 24">
                            <path d={ICONS.PHOTO}></path>
                          </svg>
                          Good Faces
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex flex-column col-12 col-lg-3 p-0 gap-4" style={{marginTop: '-64px'}} >
                    {/* <div className="d-block position-relative">
                      <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage}`} style={{ backgroundImage: `url(../../images/landing-page/surface-8HPLpr3hebU-unsplash.jpg)` }}>
                        <a href="https://unsplash.com/@surface" className={`${styles.sectionImageTag}`} style={{bottom: 16, left: 16, zIndex: 1}}>
                          <div className="tag light high icon-left">
                            <svg viewBox="0 0 24 24">
                              <path d={ICONS.PHOTO}></path>
                            </svg>
                            Surface
                          </div>
                        </a>
                      </div>
                    </div> */}
                    <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage} ${styles.sectionImageVerticle}`} style={{ backgroundImage: `url(../../images/landing-page/good-faces-knoww5xIlWc-unsplash.jpg)`}}>
                      <a href="https://unsplash.com/@goodfacesagency" target="_blank" className={`${styles.sectionImageTag}`} style={{bottom: 16, left: 16, zIndex: 1}}>
                        <div className="tag small light high icon-left">
                          <svg viewBox="0 0 24 24">
                            <path d={ICONS.PHOTO}></path>
                          </svg>
                          Good Faces
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div style={{paddingTop: '120px', paddingBottom: '120px'}}>
            <h2 className="mb-5 pb-3" style={{maxWidth: '560px'}}>Start building trust in just a few minutes</h2>
            <div className={`${styles.layoutGrid}`}>
                {testData.map((data, index) => {
                  const [descriptionShowMore, setDescriptionShowMore] = useState(false);
                  return (
                    <div key={index} className={`d-flex flex-column align-items-start`}>
                      {data.logo_url ?
                        <div className="mb-4 w-100">
                          <a target="_blank" href={data.url} className="d-block position-relative w-100">
                            <div className="d-flex flex-column w-100" style={{ gap: '16px' }}>
                              <div className={`w-100 position-relative overflow-hidden ${styles.sectionImage}`} style={{ backgroundImage: `url(${data.logo_url ? data.logo_url : null})` }}>
                              </div>
                            </div>
                          </a>
                        </div>
                        : null
                      }
                      <div className="w-100">
                        <h4 className="mb-3">{data.name}</h4>
                        {data.description ? <p className="large mb-0">{data.description}</p> : null}
                      </div>
                    </div>
                  )
                })}
            </div>
            <Link href="/users/register">
              <a className="btn primary high medium mt-5">Create my page</a>
            </Link>
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
          <div className={`d-flex flex-column align-items-center text-center mx-auto gap-4 ${styles.sectionWrapper}`} style={{ maxWidth: '720px', paddingBottom: '160px' }}>
            {screenWidth > 576 ? <h1 className="">Build your brand today with ExpertPage</h1> : <h2 className="">Build your brand today with ExpertPage</h2>}
            {/* <p className="large mb-4" style={{ maxWidth: '640px' }}>It takes two minutes!</p> */}
            <div className="d-flex m-auto justify-content-center">
              <Link href="/users/register">
                <a className="btn primary high large m-auto">Create my page</a>
              </Link>
            </div>
          </div>
        </Container>
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