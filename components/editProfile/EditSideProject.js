import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditSideProject = ({
  user,
  editProfileModalIndex,
  sideProjectsLogo,
  setSideProjectsLogo,
  sideProjectsLogoChanged,
  setSideProjectsLogoChanged,
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
  sideProjectsShowDeleteSideProjectModal,
  setSideProjectsShowDeleteSideProjectModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [originalSideProjects, setOriginalSideProjects] = useState(userContext.profile.side_projects);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const sideProjectsLogoChange = (value) => {
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
    if (!sideProjectsEndDatePresentChanged) {
      if (userContext.profile.side_projects[editProfileModalIndex].ends_at !== undefined) {
        setSideProjectsEndDatePresent(true)
      } else {
        setSideProjectsEndDatePresent(false)
      }
    } else {
      setSideProjectsEndDatePresent(sideProjectsEndDatePresent => !sideProjectsEndDatePresent)
    }
    setSideProjectsEndDatePresentChanged(true)
  }

  const sideProjectsDescriptionChange = (value) => {
    setSideProjectsDescription(value),
    setSideProjectsDescriptionChanged(true),
    setSideProjectsDescriptionError('')
  }

  const updateSideProjects = (index) => {
    if (sideProjectsLogoChanged) {
      originalSideProjects[index].logo = sideProjectsLogo
    }
    if (sideProjectsNameChanged) {
      originalSideProjects[index].name = sideProjectsName
    }
    if (sideProjectsTaglineChanged) {
      originalSideProjects[index].tagline = sideProjectsTagline
    }
    if (sideProjectsUrlChanged) {
      originalSideProjects[index].url = sideProjectsUrl
    }
    if (sideProjectsStartDateChanged) {
      let startDateMonth = Number(sideProjectsStartDate.split('-')[1]);
      let startDateYear = Number(sideProjectsStartDate.split('-')[0]);
      originalSideProjects[index].starts_at = 
        { 
          'day': 1,
          'month': startDateMonth,
          'year': startDateYear
        }
    }
    if (!sideProjectsEndDatePresent) {
      if (sideProjectsEndDateChanged) {
        let endDateMonth = Number(sideProjectsEndDate.split('-')[1]);
        let endDateYear = Number(sideProjectsEndDate.split('-')[0]);
        originalSideProjects[index].ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
      }
    } else {
      delete originalSideProjects[index].ends_at
    }
    if (sideProjectsDescriptionChanged) {
      originalSideProjects[index].description = sideProjectsDescription
    }
  }
  
  const handleEditSideProjectsSubmit = (e) => {
    e.preventDefault();

    if (sideProjectsNameChanged && sideProjectsName === '') {
      setSideProjectsNameError('Side project name cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateSideProjects(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.side_projects': originalSideProjects,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.side_projects = originalSideProjects;
      setUserContext(newUserContext)
    })
    .then(() => {
      setSubmitting(false)
      toast("Side project updated")
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

    let uid = userContext.profile.side_projects[editProfileModalIndex].logo_ref ? userContext.profile.side_projects[editProfileModalIndex].logo_ref : uuidv4()
    let filename = `images/${user}/sideProjects/${userContext.profile.side_projects[editProfileModalIndex].logo_ref ? userContext.profile.side_projects[editProfileModalIndex].logo_ref : uid}.jpg`

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
          originalSideProjects[editProfileModalIndex].logo_url = downloadURL
          originalSideProjects[editProfileModalIndex].logo_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.side_projects': originalSideProjects,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.side_projects[editProfileModalIndex].logo_url = downloadURL;
            newUserContext.profile.side_projects[editProfileModalIndex].logo_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            sideProjectsLogoChange(downloadURL)
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

    // let filename = originalSideProjects[editProfileModalIndex].logo_url
    // let filename = userContext.profile.sideProjects[editProfileModalIndex].logo_url
    let filename = `images/${user}/sideProjects/${userContext.profile.side_projects[editProfileModalIndex].logo_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalSideProjects[editProfileModalIndex].logo_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.side_projects': originalSideProjects,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.side_projects[editProfileModalIndex].logo_url = null;
        setUserContext(newUserContext)
        sideProjectsLogoChange('')
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

  // const deleteSideProject = (index) => {
  //   delete originalSideProjects[index]
  // }

  const handleDeleteSideProjectShow = () => {
    setSideProjectsShowDeleteSideProjectModal(true)
  }

  const handleDeleteSideProjectClose = () => {
    setSideProjectsShowDeleteSideProjectModal(false)
  }

  const handleDeleteSideProjectSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalSideProjects[editProfileModalIndex]
    originalSideProjects.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.side_projects': originalSideProjects,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setSideProjectsShowDeleteSideProjectModal(false)
        setDeleting(false)
        toast("Side Project deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete side project")
        //console.error("Error adding document: ", error);
      });
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={sideProjectsEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={sideProjectsEndDateChanged ? sideProjectsEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.side_projects[editProfileModalIndex] && 
              userContext.profile.side_projects[editProfileModalIndex].ends_at && 
              userContext.profile.side_projects[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.side_projects[editProfileModalIndex] && 
              userContext.profile.side_projects[editProfileModalIndex].ends_at && 
              `${userContext.profile.side_projects[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.side_projects[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          }
          onChange={({ target }) => sideProjectsEndDateChange(target.value)}
        />
      {/* <input 
          // type="month"
          type={
            userContext && 
            userContext.profile && 
            userContext.profile.side_projects[editProfileModalIndex] && 
            userContext.profile.side_projects[editProfileModalIndex].ends_at && 
            userContext.profile.side_projects[editProfileModalIndex].ends_at !== undefined ? 'month' : sideProjectsEndDateInputType
          }
          // onFocus={this.type = 'month'}
          onFocus={() => sideProjectsEndDateChangeInputType()}
          placeholder="Choose a date"
          className={`small w-100 ${sideProjectsEndDateError !== '' ? 'error' : ''}`}
          value={sideProjectsEndDateInputType == "text" ? '' : (
            sideProjectsEndDateChanged ? sideProjectsEndDate : 
            (
              userContext && 
              userContext.profile && 
              userContext.profile.side_projects[editProfileModalIndex] && 
              userContext.profile.side_projects[editProfileModalIndex].ends_at && 
              userContext.profile.side_projects[editProfileModalIndex].ends_at !== undefined ? 
              userContext && 
              userContext.profile && 
              userContext.profile.side_projects[editProfileModalIndex] && 
              userContext.profile.side_projects[editProfileModalIndex].ends_at && 
              `${userContext.profile.side_projects[editProfileModalIndex].ends_at.year}-${('0' + userContext.profile.side_projects[editProfileModalIndex].ends_at.month).slice(-2)}`
            : 
              ''
            )
          )}
          onChange={({ target }) => sideProjectsEndDateChange(target.value)}
        /> */}
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditSideProjectsSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Logo</p>
            { sideProjectsLogoChanged ? (sideProjectsLogo !== '' ? 
              <>
                <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                  <img src={sideProjectsLogoChanged ? sideProjectsLogo : (userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].logo_url && userContext.profile.side_projects[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].logo_url && userContext.profile.side_projects[editProfileModalIndex].logo_url : '')} className="radius-3" style={{width: '96px', height: '96px'}}/>
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
                userContext.profile.side_projects[editProfileModalIndex] && 
                userContext.profile.side_projects[editProfileModalIndex].logo_url &&
                userContext.profile.side_projects[editProfileModalIndex].logo_url ?
                <>
                  <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                  <img src={sideProjectsLogoChanged ? sideProjectsLogo : (userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].logo_url && userContext.profile.side_projects[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].logo_url && userContext.profile.side_projects[editProfileModalIndex].logo_url : '')} className="radius-3" style={{width: '96px', height: '96px'}}/>
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
            <p className="text-dark-high mb-2">Name</p>
            <input
              type="text"
              className={sideProjectsNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsNameChanged ? sideProjectsName : (userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].name && userContext.profile.side_projects[editProfileModalIndex].name !== undefined ? userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].name && userContext.profile.side_projects[editProfileModalIndex].name : '')}
              onChange={({ target }) => sideProjectsNameChange(target.value)}
            />
            {sideProjectsNameError !== '' ? <p className="small text-error-high mt-2">{sideProjectsNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Tagline</p>
            <input
              type="text"
              className={sideProjectsTaglineError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsTaglineChanged ? sideProjectsTagline : (userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].tagline && userContext.profile.side_projects[editProfileModalIndex].tagline !== undefined ? userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].tagline && userContext.profile.side_projects[editProfileModalIndex].tagline : '')}
              onChange={({ target }) => sideProjectsTaglineChange(target.value)}
            />
            {sideProjectsTaglineError !== '' ? <p classTagline="small text-error-high mt-2">{sideProjectsTaglineError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={sideProjectsUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsUrlChanged ? sideProjectsUrl : (userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].company_linkedin_profile_url && userContext.profile.side_projects[editProfileModalIndex].company_linkedin_profile_url !== undefined ? userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].company_linkedin_profile_url && userContext.profile.side_projects[editProfileModalIndex].company_linkedin_profile_url : '')}
              onChange={({ target }) => sideProjectsUrlChange(target.value)}
            />
            {sideProjectsUrlError !== '' ? <p className="small text-error-high mt-2">{sideProjectsUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={sideProjectsStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsStartDateChanged ? sideProjectsStartDate : 
                (
                  userContext && 
                  userContext.profile && 
                  userContext.profile.side_projects[editProfileModalIndex] && 
                  userContext.profile.side_projects[editProfileModalIndex].starts_at && 
                  userContext.profile.side_projects[editProfileModalIndex].starts_at !== undefined ? 
                  userContext && 
                  userContext.profile && 
                  userContext.profile.side_projects[editProfileModalIndex] && 
                  userContext.profile.side_projects[editProfileModalIndex].starts_at && 
                  `${userContext.profile.side_projects[editProfileModalIndex].starts_at.year}-${('0' + userContext.profile.side_projects[editProfileModalIndex].starts_at.month).slice(-2)}`
                : 
                  ''
                )
              }
              onChange={({ target }) => sideProjectsStartDateChange(target.value)}
            />
            {sideProjectsStartDateError !== '' ? <p className="small text-error-high mt-2">{sideProjectsStartDateError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { sideProjectsEndDatePresentChanged ? (!sideProjectsEndDatePresent ? <EndDateInput/>  : '' ) : '' } 
            { !sideProjectsEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.side_projects[editProfileModalIndex] && 
                userContext.profile.side_projects[editProfileModalIndex].ends_at && 
                userContext.profile.side_projects[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''} 
            {sideProjectsEndDateError !== '' ? <p className="small text-error-high mt-2">{sideProjectsEndDateError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I'm currently working on this
              <input 
                type="checkbox" 
                onChange={() => sideProjectsEndDatePresentChange()} 
                checked={sideProjectsEndDatePresentChanged ? sideProjectsEndDatePresent : 
                  (
                    userContext && 
                    userContext.profile && 
                    userContext.profile.side_projects[editProfileModalIndex] && 
                    userContext.profile.side_projects[editProfileModalIndex].ends_at == undefined ? true
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
              className={sideProjectsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsDescriptionChanged ? sideProjectsDescription : (
                userContext &&
                userContext.profile &&
                userContext.profile.side_projects &&
                userContext.profile.side_projects[editProfileModalIndex] &&
                userContext.profile.side_projects[editProfileModalIndex].description !== undefined ? userContext.profile.side_projects[editProfileModalIndex].description : '')
              }
              onChange={({ target }) => sideProjectsDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {sideProjectsDescriptionError !== '' ? <p className="small text-error-high mt-2">{sideProjectsDescriptionError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <input
              type="text"
              className={sideProjectsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={sideProjectsDescriptionChanged ? sideProjectsDescription : (userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].description && userContext.profile.side_projects[editProfileModalIndex].description !== undefined ? userContext && userContext.profile && userContext.profile.side_projects[editProfileModalIndex] && userContext.profile.side_projects[editProfileModalIndex].description && userContext.profile.side_projects[editProfileModalIndex].description : '')}
              onChange={({ target }) => sideProjectsDescriptionChange(target.value)}
            />
            {sideProjectsDescriptionError !== '' ? <p className="small text-error-high mt-2">{sideProjectsDescriptionError}</p> : null}
          </div> */}
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteSideProjectShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeleteSideProjectShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
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
        show={sideProjectsShowDeleteSideProjectModal} 
        onHide={handleDeleteSideProjectClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete experience?</h5>
          </div>
          <button onClick={handleDeleteSideProjectClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete side project</h5>
            </div>
            <button onClick={handleDeleteSideProjectClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.side_projects &&
              userContext.profile.side_projects[editProfileModalIndex] &&
            <div className="d-flex flex-row justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              { userContext.profile.side_projects[editProfileModalIndex].logo_url ?
              <div>
                <img className={styles.experienceImage} src={userContext.profile.side_projects[editProfileModalIndex].logo_url ? userContext.profile.side_projects[editProfileModalIndex].logo_url : null} style={{width: '64px'}}/>
              </div>
              : ''}
              <div className="w-100">
                <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.side_projects[editProfileModalIndex].title}</p>
                {/* <a target="_blank" href={userContext.profile.side_projects[editProfileModalIndex].company_linkedin_profile_url} className="text-decoration-none"> */}
                <p className="large text-dark-med mb-0">{userContext.profile.side_projects[editProfileModalIndex].company}</p>
                {/* </a> */}
                <p className="text-dark-low mb-0">{userContext.profile.side_projects[editProfileModalIndex].location}</p>
                <p className="text-dark-low mb-0">
                  {userContext.profile.side_projects[editProfileModalIndex].starts_at ? (userContext.profile.side_projects[editProfileModalIndex].starts_at.month ? convertMonth(userContext.profile.side_projects[editProfileModalIndex].starts_at.month) + " " : '') : null}
                  {userContext.profile.side_projects[editProfileModalIndex].starts_at ? (userContext.profile.side_projects[editProfileModalIndex].starts_at.year ? userContext.profile.side_projects[editProfileModalIndex].starts_at.year + " " : null) : null}
                  {userContext.profile.side_projects[editProfileModalIndex].starts_at && userContext.profile.side_projects[editProfileModalIndex].ends_at == null ? ' – Present' : null}
                  {userContext.profile.side_projects[editProfileModalIndex].starts_at && userContext.profile.side_projects[editProfileModalIndex].ends_at ? " – " + (userContext.profile.side_projects[editProfileModalIndex].ends_at.month ? convertMonth(userContext.profile.side_projects[editProfileModalIndex].ends_at.month) : '') : null}
                  {userContext.profile.side_projects[editProfileModalIndex].starts_at && userContext.profile.side_projects[editProfileModalIndex].ends_at ? (userContext.profile.side_projects[editProfileModalIndex].ends_at.year ? " " + userContext.profile.side_projects[editProfileModalIndex].ends_at.year : null) : null}
                </p>
                {/* {userContext.profile.side_projects[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.side_projects[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteSideProjectClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteSideProjectSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditSideProject;