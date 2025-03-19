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
import BookDisplay from "../components/books/BookDisplay";

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
    // Check if router is ready to avoid issues during initial load
    if (!router.isReady) return;
    
    // If URL is /iliad or has specific query parameters
    if (router.pathname === '/iliad' || router.asPath === '/iliad' || router.query.view === 'iliad') {
      setIsIliadActive(true);
      setIsOdysseyActive(false);
    }
    
    // You can handle other paths similarly
    if (router.pathname === '/odyssey' || router.asPath === '/odyssey' || router.query.view === 'odyssey') {
      setIsOdysseyActive(true);
      setIsIliadActive(false);
    }
  }, [router.isReady, router.pathname, router.asPath, router.query]);

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
                  <button onClick={() => navigateToView('iliad')} className="btn dark high">
                    Find an epic name
                  </button>
                </div>
              </div>

              <div className="d-flex flex-column align-items-center gap-2 mt-4">
                <p className="text-dark-dis">*Certified by Homer</p>
              </div>
            </div>
          </div>
        </div>
        
        <BookDisplay 
          isIliadActive={isIliadActive}
          isOdysseyActive={isOdysseyActive}
          navigateToView={navigateToView}
          viewportHeight={viewportHeight}
          screenWidth={screenWidth}
        />
        
        <div
          className="container"
          style={{
            opacity: (isIliadActive || isOdysseyActive) ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: "960px" }}>
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
