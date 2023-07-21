import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const AddTestimonial = ({
  user,
  editProfileModalIndex,
  testimonialsAvatar,
  setTestimonialsAvatar,
  testimonialsAvatarChanged,
  setTestimonialsAvatarChanged,
  testimonialsName,
  setTestimonialsName,
  testimonialsNameChanged,
  setTestimonialsNameChanged,
  testimonialsNameError,
  setTestimonialsNameError,
  testimonialsTitle,
  setTestimonialsTitle,
  testimonialsTitleChanged,
  setTestimonialsTitleChanged,
  testimonialsTitleError,
  setTestimonialsTitleError,
  testimonialsUrl,
  setTestimonialsUrl,
  testimonialsUrlChanged,
  setTestimonialsUrlChanged,
  testimonialsUrlError,
  setTestimonialsUrlError,
  testimonialsDate,
  setTestimonialsDate,
  testimonialsDateChanged,
  setTestimonialsDateChanged,
  testimonialsDateError,
  setTestimonialsDateError,
  testimonialsDescription,
  setTestimonialsDescription,
  testimonialsDescriptionChanged,
  setTestimonialsDescriptionChanged,
  testimonialsDescriptionError,
  setTestimonialsDescriptionError,
  testimonialsShowDeleteTestimonialModal,
  setTestimonialsShowDeleteTestimonialModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [originalTestimonials, setOriginalTestimonials] = useState( userContext && userContext.profile && userContext.profile.testimonials);
  const [displayTestimonialsAvatar, setDisplayTestimonialsAvatar] = useState('')

  const testimonialsAvatarChange = (value) => {
    setTestimonialsAvatar(value),
    setTestimonialsAvatarChanged(true)
    setDisplayTestimonialsAvatar(URL.createObjectURL(value))
  }

  const testimonialsNameChange = (value) => {
    setTestimonialsName(value),
    setTestimonialsNameChanged(true),
    setTestimonialsNameError('')
  }

  const testimonialsTitleChange = (value) => {
    setTestimonialsTitle(value),
    setTestimonialsTitleChanged(true),
    setTestimonialsTitleError('')
  }

  const testimonialsUrlChange = (value) => {
    setTestimonialsUrl(value),
    setTestimonialsUrlChanged(true),
    setTestimonialsUrlError('')
  }

  const testimonialsDateChange = (value) => {
    setTestimonialsDate(value),
    setTestimonialsDateChanged(true),
    setTestimonialsDateError('')
  }

  const testimonialsDescriptionChange = (value) => {
    setTestimonialsDescription(value),
    setTestimonialsDescriptionChanged(true),
    setTestimonialsDescriptionError('')
  }

  const updateTestimonials = (downloadURL, uid) => {
    let newTestimonial = {}

    newTestimonial.avatar_url = downloadURL ? downloadURL : null
    newTestimonial.avatar_ref = uid ? uid : null
    newTestimonial.name = testimonialsName
    newTestimonial.title = testimonialsTitle
    newTestimonial.url = testimonialsUrl

    if (testimonialsDate) {
      let dateMonth = Number(testimonialsDate.split('-')[1]);
      let dateYear = Number(testimonialsDate.split('-')[0]);
      newTestimonial.posted_at = 
        { 
          'day': 1,
          'month': dateMonth,
          'year': dateYear
        }
    } else {
      newTestimonial.posted_at = null
    }

    newTestimonial.description = testimonialsDescription
    let originalTestimonialsCopy = originalTestimonials

    if (originalTestimonials !== undefined) {
      originalTestimonialsCopy.unshift(newTestimonial)
      setOriginalTestimonials(originalTestimonialsCopy)
    } else {
      originalTestimonialsCopy = [newTestimonial]
      setOriginalTestimonials(originalTestimonialsCopy)
    }
  }
  
  const handleAddTestimonialsSubmit = (e) => {
    e.preventDefault();

    if (testimonialsName === '') {
      setTestimonialsNameError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)

    if (testimonialsAvatarChanged && testimonialsAvatar !== '') {

      let uid = uuidv4()
      let filename = `images/${user}/testimonials/avatar/${uid}.jpg`

      var metadata = {
        contentType: 'image/jpeg',
        name: filename
      };

      var uploadTask = fire.storage().ref().child(filename).put(testimonialsAvatar, metadata);

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
              updateTestimonials(downloadURL, uid)
            })
            .then(() => {
              fire.firestore().collection('users').doc(user).update({
                'profile.testimonials': originalTestimonials,
                lastUpdated: fire.firestore.FieldValue.serverTimestamp()
              })
                .then((result) => {
                  let newUserContext = userContext;
                  newUserContext.profile.testimonials = originalTestimonials;
                  setUserContext(newUserContext)
                  handleBack()
                })
                .then(() => {
                  setSubmitting(false)
                  toast("Testimonial added")
                })
                .catch((error) => {
                  setSubmitting(false)
                  toast("Unable to add testimonial")
                  //console.error("Error adding document: ", error);
                });
            })

          // Add this link to firestore
        }
      );
    } else {
      updateTestimonials()
      fire.firestore().collection('users').doc(user).update({
        'profile.testimonials': originalTestimonials,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then((result) => {
          let newUserContext = userContext;
          newUserContext.profile.testimonials = originalTestimonials;
          setUserContext(newUserContext)
          handleBack()
        })
        .then(() => {
          setSubmitting(false)
          toast("Testimonial added")
        })
        .catch((error) => {
          setSubmitting(false)
          toast("Unable to add testimonial")
          //console.error("Error adding document: ", error);
        });
    }
  }

  const hiddenFileInput = useRef(null);

  const handleChangeImage = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    testimonialsAvatarChange(event.target.files[0])
  }

  const handleDeleteImage = (e) => {
    e.preventDefault();
    testimonialsAvatarChange('')
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddTestimonialsSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Avatar</p>
            {testimonialsAvatarChanged ? (testimonialsAvatar !== '' ?
            // {testimonialsAvatar !== '' ?
              <>
                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  {/* <div className="w-100 position-relative" style={{paddingTop: '66%'}}>
                    <img src={URL.createObjectURL(testimonialsAvatar)} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
                  </div> */}
                  <div className={`position-relative overflow-hidden ${styles.editingAvatar}`} style={{ backgroundImage: `url(${displayTestimonialsAvatar})`, width: '80px', height: '80px' }}></div>
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
              className={testimonialsNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsName}
              onChange={({ target }) => testimonialsNameChange(target.value)}
            />
            {testimonialsNameError !== '' ? <p className="small text-error-high mt-2">{testimonialsNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Title</p>
            <input
              type="text"
              className={testimonialsTitleError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsTitle}
              onChange={({ target }) => testimonialsTitleChange(target.value)}
            />
            {testimonialsTitleError !== '' ? <p className="small text-error-high mt-2">{testimonialsTitleError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={testimonialsUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsUrl}
              onChange={({ target }) => testimonialsUrlChange(target.value)}
            />
            {testimonialsUrlError !== '' ? <p classUrl="small text-error-high mt-2">{testimonialsUrlError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Date</p>
            <input 
              type="month"
              className={testimonialsDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsDate}
              onChange={({ target }) => testimonialsDateChange(target.value)}
            />
            {testimonialsDateError !== '' ? <p className="small text-error-high mt-2">{testimonialsDateError}</p> : null}
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Testimonial</p>
            <textarea 
              className={testimonialsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={testimonialsDescription}
              onChange={({ target }) => testimonialsDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {testimonialsDescriptionError !== '' ? <p className="small text-error-high mt-2">{testimonialsDescriptionError}</p> : null}
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

export default AddTestimonial;