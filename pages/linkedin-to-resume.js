import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Container } from 'react-bootstrap';

import styles from './index.module.scss'
import Icon from '../components/icon/Icon';
import ICONS from '../components/icon/IconPaths';
import Footer from '../components/footer/Footer';
import PostCard from '../components/blog/PostCard';
import Header from '../components/header/Header';

const LinkedinToResume = () => {
  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    <div className="overflow-hidden" style={{ background: 'white' }}>
      <Header hideShadow />
      <Head>
        <title>Turn your Linkedin profile into a resume | vitaely.me</title>
        <meta name="description" content="Turn your Linkedin profile into a resume in just two minutes." />
        <meta property="og:title" content="Turn your Linkedin profile into a resume | vitaely.me" />
        <meta property="og:description" content="Turn your Linkedin profile into a resume in just two minutes." />
        <meta property="og:url" content="https://www.vitaely.me/linkedin-to-resume" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me%2Flinkedin-to-resume"/>
      </Head>
      <a className={styles.productHunt} href="https://www.producthunt.com/posts/Vitaely-me?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-Vitaely-me" target="_blank">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=291936&theme=light" alt="vitaely.me - Turn your LinkedIn Profile into a landing page | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" />
      </a>
      <Container className="mt-5 py-5">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div style={{ maxWidth: '560px' }} className="mb-5 mr-lg-4 text-center text-lg-left">
          { screenWidth > 576 ? <h1>Turn your Linkedin profile into a resume</h1> : <h2>Turn your Linkedin profile into a resume</h2> }
            <p className="large mb-4">Use your LinkedIn profile to create a clean, professional resume in just two minutes.</p>
            <div className="d-flex justify-content-center justify-content-lg-start m-auto m-lg-0">
<Link href="/users/register" className="btn primary high large">Get started</Link>
            </div>
          </div>
          <div className="position-relative d-none d-lg-block" style={{background: 'rgba(35, 31, 32, 0.03)', height: '440px', width: '440px', minHeight: '440px', minWidth: '440px', borderRadius:'320px'}}>
            <img src="/images/aaron-butler.jpg" style={{width: '120px', height: '120px', borderRadius:'100%', border: '4px solid white', boxShadow: '0 0 1px 0 rgba(35, 31, 32, 0.08), 0 6px 6px -1px rgba(35, 31, 32, 0.08)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute'}}></img>
            <div className="card py-4 pl-4" style={{position: 'absolute', top: '140px', left: '-64px', paddingRight: '120px', transform: 'scale(0.8)', border: '1px solid rgba(35, 31, 32, 0.08)'}}>
              <p className="large text-dark-high font-weight-semibold mb-0">Product Designer</p>
              <p className="large mb-0">Cuvva</p>
              <p className="text-dark-low mb-0">London, United Kingdom</p>
              <p className="text-dark-low mb-0">July 2021 – Present</p>
            </div>
            <div className="card py-4 pl-4" style={{position: 'absolute', top: '300px', left: '-24px', transform: 'scale(0.8)', paddingRight: '96px', border: '1px solid rgba(35, 31, 32, 0.08)'}}>
              <p className="large text-dark-high font-weight-semibold mb-0">Industrial Design & Technology</p>
              <p className="large mb-0">Loughborough University</p>
              <p className="text-dark-low mb-0">2013 – 2017</p>
            </div>
          </div>
        </div>
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
              <h3 className="text-primary-high">Share or download your profile</h3>
            </div>
          </div>
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
        <div className={`d-flex flex-column flex-lg-row align-items-center justify-content-between ${styles.sectionWrapper}`} style={{gap: '64px'}}>
          <div style={{ maxWidth: '460px' }} className="w-100 mr-lg-4 text-center text-lg-left order-0 order-lg-1">
            { screenWidth > 576 ? <h2>Sync your data from LinkedIn</h2> : <h2>Sync your data from LinkedIn</h2> }
            <p className="large">There's no need to fill out all of your experience, education and other information all over again.</p>
          </div>
          <div className="w-100 order-1 order-lg-0" style={{ maxWidth: '440px' }}>
            <img
              className="w-100"
              src="/images/landing-page/sync-from-linkedin.png"
            />
          </div>
        </div>
        <div className={`d-flex flex-column flex-lg-row align-items-center justify-content-between ${styles.sectionWrapper}`} style={{gap: '64px'}}>
          <div className="w-100 order-1 order-lg-1"  style={{ maxWidth: '440px' }}>
            <img
              className="w-100"
              src="/images/landing-page/custom-content.png"
            />
          </div>
          <div style={{ maxWidth: '480px' }} className="w-100 mr-lg-4 text-center text-lg-left order-0 order-lg-0">
            { screenWidth > 576 ? <h2>Choose what information to show</h2> : <h2>Choose what information to show</h2> }
            <p className="large">Choose the information from your Linkedin profile that you want to display on your resume.</p>
          </div>
        </div>
        <div className={`d-flex flex-column flex-lg-row align-items-center justify-content-between ${styles.sectionWrapper}`} style={{gap: '64px'}}>
          <div style={{ maxWidth: '460px' }} className="w-100 mr-lg-4 text-center text-lg-left order-0 order-lg-1">
            { screenWidth > 576 ? <h2>Clean and modern resume layout</h2> : <h2>Clean and modern resume layout</h2> }
            <p className="large">Stand out from the crowd. Build your very own professional resume from your LinkedIn profile.</p>
          </div>
          <div className="w-100 order-1 order-lg-0" style={{ maxWidth: '440px' }}>
            <img
              className="w-100"
              src="/images/landing-page/pdf-resume-builder/pdf-resume-builder.png"
            />
          </div>
        </div>
        <div className={`text-center ${styles.sectionWrapper}`}>
          { screenWidth > 576 ? <h2 className="mx-auto mb-5" style={{ maxWidth: "720px" }}>Turn your Linkedin profile into a resume in just two minutes</h2> : <h2 className="mx-auto mb-5">Turn your Linkedin profile into a resume in just two minutes</h2> }    
          <div className="d-flex m-auto justify-content-center">
            <Link href="/users/register" className="btn primary high large m-auto">Get started</Link>
          </div>
        </div>
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
                <h5 className="text-light-med">Get yourself noticed with a unique resume.</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.FEEDBACK} size='64' className="fill-light-900" />
                <h3 className="text-light-high my-3">No data entry</h3>
                <h5 className="text-light-med">Syncing your information from your LinkedIn account.</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.FOCUS} size='64' className="fill-light-900" />
                <h3 className="text-light-high my-3">No distractions</h3>
                <h5 className="text-light-med">Unlike Linkedin, it’s no place for other people’s profiles.</h5>
              </div>
            </div>
          </div>
        </Container>
      </div>

      
      <div className={`container ${styles.sectionWrapper}`}>
        <h2 className="mx-auto mb-5" style={{ maxWidth: '560px' }}>Learn how to build and download your resume</h2>
        <div className="d-flex flex-column" style={{gap: '24px'}}>
          <PostCard 
            image='/images/blog/how-to-download-your-resume-as-a-pdf/How to download your resume as a PDF.jpg'
            title="How to download your resume as a PDF"
            duration="2"
            bodyPreview="You’ve created your profile with vitaely.me and you’ve now got a beautiful personal landing page with all your information..."
            postUrl="/blog/how-to-download-your-resume-as-a-pdf"
            screenWidth={screenWidth}
          />
          <div className="d-flex flex-column flex-lg-row" style={{gap: '24px'}}>
            <PostCard 
              // image="../../images/profile-preview.png"
              title="How to create an online CV in 2 minutes"
              duration="2"
              bodyPreview="Much like an offline CV; an online CV is a chance to share a bit about yourself, your professional experience and you..."
              postUrl="/blog/how-to-create-an-online-cv"
              screenWidth={screenWidth}
            />
            <PostCard 
              // image="../../images/profile-preview.png"
              title="How to keep your profile up to date"
              duration="2"
              bodyPreview="Keeping your online presence up to date is crucial if you are to make the most of your experience and education when..."
              postUrl="/blog/how-to-keep-your-profile-up-to-date"
              screenWidth={screenWidth}
            />
          </div>
          <PostCard 
            image="../../images/profile-preview.png"
            title="How to create a personal landing page"
            duration="2"
            bodyPreview="A landing page is typically the first page that a user may come to when looking for information about a particular product..."
            postUrl="/blog/how-to-create-a-personal-landing-page"
            screenWidth={screenWidth}
          />
        </div>
      </div>
     
      <Container>
        <div className={`text-center ${styles.sectionWrapper}`}>
          { screenWidth > 576 ? <h2 className="mx-auto" style={{ maxWidth: "720px" }}>Start turning your Linkedin profile into a resume</h2> : <h2 className="mx-auto">Start turning your Linkedin profile into a resume</h2> }    
          <p className="large mx-auto mb-5">Create your resume in just 2 minutes</p>
          <div className="d-flex m-auto justify-content-center">
            <Link href="/users/register" className="btn primary high large m-auto">Get started</Link>
          </div>
        </div>
      </Container>
      <Footer />
      <br/><br/>
    </div>
  )
}

export default LinkedinToResume;