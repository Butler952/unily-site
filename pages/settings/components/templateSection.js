import { useState, useContext } from 'react';
import fire from '../../../config/fire-config';
import ICONS from '../../../components/icon/IconPaths';
import { Modal } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import styles from '../settings.module.scss'
import Image from 'next/image'
import { toast } from 'react-toastify';
import { UserContext } from '../../_app';

const TemplateSection = ({
  userData,
  allUserData
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const [notificationRequested, setNotificationRequested] = useState(false);

  const [templateChanged, setTemplateChanged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [templateSelection, setTemplateSelection] = useState(userContext.template);

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

  let templates = [
    {
      'id': 0,
      'label': 'Original',
      'string': 'original',
      'img': '/images/profile-preview.png',
      'active': 
        templateChanged ? 
        !userContext.template ||
        userContext &&
        userContext.template && 
        userContext.template == 'original'
        :
        allUserData &&
        !allUserData.template ||
        allUserData &&
        allUserData.template && 
        allUserData.template == 'original'
    },
    {
      'id': 1,
      'label': 'Metro',
      'string': 'metro',
      'img': '/images/metro-template.jpeg',
      'active':     
        templateChanged ?    
        userContext &&
        userContext.template && 
        userContext.template == 'metro' 
        :
        allUserData &&
        allUserData.template && 
        allUserData.template == 'metro'
    },
    {
      'id': 2,
      'label': 'Metro Night',
      'string': 'metro_night',
      'img': '/images/metro-night-template.jpeg',
      'active':     
        templateChanged ?    
        userContext &&
        userContext.template && 
        userContext.template == 'metro_night' 
        :
        allUserData &&
        allUserData.template && 
        allUserData.template == 'metro_night'
    },
    {
      'id': 3,
      'label': 'Document',
      'string': 'document',
      'img': '/images/document-template.jpeg',
      'active':     
        templateChanged ?    
        userContext &&
        userContext.template && 
        userContext.template == 'document' 
        :
        allUserData &&
        allUserData.template && 
        allUserData.template == 'document'
    },
  ]

  const changeTemplate = (newTemplate) => {
    setSubmitting(true)
    fire.firestore().collection('users').doc(userData.uid).update({
      template: newTemplate,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.template = newTemplate;
      setUserContext(newUserContext)
    })
    .then(() => {
      setSubmitting(false)
      setTemplateChanged(true)
      toast("Template updated")
    })
    .catch((err) => {
      console.log(err.code, err.message)
      //setNotification(err.message)
      toast(err.message)
    })
  }

  return (
    <div>
      <div className="card mx-auto mb-5">
        <div className="p-4">
          <h5 className="text-dark-high mb-0">Template</h5>
          <p className="text-dark-low mb-0">Change the template for your profile</p>
        </div>
        <hr className="m-0"/>
        <div className="d-flex flex-column m-4" style={{gap: '16px'}}>
        
        {templates.map((template, index) => 
          <div role="button" onClick={() => changeTemplate(template.string)} className={`d-flex flex-column radius-3 p-3 w-100 ${styles.planCard} ${template.active && styles.active}`}>
            <p className="large font-weight-bold text-dark-high">{template.label}</p>
            <div className={styles.imageWrapper}>
              <Image
                src={template.img}
                layout='fill'
                objectFit='cover'
              />
            </div>
          </div>
        )}

          {/* <div className={`d-flex flex-column radius-3 p-3 w-100 ${styles.planCard} ${styles.active}`}>
            <p className="large font-weight-bold text-dark-high">Original</p>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/profile-preview.png"
                layout='fill'
                objectFit='cover'
              />
            </div>
          </div>
          <div className={`d-flex flex-column radius-3 p-3 w-100 ${styles.planCard}`}>
            <p className="large font-weight-bold text-dark-high">Document</p>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/document-template.jpeg"
                layout='fill'
                objectFit='cover'
              />
            </div>
          </div> */}
          {/* <div className={`d-flex align-items-center justify-content-center radius-3 p-3 w-100 ${styles.planCard}`}>
            <button type="button" onClick={() => handleClick()} className="btn primary medium w-100 w-md-auto">Browse more</button>
          </div> */}
        </div>
        <hr className="m-0"/>
        <div className="m-4">
          <button type="button" onClick={() => handleClick()} className="btn primary medium w-100 w-md-auto">Browse more</button>
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

export default TemplateSection