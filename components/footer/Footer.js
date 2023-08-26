import Link from 'next/link';
import { Container } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './Footer.module.scss';

const Footer = ({dark}) => {

  return (
    <div className={`py-5 ${dark && styles.darkBackground}`}>
      {/* <div className={`${dark && 'bg-light-100'} py-5`} style={`${dark && {background: '#242837'}}`}> */}
      <Container className="py-5">
        <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between mb-5" style={{gap: '48px'}}>
          <Link href="/" className="w-lg-100">
            <svg height="32" viewBox="0 0 580 112" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                className={`${dark ? 'fill-light-600' : 'fill-dark-600'}`}
                fillRule="evenodd" 
                clipRule="evenodd" 
                d={ICONS.LOGO_FULL} 
              />
            </svg>
          </Link>
          <div className="d-flex flex-column flex-md-row text-center" style={{gap: '48px', whiteSpace: 'nowrap'}}>
            {/* <div className="d-flex flex-column text-center text-md-right" style={{gap: '16px', whiteSpace: 'nowrap'}}>
              <Link href="/linkedin-to-resume"><a className="text-dark-high mb-0">Linkedin to resume</a></Link>
              <Link href="/pdf-resume-builder"><a className="text-dark-high mb-0">Linkedin to PDF</a></Link>
              <Link href="/online-cv-builder"><a className="text-dark-high mb-0">Online CV builder</a></Link>
              <Link href="/online-resume-builder"><a className="text-dark-high mb-0">Online resume builder</a></Link>
              <Link href="/templates"><a className="text-dark-high mb-0">Templates</a></Link>
              <Link href="/pricing"><a className="text-dark-high mb-0">Pricing</a></Link>
              <Link href="/blog"><a className="text-dark-high mb-0">Blog</a></Link>
            </div> */}
            <div className="d-flex flex-column text-center text-md-right" style={{gap: '16px', whiteSpace: 'nowrap'}}>
              <Link href="/legal/terms" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Terms & Conditions</Link>
              <Link href="/legal/privacy" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Privacy Policy</Link>
              <Link href="/legal/cookies" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Cookie Policy</Link>
              <a href="https://expertpage.io/sitemap.xml" target="_blank" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Sitemap</a>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between">
          <p className={`${dark ? 'text-light-dis' : 'text-dark-dis'} mb-0`}>© Copyright ExpertPage {new Date().getFullYear()}</p>
          {/* <p>Made by <a href="https://www.aaron-butler.co.uk">Aaron Butler</a> in London</p> */}
        </div>
      </Container>
    </div>
  )
}

export default Footer;