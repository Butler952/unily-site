import { useState, useContext, useEffect } from 'react';
import fire from '../../../config/fire-config';
import ICONS from '../../../components/icon/IconPaths';
import { Modal } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import styles from '../settings.module.scss'
import Image from 'next/image'
import { UserContext } from '../../_app';
import { toast } from 'react-toastify';
import UpgradeButton from './upgradeButton';

const ChangeEmailSection = ({
  userData,
  allUserData,
  product,
  active,
  status,
  handleUpgrade
}) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [domain, setDomain] = useState('');
  const [domainChanged, setDomainChanged] = useState('');
  const [domainError, setDomainError] = useState('');
  const [email, setEmail] = useState('');
  const [emailChanged, setEmailChanged] = useState('');
  const [emailError, setEmailError] = useState('');
  const [defaultDomain, setDefaultDomain] = useState('');
  const [selectedDomainType, setSelectedDomainType] = useState('');
  const [selectedDomainTypeChanged, setSelectedDomainTypeChanged] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const [notificationRequested, setNotificationRequested] = useState(false);
  const [saving, setSaving] = useState('');
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  const handleUpsellClose = () => setShowUpsellModal(false);
  const handleUpsellShow = () => setShowUpsellModal(true);

  let domainType = (
    selectedDomainTypeChanged ? selectedDomainType : (
      userContext &&
        userContext.profileUrl &&
        userContext.profileUrl.includes("profile") ?
        'standard' :
        'personalised'
    )
  )

  // value={domainChanged ? domain : 
  //   (
  //     userContext && 
  //     userContext.profileUrl &&
  //     userContext.profileUrl.includes("profile") ? 
  //     userContext && 
  //     userContext.profileUrl.split('/profile/')[1]
  //   : 
  //     userContext && 
  //     userContext.profileUrl &&
  //     userContext.profileUrl.substring(1)
  //   )
  // }

  useEffect(() => {
    setDomain(
      userContext &&
      userContext.profileUrl &&
      userContext.profileUrl.includes("profile") ?
      (userContext.profileUrl.split('/profile/')[1]) :
      userContext.profileUrl
    )
    setSelectedDomainType(
      userContext &&
        userContext.profileUrl &&
        userContext.profileUrl.includes("profile") ? 'standard' : 'personalised');
    // setSelectedDomainType(userContext && userContext.profileUrl && userContext.profileUrl.includes("profile") ? 'standard' : 'personalised');
    // need to ge the domain from the profileUrl itself as it could be different from the uid
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setDefaultDomain(user.uid)
          setEmail(fire.auth().currentUser && fire.auth().currentUser.email)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const emailChange = (value) => {
    setEmail(value)
    setEmailChanged(true)
    setEmailError('')
  }

  const domainChange = (value) => {
    setDomain(value)
    setDomainChanged(true)
    setDomainError('')
  }

  const setSelectedDomainTypeChange = (value) => {
    setSelectedDomainType(value)
    setSelectedDomainTypeChanged(true)
    if (value == 'standard') {
      setDomainError('')
    }
  }

  const customDomainChange = (value) => {
    setCustomDomain(value)
  }


  const handleUpdateEmail = (e) => {
    e.preventDefault();

    if (email == '') {
      setEmailError('Your email cannot be empty')
      return null;
    }

    setSaving(true)
    // const user = firebase.auth().currentUser
    fire.auth().currentUser.updateEmail(email)
      .then(() => {
        setSaving(false)
        toast('Email updated')
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          setEmailError('This email is already in use')
        }
        if (err.code === 'auth/invalid-email') {
          setEmailError('Please enter a valid email address')
        }
        if (err.code === 'auth/argument-error') {
          setEmailError('Please enter a valid email address')
        }
        if (err.code === 'auth/weak-password') {
          setPasswordError('The password must be at least 6 characters long')
        }
        setSaving(false)
        console.log(err.code, err.message)
      })
  }

  return (
    <div>
      <div className="card mx-auto mb-5">
        <div className="p-4">
          <h5 className="text-dark-high mb-0">Manage account</h5>
          <p className="text-dark-low mb-0">Edit the email address of your account</p>
        </div>
        <hr className="m-0" />
        <div className="d-flex flex-column m-4">
        <p className="large text-dark-high mb-0">Email address</p>
          <div className="mt-3">
            {/* <input
              type="text"
              className={`small w-100 ${domainError !== '' ? 'error' : null}`}
              disabled={saving}
              value={domainChanged ? domain :
                (
                  userContext &&
                    userContext.profileUrl &&
                    userContext.profileUrl.includes("profile") ?
                    userContext &&
                    userContext.profileUrl.split('/profile/')[1]
                    :
                    userContext &&
                    userContext.profileUrl &&
                    userContext.profileUrl.substring(1)
                )
              }
              onChange={({ target }) => domainChange(target.value)}
            /> */}
            <input
              type="text"
              className={`small w-100 ${emailError !== '' ? 'error' : null}`}
              disabled={saving}
              value={email}
              onChange={({ target }) => emailChange(target.value)}
            />
            {/* <p className="small text-dark-med mt-2 mb-0">vitaely.me/
              {domainChanged ? domain :
                (
                  userContext &&
                    userContext.profileUrl &&
                    userContext.profileUrl.includes("profile") ?
                    userContext &&
                    userContext.profileUrl.split('/profile/')[1]
                    :
                    userContext &&
                    userContext.profileUrl &&
                    userContext.profileUrl.substring(1)
                )
              }
            </p> */}
            {emailError !== '' ? <p className="small text-error-high mt-2 mb-0">{emailError}</p> : null}
          </div>
        </div>
        {/* <div className="d-flex flex-column bg-dark-100 radius-3 p-4 m-4">
          <p className="text-dark-low text-dark-high mb-0">You have not added a custom domain yet</p>
        </div> */}
        <hr className="m-0" />
        <div className="m-4">
          <button type="button" onClick={handleUpdateEmail} className="btn primary high w-100 w-md-auto" disabled={saving}>{!saving ? 'Save' : 'Saving'}</button>

        </div>
      </div>
    </div>
  )
}

export default ChangeEmailSection