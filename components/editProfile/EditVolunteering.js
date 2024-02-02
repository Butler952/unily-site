import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditVolunteering = ({
  user,
  editProfileModalIndex,
  volunteeringLogo,
  setVolunteeringLogo,
  volunteeringLogoChanged,
  setVolunteeringLogoChanged,
  volunteeringCompany,
  setVolunteeringCompany,
  volunteeringCompanyChanged,
  setVolunteeringCompanyChanged,
  volunteeringCompanyError,
  setVolunteeringCompanyError,
  volunteeringTitle,
  setVolunteeringTitle,
  volunteeringTitleChanged,
  setVolunteeringTitleChanged,
  volunteeringTitleError,
  setVolunteeringTitleError,
  volunteeringLocation,
  setVolunteeringLocation,
  volunteeringLocationChanged,
  setVolunteeringLocationChanged,
  volunteeringLocationError,
  setVolunteeringLocationError,
  volunteeringUrl,
  setVolunteeringUrl,
  volunteeringUrlChanged,
  setVolunteeringUrlChanged,
  volunteeringUrlError,
  setVolunteeringUrlError,
  volunteeringStartDate,
  setVolunteeringStartDate,
  volunteeringStartDateInputType,
  setVolunteeringStartDateInputType,
  volunteeringStartDateChanged,
  setVolunteeringStartDateChanged,
  volunteeringStartDateError,
  setVolunteeringStartDateError,
  volunteeringEndDate,
  setVolunteeringEndDate,
  volunteeringEndDateInputType,
  setVolunteeringEndDateInputType,
  volunteeringEndDateChanged,
  setVolunteeringEndDateChanged,
  volunteeringEndDateError,
  setVolunteeringEndDateError,
  volunteeringEndDatePresent,
  setVolunteeringEndDatePresent,
  volunteeringEndDatePresentChanged,
  setVolunteeringEndDatePresentChanged,
  volunteeringDescription,
  setVolunteeringDescription,
  volunteeringDescriptionChanged,
  setVolunteeringDescriptionChanged,
  volunteeringDescriptionError,
  setVolunteeringDescriptionError,
  volunteeringShowDeleteVolunteeringModal,
  setVolunteeringShowDeleteVolunteeringModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [originalVolunteering, setOriginalVolunteering] = useState( userContext.profile.volunteer_work);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const volunteeringLogoChange = (value) => {
    setVolunteeringLogo(value),
    setVolunteeringLogoChanged(true)
  }

  const volunteeringCompanyChange = (value) => {
    setVolunteeringCompany(value),
    setVolunteeringCompanyChanged(true),
    setVolunteeringCompanyError('')
  }

  const volunteeringTitleChange = (value) => {
    setVolunteeringTitle(value),
    setVolunteeringTitleChanged(true),
    setVolunteeringTitleError('')
  }

  const volunteeringLocationChange = (value) => {
    setVolunteeringLocation(value),
    setVolunteeringLocationChanged(true),
    setVolunteeringLocationError('')
  }

  const volunteeringUrlChange = (value) => {
    setVolunteeringUrl(value),
    setVolunteeringUrlChanged(true),
    setVolunteeringUrlError('')
  }

  const volunteeringStartDateChange = (value) => {
    setVolunteeringStartDate(value),
    setVolunteeringStartDateChanged(true),
    setVolunteeringStartDateError('')
  }

  const volunteeringStartDateChangeInputType = () => {
    setVolunteeringStartDateInputType('month')
  }

  const volunteeringEndDateChange = (value) => {
    setVolunteeringEndDate(value),
    setVolunteeringEndDateChanged(true),
    setVolunteeringEndDateError('')
  }

  const volunteeringEndDateChangeInputType = () => {
    setVolunteeringEndDateInputType('month')
  }

  const volunteeringEndDatePresentChange = () => {
    if (!volunteeringEndDatePresentChanged) {
      if (userContext.profile.volunteer_work[editProfileModalIndex].ends_at !== undefined) {
        setVolunteeringEndDatePresent(true)
      } else {
        setVolunteeringEndDatePresent(false)
      }
    } else {
      setVolunteeringEndDatePresent(volunteeringEndDatePresent => !volunteeringEndDatePresent)
    }
    setVolunteeringEndDatePresentChanged(true)
  }

  const volunteeringDescriptionChange = (value) => {
    setVolunteeringDescription(value),
    setVolunteeringDescriptionChanged(true),
    setVolunteeringDescriptionError('')
  }

  const updateVolunteering = (index) => {
    if (volunteeringCompanyChanged) {
      originalVolunteering[index].company = volunteeringCompany
    }
    if (volunteeringTitleChanged) {
      originalVolunteering[index].title = volunteeringTitle
    }
    if (volunteeringLocationChanged) {
      originalVolunteering[index].location = volunteeringLocation
    }
    if (volunteeringUrlChanged) {
      originalVolunteering[index].company_linkedin_profile_url = volunteeringUrl
    }
    if (volunteeringStartDateChanged) {
      let startDateMonth = Number(volunteeringStartDate.split('-')[1]);
      let startDateYear = Number(volunteeringStartDate.split('-')[0]);
      originalVolunteering[index].starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    }
    if (!volunteeringEndDatePresent) {
      if (volunteeringEndDateChanged) {
        let endDateMonth = Number(volunteeringEndDate.split('-')[1]);
        let endDateYear = Number(volunteeringEndDate.split('-')[0]);
        originalVolunteering[index].ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      }
    } else {
      delete originalVolunteering[index].ends_at
    }
    if (volunteeringDescriptionChanged) {
      originalVolunteering[index].description = volunteeringDescription
    }
  }
  
  const handleEditVolunteeringsSubmit = (e) => {
    e.preventDefault();

    if (volunteeringCompanyChanged && volunteeringCompany === '') {
      setCompanyError('Your first name cannot be empty')
      return null;
    }
    if (volunteeringTitleChanged && volunteeringTitle === '') {
      setTitleError('Job title cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateVolunteering(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.volunteer_work': originalVolunteering,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.volunteer_work = originalVolunteering;
      setUserContext(newUserContext)
    })
    .then(() => {
      handleBack()
    })
    .then(() => {
      setSubmitting(false)
      toast("Volunteering updated")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to update volunteering")
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

    let uid = userContext.profile.volunteer_work[editProfileModalIndex].logo_ref ? userContext.profile.volunteer_work[editProfileModalIndex].logo_ref : uuidv4()
    let filename = `images/${user}/volunteering/${userContext.profile.volunteer_work[editProfileModalIndex].logo_ref ? userContext.profile.volunteer_work[editProfileModalIndex].logo_ref : uid}.jpg`

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
          originalVolunteering[editProfileModalIndex].logo_url = downloadURL
          originalVolunteering[editProfileModalIndex].logo_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.volunteer_work': originalVolunteering,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.volunteer_work[editProfileModalIndex].logo_url = downloadURL;
            newUserContext.profile.volunteer_work[editProfileModalIndex].logo_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            volunteeringLogoChange(downloadURL)
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

    // let filename = originalVolunteering[editProfileModalIndex].logo_url
    // let filename = userContext.profile.volunteer_work[editProfileModalIndex].logo_url
    let filename = `images/${user}/volunteering/${userContext.profile.volunteer_work[editProfileModalIndex].logo_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalVolunteering[editProfileModalIndex].logo_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.volunteer_work': originalVolunteering,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.volunteer_work[editProfileModalIndex].logo_url = null;
        setUserContext(newUserContext)
        volunteeringLogoChange('')
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

  // const deleteVolunteering = (index) => {
  //   delete originalVolunteering[index]
  // }

  const handleDeleteVolunteeringShow = () => {
    setVolunteeringShowDeleteVolunteeringModal(true)
  }

  const handleDeleteVolunteeringClose = () => {
    setVolunteeringShowDeleteVolunteeringModal(false)
  }

  const handleDeleteVolunteeringSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalVolunteering[editProfileModalIndex]
    originalVolunteering.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.volunteer_work': originalVolunteering,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setVolunteeringShowDeleteVolunteeringModal(false)
        setDeleting(false)
        toast("Volunteering deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete volunteering")
        //console.error("Error adding document: ", error);
      });
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={volunteeringEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={volunteeringEndDateChanged ? volunteeringEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.volunteer_work[editProfileModalIndex] && 
              userContext.profile.volunteer_work[editProfileModalIndex].ends_at && 
              userContext.profile.volunteer_work[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.volunteer_work[editProfileModalIndex] && 
              userContext.profile.volunteer_work[editProfileModalIndex].ends_at && 
              `${userContext.profile.volunteer_work[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.volunteer_work[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          }
          onChange={({ target }) => volunteeringEndDateChange(target.value)}
        />
      {/* <input 
          // type="month"
          type={
            userContext && 
            userContext.profile && 
            userContext.profile.volunteer_work[editProfileModalIndex] && 
            userContext.profile.volunteer_work[editProfileModalIndex].ends_at && 
            userContext.profile.volunteer_work[editProfileModalIndex].ends_at !== undefined ? 'month' : volunteeringEndDateInputType
          }
          // onFocus={this.type = 'month'}
          onFocus={() => volunteeringEndDateChangeInputType()}
          placeholder="Choose a date"
          className={`small w-100 ${volunteeringEndDateError !== '' ? 'error' : ''}`}
          value={volunteeringEndDateInputType == "text" ? '' : (
            volunteeringEndDateChanged ? volunteeringEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.volunteer_work[editProfileModalIndex] && 
              userContext.profile.volunteer_work[editProfileModalIndex].ends_at && 
              userContext.profile.volunteer_work[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.volunteer_work[editProfileModalIndex] && 
              userContext.profile.volunteer_work[editProfileModalIndex].ends_at && 
              `${userContext.profile.volunteer_work[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.volunteer_work[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          )}
          onChange={({ target }) => volunteeringEndDateChange(target.value)}
        /> */}
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditVolunteeringsSubmit}>
        <div className="mb-3">
            <p className="text-dark-high mb-2">Logo</p>
            { volunteeringLogoChanged ? (volunteeringLogo !== '' ? 
              <>
                <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                  <img src={volunteeringLogoChanged ? volunteeringLogo : (userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].logo_url && userContext.profile.volunteer_work[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].logo_url && userContext.profile.volunteer_work[editProfileModalIndex].logo_url : '')} className="radius-3" style={{width: '96px', height: '96px'}}/>
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
                userContext.profile.volunteer_work[editProfileModalIndex] && 
                userContext.profile.volunteer_work[editProfileModalIndex].logo_url &&
                userContext.profile.volunteer_work[editProfileModalIndex].logo_url ?
                <>
                  <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                  <img src={volunteeringLogoChanged ? volunteeringLogo : (userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].logo_url && userContext.profile.volunteer_work[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].logo_url && userContext.profile.volunteer_work[editProfileModalIndex].logo_url : '')} className="radius-3" style={{width: '96px', height: '96px'}}/>
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
              className={volunteeringTitleError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringTitleChanged ? volunteeringTitle : (userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].title && userContext.profile.volunteer_work[editProfileModalIndex].title !== undefined ? userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].title && userContext.profile.volunteer_work[editProfileModalIndex].title : '')}
              onChange={({ target }) => volunteeringTitleChange(target.value)}
            />
            {volunteeringTitleError !== '' ? <p className="small text-error-high mt-2">{volunteeringTitleError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Organisation</p>
            <input
              type="text"
              className={volunteeringCompanyError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringCompanyChanged ? volunteeringCompany : (userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].company && userContext.profile.volunteer_work[editProfileModalIndex].company !== undefined ? userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].company && userContext.profile.volunteer_work[editProfileModalIndex].company : '')}
              onChange={({ target }) => volunteeringCompanyChange(target.value)}
            />
            {volunteeringCompanyError !== '' ? <p className="small text-error-high mt-2">{volunteeringCompanyError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Location</p>
            <input
              type="text"
              className={volunteeringLocationError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringLocationChanged ? volunteeringLocation : (userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].location && userContext.profile.volunteer_work[editProfileModalIndex].location !== undefined ? userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].location && userContext.profile.volunteer_work[editProfileModalIndex].location : '')}
              onChange={({ target }) => volunteeringLocationChange(target.value)}
            />
            {volunteeringLocationError !== '' ? <p className="small text-error-high mt-2">{volunteeringLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={volunteeringUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringUrlChanged ? volunteeringUrl : (userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].company_linkedin_profile_url && userContext.profile.volunteer_work[editProfileModalIndex].company_linkedin_profile_url !== undefined ? userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].company_linkedin_profile_url && userContext.profile.volunteer_work[editProfileModalIndex].company_linkedin_profile_url : '')}
              onChange={({ target }) => volunteeringUrlChange(target.value)}
            />
            {volunteeringUrlError !== '' ? <p className="small text-error-high mt-2">{volunteeringUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={volunteeringStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringStartDateChanged ? volunteeringStartDate : 
                (
                  userContext && 
                  userContext.profile && 
                  userContext.profile.volunteer_work[editProfileModalIndex] && 
                  userContext.profile.volunteer_work[editProfileModalIndex].starts_at && 
                  userContext.profile.volunteer_work[editProfileModalIndex].starts_at !== undefined ? 
                  userContext && 
                  userContext.profile && 
                  userContext.profile.volunteer_work[editProfileModalIndex] && 
                  userContext.profile.volunteer_work[editProfileModalIndex].starts_at && 
                  `${userContext.profile.volunteer_work[editProfileModalIndex].starts_at.year}-${('0' + userContext.profile.volunteer_work[editProfileModalIndex].starts_at.month).slice(-2)}`
                : 
                  ''
                )
              }
              onChange={({ target }) => volunteeringStartDateChange(target.value)}
            />
            {volunteeringLocationError !== '' ? <p className="small text-error-high mt-2">{volunteeringLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { volunteeringEndDatePresentChanged ? (!volunteeringEndDatePresent ? <EndDateInput/>  : '' ) : '' } 
            { !volunteeringEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.volunteer_work[editProfileModalIndex] && 
                userContext.profile.volunteer_work[editProfileModalIndex].ends_at && 
                userContext.profile.volunteer_work[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''} 
            {volunteeringLocationError !== '' ? <p className="small text-error-high mt-2">{volunteeringLocationError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I currently work here
              <input 
                type="checkbox" 
                onChange={() => volunteeringEndDatePresentChange()} 
                checked={volunteeringEndDatePresentChanged ? volunteeringEndDatePresent : 
                  (
                    userContext && 
                    userContext.profile && 
                    userContext.profile.volunteer_work[editProfileModalIndex] && 
                    userContext.profile.volunteer_work[editProfileModalIndex].ends_at == undefined ? true
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
              className={volunteeringDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringDescriptionChanged ? volunteeringDescription : (
                userContext &&
                userContext.profile &&
                userContext.profile.volunteer_work &&
                userContext.profile.volunteer_work[editProfileModalIndex] &&
                userContext.profile.volunteer_work[editProfileModalIndex].description !== undefined ? userContext.profile.volunteer_work[editProfileModalIndex].description : '')
              }
              onChange={({ target }) => volunteeringDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {volunteeringDescriptionError !== '' ? <p className="small text-error-high mt-2">{volunteeringDescriptionError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <input
              type="text"
              className={volunteeringDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringDescriptionChanged ? volunteeringDescription : (userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].description && userContext.profile.volunteer_work[editProfileModalIndex].description !== undefined ? userContext && userContext.profile && userContext.profile.volunteer_work[editProfileModalIndex] && userContext.profile.volunteer_work[editProfileModalIndex].description && userContext.profile.volunteer_work[editProfileModalIndex].description : '')}
              onChange={({ target }) => volunteeringDescriptionChange(target.value)}
            />
            {volunteeringDescriptionError !== '' ? <p className="small text-error-high mt-2">{volunteeringDescriptionError}</p> : null}
          </div> */}
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteVolunteeringShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeleteVolunteeringShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
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
        show={volunteeringShowDeleteVolunteeringModal} 
        onHide={handleDeleteVolunteeringClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete volunteering?</h5>
          </div>
          <button onClick={handleDeleteVolunteeringClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete volunteering</h5>
            </div>
            <button onClick={handleDeleteVolunteeringClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.volunteer_work &&
              userContext.profile.volunteer_work[editProfileModalIndex] &&
            <div className="d-flex flex-row justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              { userContext.profile.volunteer_work[editProfileModalIndex].logo_url ?
              <div>
                <img className={styles.volunteeringImage} src={userContext.profile.volunteer_work[editProfileModalIndex].logo_url ? userContext.profile.volunteer_work[editProfileModalIndex].logo_url : null} style={{width: '64px'}}/>
              </div>
              : ''}
              <div className="w-100">
                <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.volunteer_work[editProfileModalIndex].title}</p>
                {/* <a target="_blank" href={userContext.profile.volunteer_work[editProfileModalIndex].company_linkedin_profile_url} className="text-decoration-none"> */}
                <p className="large text-dark-med mb-0">{userContext.profile.volunteer_work[editProfileModalIndex].company}</p>
                {/* </a> */}
                <p className="text-dark-low mb-0">{userContext.profile.volunteer_work[editProfileModalIndex].location}</p>
                <p className="text-dark-low mb-0">
                  {userContext.profile.volunteer_work[editProfileModalIndex].starts_at ? (userContext.profile.volunteer_work[editProfileModalIndex].starts_at.month ? convertMonth(userContext.profile.volunteer_work[editProfileModalIndex].starts_at.month) + " " : '') : null}
                  {userContext.profile.volunteer_work[editProfileModalIndex].starts_at ? (userContext.profile.volunteer_work[editProfileModalIndex].starts_at.year ? userContext.profile.volunteer_work[editProfileModalIndex].starts_at.year + " " : null) : null}
                  {userContext.profile.volunteer_work[editProfileModalIndex].starts_at && userContext.profile.volunteer_work[editProfileModalIndex].ends_at == null ? ' – Present' : null}
                  {userContext.profile.volunteer_work[editProfileModalIndex].starts_at && userContext.profile.volunteer_work[editProfileModalIndex].ends_at ? " – " + (userContext.profile.volunteer_work[editProfileModalIndex].ends_at.month ? convertMonth(userContext.profile.volunteer_work[editProfileModalIndex].ends_at.month) : '') : null}
                  {userContext.profile.volunteer_work[editProfileModalIndex].starts_at && userContext.profile.volunteer_work[editProfileModalIndex].ends_at ? (userContext.profile.volunteer_work[editProfileModalIndex].ends_at.year ? " " + userContext.profile.volunteer_work[editProfileModalIndex].ends_at.year : null) : null}
                </p>
                {/* {userContext.profile.volunteer_work[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.volunteer_work[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteVolunteeringClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteVolunteeringSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditVolunteering;