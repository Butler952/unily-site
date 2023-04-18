import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const AddFeature = ({
  user,
  editProfileModalIndex,
  featuredImage,
  setFeaturedImage,
  featuredImageChanged,
  setFeaturedImageChanged,
  featuredName,
  setFeaturedName,
  featuredNameChanged,
  setFeaturedNameChanged,
  featuredNameError,
  setFeaturedNameError,
  featuredUrl,
  setFeaturedUrl,
  featuredUrlChanged,
  setFeaturedUrlChanged,
  featuredUrlError,
  setFeaturedUrlError,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [originalFeatured, setOriginalFeatured] = useState( userContext && userContext.profile && userContext.profile.featured);

  const [displayFeaturedImage, setDisplayFeaturedImage] = useState('')

  const featuredImageChange = (value) => {
    setFeaturedImage(value),
    setFeaturedImageChanged(true),
    setDisplayFeaturedImage(URL.createObjectURL(value))
  }

  const featuredNameChange = (value) => {
    setFeaturedName(value),
    setFeaturedNameChanged(true),
    setFeaturedNameError('')
  }

  const featuredUrlChange = (value) => {
    setFeaturedUrl(value),
    setFeaturedUrlChanged(true),
    setFeaturedUrlError('')
  }

  const updateFeatured = (downloadURL, uid) => {
    let newFeature = {}

    newFeature.logo_url = downloadURL ? downloadURL : null
    newFeature.logo_ref = uid ? uid : null
    newFeature.name = featuredName
    newFeature.url = featuredUrl

    if (originalFeatured !== undefined) {
      originalFeatured.unshift(newFeature)
    } else {
      originalFeatured = [newFeature]
    }
  }
  
  const handleAddFeaturedSubmit = (e) => {
    e.preventDefault();

    if (featuredName === '') {
      setFeaturedNameError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)

    if (featuredImageChanged && featuredImage !== '') {

      let uid = uuidv4()
      let filename = `images/${user}/featured/${uid}.jpg`

      var metadata = {
        contentType: 'image/jpeg',
        name: filename
      };

      var uploadTask = fire.storage().ref().child(filename).put(featuredImage, metadata);

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
              updateFeatured(downloadURL, uid)
            })
            .then(() => {
              fire.firestore().collection('users').doc(user).update({
                'profile.featured': originalFeatured,
                lastUpdated: fire.firestore.FieldValue.serverTimestamp()
              })
                .then((result) => {
                  let newUserContext = userContext;
                  newUserContext.profile.featured = originalFeatured;
                  setUserContext(newUserContext)
                  handleBack()
                })
                .then(() => {
                  setSubmitting(false)
                  toast("Feature added")
                })
                .catch((error) => {
                  setSubmitting(false)
                  toast("Unable to add feature")
                  //console.error("Error adding document: ", error);
                });
            })

          // Add this link to firestore
        }
      );
    } else {
      updateFeatured()
      fire.firestore().collection('users').doc(user).update({
        'profile.featured': originalFeatured,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then((result) => {
          let newUserContext = userContext;
          newUserContext.profile.featured = originalFeatured;
          setUserContext(newUserContext)
          handleBack()
        })
        .then(() => {
          setSubmitting(false)
          toast("Feature added")
        })
        .catch((error) => {
          setSubmitting(false)
          toast("Unable to add feature")
          //console.error("Error adding document: ", error);
        });
    }
  }

  const hiddenFileInput = useRef(null);

  const handleChangeImage = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    featuredImageChange(event.target.files[0])
  }

  const handleDeleteImage = (e) => {
    e.preventDefault();
    featuredImageChange('')
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddFeaturedSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Image</p>
            {featuredImageChanged ? (featuredImage !== '' ?
            // {featuredImage !== '' ?
              <>
                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  {/* <div className="w-100 position-relative" style={{paddingTop: '66%'}}>
                    <img src={URL.createObjectURL(featuredImage)} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
                  </div> */}
                  <img src={displayFeaturedImage} style={{maxWidth: '240px'}} />
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
              className={featuredNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={featuredName}
              onChange={({ target }) => featuredNameChange(target.value)}
            />
            {featuredNameError !== '' ? <p className="small text-error-high mt-2">{featuredNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={featuredUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={featuredUrl}
              onChange={({ target }) => featuredUrlChange(target.value)}
            />
            {featuredUrlError !== '' ? <p classUrl="small text-error-high mt-2">{featuredUrlError}</p> : null}
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

export default AddFeature;