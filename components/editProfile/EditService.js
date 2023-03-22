import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditService = ({
  user,
  editProfileModalIndex,
  servicesImage,
  setServicesImage,
  servicesImageChanged,
  setServicesImageChanged,
  servicesName,
  setServicesName,
  servicesNameChanged,
  setServicesNameChanged,
  servicesNameError,
  setServicesNameError,
  servicesUrl,
  setServicesUrl,
  servicesUrlChanged,
  setServicesUrlChanged,
  servicesUrlError,
  setServicesUrlError,
  servicesDescription,
  setServicesDescription,
  servicesDescriptionChanged,
  setServicesDescriptionChanged,
  servicesDescriptionError,
  setServicesDescriptionError,
  servicesShowDeleteServiceModal,
  setServicesShowDeleteServiceModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [originalServices, setOriginalServices] = useState(userContext.profile.services);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const servicesImageChange = (value) => {
    setServicesImage(value),
    setServicesImageChanged(true)
  }

  const servicesNameChange = (value) => {
    setServicesName(value),
    setServicesNameChanged(true),
    setServicesNameError('')
  }

  const servicesUrlChange = (value) => {
    setServicesUrl(value),
    setServicesUrlChanged(true),
    setServicesUrlError('')
  }

  const servicesDescriptionChange = (value) => {
    setServicesDescription(value),
    setServicesDescriptionChanged(true),
    setServicesDescriptionError('')
  }

  const updateServices = (index) => {

    if (servicesNameChanged) {
      originalServices[index].name = servicesName
    }
    if (servicesUrlChanged) {
      originalServices[index].url = servicesUrl
    }
    if (servicesDescriptionChanged) {
      originalServices[index].description = servicesDescription
    }

  }
  
  const handleEditServicesSubmit = (e) => {
    e.preventDefault();

    if (servicesNameChanged && servicesName === '') {
      setServicesCompanyError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateServices(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.services': originalServices,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.services = originalServices;
      setUserContext(newUserContext)
    })
    .then(() => {
      setSubmitting(false)
      toast("Service updated")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to update service")
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

    let uid = userContext.profile.services[editProfileModalIndex].logo_ref ? userContext.profile.services[editProfileModalIndex].logo_ref : uuidv4()
    let filename = `images/${user}/services/${userContext.profile.services[editProfileModalIndex].logo_ref ? userContext.profile.services[editProfileModalIndex].logo_ref : uid}.jpg`

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
          originalServices[editProfileModalIndex].logo_url = downloadURL
          originalServices[editProfileModalIndex].logo_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.services': originalServices,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.services[editProfileModalIndex].logo_url = downloadURL;
            newUserContext.profile.services[editProfileModalIndex].logo_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            servicesImageChange(downloadURL)
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

    // let filename = originalServices[editProfileModalIndex].logo_url
    // let filename = userContext.profile.services[editProfileModalIndex].logo_url
    let filename = `images/${user}/services/${userContext.profile.services[editProfileModalIndex].logo_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalServices[editProfileModalIndex].logo_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.services': originalServices,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.services[editProfileModalIndex].logo_url = null;
        setUserContext(newUserContext)
        servicesImageChange('')
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

  // const deleteService = (index) => {
  //   delete originalServices[index]
  // }

  const handleDeleteServiceShow = () => {
    setServicesShowDeleteServiceModal(true)
  }

  const handleDeleteServiceClose = () => {
    setServicesShowDeleteServiceModal(false)
  }

  const handleDeleteServiceSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalServices[editProfileModalIndex]
    originalServices.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.services': originalServices,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setServicesShowDeleteServiceModal(false)
        setDeleting(false)
        toast("Service deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete service")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditServicesSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Image</p>
            { servicesImageChanged ? (servicesImage !== '' ? 
              <>
                {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                  <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${servicesImageChanged ? servicesImage : (userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].logo_url && userContext.profile.services[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].logo_url && userContext.profile.services[editProfileModalIndex].logo_url : '')})` }}>
                  </div>
                </div> */}
                <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.services[editProfileModalIndex].logo_url})` }}></div>

                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  {/* <div className="w-100 position-relative" style={{paddingTop: '56.25%'}}>
                    <img src={servicesImageChanged ? servicesImage : (userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].logo_url && userContext.profile.services[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].logo_url && userContext.profile.services[editProfileModalIndex].logo_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
                  </div> */}
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
                userContext.profile.services[editProfileModalIndex] && 
                userContext.profile.services[editProfileModalIndex].logo_url &&
                userContext.profile.services[editProfileModalIndex].logo_url ?
                <>
                  {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                    <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${servicesImageChanged ? servicesImage : (userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].logo_url && userContext.profile.services[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].logo_url && userContext.profile.services[editProfileModalIndex].logo_url : '')})` }}>
                    </div>
                  </div> */}
                  <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.services[editProfileModalIndex].logo_url})` }}></div>
                  <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                    {/* <div className="w-100 position-relative" style={{paddingTop: '100%'}}>
                      <img src={servicesImageChanged ? servicesImage : (userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].logo_url && userContext.profile.services[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].logo_url && userContext.profile.services[editProfileModalIndex].logo_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
                    </div> */}
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
              className={servicesNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={servicesNameChanged ? servicesName : (userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].name && userContext.profile.services[editProfileModalIndex].name !== undefined ? userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].name && userContext.profile.services[editProfileModalIndex].name : '')}
              onChange={({ target }) => servicesNameChange(target.value)}
            />
            {servicesNameError !== '' ? <p className="small text-error-high mt-2">{servicesNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={servicesUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={servicesUrlChanged ? servicesUrl : (userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].url && userContext.profile.services[editProfileModalIndex].url !== undefined ? userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].url && userContext.profile.services[editProfileModalIndex].url : '')}
              onChange={({ target }) => servicesUrlChange(target.value)}
            />
            {servicesUrlError !== '' ? <p classUrl="small text-error-high mt-2">{servicesUrlError}</p> : null}
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={servicesDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={servicesDescriptionChanged ? servicesDescription : (
                userContext &&
                userContext.profile &&
                userContext.profile.services &&
                userContext.profile.services[editProfileModalIndex] &&
                userContext.profile.services[editProfileModalIndex].description !== undefined ? userContext.profile.services[editProfileModalIndex].description : '')
              }
              onChange={({ target }) => servicesDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {servicesDescriptionError !== '' ? <p className="small text-error-high mt-2">{servicesDescriptionError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <input
              type="text"
              className={servicesDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={servicesDescriptionChanged ? servicesDescription : (userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].description && userContext.profile.services[editProfileModalIndex].description !== undefined ? userContext && userContext.profile && userContext.profile.services[editProfileModalIndex] && userContext.profile.services[editProfileModalIndex].description && userContext.profile.services[editProfileModalIndex].description : '')}
              onChange={({ target }) => servicesDescriptionChange(target.value)}
            />
            {servicesDescriptionError !== '' ? <p className="small text-error-high mt-2">{servicesDescriptionError}</p> : null}
          </div> */}
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteServiceShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeleteServiceShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
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
        show={servicesShowDeleteServiceModal} 
        onHide={handleDeleteServiceClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete service?</h5>
          </div>
          <button onClick={handleDeleteServiceClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete service</h5>
            </div>
            <button onClick={handleDeleteServiceClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this service?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.services &&
              userContext.profile.services[editProfileModalIndex] &&
            <div className="d-flex flex-column justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              {/* { userContext.profile.services[editProfileModalIndex].logo_url ?
              <div>
                <img className={styles.serviceImage} src={userContext.profile.services[editProfileModalIndex].logo_url ? userContext.profile.services[editProfileModalIndex].logo_url : null} style={{width: '64px'}}/>
              </div>
              : ''} */}
              { userContext.profile.services[editProfileModalIndex].logo_url &&
                <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.services[editProfileModalIndex].logo_url})` }}></div>
              }
              <div className="w-100">
                {/* <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.services[editProfileModalIndex].title}</p> */}
                {/* <a target="_blank" href={userContext.profile.services[editProfileModalIndex].company_linkedin_profile_url} className="text-decoration-none"> */}
                <h4 className="large text-dark-high mb-0">{userContext.profile.services[editProfileModalIndex].name}</h4>
                {/* </a> */}
                {/* <p className="text-dark-low mb-0">
                  {userContext.profile.services[editProfileModalIndex].serviceed_at ? (userContext.profile.services[editProfileModalIndex].serviceed_at.month ? convertMonth(userContext.profile.services[editProfileModalIndex].serviceed_at.month) + " " : '') : null}
                  {userContext.profile.services[editProfileModalIndex].serviceed_at ? (userContext.profile.services[editProfileModalIndex].serviceed_at.year ? userContext.profile.services[editProfileModalIndex].serviceed_at.year + " " : null) : null}
                 </p> */}
                {/* {userContext.profile.services[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.services[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteServiceClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteServiceSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditService;