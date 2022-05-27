import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToGetPastApplicantRrackingSystems = () => {

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
        title="How to get your resume past Applicant Tracking Systems"
        image='/images/blog/how-to-get-your-resume-past-applicant-tracking-systems/how-to-get-your-resume-past-applicant-tracking-systems.jpg'
        imageAlt="How to get your resume past Applicant Tracking Systems"
        readingDuration="8"
        hideFooter
        description="Before your application ever gets seen by a recruiter or hiring manager, screening software checks whether or not you would be a good fit. Learn about how your application gets screened by Applicant Tracking Systems (ATS) and what you can do to get past them."
        url="how-to-get-your-resume-past-applicant-tracking-systems"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#what-is-an-applicant-tracking-system">What is an Applicant Tracking System?</a></p></li>
          <li><p className="large mb-2"><a href="#how-companies-use-applicant-tracking-systems">How do companies use Applicant Tracking Systems?</a></p></li>
          <li><p className="large mb-2"><a href="#why-is-screening-useful">Why is screening applications useful for companies?</a></p></li>
          <li><p className="large mb-2"><a href="#how-do-applicant-tracking-systems-screen-applications">How do Applicant Tracking Systems screen applications?</a></p></li>
          <li><p className="large mb-2"><a href="#how-to-get-your-resume-past-applicant-tracking-systems">How to get your resume past Applicant Tracking Systems</a></p></li>
          </ul>
        </div>
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div id="what-is-an-applicant-tracking-system" className="py-4 background-light">
          <h3>What is an Applicant Tracking System?</h3>
          <p className="large">An Applicant Tracking System (ATS) is a piece of software that aids the recruitment process by providing a centralised place to help recruiters and hiring managers to manage the job application process. </p>
          <p className="large">They typically allow you to view applicants, monitor where they are in the process, and aid communication both internally and externally. Most ATS software can screen candidates applications in order to assess if a candidate could be a good fit for a role before a human ever lays eyes on the application.</p>
          <p className="large">According to recruitment blog <a href="https://medium.com/swlh/90-of-fortune-500-companies-use-an-applicant-tracking-system-whats-it-5a6b6d25e5e7">Recooty</a>, over 90% of Fortune 500 companies use an ATS to aid their recruitment process.</p>
        </div>
        <div id="how-companies-use-applicant-tracking-systems" className="py-4 background-light">
          <h3>How do companies use Applicant Tracking Systems?</h3>
          <h4>Life without an ATS</h4>
          <p className="large">Imagine you are a recruiter at a large company. You put together a job description for the role you need to be filled and then head out to post the role on all the job boards you can think of. </p>
          <p className="large">As your company is a very attractive place to work, the applications come through in an avalanche. You have to spend hours sifting through applications on several systems, in a bunch of different formats, in order to find potential candidates that you can put through to the hiring manager for review.</p>
          <p className="large">Once you have forwarded on a few candidates, the hiring manager has shortlists a few candidates in a spreadsheet and asks you to get in touch with them to arrange an interview. Some back-and-forth communication takes place with each of the candidates, and you eventually manage to find times that suit everyone.</p>
          <p className="large">Following each interview is done, you chase the hiring manager and their team for feedback on the candidate, which trickles in through a discussion on Slack.</p>
          <p className="large">After completing a couple more rounds of interviews, you prepare a job offer and send it over to the candidate via email. After a bit of awkward downloading, signing, scanning and sending again, the candidate accepts and your company is thrilled to gain a great new employee and you are thoroughly exhausted.</p>
          <br></br>
          <h4>Life with an ATS</h4>
          <p className="large">Now let’s imagine you are a recruiter at a large company that uses an Applicant Tracking System (ATS). You put together a job description for the role you need to be filled and your ATS automatically posts the role on all the major job boards such as Linkedin, Monster, and Indeed.</p>
          <p className="large">As your company is a very attractive place to work, the applications come through in an avalanche. Your ATS software screens all candidates to see if they would be a potential good fit for the role before you ever have to look at an application.</p>
          <p className="large">You take a look at the top candidates that are recommended to you, which are conveniently broken down in a consistent format, and decide to put a few through to the hiring manager for review.</p>
          <p className="large">The hiring manager highlights a couple of candidates in the ATS that they would like to interview. Through the ATS platform, you send over calendar links to the candidates so they can directly book in a time that suits everyone.</p>
          <p className="large">Once each interview is done, the hiring manager and the team fill out scorecards and feedback in your ATS and there’s a clear consensus on who should go through to the next stage.</p>
          <p className="large">After completing a couple more rounds of interviews, you prepare a job offer and send it over through the ATS. The candidate accepts the offer, digitally signs their documents and your company is thrilled to gain a great new employee.</p>
        </div>
        <div id="why-is-screening-useful" className="py-4 background-light">
          <h3>Why is screening applications useful for companies?</h3>
          <p className="large">Job postings can receive hundreds of applicants, and within these, not all of them are going to be suitable for the role. It can take recruiters and hiring managers hours upon hours to manually go through every application to find the right candidate.</p>
          <p className="large">Consider this alongside the fact that human hours are a very expensive resource for companies, and you have a recipe for a process that can quickly drain employee productivity and a company’s finances.</p>
          <p className="large">This is why many Applicant Tracking Systems screen applications as they are submitted in order to give companies an idea if a candidate would be a good fit for the role before a human ever needs to lift a finger. The people involved in the process can then spend their time more efficiently by focussing on reviewing the top potential candidates.</p>
          <p className="large">Applicant Tracking Systems’ ability to screen applications is not at a level which could endanger the livelihoods of recruiters any time soon. But they are useful to filter and sort applications to give recruiters and hiring managers an automated first-guess on which applications are unlikely to be a good fit and those that might be worth looking at.</p>
        </div>
        <div id="how-do-applicant-tracking-systems-screen-applications" className="py-4 background-light">
          <h3>How do Applicant Tracking Systems screen applications?</h3>
          <p className="large">There are a variety of methods that Applicant Tracking Systems use to assess applications. The ATS needs to be able to identify the key information that would be useful in order to assess whether a candidate will be a good fit.</p>
          <p className="large">They do this by looking for keyword matches or, if they are more advanced, through artificial intelligence and natural language processing.</p>
          <p className="large">Some of the key pieces of information that they are looking for are previous roles, previous employers, years of experience, in what fields they are experienced, education, skills and core competencies, and management experience. Special attention is usually paid to the most recent role and employer.</p>
          <p className="large">When looking at skills and competencies, the ATS will assign a weighted score to paint a picture of who you are as a potential employee and where you would fit, and will attempt to rank skills from core competencies to less weighted skills.</p>
          <p className="large">Some ATS software can generate a summary statement based on the information in the resume. As an example, I passed my own resume through TopCV’s resume critique service and got the following summary:</p>
          <div className="bg-dark-200 radius-3 p-4 mt-4">
            <p className="large"><i>“Aaron Butler's experience appears to be concentrated in Engineering / Design, with exposure to User Experience / Human Computer Interaction. Aaron Butler's experience appears to be LOWER-TO-MID LEVEL, with about 4 years of experience, with no management experience.”</i></p>
            <p className="mb-0">Generated by TopCV's Resume Review tool</p>
          </div>
          <div className={`${styles.heroImageWrapper} mt-5`}>
            <Image alt="Top CV Resume Review tool" src='/images/blog/how-to-get-your-resume-past-applicant-tracking-systems/top-cv-resume-review.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="mt-3">See how your resume looks to Applicant Tracking Systems with <a href="https://www.topcv.co.uk/resume-review">TopCV's Resume Review tool</a>.</p>
        </div>
        <div id="how-to-get-your-resume-past-applicant-tracking-systems" className="py-4 background-light">
          <h3>How to get your resume past Applicant Tracking Systems</h3>
          <h4>Use standard section headings</h4>
          <p className="large">Help the ATS to find the information that it’s looking for by using standard names for your sections. Here is a guide on standard sections headings to use:</p>
          <ul>
            <li><p className="large">Contact information</p></li>
            <li><p className="large">Summary</p></li>
            <li><p className="large">Work history or Work experience</p></li>
            <li><p className="large">Education</p></li>
            <li><p className="large">Skills</p></li>
          </ul>
          <br></br>
          <h4>Cover the basics</h4>
          <p className="large">Ensure you include all relevant experience and education. For work experience; this includes all roles you have performed, who the employer was, which dates you worked there. For education; what you have studied, which institution you studied with, and which dates you were there.</p>
          <br></br>
          <h4>Check the job description thoroughly</h4>
          <p className="large">Make sure you take the time to understand what the company is looking for. Then you can look to tailor the rest of the sections on your application to ensure that you present all relevant information that outlines why you’d be a great candidate for this particular role and company.</p>
          <br></br>
          <h4>Tailor your summary to the role</h4>
          <p className="large">Your summary is a chance to introduce yourself, briefly explain why you would be a valuable team member to the company, and to touch on your goals and what interests you in your career.</p>
          <br></br>
          <h4>Show off your achievements</h4>
          <p className="large">In your summaries for each role ensure that you not only include what you were required to do in that role, but also your achievements. Anyone can reel off a description of what the company expected you to do on a day-to-day basis. Only you can share examples of the impact you made.</p>
          <br></br>
          <h4>List out your skills in their own section</h4>
          <p className="large">Spell out clearly where you’re highly skilled. Your core competencies are a key output that Applicant Tracking Systems pull from your resume and you should make it easy for the system to find them.</p>
          <br></br>
          <h4>Write for the person at the other end</h4>
          <p className="large">Congratulations! Your resume made it past ATS software. However, if your keyword stuffing makes it a horrible read for the recruiter or hiring manager at the other end your application will be cast aside. Remember that no matter what, you need to make sure that first and foremost, you’re writing for a person at the other end.</p>
          <br></br>
          <h4>Check spelling and grammar</h4>
          <p className="large">It’s obvious but it’s true. Poor spelling and grammar has the double effect of making it difficult for ATS software to pick out the relevant information that it needs, but it also leaves a poor first impression. It would be a real shame to waste the time you’ve spent preparing your application but not taking two minutes to check your spelling and grammar.</p>
          <br></br>
          <h4>Follow up with the employer</h4>
          <p className="large">Remember that there are real people involved in the hiring process. Sending a follow-up email to the recruiter or hiring manager not only does this do wonders for your first impression and shows that you’re highly engaged in applying for this role, this has the added bonus of making it far more likely that your application will get seen by a real person. You can beat ATS screening by going around it entirely.</p>
          <br></br>
          <h4>Be a permissionless apprentice</h4>
          <p className="large">Get creative in ways to show that you’re keen to land the role and work in their company. Check if they have any in-person events that you can go along to, contribute to open source code projects, tweet their company twitter with suggestions for improving the product or with marketing ideas.</p>
          <br></br>
          <h4>Avoid shady keyword stuffing</h4>
          <p className="large">There’s plenty of advice out there that you should pack in as many keywords as possible or include all the possibly relevant keywords that you can think of as white text somewhere on the resume. Even if this gets through the ATS, the words will be automatically converted to a readable color which means the recruiter on the other end will see it immediately.</p>
          <p className="large">This will look spammy, desperate and doesn’t bode well for your integrity. You can be sure that your application will find the bin and it just might leave a lasting sour taste that hurts your future chances with the company too.</p>
          <br></br>
          <h4>Never lie on your resume</h4>
          <p className="large">You may feel like you have to lie or exaggerate your skills in order to match the job description perfectly. In reality, the job description is what the company is ideally looking for, but they don’t typically expect candidates to have vast experience or be able to do absolutely everything already.</p>
          <p className="large">They understand that you can learn and grow into the role. If you feel like you can do 50% of what’s listed in a job description you should take the plunge and apply.</p>
          <br></br>
          <h4>Avoid using acronyms</h4>
          <p className="large">Write out acronyms in full. For example; write Chief Technical Officer rather than CTO, or better yet, add the acronym in parentheses after the full phrase, such as Chief Technical Officer (CTO). You might be the person that the company is looking for, but acronyms might cost you the opportunity if it means the ATS doesn’t understand what it means.</p>
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

export default HowToGetPastApplicantRrackingSystems;

