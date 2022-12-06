import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditProject = ({
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
  projectsUrl,
  setProjectsUrl,
  projectsUrlChanged,
  setProjectsUrlChanged,
  projectsUrlError,
  setProjectsUrlError,
  projectsNameError,
  setProjectsNameError,
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
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [originalProjects, setOriginalProjects] = useState(userContext.profile.projects);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

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
    if (!projectsEndDatePresentChanged) {
      if (userContext.profile.projects[editProfileModalIndex].ends_at !== undefined) {
        setProjectsEndDatePresent(true)
      } else {
        setProjectsEndDatePresent(false)
      }
    } else {
      setProjectsEndDatePresent(projectsEndDatePresent => !projectsEndDatePresent)
    }
    setProjectsEndDatePresentChanged(true)
  }

  const projectsDescriptionChange = (value) => {
    setProjectsDescription(value),
    setProjectsDescriptionChanged(true),
    setProjectsDescriptionError('')
  }

  const updateProjects = (index) => {

    if (projectsNameChanged) {
      originalProjects[index].name = projectsName
    }
    if (projectsUrlChanged) {
      originalProjects[index].url = projectsUrl
    }
    if (projectsStartDateChanged) {
      let startDateMonth = Number(projectsStartDate.split('-')[1]);
      let startDateYear = Number(projectsStartDate.split('-')[0]);
      originalProjects[index].starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    }
    if (!projectsEndDatePresent) {
      if (projectsEndDateChanged) {
        let endDateMonth = Number(projectsEndDate.split('-')[1]);
        let endDateYear = Number(projectsEndDate.split('-')[0]);
        originalProjects[index].ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      }
    } else {
      delete originalProjects[index].ends_at
    }
    if (projectsDescriptionChanged) {
      originalProjects[index].description = projectsDescription
    }

  }
  
  const handleEditProjectsSubmit = (e) => {
    e.preventDefault();

    if (projectsNameChanged && projectsName === '') {
      setProjectsCompanyError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateProjects(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.projects': originalProjects,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.projects = originalProjects;
      setUserContext(newUserContext)
    })
    .then(() => {
      setSubmitting(false)
      toast("Project updated")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to update project")
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

    let uid = userContext.profile.projects[editProfileModalIndex].logo_ref ? userContext.profile.projects[editProfileModalIndex].logo_ref : uuidv4()
    let filename = `images/${user}/projects/${userContext.profile.projects[editProfileModalIndex].logo_ref ? userContext.profile.projects[editProfileModalIndex].logo_ref : uid}.jpg`

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
          originalProjects[editProfileModalIndex].logo_url = downloadURL
          originalProjects[editProfileModalIndex].logo_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.projects': originalProjects,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.projects[editProfileModalIndex].logo_url = downloadURL;
            newUserContext.profile.projects[editProfileModalIndex].logo_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            projectsImageChange(downloadURL)
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

    // let filename = originalProjects[editProfileModalIndex].logo_url
    // let filename = userContext.profile.projects[editProfileModalIndex].logo_url
    let filename = `images/${user}/projects/${userContext.profile.projects[editProfileModalIndex].logo_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalProjects[editProfileModalIndex].logo_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.projects': originalProjects,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.projects[editProfileModalIndex].logo_url = null;
        setUserContext(newUserContext)
        projectsImageChange('')
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

  // const deleteProject = (index) => {
  //   delete originalProjects[index]
  // }

  const handleDeleteProjectShow = () => {
    setProjectsShowDeleteProjectModal(true)
  }

  const handleDeleteProjectClose = () => {
    setProjectsShowDeleteProjectModal(false)
  }

  const handleDeleteProjectSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalProjects[editProfileModalIndex]
    originalProjects.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.projects': originalProjects,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setProjectsShowDeleteProjectModal(false)
        setDeleting(false)
        toast("Project deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete project")
        //console.error("Error adding document: ", error);
      });
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={projectsEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={projectsEndDateChanged ? projectsEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.projects[editProfileModalIndex] && 
              userContext.profile.projects[editProfileModalIndex].ends_at && 
              userContext.profile.projects[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.projects[editProfileModalIndex] && 
              userContext.profile.projects[editProfileModalIndex].ends_at && 
              `${userContext.profile.projects[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.projects[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          }
          onChange={({ target }) => projectsEndDateChange(target.value)}
        />
      {/* <input 
          // type="month"
          type={
            userContext && 
            userContext.profile && 
            userContext.profile.projects[editProfileModalIndex] && 
            userContext.profile.projects[editProfileModalIndex].ends_at && 
            userContext.profile.projects[editProfileModalIndex].ends_at !== undefined ? 'month' : projectsEndDateInputType
          }
          // onFocus={this.type = 'month'}
          onFocus={() => projectsEndDateChangeInputType()}
          placeholder="Choose a date"
          className={`small w-100 ${projectsEndDateError !== '' ? 'error' : ''}`}
          value={projectsEndDateInputType == "text" ? '' : (
            projectsEndDateChanged ? projectsEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.projects[editProfileModalIndex] && 
              userContext.profile.projects[editProfileModalIndex].ends_at && 
              userContext.profile.projects[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.projects[editProfileModalIndex] && 
              userContext.profile.projects[editProfileModalIndex].ends_at && 
              `${userContext.profile.projects[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.projects[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          )}
          onChange={({ target }) => projectsEndDateChange(target.value)}
        /> */}
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditProjectsSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Image</p>
            { projectsImageChanged ? (projectsImage !== '' ? 
              <>
                <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                  <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${projectsImageChanged ? projectsImage : (userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].logo_url && userContext.profile.projects[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].logo_url && userContext.profile.projects[editProfileModalIndex].logo_url : '')})` }}>
                  </div>
                </div>
                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  {/* <div className="w-100 position-relative" style={{paddingTop: '56.25%'}}>
                    <img src={projectsImageChanged ? projectsImage : (userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].logo_url && userContext.profile.projects[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].logo_url && userContext.profile.projects[editProfileModalIndex].logo_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
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
                userContext.profile.projects[editProfileModalIndex] && 
                userContext.profile.projects[editProfileModalIndex].logo_url &&
                userContext.profile.projects[editProfileModalIndex].logo_url ?
                <>
                  <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                    <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${projectsImageChanged ? projectsImage : (userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].logo_url && userContext.profile.projects[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].logo_url && userContext.profile.projects[editProfileModalIndex].logo_url : '')})` }}>
                    </div>
                  </div>
                  <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                    {/* <div className="w-100 position-relative" style={{paddingTop: '100%'}}>
                      <img src={projectsImageChanged ? projectsImage : (userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].logo_url && userContext.profile.projects[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].logo_url && userContext.profile.projects[editProfileModalIndex].logo_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
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
              className={projectsNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={projectsNameChanged ? projectsName : (userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].name && userContext.profile.projects[editProfileModalIndex].name !== undefined ? userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].name && userContext.profile.projects[editProfileModalIndex].name : '')}
              onChange={({ target }) => projectsNameChange(target.value)}
            />
            {projectsNameError !== '' ? <p className="small text-error-high mt-2">{projectsNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={projectsUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={projectsUrlChanged ? projectsUrl : (userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].url && userContext.profile.projects[editProfileModalIndex].url !== undefined ? userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].url && userContext.profile.projects[editProfileModalIndex].url : '')}
              onChange={({ target }) => projectsUrlChange(target.value)}
            />
            {projectsUrlError !== '' ? <p classUrl="small text-error-high mt-2">{projectsUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={projectsStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={projectsStartDateChanged ? projectsStartDate : 
                (
                  userContext && 
                  userContext.profile && 
                  userContext.profile.projects[editProfileModalIndex] && 
                  userContext.profile.projects[editProfileModalIndex].starts_at && 
                  userContext.profile.projects[editProfileModalIndex].starts_at !== undefined ? 
                  userContext && 
                  userContext.profile && 
                  userContext.profile.projects[editProfileModalIndex] && 
                  userContext.profile.projects[editProfileModalIndex].starts_at && 
                  `${userContext.profile.projects[editProfileModalIndex].starts_at.year}-${('0' + userContext.profile.projects[editProfileModalIndex].starts_at.month).slice(-2)}`
                : 
                  ''
                )
              }
              onChange={({ target }) => projectsStartDateChange(target.value)}
            />
            {projectsStartDateError !== '' ? <p className="small text-error-high mt-2">{projectsStartDateError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { projectsEndDatePresentChanged ? (!projectsEndDatePresent ? <EndDateInput/>  : '' ) : '' } 
            { !projectsEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.projects[editProfileModalIndex] && 
                userContext.profile.projects[editProfileModalIndex].ends_at && 
                userContext.profile.projects[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''} 
            {projectsEndDateError !== '' ? <p className="small text-error-high mt-2">{projectsEndDateError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I'm currently working on this
              <input 
                type="checkbox" 
                onChange={() => projectsEndDatePresentChange()} 
                checked={projectsEndDatePresentChanged ? projectsEndDatePresent : 
                  (
                    userContext && 
                    userContext.profile && 
                    userContext.profile.projects[editProfileModalIndex] && 
                    userContext.profile.projects[editProfileModalIndex].ends_at == undefined ? true
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
              className={projectsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={projectsDescriptionChanged ? projectsDescription : (
                userContext &&
                userContext.profile &&
                userContext.profile.projects &&
                userContext.profile.projects[editProfileModalIndex] &&
                userContext.profile.projects[editProfileModalIndex].description !== undefined ? userContext.profile.projects[editProfileModalIndex].description : '')
              }
              onChange={({ target }) => projectsDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {projectsDescriptionError !== '' ? <p className="small text-error-high mt-2">{projectsDescriptionError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <input
              type="text"
              className={projectsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={projectsDescriptionChanged ? projectsDescription : (userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].description && userContext.profile.projects[editProfileModalIndex].description !== undefined ? userContext && userContext.profile && userContext.profile.projects[editProfileModalIndex] && userContext.profile.projects[editProfileModalIndex].description && userContext.profile.projects[editProfileModalIndex].description : '')}
              onChange={({ target }) => projectsDescriptionChange(target.value)}
            />
            {projectsDescriptionError !== '' ? <p className="small text-error-high mt-2">{projectsDescriptionError}</p> : null}
          </div> */}
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteProjectShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeleteProjectShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
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
        show={projectsShowDeleteProjectModal} 
        onHide={handleDeleteProjectClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete project?</h5>
          </div>
          <button onClick={handleDeleteProjectClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete project</h5>
            </div>
            <button onClick={handleDeleteProjectClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.projects &&
              userContext.profile.projects[editProfileModalIndex] &&
            <div className="d-flex flex-row justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              { userContext.profile.projects[editProfileModalIndex].logo_url ?
              <div>
                <img className={styles.projectImage} src={userContext.profile.projects[editProfileModalIndex].logo_url ? userContext.profile.projects[editProfileModalIndex].logo_url : null} style={{width: '64px'}}/>
              </div>
              : ''}
              <div className="w-100">
                <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.projects[editProfileModalIndex].title}</p>
                {/* <a target="_blank" href={userContext.profile.projects[editProfileModalIndex].company_linkedin_profile_url} className="text-decoration-none"> */}
                <p className="large text-dark-med mb-0">{userContext.profile.projects[editProfileModalIndex].company}</p>
                {/* </a> */}
                <p className="text-dark-low mb-0">{userContext.profile.projects[editProfileModalIndex].location}</p>
                <p className="text-dark-low mb-0">
                  {userContext.profile.projects[editProfileModalIndex].starts_at ? (userContext.profile.projects[editProfileModalIndex].starts_at.month ? convertMonth(userContext.profile.projects[editProfileModalIndex].starts_at.month) + " " : '') : null}
                  {userContext.profile.projects[editProfileModalIndex].starts_at ? (userContext.profile.projects[editProfileModalIndex].starts_at.year ? userContext.profile.projects[editProfileModalIndex].starts_at.year + " " : null) : null}
                  {userContext.profile.projects[editProfileModalIndex].starts_at && userContext.profile.projects[editProfileModalIndex].ends_at == null ? ' – Present' : null}
                  {userContext.profile.projects[editProfileModalIndex].starts_at && userContext.profile.projects[editProfileModalIndex].ends_at ? " – " + (userContext.profile.projects[editProfileModalIndex].ends_at.month ? convertMonth(userContext.profile.projects[editProfileModalIndex].ends_at.month) : '') : null}
                  {userContext.profile.projects[editProfileModalIndex].starts_at && userContext.profile.projects[editProfileModalIndex].ends_at ? (userContext.profile.projects[editProfileModalIndex].ends_at.year ? " " + userContext.profile.projects[editProfileModalIndex].ends_at.year : null) : null}
                </p>
                {/* {userContext.profile.projects[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.projects[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteProjectClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteProjectSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditProject;