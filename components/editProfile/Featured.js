import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from './EditProfile.module.scss'
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';

const Featured = ({
  user,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (index) => {
    handleEditProfileChangeView('Edit feature', "Places where you've been featured", index)
  }

  const handleAdd = () => {
    handleEditProfileChangeView('Add feature', "Places where you've been featured", )
  }

  return (
    <div className="d-flex flex-column p-3">
    {/* <p>{
      userContext &&
      userContext.profile &&
      userContext.profile.experiences &&
      userContext.profile.experiences.sort(sortFeatured).map((job, index) => 
        <div key={index}>
          <p>{job.title}</p>
        </div>
      )
    }</p> */}
      { userContext &&
        userContext.profile &&
        userContext.profile.featured &&
        // userContext.profile.featured.sort(sortFeatured).map((feature, index) => 
        userContext.profile.featured.map((feature, index) => {

        return (
        <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.menuOption} d-flex flex-column align-items-start`} style={{gap:'16px'}}>
          <div className="d-flex flex-row justify-content-between align-items-center w-100" style={{gap:'24px'}}>
            <div className="d-flex flex-column w-100 gap-1">
              <h6 className="mb-0">{feature.name}</h6>
              {feature.url && <p className="mb-0 text-dark-low">{ feature.url}</p>}
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
          Add feature
        </button>
      </div>
    </div>
  )
}

export default Featured;