import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToDownloadYourResumeAsAPdf = () => {

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
        title="How to download your resume as a PDF"
        image='/images/blog/how-to-download-your-resume-as-a-pdf/How to download your resume as a PDF.jpg'
        imageAlt="How to download your resume as a PDF"
        readingDuration="2"
        hideFooter
        description="You’ve created your profile with expertpage.io and you’ve now got a beautiful personal landing page with all your information. Now what? We’re happy to share that you can now download your profile as a PDF!"
        url="how-to-download-your-resume-as-a-pdf"
      >
        {/* <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#what-is-an-online-cv">What is an online CV?</a></p></li>
          <li><p className="large mb-2"><a href="#why-do-i-need-one">Why do I need one?</a></p></li>
          <li><p className="large mb-2"><a href="#how-do-i-make-one">How do I make an online CV?</a></p></li>
          <li><p className="large mb-2"><a href="#guide">How create an online CV with expertpage.io</a></p></li>
          </ul>
        </div> */}
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div className="py-4 background-light">
          <p className="large">You’ve created your profile with expertpage.io (if not you can <Link href="/users/register">get started here</Link>) and you’ve now got a beautiful personal landing page with all your information. Now what?</p>
          <p className="large">We’re happy to share that you can now download your profile as a PDF!</p>
          <p className="large">But how?</p>
        </div>
        <div className="py-4 background-light">
          <h3>How to download your resume as a PDF</h3>
          <br></br>
          <h4>1. Head to your <i>settings</i></h4>
          <p className="large">You will need to be <Link href="/users/login">logged in</Link> to your account before you can access your settings.</p>
          <p className="large">Once you're logged in you can get to your settings page via the link in the navigation bar or simply follow <Link href="/settings">this link</Link> to head straight there.</p>
          <div className={`${styles.heroImageWrapper} mt-5`}>
            <Image alt="Accessing your settings page from the dropdown menu in the nav bar" src='/images/blog/how-to-download-your-resume-as-a-pdf/ExpertPage-go-to-settings.jpg' layout="fill" objectFit="cover" />
          </div>
          <p className="mt-3">Finding the link to your settings page from the navigation bar.</p>
          <br></br>
          <h4>2. Find the <i>Download resume</i> section</h4>
          <p className="large">Once you're on your settings page, scroll down to find the <i>Download resume</i> section. </p>
          <div className={`${styles.heroImageWrapper} mt-5`}>
            <Image alt="Download resume section in the settings page" src='/images/blog/how-to-download-your-resume-as-a-pdf/ExpertPage-download-resume-section.jpg' layout="fill" objectFit="cover" />
          </div>
          <p className="mt-3">The <i>Download resume</i> section in your settings</p>
          <br></br>
          <h4>3. Hit the PDF button</h4>
          <p className="large">Once you've found the <i>Download resume</i> section, hit the <i>PDF</i> button and your resume will begin downloading.</p>
          <p className="large">And there you have it, you have exported a PDF of your resume.</p>
        </div>
        <div className="py-4 background-light">
          <p className="large">If you give it a go, we'd love to hear any feedback on the resume PDF and especially if there's anything you think we can do to make it better.</p>
          <p className="large">Thank you for supporting the product!</p>
        </div>
        <div className="py-5 background-light">
          <div className="d-flex flex-column align-items-center container text-center" style={{maxWidth: '640px'}}>
            {screenWidth > 767 ?
              <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your PDF resume in minutes</h2>
              :
              <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your PDF resume in minutes</h2>
            }
            <p className="mx-auto mb-5 text-dark-med large">Stand out from the crowd. Use your LinkedIn profile to create your very own PDF resume.</p>
            <Link href="/users/register">
              <a className="btn primary high large">Get started</a>
            </Link>
          </div>
        </div>
      </Post>
    </div>
  )
}

export default HowToDownloadYourResumeAsAPdf;

