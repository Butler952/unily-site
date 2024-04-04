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
import NAMES from './names';
import { UserContext } from 'pages/_app';


const Shortlist = () => {
  const { userContext, setUserContext } = useContext(UserContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState('')

  const [screenWidth, setScreenWidth] = useState('');
  const [removing, setRemoving] = useState(false);
  const [shortlist, setShortlist] = useState(userContext && userContext.shortlist ? userContext.shortlist : [])
  const [retreivingNames, setRetreivingNames] = useState(true);
  const [retreivedNames, setRetreivedNames] = useState([])

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
          if (userContext == '' && typeof localStorage.shortlist != "undefined") {
            setShortlist(JSON.parse(localStorage.shortlist))
            getNames(JSON.parse(localStorage.shortlist))
            setRetreivingNames(false)
          } else {
            setRetreivingNames(false)
          }
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const loggedInRoute = (user) => {
    setLoggedIn(true)
    setUserData(user)
    // console.log(user)
    fire.firestore().collection('users').doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          setUserContext(doc.data())
          setShortlist(doc.data().shortlist)
          getNames(doc.data().shortlist)
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      })
  }

  const removeName = (nameId) => {
    setRemoving(true)
    let idArray = shortlist
    let namesArray = retreivedNames

    const filteredIdArray = idArray.filter(id => id !== nameId);
    const filteredNamesArray = namesArray.filter(name => name.id !== nameId);

    setShortlist(filteredIdArray)

    if (loggedIn) {
      fire.firestore().collection('users').doc(userData.uid).update({
        shortlist: filteredIdArray,
        lastUpdated: fire.firestore.FieldValue.serverTimestamp()
      })
      .catch((err) => {
        console.log(err.code, err.message)
      })
    } else {
      localStorage.setItem("shortlist", JSON.stringify(filteredIdArray));
    }
    setRetreivedNames(filteredNamesArray)
    // console.log(filteredIdArray)
    // console.log(nameId)
    setRemoving(false)

  }


  const getNames = (shortlistIds) => {

      // let an empty name array
      // for each item in the shortlist array
      // get the name from firebase
      // add each name object to the name array
      // setRetreivingNames(false)

    if (shortlistIds) {
      let namesArray = [];
      for (let i = 0; i < shortlistIds.length; i++) {
        const nameId = shortlistIds[i];
        fire.firestore().collection('names').doc(nameId).get()
          .then((doc) => {
            let nameData = doc.data();
            nameData.id = nameId;
            namesArray.push(nameData);
          })
          .then(() => {
            if (i === shortlistIds.length - 1) {
              setRetreivedNames(namesArray);
              setRetreivingNames(false);
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      }
    }
    // if (shortlistIds) {

    //   let namesArray = []
    //   shortlistIds.forEach((nameId) => {
    //     fire.firestore().collection('names').doc(nameId).get()
    //     .then((doc) => {
    //       // console.log(doc.data())
    //       let nameData = doc.data()
    //       nameData.id = nameId
    //       namesArray.push(nameData)
    //     })
    //     .then(() => {
    //       setRetreivedNames(namesArray)
    //       setRetreivingNames(false)
    //     })
    //     .catch((error) => {
    //       console.log("Error getting document:", error);
    //     })
    //   })
    // } 
    else {
      setRetreivingNames(false)
      console.log('no names in shortlist')
    }
  };

  return (
    <div className="overflow-hidden" style={{ background: 'white' }}>
      <Header positionFixed hideShadow />
      <Head>
        <title>Shortlist</title>
        <meta name="description" content="Turn your Linkedin profile into a resume in just two minutes." />
        <meta property="og:title" content="Turn your Linkedin profile into a resume | vitaely.me" />
        <meta property="og:description" content="Turn your Linkedin profile into a resume in just two minutes." />
        <meta property="og:url" content="https://www.vitaely.me/linkedin-to-resume" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me%2Flinkedin-to-resume"/> */}
      </Head>
      <div className="d-flex flex-column align-items-start mx-5" style={{minHeight: '100vh', paddingTop: '120px', paddingBottom: '120px'}}>
        {/* {shortlist.map((id, index) => <p key={index} className="large">{id}</p>)} */}
        {!retreivingNames ? 
          <div>
            {retreivedNames.length > 0 ?
              <div className="d-flex flex-column align-items-start justify-content-center gap-3 w-100">
                {retreivedNames.map((name, index) => {
                  return (
                    <div key={index} className="d-flex flex-row justify-content-between w-100">
                      <div>
                        <h3 className="mb-3" style={{ maxWidth: "720px" }}>{name?.name}</h3> 
                        <div className="mb-4">   
                          {name.description?.map((description, index) => {
                            return (
                              <p key={index} className="large">{description.content}</p>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <button onClick={() => removeName(name.id)} disabled={removing} className="btn icon-only dark low large">
                          <svg viewBox="0 0 24 24">
                            <path d={ICONS.DELETE}></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            :
              <p className="large mx-auto mb-5">No names in shortlist</p>
            }
            <Link href="/names" className="btn primary medium small text-only mt-4">
              Find more names
            </Link>
          </div>
        :
          <p className="large mx-auto mb-5">Loading</p>
        }
        {/* <button onClick={() => getRandomDocument()} disabled={sending} className="btn icon-only primary high large mx-auto">Get another name</button> */}
      </div>  
    </div>
  )
}

export default Shortlist;