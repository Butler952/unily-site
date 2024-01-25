import Link from 'next/link';
import Image from 'next/image'
import styles from './index.module.scss';
import LandingPage from '../components/landingPage/LandingPage';

const OnlineCvBuilder = () => {

  return (
    <div>
      <LandingPage
        title="Build your online CV in 2 minutes"
        subtitle="Stand out from the crowd and land your dream job with the Vitaely online CV builder."
        url="online-cv-builder"
        stepsTitle="Three simple steps to build an online CV"
        sectionOneTitle="Sync your data from LinkedIn"
        sectionOneSubtitle="There's no need to fill out all of your experience, education and other information all over again."
        sectionOneImg="sync-from-linkedin.png"
        sectionTwoTitle="Choose what information to show"
        sectionTwoSubtitle="Choose the information from your Linkedin profile that you want to display on your online CV."
        sectionTwoImg="custom-content.png"
        whyVitaelyOne="Get yourself noticed with a unique online CV."
      />
    </div>
  )
}

export default OnlineCvBuilder;

