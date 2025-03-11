import { createContext, useEffect, useState } from 'react';
import fire from '../config/fire-config';
import Head from 'next/head'
import '../public/styles/global.scss';
import LogRocket from 'logrocket';
import Layout from '../components/Layout';
import { Crisp } from "crisp-sdk-web";
import { useRouter } from 'next/router';

export const UserContext = createContext("")

// Keep track of component state between route changes
const handleRouteChange = () => {
  // You might want to show a loading indicator here if needed
};

export default function App({ Component, pageProps }) {

  const [userContext, setUserContext] = useState("");
  const userValue = { userContext, setUserContext };

  const router = useRouter();

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'production') {
  //     fire.analytics();
  //     LogRocket.init('qbfdxd/vitaelyme', {
  //       dom: {
  //         inputSanitizer: true,
  //       },
  //     });
  //     Crisp.configure("02962a25-3eb1-43dd-a8bc-815253fa7582");
  //   }
  // }, [])

  useEffect(() => {
    // Set up listeners for route changes
    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    // <body>
      <UserContext.Provider value={userValue}>
        <Head>
          <title>vitaely.me</title>
          <link rel="shortcut icon" href="/images/vitaely-logo-icon-square.svg" />
          <title>Vitaely | Turn your Linkedin profile into a website</title>
        </Head>
        <Layout>
          {getLayout(<Component {...pageProps} />)}
        </Layout>
      </UserContext.Provider>
    // </body>
  )
}