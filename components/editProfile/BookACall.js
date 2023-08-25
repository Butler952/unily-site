import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookACall = ({
  user,
  handleEditProfileChangeView,
  bookCallUrl,
  setBookCallUrl,
  bookCallUrlChanged,
  setBookCallUrlChanged,
  bookCallUrlError,
  setBookCallUrlError
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const urlChange = (value) => {
    setBookCallUrl(value),
      setBookCallUrlChanged(true),
      setBookCallUrlError('')
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault();

    // if (aboutChanged && about === '') {
    //   setAboutError('Please write a little something about yourself')
    //   return null;
    // }

    setSubmitting(true)

    setTimeout(() => {

      fire.firestore().collection('users').doc(user).update({
        'profile.book_call_url': !bookCallUrlChanged ? userContext.profile.book_call_url : bookCallUrl,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })

        .then(() => {
          handleEditProfileChangeView('default'),
          setSubmitting(false),
          toast("Calendar embed updated")
        })
        .catch((error) => {
          setSubmitting(false)
          toast("Unable to update calendar embed")
          //console.error("Error adding document: ", error);
        });
    },500)
  }

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleUrlSubmit}>
        <div className="mb-3">
            <p className="text-dark-high mb-2">Cal.com event link</p>
            <input
              type="text"
              className={bookCallUrlError !== '' ? `error w-100 small` : `w-100 small`}
              value={!bookCallUrlChanged ? userContext.profile.book_call_url : bookCallUrl}
              onChange={({ target }) => urlChange(target.value)}
              disabled={submitting}
            />
            {bookCallUrlError !== '' ? <p className="small text-error-high mt-2">{bookCallUrlError}</p> : <p className="small text-dark-med mt-2">E.g. https://cal.com/aaron-expertpage/30min</p> }
          </div>
          <div className="d-flex flex-column border-1 border-solid border-dark-300 radius-3 d-block position-relative w-100 p-0 mb-3 overflow-hidden shadow-1">
            <div className={`d-block position-relative overflow-hidden mt-2`} style={{ height: '160px', minWidth: '260px', backgroundImage: `url(/images/copy-event-link.png)`, backgroundRepeat:'no-repeat', backgroundSize: 'contain' }}></div>
            {/* <div className="px-4 pb-4 w-100">
              <p className="m-0">Login to your Cal.com account, go to your event dashboard, select the event you would like to embed on your website, click on the blank symbolTap "Copy link to event</p>
            </div> */}
            <div className="px-4 pb-4 w-100">
              <h6 className="mb-3">How to find your event link</h6>
              <ol style={{marginLeft: '-1em', marginBottom: 0}}>
              <li><p className="mb-2">Login to your Cal.com account</p></li>
              <li><p className="mb-2">Go to your event dashboard</p></li>
              <li><p className="mb-2">Select the event you would like to embed</p></li>
              <li><p className="mb-2">Click on the "Copy link to event" link symbol</p></li>
              </ol>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button type="submit" className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Save' : 'Saving...'}</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default BookACall;