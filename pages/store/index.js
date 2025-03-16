import { useState, useEffect, forwardRef, useContext, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Dropdown, Modal } from "react-bootstrap";
import fire from "/config/fire-config";
import { handlePurchase } from "/lib/handle-purchase";

import styles from "./store.module.scss";
import Icon from "/components/icon/Icon";
import ICONS from "/components/icon/IconPaths";
import Footer from "/components/footer/Footer";
import PostCard from "/components/blog/PostCard";
import NAMES from "../names";
import { UserContext } from "pages/_app";
import Menu from "components/header/Menu";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import MenuSidebar from "components/header/MenuSidebar";
import { motion, AnimatePresence } from "framer-motion";
import SidebarLayout from "components/layout/SidebarLayout";

const Store = () => {
  const router = useRouter();

  const { userContext, setUserContext } = useContext(UserContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");
  const [product, setProduct] = useState("");

  const [screenWidth, setScreenWidth] = useState("");
  const [removing, setRemoving] = useState(false);
  const [shortlist, setShortlist] = useState(
    userContext && userContext.shortlist ? userContext.shortlist : []
  );
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [openingCheckout, setOpeningCheckout] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [linkCooldown, setLinkCooldown] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [showUpgradeSuccessModal, setShowUpgradeSuccessModal] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  // Add ref for the sidebar
  const sidebarRef = useRef(null);

  // Add click handler for outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Add event listener when menu is shown
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // [x] Get shortlist from local
  // [x] Save to a state
  // [x] Get the names of all id's in the array
  // [x] Output the array to a map
  // [ ] Have a button next to each one to remove the item (from state + local storage)
  //  [ ] get current array,
  //  [ ] remove item that matches id
  //  [ ] set shortlist as the new array in local storage
  // [ ] Navigate back to the 'names' pages

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
    if (window.innerWidth > 767 && showMenu) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const { signIn } = router.query;

    // Check for signIn query parameter
    if (signIn === "complete") {
      confirmLoginWithLink();
    }

    const unsubscribe = fire.auth().onAuthStateChanged((user) => {
      if (user) {
        loggedInRoute(user);
      } else {
      }
    });
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, [router.query]);

  useEffect(() => {
    const { upgrade } = router.query;
    if (upgrade === "success") {
      setShowUpgradeSuccessModal(true);
    }
  }, [router.query]);

  const loggedInRoute = (user) => {
    // Check payments, and shortlists
    // If payment for Iliad, then allow the user to get more names
    // If not, stick to the limit
    setLoggedIn(true);
    setUserData(user);
    let purchasedProducts = product;
    // getSubscription(user)
    // console.log(user)
    fire
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUserContext(doc.data());
          // setShortlist(doc.data().shortlist ? doc.data().shortlist : []);
          // setRejected(doc.data().rejected ? doc.data().rejected : []);
        } else {
          console.log("No such document!");
        }
      })
      .then(() => {
        fire
          .firestore()
          .collection("users")
          .doc(user.uid)
          .collection("payments")
          .where("status", "==", "succeeded")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              purchasedProducts = doc.data().items[0].price.product;
              setProduct(doc.data().items[0].price.product);
            });
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const handleShowMenu = () => {
    setShowMenu(true);
  };

  const handleUpgradeClose = () => {
    setShowUpgradeModal(false);
  };
  const handleUpgradeShow = () => {
    setShowEmailPassword(false);
    setShowSignIn(false);
    setShowUpgradeModal(true);
  };

  const handleUpgradeSuccessClose = () => {
    setShowUpgradeSuccessModal(false);
  };

  const usernameChange = (value) => {
    setUsername(value), setEmailError("");
  };

  const handlePurchaseClick = () => {
    if (!userData?.uid) {
      // Redirect to login or show error message
      // setShowUpgradeModal(true);
      handleUpgradeShow();
      // alert('Please log in to make a purchase');
      return;
    } else {
      setOpeningCheckout(true);
      handlePurchase(
        userData.uid,
        "iliad",
        window.location.origin + "/store?upgrade=success",
        window.location.origin + "/store?upgrade=cancelled"
      );
    }
  };

  // Add generateEmailLink function
  const generateEmailLink = (e) => {
    e.preventDefault();
    setSendingLink(true);
    let email = username;
    let redirectUrl = `http://localhost:3000/names?signIn=complete`;
    fetch("/api/generate-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, redirectUrl }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("emailForSignIn", username);
        fetch("/api/send-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data,
            to: email,
          }),
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setSendingLink(false);
            setLinkSent(true);
            setLinkCooldown(10);
            const countdownInterval = setInterval(() => {
              setLinkCooldown((prevCount) => {
                if (prevCount <= 1) {
                  clearInterval(countdownInterval);
                  return null;
                }
                return prevCount - 1;
              });
            }, 1000);
          })
          .catch((error) => {
            console.log("error", error);
            setSendingLink(false);
            alert("Failed to send sign-in link");
          });
      })
      .catch((error) => {
        console.log("error", error);
        setSendingLink(false);
        alert("Failed to send sign-in link");
      });
  };

  const confirmLoginWithLink = (e) => {
    // Confirm the link is a sign-in with email link.
    if (fire.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      // The client SDK will parse the code from the link for you.
      fire
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then((userCredential) => {
          // First check if user document exists
          return fire
            .firestore()
            .collection("users")
            .doc(userCredential.user.uid)
            .get()
            .then((doc) => {
              if (!doc.exists) {
                // Only create document if it doesn't exist
                return fire
                  .firestore()
                  .collection("users")
                  .doc(userCredential.user.uid)
                  .set({
                    email: userCredential.user.email,
                    shortlist:
                      typeof localStorage.getItem("shortlist") != "undefined"
                        ? JSON.parse(localStorage.shortlist)
                        : [],
                    rejected:
                      typeof localStorage.getItem("rejected") != "undefined"
                        ? JSON.parse(localStorage.rejected)
                        : [],
                    created: fire.firestore.FieldValue.serverTimestamp(),
                    lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
                  });
              }
              // If doc exists, continue without setting
              return Promise.resolve();
            });
        })
        .then(() => {
          // mixpanel.init(mixpanelConfig);
          toast("Signed in");
          localStorage.removeItem("emailForSignIn");
          localStorage.removeItem("shortlist");
          localStorage.removeItem("rejected");
        })
        .then(() => {
          setSendingLink(false);
          router.push("/names?upgrading=true");
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  };

  const handleLoginWithGoogle = (e) => {
    e.preventDefault();
    fire
      .auth()
      .signInWithPopup(new fire.auth.GoogleAuthProvider())
      .then(() => {
        router.push("/names?upgrading=true");
      })
      .catch((err) => {
        console.log(err.code, err.message);
      });
  };

  return (
    <div className="overflow-hidden">
      <Head>
        <title>Shortlist</title>
        <meta
          name="description"
          content="Turn your Linkedin profile into a resume in just two minutes."
        />
        <meta
          property="og:title"
          content="Turn your Linkedin profile into a resume | vitaely.me"
        />
        <meta
          property="og:description"
          content="Turn your Linkedin profile into a resume in just two minutes."
        />
        <meta
          property="og:url"
          content="https://www.vitaely.me/linkedin-to-resume"
        />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me%2Flinkedin-to-resume"/> */}
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
          {/* <div className="d-flex flex-row justify-content-between align-items-center p-2 px-md-3 w-100">
						<Link
							href="/names"
							className="btn dark ultraLow small icon-left text-only"
						>
							<svg viewBox="0 0 24 24">
								<path d={ICONS.ARROW_LEFT}></path>
							</svg>
							Find more names
						</Link>
						<Menu />
					</div> */}
          <div
            className="d-flex flex-column align-items-center px-3 px-md-5 w-100"
            style={{
              paddingTop: screenWidth > 767 ? "64px" : "24px",
              paddingBottom: "160px",
            }}
          >
            <div
              className="w-100"
              style={
                screenWidth > 767
                  ? { maxWidth: "800px" }
                  : { maxWidth: "560px" }
              }
            >
              <div className="d-flex flex-row align-items-center justify-content-between mb-5">
                <h2 className="mb-0">Store</h2>
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
              <div className="d-flex flex-column flex-lg-row gap-3 w-100">
                <div
                  className={`${styles.epicPoemCard} radius-4 w-100 d-flex flex-column align-items-center gap-4 p-5`}
                  // className={`radius-4 w-100 position-relative shine overflow-hidden ${styles.epicPoemCard} ${styles.epicPoemCardIliad}`}
                >
                  <div
                    className={`${styles.epicPoemIllustration} ${styles.epicPoemIllustrationIliad} shine p-2 radius-2`}
                  >
                    <img
                      style={{ width: "96px" }}
                      src="/images/book-patterns/iliad-square.svg"
                    />
                  </div>
                  <div className="d-flex flex-column align-items-center gap-4">
                    <div className="d-flex flex-column align-items-center text-center">
                      <h3 className="mb-3">Iliad</h3>
                      <p>
                        Over 500 names from Homer's epic poem <i>The Iliad</i>,
                        featuring mortal belligerents of all factions of the
                        Trojan war, and the Gods that quarrelled over them.
                      </p>
                    </div>
                    {product !== "prod_R9UsZtF60a9OSG" ? (
                      <button
                        onClick={handlePurchaseClick}
                        className="btn dark small high"
                      >
                        Unlock—$9
                      </button>
                    ) : (
                      <button
                        onClick={handlePurchaseClick}
                        className="btn high small icon-left"
                        disabled
                      >
                        <svg viewBox="0 0 24 24">
                          <path d={ICONS.CHECK_CIRCLE}></path>
                        </svg>
                        Purchased
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.epicPoemCard} radius-4 w-100 d-flex flex-column align-items-center gap-4 p-5`}
                  // className={`radius-4 w-100 position-relative shine overflow-hidden ${styles.epicPoemCard} ${styles.epicPoemCardIliad}`}
                >
                  <div
                    className={`${styles.epicPoemIllustration} ${styles.epicPoemIllustrationOdyssey} shine p-2 radius-5`}
                  >
                    <img
                      style={{ width: "96px" }}
                      src="/images/book-patterns/odyssey-round.svg"
                    />
                  </div>
                  <div className="d-flex flex-column align-items-center justify-content-between h-100 gap-4">
                    <div className="d-flex flex-column align-items-center text-center">
                      <h3 className="mb-3">Odyssey</h3>
                      <p>
                        More ancient greek names from <i>The Odyssey</i>; which
                        chronicles the ten-year journey of Odysseus, king of
                        Ithaka, back to his home after the fall of Troy.
                      </p>
                    </div>
                    <button className="btn dark small high" disabled>
                      Coming soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showUpgradeModal}
        onHide={handleUpgradeClose}
        keyboard={false}
        size={!loggedIn ? "lg" : "md"}
        centered
      >
        <div className="position-relative bg-background">
          <div className="d-flex flex-column flex-lg-row">
            {!loggedIn &&
              (!showSignIn ? (
                <div
                  className={`w-100 d-flex flex-column align-items-start gap-3 p-4 pt-5 p-sm-5`}
                >
                  <h2 className="text-dark-high w-100 mb-0">
                    Create an account
                  </h2>
                  <p className="small w-100 mt-0 mb-3">
                    By creating an account you agree to our{" "}
                    <a href="/legal/terms" target="_blank">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/legal/privacy" target="_blank">
                      Privacy Policy
                    </a>
                    . Already got an account?{" "}
                    <button
                      className="link"
                      onClick={() => setShowSignIn(true)}
                    >
                      Sign in
                    </button>
                    .
                  </p>
                  {/* <p className="small mt-3 mb-0">
                    Already got an account?{" "}
                    <button
                      className="link"
                      onClick={() => setShowSignIn(true)}
                    >
                      Sign in
                    </button>
                  </p> */}
                  <div className="w-100">
                    <button
                      type="button"
                      onClick={(e) => handleLoginWithGoogle(e)}
                      className="btn dark high w-100"
                      disabled={sendingLink}
                    >
                      <img
                        className="mr-2"
                        width="24"
                        src="/images/third-party/google.svg"
                      ></img>
                      Continue with Google
                    </button>
                    <div className="d-flex flex-row align-items-center w-100 gap-3 my-3">
                      <hr className="w-100 m-0"></hr>
                      <p className="small mb-0">or</p>
                      <hr className="w-100 m-0"></hr>
                    </div>
                    {!showEmailPassword ? (
                      <button
                        type="submit"
                        className="btn primary medium w-100"
                        disabled={sendingLink}
                        onClick={() => setShowEmailPassword(true)}
                      >
                        Continue with email
                      </button>
                    ) : !linkSent ? (
                      <form onSubmit={generateEmailLink}>
                        <div className="mb-2">
                          <input
                            type="text"
                            placeholder="Email"
                            className={
                              emailError !== "" ? `error w-100` : `w-100`
                            }
                            value={username}
                            onChange={({ target }) =>
                              usernameChange(target.value)
                            }
                          />
                          {emailError !== "" ? (
                            <p className="small text-error-high mt-2">
                              {emailError}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="submit"
                          className="btn primary high w-100"
                          disabled={sendingLink}
                        >
                          {sendingLink ? "Sending link..." : "Send magic link"}
                        </button>
                      </form>
                    ) : (
                      <div>
                        <h4 className="mb-3">Check your inbox</h4>
                        <p>
                          We just sent an email to{" "}
                          <span className="font-weight-semibold">
                            {username}
                          </span>{" "}
                          with a magic link that'll log you in.
                        </p>
                        <p className="mt-3 mb-0">
                          Didn't receive it?{" "}
                          <button
                            className="link"
                            onClick={() => setLinkSent(false)}
                            disabled={linkCooldown !== null}
                          >
                            Request another link
                            {linkCooldown && ` (${linkCooldown})`}
                          </button>
                        </p>
                      </div>
                    )}
                    {/* {!showEmailPassword ? (
											<button
												type="submit"
												className="btn primary medium w-100"
													disabled={sendingLink}
												onClick={() => setShowEmailPassword(true)}
											>
												Use email & password
											</button>
										) : (
											<form onSubmit={handleRegister}>
												<div className="mb-2">
													<input
														type="text"
														placeholder="Email"
														className={
															emailError !== "" ? `error w-100` : `w-100`
														}
														value={username}
														onChange={({ target }) =>
															usernameChange(target.value)
														}
													/>
													{emailError !== "" ? (
														<p className="small text-error-high mt-2">
															{emailError}
														</p>
													) : null}
												</div>
												<div className="mb-3">
													<input
														type="password"
														placeholder="Password"
														className={
															passwordError !== "" ? `error w-100` : `w-100`
														}
														value={password}
														onChange={({ target }) =>
															passwordChange(target.value)
														}
													/>
													{passwordError !== "" ? (
														<p className="small text-error-high mt-2">
															{passwordError}
														</p>
													) : null}
												</div>
												<button
													type="submit"
													className="btn primary high w-100"
													disabled={sendingLink}
												>
													{sendingLink
														? "Creating account..."
														: "Create account"}
												</button>
											</form>
										)} */}
                  </div>
                </div>
              ) : (
                <div
                  className={`w-100 d-flex flex-column align-items-start gap-3 p-4 pt-5 p-sm-5`}
                >
                  <h2 className="text-dark-high w-100 mb-0">
                    Sign in to your account
                  </h2>
                  <p className="small mb-3">
                    Not got an account?{" "}
                    <button
                      className="link"
                      onClick={() => setShowSignIn(false)}
                    >
                      Sign up
                    </button>
                  </p>
                  <div className="w-100">
                    <button
                      type="button"
                      onClick={(e) => handleLoginWithGoogle(e)}
                      className="btn dark high w-100"
                      disabled={signingIn}
                    >
                      <img
                        className="mr-2"
                        width="24"
                        src="/images/third-party/google.svg"
                      ></img>
                      Sign in with Google
                    </button>
                    <div className="d-flex flex-row align-items-center w-100 gap-3 my-3">
                      <hr className="w-100 m-0"></hr>
                      <p className="small mb-0">or</p>
                      <hr className="w-100 m-0"></hr>
                    </div>
                    {!showEmailPassword ? (
                      <button
                        type="submit"
                        className="btn primary medium w-100"
                        disabled={sendingLink}
                        onClick={() => setShowEmailPassword(true)}
                      >
                        Continue with email
                      </button>
                    ) : !linkSent ? (
                      <form onSubmit={generateEmailLink}>
                        <div className="mb-2">
                          <input
                            type="text"
                            placeholder="Email"
                            className={
                              emailError !== "" ? `error w-100` : `w-100`
                            }
                            value={username}
                            onChange={({ target }) =>
                              usernameChange(target.value)
                            }
                          />
                          {emailError !== "" ? (
                            <p className="small text-error-high mt-2">
                              {emailError}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="submit"
                          className="btn primary high w-100"
                          disabled={sendingLink}
                        >
                          {sendingLink ? "Sending link..." : "Send magic link"}
                        </button>
                      </form>
                    ) : (
                      <div>
                        <h4 className="mb-3">Check your inbox</h4>
                        <p>
                          We just sent an email to{" "}
                          <span className="font-weight-semibold">
                            {username}
                          </span>{" "}
                          with a magic link that'll log you in.
                        </p>
                        <p className="mt-3 mb-0">
                          Didn't receive it?{" "}
                          <button
                            className="link"
                            onClick={() => setLinkSent(false)}
                            disabled={linkCooldown !== null}
                          >
                            Request another link
                            {linkCooldown && ` (${linkCooldown})`}
                          </button>
                        </p>
                      </div>
                    )}

                    {/* (
											<form onSubmit={handleLogin}>
												<div className="mb-2">
													<input
														type="text"
														placeholder="Email"
														className={
															emailError !== "" ? `error w-100` : `w-100`
														}
														value={username}
														onChange={({ target }) =>
															usernameChange(target.value)
														}
													/>
													{emailError !== "" ? (
														<p className="small text-error-high mt-2">
															{emailError}
														</p>
													) : null}
												</div>
												<div className="mb-2">
													<input
														type="password"
														placeholder="Password"
														className={
															passwordError !== "" ? `error w-100` : `w-100`
														}
														value={password}
														onChange={({ target }) =>
															passwordChange(target.value)
														}
													/>
													{passwordError !== "" ? (
														<p className="small text-error-high mt-2">
															{passwordError}
														</p>
													) : null}
												</div>
												<p className="small mb-4">
													Forgot your password?{" "}
													<Link href="/users/reset">Reset your password</Link>
												</p>
												<button
													type="submit"
													className="btn primary high w-100"
													disabled={signingIn}
												>
													{signingIn ? "Signing in..." : "Sign in"}
												</button>
											</form>
										)} */}
                  </div>
                </div>
              ))}
            <div
              className={`w-100 d-flex flex-column align-items-center justify-content-between gap-4 pt-5 p-4 p-sm-5 bg-light-900`}
              // className={`radius-4 w-100 position-relative shine overflow-hidden ${styles.epicPoemCard} ${styles.epicPoemCardIliad}`}
            >
              <div
                className={`w-100 d-flex flex-column align-items-center justify-content-between gap-4 pt-3 pt-lg-5`}
              >
                <div
                  className={`${styles.epicPoemIllustration} ${styles.epicPoemIllustrationIliad} shine p-2 radius-2`}
                >
                  <img
                    style={{ width: "120px" }}
                    src="/images/book-patterns/iliad-square.svg"
                  />
                </div>
                <div className="d-flex flex-column align-items-center text-center">
                  <div>
                    <h3 className="mb-3">Iliad</h3>
                    <p>
                      Over 500 names from Homer's epic poem The Iliad, featuring
                      all factions of the mortal belligerents of the Trojan war,
                      and the Gods that quarrelled over them.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePurchaseClick}
                disabled={!loggedIn || openingCheckout}
                className={`btn dark high w-100 gap-3`}
              >
                {openingCheckout && (
                  <div className="ldsRipple">
                    <div></div>
                    <div></div>
                  </div>
                )}
                {!openingCheckout
                  ? "Go to checkout—$9"
                  : "Opening Stripe Checkout"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        show={showUpgradeSuccessModal}
        onHide={handleUpgradeSuccessClose}
        keyboard={false}
        size={"md"}
        centered
        backdrop="static"
      >
        <div className="position-relative bg-background">
          {/* <motion.div
            key="loaded-upgrade-close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            transition={{ duration: 0.8, delay: 5 }}
						className="d-flex flex-row align-items-center justify-content-start p-4 w-100"
						style={{ position: "absolute", top: 0, left: 0 }}
					>
						<button
							onClick={() => setShowUpgradeSuccessModal(false)}
							className="btn dark ultraLow icon-only"
						>
							<svg viewBox="0 0 24 24">
								<path d={ICONS.CLOSE}></path>
							</svg>
						</button>
					</motion.div> */}
          <div className="d-flex flex-column flex-lg-row">
            <div
              className={`w-100 d-flex flex-column align-items-center justify-content-between gap-4 pt-5 p-4 p-sm-5 bg-light-900`}
            >
              <div
                className={`w-100 d-flex flex-column align-items-center justify-content-between gap-4 pt-3 pt-lg-5`}
              >
                <div
                  className={`${styles.epicPoemIllustration} ${styles.epicPoemIllustrationIliadAnimate} position-relative shine p-2 radius-2`}
                >
                  <img
                    style={{ width: "120px" }}
                    className={`${styles.epicPoemIllustrationIliadColourPathAnimate}`}
                    src="/images/book-patterns/iliad-square.svg"
                  />
                  {/* <img
                    style={{ width: "120px", position: 'absolute', top: 8, left: 8}}
                    className={`${styles.epicPoemIllustrationIliadGreyPathAnimate}`}
                    src="/images/book-patterns/iliad-square-grey.svg"
                  /> */}
                </div>
                <div className="d-flex flex-column align-items-center text-center">
                  {/* <div className="tag dark medium mt-4 mb-4">
                    Name pack unlocked
                  </div> */}
                  <motion.h3
                    className="mb-3"
                    style={{ maxWidth: "320px" }}
                    key="loaded-upgrade-title"
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 2.5 }}
                  >
                    Iliad Name Pack Unlocked
                  </motion.h3>
                  <motion.p
                    key="loaded-upgrade-description"
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 4 }}
                    style={{ maxWidth: "320px" }}
                  >
                    All names from this pack will now appear in the name finder.
                  </motion.p>
                </div>
              </div>
              <div className="w-100 d-flex flex-column gap-3">
                <motion.a
                  key="loaded-upgrade-button"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 4 }}
                  href="/names"
                  disabled={!loggedIn || openingCheckout}
                  className={`btn dark high w-100 gap-3`}
                >
                  Browse names
                </motion.a>
                <motion.button
                  key="loaded-upgrade-button"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 4 }}
                  onClick={handleUpgradeSuccessClose}
                  disabled={!loggedIn || openingCheckout}
                  className={`btn primary ultraLow w-100 gap-3`}
                >
                  Back to store
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        show={openingCheckout}
        onHide={() => setOpeningCheckout(false)}
        keyboard={false}
        size={"sm"}
        centered
        // backdrop="static"
      >
        <div className="position-relative bg-background">
          {/* <div
						className="d-flex flex-row align-items-center justify-content-start p-4 w-100"
						style={{ position: "absolute", top: 0, left: 0 }}
					>
						<button
							onClick={() => setOpeningCheckout(false)}
							className="btn dark ultraLow icon-only"
						>
							<svg viewBox="0 0 24 24">
								<path d={ICONS.CLOSE}></path>
							</svg>
						</button>
					</div> */}
          <div className="d-flex flex-column flex-lg-row">
            <div
              className={`w-100 d-flex flex-column align-items-center justify-content-between gap-4 p-4 bg-light-900`}
            >
              <div
                className={`w-100 d-flex flex-column align-items-center justify-content-between gap-4 pt-3`}
              >
                <div className="ldsRippleLarge">
                  <div></div>
                  <div></div>
                </div>
                <div className="d-flex flex-column align-items-center text-center">
                  {/* <div className="tag dark medium mt-4 mb-4">
                    Name pack unlocked
                  </div> */}
                  <h3 className="mb-3" style={{ maxWidth: "320px" }}>
                    Launching checkout
                  </h3>
                  <p style={{ maxWidth: "320px" }}>
                    You're being redirected to a Stripe checkout to securely
                    complete your purchase.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpeningCheckout(false)}
                className={`btn primary medium small gap-3`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Add this to make the layout persistent
Store.getLayout = function getLayout(page) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Store;
