import Head from 'next/head'
import '../public/styles/global.scss';

export default function App({ Component, pageProps }) {


  return (
    <>
      <Head>
        <title>Epic Baby Names</title>
        <link rel="icon" type="image/png" href="/images/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/images/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Epic Baby Names" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Epic Baby Names | Certified epic names for your kid</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}