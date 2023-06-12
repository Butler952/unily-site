import { useState, useContext, useEffect } from 'react';
import fire from '../../../config/fire-config';
import ICONS from '../../../components/icon/IconPaths';
import { Modal } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import styles from '../settings.module.scss'
import Image from 'next/image'
import { UserContext } from '../../_app';
import { toast } from 'react-toastify';
import UpgradeButton from './upgradeButton';

const CustomDomain = ({
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
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
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
    // setDomain(
    //   userContext &&
    //   userContext.profileUrl &&
    //   userContext.profileUrl
    //   // userContext.profileUrl.includes("profile") ?
    //   // (userContext.profileUrl.split('/profile/')[1]) :
    //   // userContext.profileUrl
    // )
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

  const handleCloseAddDomain = () => {
    setShowAddDomainModal(false)
  };
  const handleShowAddDomain = () => setShowAddDomainModal(true);

  const handleSubmitCustomDomain = () => {
    // Send mixpanel event for PDF Download
    mixpanel.init(mixpanelConfig);
    mixpanel.track("False door", {
      "experiment": "Custom domain",
      "stage": "submit",
    });
    handleShowAddDomain()
  }

  const handleNotifyMe = () => {
    // make new document in 
    setSendingData(true)
    fire.firestore().collection('falseDoors').doc('customDomain').collection('responses').add({
      userId: userData.uid,
      requestedAt: fire.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        mixpanel.init(mixpanelConfig);
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

  // const AddDomain = () => {
  //   fetch(`/api/add-domain?domain=www.bbc.com&userId=${userId}`)
  //     .then(result => console.log(result))
  //     .catch((error) => {
  //       console.log('error', error)
  //     });
  // }

  const handleAddDomain = (e) => {
    e.preventDefault();

    setSaving(true);

    // need more sound logic here
    // maybe strip http:// too
    if (domain === '') {
      setDomainError('Please enter a valid domain')
      setSaving(false)
    } else {

      fetch(`/api/add-domain?domain=${domain}&userId=${userData.uid}`)
        .then(result => console.log(result))
        .then(() => {
        })
        .then(() => {
          setSaving(false)
          handleCloseAddDomain()
          // Toast confirmation
          toast("Domain added")
        })
        .catch((error) => {
          console.log('error', error)
        });
    }
  }

  return (
    <div>
      <div className="card mx-auto">
        <div className="d-flex flex-column m-4" style={{ gap: '16px' }}>
          <div className="d-flex flex-column w-100 gap-4">
            <div className="d-flex flex-column gap-0">
              <h5 className="mb-1">Connect my own domain</h5>
              <p className="text-dark-low mb-0">Choose a custom URL on the expertpage.io domain</p>
            </div>
            <div>
              <button type="button" onClick={handleShowAddDomain} className="btn primary medium small w-100 w-md-auto">Add domain</button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showAddDomainModal}
        onHide={handleCloseAddDomain}
        keyboard={false}
      >
        <Modal.Header>
          <h4 className="mb-0">Add custom domain</h4>
          <button onClick={handleCloseAddDomain} className="btn dark medium icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header>

        <hr className="w-100 m-0" />
        <Modal.Body>
        <form onSubmit={handleAddDomain}>
          <div className="d-flex flex-column w-100 gap-4">
            <div>
              <input type="text" className={domainError !== '' ? `error w-100` : `w-100`} value={domain} onChange={({ target }) => domainChange(target.value)} placeholder="mywebsite.com" />
              <p className="small text-dark-med mt-2 mb-0">Your Expertpage profile will appear on this domain.</p>
              {domainError !== '' && <p className="small text-error-high mt-2 mb-0">{domainError}</p> }
            </div>
            <div className="d-flex flex-column mt-3 gap-3">
              <div className="d-flex flex-column flex-sm-row align-items-start justify-content-between gap-3">
                <button type="submit" className="btn primary high w-100 w-sm-auto order-0 order-sm-1" disabled={saving}>{!saving ? 'Connect domain' : 'Saving'}</button>
                {/* <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleCloseAddDomain}>Cancel</button> */}
              </div>
            </div>
          </div>
        </form>
        </Modal.Body>
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
              <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleCloseAddDomain}>Close</button>
            </div>*/}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CustomDomain