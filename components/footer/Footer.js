import Link from 'next/link';
import { Container } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './Footer.module.scss';

const Footer = ({dark}) => {

  return (
    <div className={`py-5`}>
      {/* <div className={`${dark && 'bg-light-100'} py-5`} style={`${dark && {background: '#242837'}}`}> */}
      <Container className="py-5">
        <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between mb-5" style={{gap: '48px'}}>
          <Link href="/" className="w-lg-100">
            <svg height="48" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                className={`${dark ? 'fill-light-600' : 'fill-dark-600'}`}
                fillRule="evenodd" 
                clipRule="evenodd" 
                d={ICONS.LOGO_ICON} 
              />
            </svg>
          </Link>
          <div className="d-flex flex-column flex-md-row text-center" style={{gap: '48px', whiteSpace: 'nowrap'}}>
            <div className="d-flex flex-column align-items-center align-items-md-end text-center text-md-right" style={{gap: '16px', whiteSpace: 'nowrap'}}>
              <Link href="/linkedin-to-resume" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Linkedin to resume</Link>
              <Link href="/pdf-resume-builder" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Linkedin to PDF</Link>
              <Link href="/online-cv-builder" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Online CV builder</Link>
              <Link href="/online-resume-builder" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Online resume builder</Link>
              <Link href="/templates" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Templates</Link>
              <Link href="/pricing" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Pricing</Link>
              <Link href="/blog" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Blog</Link>
            </div>
            <div className="d-flex flex-column align-items-center align-items-md-end text-center text-md-right" style={{gap: '16px', whiteSpace: 'nowrap'}}>
              <Link href="/legal/terms" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Terms & Conditions</Link>
              <Link href="/legal/privacy" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Privacy Policy</Link>
              <Link href="/legal/cookies" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Cookie Policy</Link>
              <a href="https://vitaely.me/sitemap.xml" target="_blank" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Sitemap</a>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between">
          <p className={`${dark ? 'text-light-dis' : 'text-dark-dis'} mb-0`}>© Copyright Vitaely {new Date().getFullYear()}</p>
          {/* <p>Made by <a href="https://www.aaron-butler.co.uk">Aaron Butler</a> in London</p> */}
        </div>
      </Container>
    </div>
  )
}

export default Footer;