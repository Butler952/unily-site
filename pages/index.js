import { useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "./_app";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/header/Header";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "config/mixpanel-config";
import { Accordion, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useRouter } from "next/router";
import fire from "../config/fire-config";
import malePreviewIds from "./names/malePreviewIds.json";
import femalePreviewIds from "./names/femalePreviewIds.json";
import names from "./names/iliad/namesWithIds.json";

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
  const [actionButtonsVisible, setActionButtonsVisible] = useState(false);

  const [viewportHeight, setViewportHeight] = useState(0);

  const [iliadZIndex, setIliadZIndex] = useState(1);
  const [odysseyZIndex, setOdysseyZIndex] = useState(1);

  const [iliadZIndexDelay, setIliadZIndexDelay] = useState(false);
  const [odysseyZIndexDelay, setOdysseyZIndexDelay] = useState(false);

  // Add name browsing states from names/index.js
  const [retreivingName, setRetreivingName] = useState(false);
  const [retreivedName, setRetreivedName] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [lastRandomDocumentId, setLastRandomDocumentId] = useState(null);
  const [previousDocumentId, setPreviousDocumentId] = useState(null);
  const [actionTaken, setActionTaken] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [slideDirection, setSlideDirection] = useState("center");
  const [gender, setGender] = useState("male");

  const [hasReachedFreeLimit, setHasReachedFreeLimit] = useState(false);
  const [userHasProduct, setUserHasProduct] = useState(false);

  useEffect(() => {
    mixpanel.init(mixpanelConfig);
    mixpanel.track("Landing page");
    setScreenWidth(window.innerWidth);
    setViewportHeight(window.innerHeight);
    if (ref?.current?.clientHeight) {
      setFooterHeight(ref.current.clientHeight);
    }

    // Check for gender preference from URL or localStorage
    const { gender: genderQuery } = router.query;
    if (genderQuery === "male" || genderQuery === "female") {
      setGender(genderQuery);
    } else {
      // Check localStorage for gender preference if not in URL
      const storedGender = localStorage.getItem("preferredGender");
      if (storedGender === "male" || storedGender === "female") {
        setGender(storedGender);
      }
      // Otherwise default to 'male' which is already set in useState
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

    // If user has reached free limit and doesn't have premium, prevent activation
    if (hasReachedFreeLimit && !userHasProduct) {
      return;
    }

    // Check for gender parameter in URL and set it if present
    if (router.query.gender === "male" || router.query.gender === "female") {
      setGender(router.query.gender);
      localStorage.setItem("preferredGender", router.query.gender);
    }

    // If URL is /iliad or has specific query parameters
    if (
      router.pathname === "/iliad" ||
      router.asPath.startsWith("/iliad") ||
      router.query.view === "iliad"
    ) {
      setIsIliadActive(true);
      setIsOdysseyActive(false);
    }

    // You can handle other paths similarly
    if (
      router.pathname === "/odyssey" ||
      router.asPath.startsWith("/odyssey") ||
      router.query.view === "odyssey"
    ) {
      setIsOdysseyActive(true);
      setIsIliadActive(false);
    }
  }, [router.isReady, router.pathname, router.asPath, router.query, hasReachedFreeLimit, userHasProduct]);

  // Function to navigate and change state
  const navigateToView = (view, genderParam) => {
    // If user has reached free limit and doesn't have premium, prevent activation
    if (hasReachedFreeLimit && !userHasProduct) {
      // Reset both states to inactive
      setIsIliadActive(false);
      setIsOdysseyActive(false);
      return; // Exit early
    }

    // If the view is already active, toggle it off and return to home
    if (
      (view === "iliad" && isIliadActive) ||
      (view === "odyssey" && isOdysseyActive)
    ) {
      router.push("/", undefined, { shallow: true });

      // Reset both states to inactive
      setIsIliadActive(false);
      setIsOdysseyActive(false);
    } else {
      // Otherwise, activate the selected view with gender parameter if provided
      const path = genderParam ? `/${view}?gender=${genderParam}` : `/${view}`;
      router.push(path, undefined, { shallow: true });

      // Update your state accordingly
      if (view === "iliad") {
        setIsIliadActive(true);
        setIsOdysseyActive(false);
        // Update gender state if provided
        if (genderParam) {
          setGender(genderParam);
          localStorage.setItem("preferredGender", genderParam);
        }
      } else if (view === "odyssey") {
        setIsOdysseyActive(true);
        setIsIliadActive(false);
        // Update gender state if provided
        if (genderParam) {
          setGender(genderParam);
          localStorage.setItem("preferredGender", genderParam);
        }
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

  // Initialize the name data on load
  useEffect(() => {
    // Load shortlist and rejected from localStorage for non-logged in users
    const storedShortlist = localStorage.getItem("shortlist");
    const storedRejected = localStorage.getItem("rejected");

    if (storedShortlist) {
      try {
        setShortlist(JSON.parse(storedShortlist));
      } catch (e) {
        console.error("Error parsing shortlist from localStorage");
      }
    }

    if (storedRejected) {
      try {
        setRejected(JSON.parse(storedRejected));
      } catch (e) {
        console.error("Error parsing rejected from localStorage");
      }
    }

    // If a book is active, fetch a name
    if (isIliadActive || isOdysseyActive) {
      getRandomName();
    }
  }, [isIliadActive, isOdysseyActive]);

  // Add a function to get a random name
  const getRandomName = (passedLastRandomDocumentId, genderOverride) => {
    setRetreivingName(true);

    // Use the override if provided, otherwise use state
    const genderToUse = genderOverride || gender;

    // Check if user is logged in
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        // Check if user has the required product
        let hasRequiredProduct = false;

        // Fetch user data to check for product
        fire
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists && doc.data().product === "prod_R9UsZtF60a9OSG") {
              hasRequiredProduct = true;

              // LOGGED IN USER FLOW - Only proceed if they have the required product
              if (firstFetch && passedLastRandomDocumentId) {
                // If we have a previously viewed name ID, retrieve that specific name
                let results = names.find(
                  (name) => name.id === passedLastRandomDocumentId
                );
                setRetreivedName(results);
                setRetreivingName(false);
                setFirstFetch(false);
              } else {
                // Get a new random name
                let avoidNames;
                if (lastRandomDocumentId == null) {
                  avoidNames = shortlist.concat(rejected);
                } else {
                  avoidNames = shortlist
                    .concat(rejected)
                    .concat([lastRandomDocumentId]);
                }

                let results;
                if (genderToUse === "male") {
                  results = names.filter((name) => name.gender !== "female");
                } else {
                  results = names.filter((name) => name.gender !== "male");
                }

                let filteredResults = results.filter(
                  (name) => !avoidNames.includes(name.id)
                );

                if (filteredResults.length === 0) {
                  setRetreivingName(false);
                  // Handle the case where there are no more names
                  return;
                }

                const randomIndex = Math.floor(
                  Math.random() * filteredResults.length
                );
                setLastRandomDocumentId(filteredResults[randomIndex].id);
                localStorage.setItem(
                  "lastRandomDocumentId",
                  JSON.stringify(filteredResults[randomIndex].id)
                );

                setRetreivedName(filteredResults[randomIndex]);
                setRetreivingName(false);
                setFirstFetch(false);
              }
            } else {
              // User doesn't have the required product, treat as not logged in
              handleNonLoggedInFlow(genderToUse);
              setSlideDirection("center");
            }

            setSlideDirection("center");
          })
          .catch((error) => {
            console.error("Error checking user product:", error);
            // On error, fall back to non-logged in flow
            handleNonLoggedInFlow(genderToUse);
            setSlideDirection("center");
          });
      } else {
        // NOT LOGGED IN - USE PREVIEW NAMES
        handleNonLoggedInFlow(genderToUse);
        setSlideDirection("center");
      }
    });
  };

  // Helper function for non-logged in flow
  const handleNonLoggedInFlow = (genderOverride) => {
    // Use the override gender if provided, otherwise use the state gender
    const genderToUse = genderOverride || gender;

    let tempShortlist =
      typeof localStorage.shortlist !== "undefined"
        ? JSON.parse(localStorage.shortlist)
        : [];
    let tempRejected =
      typeof localStorage.rejected !== "undefined"
        ? JSON.parse(localStorage.rejected)
        : [];

    let usedNames = tempShortlist.concat(tempRejected);

    // Get random preview name based on used names - pass the correct gender
    const randomName = getRandomPreviewName(genderToUse, usedNames);

    if (!randomName) {
      // No more names available
      setRetreivingName(false);
      return;
    }

    setFirstFetch(false);

    // Set the retrieved name and update state
    setRetreivedName(randomName);
    setLastRandomDocumentId(randomName.id);
    localStorage.setItem("lastRandomDocumentId", JSON.stringify(randomName.id));
    setRetreivingName(false);
  };

  // Add this helper function to get random preview names
  const getRandomPreviewName = (currentGender, usedNames) => {
    // Get the appropriate preview IDs array based on gender
    const previewIds =
      currentGender === "male" ? malePreviewIds.names : femalePreviewIds.names;

    // Filter out already used names
    const availableIds = previewIds.filter((id) => !usedNames.includes(id));

    // If no available names, return null
    if (availableIds.length === 0) {
      return null;
    }

    // Get random ID from available names
    const randomIndex = Math.floor(Math.random() * availableIds.length);
    const nameId = availableIds[randomIndex];

    // Find and return the full name object - use the same gender as the preview IDs
    return names.find(
      (name) => name.id === nameId && name.gender === currentGender
    );
  };

  // Add to shortlist function
  const addToShortlist = () => {
    if (!retreivedName) return;

    setActionTaken(true);
    setPreviousDocumentId(retreivedName.id);

    const newShortlist = [...shortlist, retreivedName.id];
    setShortlist(newShortlist);
    localStorage.setItem("shortlist", JSON.stringify(newShortlist));

    // Get next name
    setSlideDirection("left");
    setTimeout(() => {
      getRandomName();
    }, 400);
  };

  // Add to rejected function
  const addToRejected = () => {
    if (!retreivedName) return;

    setActionTaken(true);
    setPreviousDocumentId(retreivedName.id);

    const newRejected = [...rejected, retreivedName.id];
    setRejected(newRejected);
    localStorage.setItem("rejected", JSON.stringify(newRejected));

    // Get next name
    setSlideDirection("right");
    setTimeout(() => {
      getRandomName();
    }, 400);
  };

  // Undo last action function
  const undoLastAction = () => {
    if (!previousDocumentId) return;

    setRetreivingName(true);

    // Remove the ID from both shortlist and rejected
    const newShortlist = shortlist.filter((id) => id !== previousDocumentId);
    const newRejected = rejected.filter((id) => id !== previousDocumentId);

    setShortlist(newShortlist);
    setRejected(newRejected);

    localStorage.setItem("shortlist", JSON.stringify(newShortlist));
    localStorage.setItem("rejected", JSON.stringify(newRejected));

    setActionTaken(false);

    // Restore the previous name
    setTimeout(() => {
      // In a real implementation, you would fetch the name data for previousDocumentId
      // For now, we'll just simulate it
      const mockName = {
        id: previousDocumentId,
        name: isIliadActive ? "Hector" : "Telemachus",
        description: [
          {
            content: isIliadActive
              ? "Prince of Troy, son of King Priam and Queen Hecuba."
              : "Son of Odysseus and Penelope, who searches for news of his father.",
          },
        ],
        gender: "male",
      };

      setRetreivedName(mockName);
      setRetreivingName(false);
      setLastRandomDocumentId(previousDocumentId);
      setPreviousDocumentId(null);
    }, 400);
  };

  // Change gender preference
  const changeGender = (currentGender) => {
    const newGender = currentGender === "male" ? "female" : "male";
    setGender(newGender);
    localStorage.setItem("preferredGender", newGender);

    // Update URL to include gender parameter
    if (isIliadActive) {
      router.push(`/iliad?gender=${newGender}`, undefined, { shallow: true });
    } else if (isOdysseyActive) {
      router.push(`/odyssey?gender=${newGender}`, undefined, { shallow: true });
    } else {
      router.push(`/?gender=${newGender}`, undefined, { shallow: true });
    }

    // Force the name transition animation
    setSlideDirection("center");
    setRetreivingName(true);

    // Small delay to allow animation to start
    setTimeout(() => {
      // Pass the new gender directly to getRandomName
      getRandomName(null, newGender);
    }, 100);
  };

  // Add useEffect to handle action buttons animation
  useEffect(() => {
    if (isIliadActive || isOdysseyActive) {
      // Small delay to allow book transition to start first
      setTimeout(() => {
        setActionButtonsVisible(true);
      }, 300);
    } else {
      setActionButtonsVisible(false);
    }
  }, [isIliadActive, isOdysseyActive]);

  // Add this useEffect to check if user has reached free name limit
  useEffect(() => {
    // Check total names viewed (shortlist + rejected)
    const totalNamesViewed = shortlist.length + rejected.length;

    // Check if user has the premium product
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        fire
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists && doc.data().product === "prod_R9UsZtF60a9OSG") {
              setUserHasProduct(true);
            } else {
              setUserHasProduct(false);
              // Not premium user, check if they've reached the limit
              setHasReachedFreeLimit(totalNamesViewed >= 5);
            }
          })
          .catch((error) => {
            console.error("Error checking user product:", error);
            setUserHasProduct(false);
            // On error, assume they've reached limit if conditions met
            setHasReachedFreeLimit(totalNamesViewed >= 5);
          });
      } else {
        // Not logged in
        setUserHasProduct(false);
        setHasReachedFreeLimit(totalNamesViewed >= 5);
      }
    });
  }, [shortlist, rejected]);

  // Add this useEffect to reset active states when limit is reached
  useEffect(() => {
    if (hasReachedFreeLimit && !userHasProduct) {
      setIsIliadActive(false);
      setIsOdysseyActive(false);
    }
  }, [hasReachedFreeLimit, userHasProduct]);

  return (
    <div
      className="transition-long"
      style={{
        height: isIliadActive || isOdysseyActive ? "100vh" : "auto",
        overflow:
          (isIliadOverflowHidden || isOdysseyOverflowHidden) && "hidden",
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
      <Header
        hideShadow
        hideBackground
        topOfLanding
        isIliadActive={isIliadActive}
        isOdysseyActive={isOdysseyActive}
        gender={gender}
        changeGender={changeGender}
      />
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
            opacity: isIliadActive || isOdysseyActive ? 0 : 1,
            marginTop:
              isIliadActive || isOdysseyActive
                ? `-${Number(heroHeight) + 64}px`
                : "64px",
          }}
        >
          <div
            ref={heroRef}
            className="d-flex flex-column align-items-center justify-content-center w-100 gap-5 transition-long"
            style={{ maxWidth: "800px" }}
          >
            {hasReachedFreeLimit && !userHasProduct ? (
              // Free limit reached UI
              <div className="d-flex flex-column align-items-center">
                <h1
                  className={`text-center ${screenWidth > 991 && "display2"}`}
                >
                  You've run out of free names
                </h1>
                <p
                  className="text-center text-dark-low large mb-5"
                  style={{ maxWidth: "640px" }}
                >
                  You've viewed all of your free name previews. Upgrade now to
                  unlock all 600+ epic names from Homer's poems and find the
                  perfect name for your future hero.
                </p>
                <div className="d-flex justify-content-center">
                  <Link href="/pricing" className="btn primary high">
                    Unlock Iliad — $9
                  </Link>
                </div>
                <div className="d-flex flex-column align-items-center gap-2 mt-4">
                  <p className="text-dark-dis">
                    Already a purchased?{" "}
                    <Link href="/users/login" className="text-dark-high">
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              // Standard UI
              <div className="d-flex flex-column align-items-center ">
                <h1
                  className={`text-center ${screenWidth > 991 && "display2"}`}
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
                    <button
                      onClick={() => navigateToView("iliad", "male")}
                      className="btn dark high"
                    >
                      Find an epic name
                    </button>
                  </div>
                </div>

                <div className="d-flex flex-column align-items-center gap-2 mt-4">
                  <p className="text-dark-dis">*Certified by Homer</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <BookDisplay
          isIliadActive={isIliadActive}
          isOdysseyActive={isOdysseyActive}
          navigateToView={navigateToView}
          viewportHeight={viewportHeight}
          screenWidth={screenWidth}
          retreivedName={retreivedName}
          retreivingName={retreivingName}
          slideDirection={slideDirection}
        />

        {/* Action buttons (only shown when a book is active) */}
        {(isIliadActive || isOdysseyActive) && (
          <div
            className={`position-fixed d-flex flex-row justify-content-center align-items-center gap-3 w-100 ${
              styles.actionButtonsContainer
            } ${actionButtonsVisible ? styles.actionButtonsVisible : ""}`}
            style={{ bottom: "48px", padding: "0", zIndex: 3 }}
          >
            <OverlayTrigger
              placement="top"
              delay={{ show: 1000, hide: 200 }}
              overlay={<Tooltip id="reject-tooltip">Reject</Tooltip>}
            >
              <button
                onClick={addToRejected}
                className={`btn light large high icon-only ${
                  styles.actionButton
                } ${actionButtonsVisible ? styles.actionButtonVisible : ""}`}
                disabled={retreivingName}
                style={{ transitionDelay: "0ms" }}
              >
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.CLOSE}></path>
                </svg>
              </button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              delay={{ show: 1000, hide: 200 }}
              overlay={<Tooltip id="undo-tooltip">Undo</Tooltip>}
            >
              <button
                onClick={undoLastAction}
                className={`btn primary medium x-small outlined icon-only ${
                  styles.actionButton
                } ${actionButtonsVisible ? styles.actionButtonVisible : ""}`}
                disabled={retreivingName || !actionTaken}
                style={{ transitionDelay: "100ms" }}
              >
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.UNDO}></path>
                </svg>
              </button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              delay={{ show: 1000, hide: 200 }}
              overlay={<Tooltip id="shortlist-tooltip">Shortlist</Tooltip>}
            >
              <button
                onClick={addToShortlist}
                className={`btn large high icon-only ${
                  styles.shortlistButton
                } dark ${styles.actionButton} ${
                  actionButtonsVisible ? styles.actionButtonVisible : ""
                }`}
                disabled={retreivingName}
              >
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.HEART_FILLED}></path>
                </svg>
              </button>
            </OverlayTrigger>
          </div>
        )}

        {hasReachedFreeLimit && !userHasProduct ? (
          null
        ) : (
          <div
            className="container"
            style={{
              opacity: isIliadActive || isOdysseyActive ? 0 : 1,
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
                    <button
                      onClick={() => navigateToView("iliad", "male")}
                      className="btn primary high icon-left"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.MALE}></path>
                      </svg>
                      Boys names
                    </button>
                    <button
                      onClick={() => navigateToView("iliad", "female")}
                      className="btn primary high icon-left"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.FEMALE}></path>
                      </svg>
                      Girls names
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        ref={ref}
        className="w-100"
        style={{
          zIndex: "1",
          position: "fixed",
          bottom: 0,
          opacity: isIliadActive || isOdysseyActive ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Home;
