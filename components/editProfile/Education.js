import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../pages/profile/profile.module.scss'
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';

const Education = ({
  user,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const handleSelect = (index) => {
    handleEditProfileChangeView('Edit education', index)
  }

  const handleAdd = () => {
    handleEditProfileChangeView('Add education')
  }

  const sortEducation = (a,b) => {
    if (a.ends_at && 
        a.ends_at.year && 
        a.ends_at.month && 
        b.ends_at && 
        b.ends_at.year && 
        b.ends_at.month &&
        a.starts_at &&
        a.starts_at.year && 
        a.starts_at.month && 
        b.starts_at && 
        b.starts_at.year && 
        b.starts_at.month
      ) {
      if (b.ends_at.year < a.ends_at.year)
        return -1;
      if (b.ends_at.year > a.ends_at.year)
        return 1;
      if (b.ends_at.year = a.ends_at.year) {
        if (b.ends_at.month < a.ends_at.month)
          return -1;
        if (b.ends_at.month > a.ends_at.month)
          return 1;
        if (b.ends_at.month = a.ends_at.month) {
          if (b.starts_at.year < a.starts_at.year)
            return -1;
          if (b.starts_at.year > a.starts_at.year)
            return 1;
          if (b.starts_at.year = a.starts_at.year) {
            if (b.starts_at.month < a.starts_at.month)
              return -1;
            if (b.starts_at.month > a.starts_at.month)
              return 1;
          }
        }
      }
    }
    if (a.ends_at == undefined & b.ends_at == undefined) {
      if (b.starts_at.year < a.starts_at.year)
        return -1;
      if (b.starts_at.year > a.starts_at.year)
        return 1;
      if (b.starts_at.year = a.starts_at.year) {
        if (b.starts_at.month < a.starts_at.month)
          return -1;
        if (b.starts_at.month > a.starts_at.month)
          return 1;
      }
    }
    return 0;
  }

  return (
    <>
      { userContext &&
        userContext.profile &&
        userContext.profile.education &&
        userContext.profile.education.sort(sortEducation).map((school, index) => 
        <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.job} d-flex flex-column flex-lg-row align-items-start`}>
          <div className="d-flex flex-row justify-content-between w-100" style={{gap:'24px'}}>
            {/* { school.logo_url ?
            <div>
              <a target="_blank" href={school.school_linkedin_profile_url}>
                <img className={styles.experienceImage} src={school.logo_url ? school.logo_url : null} style={{width: '72px'}}/>
              </a>
            </div>
            : null} */}
            { school.logo_url ?
            <div>
              <div className="d-block position-relative" style={{width: '72px', height: '72px', minWidth: '72px', minHeight: '72px', maxWidth: '72px', maxHeight: '72px', overflow: 'hidden'}}>
                {/* <img 
                  className={styles.experienceImage} src={school.logo_url ? school.logo_url : null} 
                  style={{width: '72px', height: '72px', minWidth: '72px', minHeight: '72px'}}
                /> */}
                <img 
                  className="radius-3 bg-light-900"
                  src={school.logo_url ? school.logo_url : null}
                  onError={({ currentTarget }) => {
                    // currentTarget.onerror = null; // prevents looping
                    currentTarget.className = 'd-none' 
                    // currentTarget.style = "display: 'none'" 
                    // placeholder.setAttribute("class", "bg-dark-200 radius-3 d-flex align-items-center justify-content-center d-none");
                    // currentTarget.src="https://via.placeholder.com/150";
                  }}
                  style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '72px', minHeight:'72px', zIndex: '1'}}
                />
                <div id="placeholder" className="bg-dark-200 radius-3 align-items-center justify-content-center d-flex" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minWidth: '72px', minHeight:'72px'}}>
                  <Icon icon={ICONS.SCHOOL} size='32' className="fill-dark-700" />
                </div>
              </div>
            </div>
            : 
            <div className="bg-dark-200 radius-3 d-flex align-items-center justify-content-center" style={{width: '72px', height: '72px', minWidth: '72px', minHeight:'72px'}}>
              <Icon icon={ICONS.SCHOOL} size='32' className="fill-dark-700" />
            </div>
            }
            <div className="w-100">
              <p className="large text-dark-high font-weight-semibold mb-0">
                {`${school.field_of_study ? school.field_of_study : ''} ${school.field_of_study && school.degree_name ? `(${school.degree_name})` : (school.degree_name ? school.degree_name : '')}`}
              </p>
              {/* <p className="large text-dark-high font-weight-semibold mb-0">{school.field_of_study}</p> */}
              {/* <a target="_blank" href={school.school_linkedin_profile_url} className="text-decoration-none"> */}
              <p className="large text-dark-med mb-0">{school.school}</p>
              {/* </a> */}
              <p className="text-dark-low mb-0">{school.location}</p>
              <p className="text-dark-low mb-0">
                {school.starts_at ? (school.starts_at.month ? convertMonth(school.starts_at.month) + " " : '') : null}
                {school.starts_at ? (school.starts_at.year ? school.starts_at.year + " " : null) : null}
                {school.starts_at && school.ends_at == null ? ' – Present' : null}
                {school.starts_at && school.ends_at && school.ends_at.month && school.ends_at.year ? ( school.starts_at.month == school.ends_at.month & school.starts_at.year == school.ends_at.year ? null : ` – ${convertMonth(school.ends_at.month)} ${school.ends_at.year}`) : null }
              </p>
              {/* {school.description ? <p className="text-dark-med mb-0 mt-3">{school.description}</p> : null} */}
            </div>
            <div className="d-lg-none"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div>
          </div>
          <div className="d-none d-lg-block"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div>
        </div>
      )}
      <div className="d-flex flex-row p-4">
        <button type="button" onClick={handleAdd} className="btn primary medium icon-left w-100 w-sm-auto">
          <svg viewBox="0 0 24 24">
            <path d={ICONS.PLUS}></path>
          </svg>
          Add education
        </button>
      </div>
    </>
  )
}

export default Education;