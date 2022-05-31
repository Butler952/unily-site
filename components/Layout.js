import { useState, useEffect } from 'react';
import Header from "./header/Header";
import { Router } from 'next/router'

const Layout = (props) => {

  const [windowUrl, setWindowUrl] = useState("");

  useEffect(() => {
    Router.events.on('routeChangeComplete', () => {
      setWindowUrl(window.location.pathname);
    })
  }, []);

  return (
    <>
      { windowUrl !== "/profile" ? <Header/>: null }
      {props.children}
    </>
  )
}

export default Layout;