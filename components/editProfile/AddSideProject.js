import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const AddSideProject = ({
  user,
  editProfileModalIndex,
  sideProjectsLogo,
  setSideProjectsLogo,
  sideProjectsLogoChanged,
  setSideProjectsLogoChanged,
  sideProjectsImage,
  setSideProjectsImage,
  sideProjectsImageChanged,
  setSideProjectsImageChanged,
  sideProjectsName,
  setSideProjectsName,
  sideProjectsNameChanged,
  setSideProjectsNameChanged,
  sideProjectsNameError,
  setSideProjectsNameError,
  sideProjectsTagline,
  setSideProjectsTagline,
  sideProjectsTaglineChanged,
  setSideProjectsTaglineChanged,
  sideProjectsTaglineError,
  setSideProjectsTaglineError,
  sideProjectsUrl,
  setSideProjectsUrl,
  sideProjectsUrlChanged,
  setSideProjectsUrlChanged,
  sideProjectsUrlError,
  setSideProjectsUrlError,
  sideProjectsStartDate,
  setSideProjectsStartDate,
  sideProjectsStartDateInputType,
  setSideProjectsStartDateInputType,
  sideProjectsStartDateChanged,
  setSideProjectsStartDateChanged,
  sideProjectsStartDateError,
  setSideProjectsStartDateError,
  sideProjectsEndDate,
  setSideProjectsEndDate,
  sideProjectsEndDateInputType,
  setSideProjectsEndDateInputType,
  sideProjectsEndDateChanged,
  setSideProjectsEndDateChanged,
  sideProjectsEndDateError,
  setSideProjectsEndDateError,
  sideProjectsEndDatePresent,
  setSideProjectsEndDatePresent,
  sideProjectsEndDatePresentChanged,
  setSideProjectsEndDatePresentChanged,
  sideProjectsDescription,
  setSideProjectsDescription,
  sideProjectsDescriptionChanged,
  setSideProjectsDescriptionChanged,
  sideProjectsDescriptionError,
  setSideProjectsDescriptionError,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [originalSideProjects, setOriginalSideProjects] = useState(userContext.profile.side_projects);

  const sideProjectsLogoChange = (value) => {
    setSideProjectsLogo(value),
    setSideProjectsLogoChanged(true)
  }

  const sideProjectsImageChange = (value) => {
    setSideProjectsImage(value),
    setSideProjectsImageChanged(true)
  }

  const sideProjectsNameChange = (value) => {
    setSideProjectsName(value),
    setSideProjectsNameChanged(true),
    setSideProjectsNameError('')
  }

  const sideProjectsTaglineChange = (value) => {
    setSideProjectsTagline(value),
    setSideProjectsTaglineChanged(true),
    setSideProjectsTaglineError('')
  }

  const sideProjectsUrlChange = (value) => {
    setSideProjectsUrl(value),
    setSideProjectsUrlChanged(true),
    setSideProjectsUrlError('')
  }

  const sideProjectsStartDateChange = (value) => {
    setSideProjectsStartDate(value),
    setSideProjectsStartDateChanged(true),
    setSideProjectsStartDateError('')
  }

  const sideProjectsStartDateChangeInputType = () => {
    setSideProjectsStartDateInputType('month')
  }

  const sideProjectsEndDateChange = (value) => {
    setSideProjectsEndDate(value),
    setSideProjectsEndDateChanged(true),
    setSideProjectsEndDateError('')
  }

  const sideProjectsEndDateChangeInputType = () => {
    setSideProjectsEndDateInputType('month')
  }

  const sideProjectsEndDatePresentChange = () => {
    setSideProjectsEndDatePresent(sideProjectsEndDatePresent => !sideProjectsEndDatePresent)
    setSideProjectsEndDatePresentChanged(true)
  }

  const sideProjectsDescriptionChange = (value) => {
    setSideProjectsDescription(value),
    setSideProjectsDescriptionChanged(true),
    setSideProjectsDescriptionError('')
  }

  const updateSideProjects = (downloadURL, uid) => {
    let newSideProject = {}

    newSideProject.logo_url = downloadURL ? downloadURL : null
    newSideProject.logo_ref = uid ? uid : null
    newSideProject.name = sideProjectsName
    newSideProject.tagline = sideProjectsTagline
    newSideProject.url = sideProjectsUrl

    if (sideProjectsStartDate) {
      let startDateMonth = Number(sideProjectsStartDate.split('-')[1]);
      let startDateYear = Number(sideProjectsStartDate.split('-')[0]);
      newSideProject.starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    } else {
      newSideProject.starts_at = null
    }
    if (!sideProjectsEndDatePresent) {
      if (sideProjectsEndDate) {
        let endDateMonth = Number(sideProjectsEndDate.split('-')[1]);
        let endDateYear = Number(sideProjectsEndDate.split('-')[0]);
        newSideProject.ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      } else {
        newSideProject.ends_at = null
      }
    } else {
      newSideProject.ends_at = null
    }
    newSideProject.description = sideProjectsDescription

    if (originalSideProjects !== undefined) {
      let originalSideProjectsCopy = originalSideProjects
      originalSideProjectsCopy.unshift(newSideProject)
      setOriginalSideProjects(originalSideProjectsCopy)
    } else {
      originalSideProjectsCopy = [newSideProject]
      setOriginalSideProjects(originalSideProjectsCopy)
    }
  }

  // const updateSideProjects = (downloadURL, uid) => {

  //   let startDateMonth = Number(sideProjectsStartDate.split('-')[1]);
  //   let startDateYear = Number(sideProjectsStartDate.split('-')[0]);

  //   let endDateMonth = Number(sideProjectsEndDate.split('-')[1]);
  //   let endDateYear = Number(sideProjectsEndDate.split('-')[0]);

  //   let newSideProject = {
  //     'logo_url': downloadURL !== undefined ? downloadURL : '',
  //     'logo_ref': uid !== undefined ? uid : '',
  //     'name': sideProjectsName,
  //     'tagline': sideProjectsTagline,
  //     'url': sideProjectsUrl,
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
  //     'description': sideProjectsDescription
  //   };

  //   if (originalSideProjects !== undefined) {
  //     originalSideProjects.unshift(newSideProject)
  //   } else {
  //     originalSideProjects = [newSideProject]
  //   }
  // }

  const handleAddSideProjectsSubmit = (e) => {
    e.preventDefault();

    if (sideProjectsName === '') {
      setSideProjectsNameError('Project name cannot be empty')
      return null;
    }

    setSubmitting(true)

    if (sideProjectsLogoChanged && sideProjectsLogo !== '') {

      let uid = uuidv4()
      let filename = `images/${user}/sideProjects/${uid}.jpg`

      var metadata = {
        contentType: 'image/jpeg',
        name: filename
      };

      var uploadTask = fire.storage().ref().child(filename).put(sideProjectsLogo, metadata);

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

              let payload = {
                'logo_ref': uid,
                'logo_url': downloadURL,
                'name': sideProjectsName,
                'tagline': sideProjectsTagline,
                'url': sideProjectsUrl,
                'starts_at': sideProjectsStartDate ? 
                  { 
                    'day': 1,
                    'month': Number(sideProjectsStartDate.split('-')[1]),
                    'year': Number(sideProjectsStartDate.split('-')[0])
                  } 
                : 
                  null,
                'ends_at': !sideProjectsEndDatePresent ? 
                  (sideProjectsEndDate ? 
                    { 
                      'day': 31,
                      'month': Number(sideProjectsEndDate.split('-')[1]),
                      'year': Number(sideProjectsEndDate.split('-')[0])
                    } 
                  : 
                    null) 
                :
                  null,
                'description': sideProjectsDescription
              }

              let newUserContext = userContext;
              newUserContext.profile.side_projects = newUserContext.profile.side_projects !== undefined ? [...newUserContext.profile.side_projects, payload] : [payload];
              setUserContext(newUserContext)

              fire.firestore().collection('users').doc(user).update({
                'profile.side_projects': originalSideProjects !== undefined ? 
                  [...originalSideProjects, payload]
                :
                  [payload],
                lastUpdated: fire.firestore.FieldValue.serverTimestamp()
              })

            })
            .then(() => {
              handleBack()
            })
            .then(() => {
              setSubmitting(false)
              toast("Side project added")
            })
            .catch((error) => {
              setSubmitting(false)
              toast("Unable to add side project")
              //console.error("Error adding document: ", error);
            });

          // Add this link to firestore
        }
      );
    } else {

      let payload = {
        'logo_ref': null,
        'logo_url': null,
        'name': sideProjectsName,
        'tagline': sideProjectsTagline,
        'url': sideProjectsUrl,
        'starts_at': sideProjectsStartDate ? 
          { 
            'day': 1,
            'month': Number(sideProjectsStartDate.split('-')[1]),
            'year': Number(sideProjectsStartDate.split('-')[0])
          } 
        : 
          null,
        'ends_at': !sideProjectsEndDatePresent ? 
          (sideProjectsEndDate ? 
            { 
              'day': 31,
              'month': Number(sideProjectsEndDate.split('-')[1]),
              'year': Number(sideProjectsEndDate.split('-')[0])
            } 
          : 
            null) 
        :
          null,
        'description': sideProjectsDescription
      }

      let newUserContext = userContext;
      newUserContext.profile.side_projects = newUserContext.profile.side_projects !== undefined ? [...newUserContext.profile.side_projects, payload] : [payload];
      setUserContext(newUserContext)

      fire.firestore().collection('users').doc(user).update({
        'profile.side_projects': originalSideProjects !== undefined ? 
          [...originalSideProjects, payload]
        :
          [payload],
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        handleBack()
      })
      .then(() => {
        setSubmitting(false)
        toast("Side project added")
      })
      .catch((error) => {
        setSubmitting(false)
        toast("Unable to add side project")
        //console.error("Error adding document: ", error);
      });
    }
  }

  const hiddenFileInput = useRef(null);

  const handleChangeLogo = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    sideProjectsLogoChange(event.target.files[0])
  }

  const handleDeleteLogo = (e) => {
    e.preventDefault();
    sideProjectsLogoChange('')
  }

  const EndDateInput = () => {
    return (
      <>
        <input
          type="month"
          className={sideProjectsEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={sideProjectsEndDate}
          onChange={({ target }) => sideProjectsEndDateChange(target.value)}
        />
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddSideProjectsSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Logo</p>
            {sideProjectsLogoChanged ? (sideProjectsLogo !== '' ?
              <>
                <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{ gap: '16px' }}>
                  <img src={URL.createObjectURL(sideProjectsLogo)} className="radius-3" style={{ width: '96px', height: '96px' }} />
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
            <p className="text-dark-high mb-2">Name</p>
            <input
              type="text"
              className={sideProjectsNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsName}
              onChange={({ target }) => sideProjectsNameChange(target.value)}
            />
            {sideProjectsNameError !== '' ? <p className="small text-error-high mt-2">{sideProjectsNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Tagline</p>
            <input
              type="text"
              className={sideProjectsTaglineError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsTagline}
              onChange={({ target }) => sideProjectsTaglineChange(target.value)}
            />
            {sideProjectsTaglineError !== '' ? <p classTagline="small text-error-high mt-2">{sideProjectsTaglineError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={sideProjectsUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsUrl}
              onChange={({ target }) => sideProjectsUrlChange(target.value)}
            />
            {sideProjectsUrlError !== '' ? <p classUrl="small text-error-high mt-2">{sideProjectsUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input
              type="month"
              className={sideProjectsStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsStartDate}
              onChange={({ target }) => sideProjectsStartDateChange(target.value)}
            />
            {sideProjectsStartDateError !== '' ? <p className="small text-error-high mt-2">{sideProjectsStartDateError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            {!sideProjectsEndDatePresent && <EndDateInput />}
            {/* { !sideProjectsEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.sideProjects[editProfileModalIndex] && 
                userContext.profile.sideProjects[editProfileModalIndex].ends_at && 
                userContext.profile.sideProjects[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''}  */}
            {sideProjectsEndDateError !== '' ? <p className="small text-error-high mt-2">{sideProjectsEndDateError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I'm currently working on this
              <input
                type="checkbox"
                onChange={() => sideProjectsEndDatePresentChange()}
                checked={sideProjectsEndDatePresent}
              />
              {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea
              className={sideProjectsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsDescription}
              onChange={({ target }) => sideProjectsDescriptionChange(target.value)}
              style={{ minHeight: '240px' }}
            />
            {sideProjectsDescriptionError !== '' ? <p className="small text-error-high mt-2">{sideProjectsDescriptionError}</p> : null}
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

export default AddSideProject;