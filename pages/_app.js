import { createContext, useEffect, useState } from 'react';
import fire from '../config/fire-config';
import Head from 'next/head'
import '../public/styles/global.scss';
import LogRocket from 'logrocket';
import Layout from '../components/Layout';

export const UserContext = createContext("")

export default function App({ Component, pageProps }) {

  const [userContext, setUserContext] = useState("");
  const userValue = { userContext, setUserContext };

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      fire.analytics();
      LogRocket.init('qbfdxd/expertpageio', {
        dom: {
          inputSanitizer: true,
        },
      });
      // // Include the Crisp code here, without the <script></script> tags
      // window.$crisp = [];
      // window.CRISP_WEBSITE_ID = "02962a25-3eb1-43dd-a8bc-815253fa7582";

      // (function() {
      //   var d = document;
      //   var s = d.createElement("script");

      //   s.src = "https://client.crisp.chat/l.js";
      //   s.async = 1;
      //   d.getElementsByTagName("head")[0].appendChild(s);
      // })();
    }
  }, [])

  return (
    <body>
      <UserContext.Provider value={userValue}>
        <Head>
          <title>expertpage.io</title>
          <link rel="shortcut icon" href="/images/expertpage-logo-icon.svg" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContext.Provider>
    </body>
  )
}