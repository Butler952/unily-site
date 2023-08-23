import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditPost = ({
  user,
  editProfileModalIndex,
  postsImage,
  setPostsImage,
  postsImageChanged,
  setPostsImageChanged,
  postsName,
  setPostsName,
  postsNameChanged,
  setPostsNameChanged,
  postsNameError,
  setPostsNameError,
  postsUrl,
  setPostsUrl,
  postsUrlChanged,
  setPostsUrlChanged,
  postsUrlError,
  setPostsUrlError,
  postsDate,
  setPostsDate,
  postsDateChanged,
  setPostsDateChanged,
  postsDateError,
  setPostsDateError,
  postsDescription,
  setPostsDescription,
  postsDescriptionChanged,
  setPostsDescriptionChanged,
  postsDescriptionError,
  setPostsDescriptionError,
  postsShowDeletePostModal,
  setPostsShowDeletePostModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [originalPosts, setOriginalPosts] = useState(userContext.profile.posts);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const postsImageChange = (value) => {
    setPostsImage(value),
    setPostsImageChanged(true)
  }

  const postsNameChange = (value) => {
    setPostsName(value),
    setPostsNameChanged(true),
    setPostsNameError('')
  }

  const postsUrlChange = (value) => {
    setPostsUrl(value),
    setPostsUrlChanged(true),
    setPostsUrlError('')
  }

  const postsDateChange = (value) => {
    setPostsDate(value),
    setPostsDateChanged(true),
    setPostsDateError('')
  }

  const postsDescriptionChange = (value) => {
    setPostsDescription(value),
    setPostsDescriptionChanged(true),
    setPostsDescriptionError('')
  }

  const updatePosts = (index) => {

    if (postsNameChanged) {
      originalPosts[index].name = postsName
    }
    if (postsUrlChanged) {
      originalPosts[index].url = postsUrl
    }
    if (postsDateChanged) {
      let dateMonth = Number(postsDate.split('-')[1]);
      let dateYear = Number(postsDate.split('-')[0]);
      originalPosts[index].posted_at = 
        { 
          'day': 1,
          'month': dateMonth,
          'year': dateYear
        }
    }
    if (postsDescriptionChanged) {
      originalPosts[index].description = postsDescription
    }

  }
  
  const handleEditPostsSubmit = (e) => {
    e.preventDefault();

    if (postsNameChanged && postsName === '') {
      setPostsCompanyError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)
    updatePosts(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.posts': originalPosts,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.posts = originalPosts;
      setUserContext(newUserContext)
    })
    .then(() => {
      setSubmitting(false)
      toast("Post updated")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to update post")
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

    let uid = userContext.profile.posts[editProfileModalIndex].logo_ref ? userContext.profile.posts[editProfileModalIndex].logo_ref : uuidv4()
    let filename = `images/${user}/posts/${userContext.profile.posts[editProfileModalIndex].logo_ref ? userContext.profile.posts[editProfileModalIndex].logo_ref : uid}.jpg`

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
          originalPosts[editProfileModalIndex].logo_url = downloadURL
          originalPosts[editProfileModalIndex].logo_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.posts': originalPosts,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.posts[editProfileModalIndex].logo_url = downloadURL;
            newUserContext.profile.posts[editProfileModalIndex].logo_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            postsImageChange(downloadURL)
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

    // let filename = originalPosts[editProfileModalIndex].logo_url
    // let filename = userContext.profile.posts[editProfileModalIndex].logo_url
    let filename = `images/${user}/posts/${userContext.profile.posts[editProfileModalIndex].logo_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalPosts[editProfileModalIndex].logo_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.posts': originalPosts,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.posts[editProfileModalIndex].logo_url = null;
        setUserContext(newUserContext)
        postsImageChange('')
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

  // const deletePost = (index) => {
  //   delete originalPosts[index]
  // }

  const handleDeletePostShow = () => {
    setPostsShowDeletePostModal(true)
  }

  const handleDeletePostClose = () => {
    setPostsShowDeletePostModal(false)
  }

  const handleDeletePostSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalPosts[editProfileModalIndex]
    originalPosts.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.posts': originalPosts,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setPostsShowDeletePostModal(false)
        setDeleting(false)
        toast("Post deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete post")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditPostsSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Image</p>
            { postsImageChanged ? (postsImage !== '' ? 
              <>
                {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                  <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${postsImageChanged ? postsImage : (userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].logo_url && userContext.profile.posts[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].logo_url && userContext.profile.posts[editProfileModalIndex].logo_url : '')})` }}>
                  </div>
                </div> */}
                <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.posts[editProfileModalIndex].logo_url})` }}></div>

                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  {/* <div className="w-100 position-relative" style={{paddingTop: '56.25%'}}>
                    <img src={postsImageChanged ? postsImage : (userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].logo_url && userContext.profile.posts[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].logo_url && userContext.profile.posts[editProfileModalIndex].logo_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
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
                userContext.profile.posts[editProfileModalIndex] && 
                userContext.profile.posts[editProfileModalIndex].logo_url &&
                userContext.profile.posts[editProfileModalIndex].logo_url ?
                <>
                  {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                    <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${postsImageChanged ? postsImage : (userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].logo_url && userContext.profile.posts[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].logo_url && userContext.profile.posts[editProfileModalIndex].logo_url : '')})` }}>
                    </div>
                  </div> */}
                  <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.posts[editProfileModalIndex].logo_url})` }}></div>
                  <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                    {/* <div className="w-100 position-relative" style={{paddingTop: '100%'}}>
                      <img src={postsImageChanged ? postsImage : (userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].logo_url && userContext.profile.posts[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].logo_url && userContext.profile.posts[editProfileModalIndex].logo_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
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
            <p className="text-dark-high mb-2">Title</p>
            <input
              type="text"
              className={postsNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={postsNameChanged ? postsName : (userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].name && userContext.profile.posts[editProfileModalIndex].name !== undefined ? userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].name && userContext.profile.posts[editProfileModalIndex].name : '')}
              onChange={({ target }) => postsNameChange(target.value)}
            />
            {postsNameError !== '' ? <p className="small text-error-high mt-2">{postsNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={postsUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={postsUrlChanged ? postsUrl : (userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].url && userContext.profile.posts[editProfileModalIndex].url !== undefined ? userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].url && userContext.profile.posts[editProfileModalIndex].url : '')}
              onChange={({ target }) => postsUrlChange(target.value)}
            />
            {postsUrlError !== '' ? <p classUrl="small text-error-high mt-2">{postsUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={postsDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={postsDateChanged ? postsDate : 
                (
                  userContext && 
                  userContext.profile && 
                  userContext.profile.posts[editProfileModalIndex] && 
                  userContext.profile.posts[editProfileModalIndex].posted_at && 
                  userContext.profile.posts[editProfileModalIndex].posted_at !== undefined ? 
                  userContext && 
                  userContext.profile && 
                  userContext.profile.posts[editProfileModalIndex] && 
                  userContext.profile.posts[editProfileModalIndex].posted_at && 
                  `${userContext.profile.posts[editProfileModalIndex].posted_at.year}-${('0' + userContext.profile.posts[editProfileModalIndex].posted_at.month).slice(-2)}`
                : 
                  ''
                )
              }
              onChange={({ target }) => postsDateChange(target.value)}
            />
            {postsDateError !== '' ? <p className="small text-error-high mt-2">{postsDateError}</p> : null}
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={postsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={postsDescriptionChanged ? postsDescription : (
                userContext &&
                userContext.profile &&
                userContext.profile.posts &&
                userContext.profile.posts[editProfileModalIndex] &&
                userContext.profile.posts[editProfileModalIndex].description !== undefined ? userContext.profile.posts[editProfileModalIndex].description : '')
              }
              onChange={({ target }) => postsDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {postsDescriptionError !== '' ? <p className="small text-error-high mt-2">{postsDescriptionError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <input
              type="text"
              className={postsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={postsDescriptionChanged ? postsDescription : (userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].description && userContext.profile.posts[editProfileModalIndex].description !== undefined ? userContext && userContext.profile && userContext.profile.posts[editProfileModalIndex] && userContext.profile.posts[editProfileModalIndex].description && userContext.profile.posts[editProfileModalIndex].description : '')}
              onChange={({ target }) => postsDescriptionChange(target.value)}
            />
            {postsDescriptionError !== '' ? <p className="small text-error-high mt-2">{postsDescriptionError}</p> : null}
          </div> */}
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeletePostShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeletePostShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
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
        show={postsShowDeletePostModal} 
        onHide={handleDeletePostClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete post?</h5>
          </div>
          <button onClick={handleDeletePostClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete post</h5>
            </div>
            <button onClick={handleDeletePostClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this post?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.posts &&
              userContext.profile.posts[editProfileModalIndex] &&
            <div className="d-flex flex-column justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              {/* { userContext.profile.posts[editProfileModalIndex].logo_url ?
              <div>
                <img className={styles.postImage} src={userContext.profile.posts[editProfileModalIndex].logo_url ? userContext.profile.posts[editProfileModalIndex].logo_url : null} style={{width: '64px'}}/>
              </div>
              : ''} */}
              { userContext.profile.posts[editProfileModalIndex].logo_url &&
                <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.posts[editProfileModalIndex].logo_url})` }}></div>
              }
              <div className="w-100">
                {/* <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.posts[editProfileModalIndex].title}</p> */}
                {/* <a target="_blank" href={userContext.profile.posts[editProfileModalIndex].company_linkedin_profile_url} className="text-decoration-none"> */}
                <h4 className="large text-dark-high mb-0">{userContext.profile.posts[editProfileModalIndex].name}</h4>
                {/* </a> */}
                {/* <p className="text-dark-low mb-0">
                  {userContext.profile.posts[editProfileModalIndex].posted_at ? (userContext.profile.posts[editProfileModalIndex].posted_at.month ? convertMonth(userContext.profile.posts[editProfileModalIndex].posted_at.month) + " " : '') : null}
                  {userContext.profile.posts[editProfileModalIndex].posted_at ? (userContext.profile.posts[editProfileModalIndex].posted_at.year ? userContext.profile.posts[editProfileModalIndex].posted_at.year + " " : null) : null}
                 </p> */}
                {/* {userContext.profile.posts[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.posts[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeletePostClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeletePostSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditPost;