import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const AddPost = ({
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
  postsDateError,
  setPostsDateError,
  setPostsDateChanged,
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
  const [originalPosts, setOriginalPosts] = useState( userContext && userContext.profile && userContext.profile.posts);

  const [displayPostsImage, setDisplayPostsImage] = useState('')

  const postsImageChange = (value) => {
    setPostsImage(value),
    setPostsImageChanged(true),
    setDisplayPostsImage(URL.createObjectURL(value))
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

  const updatePosts = (downloadURL, uid) => {
    let newPost = {}

    newPost.logo_url = downloadURL ? downloadURL : null
    newPost.logo_ref = uid ? uid : null
    newPost.name = postsName
    newPost.url = postsUrl

    if (postsDate) {
      let dateMonth = Number(postsDate.split('-')[1]);
      let dateYear = Number(postsDate.split('-')[0]);
      newPost.posted_at = 
        { 
          'day': 1,
          'month': dateMonth,
          'year': dateYear
        }
    } else {
      newPost.posted_at = null
    }

    newPost.description = postsDescription
    let originalPostsCopy = originalPosts

    if (originalPosts !== undefined) {
      originalPostsCopy.unshift(newPost)
      setOriginalPosts(originalPostsCopy)
    } else {
      originalPostsCopy = [newPost]
      setOriginalPosts(originalPostsCopy)
    }
  }
  
  const handleAddPostsSubmit = (e) => {
    e.preventDefault();

    if (postsName === '') {
      setPostsNameError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)

    if (postsImageChanged && postsImage !== '') {

      let uid = uuidv4()
      let filename = `images/${user}/posts/${uid}.jpg`

      var metadata = {
        contentType: 'image/jpeg',
        name: filename
      };

      var uploadTask = fire.storage().ref().child(filename).put(postsImage, metadata);

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
                'name': postsName,
                'url': postsUrl,
                'posted_at': postsDate ? 
                  { 
                    'day': 1,
                    'month': Number(postsDate.split('-')[1]),
                    'year': Number(postsDate.split('-')[0])
                  } 
                : 
                  null,
                'description': postsDescription
              }

              let newUserContext = userContext;
              newUserContext.profile.posts = newUserContext.profile.posts !== undefined ? [...newUserContext.profile.posts, payload] : [payload];
              setUserContext(newUserContext)

              fire.firestore().collection('users').doc(user).update({
                'profile.posts': originalPosts !== undefined ? 
                  [...originalPosts, payload]
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
              toast("Post added")
            })
            .catch((error) => {
              setSubmitting(false)
              toast("Unable to add post")
              //console.error("Error adding document: ", error);
            });
        }
      );
    } else {

      let payload = {
        'logo_ref': null,
        'logo_url': null,
        'name': postsName,
        'url': postsUrl,
        'posted_at': postsDate ? 
          { 
            'day': 1,
            'month': Number(postsDate.split('-')[1]),
            'year': Number(postsDate.split('-')[0])
          } 
        : 
          null,
        'description': postsDescription
      }

      let newUserContext = userContext;
      newUserContext.profile.posts = newUserContext.profile.posts !== undefined ? [...newUserContext.profile.posts, payload] : [payload];
      setUserContext(newUserContext)

      fire.firestore().collection('users').doc(user).update({
        'profile.posts': originalPosts !== undefined ? 
          [...originalPosts, payload]
        :
          [payload],
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then(() => {
          handleBack()
        })
        .then(() => {
          setSubmitting(false)
          toast("Post added")
        })
        .catch((error) => {
          setSubmitting(false)
          toast("Unable to add post")
          //console.error("Error adding document: ", error);
        });
    }
  }

  const hiddenFileInput = useRef(null);

  const handleChangeImage = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    postsImageChange(event.target.files[0])
  }

  const handleDeleteImage = (e) => {
    e.preventDefault();
    postsImageChange('')
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddPostsSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Image</p>
            {postsImageChanged ? (postsImage !== '' ?
            // {postsImage !== '' ?
              <>
                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  {/* <div className="w-100 position-relative" style={{paddingTop: '66%'}}>
                    <img src={URL.createObjectURL(postsImage)} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
                  </div> */}
                  <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${displayPostsImage})` }}></div>
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
              className={postsNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={postsName}
              onChange={({ target }) => postsNameChange(target.value)}
            />
            {postsNameError !== '' ? <p className="small text-error-high mt-2">{postsNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={postsUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={postsUrl}
              onChange={({ target }) => postsUrlChange(target.value)}
            />
            {postsUrlError !== '' ? <p classUrl="small text-error-high mt-2">{postsUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Date</p>
            <input 
              type="month"
              className={postsDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={postsDate}
              onChange={({ target }) => postsDateChange(target.value)}
            />
            {postsDateError !== '' ? <p className="small text-error-high mt-2">{postsDateError}</p> : null}
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={postsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={postsDescription}
              onChange={({ target }) => postsDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {postsDescriptionError !== '' ? <p className="small text-error-high mt-2">{postsDescriptionError}</p> : null}
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

export default AddPost;