import Link from 'next/link';
import Image from 'next/image'
import styles from './index.module.scss';
import LandingPage from '../components/landingPage/LandingPage';

const PdfResumeBuilder = () => {

  return (
    <div>
      <LandingPage
        title="Build your PDF resume in 2 minutes"
        subtitle="Use your LinkedIn profile to create a beautiful resume and export it as a PDF in two minutes."
        url="pdf-resume-builder"
        heroImage="/images/landing-page/pdf-resume-builder/pdf-resume-builder.png"
        stepsTitle="Create your PDF resume in 2 minutes"
        stepThree="Download as a PDF"
        whyExpertPageOne="Get yourself noticed with a unique online resume."
      />
    </div>
  )
}

export default PdfResumeBuilder;

