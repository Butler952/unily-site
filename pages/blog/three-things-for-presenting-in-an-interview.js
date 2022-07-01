import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const ThreeThingsFoPresentingInAnInterview = () => {

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
        title="Three things you should be doing if you ever have to present in an interview"
        image='/images/blog/three-things-for-presenting-in-an-interview/three-things-for-presenting-in-an-interview.jpg'
        imageAlt="Three things you should be doing if you ever have to present in an interview"
        readingDuration="2"
        hideFooter
        description="You might’ve heard this as the oft-misquoted advice: “Tell them what you are going to tell them, tell them, then tell them what you told them”. It’s a classic but it still rings truer than ever."
        url="how-to-get-your-resume-past-applicant-tracking-systems"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#cover-the-agenda">Cover the agenda at the beginning and at the end of the presentation</a></p></li>
          <li><p className="large mb-2"><a href="#ask-for-question">Don’t wait until the end to ask if anybody has any questions</a></p></li>
          <li><p className="large mb-2"><a href="#regulate-your-pace">Regulate how quickly you’re talking</a></p></li>
          </ul>
        </div>
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div id="cover-the-agenda" className="py-4 background-light">
          <h3>1. Cover the agenda at the beginning and at the end of the presentation</h3>
          <p className="large">You might’ve heard this as the oft-misquoted advice: “Tell them what you are going to tell them, tell them, then tell them what you told them”. It’s a classic but it still rings truer than ever.</p>
          <p className="large">Think of this as like the introduction and conclusion if you’re writing an essay.</p>
          <p className="large">“In this presentation today I will cover…”And then at the end: “In this presentation I have covered X, Y, and Z”</p>
          <p className="large">These opening and closing remarks are a great way to help your interviewer to find what they are looking for in a great candidate.</p>
          <p className="large">Saying the same thing three times, however, can be a little boring for the audience.</p>
          <p className="large">Try not to reveal all the details in your introduction, and instead focus on building intrigue by giving them a rough outline without revealing the most important insights.</p>
        </div>
        <div id="ask-for-question" className="py-4 background-light">
          <h3>2. Don’t wait until the end to ask if anybody has any questions</h3>
          <p className="large">It’s really good for your engagement to check in if anybody has questions throughout. It makes sure that they’re still listening to you.</p>
          <p className="large">If you’re happy to field questions at any time in your presentation, let your audience know near the start.</p>
          <p className="large">This is great because it gives people more confidence to interrupt you. This means they can get clarification at any time and minimises the chance that your audience may forget questions if they’re only left to the end.</p>
          <p className="large">If you don’t want constant interruptions, try pausing after each section of the presentation to check if there are any burning questions.</p>
        </div>
        <div id="regulate-your-pace" className="py-4 background-light">
          <h3>3. Regulate how quickly you’re talking</h3>
          <p className="large">When people are presenting they tend to be really nervous and they talk at like 100 miles an hour. If that’s you then just remind yourself to slow down.</p>
          <p className="large">Taking a little more time can help you to speak clearly and avoid slurring words together and make sure you’re getting your point across.</p>
          <p className="large">Try pausing before and after your sentences. This can be an effective way to slow yourself down and give the interviewer the time to process the last thing you said.</p>
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

export default ThreeThingsFoPresentingInAnInterview;

