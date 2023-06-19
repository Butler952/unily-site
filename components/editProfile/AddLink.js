import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';

const AddLink = ({
  user,
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
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [originalLinks, setOriginalLinks] = useState(userContext && userContext.links);

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

  const addLink = () => {
    let newLink = {};
    newLink.label = linksLabel
    newLink.url = linksUrl
    // add newLinks to originalLinks

    if (originalLinks !== undefined) {
      let originalLinksCopy = originalLinks
      originalLinksCopy.unshift(newLink)
      setOriginalLinks(originalLinksCopy)
    } else {
      originalLinksCopy = [newLink]
      setOriginalLinks(originalLinksCopy)
    }
    
  }
  
  const handleAddLinksSubmit = (e) => {
    e.preventDefault();

    if (linksLabel === '') {
      setLinksLabelError('Label cannot be empty')
      return null;
    }
    if (linksUrl === '') {
      setTitleError('URL cannot be empty')
      return null;
    }

    setSubmitting(true)
    addLink()

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
      toast("Link added")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to add link")
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
              value={linksLabel}
              onChange={({ target }) => linksLabelChange(target.value)}
            />
            {linksLabelError !== '' ? <p className="small text-error-high mt-2">{linksLabelError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">URL</p>
            <input
              type="text"
              className={linksUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={linksUrl}
              onChange={({ target }) => linksUrlChange(target.value)}
            />
            {linksUrlError !== '' ? <p className="small text-error-high mt-2">{linksUrlError}</p> : null}
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

export default AddLink;