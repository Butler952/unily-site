import { useState, useEffect } from 'react';
import Link from 'next/link';
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToAceRecordedInterviews = () => {

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
        title="How to ace recorded interviews"
        image='/images/blog/how-to-ace-recorded-interviews/how-to-ace-recorded-interviews.jpg'
        imageAlt="How to ace recorded interviews"
        readingDuration="2"
        hideFooter
        description="Recorded interviews are much like a phone or online video interview, except at no point in a recorded interview will you have to live chat face-to-face with a person."
        url="how-to-ace-recorded-interviews"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#what-is-a-recorded-interview">What is a recorded interview?</a></p></li>
          <li><p className="large mb-2"><a href="#why-you-should-know-about-recorded-interviews">Why you should know about recorded interviews</a></p></li>
          <li><p className="large mb-2"><a href="#recorded-interviews-are-interviews">Recorded interview = Interview</a></p></li>
          <li><p className="large mb-2"><a href="#you-will-have-time-to-prepare-an-answer">Don’t fret about having to give answers on the spot</a></p></li>
          <li><p className="large mb-2"><a href="#tackle-your-nerves">Tackle your nerves</a></p></li>
          </ul>
        </div>
        <div id="what-is-a-recorded-interview" className="py-4 background-light">
          <h3>What is a recorded interview?</h3>
          <p className="large">Recorded interviews are much like a phone or online video interview, except at no point in a recorded interview will you have to live chat face-to-face with a person.</p>
          <p className="large">The questions are pre-prepared and presented to you as text, audio or even video formate. You’ll then have a set amount of time to record a response and send it over to the organisation; hence their other name of “one-way interviews”.</p>
        </div>
        <div id="why-you-should-know-about-recorded-interviews" className="py-4 background-light">
          <h3>Why you should know about recorded interviews</h3>
          <p className="large">Recorded interviews are steadily growing in popularity with companies increasing the range of roles that are recruited for using this technique.</p>
          <p className="large">While the technique is used in the early stages of the interview process for all kinds of roles, it is more commonly used for roles where the company is expecting a large number of applicants such as graduate or entry-level role, or simply for remote roles.</p>
          <p className="large">This technique is often used to pick out promising candidates before inviting them to a face-to-face or live video interview at a later stage.</p>
          <p className="large">Now you've been invited to a recorded interview, here are three tips to ace them:</p>
        </div>
        <div id="recorded-interviews-are-interviews" className="py-4 background-light">
          <h3>1. Recorded interview = Interview</h3>
          <p className="large">First things first, treat it like a real interview.</p>
          <p className="large">
            One of the reasons employers do recorded interviews is to check your communication skills. If you treat it like you're speaking to a screen you don't come off as natural.
          </p>
          <p className="large">
            To combat this, try to pretend as much as possible that you're speaking to a real person.
          </p>
          <p className="large">It also means you need to prepare for the interview like any other. They’re going to be asking real interview questions so make sure the you’ve done the usual prep beforehand.</p>
          <p className="large">Our post on <a href="/blog/four-things-to-research-about-a-company-before-an-interview">four things to research about a company before an interview</a> is a good place to start.</p>

        </div>
        <div id="you-will-have-time-to-prepare-an-answer" className="py-4 background-light">
          <h3>2. Don’t fret about having to give answers on the spot</h3>
          <p className="large">The majority of the time when a question comes up they will give you at least thirty seconds to prepare an answer before you have to start making a video.</p>
          <p className="large">Enough time to form a sensible answer so you won’t be caught off-guard when you’re answering a question.</p>
        </div>
        <div id="tackle-your-nerves" className="py-4 background-light">
          <h3>3. Tackle your nerves</h3>
          <p className="large">Getting a hold of your nerves can be easier said than done, of course.</p>
          <p className="large">Try to take it from the perspective that it’s kind of easier than speaking to a real person because there’s not that person there at the time actively judging your answers as you say them.</p>
        </div>
        <div className="py-5 background-light">
          <div className="d-flex flex-column align-items-center container text-center">
            {screenWidth > 767 ?
              <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{maxWidth: '560px'}}>Create your online resume in 2 minutes</h2>
              :
              <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{maxWidth: '560px'}}>Create your online resume in 2 minutes</h2>
            }
            <p className="mx-auto mb-5 text-dark-med large">Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page.</p>
            <Link href="/users/register" className="btn primary high large">Get started</Link>
          </div>
        </div>
      </Post>
    </div>
  )
}

export default HowToAceRecordedInterviews;