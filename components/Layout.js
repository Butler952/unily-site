import { useState, useEffect } from 'react';
import Header from "./header/Header";
import { Router } from 'next/router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default Layout;