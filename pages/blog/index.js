import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';
import Header from '../../components/header/Header';
import PostCard from '../../components/blog/PostCard';
import Head from 'next/head';
import Footer from '../../components/Footer';

const Blog = () => {

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
      <Head>
      <title>Blog | Vitaely.me</title>
        <meta name="description" content="The latest news and tips on building a professional online presence" />
        <meta property="og:title" content="Blog | Vitaely.me" />
        <meta property="og:description" content="The latest news and tips on building a professional online presence" />
        <meta property="og:url" content="https://www.vitaely.me/blog/" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="container py-5 mb-5">
        <h2 className="my-5">Blog</h2>
        <div className="d-flex flex-column" style={{gap: '24px'}}>
          <PostCard 
            image="/images/blog/how-to-explain-leaving-a-job-after-a-short-amount-of-time/how-to-explain-leaving-a-job-after-a-short-amount-of-time.jpg"
            title="How to explain leaving a job after a short amount of time"
            duration="2"
            bodyPreview="Thinking of leaving your job? You’re not the only one. According to the U.S. Bureau of Labor Statistics; 4.4 million workers..."
            postUrl="/blog/how-to-explain-leaving-a-job-after-a-short-amount-of-time"
            screenWidth={screenWidth}
          />
          <PostCard 
            image="/images/blog/applying-for-a-role-without-years-of-experience/applying-for-a-role-without-years-of-experience.jpg"
            title="Why you should apply for a role even if you don’t meet the years of experience"
            duration="2"
            bodyPreview="Have you ever found yourself doubting whether you should apply for a job because you don’t meet the years of experience listed..."
            postUrl="/blog/applying-for-a-role-without-years-of-experience"
            screenWidth={screenWidth}
          />
          <PostCard 
            image="/images/blog/red-flags-in-job-descriptions/red-flags-in-job-descriptions.jpg"
            title="Four red flags to look out for in job descriptions"
            duration="2"
            bodyPreview="You probably know about some of the typical red flags in job descriptions; things like describing themselves as a family or not..."
            postUrl="/blog/red-flags-in-job-descriptions"
            screenWidth={screenWidth}
          />
          <PostCard 
            image="/images/blog/three-things-for-presenting-in-an-interview/three-things-for-presenting-in-an-interview.jpg"
            title="Three things you should be doing if you ever have to present in an interview"
            duration="2"
            bodyPreview="You might’ve heard this as the oft-misquoted advice: “Tell them what you are going to tell them, tell them, then tell them what..."
            postUrl="/blog/three-things-for-presenting-in-an-interview"
            screenWidth={screenWidth}
          />
          <PostCard 
            image="/images/blog/how-to-get-your-resume-past-applicant-tracking-systems/how-to-get-your-resume-past-applicant-tracking-systems.jpg"
            title="How to get your resume past Applicant Tracking Systems"
            duration="8"
            bodyPreview="Before your application ever gets seen by a recruiter or hiring manager, screening software checks whether or not you would be..."
            postUrl="/blog/how-to-get-your-resume-past-applicant-tracking-systems"
            screenWidth={screenWidth}
          />
          <PostCard 
            image="/images/blog/cv-resume-builder-alternatives/cover-photo.jpg"
            title="Comparing online resume and CV builders in 2022"
            duration="8"
            bodyPreview="Creating a beautiful resume that catches the eye of prospective employers and helps you to land your dream job is easier..."
            postUrl="/blog/cv-resume-builder-alternatives"
            screenWidth={screenWidth}
          />
          <div className="d-flex flex-column flex-lg-row" style={{gap: '24px'}}>
            <PostCard 
              // image="../../images/profile-preview.png"
              title="How to create an online CV in 2 minutes"
              duration="2"
              bodyPreview="Much like an offline CV; an online CV is a chance to share a bit about yourself, your professional experience and you..."
              postUrl="/blog/how-to-create-an-online-cv"
              screenWidth={screenWidth}
            />
            <PostCard 
              // image="../../images/profile-preview.png"
              title="How to keep your profile up to date"
              duration="2"
              bodyPreview="Keeping your online presence up to date is crucial if you are to make the most of your experience and education when..."
              postUrl="/blog/how-to-keep-your-profile-up-to-date"
              screenWidth={screenWidth}
            />
          </div>
          <PostCard 
            image="../../images/profile-preview.png"
            title="How to create a personal landing page"
            duration="2"
            bodyPreview="A landing page is typically the first page that a user may come to when looking for information about a particular product..."
            postUrl="/blog/how-to-create-a-personal-landing-page"
            screenWidth={screenWidth}
          />
        </div>
      </div>
      <br></br>
      <br></br>
      <Footer />
    </div>
  )
}

export default Blog;

