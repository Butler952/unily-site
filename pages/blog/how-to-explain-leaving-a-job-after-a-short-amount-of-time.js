import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToExplainLeavingJobAfterShortAmountOfTime = () => {

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
        title="How to explain leaving a job after a short amount of time"
        image='/images/blog/how-to-explain-leaving-a-job-after-a-short-amount-of-time/how-to-explain-leaving-a-job-after-a-short-amount-of-time.jpg'
        imageAlt="An online cv created with vitaely.me"
        readingDuration="2"
        hideFooter
        description="Thinking of leaving your job? You’re not the only one. According to the U.S. Bureau of Labor Statistics; 4.4 million workers quit their jobs in September 2021 alone."
        url="how-to-explain-leaving-a-job-after-a-short-amount-of-time"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#how-short-is-short">How short is short?</a></p></li>
          <li><p className="large mb-2"><a href="#how-to-approach-the-conversation">How to approach the conversation</a></p></li>
          <li><p className="large mb-2"><a href="#still-in-the-job">You’re still in the job</a></p></li>
          <li><p className="large mb-2"><a href="#already-left-the-job">You’ve already left the job</a></p></li>
          </ul>
        </div>
        <div className="py-4 background-light">
          <p className="large">Thinking of leaving your job? You’re not the only one. According to the <a href="https://www.bls.gov/opub/ted/2021/quits-rate-6-6-percent-in-accommodation-and-food-services-in-september-2021.htm " target="_blank">U.S. Bureau of Labor Statistics</a>; 4.4 million workers quit their jobs in September 2021 alone.</p>
          <p className="large">However, let’s say you’ve not been in your last job very long but you want to leave; how do you explain that to a future employer?</p>
        </div>
        <div id="how-short-is-short" className="py-4 background-light">
          <h3>How short is short?</h3>
          <p className="large">Across almost all industries and age groups in the U.S., average tenure has been shrinking over time.</p>
          <p className="large">But the exact amount of time that would be considered a 'short time in the role' varies wildly depending on age and industry. What would be considered a long tenure for a 25 year old may well be considered a short tenure for a 50 year old.</p>
          <p className="large">If you have established that you’ve only been in the role a relatively short time for your circumstances, you now have the challenge of explaining why you’re leaving, or have left, that role that to a future employer.</p>
        </div>
        <div id="how-to-approach-the-conversation" className="py-4 background-light">
          <h3>How to approach the conversation</h3>
          <p className="large">Well, how you approach it depends on one key thing; are you still in the job now and you’re looking to leave or have you already left the job and you’re looking for a new job?.</p>
          <p className="large">Let’s talk through both possibilities.</p>
        </div>
        <div id="still-in-the-job" className="py-4 background-light">
          <h3>You’re still in the job</h3>
          <p className="large">So let’s say you’re still in the job and you’re interviewing for a new position and they ask you “Why do you want to leave your role after such a short period of time?”</p>
          <p className="large">Focus on the pull of the role that you are interviewing for.</p>
          <p className="large">So rather than talking about “Oh, my last employer wasn’t very good” or “I didn’t get along with them”, focus on what’s pulling you to this company. The key thing is to focus on the positives of your potential new role, rather than the negatives.</p>
          <p className="large">That's not to say you should avoid talking about negative experiences entirely, but depending on the interviewer it can sometimes leave a bad impression.</p>
        </div>
        <div id="already-left-the-job" className="py-4 background-light">
          <h3>You’ve already left the job</h3>
          <p className="large">If you’ve already left the job and you’re looking for a new position without being employed currently, try to look quite broad and talk about things like “the company wasn’t going in the direction that I wanted to go in” or “it wasn’t quite aligned to my mission and to my values”.</p>
        </div>
        <div className="py-5 background-light">
          <div className="d-flex flex-column align-items-center container text-center">
            {screenWidth > 767 ?
              <h1 className="hero-title mx-auto mb-4 text-dark-high">Create your online resume in 2 minutes</h1>
              :
              <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your online resume in 2 minutes</h2>
            }
            <p className="mx-auto mb-5 text-dark-med large">Stand out from the crowd. Use your LinkedIn profile to create your very own professional landing page.</p>
<Link href="/users/register" className="btn primary high large">Get started</Link>
          </div>
        </div>
      </Post>
    </div>
  )
}

export default HowToExplainLeavingJobAfterShortAmountOfTime;

