import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import fire from '../../config/fire-config';
import ICONS from '../icon/IconPaths';
import styles from './EditProfile.module.scss'
import Icon from '../icon/Icon';
import BasicInformation from './BasicInformation';
import About from './About';
import Experience from './Experience';
import EditExperience from './EditExperience';
import AddExperience from './AddExperience';

const EditProfile = ({
    showEditProfileModal, 
    editProfileModalState,
    setEditProfileModalIndex,
    editProfileModalIndex,
    handleEditProfileChangeView,
    handleEditProfileClose
  }) => {

  const [user, setUser] = useState('')

  const [basicInfoFirstName, setBasicInfoFirstName] = useState('');
  const [basicInfoFirstNameChanged, setBasicInfoFirstNameChanged] = useState(false);
  const [basicInfoFirstNameError, setBasicInfoFirstNameError] = useState('');
  const [basicInfoLastName, setBasicInfoLastName] = useState('');
  const [basicInfoLastNameChanged, setBasicInfoLastNameChanged] = useState(false);
  const [basicInfoLastNameError, setBasicInfoLastNameError] = useState('');
  const [basicInfoHeadline, setBasicInfoHeadline] = useState('');
  const [basicInfoHeadlineChanged, setBasicInfoHeadlineChanged] = useState(false);
  const [basicInfoHeadlineError, setBasicInfoHeadlineError] = useState('');

  const [about, setAbout] = useState('');
  const [aboutChanged, setAboutChanged] = useState(false);
  const [aboutError, setAboutError] = useState('');

  const [experiencesCompany, setExperiencesCompany] = useState('');
  const [experiencesCompanyChanged, setExperiencesCompanyChanged] = useState(false);
  const [experiencesCompanyError, setExperiencesCompanyError] = useState('');
  const [experiencesTitle, setExperiencesTitle] = useState('');
  const [experiencesTitleChanged, setExperiencesTitleChanged] = useState(false);
  const [experiencesTitleError, setExperiencesTitleError] = useState('');
  const [experiencesLocation, setExperiencesLocation] = useState('');
  const [experiencesLocationChanged, setExperiencesLocationChanged] = useState(false);
  const [experiencesLocationError, setExperiencesLocationError] = useState('');
  const [experiencesStartDate, setExperiencesStartDate] = useState('');
  const [experiencesStartDateInputType, setExperiencesStartDateInputType] = useState('text');
  const [experiencesStartDateChanged, setExperiencesStartDateChanged] = useState(false);
  const [experiencesStartDateError, setExperiencesStartDateError] = useState('');
  const [experiencesEndDate, setExperiencesEndDate] = useState('');
  const [experiencesEndDateInputType, setExperiencesEndDateInputType] = useState('text');
  const [experiencesEndDateChanged, setExperiencesEndDateChanged] = useState(false);
  const [experiencesEndDateError, setExperiencesEndDateError] = useState('');
  const [experiencesEndDatePresent, setExperiencesEndDatePresent] = useState(false);
  const [experiencesEndDatePresentChanged, setExperiencesEndDatePresentChanged] = useState(false);
  const [experiencesDescription, setExperiencesDescription] = useState('');
  const [experiencesDescriptionChanged, setExperiencesDescriptionChanged] = useState(false);
  const [experiencesDescriptionError, setExperiencesDescriptionError] = useState('');
  const [experiencesShowDeleteExperienceModal, setExperiencesShowDeleteExperienceModal] = useState(false);
   // const [experiencesStartDateMonthChanged, setExperiencesStartDateMonthChanged] = useState(false);
  // const [experiencesStartDateMonthError, setExperiencesStartDateMonthError] = useState('');
  // const [experiencesStartDateYear, setExperiencesStartDateYear] = useState('');
  // const [experiencesStartDateYearChanged, setExperiencesStartDateYearChanged] = useState(false);
  // const [experiencesStartDateYearError, setExperiencesStartDateYearError] = useState('');
  // const [experiencesEndDateMonth, setExperiencesEndDateMonth] = useState('');
  // const [experiencesEndDateMonthChanged, setExperiencesEndDateMonthChanged] = useState(false);
  // const [experiencesEndDateMonthError, setExperiencesEndDateMonthError] = useState('');
  // const [experiencesEndDateYear, setExperiencesEndDateYear] = useState('');
  // const [experiencesEndDateYearChanged, setExperiencesEndDateYearChanged] = useState(false);
  // const [experiencesEndDateYearError, setExperiencesEndDateYearError] = useState('');

  useEffect(() => {
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setUser(user.uid)
        } 
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const resetFields = () => {
    setEditProfileModalIndex('')
    setBasicInfoFirstName('')
    setBasicInfoFirstNameChanged(false)
    setBasicInfoFirstNameError('')
    setBasicInfoLastName('')
    setBasicInfoLastNameChanged(false)
    setBasicInfoLastNameError('')
    setBasicInfoHeadline('')
    setBasicInfoHeadlineChanged(false)
    setBasicInfoHeadlineError('')
    setAbout('')
    setAboutChanged(false)
    setAboutError('')
    setExperiencesCompany('')
    setExperiencesCompanyChanged(false)
    setExperiencesCompanyError('')
    setExperiencesTitle('')
    setExperiencesTitleChanged(false)
    setExperiencesTitleError('')
    setExperiencesLocation('')
    setExperiencesLocationChanged(false)
    setExperiencesLocationError('')
    setExperiencesStartDate('')
    setExperiencesStartDateInputType('text')
    setExperiencesStartDateChanged(false)
    setExperiencesStartDateError('')
    setExperiencesEndDate('')
    setExperiencesEndDateInputType('text')
    setExperiencesEndDateChanged(false)
    setExperiencesEndDateError('')
    setExperiencesEndDatePresent(false)
    setExperiencesEndDatePresentChanged(false)
    setExperiencesDescription('')
    setExperiencesDescriptionChanged(false)
    setExperiencesDescriptionError('')
    setExperiencesShowDeleteExperienceModal(false)
    // setExperiencesStartDateMonth('')
    // setExperiencesStartDateMonthChanged(false)
    // setExperiencesStartDateMonthError('')
    // setExperiencesStartDateYear('')
    // setExperiencesStartDateYearChanged(false)
    // setExperiencesStartDateYearError('')
    // setExperiencesEndDateMonth('')
    // setExperiencesEndDateMonthChanged(false)
    // setExperiencesEndDateMonthError('')
    // setExperiencesEndDateYear('')
    // setExperiencesEndDateYearChanged(false)
    // setExperiencesEndDateYearError('')
  }

  const handleClick = (title) => {
    handleEditProfileChangeView(title)
  }

  const handleBack = () => {
    resetFields()
    if (editProfileModalState == "Add experience" || editProfileModalState == "Edit experience") {
      handleEditProfileChangeView('Experience')
    } 
    else {
      handleEditProfileChangeView('default')
    }
  }

  const handleClose = () => {
    resetFields()
    handleEditProfileClose();
  };

  const editProfileOptions = [
    {
      "id": 0,
      "title": "Basic information",
    },
    {
      "id": 1,
      "title": "About",
    },
    {
      "id": 2,
      "title": "Experience",
    },
    {
      "id": 3,
      "title": "Education",
    },
    {
      "id": 4,
      "title": "Volunteering",
    },
    {
      "id": 5,
      "title": "Skills",
    }
  ]

  return (
    <>

      <Modal
        show={showEditProfileModal} 
        onHide={handleEditProfileClose}
        // backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center" style={{gap: '8px'}}>
            {editProfileModalState !== 'default' ?
            <button onClick={handleBack} className="btn dark low small icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.ARROW_LEFT}></path>
              </svg>
            </button>
            : '' 
            }
            <h5 className="text-dark-high font-weight-bold mb-0">{editProfileModalState == 'default' ? 'Edit profile' : editProfileModalState}</h5>
          </div>
          <button onClick={handleClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header>
        <>
        { editProfileModalState == 'default' && (
          <>
          {editProfileOptions.map((option) =>
            <button key={option.id} onClick={() => handleClick(option.title)} className={`${styles.menuOption} d-flex flex-row justify-content-between align-items-center p-4`}>
              <p className="font-weight-medium text-dark-high large m-0">
                {option.title}
              </p>
              <Icon icon={ICONS.ARROW_RIGHT} size='20' className="iconDarkHigh" />
            </button>
          )}
          </>
        )}
        { editProfileModalState == 'Basic information' && (
          <BasicInformation 
            user={user}
            basicInfoFirstName={basicInfoFirstName}
            basicInfoFirstNameChanged={basicInfoFirstNameChanged}
            basicInfoFirstNameError={basicInfoFirstNameError}
            basicInfoLastName={basicInfoLastName}
            basicInfoLastNameChanged={basicInfoLastNameChanged}
            basicInfoLastNameError={basicInfoLastNameError}
            basicInfoHeadline={basicInfoHeadline}
            basicInfoHeadlineChanged={basicInfoHeadlineChanged}
            basicInfoHeadlineError={basicInfoHeadlineError}
            setBasicInfoFirstName={setBasicInfoFirstName}
            setBasicInfoFirstNameChanged={setBasicInfoFirstNameChanged}
            setBasicInfoFirstNameError={setBasicInfoFirstNameError}
            setBasicInfoLastName={setBasicInfoLastName}
            setBasicInfoLastNameChanged={setBasicInfoLastNameChanged}
            setBasicInfoLastNameError={setBasicInfoLastNameError}
            setBasicInfoHeadline={setBasicInfoHeadline}
            setBasicInfoHeadlineChanged={setBasicInfoHeadlineChanged}
            setBasicInfoHeadlineError={setBasicInfoHeadlineError}
          />
        )}
        { editProfileModalState == 'About' && (
          <About 
            user={user}
            about={about}
            aboutChanged={aboutChanged}
            aboutError={aboutError}
            setAbout={setAbout}
            setAboutChanged={setAboutChanged}
            setAboutError={setAboutError}
          />
        )}
        { editProfileModalState == 'Experience' && (
          <Experience
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
            about={about}
            aboutChanged={aboutChanged}
            aboutError={aboutError}
            setAbout={setAbout}
            setAboutChanged={setAboutChanged}
            setAboutError={setAboutError}
          />
        )}
        { editProfileModalState == 'Edit experience' && (
          <>
          <EditExperience 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            experiencesCompany={experiencesCompany}
            setExperiencesCompany={setExperiencesCompany}
            experiencesCompanyChanged={experiencesCompanyChanged}
            setExperiencesCompanyChanged={setExperiencesCompanyChanged}
            experiencesCompanyError={experiencesCompanyError}
            setExperiencesCompanyError={setExperiencesCompanyError}
            experiencesTitle={experiencesTitle}
            setExperiencesTitle={setExperiencesTitle}
            experiencesTitleChanged={experiencesTitleChanged}
            setExperiencesTitleChanged={setExperiencesTitleChanged}
            experiencesTitleError={experiencesTitleError}
            setExperiencesTitleError={setExperiencesTitleError}
            experiencesLocation={experiencesLocation}
            setExperiencesLocation={setExperiencesLocation}
            experiencesLocationChanged={experiencesLocationChanged}
            setExperiencesLocationChanged={setExperiencesLocationChanged}
            experiencesLocationError={experiencesLocationError}
            setExperiencesLocationError={setExperiencesLocationError}
            experiencesStartDate={experiencesStartDate}
            setExperiencesStartDate={setExperiencesStartDate}
            experiencesStartDateInputType={experiencesStartDateInputType}
            setExperiencesStartDateInputType={setExperiencesStartDateInputType}
            experiencesStartDateChanged={experiencesStartDateChanged}
            setExperiencesStartDateChanged={setExperiencesStartDateChanged}
            experiencesStartDateError={experiencesStartDateError}
            setExperiencesStartDateError={setExperiencesStartDateError}
            experiencesEndDate={experiencesEndDate}
            setExperiencesEndDate={setExperiencesEndDate}
            experiencesEndDateInputType={experiencesEndDateInputType}
            setExperiencesEndDateInputType={setExperiencesEndDateInputType}
            experiencesEndDateChanged={experiencesEndDateChanged}
            setExperiencesEndDateChanged={setExperiencesEndDateChanged}
            experiencesEndDateError={experiencesEndDateError}
            setExperiencesEndDateError={setExperiencesEndDateError}
            experiencesEndDatePresent={experiencesEndDatePresent}
            setExperiencesEndDatePresent={setExperiencesEndDatePresent}
            experiencesEndDatePresentChanged={experiencesEndDatePresentChanged}
            setExperiencesEndDatePresentChanged={setExperiencesEndDatePresentChanged}
            experiencesDescription={experiencesDescription}
            setExperiencesDescription={setExperiencesDescription}
            experiencesDescriptionChanged={experiencesDescriptionChanged}
            setExperiencesDescriptionChanged={setExperiencesDescriptionChanged}
            experiencesDescriptionError={experiencesDescriptionError}
            setExperiencesDescriptionError={setExperiencesDescriptionError}
            experiencesShowDeleteExperienceModal={experiencesShowDeleteExperienceModal}
            setExperiencesShowDeleteExperienceModal={setExperiencesShowDeleteExperienceModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Add experience' && (
          <>
          <AddExperience 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            experiencesCompany={experiencesCompany}
            setExperiencesCompany={setExperiencesCompany}
            experiencesCompanyChanged={experiencesCompanyChanged}
            setExperiencesCompanyChanged={setExperiencesCompanyChanged}
            experiencesCompanyError={experiencesCompanyError}
            setExperiencesCompanyError={setExperiencesCompanyError}
            experiencesTitle={experiencesTitle}
            setExperiencesTitle={setExperiencesTitle}
            experiencesTitleChanged={experiencesTitleChanged}
            setExperiencesTitleChanged={setExperiencesTitleChanged}
            experiencesTitleError={experiencesTitleError}
            setExperiencesTitleError={setExperiencesTitleError}
            experiencesLocation={experiencesLocation}
            setExperiencesLocation={setExperiencesLocation}
            experiencesLocationChanged={experiencesLocationChanged}
            setExperiencesLocationChanged={setExperiencesLocationChanged}
            experiencesLocationError={experiencesLocationError}
            setExperiencesLocationError={setExperiencesLocationError}
            experiencesStartDate={experiencesStartDate}
            setExperiencesStartDate={setExperiencesStartDate}
            experiencesStartDateInputType={experiencesStartDateInputType}
            setExperiencesStartDateInputType={setExperiencesStartDateInputType}
            experiencesStartDateChanged={experiencesStartDateChanged}
            setExperiencesStartDateChanged={setExperiencesStartDateChanged}
            experiencesStartDateError={experiencesStartDateError}
            setExperiencesStartDateError={setExperiencesStartDateError}
            experiencesEndDate={experiencesEndDate}
            setExperiencesEndDate={setExperiencesEndDate}
            experiencesEndDateInputType={experiencesEndDateInputType}
            setExperiencesEndDateInputType={setExperiencesEndDateInputType}
            experiencesEndDateChanged={experiencesEndDateChanged}
            setExperiencesEndDateChanged={setExperiencesEndDateChanged}
            experiencesEndDateError={experiencesEndDateError}
            setExperiencesEndDateError={setExperiencesEndDateError}
            experiencesEndDatePresent={experiencesEndDatePresent}
            setExperiencesEndDatePresent={setExperiencesEndDatePresent}
            experiencesEndDatePresentChanged={experiencesEndDatePresentChanged}
            setExperiencesEndDatePresentChanged={setExperiencesEndDatePresentChanged}
            experiencesDescription={experiencesDescription}
            setExperiencesDescription={setExperiencesDescription}
            experiencesDescriptionChanged={experiencesDescriptionChanged}
            setExperiencesDescriptionChanged={setExperiencesDescriptionChanged}
            experiencesDescriptionError={experiencesDescriptionError}
            setExperiencesDescriptionError={setExperiencesDescriptionError}
            experiencesShowDeleteExperienceModal={experiencesShowDeleteExperienceModal}
            setExperiencesShowDeleteExperienceModal={setExperiencesShowDeleteExperienceModal}
            handleBack={handleBack}
          />
          </>
        )}
        </>
      </Modal>
    </>
  )
}

export default EditProfile;