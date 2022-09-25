import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';

const EditLink = ({
  user,
  editProfileModalIndex,
  linksLabel,
  setLinksLabel,
  linksLabelChanged,
  setLinksLabelChanged,
  linksLabelError,
  setLinksLabelError,
  linksUrl,
  setLinksUrl,
  linksUrlChanged,
  setLinksUrlChanged,
  linksUrlError,
  setLinksUrlError,
  linksShowDeleteLinkModal,
  setLinksShowDeleteLinkModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [originalLinks, setOriginalLinks] = useState(userContext.links);

  const linksLabelChange = (value) => {
    setLinksLabel(value),
    setLinksLabelChanged(true),
    setLinksLabelError('')
  }

  const linksUrlChange = (value) => {
    setLinksUrl(value),
    setLinksUrlChanged(true),
    setLinksUrlError('')
  }

  const updateLinks = (index) => {
    if (linksLabelChanged) {
      originalLinks[index].label = linksLabel
    }
    if (linksUrlChanged) {
      originalLinks[index].url = linksUrl
    }
  }
  
  const handleAddLinksSubmit = (e) => {
    e.preventDefault();
    if (linksLabelChanged && linksLabel === '') {
      setLinksLabelError('Label cannot be empty')
      return null;
    }
    if (linksUrlChanged && linksUrl === '') {
      setTitleError('URL cannot be empty')
      return null;
    }

    setSubmitting(true)

    if (editProfileModalIndex == !undefined) {
      updateLinks(editProfileModalIndex)
      fire.firestore().collection('users').doc(user).update({
        'links': originalLinks,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then((result) => {
        let newUserContext = userContext;
        newUserContext.links = originalLinks;
        setUserContext(newUserContext)
        handleBack()
      })
      .then(() => {
        setSubmitting(false)
        toast("Links added")
      })
      .catch((error) => {
        setSubmitting(false)
        toast("Unable to add link")
        //console.error("Error adding document: ", error);
      });
    }
    if (editProfileModalIndex == undefined) {
      fire.firestore().collection('users').doc(user).update({
        'email': linksUrl,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then((result) => {
        let newUserContext = userContext;
        newUserContext.email = linksUrl;
        setUserContext(newUserContext)
        handleBack()
      })
      .then(() => {
        setSubmitting(false)
        toast("Link updated")
      })
      .catch((error) => {
        setSubmitting(false)
        toast("Unable to update link")
        //console.error("Error adding document: ", error);
      });
    }
  }

  const handleDeleteLinkShow = () => {
    setLinksShowDeleteLinkModal(true)
  }

  const handleDeleteLinkClose = () => {
    setLinksShowDeleteLinkModal(false)
  }

  const handleDeleteLinkSubmit = (e) => {
    e.preventDefault();

    setDeleting(true)
    // delete originalExperiences[editProfileModalIndex]
    originalLinks.splice(editProfileModalIndex, 1);

    fire.firestore().collection('users').doc(user).update({
      'links': originalLinks,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setLinksShowDeleteLinkModal(false)
        setDeleting(false)
        toast("Link deleted")
      })
      .then(()=>{
        handleBack()
      })
      .catch((error) => {
        setDeleting(false)
        toast("Unable to delete link")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddLinksSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Label</p>
            <input
              type="text"
              className={linksLabelError !== '' ? `error w-100 small` : `w-100 small`}
              value={linksLabelChanged ? linksLabel : (
                editProfileModalIndex == undefined ? 
                  'Contact me'
                :
                ( userContext && 
                  userContext.links && 
                  userContext.links[editProfileModalIndex] && 
                  userContext.links[editProfileModalIndex].label && 
                  userContext.links[editProfileModalIndex].label !== undefined ? 
                  userContext && 
                  userContext.links && 
                  userContext.links[editProfileModalIndex] && 
                  userContext.links[editProfileModalIndex].label && 
                  userContext.links[editProfileModalIndex].label : '')
                )
              }
              onChange={({ target }) => linksLabelChange(target.value)}
              disabled={editProfileModalIndex == undefined}
            />
            {linksLabelError !== '' ? <p className="small text-error-high mt-2">{linksLabelError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">URL</p>
            <input
              type="text"
              className={linksUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={linksUrlChanged ? linksUrl : (
                editProfileModalIndex == undefined ? 
                  userContext && 
                  userContext.email && 
                  userContext.email
                :
                ( userContext && 
                  userContext.links && 
                  userContext.links[editProfileModalIndex] && 
                  userContext.links[editProfileModalIndex].url && 
                  userContext.links[editProfileModalIndex].url !== undefined ? 
                  userContext && 
                  userContext.links && 
                  userContext.links[editProfileModalIndex] && 
                  userContext.links[editProfileModalIndex].url && 
                  userContext.links[editProfileModalIndex].url : '')
                )
              }
              onChange={({ target }) => linksUrlChange(target.value)}
            />
            {linksUrlError !== '' ? <p className="small text-error-high mt-2">{linksUrlError}</p> : null}
          </div>
          <div className={`d-flex flex-column flex-sm-row ${ editProfileModalIndex !== undefined ? 'justify-content-between' : 'justify-content-end' }`} style={{gap: '24px'}}>
            {/* <button type="button" onClick={handleDeleteLinkShow} className="btn error medium w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>Delete</button> */}
            { editProfileModalIndex !== undefined && 
              <button type="button" onClick={handleDeleteLinkShow} className="btn dark low icon-only w-100 w-sm-auto order-1 order-sm-0" disabled={submitting}>
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.DELETE}></path>
                </svg>
              </button>
            }
            <div className="d-flex flex-column flex-sm-row order-0 order-sm-1" style={{gap: '12px'}}>
              <button type="button" onClick={handleBack} className="btn dark medium w-100 w-sm-auto" disabled={submitting}>Cancel</button>
              <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Save' : 'Saving...'}</button>
            </div>
          </div>
        </form>
      </div>

      <Modal
        show={linksShowDeleteLinkModal} 
        onHide={handleDeleteLinkClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        <div className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-2">
            <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
              <h5 className="text-dark-high font-weight-bold mb-0">Delete link</h5>
            </div>
            <button onClick={handleDeleteLinkClose} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          </div>
          <p className="mb-4">Are you sure you would like to delete this?</p>
          { userContext && 
            userContext.links && 
            userContext.links[editProfileModalIndex] && 
            <div className="d-flex flex-row justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              <div className="w-100">
                <p className="large text-dark-high font-weight-semibold mb-0">{userContext.links[editProfileModalIndex].label}</p>
                <p className="large text-dark-med mb-0">{userContext.links[editProfileModalIndex].url}</p>
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleDeleteLinkClose} className="btn dark medium w-100 w-sm-auto" disabled={deleting}>Cancel</button>
            <button type="button" onClick={handleDeleteLinkSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={deleting}>{!deleting ? 'Delete' : 'Deleting...'}</button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default EditLink;