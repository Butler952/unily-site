import Link from 'next/link';
import { Container } from 'react-bootstrap';

const Footer = () => {

  return (
    <div>
      <Container className="py-5">
        <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between mb-5" style={{gap: '48px'}}>
          <Link href="/"><a className="w-lg-100"><img className="mb-5 mb-md-0" src="/images/vitaely-logo-full.svg" /></a></Link>
          <div className="d-flex flex-column flex-md-row text-center" style={{gap: '48px', whiteSpace: 'nowrap'}}>
            <div className="d-flex flex-column text-center text-md-right" style={{gap: '16px', whiteSpace: 'nowrap'}}>
              <Link href="/linkedin-to-resume"><a className="text-dark-high mb-0">Linkedin to resume</a></Link>
              <Link href="/pdf-resume-builder"><a className="text-dark-high mb-0">Linkedin to PDF</a></Link>
              <Link href="/online-cv-builder"><a className="text-dark-high mb-0">Online CV builder</a></Link>
              <Link href="/online-resume-builder"><a className="text-dark-high mb-0">Online resume builder</a></Link>
              <Link href="/templates"><a className="text-dark-high mb-0">Templates</a></Link>
              <Link href="/blog"><a className="text-dark-high mb-0">Blog</a></Link>
            </div>
            <div className="d-flex flex-column text-center text-md-right" style={{gap: '16px', whiteSpace: 'nowrap'}}>
              <Link href="/legal/terms"><a className="text-dark-high mb-0">Terms & Conditions</a></Link>
              <Link href="/legal/privacy"><a className="text-dark-high mb-0">Privacy Policy</a></Link>
              <Link href="/legal/cookies"><a className="text-dark-high mb-0">Cookie Policy</a></Link>
              <a href="https://vitaely.me/sitemap.xml" target="_blank" className="text-dark-high mb-0">Sitemap</a>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between">
          <p>© Copyright Vitaely {new Date().getFullYear()}</p>
          <p>Made by <a href="https://www.aaron-butler.co.uk">Aaron Butler</a> in London</p>
        </div>
      </Container>
    </div>
  )
}

export default Footer;