import { useState, useEffect } from 'react';
import Link from 'next/link';
import Post from '../../components/blog/Post';

const ApplyingForARoleWithoutYearsOfExperience = () => {

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Post 
        title="Why you should apply for a role even if you don’t meet the years of experience"
        image='/images/blog/applying-for-a-role-without-years-of-experience/applying-for-a-role-without-years-of-experience.jpg'
        imageAlt="Why you should apply for a role even if you don’t meet the years of experience"
        readingDuration="2"
        hideFooter
        description="Have you ever found yourself doubting whether you should apply for a job because you don’t meet the years of experience listed on the job description?"
        url="applying-for-a-role-without-years-of-experience"
      >
        {/* <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#what-is-an-applicant-tracking-system">What is an Applicant Tracking System?</a></p></li>
          <li><p className="large mb-2"><a href="#how-companies-use-applicant-tracking-systems">How do companies use Applicant Tracking Systems?</a></p></li>
          <li><p className="large mb-2"><a href="#why-is-screening-useful">Why is screening applications useful for companies?</a></p></li>
          <li><p className="large mb-2"><a href="#how-do-applicant-tracking-systems-screen-applications">How do Applicant Tracking Systems screen applications?</a></p></li>
          <li><p className="large mb-2"><a href="#how-to-get-your-resume-past-applicant-tracking-systems">How to get your resume past Applicant Tracking Systems</a></p></li>
          </ul>
        </div> */}
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div className="py-4">
          <p className="large">Have you ever found yourself doubting whether you should apply for a job because you don’t meet the years of experience listed on the job description?</p>
          <p className="large">You’re not alone. Many candidates will look at the number of years of experience required on a job description, then think that they won’t even be considered and won’t bother applying.</p>
          <p className="large">We’re here to tell you that: yes, you should apply for that role!</p>
          <p className="large">As long as you can perform most of the requirements on the job description effectively you shouldn’t let the number of years of experience listed put you off applying for a role.</p>
          <p className="large">Despite listing the number of years of experience they are looking for in a candidate, this is still less important than finding a candidate that is actually able to do the job effectively.</p>
          <p className="large">Experience does not equal proficiency. Just because a person has worked a job for 5 years does not necessarily mean that they are better than someone who has worked only 2 years in a similar role.</p>
          <p className="large">It pays to make it as easy as possible for the hiring manager to understand that you have experience in the role and can do as many things as possible that they are asking for.</p>
          <p className="large">Listing the things you have experience in doing is a good start. Also try to include your achievements in your role and the great outcomes that your work has created.</p>
          <p className="large">Some practical ways to make your experience stand out are to list quantifiable achievements in your role. This can look like:</p>
          <ul>
            <li><p className="large">Moving a key metric with your team (delivering a project X amount under budget, or growing X metric by 30%)</p></li>
            <li><p className="large">Improving a process (something that previously took 2 hours to do, now takes 20 minutes because of a process you made more efficient)</p></li>
            <li><p className="large">Awards or recognition that you've received</p></li>
          </ul>
          <p className="large">Be prepared for a slightly harder time in convincing the hiring manager of your abilities, but if you can prove that you’re able to do it, employers will be happy to overlook that fact that you don’t match up to the years of experience on the job description.</p>
        </div>
        <div className="py-5 background-light">
            <div className="d-flex flex-column align-items-center container text-center" style={{maxWidth: '640px'}}>
              {screenWidth > 767 ?
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your online resume in 2 minutes</h2>
                :
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your online resume in 2 minutes</h2>
              }
              <p className="mx-auto mb-5 text-dark-med large">Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page.</p>
              <Link href="/users/register">
                <a className="btn primary high large">Get started</a>
              </Link>
            </div>
          </div>
      </Post>
    </div>
  )
}

export default ApplyingForARoleWithoutYearsOfExperience;

