import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'
import ProgressBar from 'react-scroll-progress-bar';
import Icon from '../icon/Icon';
import Footer from '../Footer';
import styles from '../../pages/blog/blog.module.scss'
import Header from '../header/Header';

const Post = (props) => {

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);



  return (
    <div style={{background: 'white'}}>
      <Header hideShadow/>
      <Head>
        <title>{props.title} | Vitaely.me</title>
        { props.description ? <meta name="description" content={props.description} /> : null }
        <meta property="og:title" content={`${props.title} | Vitaely.me`} />
        <meta property="og:description" content={props.description} />
        <meta property="og:url" content={`https://www.vitaely.me/blog/${props.url}`} />
        <meta property="og:type" content="article" />
        { props.image ? <meta property="og:image" content={`https://www.vitaely.me${props.image}`} /> : null }
        { props.image ? <meta name="twitter:image" content={`https://www.vitaely.me${props.image}`} /> : null }
      </Head>
      <ProgressBar
        bgcolor="#15121c"
        height="4px"
      />
        <div className="container" style={{maxWidth: '768px'}}>
          <div className=" pt-5 pb-4 background-light text-center">
            {screenWidth > 767 ?
              <h1 className="hero-title mb-4 text-dark-high text-center">{props.title}</h1>
              :
              <h2 className="hero-title mb-4 text-dark-high text-center">{props.title}</h2>
            }
            <p className="text-dark-med large tagline">{props.readingDuration} min read</p>
            {/* <div className={`${styles.featureCard} my-5`}>
              { props.image ? <img alt={props.imageAlt ? props.imageAlt : null} src={props.image}></img> : null }
            </div> */}
            { props.image ? <div className={`${styles.heroImageWrapper} mt-5`}>
              <Image alt={props.imageAlt ? props.imageAlt : null} src={props.image} layout="fill" objectFit="cover" />
            </div> : null }
          </div>
          {props.children}
          { props.hideFooter ? 
          null :
          <div className="landing-page-section background-light">
            <div className="container text-center">
              {screenWidth > 767 ?
                <h1 className="hero-title mx-auto mb-4 text-dark-high">Questions? Reach out!</h1>
                :
                <h2 className="hero-title mx-auto mb-4 text-dark-high">Questions? Reach out!</h2>
              }
              <p className="mx-auto mb-5 text-dark-med large">I'll try to get back to you as soon as I can</p>
              <a href="mailto:butler952@gmail.com" className="mb-3 mb-md-0 btn btn-primary btn-large mr-0 mr-md-3">Email me</a>
            </div>
          </div>
          }
        </div>
      <Footer />
    </div>
  )
}

export default Post;