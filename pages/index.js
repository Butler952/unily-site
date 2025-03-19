import { useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "./_app";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/header/Header";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "config/mixpanel-config";
import { Accordion, Container } from "react-bootstrap";
import { useRouter } from 'next/router';

import styles from "./index.module.scss";
import ICONS from "../components/icon/IconPaths";
import Footer from "../components/footer/Footer";
import Icon from "components/icon/Icon";
import IllustrationIliad from "components/index/IllustrationIliad";
import IllustrationOdyssey from "components/index/IllustrationOdyssey";

const Home = (props) => {
  const ref = useRef(null);
  const heroRef = useRef(null);
  const iliadCardRef = useRef(null);
  const { userContext, setUserContext } = useContext(UserContext);
  const router = useRouter();

  const [screenWidth, setScreenWidth] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [iliadCardVisible, setIliadCardVisible] = useState(false);
  const [iliadIntersectionScrollY, setIliadIntersectionScrollY] =
    useState(null);
  const [odysseyCardVisible, setOdysseyCardVisible] = useState(false);
  const [odysseyIntersectionScrollY, setOdysseyIntersectionScrollY] =
    useState(null);

  const [heroHeight, setHeroHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const [loggedIn, setLoggedIn] = useState(false);

  const [iliadCardHovered, setIliadCardHovered] = useState(false);
  const [odysseyCardHovered, setOdysseyCardHovered] = useState(false);
  
  // Replace single book state with separate states for each book
  const [isIliadActive, setIsIliadActive] = useState(false);
  const [isOdysseyActive, setIsOdysseyActive] = useState(false);
  const [isIliadOverflowHidden, setIsIliadOverflowHidden] = useState(false);
  const [isOdysseyOverflowHidden, setIsOdysseyOverflowHidden] = useState(false);

  const [viewportHeight, setViewportHeight] = useState(0);

  const [iliadZIndex, setIliadZIndex] = useState(1);
  const [odysseyZIndex, setOdysseyZIndex] = useState(1);

  const [iliadZIndexDelay, setIliadZIndexDelay] = useState(false);
  const [odysseyZIndexDelay, setOdysseyZIndexDelay] = useState(false);

  useEffect(() => {
    mixpanel.init(mixpanelConfig);
    mixpanel.track("Landing page");
    setScreenWidth(window.innerWidth);
    setViewportHeight(window.innerHeight);
    if (ref?.current?.clientHeight) {
      setFooterHeight(ref.current.clientHeight);
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Set up intersection observer for iliad card
    const iliadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When element first becomes visible, store the current scroll position
          if (entry.isIntersecting && iliadIntersectionScrollY === null) {
            setIliadIntersectionScrollY(window.scrollY);
          } else if (!entry.isIntersecting) {
            // Reset when element is no longer visible
            setIliadIntersectionScrollY(null);
            setIliadCardVisible(false);
          }
        });
      },
      { threshold: screenWidth <= 767 ? 0.4 : 0.5 } // Trigger when 40% of the element is visible on small screens
    );

    // Set up intersection observer for odyssey card
    const odysseyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When element first becomes visible, store the current scroll position
          if (entry.isIntersecting && odysseyIntersectionScrollY === null) {
            setOdysseyIntersectionScrollY(window.scrollY);
          } else if (!entry.isIntersecting) {
            // Reset when element is no longer visible
            setOdysseyIntersectionScrollY(null);
            setOdysseyCardVisible(false);
          }
        });
      },
      { threshold: screenWidth <= 767 ? 0.4 : 0.5 } // Trigger when 40% of the element is visible on small screens
    );

    if (iliadCardRef.current) {
      iliadObserver.observe(iliadCardRef.current);
    }

    const odysseyCardRef = document.querySelector(
      `.${styles.epicPoemCardOdyssey}`
    );
    if (odysseyCardRef) {
      odysseyObserver.observe(odysseyCardRef);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);

      // Clean up the observers
      if (iliadCardRef.current) {
        iliadObserver.unobserve(iliadCardRef.current);
      }
      if (odysseyCardRef) {
        odysseyObserver.unobserve(odysseyCardRef);
      }
    };
  }, []);

  // Add a new useEffect to handle the delayed highlight based on scroll position
  useEffect(() => {
    if (
      iliadIntersectionScrollY !== null &&
      scrollPosition >= iliadIntersectionScrollY + 10
    ) {
      setIliadCardVisible(true);
    }
    if (
      odysseyIntersectionScrollY !== null &&
      scrollPosition >= odysseyIntersectionScrollY + 10
    ) {
      setOdysseyCardVisible(true);
    }
  }, [scrollPosition, iliadIntersectionScrollY, odysseyIntersectionScrollY]);

  // Add a useEffect to scroll to top when either book is active
  useEffect(() => {
    if (isIliadActive || isOdysseyActive) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [isIliadActive, isOdysseyActive]);

  // Add a useEffect to control body overflow when either book is active
  useEffect(() => {
    if (isIliadActive || isOdysseyActive) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isIliadActive, isOdysseyActive]);

  useEffect(() => {
    const timerIliad = setTimeout(() => {
      setIsIliadOverflowHidden(isIliadActive);
    }, 1000); // 1000ms to match height transition duration

    const timerOdyssey = setTimeout(() => {
      setIsOdysseyOverflowHidden(isOdysseyActive);
    }, 1000);

    return () => {
      clearTimeout(timerIliad);
      clearTimeout(timerOdyssey);
    };
  }, [isIliadActive, isOdysseyActive]);

  // Add a useEffect that measures after content is fully loaded
  useEffect(() => {
    // Initial measurement
    if (heroRef?.current?.clientHeight) {
      setHeroHeight(heroRef.current.clientHeight);
    }

    // Measure again after window fully loads
    window.addEventListener("load", () => {
      if (heroRef?.current?.clientHeight) {
        setHeroHeight(heroRef.current.clientHeight);
      }
    });

    // Additional measurement after a delay to catch any late rendering
    const timer = setTimeout(() => {
      if (heroRef?.current?.clientHeight) {
        setHeroHeight(heroRef.current.clientHeight);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Add this useEffect to handle the delayed z-index change
  useEffect(() => {
    let timer;
    if (!isIliadActive && !iliadCardHovered) {
      // When no longer active/hovered, set delay flag
      setIliadZIndexDelay(true);
      // After 1 second, clear the delay flag
      timer = setTimeout(() => {
        setIliadZIndexDelay(false);
      }, 250);
    } else {
      // Immediately clear delay flag when active/hovered
      setIliadZIndexDelay(false);
    }
    
    return () => clearTimeout(timer);
  }, [isIliadActive, iliadCardHovered]);

  // Add this useEffect for Odyssey z-index delay management
  useEffect(() => {
    let timer;
    if (!isOdysseyActive && !odysseyCardHovered) {
      // When no longer active/hovered, set delay flag
      setOdysseyZIndexDelay(true);
      // After 1 second, clear the delay flag
      timer = setTimeout(() => {
        setOdysseyZIndexDelay(false);
      }, 250);
    } else {
      // Immediately clear delay flag when active/hovered
      setOdysseyZIndexDelay(false);
    }
    
    return () => clearTimeout(timer);
  }, [isOdysseyActive, odysseyCardHovered]);

  // Check for path in URL during component initialization
  useEffect(() => {
    // If URL is /new or has specific query parameters
    if (router.pathname === '/iliad' || router.query.view === 'iliad') {
      // Set your desired state here
      setIsIliadActive(true);
      // Or any other state changes you want for this URL
    }
    
    // You can handle other paths similarly
    if (router.pathname === '/odyssey') {
      setIsOdysseyActive(true);
    }
  }, [router.pathname, router.query]);

  // Function to navigate and change state
  const navigateToView = (view) => {
    // If the view is already active, toggle it off and return to home
    if ((view === 'iliad' && isIliadActive) || (view === 'odyssey' && isOdysseyActive)) {
      router.push('/', undefined, { shallow: true });
      
      // Reset both states to inactive
      setIsIliadActive(false);
      setIsOdysseyActive(false);
    } else {
      // Otherwise, activate the selected view
      router.push(`/${view}`, undefined, { shallow: true });
      
      // Update your state accordingly
      if (view === 'iliad') {
        setIsIliadActive(true);
        setIsOdysseyActive(false);
      } else if (view === 'odyssey') {
        setIsOdysseyActive(true);
        setIsIliadActive(false);
      }
    }
  };

  const isProfileComplete = (user) => {
    var docRef = fire.firestore().collection("users").doc(user.uid);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUserContext(doc.data());

          if (doc.data().stage !== "complete") {
            router.push(doc.data().stage);
          } else {
            setProfileUrl(doc.data().profileUrl);
            setCustomDomain(doc.data().domain?.name);
          }
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
    setViewportHeight(window.innerHeight);
    if (ref?.current?.clientHeight) {
      setFooterHeight(ref.current.clientHeight);
    }
  };

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      setScrollPosition(window.scrollY);
    }
  };

  const CustomToggle = ({ question, eventKey }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setDropdownOpen(!dropdownOpen);
    });

    return (
      <div
        type="button"
        onClick={decoratedOnClick}
        className="d-flex flex-row align-items-center justify-content-between w-100"
        style={{ border: "none", background: "none" }}
      >
        <p className="text-light-high mb-0 extra-large text-dark-high font-weight-high w-100">
          {question}
        </p>
        <button className="btn light low small icon-only">
          <svg viewBox="0 0 24 24">
            <path
              d={dropdownOpen ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN}
            ></path>
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div
      className="transition-long"
      style={{
        height: (isIliadActive || isOdysseyActive) ? "100vh" : "auto",
        overflow: (isIliadOverflowHidden || isOdysseyOverflowHidden) && "hidden",
      }}
    >
      <Head>
        <title>Epic Baby Names | Certified epic names for your kid</title>
        <meta
          name="description"
          content="With hundreds of names from Homer's epic poems, you'll never have to call your kid Michael or Samantha ever again."
        />
        <meta
          property="og:title"
          content="Epic Baby Names | Certified epic names for your kid"
        />
        <meta
          property="og:description"
          content="With hundreds of names from Homer's epic poems, you'll never have to call your kid Michael or Samantha ever again."
        />
        <meta property="og:url" content="https://www.epicbabynames.com/" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me" /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://www.epicbabynames.com/images/twitter-summary-large-image.jpeg"
        />
        <meta
          property="og:image"
          content="https://www.epicbabynames.com/images/twitter-summary-large-image.jpeg"
        />
      </Head>
      <Header hideShadow topOfLanding />
      <div
        className={`${styles.fixedHeader} ${
          scrollPosition > heroHeight + 66 && styles.fixedHeaderScrolled
        }`}
      >
        <Header hideShadow={scrollPosition < heroHeight + 66} />
      </div>
      {/* <div className="bg-light-900" style={{paddingTop: 80, marginBottom: footerHeight, zIndex: '2', position: 'relative'}}>
        <div className="container py-5">
          <div>
            <div className="my-4 my-sm-5">
              {screenWidth > 767 ?
                <h1 className="mx-auto mb-2 mb-sm-3">{screenWidth}</h1>
                :
                <h2 className="mx-auto mb-2 mb-sm-3">{screenWidth}</h2>
              }
            </div>
          </div>
        </div>
      </div> */}
      <div
        className="bg-background border-top-0 border-left-0 border-right-0 border-bottom-1 border-solid border-dark-300"
        style={{
          marginBottom: footerHeight,
          zIndex: "2",
          position: "relative",
          marginTop: "-64px",
          paddingTop: "64px",
        }}
      >
        {/* <div className="container d-flex flex-column align-items-start justify-content-start pt-5 my-5">
					<div

						className="d-flex flex-column align-items-start justify-content-start"
						style={{ maxWidth: "960px" }}
					> */}

        <div
          className="container transition-long d-flex flex-column align-items-center justify-content-center"
          style={{
            opacity: (isIliadActive || isOdysseyActive) ? 0 : 1,
            marginTop: (isIliadActive || isOdysseyActive) ? `-${Number(heroHeight) + 64}px` : "64px",
          }}
        >
          <div
            ref={heroRef}
            className="d-flex flex-column align-items-center justify-content-center w-100 gap-5 transition-long"
            style={{ maxWidth: "800px" }}
          >
            <div className="d-flex flex-column align-items-center ">
              <div className="d-flex flex-row align-items-center justify-content-center mb-4 gap-2">
                {/* <p className="text-dark-med mb-0">Over 1000+ epic names</p> */}
              </div>
              <h1
                className={`text-center ${
                  screenWidth > 991
                    && "display2"
                }`}
              >
                Certified️ epic names* for your kid
              </h1>
              <p
                className="text-center text-dark-low large mb-5"
                style={{ maxWidth: "640px" }}
              >
                With hundreds of names from Homer's epic poems, you'll never
                have to call your kid Michael or Samantha ever again.
              </p>
              <div className="d-flex justify-content-center">
                <div className="d-flex justify-content-center gap-3">
                  <Link href="/names" className="btn dark high">
                    Find an epic name
                  </Link>
                </div>
              </div>
              {/* <div className="d-flex justify-content-center">
								<div className="d-flex justify-content-center gap-3">
									<Link
										href="/names?gender=male"
										className="btn primary high icon-left"
									>
										<svg viewBox="0 0 24 24">
											<path d={ICONS.MALE}></path>
										</svg>
										Boys names
									</Link>
									<Link
										href="/names?gender=female"
										className="btn primary high icon-left"
									>
										<svg viewBox="0 0 24 24">
											<path d={ICONS.FEMALE}></path>
										</svg>
										Girls names
									</Link>
								</div>
							</div> */}

              <div className="d-flex flex-column align-items-center gap-2 mt-4">
                {/* <div className="flex-row align-items-center">
									<Icon
										icon={ICONS.STAR}
										size="24"
										className="fill-warning-900"
									/>
									<Icon
										icon={ICONS.STAR}
										size="24"
										className="fill-warning-900"
									/>
									<Icon
										icon={ICONS.STAR}
										size="24"
										className="fill-warning-900"
									/>
									<Icon
										icon={ICONS.STAR}
										size="24"
										className="fill-warning-900"
									/>
									<Icon
										icon={ICONS.STAR}
										size="24"
										className="fill-warning-900"
									/>
								</div> */}
                <p className="text-dark-dis">*Certified by Homer</p>
              </div>
            </div>
            {/* <div className={styles.iframeWrapper}>
              <iframe className={styles.iframeContent}
                title="Example vitaely.me online CV profile"
                src="https://www.vitaely.me/aaronbutler">
              </iframe>
            </div> */}
          </div>
        </div>
        {/* <div 
          className={` ${styles.gradientSection}`} 
          style={{ overflow: 'visible', position: 'absolute', width: '100%', height: '600px', top: '-120px', left: 0, rotate: '180deg', opacity: 0.4, zIndex: -1}}
        >
        </div> */}
        {/* <div
					className={`d-flex flex-column text-center align-items-center border-solid border-0 border-bottom-1 border-dark-300 ${styles.gradientSection}`}
					style={{ overflow: "visible" }}
				>
					<div className="container">
						<div className="mx-auto" style={{ maxWidth: "960px" }}>
							<div className="mx-5 mx-sm-0">
								<div className="d-block position-relative">
									<div className="d-flex flex-column gap-3">
										<div
											className="d-block position-relative px-3 pt-3 border-0 border-left-1 border-top-1 border-right-1 border-solid border-dark-200 bg-primary-200"
											style={{
												borderRadius: "32px 32px 0 0",
												backdropFilter: "blur(20px)",
											}}
										>
											<div
												className={`d-block position-relative overflow-hidden border-0 border-left-1 border-top-1 border-right-1 border-solid border-dark-200 ${
													screenWidth > 576
														? styles.sectionImage
														: styles.sectionImageMobile
												}`}
												style={{
													backgroundImage:
														screenWidth > 576
															? `url(/images/profile-preview.jpeg)`
															: `url(/images/profile-preview-mobile.jpeg)`,
													boxShadow: "none",
													borderRadius: "16px 16px 0 0",
												}}
											></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div> */}
        <div
          className="d-flex flex-column align-items-center justify-content-center border-0 border-bottom-1 border-solid border-dark-300 overflow-hidden transition-long"
          style={{ height: (isIliadActive || isOdysseyActive) ? `${viewportHeight}px` : (screenWidth <= 767 ? "1000px" : "440px") }}
        >
          <div
            className={`container d-flex flex-column align-items-center justify-content-center transition-long`}
            style={{
              // height: isBookActive ? "100%" : "auto",
              paddingTop: (isIliadActive || isOdysseyActive) ? "0" : "160px",
              paddingBottom: (isIliadActive || isOdysseyActive) ? "0" : "0",
            }}
          >
            <div
              className="d-flex flex-column align-items-center justify-content-center w-100 gap-5"
              style={{ maxWidth: "960px" }}
            >
              {/* <h2 className="text-center" style={{ maxWidth: "480px" }}>
                Over 1,000 names from two epic poems
              </h2> */}

              <div className="w-100 align-items-center justify-content-center d-flex flex-column flex-md-row gap-5">
                <div style={{ 
                  perspective: "1200px", 
                  width: screenWidth <= 767 ? '300px' : (isOdysseyActive ? '0px' : '300px'),
                  height: screenWidth <= 767 ? (isOdysseyActive ? '0px' : '450px') : '450px',
                  transition: screenWidth <= 767 
                    ? "height 1s ease, padding-top 1s ease" 
                    : "width 1s ease, padding-top 1s ease",
                  paddingTop: isIliadActive ? '150px' : '0px',
                  zIndex: isIliadActive || iliadCardHovered || iliadZIndexDelay ? 1 : 0
                }}>
                  <div
                    className={`
                      ${styles.book} 
                      ${ isIliadActive ? styles.active : ""}
                      ${ isOdysseyActive ? styles.inactive : ""}
                    `}
                    onClick={() => {
                      navigateToView('iliad');
                    }}
                    onMouseEnter={() => setIliadCardHovered(true)}
                    onMouseLeave={() => setIliadCardHovered(false)}
                  >
                    <div className={`${styles.back} ${styles.iliad}`}></div>
                    <div
                      className={`${styles.page6}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{ rotate: "90deg", transform: "scale(-1, -1)" }}
                      >
                        <p className="mb-0">Hero of Athens, 1.265</p>
                      </div>
                    </div>
                    <div
                      className={`${styles.page5}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{ rotate: "90deg", transform: "scale(-1, 1)" }}
                      >
                        <h3 className="mb-0">Theseus</h3>
                      </div>
                    </div>
                    <div className={`${styles.page4}`}></div>
                    <div className={`${styles.page3}`}></div>
                    <div className={`${styles.page2}`}></div>
                    <div className={`${styles.page1}`}></div>
                    <div className={`${styles.front} ${styles.iliad} shine`}>
                      <div
                        className="position-absolute"
                        style={{
                          top: "8%",
                          left: "16%",
                          right: 0,
                          bottom: 0,
                          zIndex: 1,
                        }}
                      >
                        <h5 className="mb-0">Iliad</h5>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          left: "-12.5%",
                          top: "0",
                          width: "125%",
                        }}
                      >
                        <IllustrationIliad width="100%" height="100%" />
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ 
                  perspective: "1200px",
                  width: screenWidth <= 767 ? '300px' : (isIliadActive ? '0px' : '300px'),
                  height: screenWidth <= 767 ? (isIliadActive ? '0px' : '450px') : '450px',
                  transition: screenWidth <= 767 
                    ? "height 1s ease, padding-top 1s ease" 
                    : "width 1s ease, padding-top 1s ease",
                  paddingTop: isOdysseyActive ? '150px' : '0px',
                  zIndex: isOdysseyActive || odysseyCardHovered || odysseyZIndexDelay ? 1 : 0
                }}>
                  <div
                    className={`
                      ${styles.book} 
                      ${ isOdysseyActive ? styles.active : ""}
                      ${ isIliadActive ? styles.inactive : ""}
                    `}
                    onClick={() => {
                      setIsOdysseyActive(!isOdysseyActive);
                      // Close the other book if it's open
                      if (isIliadActive) setIsIliadActive(false);
                    }}
                  >
                    <div className={`${styles.back} ${styles.odyssey}`}></div>
                    <div
                      className={`${styles.page6}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{ rotate: "90deg", transform: "scale(-1, -1)" }}
                      >
                        <p className="mb-0">Hero of Athens, 1.265</p>
                      </div>
                    </div>
                    <div
                      className={`${styles.page5}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{ rotate: "90deg", transform: "scale(-1, 1)" }}
                      >
                        <h3 className="mb-0">Theseus</h3>
                      </div>
                    </div>
                    <div className={`${styles.page4}`}></div>
                    <div className={`${styles.page3}`}></div>
                    <div className={`${styles.page2}`}></div>
                    <div className={`${styles.page1}`}></div>
                    <div className={`${styles.front} ${styles.odyssey} shine`}>
                      <div
                        className="position-absolute"
                        style={{
                          top: "8%",
                          left: "16%",
                          right: 0,
                          bottom: 0,
                          zIndex: 1,
                        }}
                      >
                        <h5 className="mb-0">Odyssey</h5>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          left: "-3%",
                          top: "-1%",
                          width: "205%",
                        }}
                      >
                        <IllustrationOdyssey width="100%" height="100%" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="d-flex flex-column flex-md-row gap-3 w-100">
              <div className="position-relative w-100" style={{paddingBottom: '133.33%'}}>
                <div className="bg-dark-300 radius-4 p-5 position-absolute" style={{top: 0, left: 0, right: 0, bottom: 0}}>
                  <h2 className="mb-0">Iliad</h2>
                </div>
              </div>
              <div className="position-relative w-100" style={{paddingBottom: '133.33%'}}>
                <div className="bg-dark-300 radius-4 p-5 position-absolute" style={{top: 0, left: 0, right: 0, bottom: 0}}>
                  <h2 className="mb-0">Iliad</h2>
                </div>
              </div>
            </div> */}
            </div>
          </div>
        </div>
        {/* <div
          className="border-0 border-bottom-1 border-solid border-dark-300 overflow-hidden"
          style={{
            paddingTop: "64px",
            opacity: (isIliadActive || isOdysseyActive) ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            className="container d-flex flex-column align-items-center justify-content-center"
            style={{ paddingTop: "64px", paddingBottom: "120px" }}
          >
            <div
              className="d-flex flex-column align-items-center justify-content-center w-100 gap-5"
              style={{ maxWidth: "960px" }}
            >

              <div
                className="w-100 d-flex flex-column flex-md-row gap-4"
                style={{
                  marginBottom: screenWidth > 767 ? "-180px" : "-75%",
                }}
              >
                <div
                  ref={(el) => {
                    // Store reference to iliad card for intersection observer
                    if (el && !iliadCardRef.current) {
                      iliadCardRef.current = el;
                    }
                  }}
                  className={`position-relative shine overflow-hidden ${
                    styles.epicPoemCard
                  } ${styles.epicPoemCardIliad} ${
                    (iliadCardVisible && !odysseyCardHovered) ||
                    iliadCardHovered
                      ? `${styles.highlight}`
                      : ""
                  }`}
                  style={{
                    paddingBottom: screenWidth > 767 ? "66.66%" : "133.33%",
                    marginBottom: screenWidth > 767 ? "0" : "-115%",
                  }}
                  onMouseEnter={() => setIliadCardHovered(true)}
                  onMouseLeave={() => setIliadCardHovered(false)}
                >
                  <div
                    className="position-absolute p-5"
                    style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}
                  >
                    <h3 className="mb-0">Iliad</h3>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "00",
                      width: "110%",
                    }}
                  >
                    <IllustrationIliad width="100%" height="100%" />
                  </div>
                </div>
                <div
                  className={`position-relative shine overflow-hidden ${
                    styles.epicPoemCard
                  } ${styles.epicPoemCardOdyssey} ${
                    (odysseyCardVisible && !iliadCardHovered) ||
                    odysseyCardHovered
                      ? `${styles.highlight}`
                      : ""
                  }`}
                  style={{
                    paddingBottom: screenWidth > 767 ? "66.66%" : "133.33%",
                  }}
                  onMouseEnter={() => setOdysseyCardHovered(true)}
                  onMouseLeave={() => setOdysseyCardHovered(false)}
                >
                  <div
                    className="position-absolute p-5"
                    style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}
                  >
                    <h3 className="mb-1">Odyssey</h3>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: "-3%",
                      top: "-1%",
                      width: "205%",
                    }}
                  >
                    <IllustrationOdyssey width="100%" height="100%" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="container">
          <div className="mx-auto" style={{maxWidth: '960px'}}>
            <div className="d-flex flex-column align-items-start" style={{ paddingTop: '160px', paddingBottom: '160px' }}>
              <h2 className="text-light-high mb-5 pb-3" style={{ maxWidth: '560px' }}>Show the world what you have to offer</h2>
              <div className={`${styles.layoutGrid}`}>
                <p className="text-light-low large mb-0">Vitaely allows you to build a website to learn more about you and your products and services, without the need to know how to code or any technical skills.</p>
                <p className="text-light-low large mb-0">Setting up your personal site is easy and only takes two minutes, you can even use information from your LinkedIn profile to get you started.</p>
              </div>
              {userContext?.stage !== "complete" ?
                <Link href="/users/register" className="btn primary high mt-5">Create my page</Link>
                :
                <Link href="/profile" className="btn primary high mt-5">Go to my profile</Link>
              }
            </div>
          </div>
        </div> */}
        {/* <div className="d-block position-relative w-100 p-0">
          <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage}`} style={{ backgroundImage: `url(../../images/landing-page/thisisengineering-raeng-TXxiFuQLBKQ-unsplash.jpg)`, borderRadius: 0, boxShadow: 'none' }}>
            <a href="https://unsplash.com/@thisisengineering" target="_blank" className={`${styles.sectionImageTag}`} style={{bottom: 16, left: 16, zIndex: 1}}>
              <div className="tag small light high icon-left">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PHOTO}></path>
                </svg>
                ThisisEngineering RAEng
              </div>
            </a>
          </div>
        </div> */}
        <div
          className="container"
          style={{
            opacity: (isIliadActive || isOdysseyActive) ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: "960px" }}>
            {/* <div className="d-flex flex-column align-items-start" style={{ paddingTop: '160px', paddingBottom: '160px' }}>
              <h2 className="text-light-high mb-5 pb-3" style={{ maxWidth: '560px' }}>Build trust with potential clients</h2>
              <div className={`${styles.layoutGrid}`}>
                <p className="text-light-low large mb-0">Your customers are your best proof of the quality of service that you deliver. With Vitaely you can add customer testimonials to help build trust with potential clients and land more sales. </p>
                <p className="text-light-low large mb-0">Written excellent content that you think potential clients would love to read? You can feature your best content on your Vitaely site and and add links for readers to explore the full thing. </p>
              </div>
              {userContext?.stage !== "complete" ?
                <Link href="/users/register" className="btn primary high mt-5">Create my page</Link>
                :
                <Link href="/profile" className="btn primary high mt-5">Go to my profile</Link>
              }
              <div className="d-none d-lg-block mb-4 w-100 mt-5 pt-5">
                <div className="d-block position-relative w-100">
                  <div className="d-flex flex-column flex-lg-row w-100 gap-3">
                    <div className="d-block position-relative col-12 col-lg-3 p-0">
                      <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage} ${styles.sectionImageVerticle}`} style={{ backgroundImage: `url(../../images/landing-page/good-faces-BWMxkGvbd_Y-unsplash.jpg)` }}>
                        <a href="https://unsplash.com/@goodfacesagency" target="_blank" className={`${styles.sectionImageTag}`} style={{ bottom: 20, left: 20, zIndex: 1 }}>
                          <div className="tag small light high icon-left">
                            <svg viewBox="0 0 24 24">
                              <path d={ICONS.PHOTO}></path>
                            </svg>
                            Good Faces
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="d-block position-relative w-100 p-0">
                      <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage} ${styles.sectionImageVerticle}`} style={{ backgroundImage: `url(../../images/landing-page/good-faces-J1r-0xdoEZY-unsplash.jpg)` }}>
                        <a href="https://unsplash.com/@goodfacesagency" target="_blank" className={`${styles.sectionImageTag}`} style={{ bottom: 20, left: 20, zIndex: 1 }}>
                          <div className="tag small light high icon-left">
                            <svg viewBox="0 0 24 24">
                              <path d={ICONS.PHOTO}></path>
                            </svg>
                            Good Faces
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="d-flex flex-column col-12 col-lg-3 p-0 gap-4" style={{ marginTop: '-64px' }} >
                      <div className={`d-block w-100 position-relative overflow-hidden ${styles.sectionImage} ${styles.sectionImageVerticle}`} style={{ backgroundImage: `url(../../images/landing-page/good-faces-knoww5xIlWc-unsplash.jpg)` }}>
                        <a href="https://unsplash.com/@goodfacesagency" target="_blank" className={`${styles.sectionImageTag}`} style={{ bottom: 20, left: 20, zIndex: 1 }}>
                          <div className="tag small light high icon-left">
                            <svg viewBox="0 0 24 24">
                              <path d={ICONS.PHOTO}></path>
                            </svg>
                            Good Faces
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div
              className={`d-flex flex-column mx-auto gap-4`}
              style={{
                maxWidth: "560px",
                paddingTop: "160px",
                paddingBottom: "160px",
              }}
            >
              <h2 className="text-center">
                Are you looking for a name for a boy or a girl?
              </h2>
              <div className="d-flex justify-content-center">
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <Link
                    href="/names?gender=male"
                    className="btn primary high icon-left"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d={ICONS.MALE}></path>
                    </svg>
                    Boys names
                  </Link>
                  <Link
                    href="/names?gender=female"
                    className="btn primary high icon-left"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d={ICONS.FEMALE}></path>
                    </svg>
                    Girls names
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="bg-dark-900">
          <div className="bg-light-100">
            <div className={`container ${styles.sectionWrapper} d-flex flex-column align-items-start align-items-md-center justify-content-between gap-3 gap-lg-5`}>
              <h2 className="text-left text-md-center mb-5 text-light-high" style={{ maxWidth: '560px' }}>Got a question?</h2>
              <Accordion defaultActiveKey="0" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={`d-flex flex-column gap-4 w-100 ${styles.accordionWrapper}`}>
                  <div className="d-flex flex-column">
                    <CustomToggle eventKey="0" question="How much does it cost?" />
                    <Accordion.Collapse eventKey="0">
                      <p className="text-light-low mt-3 mb-0 large">It's free to create your Vitaely site! Upgrade to our premium plan to connect your page to your own domain.</p>
                    </Accordion.Collapse>
                    <hr className="bg-light-300 mb-0 w-100"></hr>
                  </div>
                  <div className="d-flex flex-column">
                    <CustomToggle eventKey="1" question="Who is this for?" />
                    <Accordion.Collapse eventKey="1">
                      <p className="text-light-low mt-3 mb-0 large">Freelancers, consultants, small business owners, or anyone who wants to build a website to show off their products, services and customer testimonials but doesn't have the time or technical skills to build it on their own.</p>
                    </Accordion.Collapse>
                    <hr className="bg-light-300 mb-0 w-100"></hr>
                  </div>
                  <div className="d-flex flex-column">
                    <CustomToggle eventKey="2" question="What makes this different?" />
                    <Accordion.Collapse eventKey="2">
                      <>
                        <p className="text-light-low mt-3 large">Your Vitaely site is optimised to promote you and your services, and make it easy for potential clients and customers to take the next step. Save time on wondering how you should style your page and make use of our template designed just for freelancers, consultants and small business owners.</p>
                        <p className="text-light-low mb-0 large">You can create your site in under two minutes, making this the fastest way to get your page up and running.</p>
                      </>
                    </Accordion.Collapse>
                    <hr className="bg-light-300 mb-0 w-100"></hr>
                  </div>
                  <div className="d-flex flex-column">
                    <CustomToggle eventKey="3" question="Why not use Wix or Squarespace?" />
                    <Accordion.Collapse eventKey="3">
                      <p className="text-light-low mt-3 mb-0 large">We are only focused on helping you build your Personal Branding website. Meaning that the experience and speed are optimized for that purpose. If you want to ecommerce this won't be the right tool for you, but if you want to build your own personal website, this will be the fastest website you have ever built.</p>
                    </Accordion.Collapse>
                  </div>
                </div>
              </Accordion>
            </div>
          </div>
        </div> */}
      </div>
      <div
        ref={ref}
        className="w-100"
        style={{
          zIndex: "1",
          position: "fixed",
          bottom: 0,
          opacity: (isIliadActive || isOdysseyActive) ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Home;
