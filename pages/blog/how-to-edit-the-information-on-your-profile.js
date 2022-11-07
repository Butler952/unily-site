import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToEditYourProfile = () => {

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
        title="How to edit the information on your profile"
        image='/images/blog/how-to-edit-the-information-on-your-profile/how-to-edit-the-information-on-your-profile.jpg'
        imageAlt="A short guide on how to edit your professional information on your Vitaely.me profile."
        readingDuration="2"
        hideFooter
        description="A short guide on how to edit your professional information on your Vitaely.me profile."
        url="how-to-edit-the-information-on-your-profile"
      >
        <div id="why-add-links" className="py-4 background-light">
          <p className="large">To edit the content of your profile, start by tapping the menu button in the top right (you will need to be logged in and have your profile set up in order to find this).</p>
          <p className="large">Next, click on the “Edit profile” button in the menu dropdown.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Edit profile option in the menu dropdown" src='../../images/blog/how-to-add-links-to-your-profile/menu-edit-profile.jpg'></img>
          </div>
          <p className="large">This will open a modal view which will allow you to edit all aspects of your profile. Here the are the sections that you can edit:</p>
          <ul>
          <li><p className="large mb-2">Basic information</p></li>
          <li><p className="large mb-2">Links</p></li>
          <li><p className="large mb-2">About</p></li>
          <li><p className="large mb-2">Side projects</p></li>
          <li><p className="large mb-2">Experience</p></li>
          <li><p className="large mb-2">Projects</p></li>
          <li><p className="large mb-2">Education</p></li>
          <li><p className="large mb-2">Volunteering</p></li>
          </ul>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Edit profile option in the menu dropdown" src='../../images/blog/how-to-edit-the-information-on-your-profile/edit-profile-options.jpeg'></img>
          </div>
          <p className="large">Some sections—such as side projects, experience, education and volunteering—allow you to upload a logo. In order to display logos on your profile, you will need to be on the premium tier.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Edit profile option in the menu dropdown" src='../../images/blog/how-to-edit-the-information-on-your-profile/edit-experience-logo.jpeg'></img>
          </div>
          <p className="large">To upgrade your plan, head to the <a href="/settings">settings</a> page of your Vitaely.me account.</p>
          <p className="large">Head to the “Plan” section and click “Upgrade” on the Premium plan. Complete the payment in the secure Stripe Checkout portal and you're ready to resync your profile.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Manage your Vitaely.me plan" src='../../images/blog/how-to-keep-your-profile-up-to-date/plan-section.jpeg'></img>
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

export default HowToEditYourProfile;

