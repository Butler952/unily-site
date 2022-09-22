import { useState } from 'react';
import fire from '../../../config/fire-config';
import ICONS from '../../../components/icon/IconPaths';
import { Modal } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import styles from '../settings.module.scss'
import Image from 'next/image'
import { toast } from 'react-toastify';

const CustomDomainSection = ({userData}) => {
  const [domain, setDomain] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const [notificationRequested, setNotificationRequested] = useState(false);

  const domainChange = (value) => {
    setDomain(value)
  }

  const handleClose = () => {
    setShowModal(false)
  };
  const handleShow = () => setShowModal(true);

  const handleClick = () => {
    // Send mixpanel event for PDF Download
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
    mixpanel.track("False door", {
      "experiment": "Templates",
      "stage": "click",
    });
    handleShow()
  }

  const handleNotifyMe = () => {
    // make new document in 
    setSendingData(true)
      fire.firestore().collection('falseDoors').doc('templates').collection('responses').add({
        userId: userData.uid,
        requestedAt: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
        mixpanel.track("False door", {
          "experiment": "Templates",
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
          <h5 className="text-dark-high mb-0">Custom domain</h5>
          <p className="text-dark-low mb-0">Show your profile on a custom domain</p>
        </div>
        <hr className="m-0"/>
        <div className="m-4">
          <div>
            <input type="text" className="w-100" value={domain} placeholder="mywebsite.com" onChange={({target}) => domainChange(target.value)} />
          </div>
        </div>
        {/* <div className="d-flex flex-column bg-dark-100 radius-3 p-4 m-4">
          <p className="text-dark-low text-dark-high mb-0">You have not added a custom domain yet</p>
        </div> */}
        <hr className="m-0"/>
        <div className="m-4">
          <button type="button" onClick={handleShow} className="btn primary high mr-md-3 w-100 w-md-auto">Add custom domain</button>
          {/* {syncError !== '' ? <p className="small text-error-high mt-2">{syncError}</p> : null} */}
        </div>
      </div>
      <Modal 
        show={showModal} 
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        { !notificationRequested ?
          <Modal.Body>
            <div className="d-flex flex-column align-items-center">
              <div className="bg-primary-200 p-4 radius-5 mb-4" style={{width: 'fit-content'}}>
                <svg viewBox="0 0 24 24" style={{width: '64px'}}>
                  <path d={ICONS.BOLT} className="fill-primary-900"></path>
                </svg>
              </div>
              <div className="mx-auto" style={{maxWidth: '320px'}}>
                <h4 className="text-dark-high text-center mb-3">Wow, you're fast!</h4>
                <p className="text-center mb-4">Unfortunately our new templates are not quite ready yet</p>
              </div>
              <button type="button" className="btn primary high small w-100 mt-3" disabled={sendingData} onClick={() => handleNotifyMe()}>{ !sendingData ? 'Notify me when this is ready' : 'Saving...'}</button>
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
    </div>
  )
}

export default CustomDomainSection