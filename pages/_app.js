import { createContext, useEffect, useState } from 'react';
import fire from '../config/fire-config';
import Head from 'next/head'
import '../public/styles/global.scss';
import LogRocket from 'logrocket';
import Layout from '../components/Layout';
import { Crisp } from "crisp-sdk-web";

export const UserContext = createContext("")

export default function App({ Component, pageProps }) {

  const [userContext, setUserContext] = useState("");
  const userValue = { userContext, setUserContext };

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      fire.analytics();
      LogRocket.init('qbfdxd/vitaelyme', {
        dom: {
          inputSanitizer: true,
        },
      });
      Crisp.configure("02962a25-3eb1-43dd-a8bc-815253fa7582");
    }
  }, [])

  return (
    // <body>
      <UserContext.Provider value={userValue}>
        <Head>
          <title>vitaely.me</title>
          <link rel="shortcut icon" href="/images/vitaely-logo-icon-square.svg" />
          <title>Vitaely | Turn your Linkedin profile into a website</title>
          <meta name="description" content="Turn your Linkedin profile into your own personal website in two minutes" />
          <meta property="og:title" content="Vitaely | Turn your Linkedin profile into a website" />
          <meta property="og:description" content="Turn your Linkedin profile into your own personal website in two minutes" />
          <meta property="og:url" content="https://www.vitaely.me/" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContext.Provider>
    // </body>
  )
}