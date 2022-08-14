import { useEffect, useState } from "react"
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../header/Header';
import { Container } from 'react-bootstrap';
import Footer from "../Footer";
import styles from '../../pages/index.module.scss'
import Icon from '../icon/Icon';
import ICONS from '../icon/IconPaths';

const LandingPage = (props) => {

  const [screenWidth, setScreenWidth] = useState('');

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  return (
    <div className="overflow-hidden" style={{ background: 'white' }}>
      <Head>
        <title>{`${props.title} | Vitaely.me`}</title>
        { props.subtitle ? <meta name="description" content={props.subtitle} /> : null }
        <meta property="og:title" content={`${props.title} | Vitaely.me`} />
        <meta property="og:description" content={props.subtitle} />
        <meta property="og:url" content={`https://www.vitaely.me/${props.url}`} />
        <meta property="og:type" content="website" />
      </Head>
      <a className={styles.productHunt} href="https://www.producthunt.com/posts/vitaely-me?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-vitaely-me" target="_blank">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=291936&theme=light" alt="Vitaely.me - Turn your LinkedIn Profile into a landing page | Product Hunt" style={{width: '250px', height: '54px'}} width="250" height="54" />
      </a>
      <Container className="mt-5 py-5">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div style={{ maxWidth: '520px' }} className="mb-5 mr-lg-4 text-center text-lg-left">
          { screenWidth > 576 ? <h1>{props.title}</h1> : <h2>{props.title}</h2> }
            <p className="large mb-4">{props.subtitle}</p>
            <div className="d-flex justify-content-center justify-content-lg-start m-auto m-lg-0">
              <Link href="/users/register">
                <a className="btn primary high large">Get started</a>
              </Link>
            </div>
          </div>
          { !props.heroImage ? 
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
          : (
            <>
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between ml-lg-5" style={{gap: '64px'}}>
              <div className="w-100 order-1 order-lg-0">
                <img
                  className="w-100"
                  src={props.heroImage}
                />
              </div>
            </div>
              {/* <Image 
                alt={props.title ? props.title : null} 
                src={props.heroImage} 
                layout="fill" 
                objectFit="cover" 
              /> */}
            </>
            )
          }

        </div>
        {/* <div className="d-flex flex-column align-items-center justify-content-center">
          <div style={{ maxWidth: '560px' }} className="mb-5 text-center">
          { screenWidth > 576 ? <h1>{props.title}</h1> : <h2>{props.title}</h2> }
            <p className="large mb-4">{props.subtitle}</p>
            <div className="d-flex justify-content-center m-auto m-lg-0">
              <Link href="/users/register">
                <a className="btn primary high large">Get started</a>
              </Link>
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            <Image
              src="/images/profile-preview.png"
              layout='fill'
              objectFit="cover"
            />
          </div>
        </div> */}
      </Container>
      <hr/>
      <Container>
        <div className={`text-center ${styles.sectionWrapper}`}>
        { screenWidth > 576 ? <h1 className="mx-auto pb-5" style={{ maxWidth: '640px' }}>{props.stepsTitle}</h1> : <h2 className="mx-auto pb-5">{props.stepsTitle}</h2> }    
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
              <h3 className="text-primary-high">{!props.stepThree ? 'Share your profile' : props.stepThree}</h3>
            </div>
          </div>
        </div>
        {props.sectionTwoTitle ? 
        <div className={`d-flex flex-column flex-lg-row align-items-center justify-content-between ${styles.sectionWrapper}`} style={{gap: '64px'}}>
          <div className="w-100 order-1 order-lg-0">
            <img
              className="w-100"
              src={`/images/landing-page/${props.sectionTwoImg}`}
            />
          </div>
          <div style={{ maxWidth: '560px' }} className="w-100 mr-lg-4 text-center text-lg-left order-0 order-lg-1">
            { screenWidth > 576 ? <h1>{props.sectionTwoTitle}</h1> : <h2>{props.sectionTwoTitle}</h2> }
            <p className="large">{props.sectionTwoSubtitle}</p>
          </div>
        </div>
        : '' }
        {props.sectionOneTitle ?
        <div className={`d-flex flex-column flex-lg-row align-items-center justify-content-between ${styles.sectionWrapper}`} style={{gap: '64px'}}>
          <div style={{ maxWidth: '560px' }} className="w-100 mr-lg-4 text-center text-lg-left order-0 order-lg-0">
            { screenWidth > 576 ? <h1>{props.sectionOneTitle}</h1> : <h2>{props.sectionOneTitle}</h2> }
            <p className="large">{props.sectionOneSubtitle}</p>
          </div>
          <div className="w-100 order-1 order-lg-1">
            <img
              className="w-100"
              src={`/images/landing-page/${props.sectionOneImg}`}
            />
          </div>
        </div>
        : '' }
        {/* <div className={`text-center ${styles.sectionWrapper}`}>
          { screenWidth > 576 ? <h1 className="mx-auto pb-5" style={{ maxWidth: '480px' }}>Stand out from the crowd</h1> : <h2 className="mx-auto pb-5">Stand out from the crowd</h2> }    
          <div className={styles.heroImageWrapper}>
            <Image
              src="/images/profile-preview.png"
              layout='fill'
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
                <h5 className="text-light-med">{ props.whyVitaelyOne ? props.whyVitaelyOne : `Get yourself noticed with a unique personal landing page.`}</h5>
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
          { screenWidth > 576 ? <h1 className="mx-auto mb-5" style={{ maxWidth: "720px" }}>{props.title}</h1> : <h2 className="mx-auto mb-5">{props.title}</h2> }    
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

export default LandingPage;