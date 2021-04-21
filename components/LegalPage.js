import { useEffect, useState } from "react"
import Head from 'next/head';
import Link from 'next/link';
import Header from './header/Header';
import { Container } from 'react-bootstrap';
import Footer from "./Footer";

const LegalPage = (props) => {
  const {
    heroTitle,
    lastUpdated,
    children
  } = props;
  const [loggedIn, setLoggedIn] = useState(false);
  const [screenWidth, setScreenWidth] = useState('');

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  return (
    <div>
      <Head>
        <title>{heroTitle}</title>
        <link rel="shortcut icon" href="/images/vitaely-logo-icon-square.svg" />
      </Head>
      <Header />
      <div className="container">
        <div className="card my-5">
          <div>
            <div className="m-4 m-sm-5">
              {screenWidth > 767 ?
                <h2 className="mx-auto mb-2 mb-sm-3">{heroTitle}</h2>
                :
                <h3 className="mx-auto mb-2 mb-sm-3">{heroTitle}</h3>
              }
              <p className="m-0">Last updated {lastUpdated}</p>
            </div>
          </div>
          <hr className="m-0" />
          {children}
        </div>
        <Footer />
      </div>
     {/* <Container className="mt-5 py-5">
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
          <div className="position-relative d-none d-lg-block" style={{ background: 'rgba(35, 31, 32, 0.03)', height: '440px', width: '440px', minHeight: '440px', minWidth: '440px', borderRadius: '320px' }}>
            <img src="/images/aaron-butler.jpg" style={{ width: '120px', height: '120px', borderRadius: '100%', border: '4px solid white', boxShadow: '0 0 1px 0 rgba(35, 31, 32, 0.08), 0 6px 6px -1px rgba(35, 31, 32, 0.08)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute' }}></img>
            <div className="card py-4 pl-4" style={{ position: 'absolute', top: '140px', left: '-64px', paddingRight: '120px', transform: 'scale(0.8)', border: '1px solid rgba(35, 31, 32, 0.08)' }}>
              <p className="large text-dark-high font-weight-semibold mb-0">Junior Product Designer</p>
              <p className="large mb-0">Activate</p>
              <p className="text-dark-low mb-0">London, United Kingdom</p>
              <p className="text-dark-low mb-0">April 2018 – October 2019</p>
            </div>
            <div className="card py-4 pl-4" style={{ position: 'absolute', top: '300px', left: '-24px', transform: 'scale(0.8)', paddingRight: '96px', border: '1px solid rgba(35, 31, 32, 0.08)' }}>
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
      <div>
        <Container className="py-5">
          <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between mb-5">
            <img className="mb-5 mb-md-0" src="/images/vitaely-logo-full.svg" />
            <div className="d-flex flex-column text-center text-md-right">
              <Link href="/"><a className="text-dark-high mb-3">Terms & Conditions</a></Link>
              <Link href="/"><a className="text-dark-high mb-3">Privacy Policy</a></Link>
              <Link href="/"><a className="text-dark-high">Cookie Policy</a></Link>
            </div>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between">
            <p>© Copyright Vitaely {new Date().getFullYear()}</p>
            <p>Made by <a href="https://www.aaron-butler.co.uk">Aaron Butler</a> in London</p>
          </div>
        </div>
      </Container>*/}
    </div>
  )
}

export default LegalPage;