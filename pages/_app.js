import Head from 'next/head'
import '../public/styles/global.scss';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Aaron wants to join Founders Factory</title>
        <link rel="shortcut icon" href="/images/vitaely-logo-icon-square.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}