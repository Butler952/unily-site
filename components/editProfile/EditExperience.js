import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditExperience = ({
  user,
  editProfileModalIndex,
  experiencesLogo,
  setExperiencesLogo,
  experiencesLogoChanged,
  setExperiencesLogoChanged,
  experiencesCompany,
  setExperiencesCompany,
  experiencesCompanyChanged,
  setExperiencesCompanyChanged,
  experiencesCompanyError,
  setExperiencesCompanyError,
  experiencesTitle,
  setExperiencesTitle,
  experiencesTitleChanged,
  setExperiencesTitleChanged,
  experiencesTitleError,
  setExperiencesTitleError,
  experiencesLocation,
  setExperiencesLocation,
  experiencesLocationChanged,
  setExperiencesLocationChanged,
  experiencesLocationError,
  setExperiencesLocationError,
  experiencesUrl,
  setExperiencesUrl,
  experiencesUrlChanged,
  setExperiencesUrlChanged,
  experiencesUrlError,
  setExperiencesUrlError,
  experiencesStartDate,
  setExperiencesStartDate,
  experiencesStartDateInputType,
  setExperiencesStartDateInputType,
  experiencesStartDateChanged,
  setExperiencesStartDateChanged,
  experiencesStartDateError,
  setExperiencesStartDateError,
  experiencesEndDate,
  setExperiencesEndDate,
  experiencesEndDateInputType,
  setExperiencesEndDateInputType,
  experiencesEndDateChanged,
  setExperiencesEndDateChanged,
  experiencesEndDateError,
  setExperiencesEndDateError,
  experiencesEndDatePresent,
  setExperiencesEndDatePresent,
  experiencesEndDatePresentChanged,
  setExperiencesEndDatePresentChanged,
  experiencesDescription,
  setExperiencesDescription,
  experiencesDescriptionChanged,
  setExperiencesDescriptionChanged,
  experiencesDescriptionError,
  setExperiencesDescriptionError,
  experiencesShowDeleteExperienceModal,
  setExperiencesShowDeleteExperienceModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [originalExperiences, setOriginalExperiences] = useState(userContext.profile.experiences);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const experiencesLogoChange = (value) => {
    setExperiencesLogo(value),
    setExperiencesLogoChanged(true)
  }

  const experiencesCompanyChange = (value) => {
    setExperiencesCompany(value),
    setExperiencesCompanyChanged(true),
    setExperiencesCompanyError('')
  }

  const experiencesTitleChange = (value) => {
    setExperiencesTitle(value),
    setExperiencesTitleChanged(true),
    setExperiencesTitleError('')
  }

  const experiencesLocationChange = (value) => {
    setExperiencesLocation(value),
    setExperiencesLocationChanged(true),
    setExperiencesLocationError('')
  }

  const experiencesUrlChange = (value) => {
    setExperiencesUrl(value),
    setExperiencesUrlChanged(true),
    setExperiencesUrlError('')
  }

  const experiencesStartDateChange = (value) => {
    setExperiencesStartDate(value),
    setExperiencesStartDateChanged(true),
    setExperiencesStartDateError('')
  }

  const experiencesStartDateChangeInputType = () => {
    setExperiencesStartDateInputType('month')
  }

  const experiencesEndDateChange = (value) => {
    setExperiencesEndDate(value),
    setExperiencesEndDateChanged(true),
    setExperiencesEndDateError('')
  }

  const experiencesEndDateChangeInputType = () => {
    setExperiencesEndDateInputType('month')
  }

  const experiencesEndDatePresentChange = () => {
    if (!experiencesEndDatePresentChanged) {
      if (userContext.profile.experiences[editProfileModalIndex].ends_at !== undefined) {
        setExperiencesEndDatePresent(true)
      } else {
        setExperiencesEndDatePresent(false)
      }
    } else {
      setExperiencesEndDatePresent(experiencesEndDatePresent => !experiencesEndDatePresent)
    }
    setExperiencesEndDatePresentChanged(true)
  }

  const experiencesDescriptionChange = (value) => {
    setExperiencesDescription(value),
    setExperiencesDescriptionChanged(true),
    setExperiencesDescriptionError('')
  }

  const updateExperiences = (index) => {
    if (experiencesCompanyChanged) {
      originalExperiences[index].company = experiencesCompany
    }
    if (experiencesTitleChanged) {
      originalExperiences[index].title = experiencesTitle
    }
    if (experiencesLocationChanged) {
      originalExperiences[index].location = experiencesLocation
    }
    if (experiencesUrlChanged) {
      originalExperiences[index].company_linkedin_profile_url = experiencesUrl
    }
    if (experiencesStartDateChanged) {
      let startDateMonth = Number(experiencesStartDate.split('-')[1]);
      let startDateYear = Number(experiencesStartDate.split('-')[0]);
      originalExperiences[index].starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    }
    if (!experiencesEndDatePresent) {
      if (experiencesEndDateChanged) {
        let endDateMonth = Number(experiencesEndDate.split('-')[1]);
        let endDateYear = Number(experiencesEndDate.split('-')[0]);
        originalExperiences[index].ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      }
    } else {
      delete originalExperiences[index].ends_at
    }
    if (experiencesDescriptionChanged) {
      originalExperiences[index].description = experiencesDescription
    }
  }
  
  const handleEditExperiencesSubmit = (e) => {
    e.preventDefault();

    if (experiencesCompanyChanged && experiencesCompany === '') {
      setExperiencesCompanyError('Company name cannot be empty')
      return null;
    }
    if (experiencesTitleChanged && experiencesTitle === '') {
      setExperiencesTitleError('Job title cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateExperiences(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.experiences': originalExperiences,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.experiences = originalExperiences;
      setUserContext(newUserContext)
    })
    .then(() => {
      handleBack()
    })
    .then(() => {
      setSubmitting(false)
      toast("Experience updated")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to update experience")
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

    let uid = userContext.profile.experiences[editProfileModalIndex].logo_ref ? userContext.profile.experiences[editProfileModalIndex].logo_ref : uuidv4()
    let filename = `images/${user}/experiences/${userContext.profile.experiences[editProfileModalIndex].logo_ref ? userContext.profile.experiences[editProfileModalIndex].logo_ref : uid}.jpg`

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
          originalExperiences[editProfileModalIndex].logo_url = downloadURL
          originalExperiences[editProfileModalIndex].logo_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.experiences': originalExperiences,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.experiences[editProfileModalIndex].logo_url = downloadURL;
            newUserContext.profile.experiences[editProfileModalIndex].logo_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            experiencesLogoChange(downloadURL)
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

    // let filename = originalExperiences[editProfileModalIndex].logo_url
    // let filename = userContext.profile.experiences[editProfileModalIndex].logo_url
    let filename = `images/${user}/experiences/${userContext.profile.experiences[editProfileModalIndex].logo_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalExperiences[editProfileModalIndex].logo_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.experiences': originalExperiences,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.experiences[editProfileModalIndex].logo_url = null;
        setUserContext(newUserContext)
        experiencesLogoChange('')
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

  // const deleteExperience = (index) => {
  //   delete originalExperiences[index]
  // }

  const handleDeleteExperienceShow = () => {
    setExperiencesShowDeleteExperienceModal(true)
  }

  const handleDeleteExperienceClose = () => {
    setExperiencesShowDeleteExperienceModal(false)
  }

  const handleDeleteExperienceSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalExperiences[editProfileModalIndex]
    originalExperiences.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.experiences': originalExperiences,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setExperiencesShowDeleteExperienceModal(false)
        setDeleting(false)
        toast("Experience deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete experience")
        //console.error("Error adding document: ", error);
      });
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={experiencesEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={experiencesEndDateChanged ? experiencesEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.experiences[editProfileModalIndex] && 
              userContext.profile.experiences[editProfileModalIndex].ends_at && 
              userContext.profile.experiences[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.experiences[editProfileModalIndex] && 
              userContext.profile.experiences[editProfileModalIndex].ends_at && 
              `${userContext.profile.experiences[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.experiences[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          }
          onChange={({ target }) => experiencesEndDateChange(target.value)}
        />
      {/* <input 
          // type="month"
          type={
            userContext && 
            userContext.profile && 
            userContext.profile.experiences[editProfileModalIndex] && 
            userContext.profile.experiences[editProfileModalIndex].ends_at && 
            userContext.profile.experiences[editProfileModalIndex].ends_at !== undefined ? 'month' : experiencesEndDateInputType
          }
          // onFocus={this.type = 'month'}
          onFocus={() => experiencesEndDateChangeInputType()}
          placeholder="Choose a date"
          className={`small w-100 ${experiencesEndDateError !== '' ? 'error' : ''}`}
          value={experiencesEndDateInputType == "text" ? '' : (
            experiencesEndDateChanged ? experiencesEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.experiences[editProfileModalIndex] && 
              userContext.profile.experiences[editProfileModalIndex].ends_at && 
              userContext.profile.experiences[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.experiences[editProfileModalIndex] && 
              userContext.profile.experiences[editProfileModalIndex].ends_at && 
              `${userContext.profile.experiences[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.experiences[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          )}
          onChange={({ target }) => experiencesEndDateChange(target.value)}
        /> */}
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditExperiencesSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Logo</p>
            { experiencesLogoChanged ? (experiencesLogo !== '' ? 
              <>
                <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                  <img src={experiencesLogoChanged ? experiencesLogo : (userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].logo_url && userContext.profile.experiences[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].logo_url && userContext.profile.experiences[editProfileModalIndex].logo_url : '')} className="radius-3" style={{width: '96px', height: '96px'}}/>
                  <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeLogo}>{!uploading ? 'Change' : 'Uploading'}</button>
                  <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={deletingLogo} onClick={handleDeleteLogo}>{!deletingLogo ? 'Delete' : 'Deleting'}</button>
                </div>
              </>
            :
              <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeLogo}>{!uploading ? 'Upload' : 'Uploading'}</button>
            )
            // userContext.profile.profile_pic_url !== '' ?
            
            : 
              ( userContext && 
                userContext.profile && 
                userContext.profile.experiences[editProfileModalIndex] && 
                userContext.profile.experiences[editProfileModalIndex].logo_url &&
                userContext.profile.experiences[editProfileModalIndex].logo_url ?
                <>
                  <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                  <img src={experiencesLogoChanged ? experiencesLogo : (userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].logo_url && userContext.profile.experiences[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].logo_url && userContext.profile.experiences[editProfileModalIndex].logo_url : '')} className="radius-3" style={{width: '96px', height: '96px'}}/>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeLogo}>{!uploading ? 'Change' : 'Uploading'}</button>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={deletingLogo} onClick={handleDeleteLogo}>{!deletingLogo ? 'Delete' : 'Deleting'}</button>
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
            {/* <button className="btn dark medium small" onClick={uploadProfilePicture(profilePictureFile)}>Upload</button> */}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Title</p>
            <input
              type="text"
              className={experiencesTitleError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesTitleChanged ? experiencesTitle : (userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].title && userContext.profile.experiences[editProfileModalIndex].title !== undefined ? userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].title && userContext.profile.experiences[editProfileModalIndex].title : '')}
              onChange={({ target }) => experiencesTitleChange(target.value)}
            />
            {experiencesTitleError !== '' ? <p className="small text-error-high mt-2">{experiencesTitleError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Company</p>
            <input
              type="text"
              className={experiencesCompanyError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesCompanyChanged ? experiencesCompany : (userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].company && userContext.profile.experiences[editProfileModalIndex].company !== undefined ? userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].company && userContext.profile.experiences[editProfileModalIndex].company : '')}
              onChange={({ target }) => experiencesCompanyChange(target.value)}
            />
            {experiencesCompanyError !== '' ? <p className="small text-error-high mt-2">{experiencesCompanyError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Location</p>
            <input
              type="text"
              className={experiencesLocationError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesLocationChanged ? experiencesLocation : (userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].location && userContext.profile.experiences[editProfileModalIndex].location !== undefined ? userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].location && userContext.profile.experiences[editProfileModalIndex].location : '')}
              onChange={({ target }) => experiencesLocationChange(target.value)}
            />
            {experiencesLocationError !== '' ? <p className="small text-error-high mt-2">{experiencesLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={experiencesUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesUrlChanged ? experiencesUrl : (userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].company_linkedin_profile_url && userContext.profile.experiences[editProfileModalIndex].company_linkedin_profile_url !== undefined ? userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].company_linkedin_profile_url && userContext.profile.experiences[editProfileModalIndex].company_linkedin_profile_url : '')}
              onChange={({ target }) => experiencesUrlChange(target.value)}
            />
            {experiencesUrlError !== '' ? <p className="small text-error-high mt-2">{experiencesUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={experiencesStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesStartDateChanged ? experiencesStartDate : 
                (
                  userContext && 
                  userContext.profile && 
                  userContext.profile.experiences[editProfileModalIndex] && 
                  userContext.profile.experiences[editProfileModalIndex].starts_at && 
                  userContext.profile.experiences[editProfileModalIndex].starts_at !== undefined ? 
                  userContext && 
                  userContext.profile && 
                  userContext.profile.experiences[editProfileModalIndex] && 
                  userContext.profile.experiences[editProfileModalIndex].starts_at && 
                  `${userContext.profile.experiences[editProfileModalIndex].starts_at.year}-${('0' + userContext.profile.experiences[editProfileModalIndex].starts_at.month).slice(-2)}`
                : 
                  ''
                )
              }
              onChange={({ target }) => experiencesStartDateChange(target.value)}
            />
            {experiencesLocationError !== '' ? <p className="small text-error-high mt-2">{experiencesLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { experiencesEndDatePresentChanged ? (!experiencesEndDatePresent ? <EndDateInput/>  : '' ) : '' } 
            { !experiencesEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.experiences[editProfileModalIndex] && 
                userContext.profile.experiences[editProfileModalIndex].ends_at && 
                userContext.profile.experiences[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''} 
            {experiencesLocationError !== '' ? <p className="small text-error-high mt-2">{experiencesLocationError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I currently work here
              <input 
                type="checkbox" 
                onChange={() => experiencesEndDatePresentChange()} 
                checked={experiencesEndDatePresentChanged ? experiencesEndDatePresent : 
                  (
                    userContext && 
                    userContext.profile && 
                    userContext.profile.experiences[editProfileModalIndex] && 
                    userContext.profile.experiences[editProfileModalIndex].ends_at == undefined ? true
                  : 
                    false
                  )
                }
              />
              {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={experiencesDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesDescriptionChanged ? experiencesDescription : (
                userContext &&
                userContext.profile &&
                userContext.profile.experiences &&
                userContext.profile.experiences[editProfileModalIndex] &&
                userContext.profile.experiences[editProfileModalIndex].description !== undefined ? userContext.profile.experiences[editProfileModalIndex].description : '')
              }
              onChange={({ target }) => experiencesDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {experiencesDescriptionError !== '' ? <p className="small text-error-high mt-2">{experiencesDescriptionError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <input
              type="text"
              className={experiencesDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesDescriptionChanged ? experiencesDescription : (userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].description && userContext.profile.experiences[editProfileModalIndex].description !== undefined ? userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].description && userContext.profile.experiences[editProfileModalIndex].description : '')}
              onChange={({ target }) => experiencesDescriptionChange(target.value)}
            />
            {experiencesDescriptionError !== '' ? <p className="small text-error-high mt-2">{experiencesDescriptionError}</p> : null}
          </div> */}
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteExperienceShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeleteExperienceShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
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
        show={experiencesShowDeleteExperienceModal} 
        onHide={handleDeleteExperienceClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete experience?</h5>
          </div>
          <button onClick={handleDeleteExperienceClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete experience</h5>
            </div>
            <button onClick={handleDeleteExperienceClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.experiences &&
              userContext.profile.experiences[editProfileModalIndex] &&
            <div className="d-flex flex-row justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              { userContext.profile.experiences[editProfileModalIndex].logo_url ?
              <div>
                <img className={styles.experienceImage} src={userContext.profile.experiences[editProfileModalIndex].logo_url ? userContext.profile.experiences[editProfileModalIndex].logo_url : null} style={{width: '64px'}}/>
              </div>
              : ''}
              <div className="w-100">
                <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.experiences[editProfileModalIndex].title}</p>
                {/* <a target="_blank" href={userContext.profile.experiences[editProfileModalIndex].company_linkedin_profile_url} className="text-decoration-none"> */}
                <p className="large text-dark-med mb-0">{userContext.profile.experiences[editProfileModalIndex].company}</p>
                {/* </a> */}
                <p className="text-dark-low mb-0">{userContext.profile.experiences[editProfileModalIndex].location}</p>
                <p className="text-dark-low mb-0">
                  {userContext.profile.experiences[editProfileModalIndex].starts_at ? (userContext.profile.experiences[editProfileModalIndex].starts_at.month ? convertMonth(userContext.profile.experiences[editProfileModalIndex].starts_at.month) + " " : '') : null}
                  {userContext.profile.experiences[editProfileModalIndex].starts_at ? (userContext.profile.experiences[editProfileModalIndex].starts_at.year ? userContext.profile.experiences[editProfileModalIndex].starts_at.year + " " : null) : null}
                  {userContext.profile.experiences[editProfileModalIndex].starts_at && userContext.profile.experiences[editProfileModalIndex].ends_at == null ? ' – Present' : null}
                  {userContext.profile.experiences[editProfileModalIndex].starts_at && userContext.profile.experiences[editProfileModalIndex].ends_at ? " – " + (userContext.profile.experiences[editProfileModalIndex].ends_at.month ? convertMonth(userContext.profile.experiences[editProfileModalIndex].ends_at.month) : '') : null}
                  {userContext.profile.experiences[editProfileModalIndex].starts_at && userContext.profile.experiences[editProfileModalIndex].ends_at ? (userContext.profile.experiences[editProfileModalIndex].ends_at.year ? " " + userContext.profile.experiences[editProfileModalIndex].ends_at.year : null) : null}
                </p>
                {/* {userContext.profile.experiences[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.experiences[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteExperienceClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteExperienceSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditExperience;