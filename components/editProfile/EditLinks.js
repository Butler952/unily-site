import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './editProfile.module.scss'

const EditLinks = ({
  user,
  linksContact,
  setLinksContact,
  linksContactChanged,
  setLinksContactChanged,
  linksContactError,
  setLinksContactError,
  linksContactShow,
  setLinksContactShow,
  linksContactShowChanged,
  setLinksContactShowChanged,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  // const [originalContact, setOriginalContact] = useState( userContext.email);

  const linksContactChange = (value) => {
    setLinksContact(value),
      setLinksContactChanged(true),
      setLinksContactError('')
  }

  const linksContactShowChange = () => {
    if (!linksContactShowChanged) {
      setLinksContactShow(!userContext.displayInfo.basicInfo.each.email)
    } else {
      setLinksContactShow(linksContactShow => !linksContactShow)
    }
    setLinksContactShowChanged(true)
  }

  const linksLabelChange = (value, index) => {
    linksList[index].label = value
  }

  const linksUrlChange = (value, index) => {
    linksList[index].url = value
  }

  let linksList = [
    {
      'label': 'Twitter',
      'url': 'https://www.twitter.com/butler952'
    },
    {
      'label': 'Github',
      'url': 'https://www.github.com/butler952'
    }
  ]

  const handleLinksSubmit = (e) => {
    e.preventDefault();

    if (linksContactChanged && linksContact === '') {
      setLinksContactError('Your contact link cannot be empty')
      return null;
    }

    setSubmitting(true)

    fire.firestore().collection('users').doc(user).update({
      'email': !linksContactChanged ? userContext.email : linksContact,
      'displayInfo.basicInfo.each.email': !linksContactShowChanged ? userContext.displayInfo.basicInfo.each.email : linksContactShow,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
      .then((result) => {
        let newUserContext = userContext;
        newUserContext.email = !linksContactChanged ? userContext.email : linksContact;
        newUserContext.displayInfo.basicInfo.each.email = !linksContactShowChanged ? userContext.displayInfo.basicInfo.each.email : linksContactShow;
        setUserContext(newUserContext)
      })

      .then(() => {
        setSubmitting(false)
        toast("Links updated")
      })
      .catch((error) => {
        setSubmitting(false)
        toast("Unable to update links")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="">
        <form onSubmit={handleLinksSubmit}>
          <div className="d-flex flex-column">
            <div className={`w-100 p-4 ${styles.listItem}`}>
              <div className="d-flex flex-column flex-lg-row justify-content-between w-100" style={{ gap: '16px' }}>
                <div className="w-100 w-lg-auto" style={{ minWidth: '160px' }}>
                  <p className="text-dark-high mb-2">Label</p>
                  <input
                    type="text"
                    className="w-100 small"
                    disabled
                    value="Contact me"
                  />
                </div>
                <div className="w-100">
                  <p className="text-dark-high mb-2">Contact email</p>
                  <input
                    type="text"
                    className={linksContactError !== '' ? `error w-100 small` : `w-100 small`}
                    value={linksContactChanged ? linksContact : (userContext.email !== undefined ? userContext.email : '')}
                    onChange={({ target }) => linksContactChange(target.value)}
                  />
                  {linksContactError !== '' ? <p className="small text-error-high mt-2">{linksContactError}</p> : null}
                </div>
              </div>
              <label className="checkbox-container small mt-2 mb-0">Show "contact me" button
                <input
                  type="checkbox"
                  onChange={() => linksContactShowChange()}
                  checked={linksContactShowChanged ? linksContactShow :
                    (
                      userContext &&
                        userContext.displayInfo &&
                        userContext.displayInfo.basicInfo &&
                        userContext.displayInfo.basicInfo.each &&
                        userContext.displayInfo.basicInfo.each.email &&
                        userContext.displayInfo.basicInfo.each.email ? true : false
                    )
                  }
                />
                {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
                <span className="checkmark"></span>
              </label>
            </div>
            {linksList.length > 0 && linksList.map((link, index) =>
              <div key={index} className={`w-100 p-4 ${styles.listItem}`}>
                <div className="d-flex flex-column flex-lg-row justify-content-between w-100" style={{ gap: '16px' }}>
                  <div className="w-100 w-lg-auto" style={{ minWidth: '160px' }}>
                    <p className="text-dark-high mb-2">Label</p>
                    <input
                      type="text"
                      // className={linksContactError !== '' ? `error w-100 small` : `w-100 small`}
                      className="w-100 small"
                      // value={linksContactChanged ? linksContact : (userContext.email !== undefined ? userContext.email : '')}
                      value={link.label}
                      onChange={({ target }) => linksLabelChange(target.value, index)}
                    />
                    {/* {linksContactError !== '' ? <p className="small text-error-high mt-2">{linksContactError}</p> : null} */}
                  </div>
                  <div className="w-100">
                    <p className="text-dark-high mb-2">URL</p>
                    <input
                      type="text"
                      // className={linksContactError !== '' ? `error w-100 small` : `w-100 small`}
                      className="w-100 small"
                      // value={linksContactChanged ? linksContact : (userContext.email !== undefined ? userContext.email : '')}
                      value={link.url}
                      onChange={({ target }) => linksUrlChange(target.value, index)}
                    />
                    {/* {linksContactError !== '' ? <p className="small text-error-high mt-2">{linksContactError}</p> : null} */}
                  </div>
                </div>
              </div>
            )}
          </div>
          <hr className="m-0" />
          <div className="d-flex flex-row justify-content-end p-4" style={{ gap: '12px' }}>
            <button type="button" onClick={handleBack} className="btn dark medium w-100 w-sm-auto" disabled={submitting}>Cancel</button>
            <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Save' : 'Saving...'}</button>
          </div>
        </form>
      </div>

    </>
  )
}

export default EditLinks;