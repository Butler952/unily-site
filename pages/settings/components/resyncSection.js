import { useState, useContext } from 'react';
import fire from '../../../config/fire-config';
import { useRouter } from 'next/router'
import ICONS from '../../../components/icon/IconPaths';

// import styles from './settings.module.scss'
import { toast } from 'react-toastify';
import styles from '../settings.module.scss'
import { ProgressBar, Modal } from 'react-bootstrap';
import UpgradeButton from './upgradeButton';
import { UserContext } from '../../_app';

const ResyncSection = ({
    linkedinId, 
    userData,
    loggedInRoute,
    product,
    active,
    status,
    handleUpdate,
    handleUpgrade
  }) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const router = useRouter();
  const [syncingState, setSyncingState] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  const [syncError, setSyncError] = useState('');
  const [showModal, setShowModal] = useState(false);

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

  // Re-syncing Start

    const createExperienceList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'title': object.title,
      'company': object.company
    })
    )
  }

  const createEducationList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'name': object.field_of_study,
      'school': object.school
    })
    )
  }

  const createVolunteerList = (data) => {
    return data.map((object, i) =>
    ({
      'display': true,
      'title': object.title,
      'company': object.company
    })
    )
  }

  const handleResyncSubmit = (e) => {
    e.preventDefault();
    if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
      setSyncingState('Fetching data from LinkedIn');
      fetch("/api/linkedin?profileUrl=" + "https://www.linkedin.com/in/" + linkedinId)
        .then(res => res.json())
        .then((result) => {
          setSyncingState('Storing your data');
          fire.firestore().collection('users').doc(userData.uid).update({
            profile: result,
            displayInfo: {
              'basicInfo': {
                'section': true,
                'each': {
                  'profilePic': true,
                  'headerImage': true,
                  'name': true,
                  'headline': true,
                  'email': true
                }
              },
              about: result.summary === null ? false : true,
              'experience': {
                'section': result.experiences < 1 ? false : true,
                'each': createExperienceList(result.experiences)
              },
              'education': {
                'section': result.education < 1 ? false : true,
                'each': createEducationList(result.education)
              },
              'volunteering': {
                'section': result.volunteer_work < 1 ? false : true,
                'each': createVolunteerList(result.volunteer_work)
              },
            },
            //syncsRemaining: (syncsRemaining - 1), 
            lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
            lastSync: fire.firestore.FieldValue.serverTimestamp(),
          })
          return result;
        })
        .then((result) => {
          let newUserContext = userContext;
          newUserContext.profile = result;
          newUserContext.displayInfo = {
            'basicInfo': {
              'section': true,
              'each': {
                'profilePic': true,
                'headerImage': true,
                'name': true,
                'headline': true,
                'email': true
              }
            },
            about: result.summary === null ? false : true,
            'experience': {
              'section': result.experiences < 1 ? false : true,
              'each': createExperienceList(result.experiences)
            },
            'education': {
              'section': result.education < 1 ? false : true,
              'each': createEducationList(result.education)
            },
            'volunteering': {
              'section': result.volunteer_work < 1 ? false : true,
              'each': createVolunteerList(result.volunteer_work)
            },
          }
          setUserContext(newUserContext)
        })
        .then(() => {
          setSyncingState('Sync successfully completed')
        })
        .then(() => {
          setShowModal(false)
        })
        .then(() => {
          toast("Sync completed")
        })
        .then(() => {
          setSyncingState('')
        })
        .then(() => {
          loggedInRoute(userData)
        })
        .catch((error) => {
          console.log('error', error)
        });
    } else {
      setSyncError('You have no syncs remaining')
    }
  }
  // Re-syncing End

  return (
    <div>
      <div className="card mx-auto mb-5">
        <div className="p-4">
          <h5 className="text-dark-high mb-0">Re-sync</h5>
          <p className="text-dark-low mb-0">Re-syncing will pull the latest content from your LinkedIn profile</p>
        </div>
        <hr className="m-0"/>
        <div className="m-4">
          {/*<div className="bg-error-100 radius-3 p-4">
            <p className="text-error-high">Warning</p>
            <p className="text-dark-high m-0">Re-syncing your data will overwrite any changes you have made in the Sections settings above.</p>
          </div>*/}
          <div className="d-flex flex-column bg-primary-100 radius-3 p-4">
            <p className="text-dark-high">Make sure that your LinkedIn profile's public visibility settings include all the data that you want to sync into Vitaely.</p>
            <a href="https://www.linkedin.com/public-profile/settings" target="_blank">
              <div className="d-flex align-items-start">
                <svg viewBox="0 0 24 24" width={'24px'} style={{minWidth: '24px'}} className="mr-2 fill-primary-900">
                  <path d={ICONS.EXTERNAL_LINK}></path>
                </svg>
                {/*<a href="https://www.linkedin.com/public-profile/settings" className="text-primary-high">Manage your LinkedIn profile's visibility</a>*/}
                <p className="text-primary-high mb-0">Manage your LinkedIn profile's visibility</p>
              </div>
            </a>
          </div>
        </div>
        <hr className="m-0"/>
        <div className="m-4">
        <button type="button" onClick={handleShow} className="btn primary high mr-md-3 w-100 w-md-auto">Re-sync from Linkedin</button>
          {/* {syncError !== '' ? <p className="small text-error-high mt-2">{syncError}</p> : null} */}
        </div>
        {/*<div className="m-4">
          <p className="large text-dark-high">{syncingState === '' ? ( syncsRemaining > 0 ? ( syncsRemaining === 1 ? syncsRemaining + " re-sync remaining" : syncsRemaining + " re-syncs remaining" )  : "No re-syncs remaining") : syncingState}</p>
          <ProgressBar now={ syncsRemaining > 0 ? ( syncsRemaining === 1 ? 10 : 100 ) : 0 } />
          <div className="d-flex mt-4 flex-column flex-md-row">
            <button type="button" onClick={handleResyncSubmit} className="btn primary high mr-md-3 w-100 w-md-auto" disabled={ syncingState !== '' ? true : ( syncsRemaining === 0 ? true : false )}>{syncingState === '' ? "Re-sync from Linkedin" : syncingState}</button>
            <a href="#plan" className="btn primary medium mt-3 mt-md-0 w-100 w-md-auto">Get unlimited re-syncing</a>
          </div>
          {syncError !== '' ? <p className="small text-error-high mt-2">{syncError}</p> : null}
        </div>*/}
      </div>
      <Modal 
        show={showModal} 
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >{product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active' ? 
        <>
          {/*<Modal.Header closeButton>
            <h5 className="text-dark-high mb-0">Re-sync data</h5>
          </Modal.Header>*/}
          <Modal.Body>

              {/*<div className="m-4">
                <p className="large text-dark-high">{syncingState === '' ? ( syncsRemaining > 0 ? ( syncsRemaining === 1 ? syncsRemaining + " re-sync remaining" : syncsRemaining + " re-syncs remaining" )  : "No re-syncs remaining") : syncingState}</p>
                <ProgressBar now={ syncsRemaining > 0 ? ( syncsRemaining === 1 ? 10 : 100 ) : 0 } />
                <div className="d-flex mt-4 flex-column flex-md-row">
                  <button type="button" onClick={handleResyncSubmit} className="btn primary high mr-md-3 w-100 w-md-auto" disabled={ syncingState !== '' ? true : ( syncsRemaining === 0 ? true : false )}>{syncingState === '' ? "Re-sync from Linkedin" : syncingState}</button>
                  <a href="#plan" className="btn primary medium mt-3 mt-md-0 w-100 w-md-auto">Get unlimited re-syncing</a>
                </div>
                {syncError !== '' ? <p className="small text-error-high mt-2">{syncError}</p> : null}
              </div>*/}

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
                'Logos for experience and education', 
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
      }
      </Modal>
    </div>
  )
}

export default ResyncSection