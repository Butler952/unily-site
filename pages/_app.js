import { useEffect } from 'react';
import fire from '../config/fire-config';
import Head from 'next/head'
import '../public/styles/global.scss'

export default function App({ Component, pageProps }) {

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      fire.analytics();
    }
  }, [])

  return (
    <>
      <Head>
        <title>Vitaely.me</title>
        <link rel="shortcut icon" href="/images/vitaely-logo-icon-square.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}