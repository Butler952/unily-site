import { useState, useEffect, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import { toast } from 'react-toastify';
// import testResponse from './testResponse';
import mixpanelConfig from 'config/mixpanel-config';
import { Container, ProgressBar } from 'react-bootstrap';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import ICONS from '../../components/icon/IconPaths';
import { UserContext } from '../_app';

const Avatar = () => {
  const { userContext, setUserContext } = useContext(UserContext);

  const [saving, setSaving] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [userData, setUserData] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userResult, setUserResult] = useState('');
  const [currentProfile, setCurrentProfile] = useState('');

  const [urlError, setUrlError] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  const [screenWidth, setScreenWidth] = useState('');

  const [avatar, setAvatar] = useState('')
  const [avatarImage, setAvatarImage] = useState('')
  const [avatarChanged, setAvatarChanged] = useState('')

  const avatarChange = (value) => {
    setAvatar(value),
    setAvatarChanged(true),
    setAvatarImage(URL.createObjectURL(value))
  }

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    document.body.style.background = '#FFFFFF';
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Avatar');
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
          router.push("/profile")
        }
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    })
  }

  const handleAddAvatar = (e) => {
    e.preventDefault();

    setSaving(true)

    let filename = `images/${userData.uid}/profile_picture.jpg`

    var metadata = {
      contentType: 'image/jpeg',
      name: filename
    };

    var uploadTask = fire.storage().ref().child(filename).put(avatar, metadata);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case fire.storage.TaskState.PAUSED: // or 'paused'
            // console.log('Upload is paused');
            break;
          case fire.storage.TaskState.RUNNING: // or 'running'
            // console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            toast("Upload cancelled")
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL()
          .then((downloadURL) => {
            fire.firestore().collection('users').doc(userData.uid).update({
              'profile.profile_pic_url': downloadURL,
              stage: '/setup/headline',
              lastUpdated: fire.firestore.FieldValue.serverTimestamp()
            })
              .then((result) => {
                let newUserContext = userContext;
                newUserContext.profile.profile_pic_url = downloadURL,
                newUserContext.stage = '/setup/headline';
                setUserContext(newUserContext)
              })
              .then(() => {
                mixpanel.track('Avatar added');
              })
              .then(() => {
                router.push('/setup/headline')
              })
              .catch((error) => {
                setSaving(false)
                console.log(error)
                toast("Unable to upload avatar")
              });
          })
      }
    );
  }

  const handleManualSubmit = (e) => {
    e.preventDefault();

    setSaving(true);

    fire.firestore().collection('users').doc(userData.uid).update({
      stage: '/setup/headline',
      lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.stage = '/setup/headline';
        setUserContext(newUserContext)
      })
      // .then(() => {
      //   setUserContext({
      //     stage: '/setup/headline',
      //   })
      // })
      .then(() => {
        if (currentProfile.receiveEmails) {
          fire.firestore().collection('mailingList').doc(userData.uid).update({
            'custom_fields.stage': '/setup/headline',
            lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
          })
        }
      })
      .then(() => {
        mixpanel.init(mixpanelConfig); 
        mixpanel.track('Avatar skipped');
      })
      .then(() => {
        router.push('/setup/headline')
      })
      .catch(error => console.log('error', error));
  }

  const hiddenFileInput = useRef(null);

  const handleChangeImage = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    avatarChange(event.target.files[0])
  }

  const handleDeleteImage = (e) => {
    e.preventDefault();
    avatarChange('')
  }

  const handleBack = (e) => {
    e.preventDefault();

    setSaving(true);

    fire.firestore().collection('users').doc(userData.uid).update({
      stage: '/setup/name',
      lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.stage = '/setup/name';
        setUserContext(newUserContext)
      })
      .then(() => {
        if (currentProfile.receiveEmails) {
          fire.firestore().collection('mailingList').doc(userData.uid).update({
            'custom_fields.stage': '/setup/name',
            lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
          })
        }
      })
      .then(() => {
        router.push('/setup/name')
      })
      .catch(error => console.log('error', error));
  }

  return (
    <div className="bg-light-900" style={{minHeight:'100vh'}}>
     
      <Head>
        <title>Upload an avatar</title>
      </Head>
      <Header hideShadow />

      <Container className="d-flex flex-column align-items-center my-5 py-5" style={{ maxWidth: "640px"}}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high text-center mb-2">Upload an avatar</h2>
          :
          <h3 className="text-dark-high text-center mb-2">Upload an avatar</h3>
        }
        <p className="large text-center" style={{maxWidth: '480px'}}>{!avatarChanged ? 'Let the world see your face' : 'Looking good!'}</p>

        {/* <div className="card m-auto" style={{ maxWidth: "640px" }}> */}
        <div className="d-flex flex-column w-100 my-4" style={{maxWidth: '320px'}}>
          <div className="d-flex flex-column align-items-center w-100 gap-4">
            {avatarChanged && avatar !== '' ?
            <div className={`position-relative overflow-hidden`} style={{ backgroundImage: `url(${avatarImage})`, backgroundPosition: 'center', backgroundSize: 'cover', borderRadius: '100%', height: '160px', width: '160px' }}></div>
            :
            <button type="button" onClick={handleChangeImage} disabled={saving} style={{border: 'none', background: 'none', borderRadius: '100%', overflow: 'hidden'}}>
              <div className="d-flex flex-column align-items-center justify-content-center bg-primary-200 radius-5 p-4" style={{width: '160px', height: '160px'}}>
                <svg viewBox="0 0 24 24" width={'24px'} style={{minWidth: '48px'}} className="fill-primary-700">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </div>
            </button>
            }
            {avatarChanged ?

              <div className="d-flex flex-column align-items-start justify-content-between my-4 my-sm-5 gap-4 w-100">
                <button type="button" className="btn primary high w-100 order-0" disabled={saving} onClick={handleAddAvatar}>Upload avatar</button>
                <div className="d-flex flex-column flex-sm-row align-items-start justify-content-between gap-3 w-100">
                  <div className="d-flex flex-column flex-sm-row align-items-start justify-content-between order-0 order-sm-1 gap-3 w-100 w-sm-auto">
                    <button type="button" onClick={handleChangeImage} className="btn dark medium w-100 order-1 order-sm-0" disabled={saving}>Change image</button>
                    {/* <button type="button" className="btn dark low w-100 w-sm-auto" disabled={saving} onClick={handleChangeImage}>Change image</button> */}
                  </div>
                  {screenWidth > 575 ?
                    <button type="button" onClick={(e) => handleBack(e)} disabled={saving} className="btn dark medium icon-only mr-3">
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.ARROW_LEFT}></path>
                      </svg>
                    </button>
                  :
                    <button type="button" onClick={(e) => handleBack(e)} disabled={saving} className="btn dark medium w-100 w-sm-auto order-1 order-sm-0">Back</button>
                  }
                </div>
              </div>
              :
              <div className="d-flex flex-column align-items-start justify-content-between my-4 my-sm-5 gap-4 w-100">
                <button type="button" className="btn primary high w-100 order-0" disabled={saving} onClick={handleChangeImage}>Choose a file</button>
                <div className="d-flex flex-column flex-sm-row align-items-start justify-content-between gap-3 w-100">
                  <div className="d-flex flex-column flex-sm-row align-items-start justify-content-between order-0 order-sm-1 gap-3 w-100 w-sm-auto">
                    <button type="button" onClick={(e) => handleManualSubmit(e)} className="btn dark medium w-100 order-1 order-sm-0" disabled={saving}>Skip for now</button>
                  </div>
                  {screenWidth > 575 ?
                    <button type="button" onClick={(e) => handleBack(e)} disabled={saving} className="btn dark medium icon-only mr-3">
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.ARROW_LEFT}></path>
                      </svg>
                    </button>
                  :
                    <button type="button" onClick={(e) => handleBack(e)} disabled={saving} className="btn dark low w-100 w-sm-auto order-1 order-sm-0">Back</button>
                  }
                </div>
              </div>
              
              // <div className="d-flex flex-column align-items-center mb-4 mb-sm-5 gap-3">
              //   <button type="button" className="btn dark high w-100" disabled={saving} onClick={handleChangeImage}>Choose a file</button>
              //   <button type="button" onClick={(e) => handleManualSubmit(e)} className="btn dark low w-100" disabled={saving}>Skip for now</button>
              // </div>
            }
            <input
              type="file"
              ref={hiddenFileInput}
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            {/* <button className="btn dark medium small" onClick={uploadProfilePicture(profilePictureFile)}>Upload</button> */}
          </div>
          {/* {loadingState === '' ?
            <div className="d-flex flex-column align-items-center w-100 gap-4">
              <div className="d-flex flex-column align-items-center justify-content-center bg-primary-200 radius-5 p-4" style={{width: '160px', height: '160px'}}>
                <a href="https://www.linkedin.com/in/" target="_blank">
                  <svg viewBox="0 0 24 24" width={'24px'} style={{minWidth: '48px'}} className="fill-primary-700">
                    <path d={ICONS.PLUS}></path>
                  </svg>
                </a>
              </div>
              <div className="d-flex flex-column align-items-center mb-4 mb-sm-5 gap-3">
                <div className="d-flex flex-column gap-3">
                  <button type="button" className="btn primary high w-100">Choose a file</button>
                </div>
                <button type="button" onClick={(e) => handleManualSubmit(e)} className="btn primary low w-100" disabled={saving}>Skip for now</button>
              </div>
              <br />
            </div>
            :
            <div className="py-5">
              <p className="large text-dark-high">{loadingState}</p>
              {<ProgressBar animated now={loadingState === 'Fetching data from LinkedIn' ? 10 : (loadingState === 'Storing your data' ? 60 : (loadingState === 'Sync successfully completed' ? 100 : null))} /> }
            </div>
          } */}
        </div>
      </Container>
    </div>
  )

}

export default Avatar