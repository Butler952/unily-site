import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToShowYourVitaelyWebsiteOnACustomDomain = () => {

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
        title="How to show your Vitaely website on your own custom domain"
        image='/images/blog/how-to-show-your-vitaely-website-on-a-custom-domain/how-to-show-your-vitaely-website-on-a-custom-domain-cover.jpg'
        imageAlt="How to connect a custom domain so you can show off your Vitaely website on it's own domain"
        readingDuration="2"
        hideFooter
        description="A short guide on to connect a custom domain so you can show off your Vitaely website on it's own domain."
        url="how-to-show-your-vitaely-website-on-a-custom-domain"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#why-connect-my-domain">Why would I want to connect my own domain?</a></p></li>
          <li><p className="large mb-2"><a href="#how-to-connect-my-domain">How do I connect my custom domain?</a></p></li>
          </ul>
        </div>
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div className="py-4 background-light">
          <p className="large">You can now connect your own domain to give your Vitaely website a more personal home, e.g. "mydomain.com".</p>
          <p className="large">If you'd like to skip the how-to guide, <Link href="/settings/domain">head here to connect your custom domain</Link>.</p>
        </div>
        <div id="why-connect-my-domain" className="py-4 background-light">
          <h3>Why would I want to connect my own domain?</h3>
          <p className="large">When you create your Vitaely website, as standard your page will be displayed on the Vitaely.me domain, e.g: "vitaely.me/aaronbutler".</p>
          <p className="large">This is fine for sharing your website and allowing people to view it, but it can be better.</p>
          <p className="large">Show you are a true professional by putting your website on your own custom domain. This can help to build more trust with potential clients and employers.</p>
          <p className="large">Search engines tend to prefer results with domain names that include the search terms, which makes it easier for people to find you.</p>
        </div>
        <div id="how-to-connect-my-domain" className="py-4 background-light">
          <h3>How do I connect my custom domain?</h3>
          <p className="large">You can start connecting your own domain at any time from the <Link href="/settings/domain">Domain Settings</Link> area of your account.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Access the domain settings page of your profile" src='/images/blog/how-to-show-your-vitaely-website-on-a-custom-domain/connect-your-own-domain-domain-settings.jpeg'></img>
          </div>
          <p className="large">You will be asked to enter the custom domain that you want your Vitaely website to appear.</p>
          <p className="large">This needs to be a domain where you are able to edit the DNS settings as we will need to add a few records to ensure your website shows correctly.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Enter your custom domain" src='/images/blog/how-to-show-your-vitaely-website-on-a-custom-domain/connect-your-own-domain-add-domain.jpeg'></img>
          </div>
          <p className="large">When you add enter a custom domain, instructions will appear as to the DNS changes you need to make to get your Vitaely website to appear on your custom domain.</p>
          <p className="large">Note that the instructions will be specific to your site, so you can't just copy the DNS record in the image below.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Add DNS records" src='/images/blog/how-to-show-your-vitaely-website-on-a-custom-domain/connect-your-own-domain-dns-settings.jpeg'></img>
          </div>
          <p className="large">After a few minutes your website will be live on your custom domain.</p>
          <p className="large">You will need to be on a Premium plan in order to add a custom domain.</p>
          <div className={`${styles.featureCard} my-5`}>
            <img alt="Your website is now live" src='/images/blog/how-to-show-your-vitaely-website-on-a-custom-domain/connect-your-own-domain-domain-added.jpeg'></img>
          </div>
        </div>
        <div className="py-5 background-light">
            <div className="d-flex flex-column align-items-center container text-center" style={{maxWidth: '640px'}}>
              {screenWidth > 767 ?
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Connect your custom domain</h2>
                :
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Connect your custom domain</h2>
              }
              <p className="mx-auto mb-5 text-dark-med large">Become a true professional and show off your website on it's own custom domain.</p>
              <Link href="/settings/domain" className="btn primary high large">Connect your domain</Link>
            </div>
          </div>
      </Post>
    </div>
  )
}

export default HowToShowYourVitaelyWebsiteOnACustomDomain;

