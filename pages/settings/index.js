import { useState, useEffect, useRef } from "react";
import fire from "../../config/fire-config";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "config/mixpanel-config";

import ChangeEmailSection from "./components/changeEmailSection";
import DeleteAccountSection from "./components/deleteAccountSection";
import SidebarLayout from "components/layout/SidebarLayout";
import Link from "next/link";
import MenuSidebar from "components/header/MenuSidebar";
import ICONS from "components/icon/IconPaths";

const Settings = () => {
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState("");
  const [userData, setUserData] = useState("");
  const [allUserData, setAllUserData] = useState("");
  const [loggedIn, setLoggedIn] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const sidebarRef = useRef(null);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
    if (window.innerWidth > 767 && showMenu) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    mixpanel.init(mixpanelConfig);
    mixpanel.track("Settings");

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Add event listener when menu is shown
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    const unsubscribe = fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        // router.push("/users/login");
      }
    });
    // Cleanup listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      unsubscribe();
    };
  }, [showMenu]);

  const handleShowMenu = () => {
    setShowMenu(true);
  };

  return (
    <div>
      <Head>
        <title>Settings | Vitaely.me</title>
      </Head>
      <div className={screenWidth > 767 && `d-flex flex-row`}>
        {screenWidth > 767 ? (
          <div
            ref={sidebarRef}
            style={{ position: "fixed", left: 0, zIndex: 1 }}
          >
            <MenuSidebar />
          </div>
        ) : (
          <div
            ref={sidebarRef}
            style={
              showMenu
                ? { position: "fixed", right: 0, zIndex: 1 }
                : { position: "fixed", right: -240, zIndex: 1 }
            }
            className={`sidebarWrapper ${showMenu && `shadow-5`}`}
          >
            <MenuSidebar smallScreen />
          </div>
        )}
        <div className="w-100">
          <div
            className="d-flex flex-column align-items-center px-3 px-md-5 w-100"
            style={{ paddingTop: screenWidth > 767 ? "64px" : "24px", paddingBottom: "160px" }}
          >
            <div className="w-100" style={{ maxWidth: "560px" }}>
            <div className="d-flex flex-row align-items-center justify-content-between mb-5">
								<h2 className="mb-0">Settings</h2>
								{screenWidth < 768 && (
									<button
										className="btn primary medium outlined x-small icon-only"
										onClick={() => handleShowMenu()}
									>
										<svg viewBox="0 0 24 24">
											<path d={ICONS.MENU}></path>
										</svg>
									</button>
								)}
							</div>
              {loggedIn ? (
                <div className="d-flex flex-column gap-5">
                  {/* <ul>
              <li>delete account</li>
              <li>edit login details/method</li>
            </ul> */}
                  {/* <div>
                <h5>Sign in methods</h5>
                <ChangeEmailSection
                  userData={userData}
                  allUserData={allUserData}
                />
              </div> */}
                  <div>
                    {/* <h5>Danger zone</h5> */}
                    <DeleteAccountSection userData={userData} />
                  </div>
                </div>
              ) : (
                <div
                  className={`d-flex flex-column align-items-start justify-content-between radius-4 p-4 bg-dark-100 gap-3`}
                >
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <div>
                      <h3 className="mb-3" style={{ maxWidth: "720px" }}>
                        Who goes there?
                      </h3>
                      <p className="mb-0">
                        You kind of need an account in order to edit your
                        account settings. Head over to the signup page to create
                        an account.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/users/register"
                    className="btn dark high x-small w-auto"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add layout function here
Settings.getLayout = function getLayout(page) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Settings;
