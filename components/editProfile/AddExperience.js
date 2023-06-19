import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const AddExperience = ({
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
  const [originalExperiences, setOriginalExperiences] = useState(userContext && userContext.profile && userContext.profile.experiences);

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
    setExperiencesEndDatePresent(experiencesEndDatePresent => !experiencesEndDatePresent)
    setExperiencesEndDatePresentChanged(true)
  }

  const experiencesDescriptionChange = (value) => {
    setExperiencesDescription(value),
    setExperiencesDescriptionChanged(true),
    setExperiencesDescriptionError('')
  }

  const updateExperiences = (downloadURL, uid) => {
    let newExperience = {}

    newExperience.logo_url = downloadURL ? downloadURL : null
    newExperience.logo_ref = uid ? uid : null
    newExperience.title = experiencesTitle
    newExperience.company = experiencesCompany
    newExperience.location = experiencesLocation
    newExperience.company_linkedin_profile_url = experiencesUrl

    if (experiencesStartDate) {
      let startDateMonth = Number(experiencesStartDate.split('-')[1]);
      let startDateYear = Number(experiencesStartDate.split('-')[0]);
      newExperience.starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    } else {
      newExperience.starts_at = null
    }
    if (!experiencesEndDatePresent) {
      if (experiencesEndDate) {
        let endDateMonth = Number(experiencesEndDate.split('-')[1]);
        let endDateYear = Number(experiencesEndDate.split('-')[0]);
        newExperience.ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      } else {
        newExperience.ends_at = null
      }
    } else {
      newExperience.ends_at = null
    }
    newExperience.description = experiencesDescription

    if (originalExperiences !== undefined) {
      let originalExperiencesCopy = originalExperiences
      originalExperiencesCopy.unshift(newExperience)
      setOriginalExperiences(originalExperiencesCopy)
    } else {
      originalExperiencesCopy = [newExperience]
      setOriginalExperiences(originalExperiencesCopy)
    }
  }


  // const updateExperiences = (downloadURL, uid) => {

  //   let startDateMonth = Number(experiencesStartDate.split('-')[1]);
  //   let startDateYear = Number(experiencesStartDate.split('-')[0]);

  //   let endDateMonth = Number(experiencesEndDate.split('-')[1]);
  //   let endDateYear = Number(experiencesEndDate.split('-')[0]);

  //   let newExperience = {
  //     'logo_url': downloadURL !== undefined ? downloadURL : '',
  //     'logo_ref': uid !== undefined ? uid : '',
  //     'company': experiencesCompany,
  //     'title': experiencesTitle,
  //     'location': experiencesLocation,
  //     'url': experiencesUrl,
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
  //     'description': experiencesDescription
  //   };

  //   if (originalExperiences !== undefined) {
  //     originalExperiences.unshift(newExperience)
  //   } else {
  //     originalExperiences = [newExperience]
  //   }
  // }

  const handleAddExperiencesSubmit = (e) => {
    e.preventDefault();

    if (experiencesCompany === '') {
      setExperiencesCompanyError('Company name cannot be empty')
      return null;
    }
    if (experiencesTitle === '') {
      setExperiencesTitleError('Job title cannot be empty')
      return null;
    }

    setSubmitting(true)

    if (experiencesLogoChanged && experiencesLogo !== '') {

      let uid = uuidv4()
      let filename = `images/${user}/experiences/${uid}.jpg`

      var metadata = {
        contentType: 'image/jpeg',
        name: filename
      };

      var uploadTask = fire.storage().ref().child(filename).put(experiencesLogo, metadata);

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
              updateExperiences(downloadURL, uid)
            })
            .then(() => {
              fire.firestore().collection('users').doc(user).update({
                'profile.experiences': originalExperiences,
                lastUpdated: fire.firestore.FieldValue.serverTimestamp()
              })
                .then((result) => {
                  let newUserContext = userContext;
                  newUserContext.profile.experiences = originalExperiences;
                  setUserContext(newUserContext)
                  handleBack()
                })
                .then(() => {
                  setSubmitting(false)
                  toast("Experience added")
                })
                .catch((error) => {
                  setSubmitting(false)
                  toast("Unable to add experience")
                  //console.error("Error adding document: ", error);
                });
            })

          // Add this link to firestore
        }
      );
    } else {
      updateExperiences()
      fire.firestore().collection('users').doc(user).update({
        'profile.experiences': originalExperiences,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then((result) => {
          let newUserContext = userContext;
          newUserContext.profile.experiences = originalExperiences;
          setUserContext(newUserContext)
          handleBack()
        })
        .then(() => {
          setSubmitting(false)
          toast("Experience added")
        })
        .catch((error) => {
          setSubmitting(false)
          toast("Unable to add experience")
          //console.error("Error adding document: ", error);
        });
    }
  }

  const hiddenFileInput = useRef(null);

  const handleChangeLogo = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    experiencesLogoChange(event.target.files[0])
  }

  const handleDeleteLogo = (e) => {
    e.preventDefault();
    experiencesLogoChange('')
  }

  const EndDateInput = () => {
    return (
      <>
        <input
          type="month"
          className={experiencesEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={experiencesEndDate}
          onChange={({ target }) => experiencesEndDateChange(target.value)}
        />
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddExperiencesSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Logo</p>
            {experiencesLogoChanged ? (experiencesLogo !== '' ?
              <>
                <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{ gap: '16px' }}>
                  <img src={URL.createObjectURL(experiencesLogo)} className="radius-3" style={{ width: '96px', height: '96px' }} />
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
            <p className="text-dark-high mb-2">Title</p>
            <input
              type="text"
              className={experiencesTitleError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesTitle}
              onChange={({ target }) => experiencesTitleChange(target.value)}
            />
            {experiencesTitleError !== '' ? <p className="small text-error-high mt-2">{experiencesTitleError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Company</p>
            <input
              type="text"
              className={experiencesCompanyError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesCompany}
              onChange={({ target }) => experiencesCompanyChange(target.value)}
            />
            {experiencesCompanyError !== '' ? <p className="small text-error-high mt-2">{experiencesCompanyError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Location</p>
            <input
              type="text"
              className={experiencesLocationError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesLocation}
              onChange={({ target }) => experiencesLocationChange(target.value)}
            />
            {experiencesLocationError !== '' ? <p className="small text-error-high mt-2">{experiencesLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={experiencesUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesUrl}
              onChange={({ target }) => experiencesUrlChange(target.value)}
            />
            {experiencesUrlError !== '' ? <p classUrl="small text-error-high mt-2">{experiencesUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input
              type="month"
              className={experiencesStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesStartDate}
              onChange={({ target }) => experiencesStartDateChange(target.value)}
            />
            {experiencesStartDateError !== '' ? <p className="small text-error-high mt-2">{experiencesStartDateError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            {!experiencesEndDatePresent && <EndDateInput />}
            {/* { !experiencesEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.experiences[editProfileModalIndex] && 
                userContext.profile.experiences[editProfileModalIndex].ends_at && 
                userContext.profile.experiences[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''}  */}
            {experiencesEndDateError !== '' ? <p className="small text-error-high mt-2">{experiencesEndDateError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I currently work here
              <input
                type="checkbox"
                onChange={() => experiencesEndDatePresentChange()}
                checked={experiencesEndDatePresent}
              />
              {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea
              className={experiencesDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesDescription}
              onChange={({ target }) => experiencesDescriptionChange(target.value)}
              style={{ minHeight: '240px' }}
            />
            {experiencesDescriptionError !== '' ? <p className="small text-error-high mt-2">{experiencesDescriptionError}</p> : null}
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{ gap: '12px' }}>
            <button type="button" onClick={handleBack} className="btn dark medium w-100 w-sm-auto" disabled={submitting}>Cancel</button>
            <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Add' : 'Adding...'}</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddExperience;