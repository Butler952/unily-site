import { useState, useContext, useEffect, forwardRef } from 'react';
import fire from '../../../config/fire-config';
import ICONS from '../../../components/icon/IconPaths';
import { Dropdown, Modal } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import styles from '../settings.module.scss'
import Image from 'next/image'
import { UserContext } from '../../_app';
import { toast } from 'react-toastify';
import UpgradeButton from './upgradeButton';
import Icon from 'components/icon/Icon';

const CustomDomain = ({
  userData,
  allUserData,
  loggedInRoute,
  customDomain,
  gettingDomainInfo,
  setDomainStatus,
  setGettingDomainInfo,
  sectionsLoading,
  product,
  active,
  status,
  handleUpgrade
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [newDomain, setNewDomain] = useState('');
  const [newDomainChanged, setNewDomainChanged] = useState('');
  const [newDomainError, setNewDomainError] = useState('');

  // const [domainInfo, setDomainInfo] = useState('');
  // const [domainStatus, setDomainStatus] = useState('');
  // const [gettingDomainInfo, setGettingDomainInfo] = useState('');

  const [defaultDomain, setDefaultDomain] = useState('');
  const [selectedDomainType, setSelectedDomainType] = useState();
  const [selectedDomainTypeChanged, setSelectedDomainTypeChanged] = useState(false);
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [showRemoveDomainModal, setShowRemoveDomainModal] = useState(false);
  const [removingDomain, setRemovingDomain] = useState(false);
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
    // handleGetDomain(userContext.customDomain)
    // setNewDomain(
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

    const unsubscribe = fire.auth().onAuthStateChanged((user) => {
        if (user) {
          setDefaultDomain(user.uid)
          // Get the domain from the user document
          // Feed that domain to GetDomain
          // GetDomain has to set the domain info 
          // handleGetDomain(userContext.customDomain ? userContext?.customDomain : customDomain)
          // console.log('handleGetDomain triggered')

        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const domainChange = (value) => {
    setNewDomain(value)
    setNewDomainChanged(true)
    setNewDomainError('')
  }

  const setSelectedDomainTypeChange = (value) => {
    setSelectedDomainType(value)
    setSelectedDomainTypeChanged(true)
    if (value == 'standard') {
      setNewDomainError('')
    }
  }

  // const customDomainChange = (value) => {
  //   setCustomDomain(value)
  // }

  let matchingUrls = []

  // const handleSave = (e) => {
  //   e.preventDefault();

  //   if (selectedDomainType == 'personalised') {
  //     if (domainChanged && domain === '') {
  //       setNewDomainError('Domain cannot be empty')
  //       return null;
  //     } else {

  //       if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
  //         setSaving(true)

  //         fire.firestore()
  //           .collection('users')
  //           .where("profileUrl", "==", `/${domain}`)
  //           .get()
  //           .then((querySnapshot) => {
  //             querySnapshot.forEach((doc) => {
  //               matchingUrls = [...matchingUrls, doc.id];
  //             })
  //           })
  //           .then(() => {
  //             if ((matchingUrls && matchingUrls).length > 0) {
  //               setSaving(false)
  //               setNewDomainError('This URL is not available 😔')
  //             } else {
  //               fire.firestore().collection('users').doc(userData.uid).update({
  //                 'profileUrl': `/${domain}`,
  //                 lastUpdated: fire.firestore.FieldValue.serverTimestamp()
  //               })
  //               .then(() => {
  //                 fire.firestore()
  //                 .collection('redirects')
  //                 .doc(userData.uid)
  //                 .set({ 
  //                   'source': `/profile/${defaultDomain}`, 
  //                   'destination': `/${domain}`,
  //                   'permanent': true
  //                 })
  //                 .catch((err) => {
  //                   toast(err.message)
  //                 })
  //               })
  //               .then(() => {
  //                 let newUserContext = userContext;
  //                 newUserContext.profileUrl = `/${domain}`;
  //                 setUserContext(newUserContext)
  //               })
  //               .then(() => {
  //                 setSaving(false)
  //                 toast('Profile URL updated')
  //               })
  //               .catch((err) => {
  //                 // console.log(err.code, err.message)
  //                 toast(err.message)
  //               })
  //             }
  //           })
  //       } else {
  //         handleUpsellShow()
  //       }
  //     }
  //   }
  //   if (selectedDomainType == 'standard') {
  //     setSaving(true)

  //     fire.firestore().collection('users').doc(userData.uid).update({
  //       'profileUrl': `/profile/${defaultDomain}`,
  //       lastUpdated: fire.firestore.FieldValue.serverTimestamp()
  //     })
  //       .then(() => {
  //         fire.firestore()
  //         .collection('redirects')
  //         .doc(userData.uid)
  //         .delete()
  //         .catch((err) => {
  //           toast(err.message)
  //         })
  //       })
  //       .then(() => {
  //         let newUserContext = userContext;
  //         newUserContext.profileUrl = `/profile/${defaultDomain}`;
  //         setUserContext(newUserContext)
  //       })
  //       .then(() => {
  //         setSaving(false)
  //         toast('Profile URL updated')
  //       })
  //       .catch((err) => {
  //         // console.log(err.code, err.message)
  //         toast(err.message)
  //       })
  //   }
  // }

  const handleCloseAddDomain = () => setShowAddDomainModal(false);
  const handleShowAddDomain = () => {
    if ( !allUserData?.flags?.customDomain) {
      if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
        setShowAddDomainModal(true)
      } else {
        setShowUpsellModal(true);
      }
    } else {
      setShowAddDomainModal(true)
    }
  }

  const handleRemoveDomainShow = () => setShowRemoveDomainModal(true)
  const handleRemoveDomainClose = () => setShowRemoveDomainModal(false)

  const handleRemoveDomainSubmit = (e) => {
    e.preventDefault();

    setRemovingDomain(true)

    // Remove domain API? Should they even be able to remove a domain
    // When could someone remove a domain?
    // Ideally, you can only add a domain to firebase if it hadn't already been added to another account?
    // I think you should be able to do this as long as you can update the TXT?
    // Maybe for now, all we do is remove it from firebase? > that way it will route to the right place?

    // Remove from the API because you can't add one that is already on someone else's account anyway

    // remove from this user's firebase

    fetch(`/api/remove-domain?domain=${allUserData?.domain?.name}&userId=${userData.uid}`)
      .then(() => {
        setShowRemoveDomainModal(false)
        setRemovingDomain(false)
        toast("Domain removed")
      })
      .then(() => {
        loggedInRoute(userData)
      })
      .catch((error) => {
        setRemovingDomain(false)
        toast("Unable to remove domain")
        //console.error("Error adding document: ", error);
      });

  }

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
    if (newDomain === '') {
      setNewDomainError('Please enter a valid domain')
      setSaving(false)
    } else if (newDomain === 'expertpage.io' || newDomain === 'www.expertpage.io' ) {
      setNewDomainError("Okay, very funny")
      setSaving(false)
    } else {

      let matchingUrls = []

      fire.firestore()
        .collection('users')
        .where("domain.name", "==", `${newDomain}`)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            matchingUrls = [...matchingUrls, doc.id];
          })
        })
        .then(() => {
          if (((matchingUrls && matchingUrls).length > 0) && allUserData?.domain?.name !== {newDomain}) {
            setSaving(false)
            setNewDomainError('This domain is already used by another account')
            // toast('Domain used by another account')
          } else {
            // implement a check to see if this domain is already on another account?

            fetch(`/api/add-domain?domain=${newDomain}&userId=${userData.uid}`)
              // .then(result => console.log(result))
              .then((res) => res.json())
              .then((result) => {
                // console.log(result);
                if (result.error?.code == 'domain_taken') {
                  handleCloseAddDomain()
                  toast("Domain already in use")
                  setSaving(false)
                } else if (result.error?.code == 'domain_already_in_use') {
                  handleCloseAddDomain()
                  toast("Domain used by another account")
                  setSaving(false)
                } else {
                  handleCloseAddDomain()
                  toast("Domain added")
                  setSaving(false)
                }
              })
              .then(() => {
                handleCheckDomain(newDomain)
              })
              .then(() => {
                setNewDomain('')
              })
              .catch((error) => {
                console.log('error', error)
              });
          }
        })
    }
  }

  const handleGetDomain = () => {

    setGettingDomainInfo(true);

    fetch(`/api/get-domain?domain=${allUserData?.domain?.name}&userId=${userData.uid}`)
      // .then(result => console.log(result))
      .then(() => {
        setGettingDomainInfo(false);
      })
      .catch((error) => {
        console.log('error', error)
      });
  }

  const handleCheckDomain = (domain) => {

    setGettingDomainInfo(true);

    fetch(`/api/check-domain?domain=${domain ? domain : allUserData?.domain?.name}&userId=${userData.uid}`)
      .then(() => {
        loggedInRoute(userData)
      })
      .then(() => {
        setGettingDomainInfo(false);
      })
      .catch((error) => {
        console.log('error', error)
      });
  }

  const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <a
      className={styles.toggleLink}
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ));

  const CustomMenu = forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled m-0">
            {children}
          </ul>
        </div>
      );
    },
  );

  return (
    <div>
      <div className="card mx-auto">
        <div className="d-flex flex-column m-4">
          <div className="d-flex flex-column w-100 gap-4">
            <div className="d-flex flex-column gap-0">
              <h5 className="mb-1">Connect my own domain</h5>
              <p className="text-dark-low mb-0">Choose a custom URL on the expertpage.io domain</p>
            </div>
            {!sectionsLoading ? 
              (!allUserData?.domain?.name ? 
                <>
                  <div>
                    <button type="button" onClick={handleShowAddDomain} className="btn primary medium small w-100 w-md-auto">Add domain</button>
                  </div>
                </>
              :
              <div className="d-flex flex-column border-1 border-solid border-dark-300 radius-2 p-4 gap-3">
                {/* {!gettingDomainInfo ?
                  ( !allUserData?.domain?.verified ?
                    <div className="tag small dark medium">Pending verification</div>
                  :
                    (allUserData?.domainConfig?.misconfigured ? 
                      <div className="tag small dark medium">Misconfigured</div>
                    :
                      <div className="tag small primary high">Verified</div>
                    )
                    
                  )
                :
                  <div className="d-flex flex-column bg-dark-300 radius-4 loadingAnimation" style={{height: '24px', width: '96px'}}></div>
                } */}
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <div className="d-flex flex-column gap-0">
                    <h6 className="mb-1">{allUserData.domain.name}</h6>
                    { !gettingDomainInfo ?
                      ( !allUserData?.domain?.verified || allUserData?.domainConfig?.misconfigured ?
                        <p className="text-dark-low mb-0">Your profile is not live on this domain yet</p> 
                          :
                        <p className="text-primary-high mb-0">Your profile is live on this domain</p>
                      )
                    :
                      <p className="text-dark-low mb-0">Refreshing domain information</p>
                    }
                  </div>
                  {/* {  !allUserData?.domainConfig?.misconfigured && 
                    <button type="button" onClick={handleRemoveDomainShow} className="btn dark low icon-only">
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.MORE}></path>
                      </svg>
                    </button>
                  } */}
                  {  !allUserData?.domainConfig?.misconfigured && 
                    <Dropdown align="end">
                      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" className="text-decoration-none">
                        <>
                          <button className="btn dark low icon-only">
                            <svg viewBox="0 0 24 24">
                              <path d={ICONS.MORE}></path>
                            </svg>
                          </button>
                        </>
                      </Dropdown.Toggle>
                      <Dropdown.Menu as={CustomMenu} align="end" className="mt-2">
                        <div className="p-2">
                          <Dropdown.Item onClick={() => handleRemoveDomainShow()} className="dropdownItem">
                            <Icon icon={ICONS.DELETE} size='24' className="fill-dark-900" />
                            Remove domain
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleCheckDomain()} className="dropdownItem">
                            <Icon icon={ICONS.REFRESH} size='24' className="fill-dark-900" />
                            Refresh
                          </Dropdown.Item>  
                        </div>                      
                      </Dropdown.Menu>
                    </Dropdown>
                  }
                </div>
                {!gettingDomainInfo ? 
                  ( !allUserData?.domain?.verified ? 
                    <>
                      <p className="mb-0">Please set the following TXT record on _vercel.mydomain.com to show your Expertpage on {allUserData.domain.name}. Once the verification is completed and the domain is successfully configured, the TXT record can be removed.</p>
                      <div className="d-flex flex-column bg-dark-100 radius-2 p-3 gap-3">
                        <div>
                          <p className="text-dark-high small font-weight-semibold mb-1">Type</p>
                          <p className="mb-0 monospace">{allUserData?.domain?.verification[0].type}</p>
                        </div>
                        <div>
                          <p className="text-dark-high small font-weight-semibold mb-1">Name</p>
                          <p className="mb-0 monospace">{allUserData?.domain?.verification[0].domain.replace(`.${allUserData.domain.name}`,"") }</p>
                        </div>
                        <div>
                          <p className="text-dark-high small font-weight-semibold mb-1">Value</p>
                          <p className="mb-0 monospace">{allUserData?.domain?.verification[0].value}</p>
                        </div>
                      </div>
                    </>
                  :
                    (
                      allUserData?.domainConfig?.misconfigured ? 
                      <>
                        <p className="mb-0">Please set the following DNS records of {allUserData.domain.name} to show your Expertpage on this domain.</p>
                        <div className="d-flex flex-column flex-md-row bg-dark-100 radius-2 p-3 gap-3">
                          <div style={{minWidth: '64px'}}>
                            <p className="text-dark-high small font-weight-semibold mb-1">Type</p>
                            <p className="mb-0 monospace">A</p>
                          </div>
                          <div style={{minWidth: '64px'}}>
                            <p className="text-dark-high small font-weight-semibold mb-1">Name</p>
                            <p className="mb-0 monospace">@</p>
                          </div>
                          <div>
                            <p className="text-dark-high small font-weight-semibold mb-1">Value</p>
                            <p className="mb-0 monospace" style={{textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}>76.76.21.21</p>
                          </div>
                        </div>
                        <div className="d-flex flex-column flex-md-row bg-dark-100 radius-2 p-3 gap-3">
                          <div style={{minWidth: '64px'}}>
                            <p className="text-dark-high small font-weight-semibold mb-1">Type</p>
                            <p className="mb-0 monospace">CNAME</p>
                          </div>
                          <div style={{minWidth: '64px'}}>
                            <p className="text-dark-high small font-weight-semibold mb-1">Name</p>
                            <p className="mb-0 monospace">www</p>
                          </div>
                          <div>
                            <p className="text-dark-high small font-weight-semibold mb-1">Value</p>
                            <p className="mb-0 monospace" style={{textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}>
                              {/* {allUserData.domain.apexName} */}
                              cname.vercel-dns.com
                            </p>
                          </div>
                        </div>
                      </>
                      : 
                        ''
                    )
                  ) :
                  <div className="d-flex flex-column bg-dark-100 radius-2 p-4 gap-3 loadingAnimation" style={{height: '64px'}}></div>
                }
                {!gettingDomainInfo &&
                  ( allUserData?.domainConfig?.misconfigured ? 
                    <div className="d-flex flex-column flex-md-row gap-2">
                      <button type="button" onClick={handleRemoveDomainShow} className="btn error medium small w-100 w-md-auto">Remove domain</button>
                      <button type="button" onClick={!allUserData?.domain?.verified ? () => handleGetDomain() : () => handleCheckDomain()} className="btn dark medium small w-100 w-md-auto">Refresh</button>
                    </div>
                    :
                    null
                  )
                }
                </div>
              )
            : 
              <div className="d-flex flex-column bg-dark-200 radius-2 p-4 gap-3 loadingAnimation" style={{height: '48px'}}></div>
            }
            
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
              <input type="text" className={newDomainError !== '' ? `error w-100` : `w-100`} value={newDomain} onChange={({ target }) => domainChange(target.value)} placeholder="mywebsite.com" />
              <p className="small text-dark-med mt-2 mb-0">Your Expertpage profile will appear on this domain.</p>
              {newDomainError !== '' && <p className="small text-error-high mt-2 mb-0">{newDomainError}</p> }
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
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div>
            <h4 className="text-dark-high text-center mb-2">Make your profile your own</h4>
            <p className="text-center mb-4">Upgrade to Premium to customise your profile URL</p>
            <div className={`${styles.planCard} ${styles.active} radius-3 p-4 w-100 w-md-50 `}>
              <h5 className="text-primary-high mb-1">Premium</h5>
              <div className="d-flex align-items-end mb-4">
                <h4 className="text-dark-high mr-1 mb-0">$5.99</h4>
                <p className="text-dark-high mb-0">/month</p>
              </div>
              {[
                'Connect your own domain',
                'Remove Expertpage.io branding', 
                'More coming soon'
              ].map((feature, index) =>
                <div key={index} className="d-flex mt-2">
                  <svg viewBox="0 0 24 24" width={'24px'} className="mr-2 fill-dark-800" style={{minWidth: '24px'}}>
                    <path d={ICONS.CHECK}></path>
                  </svg>
                  <p className="mb-0">{feature}</p>
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
      <Modal
        show={showRemoveDomainModal} 
        onHide={handleRemoveDomainClose}
        // backdrop="static"
        keyboard={false}
        size="md"
      >
        <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            <h5 className="text-dark-high font-weight-bold mb-0">Remove custom domain</h5>
          </div>
          <button onClick={handleRemoveDomainClose} className="btn dark medium small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header>
        <hr className="m-0 w-100"></hr>
        <div className="p-4">
          {/* <h6 className="mb-2">Are you sure you want to remove this custom domain?</h6> */}
          <p>Your Expertpage profile will still be accessible at expertpage.io/{allUserData?.subdomain}</p>
          { allUserData?.domain?.name &&
            <div className="d-flex flex-row justify-content-between border-1 border-solid border-dark-300 radius-2 w-100 p-4 mb-4" style={{gap:'24px'}}>
              <div className="d-flex flex-row justify-content-between w-100">
                <h6 className="mb-0">{allUserData?.domain?.name}</h6>
                { !allUserData?.domain?.verified ?
                  <div className="tag small dark medium">Pending verification</div>
                :
                  ( allUserData?.domainConfig?.misconfigured ? 
                    <div className="tag small dark medium">Misconfigured</div>
                      :
                    <div className="tag small primary high">Live</div>
                  )
                }
              </div>
            </div>
          }
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleRemoveDomainClose} className="btn dark medium w-100 w-sm-auto" disabled={removingDomain}>Cancel</button>
            <button type="button" onClick={handleRemoveDomainSubmit} className="btn error high w-100 w-sm-auto order-1 order-sm-0" disabled={removingDomain}>{!removingDomain ? 'Remove domain' : 'Removing...'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CustomDomain