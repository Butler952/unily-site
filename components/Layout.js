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
      {/* {windowUrl.includes("profile") | windowUrl.includes("settings") ? (windowUrl !== "/profile" ? 
      <div style={{marginBottom: '66px', height: 0}}>
        <Header/> 
      </div> 
      : null)
      : windowUrl !== "/profile" ? <Header/> : null} */}
      {/* {windowUrl !== "/profile" ? <Header/> : null } */}
      {/* {windowUrl.includes("profile") | windowUrl.includes("settings") ? <div><br></br><br></br><br></br></> : null} */}
      {props.children}
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
    </>
  )
}

export default Layout;