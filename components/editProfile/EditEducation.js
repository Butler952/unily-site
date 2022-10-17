import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditEducation = ({
  user,
  editProfileModalIndex,
  educationLogo,
  setEducationLogo,
  educationLogoChanged,
  setEducationLogoChanged,
  educationSchool,
  setEducationSchool,
  educationSchoolChanged,
  setEducationSchoolChanged,
  educationSchoolError,
  setEducationSchoolError,
  educationFieldOfStudy,
  setEducationFieldOfStudy,
  educationFieldOfStudyChanged,
  setEducationFieldOfStudyChanged,
  educationFieldOfStudyError,
  setEducationFieldOfStudyError,
  educationDegreeName,
  setEducationDegreeName,
  educationDegreeNameChanged,
  setEducationDegreeNameChanged,
  educationDegreeNameError,
  setEducationDegreeNameError,
  educationLocation,
  setEducationLocation,
  educationLocationChanged,
  setEducationLocationChanged,
  educationLocationError,
  setEducationLocationError,
  educationUrl,
  setEducationUrl,
  educationUrlChanged,
  setEducationUrlChanged,
  educationUrlError,
  setEducationUrlError,
  educationStartDate,
  setEducationStartDate,
  educationStartDateInputType,
  setEducationStartDateInputType,
  educationStartDateChanged,
  setEducationStartDateChanged,
  educationStartDateError,
  setEducationStartDateError,
  educationEndDate,
  setEducationEndDate,
  educationEndDateInputType,
  setEducationEndDateInputType,
  educationEndDateChanged,
  setEducationEndDateChanged,
  educationEndDateError,
  setEducationEndDateError,
  educationEndDatePresent,
  setEducationEndDatePresent,
  educationEndDatePresentChanged,
  setEducationEndDatePresentChanged,
  educationDescription,
  setEducationDescription,
  educationDescriptionChanged,
  setEducationDescriptionChanged,
  educationDescriptionError,
  setEducationDescriptionError,
  educationShowDeleteEducationModal,
  setEducationShowDeleteEducationModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [originalEducation, setOriginalEducation] = useState( userContext.profile.education);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const educationLogoChange = (value) => {
    setEducationLogo(value),
    setEducationLogoChanged(true)
  }

  const educationSchoolChange = (value) => {
    setEducationSchool(value),
    setEducationSchoolChanged(true),
    setEducationSchoolError('')
  }

  const educationFieldOfStudyChange = (value) => {
    setEducationFieldOfStudy(value),
    setEducationFieldOfStudyChanged(true),
    setEducationFieldOfStudyError('')
  }

  const educationDegreeNameChange = (value) => {
    setEducationDegreeName(value),
    setEducationDegreeNameChanged(true),
    setEducationDegreeNameError('')
  }

  const educationLocationChange = (value) => {
    setEducationLocation(value),
    setEducationLocationChanged(true),
    setEducationLocationError('')
  }

  const educationUrlChange = (value) => {
    setEducationUrl(value),
    setEducationUrlChanged(true),
    setEducationUrlError('')
  }

  const educationStartDateChange = (value) => {
    setEducationStartDate(value),
    setEducationStartDateChanged(true),
    setEducationStartDateError('')
  }

  const educationStartDateChangeInputType = () => {
    setEducationStartDateInputType('month')
  }

  const educationEndDateChange = (value) => {
    setEducationEndDate(value),
    setEducationEndDateChanged(true),
    setEducationEndDateError('')
  }

  const educationEndDateChangeInputType = () => {
    setEducationEndDateInputType('month')
  }

  const educationEndDatePresentChange = () => {
    if (!educationEndDatePresentChanged) {
      if (userContext.profile.education[editProfileModalIndex].ends_at !== undefined) {
        setEducationEndDatePresent(true)
      } else {
        setEducationEndDatePresent(false)
      }
    } else {
      setEducationEndDatePresent(educationEndDatePresent => !educationEndDatePresent)
    }
    setEducationEndDatePresentChanged(true)
  }

  const educationDescriptionChange = (value) => {
    setEducationDescription(value),
    setEducationDescriptionChanged(true),
    setEducationDescriptionError('')
  }

  const updateEducation = (index) => {
    if (educationSchoolChanged) {
      originalEducation[index].school = educationSchool
    }
    if (educationFieldOfStudyChanged) {
      originalEducation[index].field_of_study = educationFieldOfStudy
    }
    if (educationDegreeNameChanged) {
      originalEducation[index].degree_name = educationDegreeName
    }
    if (educationLocationChanged) {
      originalEducation[index].location = educationLocation
    }
    if (educationUrlChanged) {
      originalEducation[index].school_linkedin_profile_url = educationUrl
    }
    if (educationStartDateChanged) {
      let startDateMonth = Number(educationStartDate.split('-')[1]);
      let startDateYear = Number(educationStartDate.split('-')[0]);
      originalEducation[index].starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    }
    if (!educationEndDatePresent) {
      if (educationEndDateChanged) {
        let endDateMonth = Number(educationEndDate.split('-')[1]);
        let endDateYear = Number(educationEndDate.split('-')[0]);
        originalEducation[index].ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      }
    } else {
      delete originalEducation[index].ends_at
    }
    if (educationDescriptionChanged) {
      originalEducation[index].description = educationDescription
    }
  }
  
  const handleEditEducationSubmit = (e) => {
    e.preventDefault();

    if (educationSchoolChanged && educationSchool === '') {
      setSchoolError('Your first name cannot be empty')
      return null;
    }
    if (educationFieldOfStudyChanged && educationFieldOfStudy === '') {
      setFieldOfStudyError('Field of study cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateEducation(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.education': originalEducation,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.education = originalEducation;
      setUserContext(newUserContext)
    })
    .then(() => {
      setSubmitting(false)
      toast("Education updated")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to update education")
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

    let uid = userContext.profile.education[editProfileModalIndex].logo_ref ? userContext.profile.education[editProfileModalIndex].logo_ref : uuidv4()
    let filename = `images/${user}/education/${userContext.profile.education[editProfileModalIndex].logo_ref ? userContext.profile.education[editProfileModalIndex].logo_ref : uid}.jpg`

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
          originalEducation[editProfileModalIndex].logo_url = downloadURL
          originalEducation[editProfileModalIndex].logo_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.education': originalEducation,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.education[editProfileModalIndex].logo_url = downloadURL;
            newUserContext.profile.education[editProfileModalIndex].logo_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            educationLogoChange(downloadURL)
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

    // let filename = originalEducation[editProfileModalIndex].logo_url
    // let filename = userContext.profile.education[editProfileModalIndex].logo_url
    let filename = `images/${user}/education/${userContext.profile.education[editProfileModalIndex].logo_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalEducation[editProfileModalIndex].logo_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.education': originalEducation,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.education[editProfileModalIndex].logo_url = null;
        setUserContext(newUserContext)
        educationLogoChange('')
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

  // const deleteEducation = (index) => {
  //   delete originalEducation[index]
  // }

  const handleDeleteEducationShow = () => {
    setEducationShowDeleteEducationModal(true)
  }

  const handleDeleteEducationClose = () => {
    setEducationShowDeleteEducationModal(false)
  }

  const handleDeleteEducationSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalEducation[editProfileModalIndex]
    originalEducation.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.education': originalEducation,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setEducationShowDeleteEducationModal(false)
        setDeleting(false)
        toast("Education deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete education")
        //console.error("Error adding document: ", error);
      });
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={educationEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={educationEndDateChanged ? educationEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.education[editProfileModalIndex] && 
              userContext.profile.education[editProfileModalIndex].ends_at && 
              userContext.profile.education[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.education[editProfileModalIndex] && 
              userContext.profile.education[editProfileModalIndex].ends_at && 
              `${userContext.profile.education[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.education[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          }
          onChange={({ target }) => educationEndDateChange(target.value)}
        />
      {/* <input 
          // type="month"
          type={
            userContext && 
            userContext.profile && 
            userContext.profile.education[editProfileModalIndex] && 
            userContext.profile.education[editProfileModalIndex].ends_at && 
            userContext.profile.education[editProfileModalIndex].ends_at !== undefined ? 'month' : educationEndDateInputType
          }
          // onFocus={this.type = 'month'}
          onFocus={() => educationEndDateChangeInputType()}
          placeholder="Choose a date"
          className={`small w-100 ${educationEndDateError !== '' ? 'error' : ''}`}
          value={educationEndDateInputType == "text" ? '' : (
            educationEndDateChanged ? educationEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.education[editProfileModalIndex] && 
              userContext.profile.education[editProfileModalIndex].ends_at && 
              userContext.profile.education[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.education[editProfileModalIndex] && 
              userContext.profile.education[editProfileModalIndex].ends_at && 
              `${userContext.profile.education[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.education[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          )}
          onChange={({ target }) => educationEndDateChange(target.value)}
        /> */}
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditEducationSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Logo</p>
            { educationLogoChanged ? (educationLogo !== '' ? 
              <>
                <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                  <img src={educationLogoChanged ? educationLogo : (userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].logo_url && userContext.profile.education[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].logo_url && userContext.profile.education[editProfileModalIndex].logo_url : '')} className="radius-3" style={{width: '96px', height: '96px'}}/>
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
                userContext.profile.education[editProfileModalIndex] && 
                userContext.profile.education[editProfileModalIndex].logo_url &&
                userContext.profile.education[editProfileModalIndex].logo_url ?
                <>
                  <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                  <img src={educationLogoChanged ? educationLogo : (userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].logo_url && userContext.profile.education[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].logo_url && userContext.profile.education[editProfileModalIndex].logo_url : '')} className="radius-3" style={{width: '96px', height: '96px'}}/>
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
            <p className="text-dark-high mb-2">Field of study</p>
            <input
              type="text"
              className={educationFieldOfStudyError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationFieldOfStudyChanged ? educationFieldOfStudy : (userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].field_of_study && userContext.profile.education[editProfileModalIndex].field_of_study !== undefined ? userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].field_of_study && userContext.profile.education[editProfileModalIndex].field_of_study : '')}
              onChange={({ target }) => educationFieldOfStudyChange(target.value)}
            />
            {educationFieldOfStudyError !== '' ? <p className="small text-error-high mt-2">{educationFieldOfStudyError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Degree type</p>
            <input
              type="text"
              className={educationDegreeNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationDegreeNameChanged ? educationDegreeName : (userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].degree_name && userContext.profile.education[editProfileModalIndex].degree_name !== undefined ? userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].degree_name && userContext.profile.education[editProfileModalIndex].degree_name : '')}
              onChange={({ target }) => educationDegreeNameChange(target.value)}
            />
            {educationDegreeNameError !== '' ? <p className="small text-error-high mt-2">{educationDegreeNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">School</p>
            <input
              type="text"
              className={educationSchoolError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationSchoolChanged ? educationSchool : (userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].school && userContext.profile.education[editProfileModalIndex].school !== undefined ? userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].school && userContext.profile.education[editProfileModalIndex].school : '')}
              onChange={({ target }) => educationSchoolChange(target.value)}
            />
            {educationSchoolError !== '' ? <p className="small text-error-high mt-2">{educationSchoolError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Location</p>
            <input
              type="text"
              className={educationLocationError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationLocationChanged ? educationLocation : (userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].location && userContext.profile.education[editProfileModalIndex].location !== undefined ? userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].location && userContext.profile.education[editProfileModalIndex].location : '')}
              onChange={({ target }) => educationLocationChange(target.value)}
            />
            {educationLocationError !== '' ? <p className="small text-error-high mt-2">{educationLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={educationUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationUrlChanged ? educationUrl : (userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].school_linkedin_profile_url && userContext.profile.education[editProfileModalIndex].school_linkedin_profile_url !== undefined ? userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].school_linkedin_profile_url && userContext.profile.education[editProfileModalIndex].school_linkedin_profile_url : '')}
              onChange={({ target }) => educationUrlChange(target.value)}
            />
            {educationUrlError !== '' ? <p className="small text-error-high mt-2">{educationUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={educationStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationStartDateChanged ? educationStartDate : 
                (
                  userContext && 
                  userContext.profile && 
                  userContext.profile.education[editProfileModalIndex] && 
                  userContext.profile.education[editProfileModalIndex].starts_at && 
                  userContext.profile.education[editProfileModalIndex].starts_at !== undefined ? 
                  userContext && 
                  userContext.profile && 
                  userContext.profile.education[editProfileModalIndex] && 
                  userContext.profile.education[editProfileModalIndex].starts_at && 
                  `${userContext.profile.education[editProfileModalIndex].starts_at.year}-${('0' + userContext.profile.education[editProfileModalIndex].starts_at.month).slice(-2)}`
                : 
                  ''
                )
              }
              onChange={({ target }) => educationStartDateChange(target.value)}
            />
            {educationLocationError !== '' ? <p className="small text-error-high mt-2">{educationLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { educationEndDatePresentChanged ? (!educationEndDatePresent ? <EndDateInput/>  : '' ) : '' } 
            { !educationEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.education[editProfileModalIndex] && 
                userContext.profile.education[editProfileModalIndex].ends_at && 
                userContext.profile.education[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''} 
            {educationLocationError !== '' ? <p className="small text-error-high mt-2">{educationLocationError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I currently study here
              <input 
                type="checkbox" 
                onChange={() => educationEndDatePresentChange()} 
                checked={educationEndDatePresentChanged ? educationEndDatePresent : 
                  (
                    userContext && 
                    userContext.profile && 
                    userContext.profile.education[editProfileModalIndex] && 
                    userContext.profile.education[editProfileModalIndex].ends_at == undefined ? true
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
              className={educationDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationDescriptionChanged ? educationDescription : (
                userContext &&
                userContext.profile &&
                userContext.profile.education &&
                userContext.profile.education[editProfileModalIndex] &&
                userContext.profile.education[editProfileModalIndex].description !== undefined ? userContext.profile.education[editProfileModalIndex].description : '')
              }
              onChange={({ target }) => educationDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {educationDescriptionError !== '' ? <p className="small text-error-high mt-2">{educationDescriptionError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <input
              type="text"
              className={educationDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationDescriptionChanged ? educationDescription : (userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].description && userContext.profile.education[editProfileModalIndex].description !== undefined ? userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].description && userContext.profile.education[editProfileModalIndex].description : '')}
              onChange={({ target }) => educationDescriptionChange(target.value)}
            />
            {educationDescriptionError !== '' ? <p className="small text-error-high mt-2">{educationDescriptionError}</p> : null}
          </div> */}
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteEducationShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeleteEducationShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
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
        show={educationShowDeleteEducationModal} 
        onHide={handleDeleteEducationClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete education?</h5>
          </div>
          <button onClick={handleDeleteEducationClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete education</h5>
            </div>
            <button onClick={handleDeleteEducationClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.education &&
              userContext.profile.education[editProfileModalIndex] &&
            <div className="d-flex flex-row justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              { userContext.profile.education[editProfileModalIndex].logo_url ?
              <div>
                <img className={styles.educationImage} src={userContext.profile.education[editProfileModalIndex].logo_url ? userContext.profile.education[editProfileModalIndex].logo_url : null} style={{width: '64px'}}/>
              </div>
              : ''}
              <div className="w-100">
                <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.education[editProfileModalIndex].field_of_study}</p>
                {/* <a target="_blank" href={userContext.profile.education[editProfileModalIndex].school_linkedin_profile_url} className="text-decoration-none"> */}
                <p className="large text-dark-med mb-0">{userContext.profile.education[editProfileModalIndex].school}</p>
                {/* </a> */}
                <p className="text-dark-low mb-0">{userContext.profile.education[editProfileModalIndex].location}</p>
                <p className="text-dark-low mb-0">
                  {userContext.profile.education[editProfileModalIndex].starts_at ? (userContext.profile.education[editProfileModalIndex].starts_at.month ? convertMonth(userContext.profile.education[editProfileModalIndex].starts_at.month) + " " : '') : null}
                  {userContext.profile.education[editProfileModalIndex].starts_at ? (userContext.profile.education[editProfileModalIndex].starts_at.year ? userContext.profile.education[editProfileModalIndex].starts_at.year + " " : null) : null}
                  {userContext.profile.education[editProfileModalIndex].starts_at && userContext.profile.education[editProfileModalIndex].ends_at == null ? ' – Present' : null}
                  {userContext.profile.education[editProfileModalIndex].starts_at && userContext.profile.education[editProfileModalIndex].ends_at ? " – " + (userContext.profile.education[editProfileModalIndex].ends_at.month ? convertMonth(userContext.profile.education[editProfileModalIndex].ends_at.month) : '') : null}
                  {userContext.profile.education[editProfileModalIndex].starts_at && userContext.profile.education[editProfileModalIndex].ends_at ? (userContext.profile.education[editProfileModalIndex].ends_at.year ? " " + userContext.profile.education[editProfileModalIndex].ends_at.year : null) : null}
                </p>
                {/* {userContext.profile.education[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.education[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteEducationClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteEducationSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditEducation;