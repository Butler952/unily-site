import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';

const AddEducation = ({
  user,
  editProfileModalIndex,
  educationSchool,
  setEducationSchool,
  educationSchoolChanged,
  setEducationSchoolChanged,
  educationSchoolError,
  setEducationSchoolError,
  educationFieldOfStudy,
  setEducationFieldOfStudy,
  educationFieldOfStudyChanged,
  setEducationFieldOfStudyChanged,
  educationFieldOfStudyError,
  setEducationFieldOfStudyError,
  educationDegreeName,
  setEducationDegreeName,
  educationDegreeNameChanged,
  setEducationDegreeNameChanged,
  educationDegreeNameError,
  setEducationDegreeNameError,
  educationLocation,
  setEducationLocation,
  educationLocationChanged,
  setEducationLocationChanged,
  educationLocationError,
  setEducationLocationError,
  educationStartDate,
  setEducationStartDate,
  educationStartDateInputType,
  setEducationStartDateInputType,
  educationStartDateChanged,
  setEducationStartDateChanged,
  educationStartDateError,
  setEducationStartDateError,
  educationEndDate,
  setEducationEndDate,
  educationEndDateInputType,
  setEducationEndDateInputType,
  educationEndDateChanged,
  setEducationEndDateChanged,
  educationEndDateError,
  setEducationEndDateError,
  educationEndDatePresent,
  setEducationEndDatePresent,
  educationEndDatePresentChanged,
  setEducationEndDatePresentChanged,
  educationDescription,
  setEducationDescription,
  educationDescriptionChanged,
  setEducationDescriptionChanged,
  educationDescriptionError,
  setEducationDescriptionError,
  educationShowDeleteEducationModal,
  setEducationShowDeleteEducationModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [originalEducation, setOriginalEducation] = useState( userContext.profile.education);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const educationSchoolChange = (value) => {
    setEducationSchool(value),
    setEducationSchoolChanged(true),
    setEducationSchoolError('')
  }

  const educationFieldOfStudyChange = (value) => {
    setEducationFieldOfStudy(value),
    setEducationFieldOfStudyChanged(true),
    setEducationFieldOfStudyError('')
  }

  const educationDegreeNameChange = (value) => {
    setEducationDegreeName(value),
    setEducationDegreeNameChanged(true),
    setEducationDegreeNameError('')
  }

  const educationLocationChange = (value) => {
    setEducationLocation(value),
    setEducationLocationChanged(true),
    setEducationLocationError('')
  }

  const educationStartDateChange = (value) => {
    setEducationStartDate(value),
    setEducationStartDateChanged(true),
    setEducationStartDateError('')
  }

  const educationStartDateChangeInputType = () => {
    setEducationStartDateInputType('month')
  }

  const educationEndDateChange = (value) => {
    setEducationEndDate(value),
    setEducationEndDateChanged(true),
    setEducationEndDateError('')
  }

  const educationEndDateChangeInputType = () => {
    setEducationEndDateInputType('month')
  }

  const educationEndDatePresentChange = () => {
    setEducationEndDatePresent(educationEndDatePresent => !educationEndDatePresent)
    setEducationEndDatePresentChanged(true)
  }

  const educationDescriptionChange = (value) => {
    setEducationDescription(value),
    setEducationDescriptionChanged(true),
    setEducationDescriptionError('')
  }

  const updateEducation = () => {
    let newEducation = {};
    newEducation.school = educationSchool
    newEducation.field_of_study = educationFieldOfStudy
    newEducation.degree_name = educationDegreeName
    newEducation.location = educationLocation
    let startDateMonth = Number(educationStartDate.split('-')[1]);
    let startDateYear = Number(educationStartDate.split('-')[0]);
    newEducation.starts_at = 
      { 
        'day': 1,
        'month': startDateMonth,
        'year': startDateYear
      }
    if (!educationEndDatePresent) {
        let endDateMonth = Number(educationEndDate.split('-')[1]);
        let endDateYear = Number(educationEndDate.split('-')[0]);
        newEducation.ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
    }
    newEducation.description = educationDescription
    // add newEducation to originalEducation
    if (originalEducation !== undefined) {
      originalEducation.unshift(newEducation)
    } else {
      originalEducation = [newEducation]
    }
  }
  
  const handleAddEducationSubmit = (e) => {
    e.preventDefault();

    if (educationSchoolChanged && educationSchool === '') {
      setSchoolError('Your first name cannot be empty')
      return null;
    }
    if (educationFieldOfStudyChanged && educationFieldOfStudy === '') {
      setFieldOfStudyError('Job field_of_study cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateEducation()

    fire.firestore().collection('users').doc(user).update({
      'profile.education': originalEducation,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.education = originalEducation;
      setUserContext(newUserContext)
      handleBack()
    })
    .then(() => {
      setSubmitting(false)
      toast("Education added")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to add Education")
      //console.error("Error adding document: ", error);
    });
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={educationEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={educationEndDate}
          onChange={({ target }) => educationEndDateChange(target.value)}
        />
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddEducationSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Field of study</p>
            <input
              type="text"
              className={educationFieldOfStudyError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationFieldOfStudy}
              onChange={({ target }) => educationFieldOfStudyChange(target.value)}
            />
            {educationFieldOfStudyError !== '' ? <p className="small text-error-high mt-2">{educationFieldOfStudyError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Degree name</p>
            <input
              type="text"
              className={educationDegreeNameError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationDegreeNameChanged ? educationDegreeName : (userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].degree_name && userContext.profile.education[editProfileModalIndex].degree_name !== undefined ? userContext && userContext.profile && userContext.profile.education[editProfileModalIndex] && userContext.profile.education[editProfileModalIndex].degree_name && userContext.profile.education[editProfileModalIndex].degree_name : '')}
              onChange={({ target }) => educationDegreeNameChange(target.value)}
            />
            {educationDegreeNameError !== '' ? <p className="small text-error-high mt-2">{educationDegreeNameError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">School</p>
            <input
              type="text"
              className={educationSchoolError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationSchool}
              onChange={({ target }) => educationSchoolChange(target.value)}
            />
            {educationSchoolError !== '' ? <p className="small text-error-high mt-2">{educationSchoolError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Location</p>
            <input
              type="text"
              className={educationLocationError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationLocation}
              onChange={({ target }) => educationLocationChange(target.value)}
            />
            {educationLocationError !== '' ? <p className="small text-error-high mt-2">{educationLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={educationStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationStartDate}
              onChange={({ target }) => educationStartDateChange(target.value)}
            />
            {educationLocationError !== '' ? <p className="small text-error-high mt-2">{educationLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { !educationEndDatePresent && <EndDateInput/> } 
            {/* { !educationEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.education[editProfileModalIndex] && 
                userContext.profile.education[editProfileModalIndex].ends_at && 
                userContext.profile.education[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''}  */}
            {educationLocationError !== '' ? <p className="small text-error-high mt-2">{educationLocationError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I currently study here
              <input 
                type="checkbox" 
                onChange={() => educationEndDatePresentChange()} 
                checked={educationEndDatePresent}
              />
              {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={educationDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={educationDescription}
              onChange={({ target }) => educationDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {educationDescriptionError !== '' ? <p className="small text-error-high mt-2">{educationDescriptionError}</p> : null}
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

export default AddEducation;