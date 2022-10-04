import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToChangeYourProfileUrl = () => {

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
        title="How to change the URL of your profile"
        image='/images/blog/how-to-change-your-profile-url/how-to-change-your-profile-url.jpg'
        imageAlt="A short guide on how to update the URL of your Vitaely.me profile."
        readingDuration="2"
        hideFooter
        description="A short guide on how to update the URL of your Vitaely.me profile."
        url="how-to-change-your-profile-url"
      >
        <div className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#the-standard-format">The standard format of the URL</a></p></li>
          <li><p className="large mb-2"><a href="#why-change-it">Why would you want to change it?</a></p></li>
          <li><p className="large mb-2"><a href="#how-do-i-change-my-profile-url">How do I change my profile URL?</a></p></li>
          </ul>
        </div>
        <div id="the-standard-format" className="py-4 background-light">
          <h3>The standard format of the URL</h3>
          <p className="large">When you create your Vitaely profile, we will automatically create a URL for your profile. As an example, this will be something like: <i>vitaely.me/profile/4K6y8GFtKAbn6r34EtRM2bnQQpq2</i>.</p>
          <p className="large">To allow anyone to see your profile, simply share your profile URL. You can even use your profile on a job application that asks for a link to your website.</p>
          <p className="large">The standard profile URL is fine for sharing your profile and allowing people to view it, but it can be better.</p>
        </div>
        <div id="why-change-it" className="py-4 background-light">
          <h3>Why would you want to change your profile URL?</h3>

          <p className="large">To make your profile feel more your own, you can now create a custom URL on the first-level directory of vitaely.me.</p>
          <p className="large">As an example, this could be something like: <i>vitaely.me/aaronbutler</i>.</p>
          <p className="large">But why would you want to do this?</p>
          <ul>
          <li><p className="large mb-2">Adds a personal touch to your profile</p></li>
          <li><p className="large mb-2">Easier to share as the URL can be shorter</p></li>
          <li><p className="large mb-2">Makes it easier for people to find you on search engines</p></li>
          <li><p className="large mb-2">Looks cooler</p></li>
          </ul>
        </div>
        <div id="how-do-i-change-my-profile-url" className="py-4 background-light">
          <h3>How do I change my profile URL?</h3>
          <p className="large mb-5">There are two ways to edit the URL of your profile:</p>
          <h4>1. When setting up your account</h4>
          <p className="large">After creating the username and password for your account, you will be given the option to choose what type of URL you would like for your profile.</p>
          {/* <p className="large">You can choose between <b>Standard</b> where your URL will include a random string in the <i>/profile</i> directory (e.g. <i>vitaely.me/profile/4K6y8GFtKAbn6r34EtRM2bnQQpq2</i>) and <b>Personalised</b> where you can choose a handle of your choosing in the vitaely.me base directory (e.g. <i>vitaely.me/aaronbutler</i>).</p> */}
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Manage your Vitaely.me plan" src='../../images/blog/how-to-change-your-profile-url/choose-your-profile-handle-onboarding.jpg'></img>
          </div>
          <h4>2. In your account settings</h4>
          <p className="large">After you have set up your account and created your profile, you can edit the URL of your profile at any time from the <a href="/settings">Settings</a> area of your account.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Manage your Vitaely.me plan" src='../../images/blog/how-to-change-your-profile-url/choose-your-profile-handle-settings.jpg'></img>
          </div>
          <div className="bg-primary-200 radius-3 p-4 mt-4">
            <p className="large text-primary-high mb-0">Premium feature</p>
            {/* <div className="tag primary medium">Premium feature</div> */}
            <p className="mb-0">To change the URL of your profile, you will need to upgrade to the Premium plan.</p>
          </div>
        </div>
        <div id="how-to-upgrade" className="py-4 background-light">
          <h3>How to upgrade your plan</h3>
          <p className="large">To upgrade your plan, log into Vitaely and go to the settings page of your Vitaely.me account.</p>
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

export default HowToChangeYourProfileUrl;

