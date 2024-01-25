import Link from 'next/link';
import Image from 'next/image'
import styles from './index.module.scss';
import LandingPage from '../components/landingPage/LandingPage';

const OnlineResumeBuilder = () => {

  return (
    <div>
      <LandingPage
        title="Build your online resume in 2 minutes"
        subtitle="Stand out from the crowd and land your dream job with the Vitaely online resume builder."
        url="online-resume-builder"
        stepsTitle="Three simple steps to build an online resume"
        sectionOneTitle="Sync your data from LinkedIn"
        sectionOneSubtitle="There's no need to fill out all of your experience, education and other information all over again."
        sectionOneImg="sync-from-linkedin.png"
        sectionTwoTitle="Choose what information to show"
        sectionTwoSubtitle="Choose the information from your Linkedin profile that you want to display on your online resume."
        sectionTwoImg="custom-content.png"
        whyVitaelyOne="Get yourself noticed with a unique online resume."
      />
    </div>
  )
}

export default OnlineResumeBuilder;

