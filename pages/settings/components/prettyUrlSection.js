import { useState, useContext, useEffect } from 'react';
import fire from '../../../config/fire-config';
import ICONS from '../../../components/icon/IconPaths';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import styles from '../settings.module.scss'
import Image from 'next/image'
import { UserContext } from '../../_app';

const PrettyUrlSection = ({ userData }) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [domain, setDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const [notificationRequested, setNotificationRequested] = useState(false);

  useEffect(() => {
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setDomain(user.uid)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const domainChange = (value) => {
    setDomain(value)
  }

  const customDomainChange = (value) => {
    setCustomDomain(value)
  }

  const handleClose = () => {
    setShowModal(false)
  };
  const handleShow = () => setShowModal(true);

  const handleSubmitCustomDomain = () => {
    // Send mixpanel event for PDF Download
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e');
    mixpanel.track("False door", {
      "experiment": "Custom domain",
      "stage": "submit",
    });
    handleShow()
  }

  const handleNotifyMe = () => {
    // make new document in 
    setSendingData(true)
    fire.firestore().collection('falseDoors').doc('customDomain').collection('responses').add({
      userId: userData.uid,
      requestedAt: fire.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        mixpanel.init('61698f9f3799a059e6d59e26bbd0138e');
        mixpanel.track("False door", {
          "experiment": "Custom domain",
          "stage": "notify",
        });
        setSendingData(false)
        setNotificationRequested(true)
      })
      .catch((err) => {
        console.log(err.code, err.message)
        toast(err.message)
      })
  }

  return (
    <div>
      <div className="card mx-auto mb-5">
        <div className="p-4">
          <h5 className="text-dark-high mb-0">Profile URL</h5>
          <p className="text-dark-low mb-0">Manage the URL of your Vitaely profile</p>
        </div>
        <hr className="m-0" />
        <div className="d-flex flex-column m-4" style={{ gap: '16px' }}>
          <div className={`d-flex flex-column radius-3 p-4 w-100 ${styles.planCard} ${styles.active}`}>
            <p className="large text-dark-high mb-0">Vitaely domain</p>
            <p className="text-dark-low mb-0">Domain hosted by Vitaely</p>
            {/* <div>
              <input type="text" className="w-100" value={domain} onChange={({ target }) => domainChange(target.value)} />
              <p className="small text-dark-med mt-2 mb-0">vitaely.me/profile/{domain}</p>
            </div> */}
          </div>
          <div onClick={() => handleSubmitCustomDomain()} className={`d-flex flex-column radius-3 p-4 w-100 ${styles.planCard}`} style={{cursor: 'pointer'}}>
            <p className="large text-dark-high mb-0">Use my own domain</p>
            <p className="text-dark-low mb-0">Display your Vitaely profile on your own domain</p>
            {/* <button type="submit" className="btn primary high">Add domain</button> */}
            {/* <form onSubmit={handleSubmitCustomDomain}>
            <div className="d-flex flex-column flex-md-row" style={{gap: '16px'}}>
              <input type="text" className="w-100" value={customDomain} onChange={({ target }) => customDomainChange(target.value)} />
              <button type="submit" className="btn primary high">Add domain</button>
            </div>
            </form> */}
          </div>
        </div>
        {/* <div className="d-flex flex-column bg-dark-100 radius-3 p-4 m-4">
          <p className="text-dark-low text-dark-high mb-0">You have not added a custom domain yet</p>
        </div> */}
        {/* <hr className="m-0" />
        <div className="m-4">
          <button type="button" onClick={handleShow} className="btn primary high mr-md-3 w-100 w-md-auto">Save</button>
        </div> */}
      </div>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        {!notificationRequested ?
          <Modal.Body>
            <div className="d-flex flex-column align-items-center">
              <div className="bg-primary-200 p-4 radius-5 mb-4" style={{ width: 'fit-content' }}>
                <svg viewBox="0 0 24 24" style={{ width: '64px' }}>
                  <path d={ICONS.BOLT} className="fill-primary-900"></path>
                </svg>
              </div>
              <div className="mx-auto" style={{ maxWidth: '320px' }}>
                <h4 className="text-dark-high text-center mb-3">Wow, you're fast!</h4>
                <p className="text-center mb-4">Unfortunately adding your own custom domain is not quite ready yet</p>
              </div>
              <button type="button" className="btn primary high small w-100 mt-3" disabled={sendingData} onClick={() => handleNotifyMe()}>{!sendingData ? 'Notify me when this is ready' : 'Saving...'}</button>
              <button type="button" className="btn dark low small w-100 mt-3" onClick={handleClose}>No thanks</button>
            </div>
          </Modal.Body>
          :
          <Modal.Body>
            <div className="d-flex flex-column align-items-center">
              <div className="mx-auto">
                <h4 className="text-dark-high text-center mb-3">You're first in line</h4>
                <p className="text-center mb-4">Thanks for letting us know that you're interested. Once the feature is ready to go, you'll be the first to know!</p>
              </div>
              <button type="button" className="btn primary high small w-100 mt-3" onClick={handleClose}>Close</button>
            </div>
          </Modal.Body>
        }
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default PrettyUrlSection