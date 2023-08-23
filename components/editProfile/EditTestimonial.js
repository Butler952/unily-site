import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditTestimonial = ({
  user,
  editProfileModalIndex,
  testimonialsAvatar,
  setTestimonialsAvatar,
  testimonialsAvatarChanged,
  setTestimonialsAvatarChanged,
  testimonialsName,
  setTestimonialsName,
  testimonialsNameChanged,
  setTestimonialsNameChanged,
  testimonialsNameError,
  setTestimonialsNameError,
  testimonialsTitle,
  setTestimonialsTitle,
  testimonialsTitleChanged,
  setTestimonialsTitleChanged,
  testimonialsTitleError,
  setTestimonialsTitleError,
  testimonialsUrl,
  setTestimonialsUrl,
  testimonialsUrlChanged,
  setTestimonialsUrlChanged,
  testimonialsUrlError,
  setTestimonialsUrlError,
  testimonialsDate,
  setTestimonialsDate,
  testimonialsDateChanged,
  setTestimonialsDateChanged,
  testimonialsDateError,
  setTestimonialsDateError,
  testimonialsDescription,
  setTestimonialsDescription,
  testimonialsDescriptionChanged,
  setTestimonialsDescriptionChanged,
  testimonialsDescriptionError,
  setTestimonialsDescriptionError,
  testimonialsShowDeleteTestimonialModal,
  setTestimonialsShowDeleteTestimonialModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingAvatar, setDeletingAvatar] = useState(false);
  const [originalTestimonials, setOriginalTestimonials] = useState(userContext.profile.testimonials);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const testimonialsAvatarChange = (value) => {
    setTestimonialsAvatar(value),
    setTestimonialsAvatarChanged(true)
  }

  const testimonialsNameChange = (value) => {
    setTestimonialsName(value),
    setTestimonialsNameChanged(true),
    setTestimonialsNameError('')
  }

  const testimonialsTitleChange = (value) => {
    setTestimonialsTitle(value),
    setTestimonialsTitleChanged(true),
    setTestimonialsTitleError('')
  }

  const testimonialsUrlChange = (value) => {
    setTestimonialsUrl(value),
    setTestimonialsUrlChanged(true),
    setTestimonialsUrlError('')
  }

  const testimonialsDateChange = (value) => {
    setTestimonialsDate(value),
    setTestimonialsDateChanged(true),
    setTestimonialsDateError('')
  }

  const testimonialsDescriptionChange = (value) => {
    setTestimonialsDescription(value),
    setTestimonialsDescriptionChanged(true),
    setTestimonialsDescriptionError('')
  }

  const updateTestimonials = (index) => {

    if (testimonialsNameChanged) {
      originalTestimonials[index].name = testimonialsName
    }
    if (testimonialsTitleChanged) {
      originalTestimonials[index].title = testimonialsTitle
    }
    if (testimonialsUrlChanged) {
      originalTestimonials[index].url = testimonialsUrl
    }
    if (testimonialsDateChanged) {
      let dateMonth = Number(testimonialsDate.split('-')[1]);
      let dateYear = Number(testimonialsDate.split('-')[0]);
      originalTestimonials[index].posted_at = 
        { 
          'day': 1,
          'month': dateMonth,
          'year': dateYear
        }
    }
    if (testimonialsDescriptionChanged) {
      originalTestimonials[index].description = testimonialsDescription
    }

  }
  
  const handleEditTestimonialsSubmit = (e) => {
    e.preventDefault();

    if (testimonialsNameChanged && testimonialsName === '') {
      setTestimonialsCompanyError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateTestimonials(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.testimonials': originalTestimonials,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.testimonials = originalTestimonials;
      setUserContext(newUserContext)
    })
    .then(() => {
      setSubmitting(false)
      toast("Testimonial updated")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to update testimonial")
      //console.error("Error adding document: ", error);
    });
  }

  const hiddenAvatarFileInput = useRef(null);

  const handleChangeAvatar = (event) => {
    hiddenAvatarFileInput.current.click();
  };

  function handleChangeAvatarUpload(event) {
    // setProfilePictureFile(event.target.files[0]);
    uploadAvatar(event.target.files[0])
  }

  const uploadAvatar = (file) => {

    setUploadingAvatar(true)

    if (file == null) return;

    let uid = userContext.profile.testimonials[editProfileModalIndex].avatar_ref ? userContext.profile.testimonials[editProfileModalIndex].avatar_ref : uuidv4()
    let filename = `images/${user}/testimonials/avatar/${userContext.profile.testimonials[editProfileModalIndex].avatar_ref ? userContext.profile.testimonials[editProfileModalIndex].avatar_ref : uid}.jpg`

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
          originalTestimonials[editProfileModalIndex].avatar_url = downloadURL
          originalTestimonials[editProfileModalIndex].avatar_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.testimonials': originalTestimonials,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.testimonials[editProfileModalIndex].avatar_url = downloadURL;
            newUserContext.profile.testimonials[editProfileModalIndex].avatar_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            testimonialsAvatarChange(downloadURL)
          })
          .then(() => {
            setUploadingAvatar(false)
            toast("Avatar updated")
          })
          .catch((error) => {
            setUploadingAvatar(false)
            toast("Unable to upload avatar")
            // toast("Unable to upload logo")
          });
        });
        // Add this link to firestore
        
      }
    );
  }

  const handleDeleteAvatar = (e) => {
    e.preventDefault();

    setDeletingAvatar(true)

    // let filename = originalTestimonials[editProfileModalIndex].avatar_url
    // let filename = userContext.profile.testimonials[editProfileModalIndex].avatar_url
    let filename = `images/${user}/testimonials/avatar/${userContext.profile.testimonials[editProfileModalIndex].avatar_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalTestimonials[editProfileModalIndex].avatar_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.testimonials': originalTestimonials,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.testimonials[editProfileModalIndex].avatar_url = null;
        setUserContext(newUserContext)
        testimonialsAvatarChange('')
      })
      .then(() => {
        setDeletingAvatar(false)
        toast("Avatar deleted")
      })
      .catch((error) => {
        setDeletingAvatar(false)
        toast("Unable to delete avatar")
        console.log(error)
      });
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  }

  // const deleteTestimonial = (index) => {
  //   delete originalTestimonials[index]
  // }

  const handleDeleteTestimonialShow = () => {
    setTestimonialsShowDeleteTestimonialModal(true)
  }

  const handleDeleteTestimonialClose = () => {
    setTestimonialsShowDeleteTestimonialModal(false)
  }

  const handleDeleteTestimonialSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalTestimonials[editProfileModalIndex]
    originalTestimonials.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.testimonials': originalTestimonials,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setTestimonialsShowDeleteTestimonialModal(false)
        setDeleting(false)
        toast("Testimonial deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete testimonial")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditTestimonialsSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Avatar</p>
            { testimonialsAvatarChanged ? (testimonialsAvatar !== '' ? 
              <>
                {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                  <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${testimonialsAvatarChanged ? testimonialsAvatar : (userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].avatar_url && userContext.profile.testimonials[editProfileModalIndex].avatar_url !== undefined ? userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].avatar_url && userContext.profile.testimonials[editProfileModalIndex].avatar_url : '')})` }}>
                  </div>
                </div> */}
                <div className={`position-relative overflow-hidden ${styles.editingAvatar}`} style={{ backgroundImage: `url(${userContext.profile.testimonials[editProfileModalIndex].avatar_url})`, width: '80px', height: '80px' }}></div>

                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  {/* <div className="w-100 position-relative" style={{paddingTop: '56.25%'}}>
                    <img src={testimonialsAvatarChanged ? testimonialsAvatar : (userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].avatar_url && userContext.profile.testimonials[editProfileModalIndex].avatar_url !== undefined ? userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].avatar_url && userContext.profile.testimonials[editProfileModalIndex].avatar_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
                  </div> */}
                  <div className="d-flex flex-row align-items-center" style={{ gap: '16px' }}>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploadingAvatar} onClick={handleChangeAvatar}>{!uploadingAvatar ? 'Change' : 'Uploading'}</button>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={deletingAvatar} onClick={handleDeleteAvatar}>{!deletingAvatar ? 'Delete' : 'Deleting'}</button>
                  </div>
                </div>
              </>
            :
              <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploadingAvatar} onClick={handleChangeAvatar}>{!uploadingAvatar ? 'Upload' : 'Uploading'}</button>
            )            
            : 
              ( userContext && 
                userContext.profile && 
                userContext.profile.testimonials[editProfileModalIndex] && 
                userContext.profile.testimonials[editProfileModalIndex].avatar_url &&
                userContext.profile.testimonials[editProfileModalIndex].avatar_url ?
                <>
                  {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                    <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${testimonialsAvatarChanged ? testimonialsAvatar : (userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].avatar_url && userContext.profile.testimonials[editProfileModalIndex].avatar_url !== undefined ? userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].avatar_url && userContext.profile.testimonials[editProfileModalIndex].avatar_url : '')})` }}>
                    </div>
                  </div> */}
                  <div>
                    <div className={`position-relative overflow-hidden ${styles.editingAvatar}`} style={{ backgroundImage: `url(${userContext.profile.testimonials[editProfileModalIndex].avatar_url})`, width: '80px', height: '80px' }}></div>
                  </div>
                  <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                    {/* <div className="w-100 position-relative" style={{paddingTop: '100%'}}>
                      <img src={testimonialsAvatarChanged ? testimonialsAvatar : (userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].avatar_url && userContext.profile.testimonials[editProfileModalIndex].avatar_url !== undefined ? userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].avatar_url && userContext.profile.testimonials[editProfileModalIndex].avatar_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
                    </div> */}
                    <div className="d-flex flex-row align-items-center" style={{ gap: '16px' }}>
                      <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploadingAvatar} onClick={handleChangeAvatar}>{!uploadingAvatar ? 'Change' : 'Uploading'}</button>
                      <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={deletingAvatar} onClick={handleDeleteAvatar}>{!deletingAvatar ? 'Delete' : 'Deleting'}</button>
                    </div>
                  </div>
                </>
              :
                <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploadingAvatar} onClick={handleChangeAvatar}>{!uploadingAvatar ? 'Upload' : 'Uploading'}</button>
              )
            }
            <input 
              type="file" 
              ref={hiddenAvatarFileInput}
              accept="image/*" 
              onChange={handleChangeAvatarUpload} 
              style={{display: 'none'}}
            />
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Name</p>
            <input
              type="text"
              className={testimonialsNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsNameChanged ? testimonialsName : (userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].name && userContext.profile.testimonials[editProfileModalIndex].name !== undefined ? userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].name && userContext.profile.testimonials[editProfileModalIndex].name : '')}
              onChange={({ target }) => testimonialsNameChange(target.value)}
            />
            {testimonialsNameError !== '' ? <p className="small text-error-high mt-2">{testimonialsNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Title</p>
            <input
              type="text"
              className={testimonialsTitleError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsTitleChanged ? testimonialsTitle : (userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].title && userContext.profile.testimonials[editProfileModalIndex].title !== undefined ? userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].title && userContext.profile.testimonials[editProfileModalIndex].title : '')}
              onChange={({ target }) => testimonialsTitleChange(target.value)}
            />
            {testimonialsTitleError !== '' ? <p className="small text-error-high mt-2">{testimonialsTitleError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={testimonialsUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsUrlChanged ? testimonialsUrl : (userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].url && userContext.profile.testimonials[editProfileModalIndex].url !== undefined ? userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].url && userContext.profile.testimonials[editProfileModalIndex].url : '')}
              onChange={({ target }) => testimonialsUrlChange(target.value)}
            />
            {testimonialsUrlError !== '' ? <p classUrl="small text-error-high mt-2">{testimonialsUrlError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Date</p>
            <input 
              type="month"
              className={testimonialsDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsDateChanged ? testimonialsDate : 
                (
                  userContext && 
                  userContext.profile && 
                  userContext.profile.testimonials[editProfileModalIndex] && 
                  userContext.profile.testimonials[editProfileModalIndex].posted_at && 
                  userContext.profile.testimonials[editProfileModalIndex].posted_at !== undefined ? 
                  userContext && 
                  userContext.profile && 
                  userContext.profile.testimonials[editProfileModalIndex] && 
                  userContext.profile.testimonials[editProfileModalIndex].posted_at && 
                  `${userContext.profile.testimonials[editProfileModalIndex].posted_at.year}-${('0' + userContext.profile.testimonials[editProfileModalIndex].posted_at.month).slice(-2)}`
                : 
                  ''
                )
              }
              onChange={({ target }) => testimonialsDateChange(target.value)}
            />
            {testimonialsDateError !== '' ? <p className="small text-error-high mt-2">{testimonialsDateError}</p> : null}
          </div> */}
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Testimonial</p>
            <textarea 
              className={testimonialsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsDescriptionChanged ? testimonialsDescription : (
                userContext &&
                userContext.profile &&
                userContext.profile.testimonials &&
                userContext.profile.testimonials[editProfileModalIndex] &&
                userContext.profile.testimonials[editProfileModalIndex].description !== undefined ? userContext.profile.testimonials[editProfileModalIndex].description : '')
              }
              onChange={({ target }) => testimonialsDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {testimonialsDescriptionError !== '' ? <p className="small text-error-high mt-2">{testimonialsDescriptionError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <input
              type="text"
              className={testimonialsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsDescriptionChanged ? testimonialsDescription : (userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].description && userContext.profile.testimonials[editProfileModalIndex].description !== undefined ? userContext && userContext.profile && userContext.profile.testimonials[editProfileModalIndex] && userContext.profile.testimonials[editProfileModalIndex].description && userContext.profile.testimonials[editProfileModalIndex].description : '')}
              onChange={({ target }) => testimonialsDescriptionChange(target.value)}
            />
            {testimonialsDescriptionError !== '' ? <p className="small text-error-high mt-2">{testimonialsDescriptionError}</p> : null}
          </div> */}
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteTestimonialShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeleteTestimonialShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
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
        show={testimonialsShowDeleteTestimonialModal} 
        onHide={handleDeleteTestimonialClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete testimonial?</h5>
          </div>
          <button onClick={handleDeleteTestimonialClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete testimonial</h5>
            </div>
            <button onClick={handleDeleteTestimonialClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this testimonial?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.testimonials &&
              userContext.profile.testimonials[editProfileModalIndex] &&
            <div className="d-flex flex-column justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              {/* { userContext.profile.testimonials[editProfileModalIndex].avatar_url ?
              <div>
                <img className={styles.testimonialImage} src={userContext.profile.testimonials[editProfileModalIndex].avatar_url ? userContext.profile.testimonials[editProfileModalIndex].avatar_url : null} style={{width: '64px'}}/>
              </div>
              : ''} */}
              { userContext.profile.testimonials[editProfileModalIndex].avatar_url &&
                <div className={`position-relative overflow-hidden ${styles.editingAvatar}`} style={{ backgroundImage: `url(${userContext.profile.testimonials[editProfileModalIndex].avatar_url})`, width: '80px', height: '80px' }}></div>
                // <div>
                //   <div className={`position-relative overflow-hidden ${profileStyles.avatarImage}`} style={{ backgroundImage: `url(${testimonial.avatar_url ? testimonial.avatar_url : null})`, width: '80px', height: '80px' }}></div>
                // </div>
              }
              <div className="w-100">
                {/* <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.testimonials[editProfileModalIndex].title}</p> */}
                {/* <a target="_blank" href={userContext.profile.testimonials[editProfileModalIndex].company_linkedin_profile_url} className="text-decoration-none"> */}
                <h4 className="large text-dark-high mb-0">{userContext.profile.testimonials[editProfileModalIndex].name}</h4>
                {/* </a> */}
                {/* <p className="text-dark-low mb-0">
                  {userContext.profile.testimonials[editProfileModalIndex].posted_at ? (userContext.profile.testimonials[editProfileModalIndex].posted_at.month ? convertMonth(userContext.profile.testimonials[editProfileModalIndex].posted_at.month) + " " : '') : null}
                  {userContext.profile.testimonials[editProfileModalIndex].posted_at ? (userContext.profile.testimonials[editProfileModalIndex].posted_at.year ? userContext.profile.testimonials[editProfileModalIndex].posted_at.year + " " : null) : null}
                 </p> */}
                {/* {userContext.profile.testimonials[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.testimonials[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteTestimonialClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteTestimonialSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditTestimonial;