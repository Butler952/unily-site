import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BasicInformation = ({
  user,
  basicInfoFirstName,
  basicInfoFirstNameChanged,
  basicInfoFirstNameError,
  basicInfoLastName,
  basicInfoLastNameChanged,
  basicInfoLastNameError,
  basicInfoHeadline,
  basicInfoHeadlineChanged,
  basicInfoHeadlineError,
  setBasicInfoFirstName,
  setBasicInfoFirstNameChanged,
  setBasicInfoFirstNameError,
  setBasicInfoLastName,
  setBasicInfoLastNameChanged,
  setBasicInfoLastNameError,
  setBasicInfoHeadline,
  setBasicInfoHeadlineChanged,
  setBasicInfoHeadlineError,
  profilePictureUrl,
  setProfilePictureUrl,
  profilePictureUrlChanged,
  setProfilePictureUrlChanged
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null); 

  const basicInfoFirstNameChange = (value) => {
    setBasicInfoFirstName(value),
    setBasicInfoFirstNameChanged(true),
    setBasicInfoFirstNameError('')
  }

  const basicInfoLastNameChange = (value) => {
    setBasicInfoLastName(value),
    setBasicInfoLastNameChanged(true),
    setBasicInfoLastNameError('')
  }

  const basicInfoHeadlineChange = (value) => {
    setBasicInfoHeadline(value),
    setBasicInfoHeadlineChanged(true)
  }
  const profilePictureUrlChange = (value) => {
    setProfilePictureUrl(value),
    setProfilePictureUrlChanged(true)
  }

  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();

    if (basicInfoFirstNameChanged && basicInfoFirstName === '') {
      setBasicInfoFirstNameError('Your first name cannot be empty')
      return null;
    }
    if (basicInfoLastNameChanged && basicInfoLastName === '') {
      setBasicInfoLastNameError('Your last name cannot be empty')
      return null;
    }

    setSubmitting(true)

    fire.firestore().collection('users').doc(user).update({
      'profile.first_name': !basicInfoFirstNameChanged ? userContext.profile.first_name : basicInfoFirstName,
      'profile.last_name': !basicInfoLastNameChanged ? userContext.profile.last_name : basicInfoLastName,
      'profile.headline': !basicInfoHeadlineChanged ? userContext.profile.headline : basicInfoHeadline,
      'profile.full_name': `${!basicInfoFirstNameChanged ? userContext.profile.first_name : basicInfoFirstName} ${!basicInfoLastNameChanged ? userContext.profile.last_name : basicInfoLastName}`,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setSubmitting(false)
        toast("Basic information updated")
      })
      .catch((error) => {
        setSubmitting(false)
        toast("Unable to update basic information")
        //console.error("Error adding document: ", error);
      });
  }

  const hiddenFileInput = useRef(null);

  const handleDeleteProfilePicture = (e) => {
    e.preventDefault();

    setDeleting(true)

    let filename = "images/" + user + "/profile_picture.jpg"

    fire.storage().ref().child(filename).delete()
    .then(() => {
      fire.firestore().collection('users').doc(user).update({
        'profile.profile_pic_url': null,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.profile_pic_url = '';
        setUserContext(newUserContext)
        profilePictureUrlChange('')
      })
      .then(() => {
        setDeleting(false)
        toast("Profile picture deleted")
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete profile picture")
      });
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
  }

  const handleChangeProfilePicture = (event) => {
    hiddenFileInput.current.click();
  };

  function handleChange(event) {
    // setProfilePictureFile(event.target.files[0]);
    uploadProfilePicture(event.target.files[0])
  }

  // const handleChange = event => {
  //   const fileUploaded = event.target.files[0];
  //   props.handleFile(fileUploaded);
  // };

  const uploadProfilePicture = (file) => {

    setUploading(true)

    if (file == null) return;

    let filename = "images/" + user + "/profile_picture.jpg"

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
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case fire.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case fire.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
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
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.profile_pic_url': downloadURL,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.profile_pic_url = downloadURL;
            setUserContext(newUserContext)
          })
          .then(() => {
            profilePictureUrlChange(downloadURL)
          })
          .then(() => {
            setUploading(false)
            toast("Profile picture updated")
          })
          .catch((error) => {
            setUploading(false)
            toast("Unable to upload profile picture")
          });
        });
        // Add this link to firestore
        
      }
    );
  }

  const pauseUpload = () => {
    uploadTask.pause();
  }
  const resumeUpload = () => {
    uploadTask.resume();
  }
  const cancelUpload = () => {
    uploadTask.cancel();
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleBasicInfoSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Profile picture</p>
            { profilePictureUrlChanged ? (profilePictureUrl !== '' ? 
              <>
                <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                  <img src={profilePictureUrlChanged ? profilePictureUrl : userContext.profile.profile_pic_url !== undefined ? userContext.profile.profile_pic_url : ''}  style={{width: '120px', height: '120px',borderRadius: '100%'}}/>
                  <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeProfilePicture}>{!uploading ? 'Change' : 'Uploading'}</button>
                  <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={deleting} onClick={handleDeleteProfilePicture}>{!deleting ? 'Delete' : 'Deleting'}</button>
                </div>
              </>
            :
              <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeProfilePicture}>{!uploading ? 'Upload' : 'Uploading'}</button>
            )
            // userContext.profile.profile_pic_url !== '' ?
            
            : 
              (userContext.profile.profile_pic_url !== null ? 
                <>
                  <div className="d-flex flex-column flex-sm-row align-items-center mt-3" style={{gap: '16px'}}>
                    <img src={profilePictureUrlChanged ? profilePictureUrl : userContext.profile.profile_pic_url !== undefined ? userContext.profile.profile_pic_url : ''}  style={{width: '120px', height: '120px',borderRadius: '100%'}}/>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeProfilePicture}>{!uploading ? 'Change' : 'Uploading'}</button>
                    <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={deleting} onClick={handleDeleteProfilePicture}>{!deleting ? 'Delete' : 'Deleting'}</button>
                  </div>
                </>
              :
                <button type="button" className="btn dark medium small w-100 w-sm-auto" disabled={uploading} onClick={handleChangeProfilePicture}>{!uploading ? 'Upload' : 'Uploading'}</button>
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
          <div className="d-flex flex-column flex-sm-row mb-3" style={{ gap: '16px' }}>
            <div className="w-100">
              <p className="text-dark-high mb-2">First name</p>
              <input
                type="text"
                className={basicInfoFirstNameError !== '' ? `error w-100 small` : `w-100 small`}
                value={basicInfoFirstNameChanged ? basicInfoFirstName : (userContext.profile.first_name !== undefined ? userContext.profile.first_name : '')}
                onChange={({ target }) => basicInfoFirstNameChange(target.value)}
              />
              {basicInfoFirstNameError !== '' ? <p className="small text-error-high mt-2">{basicInfoFirstNameError}</p> : null}
            </div>
            <div className="w-100">
              <p className="text-dark-high mb-2">Last name</p>
              <input
                type="text"
                className={basicInfoLastNameError !== '' ? `error w-100 small` : `w-100 small`}
                value={basicInfoLastNameChanged ? basicInfoLastName : (userContext.profile.last_name !== undefined ? userContext.profile.last_name : '')}
                onChange={({ target }) => basicInfoLastNameChange(target.value)}
              />
              {basicInfoLastNameError !== '' ? <p className="small text-error-high mt-2">{basicInfoLastNameError}</p> : null}
            </div>
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Headline</p>
            <input
              type="text"
              className={basicInfoHeadlineError !== '' ? `error w-100 small` : `w-100 small`}
              value={basicInfoHeadlineChanged ? basicInfoHeadline : (userContext.profile.headline !== undefined ? userContext.profile.headline : '')}
              onChange={({ target }) => basicInfoHeadlineChange(target.value)}
            />
            {/* {basicInfoHeadlineError !== '' ? <p className="small text-error-high mt-2">{basicInfoHeadlineError}</p> : null} */}
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Save' : 'Saving...'}</button>
          </div>
        </form>
      </div>

    </>
  )
}

export default BasicInformation;