import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const AddEducation = ({
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
  educationUrl,
  setEducationUrl,
  educationUrlChanged,
  setEducationUrlChanged,
  educationUrlError,
  setEducationUrlError,
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
  const [originalEducation, setOriginalEducation] = useState( userContext && userContext.profile && userContext.profile.education);

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
    setEducationEndDatePresent(educationEndDatePresent => !educationEndDatePresent)
    setEducationEndDatePresentChanged(true)
  }

  const educationUrlChange = (value) => {
    setEducationUrl(value),
    setEducationUrlChanged(true),
    setEducationUrlError('')
  }

  const educationDescriptionChange = (value) => {
    setEducationDescription(value),
    setEducationDescriptionChanged(true),
    setEducationDescriptionError('')
  }

  const updateEducation = (downloadURL, uid) => {
    let newEducation = {}

    newEducation.logo_url = downloadURL ? downloadURL : null
    newEducation.logo_ref = uid ? uid : null
    newEducation.school = educationSchool
    newEducation.field_of_study = educationFieldOfStudy
    newEducation.degree_name = educationDegreeName
    newEducation.location = educationLocation
    newEducation.school_linkedin_profile_url = educationUrl

    if (educationStartDate) {
      let startDateMonth = Number(educationStartDate.split('-')[1]);
      let startDateYear = Number(educationStartDate.split('-')[0]);
      newEducation.starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    } else {
      newEducation.starts_at = null
    }
    if (!educationEndDatePresent) {
      if (educationEndDate) {
        let endDateMonth = Number(educationEndDate.split('-')[1]);
        let endDateYear = Number(educationEndDate.split('-')[0]);
        newEducation.ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      } else {
        newEducation.ends_at = null
      }
    } else {
      newEducation.ends_at = null
    }
    newEducation.description = educationDescription

    if (originalEducation !== undefined) {
      originalEducation.unshift(newEducation)
    } else {
      originalEducation = [newEducation]
    }
  }

  // const updateEducation = (downloadURL, uid) => {

  //   let startDateMonth = Number(educationStartDate.split('-')[1]);
  //   let startDateYear = Number(educationStartDate.split('-')[0]);

  //   let endDateMonth = Number(educationEndDate.split('-')[1]);
  //   let endDateYear = Number(educationEndDate.split('-')[0]);

  //   let newEducation = {
  //     'logo_url': downloadURL !== undefined ? downloadURL : '',
  //     'logo_ref': uid !== undefined ? uid : '',
  //     'school': educationSchool,
  //     'field_of_study': educationFieldOfStudy,
  //     'degree_name': educationDegreeName,
  //     'location': educationLocation,
  //     'school_linkedin_profile_url': educationUrl,
  //     'starts_at': {
  //       'day': 1,
  //       'month': startDateMonth,
  //       'year': startDateYear
  //     },
  //     'ends_at': {
  //       'day': 31,
  //       'month': endDateMonth,
  //       'year': endDateYear
  //     },
  //     'description': educationDescription
  //   };
    
  //   if (originalEducation !== undefined) {
  //     originalEducation.unshift(newEducation)
  //   } else {
  //     originalEducation = [newEducation]
  //   }
  // }
  
  const handleAddEducationSubmit = (e) => {
    e.preventDefault();

    if (educationSchool === '') {
      setEducationSchoolError('School cannot be empty')
      return null;
    }
    if (educationDegreeName === '') {
      setEducationFieldOfStudyError('Degree type cannot be empty')
      return null;
    }

    setSubmitting(true)

    if (educationLogoChanged && educationLogo !== '') {

      let uid = uuidv4()
      let filename = `images/${user}/education/${uid}.jpg`

      var metadata = {
        contentType: 'image/jpeg',
        name: filename
      };

      var uploadTask = fire.storage().ref().child(filename).put(educationLogo, metadata);

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
              updateEducation(downloadURL, uid)
            })
            .then(() => {
              fire.firestore().collection('users').doc(user).update({
                'profile.education': originalEducation,
                lastUpdated: fire.firestore.FieldValue.serverTimestamp()
              })
                .then((result) => {
                  let newUserContext = userContext;
                  newUserContext.profile.education = originalEducation;
                  setUserContext(newUserContext)
                  handleBack()
                })
                .then(() => {
                  setSubmitting(false)
                  toast("Education added")
                })
                .catch((error) => {
                  setSubmitting(false)
                  toast("Unable to add education")
                  //console.error("Error adding document: ", error);
                });
            })

          // Add this link to firestore
        }
      );
    } else {
      updateEducation()
      fire.firestore().collection('users').doc(user).update({
        'profile.education': originalEducation,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then((result) => {
          let newUserContext = userContext;
          newUserContext.profile.education = originalEducation;
          setUserContext(newUserContext)
          handleBack()
        })
        .then(() => {
          setSubmitting(false)
          toast("Education added")
        })
        .catch((error) => {
          setSubmitting(false)
          toast("Unable to add education")
          //console.error("Error adding document: ", error);
        });
    }
  }

  const hiddenFileInput = useRef(null);

  const handleChangeLogo = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    educationLogoChange(event.target.files[0])
  }

  const handleDeleteLogo = (e) => {
    e.preventDefault();
    educationLogoChange('')
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={educationEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={educationEndDate}
          onChange={({ target }) => educationEndDateChange(target.value)}
        />
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddEducationSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Logo</p>
            {educationLogoChanged ? (educationLogo !== '' ?
              <>
                <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{ gap: '16px' }}>
                  <img src={URL.createObjectURL(educationLogo)} className="radius-3" style={{ width: '96px', height: '96px' }} />
                  <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={submitting} onClick={handleChangeLogo}>Change</button>
                  <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={submitting} onClick={handleDeleteLogo}>Remove</button>
                </div>
              </>
              :
              <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={submitting} onClick={handleChangeLogo}>Add logo</button>
            )
              :
              <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={submitting} onClick={handleChangeLogo}>Add logo</button>
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
          <div className="mb-3">
            <p className="text-dark-high mb-2">Field of study</p>
            <input
              type="text"
              className={educationFieldOfStudyError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationFieldOfStudy}
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
              value={educationSchool}
              onChange={({ target }) => educationSchoolChange(target.value)}
            />
            {educationSchoolError !== '' ? <p className="small text-error-high mt-2">{educationSchoolError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Location</p>
            <input
              type="text"
              className={educationLocationError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationLocation}
              onChange={({ target }) => educationLocationChange(target.value)}
            />
            {educationLocationError !== '' ? <p className="small text-error-high mt-2">{educationLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={educationUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationUrl}
              onChange={({ target }) => educationUrlChange(target.value)}
            />
            {educationUrlError !== '' ? <p classUrl="small text-error-high mt-2">{educationUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={educationStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationStartDate}
              onChange={({ target }) => educationStartDateChange(target.value)}
            />
            {educationLocationError !== '' ? <p className="small text-error-high mt-2">{educationLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { !educationEndDatePresent && <EndDateInput/> } 
            {/* { !educationEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.education[editProfileModalIndex] && 
                userContext.profile.education[editProfileModalIndex].ends_at && 
                userContext.profile.education[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''}  */}
            {educationLocationError !== '' ? <p className="small text-error-high mt-2">{educationLocationError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I currently study here
              <input 
                type="checkbox" 
                onChange={() => educationEndDatePresentChange()} 
                checked={educationEndDatePresent}
              />
              {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={educationDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationDescription}
              onChange={({ target }) => educationDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {educationDescriptionError !== '' ? <p className="small text-error-high mt-2">{educationDescriptionError}</p> : null}
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleBack} className="btn dark medium w-100 w-sm-auto" disabled={submitting}>Cancel</button>
            <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Add' : 'Adding...'}</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddEducation;