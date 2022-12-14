import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Container } from 'react-bootstrap';

import styles from './index.module.scss'
import settingsStyles from './settings/settings.module.scss'
import Icon from '../components/icon/Icon';
import ICONS from '../components/icon/IconPaths';
import Footer from '../components/Footer';
import PostCard from '../components/blog/PostCard';
import Header from '../components/header/Header';
import Image from 'next/image';

const Templates = () => {
  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);

  let templates = [
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
    {
      'id': 2,
      'label': 'Staccato',
      'string': 'staccato',
      'img': '/images/staccato-template.jpeg',
      'premium': true
    },
    {
      'id': 3,
      'label': 'Metro',
      'string': 'metro',
      'img': '/images/metro-template.jpeg',
      'premium': false
    },
    {
      'id': 4,
      'label': 'Metro Night',
      'string': 'metro_night',
      'img': '/images/metro-night-template.jpeg',
      'premium': false
    },
    {
      'id': 5,
      'label': 'Document',
      'string': 'document',
      'img': '/images/document-template.jpeg',
      'premium': false
    },
  ]

  return (
    <div className="overflow-hidden" style={{ background: 'white' }}>
      <Header hideShadow />
      <Head>
        <title>Landing page templates | Vitaely.me</title>
        <meta name="description" content="Turn your Linkedin Profile into a landing page in seconds with our carefully crafted templates." />
        <meta property="og:title" content="Landing page templates | Vitaely.me" />
        <meta property="og:description" content="Turn your Linkedin Profile into a landing page in seconds with our carefully crafted templates." />
        <meta property="og:url" content="https://www.vitaely.me/templates" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me%2Ftemplates"/>
      </Head>
      <Container className="mt-5 py-5">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div style={{ maxWidth: '560px' }}>
          { screenWidth > 576 ? <h1>Page templates</h1> : <h2>Page templates</h2> }
            <p className="large mb-0">Turn your Linkedin Profile into a landing page in seconds with our carefully crafted templates.</p>
          </div>
        </div>
        <div className={`${styles.sectionWrapper} d-flex flex-column align-items-center`}>
          <div className={`${styles.templatesGrid}`} style={{gap: '16px'}}>
            {templates.map((template, index) => 
              <Link href="/users/register">
                <div role="button" className={`d-flex flex-column radius-3 p-3 w-100 ${settingsStyles.planCard} ${template.active && settingsStyles.active}`} style={{gap: '16px'}}>
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <p className="large font-weight-bold text-dark-high mb-0">{template.label}</p>
                    {template.premium && <div className="tag primary medium">Premium</div>}
                  </div>
                  <div className={settingsStyles.imageWrapper}>
                    <Image
                      src={template.img}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                  {/* <Link href="/users/register">
                    <a className="btn small primary medium w-100">Use this template</a>
                  </Link> */}
                </div>
              </Link>
            )}
          </div>
          <h5 className="mt-5">More coming soon...</h5>
        </div>
        <div className={`${styles.sectionWrapper}`}>
          <div className="d-flex flex-column" style={{gap: '24px'}}>
            <div className={`align-items-start ${styles.featureCard}`} style={{background: '#FBFBF8'}}>
              <div className="w-100 order-1 order-lg-1">
                {screenWidth > 576 ? <h2>Create your page</h2> : <h3>Create your page</h3>}
                <p className="large mb-4">Create your very own professional website in just two minutes.</p>
                {screenWidth > 768 ? 
                  <Link href="/users/register">
                    <a className="btn primary high">Get started</a>
                  </Link>
                  : 
                  <Link href="/users/register">
                    <a className="btn primary high w-100">Get started</a>
                  </Link>
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
      <br/><br/>
    </div>
  )
}

export default Templates;