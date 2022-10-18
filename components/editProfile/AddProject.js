import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const AddProject = ({
  user,
  editProfileModalIndex,
  projectsImage,
  setProjectsImage,
  projectsImageChanged,
  setProjectsImageChanged,
  projectsName,
  setProjectsName,
  projectsNameChanged,
  setProjectsNameChanged,
  projectsNameError,
  setProjectsNameError,
  projectsUrl,
  setProjectsUrl,
  projectsUrlChanged,
  setProjectsUrlChanged,
  projectsUrlError,
  setProjectsUrlError,
  projectsStartDate,
  setProjectsStartDate,
  projectsStartDateInputType,
  setProjectsStartDateInputType,
  projectsStartDateChanged,
  setProjectsStartDateChanged,
  projectsStartDateError,
  setProjectsStartDateError,
  projectsEndDate,
  setProjectsEndDate,
  projectsEndDateInputType,
  setProjectsEndDateInputType,
  projectsEndDateChanged,
  setProjectsEndDateChanged,
  projectsEndDateError,
  setProjectsEndDateError,
  projectsEndDatePresent,
  setProjectsEndDatePresent,
  projectsEndDatePresentChanged,
  setProjectsEndDatePresentChanged,
  projectsDescription,
  setProjectsDescription,
  projectsDescriptionChanged,
  setProjectsDescriptionChanged,
  projectsDescriptionError,
  setProjectsDescriptionError,
  projectsShowDeleteProjectModal,
  setProjectsShowDeleteProjectModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [originalProjects, setOriginalProjects] = useState( userContext.profile.projects);

  const projectsImageChange = (value) => {
    setProjectsImage(value),
    setProjectsImageChanged(true)
  }

  const projectsNameChange = (value) => {
    setProjectsName(value),
    setProjectsNameChanged(true),
    setProjectsNameError('')
  }

  const projectsUrlChange = (value) => {
    setProjectsUrl(value),
    setProjectsUrlChanged(true),
    setProjectsUrlError('')
  }

  const projectsStartDateChange = (value) => {
    setProjectsStartDate(value),
    setProjectsStartDateChanged(true),
    setProjectsStartDateError('')
  }

  const projectsStartDateChangeInputType = () => {
    setProjectsStartDateInputType('month')
  }

  const projectsEndDateChange = (value) => {
    setProjectsEndDate(value),
    setProjectsEndDateChanged(true),
    setProjectsEndDateError('')
  }

  const projectsEndDateChangeInputType = () => {
    setProjectsEndDateInputType('month')
  }

  const projectsEndDatePresentChange = () => {
    setProjectsEndDatePresent(projectsEndDatePresent => !projectsEndDatePresent)
    setProjectsEndDatePresentChanged(true)
  }

  const projectsDescriptionChange = (value) => {
    setProjectsDescription(value),
    setProjectsDescriptionChanged(true),
    setProjectsDescriptionError('')
  }

  const updateProjects = (downloadURL, uid) => {
    let newProject = {}

    newProject.logo_url = downloadURL ? downloadURL : null
    newProject.logo_ref = uid ? uid : null
    newProject.name = projectsName
    newProject.url = projectsUrl

    if (projectsStartDate) {
      let startDateMonth = Number(projectsStartDate.split('-')[1]);
      let startDateYear = Number(projectsStartDate.split('-')[0]);
      newProject.starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    } else {
      newProject.starts_at = null
    }
    if (!projectsEndDatePresent) {
      if (projectsEndDate) {
        let endDateMonth = Number(projectsEndDate.split('-')[1]);
        let endDateYear = Number(projectsEndDate.split('-')[0]);
        newProject.ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      } else {
        newProject.ends_at = null
      }
    } else {
      newProject.ends_at = null
    }
    newProject.description = projectsDescription

    if (originalProjects !== undefined) {
      originalProjects.unshift(newProject)
    } else {
      originalProjects = [newProject]
    }
  }

  // const updateProjects = (downloadURL, uid) => {

  //   let startDateMonth = Number(projectsStartDate.split('-')[1]);
  //   let startDateYear = Number(projectsStartDate.split('-')[0]);

  //   let endDateMonth = Number(projectsEndDate.split('-')[1]);
  //   let endDateYear = Number(projectsEndDate.split('-')[0]);

  //   let newProject = {
  //     'logo_url': downloadURL !== undefined ? downloadURL : '',
  //     'logo_ref': uid !== undefined ? uid : '',
  //     'name': projectsName,
  //     'url': projectsUrl,
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
  //     'description': projectsDescription
  //   };

  //   if (originalProjects !== undefined) {
  //     originalProjects.unshift(newProject)
  //   } else {
  //     originalProjects = [newProject]
  //   }
  // }
  
  const handleAddProjectsSubmit = (e) => {
    e.preventDefault();

    if (projectsName === '') {
      setProjectsNameError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)

    if (projectsImageChanged && projectsImage !== '') {

      let uid = uuidv4()
      let filename = `images/${user}/projects/${uid}.jpg`

      var metadata = {
        contentType: 'image/jpeg',
        name: filename
      };

      var uploadTask = fire.storage().ref().child(filename).put(projectsImage, metadata);

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
              updateProjects(downloadURL, uid)
            })
            .then(() => {
              fire.firestore().collection('users').doc(user).update({
                'profile.projects': originalProjects,
                lastUpdated: fire.firestore.FieldValue.serverTimestamp()
              })
                .then((result) => {
                  let newUserContext = userContext;
                  newUserContext.profile.projects = originalProjects;
                  setUserContext(newUserContext)
                  handleBack()
                })
                .then(() => {
                  setSubmitting(false)
                  toast("Project added")
                })
                .catch((error) => {
                  setSubmitting(false)
                  toast("Unable to add project")
                  //console.error("Error adding document: ", error);
                });
            })

          // Add this link to firestore
        }
      );
    } else {
      updateProjects()
      fire.firestore().collection('users').doc(user).update({
        'profile.projects': originalProjects,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then((result) => {
          let newUserContext = userContext;
          newUserContext.profile.projects = originalProjects;
          setUserContext(newUserContext)
          handleBack()
        })
        .then(() => {
          setSubmitting(false)
          toast("Project added")
        })
        .catch((error) => {
          setSubmitting(false)
          toast("Unable to add project")
          //console.error("Error adding document: ", error);
        });
    }
  }

  const hiddenFileInput = useRef(null);

  const handleChangeImage = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    projectsImageChange(event.target.files[0])
  }

  const handleDeleteImage = (e) => {
    e.preventDefault();
    projectsImageChange('')
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={projectsEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={projectsEndDate}
          onChange={({ target }) => projectsEndDateChange(target.value)}
        />
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddProjectsSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Image</p>
            {projectsImageChanged ? (projectsImage !== '' ?
              <>
                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  <div className="w-100 position-relative" style={{paddingTop: '56.25%'}}>
                    <img src={URL.createObjectURL(projectsImage)} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
                  </div>
                  <div className="d-flex flex-row align-items-center" style={{ gap: '16px' }}>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={submitting} onClick={handleChangeImage}>Change</button>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={submitting} onClick={handleDeleteImage}>Remove</button>
                  </div>
                </div>
              </>
              :
              <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={submitting} onClick={handleChangeImage}>Add image</button>
            )
              :
              <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={submitting} onClick={handleChangeImage}>Add image</button>
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
              className={projectsNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={projectsName}
              onChange={({ target }) => projectsNameChange(target.value)}
            />
            {projectsNameError !== '' ? <p className="small text-error-high mt-2">{projectsNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={projectsUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={projectsUrl}
              onChange={({ target }) => projectsUrlChange(target.value)}
            />
            {projectsUrlError !== '' ? <p classUrl="small text-error-high mt-2">{projectsUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={projectsStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={projectsStartDate}
              onChange={({ target }) => projectsStartDateChange(target.value)}
            />
            {projectsStartDateError !== '' ? <p className="small text-error-high mt-2">{projectsStartDateError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { !projectsEndDatePresent && <EndDateInput/> } 
            {/* { !projectsEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.projects[editProfileModalIndex] && 
                userContext.profile.projects[editProfileModalIndex].ends_at && 
                userContext.profile.projects[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''}  */}
            {projectsEndDateError !== '' ? <p className="small text-error-high mt-2">{projectsEndDateError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I'm currently working on this
              <input 
                type="checkbox" 
                onChange={() => projectsEndDatePresentChange()} 
                checked={projectsEndDatePresent}
              />
              {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={projectsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={projectsDescription}
              onChange={({ target }) => projectsDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {projectsDescriptionError !== '' ? <p className="small text-error-high mt-2">{projectsDescriptionError}</p> : null}
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

export default AddProject;