import Link from 'next/link';
import { Container } from 'react-bootstrap';

const Footer = () => {
  

  return (
    <div>
      <Container className="py-5">
        <div className="d-flex flex-column flex-md-row align-items-md-start align-items-center justify-content-between mb-5">
          <Link href="/"><a><img className="mb-5 mb-md-0" src="/images/vitaely-logo-full.svg" /></a></Link>
          <div className="d-flex flex-column text-center text-md-right">
            <Link href="/legal/terms"><a className="text-dark-high mb-3">Terms & Conditions</a></Link>
            <Link href="/legal/privacy"><a className="text-dark-high mb-3">Privacy Policy</a></Link>
            <Link href="/legal/cookies"><a className="text-dark-high">Cookie Policy</a></Link>
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