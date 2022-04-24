import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToCreateAPersonalLandingPage = () => {

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
        title="How to create a personal landing page"
        image='/images/profile-preview.png'
        imageAlt="A personal landing page created with Vitaely.me"
        readingDuration="2"
        hideFooter
        description="A landing page is typically the first page that a user may come to when looking for information about a particular product, feature, service, or organisation. It could be likened to an interactive billboard on the internet."
        url="how-to-create-a-personal-landing-page"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#what-is-a-landing-page">What is a landing page?</a></p></li>
          <li><p className="large mb-2"><a href="#key-elements-of-a-landing-page">Key elements of a landing page</a></p></li>
          <li><p className="large mb-2"><a href="#what-is-a-personal-landing-page">What is a personal landing page?</a></p></li>
          <li><p className="large mb-2"><a href="#why-do-you-need-one">Why do you need one?</a></p></li>
          <li><p className="large mb-2"><a href="#guide">How create an online CV with Vitaely.me</a></p></li>
          </ul>
        </div>
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div id="what-is-a-landing-page" className="py-4 background-light">
          <h3>What is a landing page?</h3>
          <p className="large">A landing page is typically the first page that a user may come to when looking for information about a particular product, feature, service, or organisation. It could be likened to an interactive billboard on the internet.</p>
          <p className="large">Landing pages try to stay focussed on a particular topic usually, although not always, with the aim of encouraging the reader to take an action that the organisation desires.</p>
          <p className="large">Other reasons why a landing page may exist is to build credibility or awareness of the brand, organisation or subject with the hope of the user recalling them later on when they need to solve another problem or take a different action.</p>
          <p className="large">The homepage of a website is a form of landing page, but differs in the sense that it will usually contain information and links to a wider variety of topics that the user can expect to find on the website.</p>
        </div>
        <div id="key-elements-of-a-landing-page" className="py-4 background-light">
          <h3>The three key elements of a landing page</h3>
          <br></br>
          <h4>1) Identify the subject</h4>
          <p className="large">A good landing page will make the subject of the page abundantly clear above the fold; the part of the page that you can see without scrolling.</p>
          <p className="large">Just based on this section a reader should have a fairly accurate expectation of what the information on the rest of the page will contain.</p>
          <br></br>
          <h4>2) Provide more detail</h4>
          <p className="large">The rest of the page will contain information related to the main subject, usually in more detail that at the top of the page.</p>
          <p className="large">It may also contain relevant information about related topics, but this can detract from the focus on the main topic of the page.</p>
          <br></br>
          <h4>3) Call to action</h4>
          <p className="large">This is a specific behaviour that you want the viewer of the page to do. Some common examples of this are to sign up to a service, to buy a product, to book a follow-up chat or to contact the organisation for more information.</p>
          {/* <div className={`${styles.featureCard} mt-5`}>
            <img alt="A pile of paper on a table" src='../../images/blog/how-to-create-an-online-cv/recruiters-have-to-dig-through-hundreds-of-CVs.jpg'></img>
          </div>
          <p className="mt-3">Recruiters often have to dig through hundreds of similar CVs. Photo by <a href="https://unsplash.com/@rainierridao">Rainier Ridao</a>.</p> */}
        </div>
        <div id="what-is-a-personal-landing-page" className="py-4 background-light">
          <h3>What is a personal landing page?</h3>
          <p className="large">A personal landing page is very much like any other landing page, except instead of being focussed on a product, feature, or service; it is focussed on you.</p>
        </div>
        <div id="why-do-you-need-one" className="py-4 background-light">
          <h3>Why do you need one?</h3>
          <p className="large">The purpose of a personal landing page is to have an online presence, build credibility, get the reader to take a specific action like contacting you, booking in a call, or subscribing to a newsletter.</p>
          <p className="large">Having professional information about yourself online can help potential employers, clients or recruiters to find you through search engines like Google.</p>
          <p className="large">A benefit of having an independent personal landing page is that it removes the distraction of other people’s profiles that sites like LinkedIn present.</p>
        </div>
        <div id="guide" className="py-4 background-light">
          <h3>How create a personal landing page with Vitaely.me</h3>
          <ul>
            <li><p className="large">Create your <Link href="/users/register">free account</Link></p></li>
            <li><p className="large">Grab the URL of your Linkedin profile and sync your data</p></li>
            <li><p className="large">You're done! Your personal landing page is ready</p></li>
          </ul>
          <div className={`${styles.featureCard} mt-5`}>
            <video controls alt="Sycning your data from LinkedIn to Vitaely.me" src='../../images/blog/how-to-create-an-online-cv/vitaely-me-sync-with-linked.mp4'></video>
          </div>
          <p className="mt-3">Sycning your data from LinkedIn is as easy as pasting the URL.</p>
        </div>
        <div className="py-5 background-light">
            <div className="d-flex flex-column align-items-center container text-center">
              {screenWidth > 767 ?
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your personal landing page in 2 minutes</h2>
                :
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your personal landing page in 2 minutes</h2>
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

export default HowToCreateAPersonalLandingPage;

