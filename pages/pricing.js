import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Container } from 'react-bootstrap';

import styles from './index.module.scss'
import settingsStyles from './settings/settings.module.scss'
import Icon from '../components/icon/Icon';
import ICONS from '../components/icon/IconPaths';
import Footer from '../components/footer/Footer';
import PostCard from '../components/blog/PostCard';
import Header from '../components/header/Header';
import Image from 'next/image';

const Pricing = () => {
  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);

  let plans = [
    {
      'id': 0,
      'label': 'Original',
      'string': 'original',
      'img': '/images/profile-preview.png',
      'premium': false
    },
    {
      'id': 1,
      'label': 'Bento',
      'string': 'bento',
      'img': '/images/bento-template.jpg',
      'premium': true
    },
  ]

  return (
    <div className="overflow-hidden" style={{ background: 'white' }}>
      <Header hideShadow />
      <Head>
        <title>Pricing | vitaely.me</title>
        <meta name="description" content="Pricing and plans for vitaely.me — Turn your Linkedin Profile into a landing page." />
        <meta property="og:title" content="Pricing | vitaely.me" />
        <meta property="og:description" content="Pricing and plans for vitaely.me — Turn your Linkedin Profile into a landing page." />
        <meta property="og:url" content="https://www.vitaely.me/templates" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me%2Fpricing" />
      </Head>
      <Container className="mt-5 py-5">
        <div className="d-flex flex-column flex-lg-row align-items-start justify-content-between">
          <div style={{ maxWidth: '560px' }}>
            {screenWidth > 576 ? <h1>Pricing</h1> : <h2>Pricing</h2>}
            <p className="large mb-0">Get started for free, or upgrade to Premium to experience all that your Vitaely profile has to offer.</p>
          </div>
        </div>
        <div className={`${styles.sectionWrapper} d-flex flex-column align-items-center`}>
          <div className={`${styles.templatesGrid}`} style={{ gap: '16px' }}>
            <Link href="/users/register" style={{textDecoration: 'none'}}>
              <div role="button" className={`d-flex flex-column radius-3 p-3 p-md-4 h-100 w-100 justify-content-between ${settingsStyles.planCard}`} style={{gap: '48px'}}>
                <div>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <h5 className="text-primary-high mb-1">Basic</h5>
                  </div>
                  <h4 className="text-dark-high mb-4">Free</h4>
                  {[
                    'vitaely.me domain',
                    'Basic templates'
                  ].map((feature, index) =>
                    <div key={index} className="d-flex align-items-start mt-2">
                      <svg viewBox="0 0 24 24" width={'24px'} className="mr-2 fill-dark-900">
                        <path d={ICONS.CHECK}></path>
                      </svg>
                      <p className="text-dark-high mb-0">{feature}</p>
                    </div>
                  )}
                </div>
                <a className="btn small primary medium w-100">Get started for free</a>
              </div>
            </Link>
            <Link href="/users/register" style={{textDecoration: 'none'}}>
              <div role="button" className={`d-flex flex-column radius-3 p-3 p-md-4 w-100 justify-content-between ${settingsStyles.planCard}`} style={{gap: '48px'}}>
                <div>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <h5 className="text-primary-high mb-1">Premium</h5>
                  </div>
                  <div className="d-flex align-items-end mb-4">
                    <h4 className="text-dark-high mr-1 mb-0">$3</h4>
                    <p className="text-dark-high mb-0">/month</p>
                  </div>
                  {[
                    'All Basic features',
                    'Connect your own domain',
                    'Premium templates',
                    'More coming soon'
                  ].map((feature, index) =>
                    <div key={index} className="d-flex align-items-start mt-2">
                      <svg viewBox="0 0 24 24" width={'24px'} className="mr-2 fill-dark-900" style={{ minWidth: '24px' }}>
                        <path d={ICONS.CHECK}></path>
                      </svg>
                      <p className="text-dark-high mb-0">{feature}</p>
                    </div>
                  )}
                </div>
                <a className="btn small primary high w-100">Get started</a>
              </div>
            </Link>
          </div>
        </div>
        <div className={`${styles.sectionWrapper}`}>
          <div className="d-flex flex-column" style={{ gap: '24px' }}>
            <div className={`align-items-start bg-primary-200 ${styles.featureCard}`}>
              <div className="w-100 order-1 order-lg-1">
                {screenWidth > 576 ? <h2>Create your page</h2> : <h3>Create your page</h3>}
                <p className="large mb-4">Create your very own professional website in just two minutes.</p>
                {screenWidth > 768 ?
                  <Link href="/users/register" className="btn primary high">Get started</Link>
                  :
                  <Link href="/users/register" className="btn primary high w-100">Get started</Link>
                }
              </div>
              <div className="w-100 order-0 order-lg-1">
                <img className="w-100" src="/images/landing-page/sync-highlight.png"></img>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
      <br /><br />
    </div>
  )
}

export default Pricing;