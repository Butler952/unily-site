import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';

const AddExperience = ({
  user,
  editProfileModalIndex,
  experiencesCompany,
  setExperiencesCompany,
  experiencesCompanyChanged,
  setExperiencesCompanyChanged,
  experiencesCompanyError,
  setExperiencesCompanyError,
  experiencesTitle,
  setExperiencesTitle,
  experiencesTitleChanged,
  setExperiencesTitleChanged,
  experiencesTitleError,
  setExperiencesTitleError,
  experiencesLocation,
  setExperiencesLocation,
  experiencesLocationChanged,
  setExperiencesLocationChanged,
  experiencesLocationError,
  setExperiencesLocationError,
  experiencesStartDate,
  setExperiencesStartDate,
  experiencesStartDateInputType,
  setExperiencesStartDateInputType,
  experiencesStartDateChanged,
  setExperiencesStartDateChanged,
  experiencesStartDateError,
  setExperiencesStartDateError,
  experiencesEndDate,
  setExperiencesEndDate,
  experiencesEndDateInputType,
  setExperiencesEndDateInputType,
  experiencesEndDateChanged,
  setExperiencesEndDateChanged,
  experiencesEndDateError,
  setExperiencesEndDateError,
  experiencesEndDatePresent,
  setExperiencesEndDatePresent,
  experiencesEndDatePresentChanged,
  setExperiencesEndDatePresentChanged,
  experiencesDescription,
  setExperiencesDescription,
  experiencesDescriptionChanged,
  setExperiencesDescriptionChanged,
  experiencesDescriptionError,
  setExperiencesDescriptionError,
  experiencesShowDeleteExperienceModal,
  setExperiencesShowDeleteExperienceModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [originalExperiences, setOriginalExperiences] = useState( userContext.profile.experiences);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const experiencesCompanyChange = (value) => {
    setExperiencesCompany(value),
    setExperiencesCompanyChanged(true),
    setExperiencesCompanyError('')
  }

  const experiencesTitleChange = (value) => {
    setExperiencesTitle(value),
    setExperiencesTitleChanged(true),
    setExperiencesTitleError('')
  }

  const experiencesLocationChange = (value) => {
    setExperiencesLocation(value),
    setExperiencesLocationChanged(true),
    setExperiencesLocationError('')
  }

  const experiencesStartDateChange = (value) => {
    setExperiencesStartDate(value),
    setExperiencesStartDateChanged(true),
    setExperiencesStartDateError('')
  }

  const experiencesStartDateChangeInputType = () => {
    setExperiencesStartDateInputType('month')
  }

  const experiencesEndDateChange = (value) => {
    setExperiencesEndDate(value),
    setExperiencesEndDateChanged(true),
    setExperiencesEndDateError('')
  }

  const experiencesEndDateChangeInputType = () => {
    setExperiencesEndDateInputType('month')
  }

  const experiencesEndDatePresentChange = () => {
    setExperiencesEndDatePresent(experiencesEndDatePresent => !experiencesEndDatePresent)
    setExperiencesEndDatePresentChanged(true)
  }

  const experiencesDescriptionChange = (value) => {
    setExperiencesDescription(value),
    setExperiencesDescriptionChanged(true),
    setExperiencesDescriptionError('')
  }

  const updateExperiences = () => {
    let newExperience = {};
    newExperience.company = experiencesCompany
    newExperience.title = experiencesTitle
    newExperience.location = experiencesLocation
    let startDateMonth = Number(experiencesStartDate.split('-')[1]);
    let startDateYear = Number(experiencesStartDate.split('-')[0]);
    newExperience.starts_at = 
      { 
        'day': 1,
        'month': startDateMonth,
        'year': startDateYear
      }
    if (!experiencesEndDatePresent) {
        let endDateMonth = Number(experiencesEndDate.split('-')[1]);
        let endDateYear = Number(experiencesEndDate.split('-')[0]);
        newExperience.ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
    }
    newExperience.description = experiencesDescription
    // add newExperience to originalExperiences
    if (originalExperiences !== undefined) {
      originalExperiences.unshift(newExperience)
    } else {
      originalExperiences = [newExperience]
    }
  }
  
  const handleAddExperiencesSubmit = (e) => {
    e.preventDefault();

    if (experiencesCompanyChanged && experiencesCompany === '') {
      setCompanyError('Your first name cannot be empty')
      return null;
    }
    if (experiencesTitleChanged && experiencesTitle === '') {
      setTitleError('Job title cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateExperiences()

    fire.firestore().collection('users').doc(user).update({
      'profile.experiences': originalExperiences,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.experiences = originalExperiences;
      setUserContext(newUserContext)
      handleBack()
    })
    .then(() => {
      setSubmitting(false)
      toast("Experience added")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to add experience")
      //console.error("Error adding document: ", error);
    });
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={experiencesEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={experiencesEndDate}
          onChange={({ target }) => experiencesEndDateChange(target.value)}
        />
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddExperiencesSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Title</p>
            <input
              type="text"
              className={experiencesTitleError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesTitle}
              onChange={({ target }) => experiencesTitleChange(target.value)}
            />
            {experiencesTitleError !== '' ? <p className="small text-error-high mt-2">{experiencesTitleError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Company</p>
            <input
              type="text"
              className={experiencesCompanyError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesCompany}
              onChange={({ target }) => experiencesCompanyChange(target.value)}
            />
            {experiencesCompanyError !== '' ? <p className="small text-error-high mt-2">{experiencesCompanyError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Location</p>
            <input
              type="text"
              className={experiencesLocationError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesLocation}
              onChange={({ target }) => experiencesLocationChange(target.value)}
            />
            {experiencesLocationError !== '' ? <p className="small text-error-high mt-2">{experiencesLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={experiencesStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesStartDate}
              onChange={({ target }) => experiencesStartDateChange(target.value)}
            />
            {experiencesLocationError !== '' ? <p className="small text-error-high mt-2">{experiencesLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { !experiencesEndDatePresent && <EndDateInput/> } 
            {/* { !experiencesEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.experiences[editProfileModalIndex] && 
                userContext.profile.experiences[editProfileModalIndex].ends_at && 
                userContext.profile.experiences[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''}  */}
            {experiencesLocationError !== '' ? <p className="small text-error-high mt-2">{experiencesLocationError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I currently work here
              <input 
                type="checkbox" 
                onChange={() => experiencesEndDatePresentChange()} 
                checked={experiencesEndDatePresent}
              />
              {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={experiencesDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesDescription}
              onChange={({ target }) => experiencesDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {experiencesDescriptionError !== '' ? <p className="small text-error-high mt-2">{experiencesDescriptionError}</p> : null}
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end" style={{gap: '12px'}}>
            <button type="button" onClick={handleBack} className="btn dark medium w-100 w-sm-auto" disabled={submitting}>Cancel</button>
            <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Add' : 'Adding...'}</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddExperience;