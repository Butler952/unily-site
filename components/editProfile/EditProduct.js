import { useState, useContext, useRef } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import { v4 as uuidv4 } from 'uuid';

const EditProduct = ({
  user,
  editProfileModalIndex,
  productsImage,
  setProductsImage,
  productsImageChanged,
  setProductsImageChanged,
  productsName,
  setProductsName,
  productsNameChanged,
  setProductsNameChanged,
  productsNameError,
  setProductsNameError,
  productsUrl,
  setProductsUrl,
  productsUrlChanged,
  setProductsUrlChanged,
  productsUrlError,
  setProductsUrlError,
  productsDescription,
  setProductsDescription,
  productsDescriptionChanged,
  setProductsDescriptionChanged,
  productsDescriptionError,
  setProductsDescriptionError,
  productsShowDeleteProductModal,
  setProductsShowDeleteProductModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [originalProducts, setOriginalProducts] = useState(userContext.profile.products);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const productsImageChange = (value) => {
    setProductsImage(value),
    setProductsImageChanged(true)
  }

  const productsNameChange = (value) => {
    setProductsName(value),
    setProductsNameChanged(true),
    setProductsNameError('')
  }

  const productsUrlChange = (value) => {
    setProductsUrl(value),
    setProductsUrlChanged(true),
    setProductsUrlError('')
  }

  const productsDescriptionChange = (value) => {
    setProductsDescription(value),
    setProductsDescriptionChanged(true),
    setProductsDescriptionError('')
  }

  const updateProducts = (index) => {

    if (productsNameChanged) {
      originalProducts[index].name = productsName
    }
    if (productsUrlChanged) {
      originalProducts[index].url = productsUrl
    }
    if (productsDescriptionChanged) {
      originalProducts[index].description = productsDescription
    }

  }
  
  const handleEditProductsSubmit = (e) => {
    e.preventDefault();

    if (productsNameChanged && productsName === '') {
      setProductsCompanyError('Name cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateProducts(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.products': originalProducts,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.products = originalProducts;
      setUserContext(newUserContext)
    })
    .then(() => {
      setSubmitting(false)
      toast("Product updated")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to update product")
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

    let uid = userContext.profile.products[editProfileModalIndex].logo_ref ? userContext.profile.products[editProfileModalIndex].logo_ref : uuidv4()
    let filename = `images/${user}/products/${userContext.profile.products[editProfileModalIndex].logo_ref ? userContext.profile.products[editProfileModalIndex].logo_ref : uid}.jpg`

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
          originalProducts[editProfileModalIndex].logo_url = downloadURL
          originalProducts[editProfileModalIndex].logo_ref = uid
          // console.log('File available at', downloadURL);
          fire.firestore().collection('users').doc(user).update({
            'profile.products': originalProducts,
            lastUpdated: fire.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            let newUserContext = userContext;
            newUserContext.profile.products[editProfileModalIndex].logo_url = downloadURL;
            newUserContext.profile.products[editProfileModalIndex].logo_ref = uid;
            setUserContext(newUserContext)
          })
          .then(() => {
            productsImageChange(downloadURL)
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

    // let filename = originalProducts[editProfileModalIndex].logo_url
    // let filename = userContext.profile.products[editProfileModalIndex].logo_url
    let filename = `images/${user}/products/${userContext.profile.products[editProfileModalIndex].logo_ref}.jpg`

    fire.storage().ref().child(filename).delete()
    .then(() => {
      originalProducts[editProfileModalIndex].logo_url = null
      fire.firestore().collection('users').doc(user).update({
        'profile.products': originalProducts,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.profile.products[editProfileModalIndex].logo_url = null;
        setUserContext(newUserContext)
        productsImageChange('')
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

  // const deleteProduct = (index) => {
  //   delete originalProducts[index]
  // }

  const handleDeleteProductShow = () => {
    setProductsShowDeleteProductModal(true)
  }

  const handleDeleteProductClose = () => {
    setProductsShowDeleteProductModal(false)
  }

  const handleDeleteProductSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalProducts[editProfileModalIndex]
    originalProducts.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'profile.products': originalProducts,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setProductsShowDeleteProductModal(false)
        setDeleting(false)
        toast("Product deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete product")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleEditProductsSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Image</p>
            { productsImageChanged ? (productsImage !== '' ? 
              <>
                {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                  <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${productsImageChanged ? productsImage : (userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].logo_url && userContext.profile.products[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].logo_url && userContext.profile.products[editProfileModalIndex].logo_url : '')})` }}>
                  </div>
                </div> */}
                <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.products[editProfileModalIndex].logo_url})` }}></div>

                <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                  {/* <div className="w-100 position-relative" style={{paddingTop: '56.25%'}}>
                    <img src={productsImageChanged ? productsImage : (userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].logo_url && userContext.profile.products[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].logo_url && userContext.profile.products[editProfileModalIndex].logo_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
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
                userContext.profile.products[editProfileModalIndex] && 
                userContext.profile.products[editProfileModalIndex].logo_url &&
                userContext.profile.products[editProfileModalIndex].logo_url ?
                <>
                  {/* <div className="d-flex flex-column mt-3 w-100" style={{ gap: '16px' }}>
                    <div className="w-100 position-relative radius-2 overflow-hidden" style={{ paddingTop: '100%', backgroundPosition: 'center',  backgroundSize: 'cover', backgroundImage: `url(${productsImageChanged ? productsImage : (userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].logo_url && userContext.profile.products[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].logo_url && userContext.profile.products[editProfileModalIndex].logo_url : '')})` }}>
                    </div>
                  </div> */}
                  <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.products[editProfileModalIndex].logo_url})` }}></div>
                  <div className="d-flex flex-column mt-3" style={{ gap: '16px' }}>
                    {/* <div className="w-100 position-relative" style={{paddingTop: '100%'}}>
                      <img src={productsImageChanged ? productsImage : (userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].logo_url && userContext.profile.products[editProfileModalIndex].logo_url !== undefined ? userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].logo_url && userContext.profile.products[editProfileModalIndex].logo_url : '')} className="position-absolute radius-3 w-100 h-100" style={{ top: 0, left: 0 }} />
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
              className={productsNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={productsNameChanged ? productsName : (userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].name && userContext.profile.products[editProfileModalIndex].name !== undefined ? userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].name && userContext.profile.products[editProfileModalIndex].name : '')}
              onChange={({ target }) => productsNameChange(target.value)}
            />
            {productsNameError !== '' ? <p className="small text-error-high mt-2">{productsNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Link</p>
            <input
              type="text"
              className={productsUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={productsUrlChanged ? productsUrl : (userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].url && userContext.profile.products[editProfileModalIndex].url !== undefined ? userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].url && userContext.profile.products[editProfileModalIndex].url : '')}
              onChange={({ target }) => productsUrlChange(target.value)}
            />
            {productsUrlError !== '' ? <p classUrl="small text-error-high mt-2">{productsUrlError}</p> : null}
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={productsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={productsDescriptionChanged ? productsDescription : (
                userContext &&
                userContext.profile &&
                userContext.profile.products &&
                userContext.profile.products[editProfileModalIndex] &&
                userContext.profile.products[editProfileModalIndex].description !== undefined ? userContext.profile.products[editProfileModalIndex].description : '')
              }
              onChange={({ target }) => productsDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {productsDescriptionError !== '' ? <p className="small text-error-high mt-2">{productsDescriptionError}</p> : null}
          </div>
          {/* <div className="mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <input
              type="text"
              className={productsDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={productsDescriptionChanged ? productsDescription : (userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].description && userContext.profile.products[editProfileModalIndex].description !== undefined ? userContext && userContext.profile && userContext.profile.products[editProfileModalIndex] && userContext.profile.products[editProfileModalIndex].description && userContext.profile.products[editProfileModalIndex].description : '')}
              onChange={({ target }) => productsDescriptionChange(target.value)}
            />
            {productsDescriptionError !== '' ? <p className="small text-error-high mt-2">{productsDescriptionError}</p> : null}
          </div> */}
          <div className="d-flex flex-column flex-sm-row justify-content-between" style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteProductShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            <button type="button" onClick={handleDeleteProductShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
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
        show={productsShowDeleteProductModal} 
        onHide={handleDeleteProductClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        {/* <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Delete product?</h5>
          </div>
          <button onClick={handleDeleteProductClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> */}
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete product</h5>
            </div>
            <button onClick={handleDeleteProductClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this product?</p>
          { userContext &&
              userContext.profile &&
              userContext.profile.products &&
              userContext.profile.products[editProfileModalIndex] &&
            <div className="d-flex flex-column justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              {/* { userContext.profile.products[editProfileModalIndex].logo_url ?
              <div>
                <img className={styles.productImage} src={userContext.profile.products[editProfileModalIndex].logo_url ? userContext.profile.products[editProfileModalIndex].logo_url : null} style={{width: '64px'}}/>
              </div>
              : ''} */}
              { userContext.profile.products[editProfileModalIndex].logo_url &&
                <div className={`w-100 position-relative overflow-hidden ${styles.editingImage}`} style={{ backgroundImage: `url(${userContext.profile.products[editProfileModalIndex].logo_url})` }}></div>
              }
              <div className="w-100">
                {/* <p className="large text-dark-high font-weight-semibold mb-0">{userContext.profile.products[editProfileModalIndex].title}</p> */}
                {/* <a target="_blank" href={userContext.profile.products[editProfileModalIndex].company_linkedin_profile_url} className="text-decoration-none"> */}
                <h4 className="large text-dark-high mb-0">{userContext.profile.products[editProfileModalIndex].name}</h4>
                {/* </a> */}
                {/* <p className="text-dark-low mb-0">
                  {userContext.profile.products[editProfileModalIndex].producted_at ? (userContext.profile.products[editProfileModalIndex].producted_at.month ? convertMonth(userContext.profile.products[editProfileModalIndex].producted_at.month) + " " : '') : null}
                  {userContext.profile.products[editProfileModalIndex].producted_at ? (userContext.profile.products[editProfileModalIndex].producted_at.year ? userContext.profile.products[editProfileModalIndex].producted_at.year + " " : null) : null}
                 </p> */}
                {/* {userContext.profile.products[editProfileModalIndex].description ? <p className="text-dark-med mb-0 mt-3">{userContext.profile.products[editProfileModalIndex].description}</p> : null} */}
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteProductClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteProductSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default EditProduct;