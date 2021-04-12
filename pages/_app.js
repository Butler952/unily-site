import Head from 'next/head'
import '../public/styles/global.scss'

export default function App({ Component, pageProps }) {
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