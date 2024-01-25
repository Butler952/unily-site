import { useState, useEffect } from 'react';
import Link from 'next/link';
import Post from '../../components/blog/Post';

const FollowUpEmailAfterInterview = () => {

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
        title="What to send in a follow up email after an interview"
        image='/images/blog/what-to-send-in-a-follow-up-email-after-an-interview/what-to-send-in-a-follow-up-email-after-an-interview.jpg'
        imageAlt="What to send in a follow up email after an interview"
        readingDuration="2"
        hideFooter
        description="So you just nailed the interview. You’re now enjoying a well-earned coffee. Your future is now in the hands of fate. All that’s left to do is go back to your life and wait for the company to get back in touch. Right?"
        url="what-to-send-in-a-follow-up-email-after-an-interview"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
            <li><p className="large mb-2"><a href="#thank-you">Start with a polite thank you</a></p></li>
            <li><p className="large mb-2"><a href="#something-interesting">Recall something interesting from the conversation</a></p></li>
            <li><p className="large mb-2"><a href="#anything-else">Ask if there is anything else you can provide</a></p></li>
            <li><p className="large mb-2"><a href="#closing-comments">Closing comments</a></p></li>
          </ul>
        </div>
        <div className="py-4">
          <p className="large">So you just nailed the interview. You’re now enjoying a well-earned coffee. Your future is now in the hands of fate. All that’s left to do is go back to your life and wait for the company to get back in touch. Right?</p>
          <p className="large">It turns out there is a simple way to boost your chances of landing the role, even after the interview has ended; sending a follow-up email to your interviewer.</p>
          <p className="large">Following up after your interview is a simple way to show that you are interested in the role and engaged in the application process.</p>
          <p className="large">It might even make the difference between missing out or landing your dream role. That sounds simple enough, but what should you include in a follow-up email?</p>
        </div>
        <div id="thank-you" className="py-4 background-light">
          <h3>1. Start with a polite thank you</h3>
          <p className="large">Firstly, you want to start with a polite thank you note. For example, “thank you for taking the time to speak to me about the role”.</p>
        </div>
        <div id="something-interesting" className="py-4 background-light">
          <h3>2. Recall something interesting from the conversation</h3>
          <p className="large">After that, it’s a good idea to mention anything interesting that you learned about the role or company throughout the conversation. For example,  "I particularly enjoyed talking about X" or "It was great to learn more about X". This could be the growth of the company, it's future plans, or anything else you genuinely found interesting.</p>
          <p className="large">It’s a small addition that shows you paid attention and that you’re not sending out the same templated email to every interviewer. </p>
        </div>
        <div id="anything-else" className="py-4 background-light">
          <h3>3. Ask if there is anything else you can provide</h3>
          <p className="large">This third one gets missed out all the time, but don’t forget to include it; ask the interviewer if there is anything else you can provide to support your application. For example, “Do let me know if there is anything I can provide to support my application.”</p>
          <p className="large">They may follow up by asking to see more from your portfolio or examples of case studies that you’ve worked on, so it’s a good idea to keep them prepared and ready to send over if needed.</p>
        </div>
        <div id="closing-comments" className="py-4">
          <h3>4. Closing comments</h3>
          <p className="large">And then lastly, finish off with a polite thank you and a look forward to hearing from you soon.</p>
        </div>
        <div className="py-5 background-light">
          <div className="d-flex flex-column align-items-center container text-center" style={{ maxWidth: '640px' }}>
            {screenWidth > 767 ?
              <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your online resume in 2 minutes</h2>
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

export default FollowUpEmailAfterInterview;

