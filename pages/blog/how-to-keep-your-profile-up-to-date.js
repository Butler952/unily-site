import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToKeepYourProfileUpToDate = () => {

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
        title="How to keep your profile up to date"
        image='/images/profile-preview.png'
        imageAlt="A short guide on how to keep your Vitaely.me profile up to date."
        readingDuration="2"
        hideFooter
        description="A short guide on how to keep your Vitaely.me profile up to date."
        url="how-to-keep-your-profile-up-to-date"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#how-to-keep-your-profile-to-date">How to keep your profile up to date</a></p></li>
          <li><p className="large mb-2"><a href="#how-to-upgrade-your-plan">How to upgrade your plan</a></p></li>
          <li><p className="large mb-2"><a href="#what-else-do-i-get">What else to I get for upgrading my plan?</a></p></li>
          </ul>
        </div>
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div className="py-4 background-light">
          <p className="large">Keeping your online presence up to date is crucial if you are to make the most of your experience and education when you are discovered by the right audience.</p>
          <p className="large">It would be a shame if your latest achievements were not available for all to see. The best way to do this is to make sure your profile is up to date with your latest resume.</p>
        </div>
        <div id="how-to-keep-your-profile-to-date" className="py-4 background-light">
          <h3>How to keep your profile to date</h3>
          <p className="large">To keep your Vitaely.me profile up to date with your LinkedIn profile, you can use the Resync feature. When you trigger a resync, we update your profile with the latest information on your LinkedIn profile. </p>
          <p className="large">Make sure that your LinkedIn profile's <Link href="https://www.linkedin.com/public-profile/settings">public visibility settings</Link> include all the data that you want to sync into Vitaely.</p>
          <p className="large">To Resync your profile, you will need to be on the Premium plan.</p>
          <div className={`${styles.featureCard} mt-5`}>
            <img alt="Resync your data from your LinkedIn profile" src='../../images/blog/how-to-keep-your-profile-up-to-date/resync-data.jpeg'></img>
          </div>
        </div>
        <div id="how-to-upgrade-your-plan" className="py-4 background-light">
          <h3>How to upgrade your plan</h3>
          <p className="large">To upgrade your plan, log into Vitaely and go to the settings page of your Vitaely.me account.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Access the settings page of your profile" src='../../images/blog/how-to-keep-your-profile-up-to-date/settings-page.jpeg'></img>
          </div>
          <p className="large">Head to the “Plan” section and click “Upgrade” on the Premium plan. Complete the payment in the secure Stripe Checkout portal and you're ready to resync your profile.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Manage your Vitaely.me plan" src='../../images/blog/how-to-keep-your-profile-up-to-date/plan-section.jpeg'></img>
          </div>
        </div>
        <div id="what-else-do-i-get" className="py-4 background-light">
          <h3>What else so I get for upgrading my plan?</h3>
          <p className="large">On the Premium plan, you have access to unlimited re-syncing to you can ensure that you can always bring your profile up to date.</p>
          <p className="large">You will also be able to turn on the option to add company and organisation logos to the experience and education sections.</p>
          <p className="large">We’re working hard to bring you more Premium features soon.</p>
        </div>
        <div className="py-5 background-light">
            <div className="d-flex flex-column align-items-center container text-center">
              {screenWidth > 767 ?
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Keep your profile up to date</h2>
                :
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Keep your profile up to date</h2>
              }
              <p className="mx-auto mb-5 text-dark-med large">Upgrade to Premium to enjoy unlimited resyncs and more coming soon.</p>
              <Link href="/settings#plan">
                <a className="btn primary high large">Upgrade your plan</a>
              </Link>
            </div>
          </div>
      </Post>
    </div>
  )
}

export default HowToKeepYourProfileUpToDate;

