import { useEffect } from 'react';
import fire from '../config/fire-config';
import Head from 'next/head'
import '../public/styles/global.scss';
import LogRocket from 'logrocket';


export default function App({ Component, pageProps }) {

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      fire.analytics();
      LogRocket.init('qbfdxd/vitaelyme', {
        dom: {
          inputSanitizer: true,
        },
      });
    }
    // Include the Crisp code here, without the <script></script> tags
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "02962a25-3eb1-43dd-a8bc-815253fa7582";

    (function() {
      var d = document;
      var s = d.createElement("script");

      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
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