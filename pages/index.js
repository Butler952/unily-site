import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/header/Header';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import { Accordion, Container, useAccordionToggle } from 'react-bootstrap';

import styles from './index.module.scss'
import ICONS from '../components/icon/IconPaths';
import Footer from '../components/Footer';

const Home = (props) => {

  const ref = useRef(null)
  const heroRef = useRef(null)

  const [screenWidth, setScreenWidth] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0)

  const [heroHeight, setHeroHeight] = useState(0)
  const [footerHeight, setFooterHeight] = useState(0)

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Landing page');
    setScreenWidth(window.innerWidth)
    if (ref?.current?.clientHeight) {
      setFooterHeight(ref.current.clientHeight)
      setHeroHeight(heroRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
  }, []);

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
    if (ref?.current?.clientHeight) {
      setFooterHeight(ref.current.clientHeight)
      setHeroHeight(heroRef.current.clientHeight)
    }
  };

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      setScrollPosition(window.scrollY)
    }
  }

  const CustomToggle = ({ question, eventKey }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setDropdownOpen(!dropdownOpen)
    });

    return (
      <div type="button" onClick={decoratedOnClick}  className="d-flex flex-row align-items-center justify-content-between w-100" style={{border: 'none', background: 'none'}}>
        <p className="mb-0 extra-large text-dark-high font-weight-medium w-100">{question}</p>
        <button className="btn dark low small icon-only">
          <svg viewBox="0 0 24 24">
            <path d={dropdownOpen ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}></path>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>ExpertPage | Build trust and sell more with your own professional site</title>
        <meta name="description" content="Create your very own professional website for freelancers, consultants and small business owners in just two minutes." />
        <meta property="og:title" content="ExpertPage | Build trust and sell more with your own professional site" />
        <meta property="og:description" content="Create your very own professional website for freelancers, consultants and small business owners in just two minutes." />
        <meta property="og:url" content="https://www.expertpage.io/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.expertpage.io"/>
      </Head>
      <Header hideShadow/>
      <div className={`${styles.fixedHeader} ${scrollPosition > heroHeight + 66 && styles.fixedHeaderScrolled}`}>
        <Header hideShadow={scrollPosition < heroHeight + 66} />
      </div>
      {/* <div className="bg-light-900" style={{paddingTop: 80, marginBottom: footerHeight, zIndex: '2', position: 'relative'}}>
        <div className="container py-5">
          <div>
            <div className="my-4 my-sm-5">
              {screenWidth > 767 ?
                <h1 className="mx-auto mb-2 mb-sm-3">{screenWidth}</h1>
                :
                <h2 className="mx-auto mb-2 mb-sm-3">{screenWidth}</h2>
              }
            </div>
          </div>
        </div>
      </div> */}
      <div className="bg-light-900" style={{marginBottom: footerHeight, zIndex: '2', position: 'relative'}}>
        <Container className="py-5">
          <div ref={heroRef} className="d-flex flex-column align-items-center justify-content-between pt-5">
            <div style={{ maxWidth: '800px' }} className="d-flex flex-column align-items-center text-center">
              {screenWidth > 576 ? <h1  className="">Professional websites in two minutes</h1> : <h2 className="">Websites for freelancers and consultants</h2>}
              <p className="extra-large mb-4" style={{ maxWidth: '640px' }}>Build trust and sell more. Create your own website in two minutes. No tech skills required.</p>
              <div className="d-flex justify-content-center">
                <Link href="/users/register" className="btn primary high">Create my page</Link>
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
          <div className="d-flex flex-column align-items-start" style={{paddingTop: '120px', paddingBottom: '120px'}}>
            <h2 className="mb-5 pb-3" style={{maxWidth: '560px'}}>Show the world what you have to offer</h2>
            <div className={`${styles.layoutGrid}`}>
              <p className="large mb-0">ExpertPage allows you to build a website to learn more about you and your products and services, without the need to know how to code or any technical skills.</p>
              <p className="large mb-0">Setting up your personal site is easy and only takes two minutes, you can even use information from your LinkedIn profile to get you started.</p>
            </div>
            <Link href="/users/register" className="btn primary high medium mt-5">Create my page</Link>
          </div>
        </Container> 
        {/* <div className="d-block position-relative w-100 p-0">
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
        </div> */}
        <div className="bg-light-900">
          <div className="bg-primary-100">
            <div className={`container ${styles.sectionWrapper} d-flex flex-column align-items-center justify-content-between gap-3 gap-lg-5`}>
              <h2 className="text-center mb-5 " style={{ maxWidth: '560px' }}>Got a question?</h2>
              <Accordion style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div className={`d-flex flex-column gap-4 w-100 ${styles.accordionWrapper}`}>
                <div className="d-flex flex-column">
                  <CustomToggle eventKey="0" question="How much does it cost?" />
                  <Accordion.Collapse eventKey="0">
                    <p className="mt-3 mb-0 large">It's free to create your ExpertPage site! Upgrade to our premium plan to connect your page to your own domain.</p>
                  </Accordion.Collapse>
                  <hr className="mb-0 w-100"></hr>
                </div>
                <div className="d-flex flex-column">
                  <CustomToggle eventKey="1" question="Who is this for?" />
                  <Accordion.Collapse eventKey="1">
                    <p className="mt-3 mb-0 large">Freelancers, consultants, small business owners, or anyone who wants to build a website to show off their products, services and customer testimonials but doesn't have the time or technical skills to build it on their own.</p>
                  </Accordion.Collapse>      
                  <hr className="mb-0 w-100"></hr>          
                </div>
                <div className="d-flex flex-column">
                  <CustomToggle eventKey="2" question="What makes this different?" />
                  <Accordion.Collapse eventKey="2">
                    <>
                      <p className="mt-3 large">Your ExpertPage site is optimised to promote you and your services, and make it easy for potential clients and customers to take the next step. Save time on wondering how you should style your page and make use of our template designed just for freelancers, consultants and small business owners.</p> 
                      <p className="mb-0 large">You can create your site in under two minutes, making this the fastest way to get your page up and running.</p>
                    </>
                  </Accordion.Collapse>      
                  <hr className="mb-0 w-100"></hr>                 
                </div>
                <div className="d-flex flex-column">
                  <CustomToggle eventKey="3" question="Why not use Wix or Squarespace?" />
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
          <div className="d-flex flex-column align-items-start" style={{paddingTop: '120px', paddingBottom: '120px'}}>
            <h2 className="mb-5 pb-3" style={{maxWidth: '560px'}}>Build trust with potential clients</h2>
            <div className={`${styles.layoutGrid}`}>
              <p className="large mb-0">Your customers are your best proof of the quality of service that you deliver. With ExpertPage you can add customer testimonials to help build trust with potential clients and land more sales. </p>
              <p className="large mb-0">Written excellent content that you think potential clients would love to read? You can feature your best content on your ExpertPage site and and add links for readers to explore the full thing. </p>
            </div>
            <Link href="/users/register" className="btn primary high medium mt-5">Create my page</Link>
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
                  <div className="d-block position-relative col-12 col-lg-6 p-0">
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
          <div className={`d-flex flex-column align-items-center text-center mx-auto gap-4 ${styles.sectionWrapper}`} style={{ maxWidth: '720px', paddingBottom: '160px' }}>
            {screenWidth > 576 ? <h1 className="">Build your brand today with ExpertPage</h1> : <h2 className="">Build your brand today with ExpertPage</h2>}
            {/* <p className="large mb-4" style={{ maxWidth: '640px' }}>It takes two minutes!</p> */}
            <div className="d-flex m-auto justify-content-center">
              <Link href="/users/register" className="btn primary high large m-auto">Create my page</Link>
            </div>
          </div>
        </Container>
      </div>
      <div ref={ref} className="w-100" style={{zIndex: '1', position: 'fixed', bottom: 0}}>
        <Footer />
      </div>
    </div>
  )
}

export default Home;