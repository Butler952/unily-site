import Head from 'next/head'
import '../public/styles/global.scss';

export default function App({ Component, pageProps }) {


  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Aaron X Unily" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Aaron Butler x Unily</title>
        <meta
          name="description"
          content="Experience and case studies from Aaron Butler as he attempts to join Unily to build great things together."
        />
        <meta
          property="og:title"
          content="Aaron Butler wants to build with Unily"
        />
        <meta
          property="og:description"
          content="Experience and case studies from Aaron Butler as he attempts to join Unily to build great things together."
        />
        <meta property="og:url" content="https://aaron-butler-for-unily.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://aaron-butler-for-unily.vercel.app/images/og-image.png" />
        <meta property="twitter:image" content="https://aaron-butler-for-unily.vercel.app/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}