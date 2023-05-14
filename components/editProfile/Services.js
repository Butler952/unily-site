import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../pages/profile/profile.module.scss'
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';

const Services = ({
  user,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (index) => {
    handleEditProfileChangeView('Edit service', "What you're offering", index)
  }

  const handleAdd = () => {
    handleEditProfileChangeView('Add service', "What you're offering")
  }

  return (
    <>
    {/* <p>{
      userContext &&
      userContext.profile &&
      userContext.profile.experiences &&
      userContext.profile.experiences.sort(sortServices).map((job, index) => 
        <div key={index}>
          <p>{job.title}</p>
        </div>
      )
    }</p> */}
      { userContext &&
        userContext.profile &&
        userContext.profile.services &&
        // userContext.profile.services.sort(sortServices).map((service, index) => 
        userContext.profile.services.map((service, index) => {

        return (
        <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.job} d-flex flex-column align-items-start`} style={{gap:'16px'}}>
          <div className="d-flex flex-row justify-content-between w-100" style={{gap:'24px'}}>
            <div className="w-100">
              <p className="large text-dark-high font-weight-medium mb-0">{service.name}</p>
              {/* <a target="_blank" href={service.company_linkedin_profile_url} className="text-decoration-none"> */}
              {/* <p className="large text-dark-med mb-0">{service.company}</p> */}
              {/* </a> */}
              {/* {service.description ? <p className="text-dark-med mb-0 mt-3">{service.description}</p> : null} */}
            </div>
            <div className=""><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div>
            {/* <div className="d-none d-lg-block"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div> */}
          </div>
        </div>
        )}
      )}
      <div className="d-flex flex-row p-4">
        <button type="button" onClick={handleAdd} className="btn primary medium icon-left w-100 w-sm-auto">
          <svg viewBox="0 0 24 24">
            <path d={ICONS.PLUS}></path>
          </svg>
          Add service
        </button>
      </div>
    </>
  )
}

export default Services;