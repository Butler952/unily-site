import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToCreateAnOnlineCV = () => {

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
        title="How to create an online CV in 2 minutes"
        image='/images/profile-preview.png'
        imageAlt="An online cv created with Vitaely.me"
        readingDuration="2"
        hideFooter
        description="Much like an offline CV; an online CV is a chance to share a bit about yourself, your professional experience and you education, amongst other things. Usually a CV is submitted as part of a job application and will very likely make up the first pieces of information that any potential employer, partner, or client will learn about you."
        url="how-to-create-an-online-cv"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#what-is-an-online-cv">What is an online CV?</a></p></li>
          <li><p className="large mb-2"><a href="#why-do-i-need-one">Why do I need one?</a></p></li>
          <li><p className="large mb-2"><a href="#how-do-i-make-one">How do I make an online CV?</a></p></li>
          <li><p className="large mb-2"><a href="#guide">How create an online CV with Vitaely.me</a></p></li>
          </ul>
        </div>
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div id="what-is-an-online-cv" className="py-4 background-light">
          <h3>What is an online CV?</h3>
          <p className="large">Much like an offline CV; an online CV is a chance to share a bit about yourself, your professional experience and you education, amongst other things. Usually a CV is submitted as part of a job application and will very likely make up the first pieces of information that any potential employer, partner, or client will learn about you.</p>
        </div>
        <div id="why-do-i-need-one" className="py-4 background-light">
          <h3>Why do I need one?</h3>
          <p className="large">Traditionally, CVs are submitted in the form of a Word document or PDF. A person in charge of hiring can sift through hundreds of them in order to find what they are looking for. </p>
          <p className="large">Having an online CV helps to build credibility and stand out from the crowd. It also helps to build exposure online through SEO. Having a website can make it much easier for you to be found online. You never know what opportunities it may open up for you.</p>
          {/* <div className={`${styles.featureCard} mt-5`}>
            <img alt="A pile of paper on a table" src='../../images/blog/how-to-create-an-online-cv/recruiters-have-to-dig-through-hundreds-of-CVs.jpg'></img>
          </div> */}
          <div className={`${styles.heroImageWrapper} mt-5`}>
            <Image alt="A pile of paper on a table" src='/images/blog/how-to-create-an-online-cv/recruiters-have-to-dig-through-hundreds-of-CVs.jpg' layout="fill" objectFit="cover" />
          </div>
          <p className="mt-3">Recruiters often have to dig through hundreds of similar CVs. Photo by <a href="https://unsplash.com/@rainierridao">Rainier Ridao</a>.</p>
        </div>
        <div id="how-do-i-make-one" className="py-4 background-light">
          <h3>How do I make an online CV?</h3>
          <p className="large">There are many places where you can start building an online presence. Tools such as Squarespace, Webflow and Universe allow you to create websites relatively easily with no need to learn how to code.</p>
          <p className="large">Vitaely.me offers a super simple way to turn your LinkedIn profile into a personal online CV in just 2 minutes.</p>
        </div>
        <div id="guide" className="py-4 background-light">
          <h3>How create an online CV with Vitaely.me</h3>
          <ul>
            <li><p className="large">Create your <Link href="/users/register">free acount</Link></p></li>
            <li><p className="large">Grab the URL of your Linkedin profile and sync your data</p></li>
            <li><p className="large">You're done! Your online CV is ready</p></li>
          </ul>
          <div className={`${styles.featureCard} mt-5`}>
            <video controls alt="Sycning your data from LinkedIn to Vitaely.me" src='../../images/blog/how-to-create-an-online-cv/vitaely-me-sync-with-linked.mp4'></video>
          </div>
          <p className="mt-3">Sycning your data from LinkedIn is as easy as pasting the URL.</p>
        </div>
        <div className="py-5 background-light">
            <div className="d-flex flex-column align-items-center container text-center">
              {screenWidth > 767 ?
                <h1 className="hero-title mx-auto mb-4 text-dark-high">Create your online CV in 2 minutes</h1>
                :
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your online CV in 2 minutes</h2>
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

export default HowToCreateAnOnlineCV;

