import { useState, useContext, useEffect } from 'react';
import fire from '../../../config/fire-config';
import ICONS from '../../../components/icon/IconPaths';
import { Modal } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import styles from '../settings.module.scss'
import Image from 'next/image'
import { UserContext } from '../../_app';
import { toast } from 'react-toastify';
import UpgradeButton from './upgradeButton';

const PrettyUrlSection = ({
  userData,
  allUserData,
  product,
  active,
  status,
  handleUpgrade
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [domain, setDomain] = useState('');
  const [domainChanged, setDomainChanged] = useState('');
  const [domainError, setDomainError] = useState('');
  const [defaultDomain, setDefaultDomain] = useState('');
  const [selectedDomainType, setSelectedDomainType] = useState();
  const [selectedDomainTypeChanged, setSelectedDomainTypeChanged] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const [notificationRequested, setNotificationRequested] = useState(false);
  const [saving, setSaving] = useState('');
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  const handleUpsellClose = () => setShowUpsellModal(false);
  const handleUpsellShow = () => setShowUpsellModal(true);

  let domainType = 'personalised'
  
  // (
  //   selectedDomainTypeChanged ? selectedDomainType : (
  //     userContext &&
  //       userContext.profileUrl &&
  //       userContext.profileUrl.includes("profile") ?
  //       'standard' :
  //       'personalised'
  //   )
  // )

  // value={domainChanged ? domain : 
  //   (
  //     userContext && 
  //     userContext.profileUrl &&
  //     userContext.profileUrl.includes("profile") ? 
  //     userContext && 
  //     userContext.profileUrl.split('/profile/')[1]
  //   : 
  //     userContext && 
  //     userContext.profileUrl &&
  //     userContext.profileUrl.substring(1)
  //   )
  // }

  useEffect(() => {
    setDomain(
      userContext &&
      userContext.profileUrl &&
      userContext.profileUrl
      // userContext.profileUrl.includes("profile") ?
      // (userContext.profileUrl.split('/profile/')[1]) :
      // userContext.profileUrl
    )
    // setSelectedDomainType(
    //   userContext &&
    //     userContext.profileUrl &&
    //     userContext.profileUrl.includes("profile") ? 'standard' : 'personalised');
    // setSelectedDomainType(userContext && userContext.profileUrl && userContext.profileUrl.includes("profile") ? 'standard' : 'personalised');
    // need to ge the domain from the profileUrl itself as it could be different from the uid
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setDefaultDomain(user.uid)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const domainChange = (value) => {
    setDomain(value)
    setDomainChanged(true)
    setDomainError('')
  }

  const setSelectedDomainTypeChange = (value) => {
    setSelectedDomainType(value)
    setSelectedDomainTypeChanged(true)
    if (value == 'standard') {
      setDomainError('')
    }
  }

  const customDomainChange = (value) => {
    setCustomDomain(value)
  }

  let matchingUrls = []

  const handleSave = (e) => {
    e.preventDefault();

    if (selectedDomainType == 'personalised') {
      if (domainChanged && domain === '') {
        setDomainError('Domain cannot be empty')
        return null;
      } else {

        if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
          setSaving(true)

          fire.firestore()
            .collection('users')
            .where("profileUrl", "==", `/${domain}`)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                matchingUrls = [...matchingUrls, doc.id];
              })
            })
            .then(() => {
              if ((matchingUrls && matchingUrls).length > 0) {
                setSaving(false)
                setDomainError('This URL is not available 😔')
              } else {
                fire.firestore().collection('users').doc(userData.uid).update({
                  'profileUrl': `/${domain}`,
                  lastUpdated: fire.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                  fire.firestore()
                  .collection('redirects')
                  .doc(userData.uid)
                  .set({ 
                    'source': `/profile/${defaultDomain}`, 
                    'destination': `/${domain}`,
                    'permanent': true
                  })
                  .catch((err) => {
                    toast(err.message)
                  })
                })
                .then(() => {
                  let newUserContext = userContext;
                  newUserContext.profileUrl = `/${domain}`;
                  setUserContext(newUserContext)
                })
                .then(() => {
                  setSaving(false)
                  toast('Profile URL updated')
                })
                .catch((err) => {
                  // console.log(err.code, err.message)
                  toast(err.message)
                })
              }
            })
        } else {
          handleUpsellShow()
        }
      }
    }
    if (selectedDomainType == 'standard') {
      setSaving(true)

      fire.firestore().collection('users').doc(userData.uid).update({
        'profileUrl': `/profile/${defaultDomain}`,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
        .then(() => {
          fire.firestore()
          .collection('redirects')
          .doc(userData.uid)
          .delete()
          .catch((err) => {
            toast(err.message)
          })
        })
        .then(() => {
          let newUserContext = userContext;
          newUserContext.profileUrl = `/profile/${defaultDomain}`;
          setUserContext(newUserContext)
        })
        .then(() => {
          setSaving(false)
          toast('Profile URL updated')
        })
        .catch((err) => {
          // console.log(err.code, err.message)
          toast(err.message)
        })
    }
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
          <p className="text-dark-low mb-0">Manage the URL of your ExpertPage profile</p>
        </div>
        <hr className="m-0" />
        <div className="d-flex flex-column m-4" style={{ gap: '16px' }}>
          <div role="button" onClick={() => { setSelectedDomainTypeChange('personalised') }} className={`d-flex flex-column radius-3 p-4 w-100 ${styles.planCard} ${domainType == 'personalised' ? styles.active : null}`}>
            <p className="large text-dark-high mb-0">Personalised</p>
            <p className="text-dark-low mb-0">Choose a custom URL on the expertpage.io domain</p>
            <div className="mt-3">
              <input
                type="text"
                className={`small w-100 ${domainError !== '' ? 'error' : null}`}
                disabled={saving}
                value={domainChanged ? domain : 
                  (
                    userContext &&
                      userContext.profileUrl &&
                      userContext.profileUrl.includes("profile") ?
                      userContext &&
                      userContext.profileUrl.split('/profile/')[1]
                      :
                      userContext &&
                      userContext.profileUrl &&
                      userContext.profileUrl.substring(1)
                  )
                }
                onChange={({ target }) => domainChange(target.value)}
              />
              <p className="small text-dark-med mt-2 mb-0">expertpage.io/
                {domainChanged ? domain :
                  (
                    userContext &&
                      userContext.profileUrl &&
                      userContext.profileUrl.includes("profile") ?
                      userContext &&
                      userContext.profileUrl.split('/profile/')[1]
                      :
                      userContext &&
                      userContext.profileUrl &&
                      userContext.profileUrl.substring(1)
                  )
                }
              </p>
              {domainError !== '' ? <p className="small text-error-high mt-2 mb-0">{domainError}</p> : null}
            </div>

          </div>
          <div onClick={() => handleSubmitCustomDomain()} className={`d-flex flex-column radius-3 p-4 w-100 ${styles.planCard}`} style={{ cursor: 'pointer' }}>
            <p className="large text-dark-high mb-0">Use my own domain</p>
            <p className="text-dark-low mb-0">Display your ExpertPage profile on your own domain</p>
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
        <hr className="m-0" />
        <div className="m-4">
          <button type="button" onClick={handleSave} className="btn primary high w-100 w-md-auto" disabled={saving}>{!saving ? 'Save' : 'Saving'}</button>

        </div>
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
                <h4 className="text-dark-high text-center mb-2">Wow, you're fast!</h4>
                <p className="text-center mb-4">Unfortunately adding your own domain is not quite ready yet</p>
              </div>
              <button type="button" className="btn primary high small w-100 mt-3" disabled={sendingData} onClick={() => handleNotifyMe()}>{!sendingData ? 'Notify me when this is ready' : 'Saving...'}</button>
              <button type="button" className="btn dark low small w-100 mt-3" onClick={handleClose}>No thanks</button>
            </div>
          </Modal.Body>
          :
          <Modal.Body>
            <div className="d-flex flex-column align-items-center">
              <div className="mx-auto">
                <h4 className="text-dark-high text-center mb-2">You're first in line</h4>
                <p className="text-center mb-4">Thanks for letting us know that you're interested. Once the feature is ready to go, you'll be the first to know!</p>
              </div>
              <button type="button" onClick={handleSave} className="btn primary high small w-100 mt-3">Close</button>
            </div>
          </Modal.Body>
        }
      </Modal>
      <Modal 
        show={showUpsellModal} 
        onHide={handleUpsellClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div>
            <h4 className="text-dark-high text-center mb-2">Make your profile your own</h4>
            <p className="text-center mb-4">Upgrade to Premium to customise your profile URL</p>
            <div className={`${styles.planCard} ${styles.active} radius-3 p-4 w-100 w-md-50 `}>
              <h5 className="text-primary-high mb-1">Premium</h5>
              <div className="d-flex align-items-end mb-4">
                <h4 className="text-dark-high mr-1 mb-0">$3</h4>
                <p className="text-dark-high mb-0">/month</p>
              </div>
              {[
                'All Basic features', 
                'Custom URL on expertpage.io domain', 
                'Logos for experience and education',
                'Unlimited re-syncing', 
                'More coming soon'
              ].map((feature, index) =>
                <div key={index} className="d-flex mt-2">
                  <svg viewBox="0 0 24 24" width={'24px'} className="mr-2 fill-dark-900" style={{minWidth: '24px'}}>
                    <path d={ICONS.CHECK}></path>
                  </svg>
                  <p className="text-dark-high font-weight-medium mb-0">{feature}</p>
                </div>
              )}
              <UpgradeButton handleUpgrade={handleUpgrade} />
            </div>
            <button type="button" className="btn dark low small w-100 mt-3" onClick={handleUpsellClose}>Not right now</button>
            {/*<div className="d-flex align-items-center jusify-content-start flex-column flex-md-row">
              <button type="button" className="btn primary high w-100 w-md-auto" onClick={handleUpdate}>Upgrade</button>
              <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleClose}>Close</button>
            </div>*/}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PrettyUrlSection