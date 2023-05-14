import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../pages/profile/profile.module.scss'
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';

const Posts = ({
  user,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  const handleSelect = (index) => {
    handleEditProfileChangeView('Edit post', "Your best written content", index)
  }

  const handleAdd = () => {
    handleEditProfileChangeView('Add post', "Your best written content", )
  }

  const sortPosts = (a,b) => {
    if (a.posted_at &&
        b.posted_at) {
      // console.log(`sorted ${a.company}`)
      if (a.ends_at == undefined & b.ends_at == undefined) {
        if (b.posted_at.year < a.posted_at.year)
          return -1;
        if (b.posted_at.year > a.posted_at.year)
          return 1;
        if (b.posted_at.year == a.posted_at.year) {
          if (b.posted_at.month < a.posted_at.month)
            return -1;
          if (b.posted_at.month > a.posted_at.month)
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
          if (b.posted_at.year < a.posted_at.year)
            return -1;
          if (b.posted_at.year > a.posted_at.year)
            return 1;
          if (b.posted_at.year == a.posted_at.year) {
            if (b.posted_at.month < a.posted_at.month)
              return -1;
            if (b.posted_at.month > a.posted_at.month)
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
      userContext.profile.experiences.sort(sortPosts).map((job, index) => 
        <div key={index}>
          <p>{job.title}</p>
        </div>
      )
    }</p> */}
      { userContext &&
        userContext.profile &&
        userContext.profile.posts &&
        // userContext.profile.posts.sort(sortPosts).map((post, index) => 
        userContext.profile.posts.sort(sortPosts).map((post, index) => {

        return (
        <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.job} d-flex flex-column align-items-start`} style={{gap:'16px'}}>
          <div className="d-flex flex-row justify-content-between w-100" style={{gap:'24px'}}>
            <div className="w-100">
              <p className="large text-dark-high font-weight-medium mb-0">{post.name}</p>
              {/* <a target="_blank" href={post.company_linkedin_profile_url} className="text-decoration-none"> */}
              {/* <p className="large text-dark-med mb-0">{post.company}</p> */}
              {/* </a> */}
              <p className="text-dark-low mb-0">
                {post.posted_at ? (post.posted_at.month ? convertMonth(post.posted_at.month) + " " : '') : null}
                {post.posted_at ? (post.posted_at.year ? post.posted_at.year + " " : null) : null}
              </p>
              {/* {post.description ? <p className="text-dark-med mb-0 mt-3">{post.description}</p> : null} */}
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
          Add post
        </button>
      </div>
    </>
  )
}

export default Posts;