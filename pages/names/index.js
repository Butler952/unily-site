import { useEffect, useState, useContext, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import fire from "/config/fire-config";
import { useRouter } from "next/router";

import styles from "./index.module.scss";
import namesStyles from "./names.module.scss";
import Icon from "/components/icon/Icon";
import ICONS from "/components/icon/IconPaths";
import Footer from "/components/footer/Footer";
import PostCard from "/components/blog/PostCard";
// import NAMES from "./namesWithIds";
import names from "./iliad/namesWithIds.json";
import { UserContext } from "pages/_app";
// import malePreviewIds from "./malePreviewIds";
// import femalePreviewIds from "./femalePreviewIds";
import malePreviewIds from "./malePreviewIds.json";
import femalePreviewIds from "./femalePreviewIds.json";
import Menu from "components/header/Menu";
import confetti from "canvas-confetti";
import IllustrationIliad from "components/index/IllustrationIliad";
import { handlePurchase } from "../../lib/handle-purchase";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import MenuSidebar from "components/header/MenuSidebar";

const Names = () => {
  const router = useRouter();
  const { userContext, setUserContext } = useContext(UserContext);
  const [windowLocationOrigin, setWindowLocationOrigin] = useState(undefined);

  const [screenWidth, setScreenWidth] = useState("");
  const [sending, setSending] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");
  const [product, setProduct] = useState("");
  const [actionTaken, setActionTaken] = useState(false);

  const [slideDirection, setSlideDirection] = useState("center");
  const [retreivingName, setRetreivingName] = useState(true);
  const [needUpgrade, setNeedUpgrade] = useState(false);
  const [retreivedName, setRetreivedName] = useState(null);
  const [firstFetch, setFirstFetch] = useState(true);
  const [lastRandomDocumentId, setLastRandomDocumentId] = useState(null);
  const [previousDocumentId, setPreviousDocumentId] = useState(null);
  const [likedName, setLikedName] = useState(false);
  const [gender, setGender] = useState("male");
  const [shortlist, setShortlist] = useState(
    userContext && userContext.shortlist ? userContext.shortlist : []
  );
  const [rejected, setRejected] = useState(
    userContext && userContext.rejected ? userContext.rejected : []
  );

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [openingCheckout, setOpeningCheckout] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [linkCooldown, setLinkCooldown] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [showUpgradeSuccessModal, setShowUpgradeSuccessModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const sidebarRef = useRef(null);

  // const [shortlist, setShortlist] = useState([])
  // const [rejected, setRejected] = useState([])
  // const [retreivedName, setRetreivedName] = useState({
  //   "name":"Chryseis",
  //   "description":[
  //     {
  //       "book":"iliad",
  //       "content":"Daughter of Chryses, captive mistress of Agamemnon, released by him to her father (later Criseyde, Cressida), 1.111, etc."
  //     }
  //   ],
  //   "gender":"female",
  //   "properties":[null],
  //   "allegience":[null]
  // });

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

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    setWindowLocationOrigin(window.location.origin);

    // Get gender from query params, local storage, or default to male
    const { gender: genderQuery, upgrading, signIn } = router.query;
    if (genderQuery === "male" || genderQuery === "female") {
      setGender(genderQuery);
    } else {
      // Check localStorage for gender preference if not in URL
      const storedGender = localStorage.getItem("preferredGender");
      if (storedGender === "male" || storedGender === "female") {
        setGender(storedGender);
      } else {
        setGender("male");
      }
    }

    // Check for signIn query parameter
    if (signIn === "complete") {
      confirmLoginWithLink();
    }

    // Check for upgrade query parameter
    if (upgrading === "true") {
      setShowUpgradeModal(true);
    }

    const unsubscribe = fire.auth().onAuthStateChanged((user) => {
      if (user) {
        loggedInRoute(user);
      } else {
        if (typeof localStorage.shortlist != "undefined") {
          setShortlist(JSON.parse(localStorage.shortlist));
        }
        if (typeof localStorage.rejected != "undefined") {
          setRejected(JSON.parse(localStorage.rejected));
        }
        if (typeof localStorage.lastRandomDocumentId != "undefined") {
          setLastRandomDocumentId(
            JSON.parse(localStorage.lastRandomDocumentId)
          );
          getRandomDocumentLoggedOut(
            JSON.parse(localStorage.lastRandomDocumentId),
            gender
          );
        } else {
          getRandomDocumentLoggedOut(null, gender);
        }
      }
    });
    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [router.query]);

  useEffect(() => {
    const { upgrade } = router.query;
    if (upgrade === "success") {
      setShowUpgradeSuccessModal(true);
    }
  }, [router.query]);

  const getSubscription = (user) => {
    var docRef = fire
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("payments");
    //docRef.get()
    docRef
      .where("status", "==", "succeeded")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setProduct(doc.data().items[0].price.product);
        });
      })
      .then(() => {
        // console.log('Retreived subscription data from database')
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const loggedInRoute = (user) => {
    // Check payments, and shortlists
    // If payment for Iliad, then allow the user to get more names
    // If not, stick to the limit
    setLoggedIn(true);
    setUserData(user);
    setRetreivingName(true);
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
          setShortlist(doc.data().shortlist ? doc.data().shortlist : []);
          setRejected(doc.data().rejected ? doc.data().rejected : []);
          
          // Get user's preferred gender if it exists in their document
          if (doc.data().preferredGender === "male" || doc.data().preferredGender === "female") {
            setGender(doc.data().preferredGender);
            
            // Update URL to match stored preference if no gender in query params
            if (!router.query.gender) {
              router.push(
                {
                  pathname: router.pathname,
                  query: { ...router.query, gender: doc.data().preferredGender },
                },
                undefined,
                { shallow: true }
              );
            }
          }
        } else {
          // console.log("No such document!");
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
          .then(() => {
            if (purchasedProducts == "prod_R9UsZtF60a9OSG") {
              // console.log("product is true");
              if (typeof localStorage.lastRandomDocumentId != "undefined") {
                setLastRandomDocumentId(
                  JSON.parse(localStorage.lastRandomDocumentId)
                );
                getRandomDocumentLoggedIn(
                  JSON.parse(localStorage.lastRandomDocumentId)
                );
                // console.log(JSON.parse(localStorage.lastRandomDocumentId));
                // console.log("fire2");
              } else {
                getRandomDocumentLoggedIn();
                // console.log("fire1");
              }
            } else {
              // console.log("we are firing");
              // if (typeof localStorage.shortlist != "undefined") {
              // 	setShortlist(JSON.parse(localStorage.shortlist));
              // }
              // if (typeof localStorage.rejected != "undefined") {
              // 	setRejected(JSON.parse(localStorage.rejected));
              // }
              // if (typeof localStorage.lastRandomDocumentId != "undefined") {
              // 	setLastRandomDocumentId(JSON.parse(localStorage.lastRandomDocumentId));
              // 	getRandomDocumentLoggedOut(JSON.parse(localStorage.lastRandomDocumentId), gender);
              // } else {
              // 	getRandomDocumentLoggedOut(null, gender);
              // }
              getRandomDocumentLoggedOut(null, gender);
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const confettiFunction = () => {
    var heart = confetti.shapeFromPath({ path: ICONS.HEART_FILLED });

    var colors = ["#DD2727", "#DD2727", "#DD2727"];

    (function frame() {
      confetti({
        particleCount: 15,
        startVelocity: 40,
        spread: 60,
        colors: colors,
        shapes: [heart],
        scalar: 2,
        flat: true,
        gravity: 1,
        ticks: 50,
        origin: { y: 1 },
      });
      confetti({
        particleCount: 10,
        startVelocity: 30,
        spread: 90,
        colors: colors,
        shapes: [heart],
        scalar: 3,
        flat: true,
        gravity: 1.2,
        ticks: 100,
        origin: { y: 1 },
      });
    })();
  };

  const addToShortlist = () => {
    setLikedName(true);
    confettiFunction();
    setSlideDirection("slide-out-right");

    // Create new arrays to avoid direct state mutation
    let newShortlist = shortlist;
    let newRejected = rejected;

    // Remove from rejected list if present
    if (newRejected.includes(lastRandomDocumentId)) {
      newRejected = newRejected.filter((id) => id !== lastRandomDocumentId);
      setRejected(newRejected);
    }

    // Add to shortlist if not already present
    if (!newShortlist.includes(lastRandomDocumentId)) {
      newShortlist.push(lastRandomDocumentId);
    }
    setShortlist(newShortlist);
    setPreviousDocumentId(lastRandomDocumentId);

    if (loggedIn) {
      fire
        .firestore()
        .collection("users")
        .doc(userData.uid)
        .update({
          shortlist: newShortlist,
          rejected: newRejected, // Update both arrays
          lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          if (product == "prod_R9UsZtF60a9OSG") {
            localStorage.setItem("shortlist", JSON.stringify(newShortlist));
            setShortlist(newShortlist);
            setPreviousDocumentId(lastRandomDocumentId);
            // setSending(false)
            setTimeout(() => {
              setActionTaken(true);
              getRandomDocumentLoggedIn();
              setLikedName(false);
            }, 1700);
          } else {
            localStorage.setItem("shortlist", JSON.stringify(newShortlist));
            setShortlist(newShortlist);
            setPreviousDocumentId(lastRandomDocumentId);
            // setSending(false)
            setTimeout(() => {
              setActionTaken(true);
              getRandomDocumentLoggedOut();
              setLikedName(false);
            }, 1700);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      setTimeout(() => {
        localStorage.setItem("shortlist", JSON.stringify(newShortlist));
        localStorage.setItem("rejected", JSON.stringify(newRejected)); // Update both in localStorage
        setPreviousDocumentId(lastRandomDocumentId);
        setActionTaken(true);
        getRandomDocumentLoggedOut();
        setLikedName(false);
      }, 1700);
    }
  };

  const addToRejected = () => {
    setSlideDirection("slide-out-left");

    // Create new arrays to avoid direct state mutation
    let newRejected = rejected;
    let newShortlist = shortlist;

    // Remove from shortlist if present
    if (newShortlist.includes(lastRandomDocumentId)) {
      newShortlist = newShortlist.filter((id) => id !== lastRandomDocumentId);
      setShortlist(newShortlist);
    }

    // Add to rejected if not already present
    if (!newRejected.includes(lastRandomDocumentId)) {
      newRejected.push(lastRandomDocumentId);
    }
    setRejected(newRejected);
    setPreviousDocumentId(lastRandomDocumentId);
    setRetreivingName(true);

    if (loggedIn) {
      fire
        .firestore()
        .collection("users")
        .doc(userData.uid)
        .update({
          rejected: newRejected,
          shortlist: newShortlist, // Update both arrays
          lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          if (product == "prod_R9UsZtF60a9OSG") {
            setActionTaken(true);
            setTimeout(() => {
              getRandomDocumentLoggedIn();
            }, 400);
          } else {
            setActionTaken(true);
            setTimeout(() => {
              getRandomDocumentLoggedOut();
            }, 400);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      localStorage.setItem("rejected", JSON.stringify(newRejected));
      localStorage.setItem("shortlist", JSON.stringify(newShortlist)); // Update both in localStorage
      setActionTaken(true);
      setTimeout(() => {
        getRandomDocumentLoggedOut();
      }, 400);
    }
  };

  // // Version 1 (doesn't work because we can only filter out 10 or fewer names)
  // const getRandomDocument = async () => {
  //   setRetreivingName(true)
  //   try {
  //       // Step 1: Query a random document based on some criteria
  //       // const randomQuery = fire.firestore().collection('names').orderBy(fire.firestore.FieldPath.documentId()).limit(1);
  //       // let avoidNames = ['1']
  //       let avoidNames
  //       if (lastRandomDocumentId == null) {
  //         avoidNames = shortlist.concat(rejected)
  //       } else {
  //         avoidNames = shortlist.concat(rejected).concat([lastRandomDocumentId])
  //       }
  //       // avoidNames.concat(shortlist)
  //       // avoidNames.concat(rejected)
  //       // if (lastRandomDocumentId) {
  //       //   avoidNames.push(lastRandomDocumentId)
  //       // }
  //       let randomQuery
  //       console.log(avoidNames)

  //       if (avoidNames.length > 0) {
  //         randomQuery = fire.firestore().collection('names')
  //         .where("gender", "==", gender)
  //         .where('__name__', 'not-in', avoidNames);
  //         console.log('ran 1')
  //       } else {
  //         randomQuery = fire.firestore().collection('names')
  //         .where("gender", "==", gender)
  //         console.log('ran 2')
  //       }

  //       const querySnapshot = await randomQuery.get();

  //       // Step 2: Retrieve the document
  //       if (!querySnapshot.empty) {
  //           const randomIndex = Math.floor(Math.random() * querySnapshot.size);
  //           setLastRandomDocumentId(querySnapshot.docs[randomIndex].id);
  //           // console.log(querySnapshot.docs[randomIndex].data());
  //           setRetreivedName(querySnapshot.docs[randomIndex].data());
  //           setRetreivingName(false);
  //       } else {
  //           console.log("No documents found in the collection.");
  //           setRetreivingName(false);
  //       }
  //   } catch (error) {
  //       console.error("Error getting random document: ", error);
  //       setRetreivingName(false);
  //   }
  // };

  // Version 2 (get collection, remove objects in array that are in the avoid list, select one at random from the remaining list)
  // This one is too heavy on the database (have to get all records for every name!)
  // const getRandomDocument = (passedLastRandomDocumentId) => {
  //   setRetreivingName(true)

  //    if (firstFetch && passedLastRandomDocumentId) {

  //     // fire.firestore().collection('names').doc(lastRandomDocumentId).get()
  //     fire.firestore().collection('names').doc(passedLastRandomDocumentId).get()
  //     .then((doc) => {
  //       doc.data()
  //       setRetreivedName(doc.data());
  //       setRetreivingName(false);
  //       setFirstFetch(false);
  //     })
  //     .catch(error => {
  //       console.error('Error getting documents: ', error);
  //       setRetreivingName(false);
  //     });

  //    } else {

  //     let avoidNames
  //     if (lastRandomDocumentId == null) {
  //       avoidNames = shortlist.concat(rejected)
  //     } else {
  //       avoidNames = shortlist.concat(rejected).concat([lastRandomDocumentId])
  //     }

  //     const documents = [];

  //     fire.firestore().collection('names').where("gender", "==", gender).get()
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         const jsonData = {
  //             id: doc.id,
  //             ...doc.data()
  //         };
  //         documents.push(jsonData);
  //       });
  //     })
  //     .then(() => {
  //       const filteredNames = documents.filter(name => !avoidNames.includes(name.id));
  //       const randomIndex = Math.floor(Math.random() * filteredNames.length);

  //       setLastRandomDocumentId(filteredNames[randomIndex].id);
  //       localStorage.setItem("lastRandomDocumentId", JSON.stringify(filteredNames[randomIndex].id));
  //       // console.log(querySnapshot.docs[randomIndex].data());
  //       setRetreivedName(filteredNames[randomIndex]);
  //       setRetreivingName(false);
  //       setFirstFetch(false);

  //       // console.log(filteredNames)
  //       // console.log(filteredNames[randomIndex])
  //       // console.log(randomIndex)
  //     })
  //     .catch(error => {
  //       console.error('Error getting documents: ', error);
  //       setRetreivingName(false);
  //     });
  //   }
  // };

  // // Get names from the front end
  // const getRandomDocument = () => {
  //   console.log(NAMES)
  // };

  // Get names from the front end
  // const getRandomDocument = (passedLastRandomDocumentId) => {
  //   console.log('getRandomDocument')
  //   console.log('loggedIn',loggedIn)
  //   // setRetreivingName(true)
  //   if (!loggedIn) {
  //     console.log(loggedIn)
  //     console.log('getRandomDocument2')
  //     let tempShortlist = typeof localStorage.shortlist != "undefined" ? JSON.parse(localStorage.shortlist) : []
  //     let tempRejected = typeof localStorage.rejected != "undefined" ? JSON.parse(localStorage.rejected) : []
  //     let usedNames = tempShortlist.concat(tempRejected)
  //     if (usedNames.length == 0) {
  //       let nameId = (gender == "male" ? malePreviewIds[0] : femalePreviewIds[0])
  //       let results = NAMES.find(name => name.id === nameId);
  //       setRetreivedName(results);
  //       setLastRandomDocumentId(nameId);
  //       localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
  //     } else if (usedNames.length == 1) {
  //       let nameId = (gender == "male" ? malePreviewIds[1] : femalePreviewIds[1])
  //       let results = NAMES.find(name => name.id === nameId);
  //       setRetreivedName(results);
  //       setLastRandomDocumentId(nameId);
  //       localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
  //     } else if (usedNames.length == 2) {
  //       let nameId = (gender == "male" ? malePreviewIds[2] : femalePreviewIds[2])
  //       let results = NAMES.find(name => name.id === nameId);
  //       setRetreivedName(results);
  //       setLastRandomDocumentId(nameId);
  //       localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
  //     } else if (usedNames.length == 3) {
  //       let nameId = (gender == "male" ? malePreviewIds[3] : femalePreviewIds[3])
  //       let results = NAMES.find(name => name.id === nameId);
  //       setRetreivedName(results);
  //       setLastRandomDocumentId(nameId);
  //       localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
  //     } else if (usedNames.length == 4) {
  //       let nameId = (gender == "male" ? malePreviewIds[4] : femalePreviewIds[4])
  //       let results = NAMES.find(name => name.id === nameId);
  //       setRetreivedName(results);
  //       setLastRandomDocumentId(nameId);
  //       localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
  //     } else if (usedNames.length > 4) {
  //       return
  //     }
  //     // setRetreivingName(false);
  //     setFirstFetch(false);
  //     // setCurrentIndex((currentIndex + 1) % options.length);
  //     setSlideDirection('center');

  //   } else {
  //     console.log('getRandomDocument3')
  //     if (firstFetch && passedLastRandomDocumentId) {
  //       console.log('getRandomDocument4')
  //     // We need to give each object an id (matching the one in firebase)
  //     // get object from array where id = passedLastRandomDocumentId

  //     // fire.firestore().collection('names').doc(lastRandomDocumentId).get()

  //     let results = NAMES.find(name => name.id === passedLastRandomDocumentId);
  //     setRetreivedName(results);
  //     // setRetreivingName(false);
  //     setFirstFetch(false);

  //     } else {
  //       console.log('getRandomDocument5')
  //     let avoidNames
  //     if (lastRandomDocumentId == null) {
  //       avoidNames = shortlist.concat(rejected)
  //     } else {
  //       avoidNames = shortlist.concat(rejected).concat([lastRandomDocumentId])
  //     }

  //     let results = NAMES.filter(name => name.gender !== "male");
  //     let filteredResults = results.filter(name => !avoidNames.includes(name.id));
  //     const randomIndex = Math.floor(Math.random() * filteredResults.length);

  //     setLastRandomDocumentId(filteredResults[randomIndex].id);
  //     localStorage.setItem("lastRandomDocumentId", JSON.stringify(filteredResults[randomIndex].id));

  //     setRetreivedName(filteredResults[randomIndex]);
  //     // setRetreivingName(false);
  //     setFirstFetch(false);

  //     }
  //     setSlideDirection('center');
  //   }
  // };

  const getRandomDocumentLoggedOut = (
    passedLastRandomDocumentId
  ) => {
    // First check if genderOverride is provided
    let currentGender;
    
      // Otherwise check URL query
      const genderQuery = router.query.gender;
      if (genderQuery === "male" || genderQuery === "female") {
        currentGender = genderQuery;
      } else {
        // Check localStorage for saved preference
        const storedGender = localStorage.getItem("preferredGender");
        if (storedGender === "male" || storedGender === "female") {
          currentGender = storedGender;
        } else {
          // Finally fall back to gender state
          currentGender = gender;
        }
    }

    setRetreivingName(true);

    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        fire
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setUserContext(doc.data());
              setShortlist(doc.data().shortlist ? doc.data().shortlist : []);
              setRejected(doc.data().rejected ? doc.data().rejected : []);
              let newShortlist = doc.data().shortlist
                ? doc.data().shortlist
                : [];
              let newRejected = doc.data().rejected ? doc.data().rejected : [];
              // console.log('shortlist as this point', newShortlist)
              // console.log('rejected as this point', newRejected)
              // console.log("getRandomDocument5");
              let usedNames = newShortlist.concat(newRejected);
              // console.log("usedNames", usedNames);

              // Get random preview name based on used names
              const randomName = getRandomPreviewName(currentGender, usedNames);

              if (!randomName) {
                // No more names available
                setRetreivingName(false);
                setNeedUpgrade(true);
                return;
              }

              setFirstFetch(false);
              setSlideDirection("center");

              // Set the retrieved name and update state
              setRetreivedName(randomName);
              setLastRandomDocumentId(randomName.id);
              localStorage.setItem(
                "lastRandomDocumentId",
                JSON.stringify(randomName.id)
              );
              setRetreivingName(false);
            } else {
              // console.log("No such document!");
              let newShortlist = [];
              let newRejected = [];
              // console.log("shortlist as this point", newShortlist);
              // console.log("rejected as this point", newRejected);
              // console.log("getRandomDocument6");
              let usedNames;
              usedNames = newShortlist.concat(newRejected);
              // Get random preview name based on used names
              const randomName = getRandomPreviewName(currentGender, usedNames);

              if (!randomName) {
                // No more names available
                setRetreivingName(false);
                setNeedUpgrade(true);
                return;
              }

              setFirstFetch(false);
              setSlideDirection("center");

              // Set the retrieved name and update state
              setRetreivedName(randomName);
              setLastRandomDocumentId(randomName.id);
              localStorage.setItem(
                "lastRandomDocumentId",
                JSON.stringify(randomName.id)
              );
              setRetreivingName(false);
            }
          });
      } else {
        // console.log("this one");
        let tempShortlist =
          typeof localStorage.shortlist != "undefined"
            ? JSON.parse(localStorage.shortlist)
            : [];
        let tempRejected =
          typeof localStorage.rejected != "undefined"
            ? JSON.parse(localStorage.rejected)
            : [];
        let usedNames = tempShortlist.concat(tempRejected);
        // Get random preview name based on used names
        const randomName = getRandomPreviewName(currentGender, usedNames);

        if (!randomName) {
          // No more names available
          setRetreivingName(false);
          setNeedUpgrade(true);
          return;
        }

        setFirstFetch(false);
        setSlideDirection("center");

        // Set the retrieved name and update state
        setRetreivedName(randomName);
        setLastRandomDocumentId(randomName.id);
        localStorage.setItem(
          "lastRandomDocumentId",
          JSON.stringify(randomName.id)
        );
        setRetreivingName(false);
      }
    });
  };

  const getRandomDocumentLoggedIn = (passedLastRandomDocumentId) => {
    // console.log("getRandomDocumentLoggedIn");
    // console.log("loggedIn", loggedIn);
    // setRetreivingName(true)
    // console.log("getRandomDocument3");
    // console.log("firstFetch", firstFetch);
    setRetreivingName(true);
    if (firstFetch && passedLastRandomDocumentId) {
      // console.log("getRandomDocument4");
      // We need to give each object an id (matching the one in firebase)
      // get object from array where id = passedLastRandomDocumentId

      // fire.firestore().collection('names').doc(lastRandomDocumentId).get()

      let results = names.find(
        (name) => name.id === passedLastRandomDocumentId
      );
      setRetreivedName(results);
      setRetreivingName(false);
      setFirstFetch(false);
    } else {
      // console.log("getRandomDocument5");
      let avoidNames;
      if (lastRandomDocumentId == null) {
        avoidNames = shortlist.concat(rejected);
      } else {
        avoidNames = shortlist.concat(rejected).concat([lastRandomDocumentId]);
      }
      let results;
      if (gender == "male") {
        results = names.filter((name) => name.gender !== "female");
      } else {
        results = names.filter((name) => name.gender !== "male");
      }
      let filteredResults = results.filter(
        (name) => !avoidNames.includes(name.id)
      );
      const randomIndex = Math.floor(Math.random() * filteredResults.length);

      setLastRandomDocumentId(filteredResults[randomIndex].id);
      localStorage.setItem(
        "lastRandomDocumentId",
        JSON.stringify(filteredResults[randomIndex].id)
      );

      setRetreivedName(filteredResults[randomIndex]);
      setRetreivingName(false);
      setFirstFetch(false);
    }
    setSlideDirection("center");
  };

  const changeGender = (currentGender) => {
    const newGender = currentGender === "male" ? "female" : "male";
    setGender(newGender);
    
    // Store gender in localStorage for non-logged in users
    localStorage.setItem("preferredGender", newGender);
    
    // If user is logged in, update their document in Firestore
    if (loggedIn && userData?.uid) {
      fire
        .firestore()
        .collection("users")
        .doc(userData.uid)
        .update({
          preferredGender: newGender,
          lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
        })
        .catch((error) => {
          console.log("Error updating gender preference:", error);
        });
    }

    // Update the query string
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, gender: newGender },
      },
      undefined,
      { shallow: true }
    );
  };

  const undoLastAction = () => {
    setRetreivingName(true);
    let newShortlist = shortlist;
    newShortlist = newShortlist.filter((id) => id !== previousDocumentId);
    setShortlist(newShortlist);
    let newRejected = rejected;
    newRejected = newRejected.filter((id) => id !== previousDocumentId);
    // newRejected.filter(previousDocumentId);
    setRejected(newRejected);

    const genderQuery = router.query.gender;
    let currentGender;

    if (genderQuery === "male" || genderQuery === "female") {
      currentGender = genderQuery;
    } else {
      currentGender = "male";
    }

    if (loggedIn) {
      // push new shortlist and rejected to firestore
      // get the data for previousDocumentId again
      // setActionTaken to false (to hide the undo button)

      fire
        .firestore()
        .collection("users")
        .doc(userData.uid)
        .update({
          shortlist: newShortlist,
          rejected: newRejected,
          lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          // setSending(false)
          setActionTaken(false);
          setTimeout(() => {
            let results = names.find((name) => name.id === previousDocumentId);
            setRetreivedName(results);
            setRetreivingName(false);
            // getRandomDocumentLoggedIn(previousDocumentId);
            setLastRandomDocumentId(previousDocumentId);
            setPreviousDocumentId(null);
          }, 400);
        })
        .catch((error) => {
          setRetreivingName(false);
          console.log("error", error);
        });
    } else {
      localStorage.setItem("shortlist", JSON.stringify(newShortlist));
      localStorage.setItem("rejected", JSON.stringify(newRejected));
      // setSending(false)
      setActionTaken(false);
      setTimeout(() => {
        let results = names.find((name) => name.id === previousDocumentId);
        setRetreivedName(results);
        setRetreivingName(false);
        // getRandomDocumentLoggedIn(previousDocumentId);
        setLastRandomDocumentId(previousDocumentId);
        setPreviousDocumentId(null);
      }, 400);
    }
  };

  // Console log all items in database so we can get ids
  // const getRandomDocument = (passedLastRandomDocumentId) => {
  //   setRetreivingName(true)

  //   const documents = [];

  //     fire.firestore().collection('names').get()
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         let jsonData = {
  //             id: doc.id,
  //             ...doc.data()
  //         };
  //         delete jsonData.lastUpdated
  //         delete jsonData.createdAt
  //         documents.push(jsonData);
  //       });
  //     })
  //     .then(() => {
  //       console.log(documents);
  //       setRetreivingName(false);
  //       setFirstFetch(false);
  //       // console.log(filteredNames)
  //       // console.log(filteredNames[randomIndex])
  //       // console.log(randomIndex)
  //     })
  //     .catch(error => {
  //       console.error('Error getting documents: ', error);
  //       setRetreivingName(false);
  //     });
  // };

  // const getRandomDocument = () => {

  //   var names = fire.firestore().collection('names');
  //   var key = names.doc().id;

  //   names.where(fire.firestore().FieldPath.documentId(), '>=', key).limit(1).get()
  //   .then(snapshot => {
  //       if(snapshot.size > 0) {
  //           snapshot.forEach(doc => {
  //               console.log(doc.id, '=>', doc.data());
  //           });
  //       }
  //       else {
  //           var name = names.where(fire.firestore().FieldPath.documentId(), '<', key).limit(1).get()
  //           .then(snapshot => {
  //               snapshot.forEach(doc => {
  //                   console.log(doc.id, '=>', doc.data());
  //               });
  //           })
  //           .catch(err => {
  //               console.log('Error getting documents', err);
  //           });
  //       }
  //   })
  //   .catch(err => {
  //       console.log('Error getting documents', err);
  //   });
  // }

  // const addNames = () => {
  //     setSending(true)
  //     NAMES.forEach((name) => {
  //       fire.firestore().collection('names').add({
  //         name: name.name,
  //         description: name.description,
  //         properties: name.properties,
  //         gender: name.gender,
  //         allegiance: name.allegiance,
  //         createdAt: fire.firestore.FieldValue.serverTimestamp(),
  //         lastUpdated: fire.firestore.FieldValue.serverTimestamp()
  //       })
  //       .then(() => {
  //         setSending(false)
  //       })
  //       .catch((err) => {
  //         console.log(err.code, err.message)
  //         setSending(false)
  //       })
  //     })
  // }

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

  const passwordChange = (value) => {
    setPassword(value);
    setPasswordError("");
  };

  var actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    // url: 'https://www.example.com/finishSignUp?cartId=1234',
    url: `${windowLocationOrigin}/names?signIn=complete`,
    // This must be true.
    handleCodeInApp: true,
    // iOS: {
    //   bundleId: 'com.example.ios'
    // },
    // android: {
    //   packageName: 'com.example.android',
    //   installApp: true,
    //   minimumVersion: '12'
    // },
    // dynamicLinkDomain: 'example.page.link'
  };

  const handleLoginWithLink = (e) => {
    e.preventDefault();
    setSendingLink(true);
    fire
      .auth()
      .sendSignInLinkToEmail(username, actionCodeSettings)
      .then(() => {
        // alert('Magic link sent')
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.

        localStorage.setItem("emailForSignIn", username);
        setSendingLink(false);
        setLinkSent(true);

        // Start countdown from 10
        setLinkCooldown(10);

        // Create interval to countdown
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
        var errorCode = error.code;
        var errorMessage = error.message;
        // Handle errors here if needed
        setSendingLink(false);
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

  const handleRegister = (e) => {
    e.preventDefault();

    setSendingLink(true);

    fire
      .auth()
      .createUserWithEmailAndPassword(username, password)
      .then((userCredential) => {
        fire.firestore().collection("users").doc(userCredential.user.uid).set({
          email: userCredential.user.email,
          shortlist: shortlist,
          rejected: rejected,
          created: fire.firestore.FieldValue.serverTimestamp(),
          lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
        });
      })
      .then(() => {
        // mixpanel.init(mixpanelConfig);
        localStorage.removeItem("shortlist");
        localStorage.removeItem("rejected");
      })
      .then(() => {
        router.push("/names?upgrading=true");
      })
      .catch((err) => {
        if (err.code === "auth/email-already-in-use") {
          setEmailError("This email is already in use");
        }
        if (err.code === "auth/invalid-email") {
          setEmailError("Please enter a valid email address");
        }
        if (err.code === "auth/weak-password") {
          setPasswordError("Your password must be at least 6 characters long");
        }
        setSendingLink(false);
        console.log(err.code, err.message);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setSigningIn(true);

    fire
      .auth()
      .signInWithEmailAndPassword(username, password)
      // .then(() => {
      //   mixpanel.init(mixpanelConfig);
      //   mixpanel.track('Signed in');
      // })
      .then(() => {
        setSigningIn(false);
      })
      .catch((err) => {
        if (err.code === "auth/invalid-email") {
          setEmailError("Please enter a valid email address");
        }
        if (err.code === "auth/user-disabled") {
          setEmailError("This account has been disabled");
        }
        if (err.code === "auth/user-not-found") {
          //setEmailError('Please check you have entered your email correctly or sign up to create an account')
          setPasswordError("The email address and password do not match");
        }
        if (err.code === "auth/wrong-password") {
          setPasswordError("The email address and password do not match");
        }
        setSigningIn(false);
        // console.log(err.code, err.message)
      });
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
        window.location.origin + "/names?upgrade=success",
        window.location.origin + "/names?upgrade=cancelled"
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

    // Find and return the full name object
    return names.find(
      (name) => name.id === nameId && name.gender === currentGender
    );
  };

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
    if (window.innerWidth > 767 && showMenu) {
      setShowMenu(false);
    }
  };

  const handleShowMenu = () => {
    setShowMenu(true);
  };

  return (
    <div className={`overflow-hidden ${likedName && "bg-dark-900"}`}>
      {/* <Header positionFixed hideShadow /> */}
      <Head>
        <title>Turn your Linkedin profile into a resume | vitaely.me</title>
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

      {/* <div className={screenWidth > 767 && `w-100 d-flex flex-row`}> */}
      <div className={`w-100 d-flex flex-row`}>
        {/* {screenWidth > 767 ? (
					<MenuSidebar />
				) : ( */}
        <div
          ref={sidebarRef}
          style={
            showMenu
              ? { position: "fixed", right: 0, zIndex: 2 }
              : { position: "fixed", right: -240, zIndex: 2 }
          }
          className={`${namesStyles.sidebarWrapper} ${showMenu && `shadow-5`}`}
        >
          <MenuSidebar smallScreen />
        </div>
        {/* )} */}
        <div className="position-relative w-100">
          {!likedName && (
            <div
              className={`position-absolute w-100`}
              style={{ zIndex: 1, top: 0, left: 0 }}
            >
              <div
                className="d-flex flex-row align-items-center justify-content-center p-2 px-md-3 w-100"
                style={{ height: "64px" }}
              >
                {/* <div
            className="position-absolute d-flex flex-row"
            style={{ left: "24px" }}
            >
              Used names{" "}
              <div className="tag dark medium small ml-2">
                {shortlist.length + rejected.length}
              </div>
            </div> */}

                <div
                  className="position-absolute d-flex flex-row align-items-center px-2 px-md-3 gap-3"
                  style={{ left: "0px" }}
                >
                  {/* {
                    actionTaken && (
                      <button
                        onClick={() => undoLastAction()}
                        className="btn primary ultraLow x-small outlined text-only"
                      >
                        Undo
                      </button>
                    )
                  } */}
                </div>

                {!likedName &&
                  (product !== "prod_R9UsZtF60a9OSG" && needUpgrade ? null : (
                    <button
                      onClick={() => changeGender(gender)}
                      className={`${styles.genderSwitchWrapper}`}
                      style={{
                        padding: "12px",
                        gap: "19px",
                        width: "82px",
                        height: "44px",
                      }}
                    >
                      <div
                        className={`${styles.genderSwitchStyles} ${
                          gender == "male"
                            ? styles.genderSwitchStylesMale
                            : styles.genderSwitchStylesFemale
                        } position-absolute bg-light-900 radius-5`}
                        style={{ top: "2px", height: "40px", width: "40px" }}
                      ></div>
                      <svg
                        className={`${styles.genderSwitchMaleIcon} ${
                          gender == "male" && styles.active
                        }`}
                        style={{ zIndex: "1" }}
                        width="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d={ICONS.MALE}
                        />
                      </svg>
                      <svg
                        className={`${styles.genderSwitchFemaleIcon} ${
                          gender == "female" && styles.active
                        }`}
                        style={{ zIndex: "1" }}
                        width="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d={ICONS.FEMALE}
                        />
                      </svg>
                    </button>
                  ))}
                <div
                  className="position-absolute d-flex flex-row align-items-center px-2 px-md-3 gap-1"
                  style={{ right: "0px" }}
                >
                  {screenWidth > 767 ? (
                  <Link
                    href="/shortlist"
                    className="btn primary medium outlined x-small icon-left"
                    // onClick={() => handleShowMenu()}
                    // to="/shortlist"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d={ICONS.SHORTLIST}></path>
                    </svg>
                    View shortlist
                    <div className="tag dark medium small ml-2">
											{shortlist.length}
										</div>
                  </Link>
                  ) : (
                    <Link
                      href="/shortlist"
                      className="btn primary medium outlined x-small icon-only"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.SHORTLIST}></path>
                      </svg>
                      <div className="tag dark medium small ml-2">
											{shortlist.length}
										</div>
                    </Link>
                  )}
                  {/* {screenWidth > 767 && (
									<Link
										href="/shortlist"
										className="btn primary low small text-only"
									>
										Shortlist{" "}
										<div className="tag dark medium small ml-2">
											{shortlist.length}
										</div>
									</Link>
								)} */}
                  {/* { screenWidth < 768 && */}
                  {/* <button
                    className="btn primary medium outlined x-small icon-only"
                    onClick={() => handleShowMenu()}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d={ICONS.MENU}></path>
                    </svg>
                  </button> */}
                  {/* } */}
                  {/* <Menu /> */}
                </div>
              </div>
            </div>
          )}
          <div>
            {needUpgrade &&
            product !== "prod_R9UsZtF60a9OSG" &&
            shortlist.length + rejected.length >= 5 ? (
              <div
                className="d-flex flex-column align-items-center px-4 py-5 my-5"
                // style={{ minHeight: "100vh" }}
              >
                <div className="tag dark medium mr-3 mb-3">
                  You're out of free names
                </div>
                <h2
                  className="text-center mx-auto mb-5"
                  style={{ maxWidth: "720px" }}
                >
                  Upgrade to continue exploring over 750 epic names
                </h2>
                <div
                  className="d-flex flex-column flex-lg-row gap-3"
                  style={{ maxWidth: "800px" }}
                >
                  <div
                    className={`${styles.epicPoemCard} radius-4 w-100 d-flex flex-column align-items-center gap-4 p-5`}
                    // className={`radius-4 w-100 position-relative shine overflow-hidden ${styles.epicPoemCard} ${styles.epicPoemCardIliad}`}
                  >
                    <div
                      className={`${styles.epicPoemIllustration} ${styles.epicPoemIllustrationIliad} shine p-2 radius-2`}
                    >
                      <img
                        style={{ width: "120px" }}
                        src="/images/book-patterns/iliad-square.svg"
                      />
                    </div>
                    <div className="d-flex flex-column align-items-center gap-4">
                      <div className="d-flex flex-column align-items-center text-center">
                        <h3 className="mb-3">Iliad</h3>
                        <p>
                          Over 500 names from Homer's epic poem <i>The Iliad</i>
                          , featuring mortal belligerents of all factions of the
                          Trojan war, and the Gods that quarrelled over them.
                        </p>
                      </div>
                      <button
                        onClick={handlePurchaseClick}
                        className="btn dark high"
                      >
                        Unlock—$9
                      </button>
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
                        style={{ width: "120px" }}
                        src="/images/book-patterns/odyssey-round.svg"
                      />
                    </div>
                    <div className="d-flex flex-column align-items-center justify-content-between h-100 gap-4">
                      <div className="d-flex flex-column align-items-center text-center">
                        <h3 className="mb-3">Odyssey</h3>
                        <p>
                          More ancient greek names from <i>The Odyssey</i>;
                          which chronicles the ten-year journey of Odysseus,
                          king of Ithaka, back to his home after the fall of
                          Troy.
                        </p>
                      </div>
                      <button className="btn dark high" disabled>
                        Coming soon
                      </button>
                    </div>
                  </div>
                </div>

                {/* <p className="large mx-auto mb-5">No names remaining</p> */}
              </div>
            ) : (
              <div
                className="overflow-hidden d-flex flex-column align-items-center justify-content-center px-4"
                style={{ minHeight: "100vh" }}
              >
                {/* {!retreivingName && retreivedName !== null ? ( */}
                {!retreivingName ? (
                  <div
                    className={`d-flex flex-column align-items-center justify-content-center text-center transitionItem ${slideDirection}`}
                    style={{ maxWidth: "560px" }}
                  >
                    {/* {retreivedName?.allegiance[0] != null && (
									<div className="d-flex b-4 gap-3 mb-3">
										{retreivedName?.allegiance?.map((allegiance, index) => {
											return (
												<div
													key={index}
													className="tag dark medium icon-left"
													style={{ textTransform: "capitalize" }}
												>
													<svg viewBox="0 0 24 24">
														<path d={ICONS.WEBSITE}></path>
													</svg>
													{allegiance}
												</div>
											);
										})}
									</div>
								)} */}
                    <h1
                      className={`mx-auto ${
                        !likedName ? "text-dark-high" : "text-light-high"
                      }`}
                      style={{ maxWidth: "720px" }}
                    >
                      {retreivedName?.name}
                    </h1>
                    <div className="mb-4">
                      {retreivedName?.description?.map((description, index) => {
                        return (
                          <p
                            key={index}
                            className={`large ${
                              !likedName ? "text-dark-low" : "text-light-low"
                            }`}
                          >
                            {description.content}
                          </p>
                        );
                      })}
                    </div>
                    <div className="d-flex mx-auto justify-content-center">
                      {/* { !loggedIn &&
                  <p className="large mx-auto mb-5">{`${5 - (shortlist.length + rejected.length)} ${5 - (shortlist.length + rejected.length) == 1 ? `name` : `names`} remaining`}</p>
                } */}
                      {/* <Link href="/users/register" className="btn primary high large mx-auto">Get started</Link> */}
                      {/* <button onClick={() => addNames()} disabled={sending} className="btn primary high large mx-auto">Add some names</button> */}
                    </div>
                  </div>
                ) : (
                  <div className="ldsRippleLarge">
                    <div></div>
                    <div></div>
                  </div>
                  // <p className="large mx-auto mb-5">Loading</p>
                )}
                {/* <button onClick={() => getRandomDocument()} disabled={sending} className="btn icon-only primary high large mx-auto">Get another name</button> */}
                
                { !likedName && (
                <div
                  className="position-fixed"
                  style={{ bottom: "0px", padding: "48px" }}
                >
                  <div className="position-relative d-flex flex-row align-items-center gap-3">
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 1000, hide: 200 }}
                      overlay={<Tooltip id="reject-tooltip">Reject</Tooltip>}
                    >
                      <button
                        onClick={() => addToRejected()}
                        className="btn light large high icon-only"
                        disabled={retreivingName || likedName}
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
                        onClick={() => undoLastAction()}
                        className={`btn primary medium x-small outlined icon-only`}
                        disabled={retreivingName || likedName || !actionTaken}
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
                        onClick={() => addToShortlist()}
                        className={`btn large high icon-only ${
                          styles.shortlistButton
                        } ${
                          !likedName ? "dark" : `${styles.shortlistButtonHighlight}`
                        } `}
                        disabled={retreivingName || likedName}
                      >
                        <svg viewBox="0 0 24 24">
                          <path
                            d={!likedName ? ICONS.HEART_FILLED : ICONS.HEART_FILLED}
                          ></path>
                        </svg>
                      </button>
                    </OverlayTrigger>
                  </div>
                  </div>
                )}
              </div>
            )}
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
              <motion.button
                key="loaded-upgrade-button"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 4 }}
                onClick={handleUpgradeSuccessClose}
                disabled={!loggedIn || openingCheckout}
                className={`btn dark high w-100 gap-3`}
              >
                Continue
              </motion.button>
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

export default Names;
