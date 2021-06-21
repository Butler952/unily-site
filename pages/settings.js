import { useState, useEffect } from 'react';
import fire from '../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Header from '../components/header/Header';
import { Accordion, Container, useAccordionToggle } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import ICONS from '../components/icon/IconPaths';

import styles from './settings.module.scss'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { ProgressBar } from 'react-bootstrap';

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
  const [syncsRemaining, setSyncsRemaining] = useState(0);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
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
        doc.data().syncsRemaining ? setSyncsRemaining(doc.data().syncsRemaining) : null
      } else {
        console.log("No such document!");
      }
    })
      .then(() => {
        setSectionsLoading(false)
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
            syncsRemaining: (syncsRemaining - 1), 
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

  // Dev Checkout Start
  async function handleCheckout(e){
    e.preventDefault();
    const functionRef = fire.app().functions('europe-west2').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
    const { data } = await functionRef({ returnUrl: window.location.origin });
    window.location.assign(data.url);
  }
  // Dev Checkout End

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

  return (
    <div>
      <Head>
        <title>Settings</title>
      </Head>
      <Header />
      <Container className="py-4">
        <div className="m-auto" style={{ maxWidth: "640px" }}>
          <h2 className="my-4 my-md-5">Settings</h2>
          <div className="card mx-auto mb-5">
            <div className="p-4">
              <h5 className="text-dark-high mb-0">Sections</h5>
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
                          {/*<div>
                            <hr className="m-0" />
                            <div className="p-4">
                              <label className="checkbox-container small font-weight-medium text-dark-high">
                                Header Image
                            <input type="checkbox" checked={headerImage} onChange={(e) => setHeaderImage(e.currentTarget.checked)} />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          </div>*/}
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
          <div className="card mx-auto mb-5">
            <div className="p-4">
              <h5 className="text-dark-high mb-0">Re-sync data</h5>
            </div>
            <hr className="m-0"/>
            <div className="m-4">
              <p>To edit the information on your profile, you will need to head to your LinkedIn profile and make the changes there before re-syncing your information.</p>
              <p>Once you have made your changes, you can sync your changes by using the button below.</p>
              <div className="bg-error-100 radius-3 p-4">
                <p className="text-error-high">Warning</p>
                <p className="text-dark-high m-0">Re-syncing your data will overwrite any changes you have made in the Sections settings above.</p>
              </div>
            </div>
            <hr className="m-0"/>
            <div className="m-4">
              <p className="large text-dark-high">{syncLoading === '' ? ( syncsRemaining > 0 ? ( syncsRemaining === 1 ? syncsRemaining + " re-sync remaining" : syncsRemaining + " re-syncs remaining" )  : "No re-syncs remaining") : syncLoading}</p>
              <ProgressBar now={ syncsRemaining > 0 ? ( syncsRemaining === 1 ? 10 : 100 ) : 0 } />
              <div className="d-flex mt-4 flex-column flex-md-row">
                <button type="button" onClick={handleResyncSubmit} className="btn primary high mr-md-3 w-100 w-md-auto" disabled={ syncLoading !== '' ? true : ( syncsRemaining === 0 ? true : false )}>{syncLoading === '' ? "Re-sync from Linkedin" : syncLoading}</button>
                <a href="#plan" className="btn primary medium mt-3 mt-md-0 w-100 w-md-auto">Get unlimited re-syncing</a>
              </div>
              {syncError !== '' ? <p className="small text-error-high mt-2">{syncError}</p> : null}
            </div>
          </div>
          <div className="card mx-auto mb-5">
           <div className="p-4">
              <h5 className="text-dark-high mb-0">Plan</h5>
            </div>
            <hr className="m-0"/>
            <div className="m-4">
              <button type="button" className="btn primary high w-100 w-md-auto" onClick={handleCheckout}>Upgrade</button>
            </div>
          </div>
        </div>
      </Container>
      <br /><br />
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