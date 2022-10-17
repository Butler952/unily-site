import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import fire from '../../config/fire-config';
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';
import BasicInformation from './BasicInformation';
import About from './About';
import Experience from './Experience';
import EditExperience from './EditExperience';
import AddExperience from './AddExperience';
import Education from './Education';
import EditEducation from './EditEducation';
import AddEducation from './AddEducation';
import EditVolunteering from './EditVolunteering';
import Volunteering from './Volunteering';
import AddVolunteering from './AddVolunteering';
import Links from './Links';
import AddLink from './AddLink';
import EditLink from './EditLink';
import styles from './EditProfile.module.scss'
import Projects from './Projects';
import AddProject from './AddProject';
import EditProject from './EditProject';

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

  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [profilePictureUrlChanged, setProfilePictureUrlChanged] = useState(false);

  const [linksContact, setLinksContact] = useState('');
  const [linksContactChanged, setLinksContactChanged] = useState(false);
  const [linksContactError, setLinksContactError] = useState('');
  const [linksContactShow, setLinksContactShow] = useState(false);
  const [linksContactShowChanged, setLinksContactShowChanged] = useState(false);
  const [linksLabel, setLinksLabel] = useState('');
  const [linksLabelChanged, setLinksLabelChanged] = useState(false);
  const [linksLabelError, setLinksLabelError] = useState('');
  const [linksUrl, setLinksUrl] = useState('');
  const [linksUrlChanged, setLinksUrlChanged] = useState(false);
  const [linksUrlError, setLinksUrlError] = useState('');
  const [linksShowDeleteLinkModal, setLinksShowDeleteLinkModal] = useState(false);

  const [about, setAbout] = useState('');
  const [aboutChanged, setAboutChanged] = useState(false);
  const [aboutError, setAboutError] = useState('');

  const [experiencesLogo, setExperiencesLogo] = useState('');
  const [experiencesLogoChanged, setExperiencesLogoChanged] = useState(false);
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
  const [experiencesUrl, setExperiencesUrl] = useState('');
  const [experiencesUrlChanged, setExperiencesUrlChanged] = useState(false);
  const [experiencesUrlError, setExperiencesUrlError] = useState('');
  const [experiencesDescription, setExperiencesDescription] = useState('');
  const [experiencesDescriptionChanged, setExperiencesDescriptionChanged] = useState(false);
  const [experiencesDescriptionError, setExperiencesDescriptionError] = useState('');
  const [experiencesShowDeleteExperienceModal, setExperiencesShowDeleteExperienceModal] = useState(false);

  const [educationLogo, setEducationLogo] = useState('');
  const [educationLogoChanged, setEducationLogoChanged] = useState(false);
  const [educationSchool, setEducationSchool] = useState('');
  const [educationSchoolChanged, setEducationSchoolChanged] = useState(false);
  const [educationSchoolError, setEducationSchoolError] = useState('');
  const [educationFieldOfStudy, setEducationFieldOfStudy] = useState('');
  const [educationFieldOfStudyChanged, setEducationFieldOfStudyChanged] = useState(false);
  const [educationFieldOfStudyError, setEducationFieldOfStudyError] = useState('');
  const [educationDegreeName, setEducationDegreeName] = useState('');
  const [educationDegreeNameChanged, setEducationDegreeNameChanged] = useState(false);
  const [educationDegreeNameError, setEducationDegreeNameError] = useState('');
  const [educationLocation, setEducationLocation] = useState('');
  const [educationLocationChanged, setEducationLocationChanged] = useState(false);
  const [educationLocationError, setEducationLocationError] = useState('');
  const [educationStartDate, setEducationStartDate] = useState('');
  const [educationStartDateInputType, setEducationStartDateInputType] = useState('text');
  const [educationStartDateChanged, setEducationStartDateChanged] = useState(false);
  const [educationStartDateError, setEducationStartDateError] = useState('');
  const [educationEndDate, setEducationEndDate] = useState('');
  const [educationEndDateInputType, setEducationEndDateInputType] = useState('text');
  const [educationEndDateChanged, setEducationEndDateChanged] = useState(false);
  const [educationEndDateError, setEducationEndDateError] = useState('');
  const [educationEndDatePresent, setEducationEndDatePresent] = useState(false);
  const [educationEndDatePresentChanged, setEducationEndDatePresentChanged] = useState(false);
  const [educationUrl, setEducationUrl] = useState('');
  const [educationUrlChanged, setEducationUrlChanged] = useState(false);
  const [educationUrlError, setEducationUrlError] = useState('');
  const [educationDescription, setEducationDescription] = useState('');
  const [educationDescriptionChanged, setEducationDescriptionChanged] = useState(false);
  const [educationDescriptionError, setEducationDescriptionError] = useState('');
  const [educationShowDeleteEducationModal, setEducationShowDeleteEducationModal] = useState(false);

  const [volunteeringLogo, setVolunteeringLogo] = useState('');
  const [volunteeringLogoChanged, setVolunteeringLogoChanged] = useState(false);
  const [volunteeringCompany, setVolunteeringCompany] = useState('');
  const [volunteeringCompanyChanged, setVolunteeringCompanyChanged] = useState(false);
  const [volunteeringCompanyError, setVolunteeringCompanyError] = useState('');
  const [volunteeringTitle, setVolunteeringTitle] = useState('');
  const [volunteeringTitleChanged, setVolunteeringTitleChanged] = useState(false);
  const [volunteeringTitleError, setVolunteeringTitleError] = useState('');
  const [volunteeringLocation, setVolunteeringLocation] = useState('');
  const [volunteeringLocationChanged, setVolunteeringLocationChanged] = useState(false);
  const [volunteeringLocationError, setVolunteeringLocationError] = useState('');
  const [volunteeringStartDate, setVolunteeringStartDate] = useState('');
  const [volunteeringStartDateInputType, setVolunteeringStartDateInputType] = useState('text');
  const [volunteeringStartDateChanged, setVolunteeringStartDateChanged] = useState(false);
  const [volunteeringStartDateError, setVolunteeringStartDateError] = useState('');
  const [volunteeringEndDate, setVolunteeringEndDate] = useState('');
  const [volunteeringEndDateInputType, setVolunteeringEndDateInputType] = useState('text');
  const [volunteeringEndDateChanged, setVolunteeringEndDateChanged] = useState(false);
  const [volunteeringEndDateError, setVolunteeringEndDateError] = useState('');
  const [volunteeringEndDatePresent, setVolunteeringEndDatePresent] = useState(false);
  const [volunteeringEndDatePresentChanged, setVolunteeringEndDatePresentChanged] = useState(false);
  const [volunteeringUrl, setVolunteeringUrl] = useState('');
  const [volunteeringUrlChanged, setVolunteeringUrlChanged] = useState(false);
  const [volunteeringUrlError, setVolunteeringUrlError] = useState('');
  const [volunteeringDescription, setVolunteeringDescription] = useState('');
  const [volunteeringDescriptionChanged, setVolunteeringDescriptionChanged] = useState(false);
  const [volunteeringDescriptionError, setVolunteeringDescriptionError] = useState('');
  const [volunteeringShowDeleteVolunteeringModal, setVolunteeringShowDeleteVolunteeringModal] = useState(false);

  const [projectsImage, setProjectsImage] = useState('');
  const [projectsImageChanged, setProjectsImageChanged] = useState(false);
  const [projectsName, setProjectsName] = useState('');
  const [projectsNameChanged, setProjectsNameChanged] = useState(false);
  const [projectsNameError, setProjectsNameError] = useState('');
  const [projectsUrl, setProjectsUrl] = useState('');
  const [projectsUrlChanged, setProjectsUrlChanged] = useState(false);
  const [projectsUrlError, setProjectsUrlError] = useState('');
  const [projectsStartDate, setProjectsStartDate] = useState('');
  const [projectsStartDateInputType, setProjectsStartDateInputType] = useState('text');
  const [projectsStartDateChanged, setProjectsStartDateChanged] = useState(false);
  const [projectsStartDateError, setProjectsStartDateError] = useState('');
  const [projectsEndDate, setProjectsEndDate] = useState('');
  const [projectsEndDateInputType, setProjectsEndDateInputType] = useState('text');
  const [projectsEndDateChanged, setProjectsEndDateChanged] = useState(false);
  const [projectsEndDateError, setProjectsEndDateError] = useState('');
  const [projectsEndDatePresent, setProjectsEndDatePresent] = useState(false);
  const [projectsEndDatePresentChanged, setProjectsEndDatePresentChanged] = useState(false);
  const [projectsDescription, setProjectsDescription] = useState('');
  const [projectsDescriptionChanged, setProjectsDescriptionChanged] = useState(false);
  const [projectsDescriptionError, setProjectsDescriptionError] = useState('');
  const [projectsShowDeleteProjectModal, setProjectsShowDeleteProjectModal] = useState(false);

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
    setProfilePictureUrl('')
    setProfilePictureUrlChanged(false)
    setLinksContact('')
    setLinksContactChanged(false)
    setLinksContactError('')
    setLinksContactShow(false)
    setLinksContactShowChanged(false)
    setLinksLabel('')
    setLinksLabelChanged(false)
    setLinksLabelError('')
    setLinksUrl('')
    setLinksUrlChanged(false)
    setLinksUrlError('')
    setLinksShowDeleteLinkModal(false)
    setAbout('')
    setAboutChanged(false)
    setAboutError('')
    setExperiencesLogo('')
    setExperiencesLogoChanged(false)
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
    setExperiencesUrl('')
    setExperiencesUrlChanged(false)
    setExperiencesUrlError('')
    setExperiencesDescription('')
    setExperiencesDescriptionChanged(false)
    setExperiencesDescriptionError('')
    setExperiencesShowDeleteExperienceModal(false)
    setEducationLogo(''),
    setEducationLogoChanged(false),
    setEducationSchool('')
    setEducationSchoolChanged(false)
    setEducationSchoolError('')
    setEducationFieldOfStudy('')
    setEducationFieldOfStudyChanged(false)
    setEducationFieldOfStudyError('')
    setEducationDegreeName('')
    setEducationDegreeNameChanged(false)
    setEducationDegreeNameError('')
    setEducationLocation('')
    setEducationLocationChanged(false)
    setEducationLocationError('')
    setEducationStartDate('')
    setEducationStartDateInputType('text')
    setEducationStartDateChanged(false)
    setEducationStartDateError('')
    setEducationEndDate('')
    setEducationEndDateInputType('text')
    setEducationEndDateChanged(false)
    setEducationEndDateError('')
    setEducationEndDatePresent(false)
    setEducationEndDatePresentChanged(false)
    setEducationUrl('')
    setEducationUrlChanged(false)
    setEducationUrlError('')
    setEducationDescription('')
    setEducationDescriptionChanged(false)
    setEducationDescriptionError('')
    setEducationShowDeleteEducationModal(false)
    setVolunteeringLogo('')
    setVolunteeringLogoChanged(false)
    setVolunteeringCompany('')
    setVolunteeringCompanyChanged(false)
    setVolunteeringCompanyError('')
    setVolunteeringTitle('')
    setVolunteeringTitleChanged(false)
    setVolunteeringTitleError('')
    setVolunteeringLocation('')
    setVolunteeringLocationChanged(false)
    setVolunteeringLocationError('')
    setVolunteeringStartDate('')
    setVolunteeringStartDateInputType('text')
    setVolunteeringStartDateChanged(false)
    setVolunteeringStartDateError('')
    setVolunteeringEndDate('')
    setVolunteeringEndDateInputType('text')
    setVolunteeringEndDateChanged(false)
    setVolunteeringEndDateError('')
    setVolunteeringEndDatePresent(false)
    setVolunteeringEndDatePresentChanged(false)
    setVolunteeringUrl('')
    setVolunteeringUrlChanged(false)
    setVolunteeringUrlError('')
    setVolunteeringDescription('')
    setVolunteeringDescriptionChanged(false)
    setVolunteeringDescriptionError('')
    setVolunteeringShowDeleteVolunteeringModal(false)
    setProjectsImage('')
    setProjectsImageChanged(false)
    setProjectsName('')
    setProjectsNameChanged(false)
    setProjectsNameError('')
    setProjectsUrl('')
    setProjectsUrlChanged(false)
    setProjectsUrlError('')
    setProjectsStartDate('')
    setProjectsStartDateInputType('text')
    setProjectsStartDateChanged(false)
    setProjectsStartDateError('')
    setProjectsEndDate('')
    setProjectsEndDateInputType('text')
    setProjectsEndDateChanged(false)
    setProjectsEndDateError('')
    setProjectsEndDatePresent(false)
    setProjectsEndDatePresentChanged(false)
    setProjectsDescription('')
    setProjectsDescriptionChanged(false)
    setProjectsDescriptionError('')
    setProjectsShowDeleteProjectModal(false)
  }

  const handleClick = (title) => {
    handleEditProfileChangeView(title)
  }

  const handleBack = () => {
    resetFields();
    (editProfileModalState == "Add experience" || editProfileModalState == "Edit experience") ? handleEditProfileChangeView('Experience') : (
      (editProfileModalState == "Add education" || editProfileModalState == "Edit education") ? handleEditProfileChangeView('Education') : (
        (editProfileModalState == "Add volunteering" || editProfileModalState == "Edit volunteering") ? handleEditProfileChangeView('Volunteering') : (
          (editProfileModalState == "Add link" || editProfileModalState == "Edit link") ? handleEditProfileChangeView('Links') : (
            (editProfileModalState == "Add project" || editProfileModalState == "Edit project") ? handleEditProfileChangeView('Projects') : handleEditProfileChangeView('default')
          )
        )
      )
    )
  }

  const handleClose = () => {
    resetFields()
    handleEditProfileClose();
  };

  const editProfileOptions = [
    {
      "id": 0,
      "title": "Basic information",
      "icon": ICONS.USER
    },
    {
      "id": 1,
      "title": "Links",
      "icon": ICONS.LINK
    },
    {
      "id": 2,
      "title": "About",
      "icon": ICONS.ABOUT
    },
    {
      "id": 3,
      "title": "Experience",
      "icon": ICONS.WORK
    },
    {
      "id": 4,
      "title": "Projects",
      "icon": ICONS.PROJECTS
    },
    {
      "id": 5,
      "title": "Education",
      "icon": ICONS.SCHOOL
    },
    {
      "id": 6,
      "title": "Volunteering",
      "icon": ICONS.VOLUNTEERING
    },
    // {
    //   "id": 5,
    //   "title": "Skills",
    // }
  ]

  return (
    <>

      <Modal
        show={showEditProfileModal} 
        onHide={handleEditProfileClose}
        backdrop="static"
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
              <div className="d-flex flex-row align-items-center" style={{gap: '16px'}}>
                <Icon icon={option.icon} size='24' className="fill-dark-900" />
                <p className="font-weight-medium text-dark-high large m-0">
                  {option.title}
                </p>
              </div>
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
            profilePictureUrl={profilePictureUrl}
            setProfilePictureUrl={setProfilePictureUrl}
            profilePictureUrlChanged={profilePictureUrlChanged}
            setProfilePictureUrlChanged={setProfilePictureUrlChanged}
          />
        )}
        { editProfileModalState == 'Links' && (
          <Links
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add link' && (
          <>
          <AddLink
            user={user}
            linksLabel={linksLabel}
            setLinksLabel={setLinksLabel}
            linksLabelChanged={linksLabelChanged}
            setLinksLabelChanged={setLinksLabelChanged}
            linksLabelError={linksLabelError}
            setLinksLabelError={setLinksLabelError}
            linksUrl={linksUrl}
            setLinksUrl={setLinksUrl}
            linksUrlChanged={linksUrlChanged}
            setLinksUrlChanged={setLinksUrlChanged}
            linksUrlError={linksUrlError}
            setLinksUrlError={setLinksUrlError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit link' && (
          <EditLink
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            linksLabel={linksLabel}
            setLinksLabel={setLinksLabel}
            linksLabelChanged={linksLabelChanged}
            setLinksLabelChanged={setLinksLabelChanged}
            linksLabelError={linksLabelError}
            setLinksLabelError={setLinksLabelError}
            linksUrl={linksUrl}
            setLinksUrl={setLinksUrl}
            linksUrlChanged={linksUrlChanged}
            setLinksUrlChanged={setLinksUrlChanged}
            linksUrlError={linksUrlError}
            setLinksUrlError={setLinksUrlError}
            linksShowDeleteLinkModal={linksShowDeleteLinkModal}
            setLinksShowDeleteLinkModal={setLinksShowDeleteLinkModal}
            handleBack={handleBack}
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
          />
        )}
        { editProfileModalState == 'Edit experience' && (
          <>
          <EditExperience 
            user={user}
            experiencesLogo={experiencesLogo}
            setExperiencesLogo={setExperiencesLogo}
            experiencesLogoChanged={experiencesLogoChanged}
            setExperiencesLogoChanged={setExperiencesLogoChanged}
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
            experiencesUrl={experiencesUrl}
            setExperiencesUrl={setExperiencesUrl}
            experiencesUrlChanged={experiencesUrlChanged}
            setExperiencesUrlChanged={setExperiencesUrlChanged}
            experiencesUrlError={experiencesUrlError}
            setExperiencesUrlError={setExperiencesUrlError}
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
            experiencesLogo={experiencesLogo}
            setExperiencesLogo={setExperiencesLogo}
            experiencesLogoChanged={experiencesLogoChanged}
            setExperiencesLogoChanged={setExperiencesLogoChanged}
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
            experiencesUrl={experiencesUrl}
            setExperiencesUrl={setExperiencesUrl}
            experiencesUrlChanged={experiencesUrlChanged}
            setExperiencesUrlChanged={setExperiencesUrlChanged}
            experiencesUrlError={experiencesUrlError}
            setExperiencesUrlError={setExperiencesUrlError}
            experiencesDescription={experiencesDescription}
            setExperiencesDescription={setExperiencesDescription}
            experiencesDescriptionChanged={experiencesDescriptionChanged}
            setExperiencesDescriptionChanged={setExperiencesDescriptionChanged}
            experiencesDescriptionError={experiencesDescriptionError}
            setExperiencesDescriptionError={setExperiencesDescriptionError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Projects' && (
          <Projects
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add project' && (
          <>
          <AddProject 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            projectsImage={projectsImage}
            setProjectsImage={setProjectsImage}
            projectsImageChanged={projectsImageChanged}
            setProjectsImageChanged={setProjectsImageChanged}
            projectsName={projectsName}
            setProjectsName={setProjectsName}
            projectsNameChanged={projectsNameChanged}
            setProjectsNameChanged={setProjectsNameChanged}
            projectsNameError={projectsNameError}
            setProjectsNameError={setProjectsNameError}
            projectsUrl={projectsUrl}
            setProjectsUrl={setProjectsUrl}
            projectsUrlChanged={projectsUrlChanged}
            setProjectsUrlChanged={setProjectsUrlChanged}
            projectsUrlError={projectsUrlError}
            setProjectsUrlError={setProjectsUrlError}
            projectsStartDate={projectsStartDate}
            setProjectsStartDate={setProjectsStartDate}
            projectsStartDateInputType={projectsStartDateInputType}
            setProjectsStartDateInputType={setProjectsStartDateInputType}
            projectsStartDateChanged={projectsStartDateChanged}
            setProjectsStartDateChanged={setProjectsStartDateChanged}
            projectsStartDateError={projectsStartDateError}
            setProjectsStartDateError={setProjectsStartDateError}
            projectsEndDate={projectsEndDate}
            setProjectsEndDate={setProjectsEndDate}
            projectsEndDateInputType={projectsEndDateInputType}
            setProjectsEndDateInputType={setProjectsEndDateInputType}
            projectsEndDateChanged={projectsEndDateChanged}
            setProjectsEndDateChanged={setProjectsEndDateChanged}
            projectsEndDateError={projectsEndDateError}
            setProjectsEndDateError={setProjectsEndDateError}
            projectsEndDatePresent={projectsEndDatePresent}
            setProjectsEndDatePresent={setProjectsEndDatePresent}
            projectsEndDatePresentChanged={projectsEndDatePresentChanged}
            setProjectsEndDatePresentChanged={setProjectsEndDatePresentChanged}
            projectsDescription={projectsDescription}
            setProjectsDescription={setProjectsDescription}
            projectsDescriptionChanged={projectsDescriptionChanged}
            setProjectsDescriptionChanged={setProjectsDescriptionChanged}
            projectsDescriptionError={projectsDescriptionError}
            setProjectsDescriptionError={setProjectsDescriptionError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit project' && (
          <>
          <EditProject
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            projectsImage={projectsImage}
            setProjectsImage={setProjectsImage}
            projectsImageChanged={projectsImageChanged}
            setProjectsImageChanged={setProjectsImageChanged}
            projectsName={projectsName}
            setProjectsName={setProjectsName}
            projectsNameChanged={projectsNameChanged}
            setProjectsNameChanged={setProjectsNameChanged}
            projectsNameError={projectsNameError}
            setProjectsNameError={setProjectsNameError}
            projectsUrl={projectsUrl}
            setProjectsUrl={setProjectsUrl}
            projectsUrlChanged={projectsUrlChanged}
            setProjectsUrlChanged={setProjectsUrlChanged}
            projectsUrlError={projectsUrlError}
            setProjectsUrlError={setProjectsUrlError}
            projectsStartDate={projectsStartDate}
            setProjectsStartDate={setProjectsStartDate}
            projectsStartDateInputType={projectsStartDateInputType}
            setProjectsStartDateInputType={setProjectsStartDateInputType}
            projectsStartDateChanged={projectsStartDateChanged}
            setProjectsStartDateChanged={setProjectsStartDateChanged}
            projectsStartDateError={projectsStartDateError}
            setProjectsStartDateError={setProjectsStartDateError}
            projectsEndDate={projectsEndDate}
            setProjectsEndDate={setProjectsEndDate}
            projectsEndDateInputType={projectsEndDateInputType}
            setProjectsEndDateInputType={setProjectsEndDateInputType}
            projectsEndDateChanged={projectsEndDateChanged}
            setProjectsEndDateChanged={setProjectsEndDateChanged}
            projectsEndDateError={projectsEndDateError}
            setProjectsEndDateError={setProjectsEndDateError}
            projectsEndDatePresent={projectsEndDatePresent}
            setProjectsEndDatePresent={setProjectsEndDatePresent}
            projectsEndDatePresentChanged={projectsEndDatePresentChanged}
            setProjectsEndDatePresentChanged={setProjectsEndDatePresentChanged}
            projectsDescription={projectsDescription}
            setProjectsDescription={setProjectsDescription}
            projectsDescriptionChanged={projectsDescriptionChanged}
            setProjectsDescriptionChanged={setProjectsDescriptionChanged}
            projectsDescriptionError={projectsDescriptionError}
            setProjectsDescriptionError={setProjectsDescriptionError}
            projectsShowDeleteProjectModal={projectsShowDeleteProjectModal}
            setProjectsShowDeleteProjectModal={setProjectsShowDeleteProjectModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Education' && (
          <Education
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Edit education' && (
          <>
          <EditEducation 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            educationLogo={educationLogo}
            setEducationLogo={setEducationLogo}
            educationLogoChanged={educationLogoChanged}
            setEducationLogoChanged={setEducationLogoChanged}
            educationSchool={educationSchool}
            setEducationSchool={setEducationSchool}
            educationSchoolChanged={educationSchoolChanged}
            setEducationSchoolChanged={setEducationSchoolChanged}
            educationSchoolError={educationSchoolError}
            setEducationSchoolError={setEducationSchoolError}
            educationFieldOfStudy={educationFieldOfStudy}
            setEducationFieldOfStudy={setEducationFieldOfStudy}
            educationFieldOfStudyChanged={educationFieldOfStudyChanged}
            setEducationFieldOfStudyChanged={setEducationFieldOfStudyChanged}
            educationFieldOfStudyError={educationFieldOfStudyError}
            setEducationFieldOfStudyError={setEducationFieldOfStudyError}
            educationDegreeName={educationDegreeName}
            setEducationDegreeName={setEducationDegreeName}
            educationDegreeNameChanged={educationDegreeNameChanged}
            setEducationDegreeNameChanged={setEducationDegreeNameChanged}
            educationDegreeNameError={educationDegreeNameError}
            setEducationDegreeNameError={setEducationDegreeNameError}
            educationLocation={educationLocation}
            setEducationLocation={setEducationLocation}
            educationLocationChanged={educationLocationChanged}
            setEducationLocationChanged={setEducationLocationChanged}
            educationLocationError={educationLocationError}
            setEducationLocationError={setEducationLocationError}
            educationStartDate={educationStartDate}
            setEducationStartDate={setEducationStartDate}
            educationStartDateInputType={educationStartDateInputType}
            setEducationStartDateInputType={setEducationStartDateInputType}
            educationStartDateChanged={educationStartDateChanged}
            setEducationStartDateChanged={setEducationStartDateChanged}
            educationStartDateError={educationStartDateError}
            setEducationStartDateError={setEducationStartDateError}
            educationEndDate={educationEndDate}
            setEducationEndDate={setEducationEndDate}
            educationEndDateInputType={educationEndDateInputType}
            setEducationEndDateInputType={setEducationEndDateInputType}
            educationEndDateChanged={educationEndDateChanged}
            setEducationEndDateChanged={setEducationEndDateChanged}
            educationEndDateError={educationEndDateError}
            setEducationEndDateError={setEducationEndDateError}
            educationEndDatePresent={educationEndDatePresent}
            setEducationEndDatePresent={setEducationEndDatePresent}
            educationEndDatePresentChanged={educationEndDatePresentChanged}
            setEducationEndDatePresentChanged={setEducationEndDatePresentChanged}
            educationUrl={educationUrl}
            setEducationUrl={setEducationUrl}
            educationUrlChanged={educationUrlChanged}
            setEducationUrlChanged={setEducationUrlChanged}
            educationUrlError={educationUrlError}
            setEducationUrlError={setEducationUrlError}
            educationDescription={educationDescription}
            setEducationDescription={setEducationDescription}
            educationDescriptionChanged={educationDescriptionChanged}
            setEducationDescriptionChanged={setEducationDescriptionChanged}
            educationDescriptionError={educationDescriptionError}
            setEducationDescriptionError={setEducationDescriptionError}
            educationShowDeleteEducationModal={educationShowDeleteEducationModal}
            setEducationShowDeleteEducationModal={setEducationShowDeleteEducationModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Add education' && (
          <>
          <AddEducation 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            educationLogo={educationLogo}
            setEducationLogo={setEducationLogo}
            educationLogoChanged={educationLogoChanged}
            setEducationLogoChanged={setEducationLogoChanged}
            educationSchool={educationSchool}
            setEducationSchool={setEducationSchool}
            educationSchoolChanged={educationSchoolChanged}
            setEducationSchoolChanged={setEducationSchoolChanged}
            educationSchoolError={educationSchoolError}
            setEducationSchoolError={setEducationSchoolError}
            educationFieldOfStudy={educationFieldOfStudy}
            setEducationFieldOfStudy={setEducationFieldOfStudy}
            educationFieldOfStudyChanged={educationFieldOfStudyChanged}
            setEducationFieldOfStudyChanged={setEducationFieldOfStudyChanged}
            educationFieldOfStudyError={educationFieldOfStudyError}
            setEducationFieldOfStudyError={setEducationFieldOfStudyError}
            educationDegreeName={educationDegreeName}
            setEducationDegreeName={setEducationDegreeName}
            educationDegreeNameChanged={educationDegreeNameChanged}
            setEducationDegreeNameChanged={setEducationDegreeNameChanged}
            educationDegreeNameError={educationDegreeNameError}
            setEducationDegreeNameError={setEducationDegreeNameError}
            educationLocation={educationLocation}
            setEducationLocation={setEducationLocation}
            educationLocationChanged={educationLocationChanged}
            setEducationLocationChanged={setEducationLocationChanged}
            educationLocationError={educationLocationError}
            setEducationLocationError={setEducationLocationError}
            educationStartDate={educationStartDate}
            setEducationStartDate={setEducationStartDate}
            educationStartDateInputType={educationStartDateInputType}
            setEducationStartDateInputType={setEducationStartDateInputType}
            educationStartDateChanged={educationStartDateChanged}
            setEducationStartDateChanged={setEducationStartDateChanged}
            educationStartDateError={educationStartDateError}
            setEducationStartDateError={setEducationStartDateError}
            educationEndDate={educationEndDate}
            setEducationEndDate={setEducationEndDate}
            educationEndDateInputType={educationEndDateInputType}
            setEducationEndDateInputType={setEducationEndDateInputType}
            educationEndDateChanged={educationEndDateChanged}
            setEducationEndDateChanged={setEducationEndDateChanged}
            educationEndDateError={educationEndDateError}
            setEducationEndDateError={setEducationEndDateError}
            educationEndDatePresent={educationEndDatePresent}
            setEducationEndDatePresent={setEducationEndDatePresent}
            educationEndDatePresentChanged={educationEndDatePresentChanged}
            setEducationEndDatePresentChanged={setEducationEndDatePresentChanged}
            educationUrl={educationUrl}
            setEducationUrl={setEducationUrl}
            educationUrlChanged={educationUrlChanged}
            setEducationUrlChanged={setEducationUrlChanged}
            educationUrlError={educationUrlError}
            setEducationUrlError={setEducationUrlError}
            educationDescription={educationDescription}
            setEducationDescription={setEducationDescription}
            educationDescriptionChanged={educationDescriptionChanged}
            setEducationDescriptionChanged={setEducationDescriptionChanged}
            educationDescriptionError={educationDescriptionError}
            setEducationDescriptionError={setEducationDescriptionError}
            educationShowDeleteEducationModal={educationShowDeleteEducationModal}
            setEducationShowDeleteEducationModal={setEducationShowDeleteEducationModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Volunteering' && (
          <Volunteering
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Edit volunteering' && (
          <>
          <EditVolunteering 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            volunteeringLogo={volunteeringLogo}
            setVolunteeringLogo={setVolunteeringLogo}
            volunteeringLogoChanged={volunteeringLogoChanged}
            setVolunteeringLogoChanged={setVolunteeringLogoChanged}
            volunteeringCompany={volunteeringCompany}
            setVolunteeringCompany={setVolunteeringCompany}
            volunteeringCompanyChanged={volunteeringCompanyChanged}
            setVolunteeringCompanyChanged={setVolunteeringCompanyChanged}
            volunteeringCompanyError={volunteeringCompanyError}
            setVolunteeringCompanyError={setVolunteeringCompanyError}
            volunteeringTitle={volunteeringTitle}
            setVolunteeringTitle={setVolunteeringTitle}
            volunteeringTitleChanged={volunteeringTitleChanged}
            setVolunteeringTitleChanged={setVolunteeringTitleChanged}
            volunteeringTitleError={volunteeringTitleError}
            setVolunteeringTitleError={setVolunteeringTitleError}
            volunteeringLocation={volunteeringLocation}
            setVolunteeringLocation={setVolunteeringLocation}
            volunteeringLocationChanged={volunteeringLocationChanged}
            setVolunteeringLocationChanged={setVolunteeringLocationChanged}
            volunteeringLocationError={volunteeringLocationError}
            setVolunteeringLocationError={setVolunteeringLocationError}
            volunteeringStartDate={volunteeringStartDate}
            setVolunteeringStartDate={setVolunteeringStartDate}
            volunteeringStartDateInputType={volunteeringStartDateInputType}
            setVolunteeringStartDateInputType={setVolunteeringStartDateInputType}
            volunteeringStartDateChanged={volunteeringStartDateChanged}
            setVolunteeringStartDateChanged={setVolunteeringStartDateChanged}
            volunteeringStartDateError={volunteeringStartDateError}
            setVolunteeringStartDateError={setVolunteeringStartDateError}
            volunteeringEndDate={volunteeringEndDate}
            setVolunteeringEndDate={setVolunteeringEndDate}
            volunteeringEndDateInputType={volunteeringEndDateInputType}
            setVolunteeringEndDateInputType={setVolunteeringEndDateInputType}
            volunteeringEndDateChanged={volunteeringEndDateChanged}
            setVolunteeringEndDateChanged={setVolunteeringEndDateChanged}
            volunteeringEndDateError={volunteeringEndDateError}
            setVolunteeringEndDateError={setVolunteeringEndDateError}
            volunteeringEndDatePresent={volunteeringEndDatePresent}
            setVolunteeringEndDatePresent={setVolunteeringEndDatePresent}
            volunteeringEndDatePresentChanged={volunteeringEndDatePresentChanged}
            setVolunteeringEndDatePresentChanged={setVolunteeringEndDatePresentChanged}
            volunteeringUrl={volunteeringUrl}
            setVolunteeringUrl={setVolunteeringUrl}
            volunteeringUrlChanged={volunteeringUrlChanged}
            setVolunteeringUrlChanged={setVolunteeringUrlChanged}
            volunteeringUrlError={volunteeringUrlError}
            setVolunteeringUrlError={setVolunteeringUrlError}
            volunteeringDescription={volunteeringDescription}
            setVolunteeringDescription={setVolunteeringDescription}
            volunteeringDescriptionChanged={volunteeringDescriptionChanged}
            setVolunteeringDescriptionChanged={setVolunteeringDescriptionChanged}
            volunteeringDescriptionError={volunteeringDescriptionError}
            setVolunteeringDescriptionError={setVolunteeringDescriptionError}
            volunteeringShowDeleteVolunteeringModal={volunteeringShowDeleteVolunteeringModal}
            setVolunteeringShowDeleteVolunteeringModal={setVolunteeringShowDeleteVolunteeringModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Add volunteering' && (
          <>
          <AddVolunteering
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            volunteeringLogo={volunteeringLogo}
            setVolunteeringLogo={setVolunteeringLogo}
            volunteeringLogoChanged={volunteeringLogoChanged}
            setVolunteeringLogoChanged={setVolunteeringLogoChanged}
            volunteeringCompany={volunteeringCompany}
            setVolunteeringCompany={setVolunteeringCompany}
            volunteeringCompanyChanged={volunteeringCompanyChanged}
            setVolunteeringCompanyChanged={setVolunteeringCompanyChanged}
            volunteeringCompanyError={volunteeringCompanyError}
            setVolunteeringCompanyError={setVolunteeringCompanyError}
            volunteeringTitle={volunteeringTitle}
            setVolunteeringTitle={setVolunteeringTitle}
            volunteeringTitleChanged={volunteeringTitleChanged}
            setVolunteeringTitleChanged={setVolunteeringTitleChanged}
            volunteeringTitleError={volunteeringTitleError}
            setVolunteeringTitleError={setVolunteeringTitleError}
            volunteeringLocation={volunteeringLocation}
            setVolunteeringLocation={setVolunteeringLocation}
            volunteeringLocationChanged={volunteeringLocationChanged}
            setVolunteeringLocationChanged={setVolunteeringLocationChanged}
            volunteeringLocationError={volunteeringLocationError}
            setVolunteeringLocationError={setVolunteeringLocationError}
            volunteeringStartDate={volunteeringStartDate}
            setVolunteeringStartDate={setVolunteeringStartDate}
            volunteeringStartDateInputType={volunteeringStartDateInputType}
            setVolunteeringStartDateInputType={setVolunteeringStartDateInputType}
            volunteeringStartDateChanged={volunteeringStartDateChanged}
            setVolunteeringStartDateChanged={setVolunteeringStartDateChanged}
            volunteeringStartDateError={volunteeringStartDateError}
            setVolunteeringStartDateError={setVolunteeringStartDateError}
            volunteeringEndDate={volunteeringEndDate}
            setVolunteeringEndDate={setVolunteeringEndDate}
            volunteeringEndDateInputType={volunteeringEndDateInputType}
            setVolunteeringEndDateInputType={setVolunteeringEndDateInputType}
            volunteeringEndDateChanged={volunteeringEndDateChanged}
            setVolunteeringEndDateChanged={setVolunteeringEndDateChanged}
            volunteeringEndDateError={volunteeringEndDateError}
            setVolunteeringEndDateError={setVolunteeringEndDateError}
            volunteeringEndDatePresent={volunteeringEndDatePresent}
            setVolunteeringEndDatePresent={setVolunteeringEndDatePresent}
            volunteeringEndDatePresentChanged={volunteeringEndDatePresentChanged}
            setVolunteeringEndDatePresentChanged={setVolunteeringEndDatePresentChanged}
            volunteeringUrl={volunteeringUrl}
            setVolunteeringUrl={setVolunteeringUrl}
            volunteeringUrlChanged={volunteeringUrlChanged}
            setVolunteeringUrlChanged={setVolunteeringUrlChanged}
            volunteeringUrlError={volunteeringUrlError}
            setVolunteeringUrlError={setVolunteeringUrlError}
            volunteeringDescription={volunteeringDescription}
            setVolunteeringDescription={setVolunteeringDescription}
            volunteeringDescriptionChanged={volunteeringDescriptionChanged}
            setVolunteeringDescriptionChanged={setVolunteeringDescriptionChanged}
            volunteeringDescriptionError={volunteeringDescriptionError}
            setVolunteeringDescriptionError={setVolunteeringDescriptionError}
            volunteeringShowDeleteVolunteeringModal={volunteeringShowDeleteVolunteeringModal}
            setVolunteeringShowDeleteVolunteeringModal={setVolunteeringShowDeleteVolunteeringModal}
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