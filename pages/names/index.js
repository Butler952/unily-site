import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import fire from '/config/fire-config';

import styles from './index.module.scss'
import Icon from '/components/icon/Icon';
import ICONS from '/components/icon/IconPaths';
import Footer from '/components/footer/Footer';
import PostCard from '/components/blog/PostCard';
import Header from '/components/header/Header';
import NAMES from './namesWithIds';
import { UserContext } from 'pages/_app';
import malePreviewIds from './malePreviewIds';
import femalePreviewIds from './femalePreviewIds';

const Names = () => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [screenWidth, setScreenWidth] = useState('');
  const [sending, setSending] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState('')

  const [retreivingName, setRetreivingName] = useState(true);
  const [retreivedName, setRetreivedName] = useState(null)
  const [firstFetch, setFirstFetch] = useState(true)
  const [lastRandomDocumentId, setLastRandomDocumentId] = useState(null)
  const [gender, setGender] = useState("male")
  const [shortlist, setShortlist] = useState(userContext && userContext.shortlist ? userContext.shortlist : [])
  const [rejected, setRejected] = useState(userContext && userContext.rejected ? userContext.rejected : [])
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

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);

    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          loggedInRoute(user)
          // getSubscription(user)
        } else {
          if (typeof localStorage.shortlist != "undefined") {
            setShortlist(JSON.parse(localStorage.shortlist))
          }
          if (typeof localStorage.rejected != "undefined") {
            setRejected(JSON.parse(localStorage.rejected))
          }
          if (typeof localStorage.lastRandomDocumentId != "undefined") {
            setLastRandomDocumentId(JSON.parse(localStorage.lastRandomDocumentId))
            getRandomDocument(JSON.parse(localStorage.lastRandomDocumentId))
          } else {
            getRandomDocument()
          }
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };

    // if (userContext !== '') {
    //   getRandomDocument()
    // } else {
    //   if (typeof localStorage.shortlist != "undefined") {
    //     setShortlist(JSON.parse(localStorage.shortlist))
    //   }
    //   if (typeof localStorage.rejected != "undefined") {
    //     setRejected(JSON.parse(localStorage.rejected))
    //   }
    //   if (typeof localStorage.lastRandomDocumentId != "undefined") {
    //     setLastRandomDocumentId(JSON.parse(localStorage.lastRandomDocumentId))
    //     getRandomDocument(JSON.parse(localStorage.lastRandomDocumentId))
    //   } else {
    //     getRandomDocument()
    //   }
    // }

    // We only needed last random document to try to limit non-account to 5 names, but if we're just using the same 5 names now, then there's no need for it
    // I'll keep it for now but I will remove it soon

    // If there is no user
    // Run through the 5 default IDs (we can just hard code them, with env variables for Prod and Dev)
    // Save and rejections/shortlisting to localstorage
    // Prompt them to create an account once they hit 5 names

    // If there is a user
    // Set shortlist/rejected from user storage
    // Update shortlist rejected by making a call to firestore when each action is take
    // Do not refer to shortlist/rejected any more


    // const unsubscribe = fire.auth()
    //   .onAuthStateChanged((user) => {
    //     if (user) {
    //       loggedInRoute(user)
    //       getSubscription(user)
    //     }
    //   })
    // return () => {
    //   // Unmouting
    //   unsubscribe();
    // };

  }, []);

  const loggedInRoute = (user) => {
    setLoggedIn(true)
    setUserData(user)
    // console.log(user)
    fire.firestore().collection('users').doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          setUserContext(doc.data())
          setShortlist(doc.data().shortlist ? doc.data().shortlist : [])
          setRejected(doc.data().rejected ? doc.data().rejected : [])
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })
      if (typeof localStorage.lastRandomDocumentId != "undefined") {
        setLastRandomDocumentId(JSON.parse(localStorage.lastRandomDocumentId))
        getRandomDocument(JSON.parse(localStorage.lastRandomDocumentId))
      } else {
        getRandomDocument()
      }
  }

  const addToShortlist = () => {
    setSending(true)

    if (loggedIn) {
      let newShortlist = shortlist
      newShortlist.push(lastRandomDocumentId)
      fire.firestore().collection('users').doc(userData.uid).update({
        shortlist: newShortlist,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        localStorage.setItem("shortlist", JSON.stringify(newShortlist));
        setShortlist(newShortlist)
        setSending(false)
        getRandomDocument();
      })
      .catch((error) => {
        console.log('error', error)
      })
    } else{
      let newShortlist = shortlist
      newShortlist.push(lastRandomDocumentId)
      console.log('ran this')
      localStorage.setItem("shortlist", JSON.stringify(newShortlist));
      setShortlist(newShortlist)
      setSending(false)
      getRandomDocument();
    }
  }

  const addToRejected = () => {
    setSending(true)
    let newRejected = rejected
    newRejected.push(lastRandomDocumentId)
    setRejected(newRejected)
    if (loggedIn) {
      fire.firestore().collection('users').doc(userData.uid).update({
        rejected: newRejected,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setSending(false)
        getRandomDocument();
      })
      .catch((error) => {
        console.log('error', error)
      })
    } else{
      localStorage.setItem("rejected", JSON.stringify(rejected));
      setSending(false)
      getRandomDocument();
    }
  }


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
  const getRandomDocument = (passedLastRandomDocumentId) => {
    setRetreivingName(true)
    console.log('also ran this')
    if (!loggedIn) {
      let tempShortlist = typeof localStorage.shortlist != "undefined" ? JSON.parse(localStorage.shortlist) : []
      let tempRejected = typeof localStorage.rejected != "undefined" ? JSON.parse(localStorage.rejected) : []
    
      let usedNames = tempShortlist.concat(tempRejected)
      if (usedNames.length == 0) {
        let nameId = (gender == "male" ? malePreviewIds[0] : femalePreviewIds[0])
        let results = NAMES.find(name => name.id === nameId);
        setRetreivedName(results);
        setLastRandomDocumentId(nameId);
        localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
      } else if (usedNames.length == 1) {
        let nameId = (gender == "male" ? malePreviewIds[1] : femalePreviewIds[1])
        let results = NAMES.find(name => name.id === nameId);
        setRetreivedName(results);
        setLastRandomDocumentId(nameId);
        localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
      } else if (usedNames.length == 2) {
        let nameId = (gender == "male" ? malePreviewIds[2] : femalePreviewIds[2])
        let results = NAMES.find(name => name.id === nameId);
        setRetreivedName(results);
        setLastRandomDocumentId(nameId);
        localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
      } else if (usedNames.length == 3) {
        let nameId = (gender == "male" ? malePreviewIds[3] : femalePreviewIds[3])
        let results = NAMES.find(name => name.id === nameId);
        setRetreivedName(results);
        setLastRandomDocumentId(nameId);
        localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
      } else if (usedNames.length == 4) {
        let nameId = (gender == "male" ? malePreviewIds[4] : femalePreviewIds[4])
        let results = NAMES.find(name => name.id === nameId);
        setRetreivedName(results);
        setLastRandomDocumentId(nameId);
        localStorage.setItem("lastRandomDocumentId", JSON.stringify(nameId));
      } else if (usedNames.length > 4) {
        return
      }
      setRetreivingName(false);
      setFirstFetch(false);

    } else {

      if (firstFetch && passedLastRandomDocumentId) {

      // We need to give each object an id (matching the one in firebase)
      // get object from array where id = passedLastRandomDocumentId

      // fire.firestore().collection('names').doc(lastRandomDocumentId).get()

      let results = NAMES.find(name => name.id === passedLastRandomDocumentId);
      setRetreivedName(results);
      setRetreivingName(false);
      setFirstFetch(false);

      } else {

      let avoidNames
      if (lastRandomDocumentId == null) {
        avoidNames = shortlist.concat(rejected)
      } else {
        avoidNames = shortlist.concat(rejected).concat([lastRandomDocumentId])
      }

      let results = NAMES.filter(name => name.gender !== "male");
      let filteredResults = results.filter(name => !avoidNames.includes(name.id));
      const randomIndex = Math.floor(Math.random() * filteredResults.length);

      setLastRandomDocumentId(filteredResults[randomIndex].id);
      localStorage.setItem("lastRandomDocumentId", JSON.stringify(filteredResults[randomIndex].id));

      setRetreivedName(filteredResults[randomIndex]);
      setRetreivingName(false);
      setFirstFetch(false);

      }
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

  return (
    <div className="overflow-hidden">
      {/* <Header positionFixed hideShadow /> */}
      <Head>
        <title>Turn your Linkedin profile into a resume | vitaely.me</title>
        <meta name="description" content="Turn your Linkedin profile into a resume in just two minutes." />
        <meta property="og:title" content="Turn your Linkedin profile into a resume | vitaely.me" />
        <meta property="og:description" content="Turn your Linkedin profile into a resume in just two minutes." />
        <meta property="og:url" content="https://www.vitaely.me/linkedin-to-resume" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me%2Flinkedin-to-resume"/> */}
      </Head>
      <div className="d-flex flex-row align-items-center justify-content-between position-fixed px-4 w-100">
        This is a header
        <Link href="/shortlist" className="btn primary low small text-only mt-4">
          View shortlist <div className="tag dark medium small ml-2">{shortlist.length}</div>
        </Link>
        <div>
          Used names <div className="tag dark medium small ml-2">{shortlist.length + rejected.length}</div>
        </div>
      </div>
      <div>
        { !loggedIn && shortlist.length + rejected.length >= 5 ?
          <div className="d-flex flex-column align-items-center justify-content-center" style={{minHeight: '100vh'}}>
            <div className="tag dark medium mr-3 mb-3">You’re out of free names</div>
            <h2 className="text-center mx-auto" style={{ maxWidth: "720px" }}>Upgrade to continue exploring  over 750 epic names</h2> 
            <p className="large mx-auto mb-5">No names remaining</p>
          </div>
        :
          <div className="d-flex flex-column align-items-center justify-content-center" style={{minHeight: '100vh'}}>
            {!retreivingName && retreivedName !== null ? 
              <div className="d-flex flex-column align-items-center justify-content-center text-center">
                {retreivedName?.allegiance[0] != null &&
                  <div className="d-flex b-4 gap-3 mb-3">
                    {retreivedName?.allegiance?.map((allegiance, index) => {
                      return (
                        <div key={index} className="tag primary medium icon-left" style={{textTransform: 'capitalize'}}>
                          <svg viewBox="0 0 24 24">
                            <path d={ICONS.WEBSITE}></path>
                          </svg>
                          {allegiance}
                        </div>
                      )
                    })}
                  </div>
                }
                <h1 className="mx-auto" style={{ maxWidth: "720px" }}>{retreivedName?.name}</h1> 
                <div className="mb-4">   
                  {retreivedName?.description?.map((description, index) => {
                    return (
                      <p key={index} className="large">{description.content}</p>
                    )
                  })}
                </div>
                <div className="d-flex mx-auto justify-content-center">
                { !loggedIn &&
                  <p className="large mx-auto mb-5">{`${5 - (shortlist.length + rejected.length)} ${5 - (shortlist.length + rejected.length) == 1 ? `name` : `names`} remaining`}</p>
                }
                  {/* <Link href="/users/register" className="btn primary high large mx-auto">Get started</Link> */}
                  {/* <button onClick={() => addNames()} disabled={sending} className="btn primary high large mx-auto">Add some names</button> */}            
                </div>
              </div>
            :
              <p className="large mx-auto mb-5">Loading</p>
            }
            {/* <button onClick={() => getRandomDocument()} disabled={sending} className="btn icon-only primary high large mx-auto">Get another name</button> */}
            <div className="d-flex flex-row gap-3">
              <button onClick={() => addToRejected()} className="btn light high icon-only">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.CLOSE}></path>
                </svg>
              </button>
              <button onClick={() => addToShortlist()} className="btn primary high icon-left">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.HEART}></path>
                </svg>
                Shortlist
              </button>
            </div>
            <Link href="/shortlist" className="btn primary medium small text-only mt-4">
              View shortlist
            </Link>
          </div>  
        }
      </div>
    </div>
  )
}

export default Names;