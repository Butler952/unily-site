import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../pages/profile/profile.module.scss'
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';

const Projects = ({
  user,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const handleSelect = (index) => {
    handleEditProfileChangeView('Edit project', index)
  }

  const handleAdd = () => {
    handleEditProfileChangeView('Add project')
  }

  const sortProjects = (a,b) => {
    if (a.starts_at &&
        b.starts_at) {
      // console.log(`sorted ${a.company}`)
      if (a.ends_at == undefined & b.ends_at == undefined) {
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
        userContext.profile.projects &&
        // userContext.profile.projects.sort(sortProjects).map((project, index) => 
        userContext.profile.projects.sort(sortProjects).map((project, index) => {

        return (
        <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.job} d-flex flex-column align-items-start`} style={{gap:'16px'}}>
          {/* { project.logo_url ?
            <div>
              <a target="_blank" href={project.link_url} className="d-block position-relative" style={{width: '240px', overflow: 'hidden', paddingTop: '56.25%'}}>
                <img 
                  className="radius-3 bg-light-900"
                  src={project.logo_url ? project.logo_url : null}
                  onError={({ currentTarget }) => {
                    // currentTarget.onerror = null; // prevents looping
                    currentTarget.className = 'd-none' 
                    // currentTarget.style = "display: 'none'" 
                    // placeholder.setAttribute("class", "bg-dark-200 radius-3 d-flex align-items-center justify-content-center d-none");
                    // currentTarget.src="https://via.placeholder.com/150";
                  }}
                  style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: '1'}}
                />
                <div id="placeholder" className="bg-dark-200 radius-3 align-items-center justify-content-center d-flex" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '72px', minHeight:'72px'}}>
                  <Icon icon={ICONS.WORK} size='32' className="fill-dark-700" />
                </div>
              </a>
            </div>
            : 
            <div className="bg-dark-200 radius-3 d-flex align-items-center justify-content-center" style={{width: '72px', height: '72px', minWidth: '72px', minHeight:'72px'}}>
              <Icon icon={ICONS.WORK} size='32' className="fill-dark-700" />
            </div>
          } */}
          <div className="d-flex flex-row justify-content-between w-100" style={{gap:'24px'}}>
            <div className="w-100">
              <p className="large text-dark-high font-weight-semibold mb-0">{project.name}</p>
              {/* <a target="_blank" href={project.company_linkedin_profile_url} className="text-decoration-none"> */}
              {/* <p className="large text-dark-med mb-0">{project.company}</p> */}
              {/* </a> */}
              <p className="text-dark-low mb-0">
                {project.starts_at ? (project.starts_at.month ? convertMonth(project.starts_at.month) + " " : '') : null}
                {project.starts_at ? (project.starts_at.year ? project.starts_at.year + " " : null) : null}
                {project.starts_at && project.ends_at == null ? ' – Present' : null}
                {project.starts_at && project.ends_at.month && project.ends_at.year ? ( project.starts_at.month == project.ends_at.month & project.starts_at.year == project.ends_at.year ? null : ` – ${convertMonth(project.ends_at.month)} ${project.ends_at.year}`) : null }
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
          Add project
        </button>
      </div>
    </>
  )
}

export default Projects;