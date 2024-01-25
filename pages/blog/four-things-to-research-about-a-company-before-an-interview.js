import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const HowToExplainLeavingJobAfterShortAmountOfTime = () => {

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
        title="Four things to research about a company before an interview"
        image='/images/blog/four-things-to-research-about-a-company-before-an-interview/four-things-to-research-about-a-company-before-an-interview.jpg'
        imageAlt="Four things to research about a company before an interview"
        readingDuration="2"
        hideFooter
        description="Thinking of leaving your job? You’re not the only one. According to the U.S. Bureau of Labor Statistics; 4.4 million workers quit their jobs in September 2021 alone."
        url="four-things-to-research-about-a-company-before-an-interview"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#why-research">Why should I research the company?</a></p></li>
          <li><p className="large mb-2"><a href="#products-and-services">Their products and services</a></p></li>
          <li><p className="large mb-2"><a href="#why-were-they-founded">Why were they founded?</a></p></li>
          <li><p className="large mb-2"><a href="#when-were-they-founded">When were they founded?</a></p></li>
          <li><p className="large mb-2"><a href="#growth-and-trajectory">Their growth and trajectory</a></p></li>
          </ul>
        </div>
        <div className="py-4 background-light">
          <p className="large">When it comes to interviewing for a role, it pays to be prepared. We’ve already talked about what to do if you have to <a href="https://www.vitaely.me/blog/three-things-for-presenting-in-an-interview">deliver a presentation in an interview</a>, now let’s turn our attention to the researching the company itself.</p>
        </div>
        <div id="why-research" className="py-4 background-light">
          <h3>Why should I research the company?</h3>
          <p className="large">There are two main reasons to research the company:</p>
          <p className="large">The first is perhaps the most obvious and that is in order to come across as informed, interested and well-prepared in your interview.</p>
          <p className="large">The second, perhaps less obvious, reason is that it allows you to determine if you would be a good fit at this company.</p>
          <p className="large">So what are the key things you should be researching about the company?</p>
        </div>
        <div id="products-and-services" className="py-4 background-light">
          <h3>Their products and services</h3>
          <p className="large">Understanding what the business does to make money is essential to understanding your role in within the company.</p>
          <p className="large">Make sure you understand what their best selling products and services are and who they are selling them to. Try to build a picture of whether they are selling to consumers or to other businesses, or even to governments.</p>
        </div>
        <div id="why-were-they-founded" className="py-4 background-light">
          <h3>Why were they founded?</h3>
          <p className="large">Finding out the origin story of a company will tell you a great deal about the company.</p>
          <p className="large">The DNA of the founding mission is embedded and can often be found, to some extent, in a company decades after its inception.</p>
          <p className="large">Try to discover who founded the company in the first place? Were they faced by a problem that motivated them to start the company? Did they have a vision in mind?</p>
          <p className="large">This all helps to explain what impact they want to have on the world, why the company behaves the way they do, and the direction that the company is heading.</p>
          <p className="large">A great way to do this is to search for interviews with a founder where they talk about why the company was started, or you can check the company’s website for their mission state and vision for the future.</p>
        </div>
        <div id="when-were-they-founded" className="py-4 background-light">
          <h3>When were they founded?</h3>
          <p className="large">Knowing when a company was founded can give you an idea of what stage the company is at.</p>
          <p className="large">You are likely to have a very different experience depending on the maturity of the business. Working at a blue-chip Fortune 500 company is likely to be very different to a plucky startup in the genesis of their existence.</p>
        </div>
        <div id="growth-and-trajectory" className="py-4 background-light">
          <h3>Their growth and trajectory</h3>
          <p className="large">Alongside understanding when they were founded, looking into the company’s growth will give you an idea of where your role fits into the bigger picture, how the role may adapt over time, and give you an idea of potential future upside in terms of salary growth, progression and equity.</p>
          <p className="large">The key metrics to look for will vary from company to company, but here are some of the key ones to consider:</p>
          <ul>
          <li><p className="large mb-2">Headcount</p></li>
          <li><p className="large mb-2">Revenue</p></li>
          <li><p className="large mb-2">Profits</p></li>
          <li><p className="large mb-2">Customers</p></li>
          <li><p className="large mb-2">Locations</p></li>
          </ul>
        </div>
        <div className="py-5 background-light">
          <div className="d-flex flex-column align-items-center container text-center">
            {screenWidth > 767 ?
              <h1 className="hero-title mx-auto mb-4 text-dark-high">Create your online resume in 2 minutes</h1>
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

export default HowToExplainLeavingJobAfterShortAmountOfTime;

