import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const About = ({
  user,
  about,
  aboutChanged,
  aboutError,
  setAbout,
  setAboutChanged,
  setAboutError,
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const aboutChange = (value) => {
    setAbout(value),
      setAboutChanged(true),
      setAboutError('')
  }

  const handleAboutSubmit = (e) => {
    e.preventDefault();

    if (aboutChanged && about === '') {
      setAboutError('Please write a little something about yourself')
      return null;
    }

    setSubmitting(true)

    fire.firestore().collection('users').doc(user).update({
      'profile.summary': !aboutChanged ? userContext.profile.summary : about,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })

      .then(() => {
        setSubmitting(false)
        toast("About updated")
      })
      .catch((error) => {
        setSubmitting(false)
        toast("Unable to update about")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleAboutSubmit}>
          <div className="w-100 mb-3">
            <p className="text-dark-high mb-2">About</p>
            <textarea 
              className={aboutError !== '' ? `error w-100 small` : `w-100 small`}
              value={aboutChanged ? about : (userContext.profile.summary !== undefined ? userContext.profile.summary : '')}
              onChange={({ target }) => aboutChange(target.value)}
            />
            {aboutError !== '' ? <p className="small text-error-high mt-2">{aboutError}</p> : null}
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Save' : 'Saving...'}</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default About;