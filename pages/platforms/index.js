import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { loadStripe } from '@stripe/stripe-js';
import { Accordion, Container, ModalBody, useAccordionToggle } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import moment from 'moment'
import ICONS from '../../components/icon/IconPaths';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loader.json'
import styles from './platforms.module.scss'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { ProgressBar, Modal } from 'react-bootstrap';
import SurveyBanner from '../../components/banner/SurveyBanner';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import { v4 as uuidv4 } from 'uuid';

const Platforms = (props) => {
  const router = useRouter();
  const { asPath } = useRouter();
  const { userContext, setUserContext } = useContext(UserContext);

  const [userData, setUserData] = useState('');
  const [userId, setUserId] = useState('');
  const [allUserData, setAllUserData] = useState('');

  const [screenWidth, setScreenWidth] = useState('');

  
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState('');
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelAt, setCancelAt] = useState('');
  const [redirectToStripe, setRedirectToStripe] = useState(false);

  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [sub, setSub] = useState('');
  const [subError, setSubError] = useState('');

  const [sites, setSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  // const [sites, setSites] = useState(
  //   [
  //     {
  //       name: 'wrgwe',
  //       description: 'wrgwgwe',
  //       subdomain: 'rginnf'
  //     },
  //     {
  //       name: 'wgerbe',
  //       description: 'vwrvw',
  //       subdomain: 'ehrer'
  //     }
  //   ]
  // );

        {/*
        name,
        description,
        subdomain: sub.length > 0 ? sub : uuidv4(),
        userId,
      */}

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);

    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          loggedInRoute(user)
          getSubscription(user)
          setUserData(user)
          getSites(user)
        } else {
          router.push('/users/login')
        }
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
        setAllUserData(doc.data())
        setUserId(user.uid)
      } else {
        console.log("No such document!");
      }
    })
      .then(() => {
        // setSectionsLoading(false)
        //console.log('Retreived display info from database')
        //console.log('stripe product is' + process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM)
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })
  }

  const getSubscription = (user) => {
    var docRef = fire.firestore().collection('users').doc(user.uid).collection('subscriptions')
    //docRef.get()
    docRef.where("status", "==", "active").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setProduct(doc.data().items[0].plan.product)
          setActive(doc.data().items[0].plan.active)
          setStatus(doc.data().status)
          setCancelAtPeriodEnd(doc.data().cancel_at_period_end)
          // setCancelAt(doc.data().cancel_at.seconds)
          // console.log(doc.id, " => ", doc.data());
          // console.log(doc.data().items[0].plan.product);
          // console.log(doc.data().items[0].plan.active)
          // prod_Jdg7o4VDoipc7d = Premium
          // prod_Jdg7ZdcmfuNm0P = Free
        });
      })
      .then(() => {
        // console.log('Retreived subscription data from database')
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })
  }

  const getSites = (user) => {

    setLoadingSites(true)

    let siteList = []



    fire.firestore().collection('sites').where("userId", "==", user.uid).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          siteList.push(doc.data())
        });
      })
      .then(() => {
        setSites(siteList)
        setLoadingSites(false)
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })
  }

  const nameChange = (value) => {
    setName(value),
    setNameError('')
  }
  const descriptionChange = (value) => {
    setDescription(value),
    setDescriptionError('')
  }
  const subChange = (value) => {
    setSub(value),
    setSubError('')
  }

  const handleSectionsSubmit = (e) => {
    e.preventDefault();
    setSavingSections(true);
    fire.firestore().collection('users').doc(userData.uid).update({
      displayInfo: {
        'basicInfo': {
          'section': basicInfo,
          'each': {
            'profilePic': profilePic,
            'headerImage': headerImage,
            'name': fullname,
            'headline': headline,
            'email': email
          }
        },
        about,
        'experience': {
          'section': experience,
          'each': experienceEach,
        },
        'education': {
          'section': education,
          'each': educationEach,
        },
        'volunteering': {
          'section': volunteering,
          'each': volunteeringEach,
        }
      },
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        setSavingSections(false)
        toast("Sections updated")
      })
      .catch((err) => {
        console.log(err.code, err.message)
        //setNotification(err.message)
        toast(err.message)
      })
  }

  const AddDomain = () => {
    fetch(`/api/add-domain?domain=www.bbc.com&userId=${userId}`)
      .then(result => console.log(result))
      .catch((error) => {
        console.log('error', error)
      });
  }

  const CheckDomain = () => {
    fetch("/api/check-domain")
        .then(result => console.log(result))
        .catch((error) => {
          console.log('error', error)
        });
  }

  const handleResyncSubmit = (e) => {
    e.preventDefault();
    if (syncsRemaining > 0) {
      setSyncLoading('Fetching data from LinkedIn');
      fetch("/api/linkedin?profileUrl=" + "https://www.linkedin.com/in/" + linkedinId)
        .then(res => res.json())
        .then((result) => {
          setSyncLoading('Storing your data');
          fire.firestore().collection('users').doc(userData.uid).update({
            profile: result,
            displayInfo: {
              'basicInfo': {
                'section': true,
                'each': {
                  'profilePic': true,
                  'headerImage': true,
                  'name': true,
                  'headline': true,
                  'email': true
                }
              },
              about: result.summary === null ? false : true,
              'experience': {
                'section': result.experiences < 1 ? false : true,
                'each': createExperienceList(result.experiences)
              },
              'education': {
                'section': result.education < 1 ? false : true,
                'each': createEducationList(result.education)
              },
              'volunteering': {
                'section': result.volunteer_work < 1 ? false : true,
                'each': createVolunteerList(result.volunteer_work)
              },
            },
            //syncsRemaining: (syncsRemaining - 1), 
            lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
            lastSync: fire.firestore.FieldValue.serverTimestamp(),
          })
        })
        .then(() => {
          setTimeout(
            setSyncLoading('Sync successfully completed'), 2000
          )
        })
        .then(() => {
          router.push('/settings')
        })
        .catch((error) => {
          console.log('error', error)
        });
    } else {
      setSyncError('You have no syncs remaining')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setSaving(true);

    if (name === '') {
      setNameError('Please enter a name')
      setSaving(false)
    } else {

      // fire.firestore().collection('sites').add({
      //   userId: userData.uid,
      //   name: name,
      //   description: description.length > 0 ? description : null,
      //   subdomain: sub.length > 0 ? sub : uuidv4(),
      //   createdAt: fire.firestore.FieldValue.serverTimestamp(),
      //   lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
      // })
      fire.firestore().collection('users').doc(userId).update({
        subdomain: sub.length > 0 ? sub : uuidv4(),
        lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
      })
        .then(() => {
          setName('')
          setDescription('')
          setSub('')
        })
        .then(() => {
          setSaving(false)
          handleClose()
          getSites(userData)
        })
        .catch(error => console.log('error', error));
    }
  }

  const Sites = () => {
    return loadingSites ? 
      <p>loading</p>
    :
      (
        sites !== [] ? 
        <div className="d-flex flex-column gap-3">
          {sites.map((site, index) => {
            return (
              <a key={index} href={site.customDomain ? `http://${site.customDomain}` : `http://${site.subdomain}.${props.host}`}>
                <div className="bg-light-900 radius-2 p-4 shadow-3">
                  {props.resolvedUrl}
                  <h6 className="mb-2">{site.name}</h6>
                  {site.description && <p>{site.description}</p>}
                  <p className="mb-0 text-dark-low">{site.customDomain ? site.customDomain : `${site.subdomain}.vitaely.me`}</p>
                </div>
              </a>
            )
          })}
        </div>
        : 
          <p>No sites found</p>
      )
  }
  

  return (
    <div className="pt-5 mt-5">
      <Head>
        <title>Platforms</title>
      </Head>
      <Header positionFixed />
      <div>
      {/* <div style={{ marginTop: '66px' }}> */}
        <Container className="py-4">
          <div className="d-flex flex-row align-items-center justify-content-between m-auto">
            <h2 className="my-5">Platforms</h2>
            <button className="btn primary high small" onClick={() => handleShow()}>Add site</button>
            <button className="btn primary medium small" onClick={() => AddDomain()}>Add domain</button>
            <button className="btn primary medium small" onClick={() => CheckDomain()}>Check domain</button>
          </div>
          <Sites />
        </Container>
        <br /><br />
        <Modal
          show={showModal}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <h4 className="mb-0">Add site</h4>
            <button onClick={handleClose} className="btn dark medium icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </Modal.Header>
          <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column w-100 gap-4">
              <div>
                <input type="text" className={nameError !== '' ? `error w-100` : `w-100`} value={name} onChange={({ target }) => nameChange(target.value)} placeholder="Name" />
                {nameError !== '' && <p className="small text-error-high mt-2 mb-0">{nameError}</p> }
              </div>
              <div>
                <input type="text" className={descriptionError !== '' ? `error w-100` : `w-100`} value={description} onChange={({ target }) => descriptionChange(target.value)} placeholder="Description" />
                {descriptionError !== '' && <p className="small text-error-high mt-2 mb-0">{descriptionError}</p> }
              </div>
              <div>
                <input type="text" className={subError !== '' ? `error w-100` : `w-100`} value={sub} onChange={({ target }) => subChange(target.value)} placeholder="Subdomain" />
                {subError !== '' && <p className="small text-error-high mt-2 mb-0">{subError}</p> }
              </div>
  
              <div className="d-flex flex-column mt-4 gap-3">
                <div className="d-flex flex-column flex-sm-row align-items-start justify-content-between gap-3">
                  <button type="submit" className="btn primary high w-100 w-sm-auto order-0 order-sm-1" disabled={saving}>{!saving ? 'Continue' : 'Saving'}</button>
                  <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleClose}>Cancel</button>
                </div>
              </div>
            </div>
          </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {

  const props = {
    host: context.req.headers.host
  }

  return {
    props: JSON.parse(JSON.stringify(props))
  }
}

export default Platforms