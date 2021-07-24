import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../../components/header/Header';
import {loadStripe} from '@stripe/stripe-js';
import { Accordion, Container, ModalBody, useAccordionToggle } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import moment from 'moment'
import ICONS from '../../components/icon/IconPaths';

import styles from './settings.module.scss'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { ProgressBar, Modal } from 'react-bootstrap';
import ResyncSection from './components/resyncSection';
import ManageButton from './components/manageButton';
import UpgradeButton from './components/upgradeButton';
import RenewButton from './components/renewButton';

const ExperienceCheckbox = ({ options, onChange }) => {
  const [data, setData] = useState(options);

  const toggle = index => {
    const newData = [...data];
    newData.splice(index, 1, {
      display: !data[index].display,
      title: data[index].title,
      company: data[index].company,
    });
    setData(newData);
    onChange(newData);
  };

  return (
    <>
      {data.map((job, index) =>
        <div key={index}>
          <hr className="m-0" />
          <div className="p-4">
            <label className="checkbox-container small font-weight-medium text-dark-high">
              {job.title + ' at ' + job.company}
              <input type="checkbox" checked={job.display || false} onClick={() => toggle(index)} />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
      )}
    </>
  );
};

const EducationCheckbox = ({ options, onChange }) => {
  const [data, setData] = useState(options);

  const toggle = index => {
    const newData = [...data];
    newData.splice(index, 1, {
      display: !data[index].display,
      name: data[index].name,
      school: data[index].school,
    });
    setData(newData);
    onChange(newData);
  };

  return (
    <>
      {data.map((job, index) =>
        <div key={index}>
          <hr className="m-0" />
          <div className="p-4">
            <label className="checkbox-container small font-weight-medium text-dark-high">
              {job.name !== null ? job.name + ' at ' : null}{job.school}
              <input type="checkbox" checked={job.display || false} onClick={() => toggle(index)} />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
      )}
    </>
  );
};

const Settings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState('');
  const [basicInfo, setBasicInfo] = useState(true);
  const [profilePic, setProfilePic] = useState(true);
  const [headerImage, setHeaderImage] = useState(true);
  const [fullname, setFullname] = useState(true);
  const [headline, setHeadline] = useState(true);
  const [email, setEmail] = useState(true);
  const [about, setAbout] = useState(true);
  const [experience, setExperience] = useState(true);
  const [experienceEach, setExperienceEach] = useState('');
  const [education, setEducation] = useState(true);
  const [educationEach, setEducationEach] = useState('');
  const [volunteering, setVolunteering] = useState(true);
  const [volunteeringEach, setVolunteeringEach] = useState('');
  const [linkedinId, setLinkedinId] = useState('');
  //const [syncsRemaining, setSyncsRemaining] = useState(0);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState('');
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [cancelAt, setCancelAt] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    if (router.query.upgrade == 'success') {
      toast("Upgraded to Premium")
    }
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          loggedInRoute(user)
          getSubscription(user)
          setUserData(user)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const loggedInRoute = (user) => {
    var docRef = fire.firestore().collection('users').doc(user.uid)
    docRef.get().then((doc) => {
      if (doc.exists) {
        setBasicInfo(doc.data().displayInfo.basicInfo)
        setProfilePic(doc.data().displayInfo.basicInfo.each.profilePic)
        setHeaderImage(doc.data().displayInfo.basicInfo.each.headerImage)
        setFullname(doc.data().displayInfo.basicInfo.each.name)
        setHeadline(doc.data().displayInfo.basicInfo.each.headline)
        setEmail(doc.data().displayInfo.basicInfo.each.email)
        setAbout(doc.data().displayInfo.about)
        setExperience(doc.data().displayInfo.experience.section)
        setExperienceEach(doc.data().displayInfo.experience.each)
        setEducation(doc.data().displayInfo.education.section)
        setEducationEach(doc.data().displayInfo.education.each)
        setVolunteering(doc.data().displayInfo.volunteering.section)
        setVolunteeringEach(doc.data().displayInfo.volunteering.each)
        setLinkedinId(doc.data().profile.public_identifier)
        //doc.data().syncsRemaining ? setSyncsRemaining(doc.data().syncsRemaining) : null
        //console.log(doc.data())
      } else {
        console.log("No such document!");
      }
    })
    .then(() => {
      setSectionsLoading(false)
      console.log('Retreived display info from database')
      console.log('stripe product is' + process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM)
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    })
  }

  const getSubscription = (user) => {
    var docRef = fire.firestore().collection('users').doc(user.uid).collection('subscriptions')
    //docRef.get()
    docRef.where("status", "==", "active").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setProduct(doc.data().items[0].plan.product)
          //setActive(doc.data().items[0].plan.active)
          setStatus(doc.data().status)
          setCancelAtPeriodEnd(doc.data().cancel_at_period_end)
          setCancelAt(doc.data().cancel_at.seconds)
          console.log(doc.id, " => ", doc.data());
          console.log(doc.data().items[0].plan.product);
          console.log(doc.data().items[0].plan.active)
          // prod_Jdg7o4VDoipc7d = Premium
          // prod_Jdg7ZdcmfuNm0P = Free
      });
    })
    .then(() => {
      console.log('Retreived subscription data from database')
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    })
  }

  const handleSectionsSubmit = (e) => {
    e.preventDefault();
    setSaving(true)
    fire.firestore().collection('users').doc(userData.uid).update({
      displayInfo: {
        'basicInfo': {
          'section': basicInfo,
          'each': {
            'profilePic': profilePic,
            'headerImage': headerImage,
            'name': fullname,
            'headline': headline,
            'email': email
          }
        },
        about,
        'experience': {
          'section': experience,
          'each': experienceEach,
        },
        'education': {
          'section': education,
          'each': educationEach,
        },
        'volunteering': {
          'section': volunteering,
          'each': volunteeringEach,
        }
      },
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        setSaving(false)
        toast("Sections updated")
      })
      .catch((err) => {
        console.log(err.code, err.message)
        //setNotification(err.message)
        toast(err.message)
      })
  }

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
    if (syncsRemaining > 0) {
      setSyncLoading('Fetching data from LinkedIn');
      fetch("/api/linkedin?profileUrl=" + "https://www.linkedin.com/in/" + linkedinId)
        .then(res => res.json())
        .then((result) => {
          setSyncLoading('Storing your data');
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
        })
        .then(() => {
          setTimeout(
            setSyncLoading('Sync successfully completed'), 2000
          )
        })
        .then(() => {
          router.push('/settings')
        })
        .catch((error) => {
          console.log('error', error)
        });
    } else {
      setSyncError('You have no syncs remaining')
    }
  }
  // Re-syncing End

  // Dev Premium Subscription Start
  /*async function handleUpgrade(e){
    e.preventDefault();
    const functionRef = fire.app().functions('europe-west2').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
    const { data } = await functionRef({ returnUrl: window.location.origin });
    window.location.assign(data.url);
  }*/

  async function handleUpgrade(e, user){
    e.preventDefault();
    const docRef = await fire.firestore()
    .collection('users')
    .doc(userData.uid)
    .collection('checkout_sessions')
    .add({
      price: 'price_1J0OkzFFJvOkQ4EVlzN9GCBd',
      success_url: window.location.origin + '/settings?upgrade=success',
      cancel_url: window.location.origin + '/settings?upgrade=cancelled',
    });
    // Wait for the CheckoutSession to get attached by the extension
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        // Show an error to your customer and 
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        // We have a session, let's redirect to Checkout
        // Init Stripe
        const stripe = await loadStripe('pk_test_51IibusFFJvOkQ4EVK5gfZ5kGFY3hSdVj50bLcCSdt4n7kbdSRjPOlF4BtPl6wvytFM3GPnBisTxKHKyC4xh4F5Q400SEUc8ayI');
        stripe.redirectToCheckout({ sessionId });
      }
    });
  }
  // Dev Premium Subscription End

  // Dev Customer Portal Start
  async function handleUpdate(e){
    e.preventDefault();
    const functionRef = fire.app().functions('europe-west2').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
    const { data } = await functionRef({ returnUrl: window.location.origin  + '/settings' });
    window.location.assign(data.url);
  }
  // Dev Customer Portal End

  const CustomToggle = ({ eventKey }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setDropdownOpen(!dropdownOpen)
    });

    return (
      <button type="button" onClick={decoratedOnClick} className="btn dark low small icon-only">
        <svg viewBox="0 0 24 24">
          <path d={dropdownOpen ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}></path>
        </svg>
      </button>
    );
  }

 {/*} const UpgradeButton = () => {
    return (
      <button type="button" className="btn primary high w-100 mt-5" onClick={handleUpgrade}>Upgrade</button>
    )
  }

  const ManageButton = () => {
    return (
      <button type="button" className="btn primary medium w-100 mt-5" onClick={handleUpdate}>Manage</button>
    )
  }*/}

  const CurrentPlan = () => {
    return (
      <div className="tag primary medium">Current</div>
    )
  }

  return (
    <div>
      <Head>
        <title>Settings</title>
      </Head>
      <Header />
      <Container className="py-4">
        <div className="m-auto" style={{ maxWidth: "640px" }}>
          <h2 className="my-5">Settings</h2>
          { cancelAtPeriodEnd ? (
                <> 
                  <div className="card d-flex flex-column bg-primary-900 mx-auto mb-5 p-4">
                    <h5 className="text-light-high">Premium expiring {moment.unix(cancelAt).startOf('hour').fromNow()}</h5>
                    <p className="text-light-high mb-0">Your Premium plan is set to expire on <b>{moment.unix(cancelAt).format('Do MMMM YYYY')}</b>. You won't be able to re-sync your profile with LinkedIn. Renew your subscription to keep access to all Premium features.</p>
                    <div>
                      <RenewButton handleUpdate={handleUpdate} className="w-md-auto light" />
                    </div>
                  </div>
                </>
              )
            : null }

          <div className="card mx-auto mb-5">
            <div className="p-4">
              <h5 className="text-dark-high mb-0">Sections</h5>
              <p className="text-dark-low mb-0">Control the visibility of content profile</p>
            </div>
            <hr className="m-0"/>
            {sectionsLoading ?
              <div className="p-4">
                <p className="mb-0">Loading...</p>
              </div>
              :
              <div className="p-0">
                <form onSubmit={handleSectionsSubmit}>
                  <Accordion>
                    <div className={styles.sectionCard + " card"}>
                      <div className="d-flex flex-row justify-content-between align-items-center p-4">
                        <label className="checkbox-container font-weight-medium text-dark-high large">
                          Basic information
                          <input type="checkbox" checked={basicInfo} disabled />
                          <span className="checkmark"></span>
                        </label>
                        <CustomToggle eventKey="0" />
                      </div>
                      <Accordion.Collapse eventKey="0">
                        <div>
                          <div>
                            <hr className="m-0" />
                            <div className="p-4">
                              <label className="checkbox-container small font-weight-medium text-dark-high">
                                Header Image
                            <input type="checkbox" checked={headerImage} onChange={(e) => setHeaderImage(e.currentTarget.checked)} />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <hr className="m-0" />
                            <div className="p-4">
                              <label className="checkbox-container small font-weight-medium text-dark-high">
                                Profile Picture
                            <input type="checkbox" checked={profilePic} onChange={(e) => setProfilePic(e.currentTarget.checked)} />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <hr className="m-0" />
                            <div className="p-4">
                              <label className="checkbox-container small font-weight-medium text-dark-high">
                                Name
                            <input type="checkbox" checked={fullname} onChange={(e) => setFullname(e.currentTarget.checked)} />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <hr className="m-0" />
                            <div className="p-4">
                              <label className="checkbox-container small font-weight-medium text-dark-high">
                                Headline
                            <input type="checkbox" checked={headline} onChange={(e) => setHeadline(e.currentTarget.checked)} />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <hr className="m-0" />
                            <div className="p-4">
                              <label className="checkbox-container small font-weight-medium text-dark-high">
                                Contact button
                            <input type="checkbox" checked={email} onChange={(e) => setEmail(e.currentTarget.checked)} />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </Accordion.Collapse>
                    </div>
                  </Accordion>
                  <div className={styles.sectionCard + " card p-4"}>
                    <label className="checkbox-container font-weight-medium text-dark-high large">
                      About
                  <input type="checkbox" checked={about} onChange={(e) => setAbout(e.currentTarget.checked)} />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <Accordion>
                    <div className={styles.sectionCard + " card"}>
                      <div className="d-flex flex-row justify-content-between align-items-center p-4">
                        <label className="checkbox-container font-weight-medium text-dark-high large">
                          Experience
                          <input type="checkbox" checked={experience} onChange={(e) => setExperience(e.currentTarget.checked)} />
                          <span className="checkmark"></span>
                        </label>
                        {experienceEach.length < 1 ? null : <CustomToggle eventKey="0" />}
                      </div>
                      <Accordion.Collapse eventKey="0">
                        <ExperienceCheckbox
                          options={experienceEach}
                          onChange={data => {
                            setExperienceEach(data);
                          }}
                        />
                      </Accordion.Collapse>
                    </div>
                  </Accordion>
                  <Accordion>
                    <div className={styles.sectionCard + " card"}>
                      <div className="d-flex flex-row justify-content-between align-items-center p-4">
                        <label className="checkbox-container font-weight-medium text-dark-high large">
                          Education
                        <input type="checkbox" checked={education} onChange={(e) => setEducation(e.currentTarget.checked)} />
                          <span className="checkmark"></span>
                        </label>
                        {educationEach.length < 1 ? null : <CustomToggle eventKey="0" />}
                      </div>
                      <Accordion.Collapse eventKey="0">
                        <EducationCheckbox
                          options={educationEach}
                          onChange={data => {
                            setEducationEach(data);
                          }}
                        />
                      </Accordion.Collapse>
                    </div>
                  </Accordion>
                  <Accordion>
                    <div className={styles.sectionCard + " card"}>
                      <div className="d-flex flex-row justify-content-between align-items-center p-4">
                        <label className="checkbox-container font-weight-medium text-dark-high large">
                          Volunteering
                          <input type="checkbox" checked={volunteeringEach.length < 1 ? false : volunteering} onChange={(e) => setVolunteering(e.currentTarget.checked)} disabled={volunteeringEach.length < 1 ? true : false} />
                          <span className="checkmark"></span>
                        </label>
                        {volunteeringEach.length < 1 ? null : <CustomToggle eventKey="0" />}
                      </div>
                      <Accordion.Collapse eventKey="0">
                        <ExperienceCheckbox
                          options={volunteeringEach}
                          onChange={data => {
                            setVolunteeringEach(data);
                          }}
                        />
                      </Accordion.Collapse>
                    </div>
                  </Accordion>
                  <div className="m-4">
                    <button type="submit" className="btn primary high w-100 w-md-auto" disabled={saving}>{!saving ? 'Save' : 'Saving'}</button>
                  </div>
                </form>
              </div>
            }
          </div>
          <ResyncSection
            linkedinId={linkedinId} 
            userData={userData}
            //syncsRemaining={syncsRemaining}
            loggedInRoute={loggedInRoute}
            product={product}
            active={active}
            status={status}
            handleUpdate={handleUpdate}
            handleUpgrade={handleUpgrade}
          />
          <div className="card mx-auto mb-5">
            <div className="p-4">
              <h5 className="text-dark-high mb-0">Plan</h5>
              <p className="text-dark-low mb-0">Manage your plan and payment information</p>
            </div>
            <hr className="m-0"/>
            <div className="p-4">
              <p>{ process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM }</p>
            </div>
            <hr className="m-0"/>
           {/*}
            <div className="m-4">
              <p>{product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (active === true ? 'Premium' : 'Free') : 'Free') : 'Free'}</p>
              <p>{active === true ? 'Active' : 'Cancelled'}</p>
              <button type="button" className="btn primary medium w-100 w-md-auto" onClick={handleUpdate}>Update</button>
              <button type="button" className="btn primary high w-100 w-md-auto" onClick={handleUpgrade}>Upgrade</button>
            </div>
            <hr className="m-0"/>
          */}
          {/*}
              <div className="m-4">
                <p>{ cancelAtPeriodEnd ? moment.unix(cancelAt).endOf('day').fromNow() : null }</p>
                <p>{ cancelAtPeriodEnd ? moment.unix(cancelAt).format('MMMM Do YYYY, h:mm:ss a') : null }</p>
                <p>{ cancelAtPeriodEnd ? cancelAt : null }</p>
              </div>
            <hr className="m-0"/>
        */}
        
            <div className="m-4">
              {/*}
            { cancelAtPeriodEnd ? (
              <>
                  <div className="d-flex flex-column bg-error-100 radius-3 p-4 mb-4">
                    <p className="text-error-high">Your subscription is expiring soon</p>
                    <p className="text-dark-high mb-0">Your Premium plan is set to expire on <b>{moment.unix(cancelAt).format('Do MMMM YYYY')}</b>. Renew your subscription to keep access to all Premium features.</p>
                  </div>
                </>
              )
            : null }*/}
              <div className="d-flex flex-column flex-md-row" style={{ gap: "24px" }}>
                <div className={`${styles.planCard} radius-3 p-4 w-100 w-md-50 ${product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? '' : styles.active) : styles.active) : styles.active}`}>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <h5 className="text-primary-high mb-1">Basic</h5>
                    {product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? null : <CurrentPlan />) : <CurrentPlan />) : <CurrentPlan />}
                  </div>
                  <h4 className="text-dark-high mb-4">Free</h4>
                  {[
                    'Vitaely.me domain', 
                    'Basic presentation'
                  ].map((feature, index) =>
                    <div key={index} className="d-flex align-items-start mt-2">
                      <svg viewBox="0 0 24 24" width={'24px'} className="mr-2 fill-dark-900">
                        <path d={ICONS.CHECK}></path>
                      </svg>
                      <p className="text-dark-high font-weight-medium mb-0">{feature}</p>
                    </div>
                  )}
                  {/*<button type="button" className="btn primary high w-100 mt-3" onClick={handleUpdate}>Upgrade</button>*/}
                </div>
                <div className={`${styles.planCard} radius-3 p-4 w-100 w-md-50 ${product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? styles.active : '') : '') : ''}`}>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <h5 className="text-primary-high mb-1">Premium</h5>
                    {product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? <CurrentPlan /> : null) : null) : null}
                  </div>
                  <div className="d-flex align-items-end mb-4">
                    <h4 className="text-dark-high mr-1 mb-0">$3</h4>
                    <p className="text-dark-high mb-0">/month</p>
                  </div>
                  {[
                    'All Starter features', 
                    'Unlimited re-syncing', 
                    'More coming soon'
                  ].map((feature, index) =>
                    <div key={index} className="d-flex align-items-start mt-2">
                      <svg viewBox="0 0 24 24" width={'24px'} className="mr-2 fill-dark-900">
                        <path d={ICONS.CHECK}></path>
                      </svg>
                      <p className="text-dark-high font-weight-medium mb-0">{feature}</p>
                    </div>
                  )}
                  { cancelAtPeriodEnd ? (
                      <>
                        <div className="tag error medium mt-3">Expires on {moment.unix(cancelAt).format('Do MMMM YYYY')}</div>
                      </>
                    )
                  : null }
                  {product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (status === 'active' ? ( cancelAtPeriodEnd ? <RenewButton handleUpdate={handleUpdate} /> : <ManageButton handleUpdate={handleUpdate} />) : <UpgradeButton handleUpgrade={handleUpgrade} />) : <UpgradeButton handleUpgrade={handleUpgrade} />) : <UpgradeButton handleUpgrade={handleUpgrade} />}
                  {/*<button type="button" className="btn primary high small w-100 mt-5" onClick={handleUpdate}>Upgrade</button>
                    <div className={`${styles.planCard} radius-3 p-4 w-100 w-md-50 ${product !== '' ? (product === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM ? (active === true ? styles.active : '') : '') : ''}`}>
                    <button type="button" className="btn primary medium w-100 w-md-auto" onClick={handleUpdate}>Update</button>
                    <button type="button" className="btn primary high w-100 w-md-auto" onClick={handleUpgrade}>Upgrade</button></div>*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <br /><br />
      <Modal 
        show={showModal} 
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <h5 className="text-dark-high mb-0">Re-sync data</h5>
          {/*<button type="button" onClick={handleClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>*/}
        </Modal.Header>
        <Modal.Body>
          <h5 className="text-dark-high">Are you sure you want to re-sync your data from LinkedIn?</h5>
          <p>Re-syncing your data will overwrite any changes you have made in the <b>Sections</b> settings.</p>
          <br />
          <div className="d-flex align-items-center jusify-content-start flex-column flex-md-row">
            <button type="button" className="btn primary high w-100 w-md-auto mr-0 mr-md-3 mb-3 mb-md-0" onClick={handleClose}>Re-sync data from Linkedin</button>
            <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleClose}>Close</button>
          </div>
        </Modal.Body>
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

export default Settings