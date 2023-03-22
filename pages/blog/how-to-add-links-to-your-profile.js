import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToAddLinksToYourProfile = () => {

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
        title="How to add links to your profile"
        image='/images/blog/how-to-add-links-to-your-profile/how-to-add-links-to-your-profile.jpg'
        imageAlt="A short guide on how to add link to your expertpage.io profile."
        readingDuration="2"
        hideFooter
        description="A short guide on how to add link to your expertpage.io profile."
        url="how-to-add-links-to-your-profile"
      >
        <div className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#why-add-links">Why would you want to add links to your profile?</a></p></li>
          <li><p className="large mb-2"><a href="#common-links">What are some common links?</a></p></li>
          <li><p className="large mb-2"><a href="#how-to-add-links">How to add links to your profile</a></p></li>
          </ul>
        </div>
        <div id="why-add-links" className="py-4 background-light">
          <h3>Why would you want to add links to your profile?</h3>
          <p className="large">Your profile is a place to show yourself off online professionally. This of course includes your experience and education, but it doesn’t have to stop there.</p>
          <p className="large">You can now add links to other key places on the internet that you’d like others to know about.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Profile with links" src='../../images/blog/how-to-add-links-to-your-profile/profile-with-links.jpg'></img>
          </div>
        </div>
        <div id="common-links" className="py-4 background-light">
          <h3>What are some common links?</h3>
          <p className="large">You can add a link to anything you like from your profile, but here are some common examples of places like to link to:</p>
          <ul>
          <li><p className="large mb-2">Your own personal website</p></li>
          <li><p className="large mb-2">Social media accounts (e.g. Twitter, Instagram, TikTok)</p></li>
          <li><p className="large mb-2">Places that show off your work (Dribbble, GitHub)</p></li>
          </ul>
          <p className="large">But there’s no need to limit yourself to these options.</p>
        </div>
        <div id="how-to-add-links" className="py-4 background-light">
          <h3>How to add links to your profile</h3>
          <p className="large">To add links to your profile, start by tapping the menu button in the top right (you will need to be logged in and have your profile set up in order to find this)</p>
          <p className="large">Next, click on the “Edit profile” button in the menu dropdown.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Edit profile option in the menu dropdown" src='../../images/blog/how-to-add-links-to-your-profile/menu-edit-profile.jpg'></img>
          </div>
          <p className="large">This will open a view which will allow you to edit all aspects of your profile, including the ability to add, edit, and remove links.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Links section in the edit profile view" src='../../images/blog/how-to-add-links-to-your-profile/edit-profile-links.jpg'></img>
          </div>
          <p className="large">Tap on “Links” to start creating and editing links on your profile.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Viewing Links section in the edit profile view" src='../../images/blog/how-to-add-links-to-your-profile/edit-profile-links-2.jpg'></img>
          </div>
          <p className="large">Tap "Add link" to start creating a new link, or tap on an existing link to edit it.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Adding links" src='../../images/blog/how-to-add-links-to-your-profile/edit-profile-links-add.jpg'></img>
          </div>
          <p className="large">Once you are done hit "Add" or "Save" and the changes will be reflected on your profile. For now, you may need to refresh your profile to see the changes take place but we’ll fix this soon.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Editing links" src='../../images/blog/how-to-add-links-to-your-profile/edit-profile-links-edit.jpg'></img>
          </div>
        </div>
        <div className="py-5 background-light">
          <div className="d-flex flex-column align-items-center container text-center">
            {screenWidth > 767 ?
              <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{maxWidth: '560px'}}>Create your online resume in 2 minutes</h2>
              :
              <h2 className="hero-title mx-auto mb-4 text-dark-high" style={{maxWidth: '560px'}}>Create your online resume in 2 minutes</h2>
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

export default HowToAddLinksToYourProfile;

