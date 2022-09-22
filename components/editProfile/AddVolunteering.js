import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from '../../pages/profile/profile.module.scss'
import Icon from '../icon/Icon';

const AddVolunteering = ({
  user,
  editProfileModalIndex,
  volunteeringCompany,
  setVolunteeringCompany,
  volunteeringCompanyChanged,
  setVolunteeringCompanyChanged,
  volunteeringCompanyError,
  setVolunteeringCompanyError,
  volunteeringTitle,
  setVolunteeringTitle,
  volunteeringTitleChanged,
  setVolunteeringTitleChanged,
  volunteeringTitleError,
  setVolunteeringTitleError,
  volunteeringLocation,
  setVolunteeringLocation,
  volunteeringLocationChanged,
  setVolunteeringLocationChanged,
  volunteeringLocationError,
  setVolunteeringLocationError,
  volunteeringStartDate,
  setVolunteeringStartDate,
  volunteeringStartDateInputType,
  setVolunteeringStartDateInputType,
  volunteeringStartDateChanged,
  setVolunteeringStartDateChanged,
  volunteeringStartDateError,
  setVolunteeringStartDateError,
  volunteeringEndDate,
  setVolunteeringEndDate,
  volunteeringEndDateInputType,
  setVolunteeringEndDateInputType,
  volunteeringEndDateChanged,
  setVolunteeringEndDateChanged,
  volunteeringEndDateError,
  setVolunteeringEndDateError,
  volunteeringEndDatePresent,
  setVolunteeringEndDatePresent,
  volunteeringEndDatePresentChanged,
  setVolunteeringEndDatePresentChanged,
  volunteeringDescription,
  setVolunteeringDescription,
  volunteeringDescriptionChanged,
  setVolunteeringDescriptionChanged,
  volunteeringDescriptionError,
  setVolunteeringDescriptionError,
  volunteeringShowDeleteVolunteeringModal,
  setVolunteeringShowDeleteVolunteeringModal,
  handleBack
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [originalVolunteering, setOriginalVolunteering] = useState( userContext.profile.volunteer_work);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const volunteeringCompanyChange = (value) => {
    setVolunteeringCompany(value),
    setVolunteeringCompanyChanged(true),
    setVolunteeringCompanyError('')
  }

  const volunteeringTitleChange = (value) => {
    setVolunteeringTitle(value),
    setVolunteeringTitleChanged(true),
    setVolunteeringTitleError('')
  }

  const volunteeringLocationChange = (value) => {
    setVolunteeringLocation(value),
    setVolunteeringLocationChanged(true),
    setVolunteeringLocationError('')
  }

  const volunteeringStartDateChange = (value) => {
    setVolunteeringStartDate(value),
    setVolunteeringStartDateChanged(true),
    setVolunteeringStartDateError('')
  }

  const volunteeringStartDateChangeInputType = () => {
    setVolunteeringStartDateInputType('month')
  }

  const volunteeringEndDateChange = (value) => {
    setVolunteeringEndDate(value),
    setVolunteeringEndDateChanged(true),
    setVolunteeringEndDateError('')
  }

  const volunteeringEndDateChangeInputType = () => {
    setVolunteeringEndDateInputType('month')
  }

  const volunteeringEndDatePresentChange = () => {
    setVolunteeringEndDatePresent(volunteeringEndDatePresent => !volunteeringEndDatePresent)
    setVolunteeringEndDatePresentChanged(true)
  }

  const volunteeringDescriptionChange = (value) => {
    setVolunteeringDescription(value),
    setVolunteeringDescriptionChanged(true),
    setVolunteeringDescriptionError('')
  }

  const updateVolunteering = () => {
    let newVolunteering = {};
    newVolunteering.company = volunteeringCompany
    newVolunteering.title = volunteeringTitle
    newVolunteering.location = volunteeringLocation
    let startDateMonth = Number(volunteeringStartDate.split('-')[1]);
    let startDateYear = Number(volunteeringStartDate.split('-')[0]);
    newVolunteering.starts_at = 
      { 
        'day': 1,
        'month': startDateMonth,
        'year': startDateYear
      }
    if (!volunteeringEndDatePresent) {
        let endDateMonth = Number(volunteeringEndDate.split('-')[1]);
        let endDateYear = Number(volunteeringEndDate.split('-')[0]);
        newVolunteering.ends_at = 
          { 
            'day': 31,
            'month': endDateMonth,
            'year': endDateYear
          }
    }
    newVolunteering.description = volunteeringDescription
    // add newVolunteering to originalVolunteering
    if (originalVolunteering !== undefined) {
      originalVolunteering.unshift(newVolunteering)
    } else {
      originalVolunteering = [newVolunteering]
    }
  }
  
  const handleAddVolunteeringSubmit = (e) => {
    e.preventDefault();

    if (volunteeringCompanyChanged && volunteeringCompany === '') {
      setCompanyError('Your first name cannot be empty')
      return null;
    }
    if (volunteeringTitleChanged && volunteeringTitle === '') {
      setTitleError('Job title cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateVolunteering()

    fire.firestore().collection('users').doc(user).update({
      'profile.volunteer_work': originalVolunteering,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((result) => {
      let newUserContext = userContext;
      newUserContext.profile.volunteer_work = originalVolunteering;
      setUserContext(newUserContext)
      handleBack()
    })
    .then(() => {
      setSubmitting(false)
      toast("Volunteering added")
    })
    .catch((error) => {
      setSubmitting(false)
      toast("Unable to add volunteering")
      //console.error("Error adding document: ", error);
    });
  }

  const EndDateInput = () => {
    return (
      <>
        <input 
          type="month"
          className={volunteeringEndDateError !== '' ? `error w-100 small` : `w-100 small`}
          value={volunteeringEndDate}
          onChange={({ target }) => volunteeringEndDateChange(target.value)}
        />
      </>
    )
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAddVolunteeringSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Title</p>
            <input
              type="text"
              className={volunteeringTitleError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringTitle}
              onChange={({ target }) => volunteeringTitleChange(target.value)}
            />
            {volunteeringTitleError !== '' ? <p className="small text-error-high mt-2">{volunteeringTitleError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Organisation</p>
            <input
              type="text"
              className={volunteeringCompanyError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringCompany}
              onChange={({ target }) => volunteeringCompanyChange(target.value)}
            />
            {volunteeringCompanyError !== '' ? <p className="small text-error-high mt-2">{volunteeringCompanyError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Location</p>
            <input
              type="text"
              className={volunteeringLocationError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringLocation}
              onChange={({ target }) => volunteeringLocationChange(target.value)}
            />
            {volunteeringLocationError !== '' ? <p className="small text-error-high mt-2">{volunteeringLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Start date</p>
            <input 
              type="month"
              className={volunteeringStartDateError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringStartDate}
              onChange={({ target }) => volunteeringStartDateChange(target.value)}
            />
            {volunteeringLocationError !== '' ? <p className="small text-error-high mt-2">{volunteeringLocationError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">End date</p>
            { !volunteeringEndDatePresent && <EndDateInput/> } 
            {/* { !volunteeringEndDatePresentChanged ? (
                userContext && 
                userContext.profile && 
                userContext.profile.volunteer_work[editProfileModalIndex] && 
                userContext.profile.volunteer_work[editProfileModalIndex].ends_at && 
                userContext.profile.volunteer_work[editProfileModalIndex].ends_at !== undefined ? <EndDateInput /> : '' 
              ) : ''}  */}
            {volunteeringLocationError !== '' ? <p className="small text-error-high mt-2">{volunteeringLocationError}</p> : null}
            <label className="checkbox-container small mt-2 mb-4">I currently work here
              <input 
                type="checkbox" 
                onChange={() => volunteeringEndDatePresentChange()} 
                checked={volunteeringEndDatePresent}
              />
              {/* {notify !== '' ? <p className="small text-error-high">{notify}</p> : null} */}
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">Description</p>
            <textarea 
              className={volunteeringDescriptionError !== '' ? `error w-100 small` : `w-100 small`}
              value={volunteeringDescription}
              onChange={({ target }) => volunteeringDescriptionChange(target.value)}
              style={{ minHeight: '240px'}}
            />
            {volunteeringDescriptionError !== '' ? <p className="small text-error-high mt-2">{volunteeringDescriptionError}</p> : null}
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

export default AddVolunteering;