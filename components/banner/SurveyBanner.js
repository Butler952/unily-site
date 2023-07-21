import { useState, useEffect, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import fire from '../../config/fire-config';
import ICONS from '../icon/IconPaths';
import { UserContext } from '../../pages/_app';

const SurveyBanner = () => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [showBanner, setShowBanner] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState('')

  const [questionWhySignUpOne, setQuestionWhySignUpOne] = useState(false);
  const [questionWhySignUpTwo, setQuestionWhySignUpTwo] = useState(false);
  const [questionWhySignUpThree, setQuestionWhySignUpThree] = useState(false);
  const [questionWhySignUpFour, setQuestionWhySignUpFour] = useState(false);
  const [questionWhySignUpFive, setQuestionWhySignUpFive] = useState(false);
  const [questionWhySignUpError, setQuestionWhySignUpError] = useState(false);

  const [questionWhySignUpOther, setQuestionWhySignUpOther] = useState('');
  const [questionWhySignUpOtherError, setQuestionWhySignUpOtherError] = useState('');

  const [questionOtherServices, setQuestionOtherServices] = useState('');
  const [questionOtherServicesError, setQuestionOtherServicesError] = useState('');

  const [questionWhyNow, setQuestionWhyNow] = useState('');
  const [questionWhyNowError, setQuestionWhyNowError] = useState('');
  
  const [commentsAndSuggestions, setCommentsAndSuggestions] = useState('');
  
  const [furtherResearch, setFurtherResearch] = useState(false);
  const [furtherResearchError, setFurtherResearchError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };


  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
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


  const handleDismiss = (e) => {
    e.preventDefault();
    setShowBanner(false);

    fire.firestore().collection('users').doc(user).update({
      'surveys': {
        'surveyOnSignUp': {
          'surveyHide': true
        }
      },
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .catch((err) => {
      console.log(err.code, err.message)
    })
  }

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);


  const questionWhySignUpChange = (value) => {
      if (value === '1') {
        setQuestionWhySignUpOne(!questionWhySignUpOne)
    } if (value === '2') {
        setQuestionWhySignUpTwo(!questionWhySignUpTwo)
    } if (value === '3') {
        setQuestionWhySignUpThree(!questionWhySignUpThree)
    } if (value === '4') {
        setQuestionWhySignUpFour(!questionWhySignUpFour)
    } if (value === '5') {
        setQuestionWhySignUpFive(!questionWhySignUpFive)
        setQuestionWhySignUpOtherError('')
    }
    setQuestionWhySignUpError('')
  }

  const questionWhySignUpOtherChange = (value) => {
    setQuestionWhySignUpOther(value),
    setQuestionWhySignUpOtherError('')
  }

  const questionOtherServicesChange = (value) => {
    setQuestionOtherServices(value),
    setQuestionOtherServicesError('')
  }

  const questionWhyNowChange = (value) => {
    setQuestionWhyNow(value)
    setQuestionWhyNowError('')
  }

  const commentsAndSuggestionsChange = (value) => {
    setCommentsAndSuggestions(value)
  }

  const furtherResearchChange = () => {
    setFurtherResearch(furtherResearch => !furtherResearch)
    setFurtherResearchError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // if (
    //   !questionWhySignUpOne &&
    //   !questionWhySignUpTwo &&
    //   !questionWhySignUpThree &&
    //   !questionWhySignUpFour &&
    //   !questionWhySignUpFive
    // ) {
    //   setQuestionWhySignUpError('Please select an option')
    //   return null;
    // }

    // if (questionWhySignUpFive && questionWhySignUpOther === ''
    // ) {
    //   setQuestionWhySignUpOtherError('Please provide a response')
    //   return null;
    // }

    if ( questionOtherServices === '' ) {
      setQuestionOtherServicesError('Please provide a response')
      return null;
    }

    if ( questionWhyNow === '' ) {
      setQuestionWhyNowError('Please provide a response')
      return null;
    }

    if ( questionWhyNow === '' ) {
      setQuestionWhyNowError('Please provide a response')
      return null;
    }

    setSubmitting(true)


    if (userContext.receiveEmails) {
      fire.firestore().collection('mailingList').doc(user).update({
        signUpSurveyComplete: true,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
    }

    fire.firestore().collection("surveys").doc('surveyOnSignUp').collection("responses").add({
      // 'whySignUp': {
      //   'questionWhySignUpOne': (questionWhySignUpOne ? true : false ),
      //   'questionWhySignUpTwo': (questionWhySignUpTwo ? true : false ),
      //   'questionWhySignUpThree': (questionWhySignUpThree ? true : false ),
      //   'questionWhySignUpFour': (questionWhySignUpFour ? true : false ),
      //   'questionWhySignUpFive': (questionWhySignUpFive ? true : false ),
      //   'questionWhySignUpOther': (questionWhySignUpOther !== '' ? questionWhySignUpOther : '' )
      // },
      'otherServices': questionOtherServices,
      'whyNow': questionWhyNow,
      'commentsAndSuggestions': (commentsAndSuggestions !== '' ? commentsAndSuggestions : ''),
      'furtherResearch': furtherResearch,
      userID: user,
      submitted: fire.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        fire.firestore().collection('users').doc(user).update({
          'surveys': {
            'surveyOnSignUp': {
              'surveyResponseId': docRef.id,
              'surveyHide': true
            }
          },
          lastUpdated: fire.firestore.FieldValue.serverTimestamp()
        })
        .catch((err) => {
          console.log(err.code, err.message)
        })
    })
    .then(() => {
      setShowBanner(false)
      setSubmitted(true)
      setSubmitting(false)
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
  }

  return (
    <>
    { showBanner ? 
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center bg-primary-900 p-3">
        <div>
          <p className="text-light-high font-weight-medium mb-0">Thank you for signing up for expertpage.io</p>
          <p className="text-light-med mb-0">We’d love to hear why you signed up and what you’re hoping to get out of the product.</p>
        </div>
        <div className="d-flex flex-column flex-sm-row ml-md-3 mt-3 mt-md-0 w-100 w-sm-auto">
          <button onClick={handleShow} className="btn light high small w-100 w-sm-auto">Take the two minute survey</button>
          { screenWidth > 768 ? 
            <button onClick={handleDismiss} className="btn light medium small icon-only ml-md-3">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CLOSE}></path>
              </svg>
            </button>
          : <button onClick={handleDismiss} className="btn light medium small ml-sm-3 mt-3 mt-sm-0 w-100 w-sm-auto">Dismiss</button> }   
        </div>
      </div>
    : '' }
      <Modal
        show={showModal} 
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        // size="lg"
      >
        { !submitted ? <Modal.Header closeButton>
          <h5 className="text-dark-high mb-0">Feedback survey</h5>
          <button onClick={handleClose} className="btn dark low small icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header> : '' }
        { !submitted ? 
          <Modal.Body>
            <div>
              <form onSubmit={handleSubmit}>
                {/* <div className="mb-4">
                  <p className="large text-dark-high mb-1">Why did you sign up to expertpage.io?</p>
                  <p className="small text-dark-low">Select as many as you like</p>
                  <label className="checkbox-container small mb-3">I want to stand out from other job candidates
                    <input type="checkbox" value={1} onChange={({target}) => questionWhySignUpChange(target.value)} checked={questionWhySignUpOne}></input>
                    <span className="checkmark"></span>
                  </label>
                  <label className="checkbox-container small mb-3">I want to have a personal professional website
                    <input type="checkbox" value={2} onChange={({target}) => questionWhySignUpChange(target.value)} checked={questionWhySignUpTwo}></input>
                    <span className="checkmark"></span>
                  </label>
                  <label className="checkbox-container small mb-3">I am getting ready to apply for jobs
                    <input type="checkbox" value={3} onChange={({target}) => questionWhySignUpChange(target.value)} checked={questionWhySignUpThree}></input>
                    <span className="checkmark"></span>
                  </label>
                  <label className="checkbox-container small mb-3">To present my LinkedIn profile in more attractive way
                    <input type="checkbox" value={4} onChange={({target}) => questionWhySignUpChange(target.value)} checked={questionWhySignUpFour}></input>
                    <span className="checkmark"></span>
                  </label>
                  <label className="checkbox-container small mb-4">Other
                    <input type="checkbox" value={5} onChange={({target}) => questionWhySignUpChange(target.value)} checked={questionWhySignUpFive}></input>
                    <span className="checkmark"></span>
                  </label> 
                  {questionWhySignUpError !== '' ? <p className="small text-error-high mt-2">{questionWhySignUpError}</p> : null}
                  { questionWhySignUpFive ?
                    <div className="mb-4">
                      <p className="large text-dark-high">Please state</p>
                      <input type="text" className={questionWhySignUpOtherError !== '' ? `error w-100 small` : `w-100 small`} value={questionWhySignUpOther} onChange={({target}) => questionWhySignUpOtherChange(target.value)} />
                      {questionWhySignUpOtherError !== '' ? <p className="small text-error-high mt-2">{questionWhySignUpOtherError}</p> : null}
                    </div>
                    : ''
                  }
                </div> */}
                <div className="mb-4">
                  <p className="text-dark-high">What other services have you tried in order to achieve the same thing?</p>
                  <textarea className={questionOtherServicesError !== '' ? `error w-100 small` : `w-100 small`} value={questionOtherServices} onChange={({target}) => questionOtherServicesChange(target.value)} />
                  {questionOtherServicesError !== '' ? <p className="small text-error-high mt-2">{questionOtherServicesError}</p> : null}
                </div>
                <div className="mb-4">
                  <p className="text-dark-high">Why did you sign up now? Was there a specific event or problem that caused you to look for a better solution?</p>
                  <textarea className={questionWhyNowError !== '' ? `error w-100 small` : `w-100 small`} value={questionWhyNow} onChange={({target}) => questionWhyNowChange(target.value)} />
                  {questionWhyNowError !== '' ? <p className="small text-error-high mt-2">{questionWhyNowError}</p> : null}
                </div>
                <div className="mb-4">
                  <p className="text-dark-high">Do you have any other comments or suggestions for us? (optional)</p>
                  <textarea className="w-100 small" value={commentsAndSuggestions} onChange={({target}) => commentsAndSuggestionsChange(target.value)} />
                </div>
                <div className="mb-4">
                  <p className="text-dark-high">Are you willing to be contacted by a member of our team for further research?</p>
                  <label className="checkbox-container small mb-4">I agree to be contacted for further research
                    <input type="checkbox" onChange={() => furtherResearchChange()} checked={furtherResearch}></input>
                    {furtherResearchError !== '' ? <p className="small text-error-high">{furtherResearchError}</p> : null}
                    <span className="checkmark"></span>
                  </label>
                </div>
                {/*}
                <label className="checkbox-container small mb-4">I would like to receive emails about news and updates
                  <input type="checkbox" onChange={() => setReceiveEmails(receiveEmails => !receiveEmails)} checked={receiveEmails}></input>
                  <span className="checkmark"></span>
                </label>
                */}
                <br/>
                <button type="submit" className="btn primary high w-100" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit survey'}</button>
              </form>
              {/*<div className="d-flex align-items-center jusify-content-start flex-column flex-md-row">
                <button type="button" className="btn primary high w-100 w-md-auto" onClick={handleUpdate}>Upgrade</button>
                <button type="button" className="btn dark medium w-100 w-md-auto" onClick={handleClose}>Close</button>
              </div>*/}
            </div>
          </Modal.Body>
        : 
          <Modal.Body>
            <div>
              <h4 className="text-center">Survey successfully submitted</h4>
              <p className="text-center large mb-5">Thank you for taking the time to complete this feedback survey. Your response will help us to make the product even better for you.</p>
              <button type="button" onClick={handleClose} className="btn primary high w-100">Close</button>
            </div>
          </Modal.Body>
        }
      </Modal>
    </>
  )
}

export default SurveyBanner;