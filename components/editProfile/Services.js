import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from './EditProfile.module.scss'
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
    <div className="d-flex flex-column p-3">
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
        <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.menuOption} d-flex flex-column align-items-start`} style={{gap:'16px'}}>
          <div className="d-flex flex-row justify-content-between align-items-center w-100" style={{gap:'24px'}}>
            <div className="d-flex flex-column w-100 gap-1">
              <h6 className="mb-0">{service.name}</h6>
              {service.url && <p className="mb-0 text-dark-low">{ service.url}</p>}
            </div>
            <div className=""><Icon icon={ICONS.ARROW_RIGHT} size='24' className="fill-dark-900" /></div>
            {/* <div className="d-none d-lg-block"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div> */}
          </div>
        </div>
        )}
      )}
      <div className="d-flex flex-row p-3">
        <button type="button" onClick={handleAdd} className="btn primary medium icon-left w-100 w-sm-auto">
          <svg viewBox="0 0 24 24">
            <path d={ICONS.PLUS}></path>
          </svg>
          Add service
        </button>
      </div>
    </div>
  )
}

export default Services;