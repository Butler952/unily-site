import { useState } from 'react';
import fire from '../../../config/fire-config';
import { useRouter } from 'next/router'
import ICONS from '../../../components/icon/IconPaths';

// import styles from './settings.module.scss'
import { toast } from 'react-toastify';
import styles from '../settings.module.scss'
import { ProgressBar, Modal } from 'react-bootstrap';
import UpgradeButton from './upgradeButton';

const LogosSection = ({
    linkedinId, 
    userData,
    loggedInRoute,
    product,
    active,
    status,
    handleUpdate,
    handleUpgrade,
    sectionsLoading,
    sideProjectsLogos,
    setSideProjectsLogos,
    experienceLogos,
    setExperienceLogos,
    educationLogos,
    setEducationLogos,
    volunteeringLogos,
    setVolunteeringLogos,
  }) => {
  const router = useRouter();
  const [syncingState, setSyncingState] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  const [syncError, setSyncError] = useState('');
  const [showModal, setShowModal] = useState(false);
  // const [experienceLogos, setExperienceLogos] = useState(false);
  // const [educationLogos, setEducationLogos] = useState(false);
  const [savingLogos, setSavingLogos] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  {/*useEffect(() => {
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          loggedInRoute(user)
          setUserData(user)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);*/}

   // Handle Logos Display Options Start

  const toggleSideProjects = (e) => {
    if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
      setSideProjectsLogos(e)
    } else {
      handleShow()
    }
  }

  const toggleExperience = (e) => {
    if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
      setExperienceLogos(e)
    } else {
      handleShow()
    }
  }

  const toggleEducation = (e) => {
    if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
      // setEducationLogos(e.currentTarget.checked)
      setEducationLogos(e)
    } else {
      handleShow()
    }
  }

  const toggleVolunteering = (e) => {
    if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
      setVolunteeringLogos(e)
    } else {
      handleShow()
    }
  }

  const handleLogosSubmit = (e) => {
    e.preventDefault();
    if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
      setSavingLogos(true)
      fire.firestore().collection('users').doc(userData.uid).update({
        logoVisibility: {
          'sideProjects': sideProjectsLogos,
          'experience': experienceLogos,
          'education': educationLogos,
          'volunteering': volunteeringLogos,
        },
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        setSavingLogos(false)
        toast("Logos visibility updated")
      })
      .catch((err) => {
        console.log(err.code, err.message)
        //setNotification(err.message)
        toast(err.message)
      })
    } else {
      handleShow()
    }
  }

  // Handle Logos Display Options End

  return (
    <div>
      <div className="card mx-auto mb-5">
        <div className="p-4">
          <h5 className="text-dark-high mb-0">Logos</h5>
          <p className="text-dark-low mb-0">Show or hide the logos for sections on the profile</p>
        </div>
        <hr className="m-0"/>
        {sectionsLoading ?
          <div className="p-4">
            <p className="mb-0">Loading...</p>
          </div>
          :
          <div className="p-0">
            <form onSubmit={handleLogosSubmit}>
              <div className={styles.sectionCard + " card p-4"}>
                <label className="checkbox-container font-weight-medium text-dark-high large">
                  Side projects
                <input type="checkbox" checked={sideProjectsLogos} onChange={(e) => toggleSideProjects(e.currentTarget.checked)} />
                  <span className="checkmark"></span>
                </label>
              </div>
              <div className={styles.sectionCard + " card p-4"}>
                <label className="checkbox-container font-weight-medium text-dark-high large">
                  Experience
                <input type="checkbox" checked={experienceLogos} onChange={(e) => toggleExperience(e.currentTarget.checked)} />
                  <span className="checkmark"></span>
                </label>
              </div>
              <div className={styles.sectionCard + " card p-4"}>
                <label className="checkbox-container font-weight-medium text-dark-high large">
                  Education
                <input type="checkbox" checked={educationLogos} onChange={(e) => toggleEducation(e.currentTarget.checked)} /* onClick={(e) => toggleEducation(e)} */ /* onChange={(e) => setEducationLogos(e.currentTarget.checked)} */ />
                  <span className="checkmark"></span>
                </label>
              </div>
              <div className={styles.sectionCard + " card p-4"}>
                <label className="checkbox-container font-weight-medium text-dark-high large">
                  Volunteering
                <input type="checkbox" checked={volunteeringLogos} onChange={(e) => toggleVolunteering(e.currentTarget.checked)} /* onClick={(e) => toggleVolunteering(e)} */ /* onChange={(e) => setVolunteeringLogos(e.currentTarget.checked)} */ />
                  <span className="checkmark"></span>
                </label>
              </div>
              <div className="m-4">
                <button type="submit" className="btn primary high w-100 w-md-auto" disabled={savingLogos}>{!savingLogos ? 'Save' : 'Saving'}</button>
              </div>
            </form>
          </div>
        }
      </div>
      {/* <div className="card mx-auto mb-5">
        <div className="p-4">
          <h5 className="text-dark-high mb-0">Re-sync</h5>
          <p className="text-dark-low mb-0">Re-syncing will pull the latest content from your LinkedIn profile</p>
        </div>
        <hr className="m-0"/>
        <div className="m-4">
          <div className="d-flex flex-column bg-primary-100 radius-3 p-4">
            <p className="text-dark-high">Make sure that your LinkedIn profile's public visibility settings include all the data that you want to sync into Vitaely.</p>
            <a href="https://www.linkedin.com/public-profile/settings">
              <div className="d-flex align-items-start">
                <svg viewBox="0 0 24 24" width={'24px'} style={{minWidth: '24px'}} className="mr-2 fill-primary-900">
                  <path d={ICONS.EXTERNAL_LINK}></path>
                </svg>
                <p className="text-primary-high mb-0">Manage your LinkedIn profile's visibility</p>
              </div>
            </a>
          </div>
        </div>
        <hr className="m-0"/>
        <div className="m-4">
        <button type="button" onClick={handleShow} className="btn primary high mr-md-3 w-100 w-md-auto">Re-sync from Linkedin</button>
        </div>
      </div> */}
      <Modal 
        show={showModal} 
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div>
            <h4 className="text-dark-high text-center mb-3">Stand out from the crowd</h4>
            <p className="text-center mb-4">Upgrade to Premium to add logos to your profile</p>
            <div className={`${styles.planCard} ${styles.active} radius-3 p-4 w-100 w-md-50 `}>
              <h5 className="text-primary-high mb-1">Premium</h5>
              <div className="d-flex align-items-end mb-4">
                <h4 className="text-dark-high mr-1 mb-0">$3</h4>
                <p className="text-dark-high mb-0">/month</p>
              </div>
              {[
                'All Basic features', 
                'Logos for experience, edication and more',
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
            <button type="button" className="btn dark low small w-100 mt-3" onClick={handleClose}>Not right now</button>
            {/*<div className="d-flex align-items-center jusify-content-start flex-column flex-md-row">
              <button type="button" className="btn primary high w-100 w-md-auto" onClick={handleUpdate}>Upgrade</button>
              <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleClose}>Close</button>
            </div>*/}
          </div>
        </Modal.Body>
      </Modal>

      {/* <Modal 
        show={showModal} 
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >{product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active' ? 
        <>
          <Modal.Body>


            {syncingState === '' ?
              <div>
                <p className="large text-dark-high">Re-syncing your data will overwrite any changes you have made in the <b>Sections</b> settings.</p>
                <br />
                <div className="d-flex align-items-center justify-content-end flex-column flex-md-row">
                  <button type="button" className="btn dark medium w-100 w-md-auto order-1 order-md-0" onClick={handleClose}>Cancel</button>
                  <button type="button" className="btn primary high w-100 w-md-auto ml-0 ml-md-3 mb-3 mb-md-0 order-0 order-md-1" onClick={handleResyncSubmit}>Start re-sync</button>
                </div>
              </div>
              :
              <div>
                <p className="large text-dark-high">{syncingState}</p>
                {<ProgressBar animated now={syncingState === 'Fetching data from LinkedIn' ? 10 : (syncingState === 'Storing your data' ? 60 : (syncingState === 'Sync successfully completed' ? 100 : null))} /> }
              </div>
            }
          </Modal.Body>
        </>
        :
        <Modal.Body>
          <div>
            <h4 className="text-dark-high text-center mb-3">You’re out of re-syncs</h4>
            <p className="text-center mb-4">Upgrade to Premium to get unlimited re-syncs</p>
            <div className={`${styles.planCard} ${styles.active} radius-3 p-4 w-100 w-md-50 `}>
              <h5 className="text-primary-high mb-1">Premium</h5>
              <div className="d-flex align-items-end mb-4">
                <h4 className="text-dark-high mr-1 mb-0">$3</h4>
                <p className="text-dark-high mb-0">/month</p>
              </div>
              {[
                'All Basic features', 
                'Unlimited re-syncing', 
                'More coming soon'
              ].map((feature, index) =>
                <div key={index} className="d-flex mt-2">
                  <svg viewBox="0 0 24 24" width={'24px'} className="mr-2 fill-dark-900">
                    <path d={ICONS.CHECK}></path>
                  </svg>
                  <p className="text-dark-high font-weight-medium mb-0">{feature}</p>
                </div>
              )}
              <UpgradeButton handleUpgrade={handleUpgrade} />
            </div>
            <button type="button" className="btn dark low small w-100 mt-3" onClick={handleClose}>Not right now</button>
          </div>
        </Modal.Body>
      }
      </Modal> */}
    </div>
  )
}

export default LogosSection