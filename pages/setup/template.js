import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
// import testResponse from './testResponse';
import { Container, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import ICONS from '../../components/icon/IconPaths';
import { UserContext } from '../_app';
import styles from '../settings/settings.module.scss'
import pageStyles from './template.module.scss'
import Image from 'next/image';
import Lottie from 'react-lottie';
import animationData from '../../components/animations/loaderLight.json'

const Template = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const [profileUrl, setProfileUrl] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userResult, setUserResult] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');
  const [showBuildingOverlay, setShowBuildingOverlay] = useState(false);
  const [showBuildingOverlayContentOne, setShowBuildingOverlayContentOne] = useState(true);
  const [showBuildingOverlayContentTwo, setShowBuildingOverlayContentTwo] = useState(false);

  const [urlError, setUrlError] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  const [saving, setSaving] = useState('');

  const [templateChanged, setTemplateChanged] = useState(false);
  const [templateSelection, setTemplateSelection] = useState('');
  const [buildingMessage, setBuildingMessage] = useState('Building your profile');

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setLoggedIn(true)
          loggedInRoute(user)
          setUserData(user)
        } else {
          setLoggedIn(false)
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
      setCurrentProfile(doc.data())
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
    })
  }

  const changeTemplate = (template) => {
    setTemplateChanged(true)
    setTemplateSelection(template)
  }

  let templates = [
    {
      'id': 0,
      'label': 'Original',
      'string': 'original',
      'img': '/images/profile-preview.png',
      'active': templateSelection == 'original'
    },
    {
      'id': 1,
      'label': 'Metro',
      'string': 'metro',
      'img': '/images/metro-template.jpeg',
      'active': templateSelection == 'metro'
    },
    {
      'id': 2,
      'label': 'Metro Night',
      'string': 'metro_night',
      'img': '/images/metro-night-template.jpeg',
      'active': templateSelection == 'metro_night'
    },
    {
      'id': 3,
      'label': 'Document',
      'string': 'document',
      'img': '/images/document-template.jpeg',
      'active': templateSelection == 'document'
    },
  ]

  const handleShowBuildingOverlay = () => {
    document.body.style.overflowY = "hidden";
    setShowBuildingOverlay(true)
    setTimeout(
      () => setBuildingMessage('Sprinkling some magic'), 
      2000
    );
    setTimeout(
      () => setBuildingMessage('Applying finishing touches'), 
      4000
    );
    setTimeout(
      () => {
        setShowBuildingOverlayContentOne(false)
      },
      8000
    );
    setTimeout(
      () => {
        setShowBuildingOverlayContentTwo(true)
      },
      9000
    );
    setTimeout(
      () => {
        let newUserContext = userContext;
        newUserContext.stage = 'complete'
        newUserContext.template = templateSelection;
        setUserContext(newUserContext)
      },
      13000
    );
    setTimeout(
      () => {
        document.body.style.overflowY = "auto";
        router.push(currentProfile.profileUrl)
      },
      13001
    );

  }

  const handleSave = (e) => {
    e.preventDefault();

    if (!templateChanged) {
      setChoiceError('Please choose a template')
    }
    fire.firestore().collection('users').doc(userData.uid).update({
      'stage': 'complete',
      'template': templateSelection,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      handleShowBuildingOverlay()
    })
    // .then(() => {
    //   let newUserContext = userContext;
    //   newUserContext.stage = 'complete'
    //   newUserContext.template = templateSelection;
    //   setUserContext(newUserContext)
    // })
    // .then(() => {
    //   router.push(currentProfile.profileUrl)
    // })
    .catch((err) => {
      // console.log(err.code, err.message)
      toast(err.message)
    })
  }

  return (
    <div className="bg-light-900" style={{minHeight:'100vh'}}>
     
      <Head>
        <title>Choose a template</title>
      </Head>
      <Header hideShadow />
      <Container className="d-flex flex-column align-items-center py-5" style={{ maxWidth: "640px"}}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high text-center mb-3">Choose a template</h2>
          :
          <h3 className="text-dark-high text-center mb-3">Choose a template</h3>
        }
        <p className="large text-center" style={{maxWidth: '480px'}}>You can always change this later</p>
        <div className="w-100" style={{ maxWidth: "640px" }}>
          <div className="d-flex flex-column p-4 p-md-5 align-items-center" style={{gap: '16px'}}>
            {templates.map((template, index) => 
              <div role="button" onClick={() => changeTemplate(template.string)} className={`d-flex flex-column radius-3 p-3 w-100 ${styles.planCard} ${template.active && styles.active}`}>
                <p className="large font-weight-bold text-dark-high">{template.label}</p>
                <div className={styles.imageWrapper}>
                  <Image
                    src={template.img}
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
              </div>
            )}
            <div className="d-flex flex-column align-items-center my-4 my-sm-5 w-100">
              {screenWidth > 575 ?
                <button type="button" onClick={handleSave} className="btn primary high w-100" style={{maxWidth: '320px'}}disabled={!templateChanged || saving}>{!saving ? 'Create my profile' : 'Saving'}</button>
              :
                <button type="button" onClick={handleSave} className="btn primary high w-100" disabled={!templateChanged || saving}>{!saving ? 'Create my profile' : 'Saving'}</button>
              }
            </div>
          </div>
        </div>
      </Container>
      {showBuildingOverlay &&
      <div className="d-flex flex-column align-items-center justify-content-center position-fixed w-100 h-100" style={{top: 0, left:0}}>
        <div className={`d-flex flex-column align-items-center justify-content-center bg-primary-900 position-fixed ${pageStyles.overlayBackground}`} style={{ zIndex:2}}></div>
        { showBuildingOverlayContentOne &&
          <div className={`d-flex flex-column align-items-center justify-content-center position-fixed w-100 h-100 ${pageStyles.overlayContentOne}`} style={{top: 0, left:0, zIndex:3}}>
            <Lottie options={defaultOptions} height={160} width={160} />
            <h4 className="text-light-high text-center mb-3">{buildingMessage}</h4>
            {/* <button type="button" onClick={() => handleShowBuildingOverlay()}>Overflow hidden</button> */}
          </div>
        }
        { showBuildingOverlayContentTwo &&
          <div className={`d-flex flex-column align-items-center justify-content-center position-fixed w-100 h-100 ${pageStyles.overlayContentTwo}`} style={{top: 0, left:0, zIndex:2}}>
            <h4 className="text-light-high text-center mb-3">Welcome to your Vitaely profile</h4>
          </div>
        }
      </div>
      }
    </div>
  )

}

export default Template