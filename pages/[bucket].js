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

import Cookies from 'js-cookie'
import { LANDING_BUCKETS } from '../lib/buckets'

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screenWidth, setScreenWidth] = useState('');
  // const [idList, setIdList] = useState("");
  const [profileUrl, setProfileUrl] = useState('');
  const [showNewStuff, setShowNewStuff] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [loadingState, setLoadingState] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  const router = useRouter()
  const setBucket = (bucket) => () => {
    Cookies.set('bucket-landing', bucket)
    router.reload()
  }
  const removeBucket = () => {
    Cookies.remove('bucket-landing')
    router.reload()
  }
  const bucket = router.query.bucket;

  useEffect(() => {
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e');
    mixpanel.register_once({ "home page": bucket });
    mixpanel.track('Landing page');
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);

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

  const urlChange = (value) => {
    setProfileUrl(value),
      setUrlError('')
  }

  const onUrlInvalid = () => {
    alert('Please enter a valid LinkedIn URL')
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   alert('Sent');
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profileUrl !== '') {
      setLoadingState('Fetching data from LinkedIn');
      // OPTION 1: stay on page and set the button to loading/indicate that it is fetching somehow
      // OPTION 2: save the profileUrl to localstorage, redirect to new page, get the profileUrl from localstorage, show the progress bar as normal, redirect to profile when complete
      // We could save something to the profile that indicates that this user is part of the experiment group, and therefore we need to create an account and agree to emails later on

      // Replace the bit below with 

      // fetch("/api/linkedin?profileUrl=" + profileUrl)
      //fetch("/api/fakeLinkedin")
      fetch("/api/linkedin?profileUrl=" + profileUrl)
        .then(res => res.json())
        .then((result) => {
          setLoadingState('Storing your data');
          // need to store is data in localhost, there is not account
          // or do we create an emailless account, and try to add the email and password later? this way we have a userId to save the details to 

          //localStorage.setItem('profile', 'value');
          //localStorage.setItem('profile', JSON.stringify({"key": "value"}));

          localStorage.setItem('profile', JSON.stringify(result));


          // fire.firestore().collection('users').doc(userData.uid).update({
          //   experiment: {
          //     'landingPage': "c"
          //   },
          //   profile: result,
          //   displayInfo: {
          //     'basicInfo': {
          //       'section': true,
          //       'each': {
          //         'profilePic': true,
          //         'headerImage': true,
          //         'name': true,
          //         'headline': true,
          //         'email': true
          //       }
          //     },
          //     about: result.summary === null ? false : true,
          //     'experience': {
          //       'section': result.experiences < 1 ? false : true,
          //       'each': createExperienceList(result.experiences)
          //     },
          //     'education': {
          //       'section': result.education < 1 ? false : true,
          //       'each': createEducationList(result.education)
          //     },
          //     'volunteering': {
          //       'section': result.volunteer_work < 1 ? false : true,
          //       'each': createVolunteerList(result.volunteer_work)
          //     },
          //   },
          //   //syncsRemaining: 1,
          //   stage: 'complete',
          //   profileUrl: '/profile/' + userData.uid,
          //   lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
          //   lastSync: fire.firestore.FieldValue.serverTimestamp(),
          // });
        })
        .then(() => {
          mixpanel.init('61698f9f3799a059e6d59e26bbd0138e');
          mixpanel.track('Synced');
          setTimeout(
            setLoadingState('Sync successfully completed'), 2000
          )
        })
        .then(() => {
          router.push('/profile')
        })
        .catch(error => console.log('error', error));
    } else {
      setUrlError('Please enter the URL for your LinkedIn profile')
    }

  }

  const createExperienceList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'title': object.title,
      'company': object.company
    })
    )
  }

  const createEducationList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'name': object.field_of_study,
      'school': object.school
    })
    )
  }

  const createVolunteerList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'title': object.title,
      'company': object.company
    })
    )
  }


  return (
    <div className="overflow-hidden" style={{ background: 'white' }}>
      <Head>
        <title>Vitaely | Turn your LinkedIn profile into a landing page</title>
        <meta name="description" content="Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page." />
        <meta property="og:title" content="Vitaely | Turn your LinkedIn profile into a landing page" />
        <meta property="og:description" content="Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page." />
        <meta property="og:url" content="https://www.vitaely.me/" />
        <meta property="og:type" content="website" />
      </Head>
      <a className={styles.productHunt} href="https://www.producthunt.com/posts/vitaely-me?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-vitaely-me" target="_blank">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=291936&theme=light" alt="Vitaely.me - Turn your LinkedIn Profile into a landing page | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" />
      </a>
      <Header hideShadow />
      <Container className="mt-5 pt-5">
        {bucket == 'a' ?
          < div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
            <div style={{ maxWidth: '560px' }} className="mb-5 mr-lg-4 text-center text-lg-left">
              {screenWidth > 576 ? <h1>Turn your CV into a landing page</h1> : <h2>Turn your CV into a landing page</h2>}
              <p className="large mb-4">Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page.</p>
              <div className="d-flex justify-content-center justify-content-lg-start m-auto m-lg-0">
                <Link href="/users/register">
                  <a className="btn primary high large">Get started</a>
                </Link>
              </div>
              {showNewStuff ?
                <div className="d-flex justify-content-center justify-content-lg-start mx-auto m-lg-0 mt-5">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <p className="large text-dark-high">LinkedIn profile URL</p>
                      <p>We will use this to collect your information on your profile.</p>
                      <div>
                        <input type="text" className="w-100" pattern="http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?" onInvalid={onUrlInvalid} value={profileUrl} onChange={({ target }) => urlChange(target.value)} placeholder="https://www.linkedin.com/in/" />
                      </div>
                    </div>
                    <br />
                    <button type="submit" className="btn primary high">Sync data</button>
                  </form>
                </div>
                : null}
            </div>
            <div className="position-relative d-none d-lg-block" style={{ background: 'rgba(35, 31, 32, 0.03)', height: '440px', width: '440px', minHeight: '440px', minWidth: '440px', borderRadius: '320px' }}>
              <img src="/images/aaron-butler.jpg" style={{ width: '120px', height: '120px', borderRadius: '100%', border: '4px solid white', boxShadow: '0 0 1px 0 rgba(35, 31, 32, 0.08), 0 6px 6px -1px rgba(35, 31, 32, 0.08)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute' }}></img>
              <div className="card py-4 pl-4" style={{ position: 'absolute', top: '140px', left: '-64px', paddingRight: '120px', transform: 'scale(0.8)', border: '1px solid rgba(35, 31, 32, 0.08)' }}>
                <p className="large text-dark-high font-weight-semibold mb-0">Product Designer</p>
                <p className="large mb-0">Cuvva</p>
                <p className="text-dark-low mb-0">London, United Kingdom</p>
                <p className="text-dark-low mb-0">July 2021 – Present</p>
              </div>
              <div className="card py-4 pl-4" style={{ position: 'absolute', top: '300px', left: '-24px', transform: 'scale(0.8)', paddingRight: '96px', border: '1px solid rgba(35, 31, 32, 0.08)' }}>
                <p className="large text-dark-high font-weight-semibold mb-0">Industrial Design & Technology</p>
                <p className="large mb-0">Loughborough University</p>
                <p className="text-dark-low mb-0">2013 – 2017</p>
              </div>
            </div>
          </div>
          :
          <div className="d-flex flex-column align-items-center justify-content-between">
            <div style={{ maxWidth: '640px' }} className="mb-5 pb-5 text-center">
              {screenWidth > 576 ? <h1>Turn your resume into a landing page</h1> : <h2>Turn your resume into a landing page</h2>}
              {bucket == 'b' ?
                <p className="large mb-4">Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page.</p>
                :
                <p className="large mb-4">Paste your Linkedin URL below to create your profile</p>
              }
              {bucket == 'b' ?
                <div className="d-flex justify-content-center m-auto">
                  <Link href="/users/register">
                    <a className="btn primary high large">Get started</a>
                  </Link>
                </div>
                :
                <div className="d-flex justify-content-center mx-auto" style={{ maxWidth: '480px' }}>
                  <form onSubmit={handleSubmit} className="w-100">
                    <div className="mb-3">
                      <div>
                        <input type="text" className={urlError !== '' ? `error w-100` : `w-100`} pattern="http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?" onInvalid={onUrlInvalid} value={profileUrl} onChange={({ target }) => urlChange(target.value)} placeholder="e.g. https://www.linkedin.com/in/butler952" />
                        {urlError !== '' ? <p className="small mt-2">{urlError}. If you're already logged in on Linkedin you can access your profile <a href="https://www.linkedin.com/in/">here</a>.</p> : null}
                      </div>
                    </div>
                    <button type="submit" className="btn w-100 primary high" disabled={loadingState !== ''}>{loadingState == '' ? 'Create my profile' : loadingState}</button>
                  </form>
                </div>
              }
            </div>
            <div className={styles.iframeWrapper}>
              <iframe className={styles.iframeContent}
                title="Example Vitaely.me online CV profile"
                src="https://www.vitaely.me/profile/A7BBld6PVxb2VJg3l0ToUVxaXzB3">
              </iframe>
            </div>
          </div>
        }
        <div className={`text-center ${styles.sectionWrapper}`}>
          {screenWidth > 576 ? <h2 className="mx-auto pb-5" style={{ maxWidth: '560px' }}>Create your landing page in 2 minutes</h2> : <h2 className="mx-auto pb-5">Create your landing page in 2 minutes</h2>}
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
      </Container >
      {/* <Container>
            <h2>
            Landing page variant
            </h2>
            <p>
            You&apos;re currently on <b>bucket {bucket.toUpperCase()}</b>
            </p>
            <p>
            You can use the buttons below to change your assigned bucket and refresh
            the page:
            </p>
            {LANDING_BUCKETS.map((bucket) => (
            <button
                key={bucket}
                onClick={setBucket(bucket)}
                style={{ marginRight: '0.625rem' }}
            >
                Bucket {bucket.toUpperCase()}
            </button>
            ))}
            <button variant="black" onClick={removeBucket}>
            Remove bucket
            </button>
        </Container> */}
      < div className={`overflow-hidden ${styles.primaryBackground}`}>
        <Container className={styles.sectionWrapper}>
          <div className="text-center">
            {/*{ idList ?? <p>{idList}</p> }*/}
            {screenWidth > 576 ? <h1 className="text-light-high mx-auto mb-5 pb-5" style={{ maxWidth: '560px' }}>Why use Vitaely?</h1> : <h2 className="text-light-high mx-auto mb-5 pb-5">Why use Vitaely?</h2>}
            <div className={styles.stepsContainer}>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.STAR} size='64' className="fill-light-900" />
                <h3 className="text-light-high my-3">Stand out</h3>
                <h5 className="text-light-med">Get yourself noticed with a unique personal landing page.</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                <Icon icon={ICONS.NO_DATA_ENTRY} size='64' className="fill-light-900" />
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
      </div >
      <Container>
        <div className={`text-center ${styles.sectionWrapper}`}>
          {screenWidth > 576 ? <h1 className="mx-auto" style={{ maxWidth: "640px" }}>Turn your resume into a landing page</h1> : <h2 className="mx-auto">Start turning your CV into a landing page</h2>}
          {bucket == 'b' ?
            <p className="large mb-4">Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page.</p>
            :
            <p className="large mb-4">Paste your Linkedin URL below to create your profile</p>
          }
          {bucket == 'b' ?
            <div className="d-flex justify-content-center m-auto">
              <Link href="/users/register">
                <a className="btn primary high large">Get started</a>
              </Link>
            </div>
            :
            <div className="d-flex justify-content-center mx-auto" style={{ maxWidth: '480px' }}>
              <form onSubmit={handleSubmit} className="w-100">
                <div className="mb-3">
                  <div>
                    <input type="text" className={urlError !== '' ? `error w-100` : `w-100`} pattern="http(s)?:\/\/([\w]+\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?" onInvalid={onUrlInvalid} value={profileUrl} onChange={({ target }) => urlChange(target.value)} placeholder="e.g. https://www.linkedin.com/in/butler952" />
                    {urlError !== '' ? <p className="small mt-2">{urlError}. If you're already logged in on Linkedin you can access your profile <a href="https://www.linkedin.com/in/">here</a>.</p> : null}
                  </div>
                </div>
                <button type="submit" className="btn w-100 primary high" disabled={loadingState !== ''}>{loadingState == '' ? 'Create my profile' : loadingState}</button>
              </form>
            </div>
          }
        </div>
      </Container>
      <Footer />
      <br /><br />
    </div >
  )
}

export const getServerSideProps = async ({ bucket }) => {
  const buckets = LANDING_BUCKETS.filter((bucket) => bucket !== 'original')

  return {
    props: {
      paths: buckets.map((bucket) => ({ params: { bucket } })),
      fallback: false,
    }
  }
}

export default Home;


// export async function getStaticPaths() {
//   /**
//    * For the marketing page, the `original` bucket (handled by `./original.tsx`)
//    * represents the current marketing page without any changes, this is
//    * useful if the variations are very different and you don't to merge
//    * them on the same page.
//    */
//   const buckets = LANDING_BUCKETS.filter((bucket) => bucket !== 'original')

//   return {
//     paths: buckets.map((bucket) => ({ params: { bucket } })),
//     fallback: false,
//   }
// }

// export async function getStaticProps() {
//   // Here you would return data about the bucket
//   return { props: {} }
// }

// export const getServerSideProps = async ({ query }) => {
//   const content = {}
//   await fire.firestore()
//     .collection('users')
//     .doc(query.id)
//     .get()
//     .then(result => {
//       content['pageId'] = query.id ? query.id : null;
//       content['email'] = result.data().email ? result.data().email : null;
//       content['profile_pic_url'] = result.data().profile.profile_pic_url ? result.data().profile.profile_pic_url : null;
//       content['background_cover_image_url'] = result.data().profile.background_cover_image_url ? result.data().profile.background_cover_image_url : null ;
//       content['full_name'] = result.data().profile.full_name ? result.data().profile.full_name : null;
//       content['headline'] = result.data().profile.headline ? result.data().profile.headline : null;
//       content['summary'] = result.data().profile.summary ? result.data().profile.summary : null;
//       content['experiences'] = result.data().profile.experiences ? result.data().profile.experiences : null;
//       content['education'] = result.data().profile.education ? result.data().profile.education : null;
//       content['volunteer_work'] = result.data().profile.volunteer_work ? result.data().profile.volunteer_work : null;
//       content['logoVisibility'] = result.data().logoVisibility ? result.data().logoVisibility : null;
//       content['displayBasicInfo'] = result.data().displayInfo.basicInfo ? result.data().displayInfo.basicInfo : null;
//       content['displayAbout'] = result.data().displayInfo.about ? result.data().displayInfo.about : null;
//       content['displayExperience'] = result.data().displayInfo.experience ? result.data().displayInfo.experience : null;
//       content['displayEducation'] = result.data().displayInfo.education ? result.data().displayInfo.education : null;
//       content['displayVolunteering'] = result.data().displayInfo.volunteering ? result.data().displayInfo.volunteering : null;
//       content['surveyOnSignUpHide'] = result.data().surveys ? (result.data().surveys.surveyOnSignUp ? (result.data().surveys.surveyOnSignUp.surveyHide ? result.data().surveys.surveyOnSignUp.surveyHide : null) : null) : null;
//     });

//   return {
//     props: {
//       pageId: content.pageId,
//       email: content.email,
//       profile_pic_url: content.profile_pic_url,
//       background_cover_image_url: content.background_cover_image_url,
//       full_name: content.full_name,
//       headline: content.headline,
//       summary: content.summary,
//       experiences: content.experiences,
//       education: content.education,
//       logoVisibility: content.logoVisibility,
//       volunteer_work: content.volunteer_work,
//       displayBasicInfo: content.displayBasicInfo,
//       displayAbout: content.displayAbout,
//       displayExperience: content.displayExperience,
//       displayEducation: content.displayEducation,
//       displayVolunteering: content.displayVolunteering,
//       surveyOnSignUpHide: content.surveyOnSignUpHide,
//     }
//   }
// }
