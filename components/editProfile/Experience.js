import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../pages/profile/profile.module.scss'
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';

const Experience = ({
  user,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const handleSelect = (index) => {
    handleEditProfileChangeView('Edit experience', index)
  }

  return (
    <>
      {userContext.profile.experiences && userContext.profile.experiences.map((job, index) => 
        <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.job} d-flex flex-column flex-lg-row align-items-start`}>
          <div className="d-flex flex-row justify-content-between w-100" style={{gap:'24px'}}>
            { job.logo_url ?
            <div>
              <a target="_blank" href={job.company_linkedin_profile_url}>
                <img className={styles.experienceImage} src={job.logo_url ? job.logo_url : null} />
              </a>
            </div>
            : null}
            <div className="w-100">
              <p className="large text-dark-high font-weight-semibold mb-0">{job.title}</p>
              {/* <a target="_blank" href={job.company_linkedin_profile_url} className="text-decoration-none"> */}
              <p className="large text-dark-med mb-0">{job.company}</p>
              {/* </a> */}
              <p className="text-dark-low mb-0">{job.location}</p>
              <p className="text-dark-low mb-0">
                {job.starts_at ? (job.starts_at.month ? convertMonth(job.starts_at.month) + " " : '') : null}
                {job.starts_at ? (job.starts_at.year ? job.starts_at.year + " " : null) : null}
                {job.starts_at && job.ends_at == null ? ' – Present' : null}
                {job.starts_at && job.ends_at ? " – " + (job.ends_at.month ? convertMonth(job.ends_at.month) : '') : null}
                {job.starts_at && job.ends_at ? (job.ends_at.year ? " " + job.ends_at.year : null) : null}
              </p>
              {/* {job.description ? <p className="text-dark-med mb-0 mt-3">{job.description}</p> : null} */}
            </div>
            <div className="d-lg-none"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div>
          </div>
          <div className="d-none d-lg-block"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div>
        </div>
      )}
      <div className="d-flex flex-row justify-content-end p-4">
        <button type="button" className="btn primary medium icon-left w-100 w-sm-auto">
          <svg viewBox="0 0 24 24">
            <path d={ICONS.PLUS}></path>
          </svg>
          Add role
        </button>
      </div>
    </>
  )
}

export default Experience;