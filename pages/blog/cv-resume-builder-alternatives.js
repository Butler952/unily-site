import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';

const CvResumeBuilderAlternatives = () => {

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
        title="Comparing online resume and CV builders in 2022"
        image='/images/blog/cv-resume-builder-alternatives/cover-photo.jpg'
        imageAlt="Comparing online resume and CV builders in 2022"
        readingDuration="8"
        hideFooter
        description="Creating a beautiful resume that catches the eye of prospective employers and helps you to land your dream job is easier than ever. Here is a comparison of sever online resume builder services in 2022."
        url="how-to-create-an-online-cv"
      >
        <div id="content" className="py-4 background-light">
          <h3>Contents</h3>
          <ul>
          <li><p className="large mb-2"><a href="#zety">Zety</a></p></li>
          <li><p className="large mb-2"><a href="#cvlibrary">CV Library</a></p></li>
          <li><p className="large mb-2"><a href="#vitaely">Vitaely</a></p></li>
          <li><p className="large mb-2"><a href="#resumeio">Resume.io</a></p></li>
          <li><p className="large mb-2"><a href="#myperfectcv">My Perfect CV</a></p></li>
          <li><p className="large mb-2"><a href="#reed">Reed.co.uk</a></p></li>
          </ul>
        </div>
        {/* <div className="py-4 background-light">
          <p className="large">My goal for a long while now has been to build a digital product business myself. A Product Designer by trade, I began learning how to code so that I could bring my ideas to life. Through a combination of Youtube (props to The Net Ninja and Fireship), StackOverflow and documentation; I have managed to get to a level where I can build a web app that people might find useful.</p>
        </div> */}
        <div id="zety" className="py-4 background-light">
          <a href="https://zety.com/" target="_blank">
            <h3>Zety</h3>
          </a>
          <p className="large">Zety allows you to create a professional resume from a choice of more than 18 carefully curated templates.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Zety Resume Maker" src='/images/blog/cv-resume-builder-alternatives/zety-landing-page.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">There is a guided approach to helping you on your journey to creating a resume. Predefined sections help you to add the information that potential employers need to know including a professional summary, skills, work history, and education.</p>
          <p className="large">There are a range of optional additional sections including accomplishments, affiliations, software, languages, certifications, interests, and even the ability to add your own custom sections.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Zety Resume Templates" src='/images/blog/cv-resume-builder-alternatives/zety-resume-templates.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">If you don't want to enter all your information from scratch you can choose to upload an existing resume and Zety will do all the hard work for you in converting the information to one of your templates. You may need to do a little tweaking to get the information displayed in the way you would like, but in general it is much faster than starting with a blank canvas.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Start from scratch or upload" src='/images/blog/cv-resume-builder-alternatives/zety-how-do-you-want-to-start.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">Having a hard time filling out the job description for one of your roles? Zety provides intelligent expert recommendations for the types of information to include to get you started.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Expert recommendations for your resume" src='/images/blog/cv-resume-builder-alternatives/zety-job-description-recommendations.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">Resumes are often seen first not by a human, but by screening software. If your information isn't what they're looking for or, worse, isn't legible to screening software, then your application is dead in the water before it even meets a human eye. </p>
          <p className="large">Resumes created with Zety benefit from Smart Apply which optimises your resume so you have a better chance of ranking higher than other applicants in screening software.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Optimize your resume" src='/images/blog/cv-resume-builder-alternatives/zety-optimized-template.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">Once your resume is optimised and ready to go you have the option of downloading your resume in multiple formats including Word, PDF, and TXT. To download your resume you will need to upgrade to a paid plan.</p>
          <p className="large">The best value deal available is the 14 days access plan for £2.70 which includes unlimited printing and downloading, as well as unlimited additional resumes and cover letter variations. If you're not satisfied with your experience, Zety also promises a money back guarantee. Be aware that your subscription will auto-renew at £16.70, billed every 4 weeks but you can cancel at any time for free.</p>
        </div>
        <div id="cvlibrary" className="py-4 background-light">
          <a href="https://www.cv-library.co.uk/free-cv-builder" target="_blank">
            <h3>CV Library</h3>
          </a>
          <p className="large">CV Library provides a great free tool for creating a simple CV in minutes.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="CV Library CV builder" src='/images/blog/cv-resume-builder-alternatives/cvlibrary-landing-page.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">Their CV builder takes a very simple approach, offering only one clean and well-thought out template in which to present yourself. This is far more limited than other platforms but it will do the job and covers the key information that most employers are looking for.</p>
          <p className="large">CV Library guides you through a step-by-step process to create your CV. The sections that are covered include Professional Summary, Work History, Education, Training & Certifications, Skills, Hobbies & Interests, and References.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Entering your work history with CV Library" src='/images/blog/cv-resume-builder-alternatives/cvlibrary-work-history.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">Unlike some other tools, creating and downloading your CV is completely free. Although you are limited by the fact that you can only export your CV as a PDF.</p>
          <p className="large">A huge advantage of creating your CV through CV Library's free CV builder tool is that you will automatically be listed on CV Library’s network of live jobs, employers and recruiters who are looking for candidates to fill their roles.</p>
          <p className="large">With no extra effort, you're already helping your next potential employer to find you—it also makes it super simple to apply to jobs directly on CVLibrary. If you want to be visible to the network, you can turn this off in the settings after you complete your CV.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="CV Library resume preview" src='/images/blog/cv-resume-builder-alternatives/cvlibrary-cv-preview.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">If you would like to boost your chances of landing your dream job, you can upgrade to a Premium plan to ensure that your profile appears higher than standard candidate profiles in search results. Premium costs £9.99 per month and CV Library claim that you can get seen by up to five times as many prospective employers and recruiters as a standard profile.</p>
          <p className="large">Once your CV is complete, you will also be eligible for a free CV review from an industry expert at TopCV. Simply request a review from the Profile area of your CV Library account and you should receive your review in around a day.</p>
          <p className="large">Your review will include constructive advice on visual presentation, language, file format, and test response from an <a href="https://www.bamboohr.com/hr-glossary/applicant-tracking-system-ats/">Applicant Tracking System (ATS)</a>. The ATS review shows how scanning software used by recruiters and large companies views and understands your CV, and it’s very useful for checking how your information comes across.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="CV Library resume preview" src='/images/blog/cv-resume-builder-alternatives/cvlibrary-topcv-review.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">At the end of the review, you will receive a number of key recommendations and next steps for improving your CV and giving yourself the best chance at landing that next role.</p>
        </div>
        <div id="vitaely" className="py-4 background-light">
          <Link href="/">
            <a><h3>Vitaely</h3></a>
          </Link>
          <p className="large">Vitaely.me offers a super simple way to turn your LinkedIn profile into a personal online CV in just 2 minutes:</p>
          <p className="large">
            <ol>
              <li>Grab the URL of your Linkedin profile</li>
              <li>Sync your data</li>
              <li>You're done! Your online CV is ready</li>
            </ol>
          </p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Vitaely online resume builder" src='/images/blog/cv-resume-builder-alternatives/vitaely-landing-page.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">With Vitaely, there's no need to enter all of your work history and education again. To create your profile, all you have to do is paste the URL for your Linkedin profile and Vitaely will instantly generate an online resume.</p>
          {/* <div className={`${styles.featureCard} my-5`}>
            <video controls alt="Sycning your data from LinkedIn to Vitaely.me" src='/images/blog/how-to-create-an-online-cv/vitaely-me-sync-with-linked.mp4' />
          </div> */}
          <p className="large">The clean and modern template helps you to stand out from the crowd and land your dream job. You can share your profile by simply grabbing the public URL for your profile and sharing the link wherever you need to.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Vitaely online resume" src='/images/blog/cv-resume-builder-alternatives/vitaely-profile.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">It's completely free to create and share your profile. If you want to resync your profile with Linkedin then you will need to upgrade to the premium plan. Although you do also get the ability to add company and organisation logos to your work experience and education sections. Premium costs $2.99 per month via secure Stripe Checkout and you can cancel anytime for free.</p>
          <p className="large"><Link href="/users/register">Click here</Link> to create your online resume in two minutes with Vitaely.</p>
        </div>
        <div id="resumeio" className="py-4 background-light">
          <a href="https://resume.io/" target="_blank">
            <h3>Resume.io</h3>
          </a>
          <p className="large">Resume.io have built what they describe as the ultimate resume builder.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Resume.io resume builder" src='/images/blog/cv-resume-builder-alternatives/resumeio-landing-page.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">Selecting a template is the first step on the journey onwards building your resume. Resume.io offers a wide range of carefully crafted templates so you can be sure to find one that feels right for your professional and personal tastes.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Resume.io resume templates" src='/images/blog/cv-resume-builder-alternatives/resumeio-select-template.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">When it comes to adding your personal content to your resume, Resume.io provides a handy feature where you can pull your data directly from your Linkedin profile. To do this, simply paste the URL of your Linkedin profile and Resume.io will do the rest. Assuming your Linkedin profile is up-to-date this saves a ton of time that you would normally spend filling out your job history and other professional information.</p>
          <p className="large">Whether you choose to pull your information from Linkedin or not, you will be able to edit, update and manage your information in the handy resume builder tool. This breaks down the resume into sections and makes it obvious what information you should be including in your profile. If you’re struggling with a spot of writer's block, they provide handy suggestions for pre-written phrases you can use to get started.</p>
          <p className="large">Sections on the resume include Personal details, Professional summary, Employment history, Education. Website and social links, Volunteering, Skills and a range of additional sections including the ability to add your own custom section.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Building your resume with Resume.io" src='/images/blog/cv-resume-builder-alternatives/resumeio-build-resume.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">The exporting options include PDF, DOCX, or TXT depending on the template you select. However you will need to upgrade your plan to download your resume. The cheapest way to do this is to upgrade to the 7-day trial for £2.95, although do be aware that if you do not cancel then the plan recurs at £19.95 per month. There is an alternative option; you can share a link to your resume online which is hosted by Resume.io.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Building your resume with Resume.io" src='/images/blog/cv-resume-builder-alternatives/resumeio-online-resume.jpeg' layout="fill" objectFit="cover" />
          </div>
        </div>
        <div id="myperfectcv" className="py-4 background-light">
          <a href="https://www.myperfectcv.co.uk/" target="_blank">
            <h3>My Perfect CV</h3>
          </a>
          <p className="large">MyPerfectCV offers a relatively simple way to build a well-templated CV with expert tips to guide you along the way.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="My Perfect CV website" src='/images/blog/cv-resume-builder-alternatives/myperfectcv-landing-page.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">You can build your CV in three simple steps:</p>
          <p className="large">
            <ol>
              <li>Select a CV template from the library of professional designs</li>
              <li>Create your CV with expert written bullet point suggestions</li>
              <li>Download and share your CV</li>
            </ol>
          </p>
          <p className="large">MyPerfectCV offers a range of templates to suit any industry or preference. One neat feature here is that you can play around with the colour theme of the template and even the font, spacing and margin, although you will have to wait until later on to manage some of the finer details.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="My Perfect CV template" src='/images/blog/cv-resume-builder-alternatives/myperfectcv-template.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">When it comes to populating your CV, you'll be met with a step-by-step walkthrough taking you through personal information, work history, education, skills, and summary. You are also able to add more later on including custom sections.</p>
          <p className="large">The process of adding information like work history and education is a little more annoying than other platforms as you need to jump between screens to edit information, but overall it is still very effective for the job.</p>
          <p className="large">At each section you will also be met with tips on how to communicate yourself most effectively as well as pre-written examples of sentences to include.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Expert tips to cmplete your CV" src='/images/blog/cv-resume-builder-alternatives/myperfectcv-skills-tip.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">Once you're happy with your CV and you are ready to download it, you will be required to upgrade your account before doing so. The cheapest option is the 14 days access plan for £2.95 which allows you to create, print and download unlimited CVs. This comes in at £2.95 although it does renew at £16.95 per month after the initial 14-day period.</p>
        </div>
        <div id="reed" className="py-4 background-light">
          <a href="https://www.reed.co.uk/cvbuilder" target="_blank">
            <h3>Reed.co.uk</h3>
          </a>
          <p className="large">Reed offers a nice and easy service to build a basic CV, the whole process takes just a few steps.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Reed.co.uk's free online CV builder" src='/images/blog/cv-resume-builder-alternatives/reed-landing-page.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">One of the benefits of creating your CV with Reed is that you can easily make yourself visible to their network of job postings and recruiters; so it is in Reed’s interest to get your details into the system as quickly as possible.</p>
          <p className="large">For this reason, they offer a few options of getting your CV into the system including uploading an existing CV, downloading their DOCX template and filling it out offline, or using the online CV builder (which is what we’re focussing on).</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Reed.co.uk gives you a few options on how to get your CV into the system" src='/images/blog/cv-resume-builder-alternatives/reed-create-options.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">The CV builder itself is just 4 steps; your personal details, work experience, qualifications and a personal statement. The forms themselves are focussed on getting your information onto your CV with the least effort. Once you complete the basic steps, you also have the option to add some additional information later on such as skills and languages.</p>
          <div className={`${styles.heroImageWrapper} my-5`}>
            <Image alt="Adding work experience to your Reed.co.uk CV" src='/images/blog/cv-resume-builder-alternatives/reed-work-experience.jpeg' layout="fill" objectFit="cover" />
          </div>
          <p className="large">Similar to CVLibrary, once your CV is ready, you will also have the ability to request a free CV review from the experts at TopCV. Your review should be ready after about a day and includes advice on structure, style and content. You can learn more on the <a href="https://www.topcv.co.uk/" target="_blank">TopCV website</a>.</p>
          <p className="large">The best part is that, unlike some other services, it is completely free to build and export your CV. The downside is that the template is very basic, you can only export in DOCX format and there are very few options to customise it within the platform.</p>
        </div>
        <div className="py-5 background-light">
            <div className="d-flex flex-column align-items-center container text-center">
              {screenWidth > 767 ?
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your online resume in 2 minutes with Vitaely</h2>
                :
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Create your online resume in 2 minutes with Vitaely</h2>
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

export default CvResumeBuilderAlternatives;

