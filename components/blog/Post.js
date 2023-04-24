import { useState, useEffect, useRef } from 'react';
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
  const [footerHeight, setFooterHeight] = useState(0)

  const ref = useRef(null)

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
    if (ref?.current?.clientHeight) {
      setFooterHeight(ref.current.clientHeight)
    }
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    if (ref?.current?.clientHeight) {
      setFooterHeight(ref.current.clientHeight)
    }
    window.addEventListener('resize', handleResize);
  }, []);



  return (
    <div>
      <Header hideShadow/>
      <Head>
        <title>{props.title} | expertpage.io</title>
        { props.description ? <meta name="description" content={props.description} /> : null }
        <meta property="og:title" content={`${props.title} | expertpage.io`} />
        <meta property="og:description" content={props.description} />
        <meta property="og:url" content={`https://www.expertpage.io/blog/${props.url}`} />
        <meta property="og:type" content="article" />
        { props.image ? <meta property="og:image" content={`https://www.expertpage.io${props.image}`} /> : null }
        { props.image ? <meta name="twitter:image" content={`https://www.expertpage.io${props.image}`} /> : null }
      </Head>
      <ProgressBar
        bgcolor="#5643cc"
        height="4px"
      />
        <div className="bg-light-900 py-5" style={{paddingTop: 80, marginBottom: footerHeight, zIndex: '2', position: 'relative'}}>
          <div className="container py-5" style={{maxWidth: '768px'}}>
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
        </div>
        <div ref={ref} className="w-100" style={{zIndex: '1', position: 'fixed', bottom: 0}}>
          <Footer />
        </div>
    </div>
  )
}

export default Post;