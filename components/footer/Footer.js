import Link from 'next/link';
import { Container } from 'react-bootstrap';
import ICONS from '../icon/IconPaths';
import styles from './Footer.module.scss';
import LOGOS from 'components/logo/LogoPath';

const Footer = ({dark}) => {

  return (
    <div className={``}>
      {/* <div className={`${dark && 'bg-light-100'} py-5`} style={`${dark && {background: '#242837'}}`}> */}
      <div className="p-4">
        {/* <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between mb-5" style={{gap: '48px'}}>
          <Link href="/">
            <svg height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
              <path 
                className={`${styles.logoPath} fill-dark-600`}
                fillRule="evenodd" 
                clipRule="evenodd" 
                d={LOGOS.LOGO} 
              />
            </svg>
          </Link>
          <div className="d-flex flex-column flex-md-row text-center" style={{gap: '48px', whiteSpace: 'nowrap'}}>
            <div className="d-flex flex-column align-items-center align-items-md-end text-center text-md-right" style={{gap: '16px', whiteSpace: 'nowrap'}}>
              <Link href="/blog" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Blog</Link>
              <Link href="/legal/terms" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Terms & Conditions</Link>
              <Link href="/legal/privacy" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Privacy Policy</Link>
              <Link href="/legal/cookies" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Cookie Policy</Link>
              <a href="https://vitaely.me/sitemap.xml" target="_blank" className={`${dark ? 'text-light-low' : 'text-dark-low'} mb-0`}>Sitemap</a>
              
            </div>
          </div>
        </div> */}
        <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between gap-2">
          <p className="text-dark-dis caption mb-0" style={{opacity: 0.5}}><Link href="/legal/terms">Terms</Link>・<Link href="/legal/privacy">Privacy</Link>・<Link href="/legal/cookies">Cookies</Link></p>
          <p className={`caption ${dark ? 'text-light-dis' : 'text-dark-dis'} mb-0`}>© Epic Baby Names {new Date().getFullYear()} </p>
          {/* <p>Made by <a href="https://www.aaron-butler.co.uk">Aaron Butler</a> in London</p> */}
        </div>
      </div>
    </div>
  )
}

export default Footer;