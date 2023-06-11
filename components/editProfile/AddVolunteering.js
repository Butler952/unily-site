import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const AddVolunteering = ({
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
  const [originalVolunteering, setOriginalVolunteering] = useState( userContext.profile.volunteer_work);

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
    setVolunteeringEndDatePresent(volunteeringEndDatePresent => !volunteeringEndDatePresent)
    setVolunteeringEndDatePresentChanged(true)
  }

  const volunteeringDescriptionChange = (value) => {
    setVolunteeringDescription(value),
    setVolunteeringDescriptionChanged(true),
    setVolunteeringDescriptionError('')
  }

  const updateVolunteering = (downloadURL, uid) => {
    let newVolunteering = {}

    newVolunteering.logo_url = downloadURL ? downloadURL : null
    newVolunteering.logo_ref = uid ? uid : null
    newVolunteering.title = volunteeringTitle
    newVolunteering.company = volunteeringCompany
    newVolunteering.location = volunteeringLocation
    newVolunteering.company_linkedin_profile_url = volunteeringUrl

    if (volunteeringStartDate) {
      let startDateMonth = Number(volunteeringStartDate.split('-')[1]);
      let startDateYear = Number(volunteeringStartDate.split('-')[0]);
      newVolunteering.starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    } else {
      newVolunteering.starts_at = null
    }
    if (!volunteeringEndDatePresent) {
      if (volunteeringEndDate) {
        let endDateMonth = Number(volunteeringEndDate.split('-')[1]);
        let endDateYear = Number(volunteeringEndDate.split('-')[0]);
        newVolunteering.ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      } else {
        newVolunteering.ends_at = null
      }
    } else {
      newVolunteering.ends_at = null
    }
    newVolunteering.description = volunteeringDescription

    if (originalVolunteering !== undefined) {
      let originalVolunteeringCopy = originalVolunteering
      originalVolunteeringCopy.unshift(newVolunteering)
      setOriginalVolunteering(originalVolunteeringCopy)
    } else {
      originalVolunteeringCopy = [newVolunteering]
      setOriginalVolunteering(originalVolunteeringCopy)
    }
  }

  // const updateVolunteering = (downloadURL, uid) => {
    
  //   let startDateMonth = Number(volunteeringStartDate.split('-')[1]);
  //   let startDateYear = Number(volunteeringStartDate.split('-')[0]);

  //   let endDateMonth = Number(volunteeringEndDate.split('-')[1]);
  //   let endDateYear = Number(volunteeringEndDate.split('-')[0]);

  //   let newVolunteering = {
  //     'logo_url': downloadURL !== undefined ? downloadURL : '',
  //     'logo_ref': uid !== undefined ? uid : '',
  //     'company': volunteeringCompany,
  //     'title': volunteeringTitle,
  //     'location': volunteeringLocation,
  //     'company_linkedin_profile_url': volunteeringUrl,
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
  //     'description': volunteeringDescription
  //   };

  //   if (originalVolunteering !== undefined) {
  //     originalVolunteering.unshift(newVolunteering)
  //   } else {
  //     originalVolunteering = [newVolunteering]
  //   }
  // }
  
  const handleAddVolunteeringSubmit = (e) => {
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
    if (volunteeringLogoChanged && volunteeringLogo !== '') {

      let uid = uuidv4()
      let filename = `images/${user}/volunteering/${uid}.jpg`

      var metadata = {
        contentType: 'image/jpeg',
        name: filename
      };

      var uploadTask = fire.storage().ref().child(filename).put(volunteeringLogo, metadata);

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
              updateVolunteering(downloadURL, uid)
            })
            .then(() => {
              fire.firestore().collection('users').doc(user).update({
                'profile.volunteer_work': originalVolunteering,
                lastUpdated: fire.firestore.FieldValue.serverTimestamp()
              })
                .then((result) => {
                  let newUserContext = userContext;
                  newUserContext.profile.volunteer_work = originalVolunteering;
                  setUserContext(newUserContext)
                  handleBack()
                })
                .then(() => {
                  setSubmitting(false)
                  toast("Volunteering added")
                })
                .catch((error) => {
                  setSubmitting(false)
                  toast("Unable to add volunteering")
                  //console.error("Error adding document: ", error);
                });
            })

          // Add this link to firestore
        }
      );
    } else {
      updateVolunteering()
      fire.firestore().collection('users').doc(user).update({
        'profile.volunteer_work': originalVolunteering,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then((result) => {
          let newUserContext = userContext;
          newUserContext.profile.volunteer_work = originalVolunteering;
          setUserContext(newUserContext)
          handleBack()
        })
        .then(() => {
          setSubmitting(false)
          toast("Volunteering added")
        })
        .catch((error) => {
          setSubmitting(false)
          toast("Unable to add volunteering")
          //console.error("Error adding document: ", error);
        });
    }
  }

  const hiddenFileInput = useRef(null);

  const handleChangeLogo = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    volunteeringLogoChange(event.target.files[0])
  }

  const handleDeleteLogo = (e) => {
    e.preventDefault();
    volunteeringLogoChange('')
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={volunteeringEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={volunteeringEndDate}
          onChange={({ target }) => volunteeringEndDateChange(target.value)}
        />
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddVolunteeringSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Logo</p>
            {volunteeringLogoChanged ? (volunteeringLogo !== '' ?
              <>
                <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{ gap: '16px' }}>
                  <img src={URL.createObjectURL(volunteeringLogo)} className="radius-3" style={{ width: '96px', height: '96px' }} />
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
              className={volunteeringTitleError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringTitle}
              onChange={({ target }) => volunteeringTitleChange(target.value)}
            />
            {volunteeringTitleError !== '' ? <p className="small text-error-high mt-2">{volunteeringTitleError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Organisation</p>
            <input
              type="text"
              className={volunteeringCompanyError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringCompany}
              onChange={({ target }) => volunteeringCompanyChange(target.value)}
            />
            {volunteeringCompanyError !== '' ? <p className="small text-error-high mt-2">{volunteeringCompanyError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Location</p>
            <input
              type="text"
              className={volunteeringLocationError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringLocation}
              onChange={({ target }) => volunteeringLocationChange(target.value)}
            />
            {volunteeringLocationError !== '' ? <p className="small text-error-high mt-2">{volunteeringLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={volunteeringUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringUrl}
              onChange={({ target }) => volunteeringUrlChange(target.value)}
            />
            {volunteeringUrlError !== '' ? <p classUrl="small text-error-high mt-2">{volunteeringUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={volunteeringStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringStartDate}
              onChange={({ target }) => volunteeringStartDateChange(target.value)}
            />
            {volunteeringLocationError !== '' ? <p className="small text-error-high mt-2">{volunteeringLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { !volunteeringEndDatePresent && <EndDateInput/> } 
            {/* { !volunteeringEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.volunteer_work[editProfileModalIndex] && 
                userContext.profile.volunteer_work[editProfileModalIndex].ends_at && 
                userContext.profile.volunteer_work[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''}  */}
            {volunteeringLocationError !== '' ? <p className="small text-error-high mt-2">{volunteeringLocationError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I currently work here
              <input 
                type="checkbox" 
                onChange={() => volunteeringEndDatePresentChange()} 
                checked={volunteeringEndDatePresent}
              />
              {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={volunteeringDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringDescription}
              onChange={({ target }) => volunteeringDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {volunteeringDescriptionError !== '' ? <p className="small text-error-high mt-2">{volunteeringDescriptionError}</p> : null}
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

export default AddVolunteering;