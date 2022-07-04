import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const RedFlagsInJobDescriptions = () => {

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
        title="Four red flags to look out for in job descriptions"
        image='/images/blog/red-flags-in-job-descriptions/red-flags-in-job-descriptions.jpg'
        imageAlt="Four red flags to look out for in job descriptions"
        readingDuration="2"
        hideFooter
        description="You probably know about some of the typical red flags in job descriptions; things like describing themselves as a family or not having the salary on the job description are recognisable enough to make you run for the hills."
        url="red-flags-in-job-descriptions"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#unnecessary-education-requirements">Unnecessary education requirements</a></p></li>
          <li><p className="large mb-2"><a href="#mismatch-experience-seniority">Mismatch between experience and seniority</a></p></li>
          <li><p className="large mb-2"><a href="#long-lists-of-requirements">Super long list of responsibilities</a></p></li>
          <li><p className="large mb-2"><a href="#overemphasising-core-responsibilities">Overemphasising core responsibilities</a></p></li>
          </ul>
        </div>
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div className="py-4 background-light">
          <p className="large">You probably know about some of the typical red flags in job descriptions; things like describing themselves as a family or not having the salary on the job description are recognisable enough to make you run for the hills.</p>
          <p className="large">We trawled live job descriptions on Linkedin to pick out red flags that are quite subtle, so much so that you might not have even noticed them.</p>
        </div>
        <div id="unnecessary-education-requirements" className="py-4 background-light">
          <h3>1. Unnecessary education requirements</h3>
          <p className="large">We found a fairly standard job description for a recruiter role that on the face of it seems reasonable. However, upon closer inspection the company requires applicants to have a degree in Human Resource Management.</p>
          <p className="large">The reason that that’s a red flag is that to be a recruiter you absolutely do not need a degree, and the fact that they’ve listed this should make you think that they don’t actually know what it takes to be a successful recruiter.</p>
          <p className="large">If you were looking for a job and came across this role, think twice before applying.</p>
        </div>
        <div id="mismatch-experience-seniority" className="py-4 background-light">
          <h3>2. Mismatch between experience and seniority</h3>
          <p className="large">We found a role where the company expected candidates to have 1–3 years of experience; a sensible expectation for an entry-level or even some higher level roles.</p>
          <p className="large">The problem is that this role is for an internship. By definition, companies should expect that suitable candidates for an internship have no industry experience so far.</p>
          <p className="large">It is important to note that while experience should not be necessary for applicants for an internship, they should be able to demonstrate genuine interest in the field. Self-initiated projects are a great way to do this and act as a fantastic discussion point during your interview.</p>
        </div>
        <div id="long-lists-of-requirements" className="py-4 background-light">
          <h3>3. Super long list of responsibilities</h3>
          <p className="large">We found one role in particular with 18 bullet points of responsibilities.</p>
          <p className="large"> This is overkill for almost any role. But this is especially a red flag if the compensation for the role does not match up with what the job expects of you.</p>
        </div>
        <div id="overemphasising-core-responsibilities" className="py-4 background-light">
          <h3>4. Overemphasising core responsibilities</h3>
          <p className="large">This is more of an amber flag than a red flag, but as an example, we found a recruiter role where the first requirement for the job reads “Hiring a lot”.</p>
          <p className="large">Now, on the surface this may seem like a perfectly reasonable thing to include in a job description for a recruiter. If you’re a recruiter, you know that you’re going to be hiring a lot. It’s a core part of your job.</p>
          <p className="large">However, the fact that the company felt the need to spell this out explicitly should tell you that this job is not going to be just busy, but utterly chaotic.</p>
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

export default RedFlagsInJobDescriptions;

