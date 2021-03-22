import fire from '../../config/fire-config';
import Link from 'next/link'
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import Head from 'next/head';

import styles  from './profile.module.scss'

const Profile = (props) => {

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  return (
    <div>
      <Head>
        <title>{props.full_name} | {props.headline}</title>
      </Head>
      <Header />
      <Container>
        <div className="mb-5 text-center">
          <img src={props.background_cover_image_url} style={{width:"100%", borderRadius: "0 0 16px 16px"}}/>
          <img src={props.profile_pic_url} style={{height:"160px", width:"160px", borderRadius: "100%", marginTop: "-80px", border:"2px solid white", boxShadow:"0 2px 4px 0 rgba(0,0,0,0.1)"}}/>
          <br /> <br />
          <h2 className="mb-1">{props.full_name}</h2>
          <p className="extra-large mb-4">
            {props.headline}
          </p>
          <div className="d-flex m-auto justify-content-center">
            <a className="btn primary high mr-3">Email me</a>
            <a className="btn primary medium mr-3">Phone me</a>
          </div>
        </div>
        {props.summary &&
          <div className="mb-5">
            <h4>About</h4>
            <div className="card p-4">
              <p className="large mb-0">{props.summary}</p>
            </div>
          </div>
        }
        {props.experiences &&
          <div className="mb-5">
            <h4>Experience</h4>
            <div className="card">
              {props.experiences.map(job => 
                <div key={job.i} className={styles.job}>
                  <p className="large mb-0 text-dark-high">{job.title}</p>
                  <p className="large mb-0">{job.company}</p>
                  <p className="mb-0">{job.location}</p>
                  <p className="text-dark-low mb-0">{convertMonth(job.starts_at.month)} {job.starts_at.year} – {job.ends_at ? convertMonth(job.ends_at.month) + ' ' + job.ends_at.year : 'Present'}</p>
                </div>
              )}
            </div>
          </div>
        }
        {props.education &&
          <div className="mb-5">
            <h4>Education</h4>
            <div className="card">
              {props.education.map(school => 
                <div key={school.i} className={styles.job}>
                  <p className="large mb-0 text-dark-high">{school.field_of_study}</p>
                  <p className="large mb-0">{school.school}</p>
                  <p className="text-dark-low mb-0">{school.starts_at.month ? convertMonth(school.starts_at.month) : ''} {school.starts_at.year} – {school.ends_at ? ( school.ends_at.month ? convertMonth(school.ends_at.month) : '') + ' ' + school.ends_at.year : 'Present'}</p>
                </div>
              )}
            </div>
          </div>
        }
        <Link href="/">
          <a>Back</a>
        </Link>
      </Container>
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const content = {}
  await fire.firestore()
    .collection('users')
    .doc(query.id)
    .get()
    .then(result => {
      content['profile_pic_url'] = result.data().profile.profile_pic_url;
      content['background_cover_image_url'] = result.data().profile.background_cover_image_url;
      content['full_name'] = result.data().profile.full_name;
      content['headline'] = result.data().profile.headline;
      content['summary'] = result.data().profile.summary;
      content['experiences'] = result.data().profile.experiences;
      content['education'] = result.data().profile.education;
    });

  return {
    props: {
      profile_pic_url: content.profile_pic_url,
      background_cover_image_url: content.background_cover_image_url,
      full_name: content.full_name,
      headline: content.headline,
      summary: content.summary,
      experiences: content.experiences,
      education: content.education,
    }
  }
}

export default Profile