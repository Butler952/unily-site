import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditFeature = ({
  user,
  editProfileModalIndex,
  featuredImage,
  setFeaturedImage,
  featuredImageChanged,
  setFeaturedImageChanged,
  featuredName,
  setFeaturedName,
  featuredNameChanged,
  setFeaturedNameChanged,
  featuredNameError,
  setFeaturedNameError,
  featuredUrl,
  setFeaturedUrl,
  featuredUrlChanged,
  setFeaturedUrlChanged,
  featuredUrlError,
  setFeaturedUrlError,
  featuredShowDeleteFeatureModal,
  setFeaturedShowDeleteFeatureModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [originalFeatured, setOriginalFeatured] = useState(userContext.profile.featured);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const featuredImageChange = (value) => {
    setFeaturedImage(value),
    setFeaturedImageChanged(true)
  }

  const featuredNameChange = (value) => {
    setFeaturedName(value),
    setFeaturedNameChanged(true),
    setFeaturedNameError('')
  }

  const featuredUrlChange = (value) => {
    setFeaturedUrl(value),
    setFeaturedUrlChanged(true),
    setFeaturedUrlError('')
  }

  const updateFeatured = (index) => {

    if (featuredNameChanged) {
      originalFeatured[index].name = featuredName
    }
    if (featuredUrlChanged) {
      originalFeatured[index].url = featuredUrl
    }

  }
  
  const handleEditFeaturedSubmit = (e) => {
    e.preventDefault();

    if (featuredNameChanged && featuredName === '') {
      setFeaturedCompanyError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateFeatured(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.featured': originalFeatured,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.featured = originalFeatured;
      setUserContext(newUserContext)
    })
    .then(() => {
      setSubmitting(false)
      toast("Feature updated")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to update feature")
      //console.error("Error adding document: ", error);
    });
  }

  const hiddenFileInput = useRef(null);

  const handleChangeLogo = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    // setProfilePictureFile(event.target.files[0]);
    uploadLogo(event.target.files[0])
  }

  const uploadLogo = (file) => {

    setUploading(true)

    if (file == null) return;

    let uid = userContext.profile.featured[editProfileModalIndex].logo_ref ? userContext.profile.featured[editProfileModalIndex].logo_ref : uuidv4()
    let filename = `images/${user}/featured/${userContext.profile.featured[editProfileModalIndex].logo_ref ? userContext.profile.featured[editProfileModalIndex].logo_ref : uid}.jpg`

    var metadata = {
      contentType: 'image/jpeg',
      name: filename
    };

    var uploadTask = fire.storage().ref().child(filename).put(file, metadata);

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
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          originalFeatured[editProfileModalIndex].logo_url = downloadURL
          originalFeatured[editProfileModalIndex].logo_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.featured': originalFeatured,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.featured[editProfileModalIndex].logo_url = downloadURL;
            newUserContext.profile.featured[editProfileModalIndex].logo_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            featuredImageChange(downloadURL)
          })
          .then(() => {
            setUploading(false)
            toast("Logo updated")
          })
          .catch((error) => {
            setUploading(false)
            toast("Unable to upload logo")
            // toast("Unable to upload logo")
          });
        });
        // Add this link to firestore
        
      }
    );
  }

  const handleDeleteLogo = (e) => {
    e.preventDefault();

    setDeletingLogo(true)

    // let filename = originalFeatured[editProfileModalIndex].logo_url
    // let filename = userContext.profile.featured[editProfileModalIndex].logo_url
    let filename = `images/${user}/featured/${userContext.profile.featured[editProfileModalIndex].logo_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalFeatured[editProfileModalIndex].logo_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.featured': originalFeatured,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.featured[editProfileModalIndex].logo_url = null;
        setUserContext(newUserContext)
        featuredImageChange('')
      })
      .then(() => {
        setDeletingLogo(false)
        toast("Logo deleted")
      })
      .catch((error) => {
        setDeletingLogo(false)
        toast("Unable to delete logo")
        console.log(error)
      });
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  }

  // const deleteFeature = (index) => {
  //   delete originalFeatured[index]
  // }

  const handleDeleteFeatureShow = () => {
    setFeaturedShowDeleteFeatureModal(true)
  }

  const handleDeleteFeatureClose = () => {
    setFeaturedShowDeleteFeatureModal(false)
  }

  const handleDeleteFeatureSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalFeatured[editProfileModalIndex]
    originalFeatured.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.featured': originalFeatured,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setFeaturedShowDeleteFeatureModal(false)
        setDeleting(false)
        toast("Feature deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete feature")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditFeaturedSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Image</p>
            { featuredImageChanged ? (featuredImage !== '' ? 
              <>
                {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                  <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${featuredImageChanged ? featuredImage : (userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url : '')})` }}>
                  </div>
                </div> */}
                {/* <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.featured[editProfileModalIndex].logo_url})` }}></div> */}

                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  <div>
                    <img src={featuredImageChanged ? featuredImage : (userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url : '')} style={{maxWidth: '240px'}} />
                  </div>
                  <div className="d-flex flex-row align-items-center" style={{ gap: '16px' }}>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeLogo}>{!uploading ? 'Change' : 'Uploading'}</button>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={deletingLogo} onClick={handleDeleteLogo}>{!deletingLogo ? 'Delete' : 'Deleting'}</button>
                  </div>
                </div>
              </>
            :
              <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeLogo}>{!uploading ? 'Upload' : 'Uploading'}</button>
            )            
            : 
              ( userContext && 
                userContext.profile && 
                userContext.profile.featured[editProfileModalIndex] && 
                userContext.profile.featured[editProfileModalIndex].logo_url &&
                userContext.profile.featured[editProfileModalIndex].logo_url ?
                <>
                  {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                    <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${featuredImageChanged ? featuredImage : (userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url : '')})` }}>
                    </div>
                  </div> */}
                  {/* <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.featured[editProfileModalIndex].logo_url})` }}></div> */}
                  <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                    <div>
                      <img src={featuredImageChanged ? featuredImage : (userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url : '')} style={{maxWidth: '240px'}} />
                    </div>
                    <div className="d-flex flex-row align-items-center" style={{ gap: '16px' }}>
                      <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeLogo}>{!uploading ? 'Change' : 'Uploading'}</button>
                      <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={deletingLogo} onClick={handleDeleteLogo}>{!deletingLogo ? 'Delete' : 'Deleting'}</button>
                    </div>
                  </div>
                </>
              :
                <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeLogo}>{!uploading ? 'Upload' : 'Uploading'}</button>
              )
            }
            <input 
              type="file" 
              ref={hiddenFileInput}
              accept="image/*" 
              onChange={handleChange} 
              style={{display: 'none'}}
            />
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Name</p>
            <input
              type="text"
              className={featuredNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={featuredNameChanged ? featuredName : (userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].name && userContext.profile.featured[editProfileModalIndex].name !== undefined ? userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].name && userContext.profile.featured[editProfileModalIndex].name : '')}
              onChange={({ target }) => featuredNameChange(target.value)}
            />
            {featuredNameError !== '' ? <p className="small text-error-high mt-2">{featuredNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={featuredUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={featuredUrlChanged ? featuredUrl : (userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].url && userContext.profile.featured[editProfileModalIndex].url !== undefined ? userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].url && userContext.profile.featured[editProfileModalIndex].url : '')}
              onChange={({ target }) => featuredUrlChange(target.value)}
            />
            {featuredUrlError !== '' ? <p classUrl="small text-error-high mt-2">{featuredUrlError}</p> : null}
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteFeatureShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeleteFeatureShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
              <svg viewBox="0 0 24 24">
                <path d={ICONS.DELETE}></path>
              </svg>
            </button>
            <div className="d-flex flex-column flex-sm-row order-0 order-sm-1" style={{gap: '12px'}}>
              <button type="button" onClick={handleBack} className="btn dark medium w-100 w-sm-auto" disabled={submitting}>Cancel</button>
              <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Save' : 'Saving...'}</button>
            </div>
          </div>
        </form>
      </div>

      <Modal
        show={featuredShowDeleteFeatureModal} 
        onHide={handleDeleteFeatureClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete feature?</h5>
          </div>
          <button onClick={handleDeleteFeatureClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete feature</h5>
            </div>
            <button onClick={handleDeleteFeatureClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this feature?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.featured &&
              userContext.profile.featured[editProfileModalIndex] &&
            <div className="d-flex flex-column justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              {/* { userContext.profile.featured[editProfileModalIndex].logo_url ?
              <div>
                <img className={styles.featureImage} src={userContext.profile.featured[editProfileModalIndex].logo_url ? userContext.profile.featured[editProfileModalIndex].logo_url : null} style={{width: '64px'}}/>
              </div>
              : ''} */}
              { userContext.profile.featured[editProfileModalIndex].logo_url &&
                <div>
                  <img src={featuredImageChanged ? featuredImage : (userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.featured[editProfileModalIndex] && userContext.profile.featured[editProfileModalIndex].logo_url && userContext.profile.featured[editProfileModalIndex].logo_url : '')} style={{maxWidth: '240px'}} />
                </div>
              }
              <div className="w-100">
                {/* <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.featured[editProfileModalIndex].title}</p> */}
                {/* <a target="_blank" href={userContext.profile.featured[editProfileModalIndex].company_linkedin_profile_url} className="text-decoration-none"> */}
                <h4 className="large text-dark-high mb-0">{userContext.profile.featured[editProfileModalIndex].name}</h4>
                {/* </a> */}
                {/* <p className="text-dark-low mb-0">
                  {userContext.profile.featured[editProfileModalIndex].featureed_at ? (userContext.profile.featured[editProfileModalIndex].featureed_at.month ? convertMonth(userContext.profile.featured[editProfileModalIndex].featureed_at.month) + " " : '') : null}
                  {userContext.profile.featured[editProfileModalIndex].featureed_at ? (userContext.profile.featured[editProfileModalIndex].featureed_at.year ? userContext.profile.featured[editProfileModalIndex].featureed_at.year + " " : null) : null}
                 </p> */}
                {/* {userContext.profile.featured[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.featured[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteFeatureClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteFeatureSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditFeature;