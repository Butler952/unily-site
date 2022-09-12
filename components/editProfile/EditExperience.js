import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { toast } from 'react-toastify';

const EditExperience = ({
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
  setExperiencesTitleError
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [originalExperiences, setOriginalExperiences] = useState( userContext.profile.experiences);

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

  const updateExperiences = (index) => {
    if (experiencesCompanyChanged) {
      originalExperiences[index].company = experiencesCompany
    }
    if (experiencesTitleChanged) {
      originalExperiences[index].title = experiencesTitle
    }
  }
  
  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();

    if (experiencesCompanyChanged && experiencesCompany === '') {
      setCompanyError('Your first name cannot be empty')
      return null;
    }

    setSubmitting(true)
    updateExperiences(editProfileModalIndex)

    fire.firestore().collection('users').doc(user).update({
      'profile.experiences': originalExperiences,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setSubmitting(false)
        toast("Experience updated")
      })
      .catch((error) => {
        setSubmitting(false)
        toast("Unable to update experience")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleBasicInfoSubmit}>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Title</p>
            <input
              type="text"
              className={experiencesTitleError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesTitleChanged ? experiencesTitle : (userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].title && userContext.profile.experiences[editProfileModalIndex].title !== undefined ? userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].title && userContext.profile.experiences[editProfileModalIndex].title : '')}
              onChange={({ target }) => experiencesTitleChange(target.value)}
            />
            {experiencesTitleError !== '' ? <p className="small text-error-high mt-2">{experiencesTitleError}</p> : null}
          </div>
          <div className="mb-3">
            <p className="text-dark-high mb-2">Company</p>
            <input
              type="text"
              className={experiencesCompanyError !== '' ? `error w-100 small` : `w-100 small`}
              value={experiencesCompanyChanged ? experiencesCompany : (userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].company && userContext.profile.experiences[editProfileModalIndex].company !== undefined ? userContext && userContext.profile && userContext.profile.experiences[editProfileModalIndex] && userContext.profile.experiences[editProfileModalIndex].company && userContext.profile.experiences[editProfileModalIndex].company : '')}
              onChange={({ target }) => experiencesCompanyChange(target.value)}
            />
            {experiencesCompanyError !== '' ? <p className="small text-error-high mt-2">{experiencesCompanyError}</p> : null}
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Save' : 'Saving...'}</button>
          </div>
        </form>
      </div>

    </>
  )
}

export default EditExperience;