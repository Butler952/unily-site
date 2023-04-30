import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../pages/profile/profile.module.scss'
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';

const Links = ({
  user,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const handleSelect = (index) => {
    handleEditProfileChangeView('Edit link', "Highlight anything you like", index)
  }

  const handleAdd = () => {
    handleEditProfileChangeView('Add link', "Highlight anything you like", )
  }

  let linksList = [
    {
      'label': 'Twitter',
      'url': 'https://www.twitter.com/butler952'
    },
    {
      'label': 'Github',
      'url': 'https://www.github.com/butler952'
    }
  ]

  return (
    <>
      <div onClick={() => handleSelect()} role="button" className={`${styles.job} d-flex flex-column flex-lg-row align-items-start`}>
        <div className="d-flex flex-row justify-content-between w-100" style={{gap:'24px'}}>
          <div className="w-100">
            <p className="large text-dark-high font-weight-semibold mb-0">Contact me</p>
            <p className="large text-dark-med mb-0">{userContext && userContext.email && userContext.email}</p>
          </div>
          <div className="d-lg-none"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div>
        </div>
        <div className="d-none d-lg-block"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div>
      </div>
      {/* { linksList.map((link, index) =>  */}
      { userContext && 
        userContext.links &&
        userContext.links.map((link, index) => 
        <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.job} d-flex flex-column flex-lg-row align-items-start`}>
          <div className="d-flex flex-row justify-content-between w-100" style={{gap:'24px'}}>
            <div className="w-100">
              <p className="large text-dark-high font-weight-semibold mb-0">{link.label}</p>
              <p className="large text-dark-med mb-0">{link.url}</p>
            </div>
            <div className="d-lg-none"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div>
          </div>
          <div className="d-none d-lg-block"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div>
        </div>
      )}
      { userContext && 
        userContext.links &&
        userContext.links.length < 1 &&
          <div className="d-flex flex-row p-4">
            <button type="button" onClick={handleAdd} className="btn primary medium icon-left w-100 w-sm-auto">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.PLUS}></path>
              </svg>
              Add link
            </button>
          </div>
      }
    </>
  )
}

export default Links;