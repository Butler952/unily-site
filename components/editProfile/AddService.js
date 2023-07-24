import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const AddService = ({
  user,
  editProfileModalIndex,
  servicesImage,
  setServicesImage,
  servicesImageChanged,
  setServicesImageChanged,
  servicesName,
  setServicesName,
  servicesNameChanged,
  setServicesNameChanged,
  servicesNameError,
  setServicesNameError,
  servicesUrl,
  setServicesUrl,
  servicesUrlChanged,
  setServicesUrlChanged,
  servicesUrlError,
  setServicesUrlError,
  servicesDescription,
  setServicesDescription,
  servicesDescriptionChanged,
  setServicesDescriptionChanged,
  servicesDescriptionError,
  setServicesDescriptionError,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [originalServices, setOriginalServices] = useState( userContext && userContext.profile && userContext.profile.services);

  const [displayServicesImage, setDisplayServicesImage] = useState('')

  const servicesImageChange = (value) => {
    setServicesImage(value),
    setServicesImageChanged(true),
    setDisplayServicesImage(URL.createObjectURL(value))
  }

  const servicesNameChange = (value) => {
    setServicesName(value),
    setServicesNameChanged(true),
    setServicesNameError('')
  }

  const servicesUrlChange = (value) => {
    setServicesUrl(value),
    setServicesUrlChanged(true),
    setServicesUrlError('')
  }

  const servicesDescriptionChange = (value) => {
    setServicesDescription(value),
    setServicesDescriptionChanged(true),
    setServicesDescriptionError('')
  }

  const updateServices = (downloadURL, uid) => {
    let newService = {}

    newService.logo_url = downloadURL ? downloadURL : null
    newService.logo_ref = uid ? uid : null
    newService.name = servicesName
    newService.url = servicesUrl
    newService.description = servicesDescription
    
    let originalServicesCopy = originalServices

    if (originalServices !== undefined) {
      originalServicesCopy.unshift(newService)
      setOriginalServices(originalServicesCopy)
    } else {
      originalServicesCopy = [newService]
      setOriginalServices(originalServicesCopy)
    }
  }
  
  const handleAddServicesSubmit = (e) => {
    e.preventDefault();

    if (servicesName === '') {
      setServicesNameError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)

    if (servicesImageChanged && servicesImage !== '') {

      let uid = uuidv4()
      let filename = `images/${user}/services/${uid}.jpg`

      var metadata = {
        contentType: 'image/jpeg',
        name: filename
      };

      var uploadTask = fire.storage().ref().child(filename).put(servicesImage, metadata);

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
                'name': servicesName,
                'url': servicesUrl,
                'description': servicesDescription
              }

              let newUserContext = userContext;
              newUserContext.profile.services = newUserContext.profile.services !== undefined ? [...newUserContext.profile.services, payload] : [payload];
              setUserContext(newUserContext)

              fire.firestore().collection('users').doc(user).update({
                'profile.services': originalServices !== undefined ? 
                  [...originalServices, payload]
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
              toast("Service added")
            })
            .catch((error) => {
              setSubmitting(false)
              toast("Unable to add service")
              //console.error("Error adding document: ", error);
            });
        }
      );
    } else {

      let payload = {
        'logo_ref': null,
        'logo_url': null,
        'name': servicesName,
        'url': servicesUrl,
        'description': servicesDescription
      }

      let newUserContext = userContext;
      newUserContext.profile.services = newUserContext.profile.services !== undefined ? [...newUserContext.profile.services, payload] : [payload];
      setUserContext(newUserContext)

      fire.firestore().collection('users').doc(user).update({
        'profile.services': originalServices !== undefined ? 
          [...originalServices, payload]
        :
          [payload],
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then(() => {
          handleBack()
        })
        .then(() => {
          setSubmitting(false)
          toast("Service added")
        })
        .catch((error) => {
          setSubmitting(false)
          toast("Unable to add service")
          //console.error("Error adding document: ", error);
        });
    }
  }

  const hiddenFileInput = useRef(null);

  const handleChangeImage = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    servicesImageChange(event.target.files[0])
  }

  const handleDeleteImage = (e) => {
    e.preventDefault();
    servicesImageChange('')
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddServicesSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Image</p>
            {servicesImageChanged ? (servicesImage !== '' ?
            // {servicesImage !== '' ?
              <>
                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  {/* <div className="w-100 position-relative" style={{paddingTop: '66%'}}>
                    <img src={URL.createObjectURL(servicesImage)} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
                  </div> */}
                  <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${displayServicesImage})` }}></div>
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
              className={servicesNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={servicesName}
              onChange={({ target }) => servicesNameChange(target.value)}
            />
            {servicesNameError !== '' ? <p className="small text-error-high mt-2">{servicesNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={servicesUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={servicesUrl}
              onChange={({ target }) => servicesUrlChange(target.value)}
            />
            {servicesUrlError !== '' ? <p classUrl="small text-error-high mt-2">{servicesUrlError}</p> : null}
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={servicesDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={servicesDescription}
              onChange={({ target }) => servicesDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {servicesDescriptionError !== '' ? <p className="small text-error-high mt-2">{servicesDescriptionError}</p> : null}
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

export default AddService;