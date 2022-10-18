import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../pages/profile/profile.module.scss'
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';

const SideProjects = ({
  user,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const handleSelect = (index) => {
    handleEditProfileChangeView('Edit side project', index)
  }

  const handleAdd = () => {
    handleEditProfileChangeView('Add side project')
  }

  const sortProjects = (a,b) => {
    if (a.starts_at &&
        b.starts_at) {
      // console.log(`sorted ${a.company}`)
      if (a.ends_at == undefined & b.ends_at == undefined ) {
        if (b.starts_at.year < a.starts_at.year)
          return -1;
        if (b.starts_at.year > a.starts_at.year)
          return 1;
        if (b.starts_at.year == a.starts_at.year) {
          if (b.starts_at.month < a.starts_at.month)
            return -1;
          if (b.starts_at.month > a.starts_at.month)
            return 1;
        }
      }
      if (a.ends_at == undefined) {
        return -1;
      }
      if (b.ends_at == undefined) {
        return 1;
      }
      if (b.ends_at.year < a.ends_at.year){
        // console.log(`${b.company} end year is earlier than ${a.company}`)
        return -1;
      }
      if (b.ends_at.year > a.ends_at.year) {
        // console.log(`${b.company} end year is later than ${a.company}`)
        return 1;
      }
      if (b.ends_at.year == a.ends_at.year) {
        // console.log(`${b.company} end year is the same as ${a.company}`)
        if (b.ends_at.month < a.ends_at.month) {
          // console.log(`${b.company} end month is the earlier as ${a.company}`)
          return -1;
        }
        if (b.ends_at.month > a.ends_at.month) {
          // console.log(`${b.company} end month is later than ${a.company}`)
          return 1;
        }
        if (b.ends_at.month == a.ends_at.month) {
          // console.log(`${b.company} end month is the same as ${a.company}`)
          if (b.starts_at.year < a.starts_at.year)
            return -1;
          if (b.starts_at.year > a.starts_at.year)
            return 1;
          if (b.starts_at.year == a.starts_at.year) {
            if (b.starts_at.month < a.starts_at.month)
              return -1;
            if (b.starts_at.month > a.starts_at.month)
              return 1;
          }
        }
      }
    }
    return 1;
  }

  return (
    <>
    {/* <p>{
      userContext &&
      userContext.profile &&
      userContext.profile.experiences &&
      userContext.profile.experiences.sort(sortProjects).map((job, index) => 
        <div key={index}>
          <p>{job.title}</p>
        </div>
      )
    }</p> */}
      { userContext &&
        userContext.profile &&
        userContext.profile.side_projects &&
        // userContext.profile.projects.sort(sortProjects).map((project, index) => 
        userContext.profile.side_projects.sort(sortProjects).map((side_project, index) => {

        return (
        <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.job} d-flex flex-column align-items-start`} style={{gap:'16px'}}>
          <div className="d-flex flex-row justify-content-between w-100" style={{gap:'24px'}}>
            <div className="w-100">
              <p className="large text-dark-high font-weight-semibold mb-0">{side_project.name}</p>
              {/* <a target="_blank" href={project.company_linkedin_profile_url} className="text-decoration-none"> */}
              {/* <p className="large text-dark-med mb-0">{project.company}</p> */}
              {/* </a> */}
              <p className="text-dark-low mb-0">
                {side_project.starts_at ? (side_project.starts_at.month ? convertMonth(side_project.starts_at.month) + " " : '') : null}
                {side_project.starts_at ? (side_project.starts_at.year ? side_project.starts_at.year + " " : null) : null}
                {side_project.starts_at && side_project.ends_at == null ? ' – Present' : null}
                {side_project.starts_at && side_project.ends_at && side_project.ends_at.month && side_project.ends_at.year ? ( side_project.starts_at.month == side_project.ends_at.month & side_project.starts_at.year == side_project.ends_at.year ? null : ` – ${convertMonth(side_project.ends_at.month)} ${side_project.ends_at.year}`) : null }
              </p>
              {/* {project.description ? <p className="text-dark-med mb-0 mt-3">{project.description}</p> : null} */}
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
          Add side project
        </button>
      </div>
    </>
  )
}

export default SideProjects;