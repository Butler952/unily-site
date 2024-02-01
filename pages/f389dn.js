import { useState, useEffect, useContext } from 'react';
import fire from '/config/fire-config';
import Header from 'components/header/Header';

const f389dn = () => {

  const [userData, setUserData] = useState('');

  useEffect(() => {
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setUserData(user)
        }
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  // fire.firestore().collection('testCollection').get().then((querySnapshot) => { 
  //   querySnapshot.forEach((doc) => { 
  //     db.collection("your collection").doc(doc.id).update({
  //       "field": value
  //     }) 
  //   }); 
  // });

  const handleSubmit = (e) => {
    e.preventDefault();

    // fire.firestore().collection('testCollection').get().then((querySnapshot) => { 
    //   querySnapshot.forEach((doc) => { 
    //     fire.firestore().collection("testCollection").doc(doc.id).update({
    //       "newField": doc.data().changeMe,
    //       "changeMe": fire.firestore.FieldValue.delete(),
    //     }) 
    //   }); 
    // });

    fire.firestore().collection('mailingList').get().then((querySnapshot) => { 
      querySnapshot.forEach((doc) => { 
        let newData = doc.data()
        if (newData.subscriberEmail) {
          newData.email = newData.subscriberEmail;
          delete newData.subscriberEmail;
        }
        if (newData.firstName) {
          newData.first_name = newData.firstName;
          delete newData.firstName;
        }
        if (newData.lastName) {
          newData.last_name = newData.lastName;
          delete newData.lastName;
        }
        // newData.first_name = doc.data().firstName ? doc.data().firstName : (doc.data().first_name ? )doc.data().first_name;
        fire.firestore().collection("mailingList").doc(doc.id).set(newData) 
      }); 
    });

    // fire.firestore().collection('testCollection').doc(userData.uid).update({
    //   'profile.headline': headline,
    //   stage: '/setup/template',
    //   lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
    // })
    //   .then(() => {
    //     let newUserContext = userContext;
    //     newUserContext.profile.headline = headline,
    //     newUserContext.stage = '/setup/template',
    //     setUserContext(newUserContext)
    //   })
    //   .catch(error => console.log('error', error));
  }

  return (
    <div>
      <Header positionFixed />
      <div className="d-flex flex-row align-items-center justify-content-center w-100" style={{height: '100vh'}}>
        <button onClick={(e) => handleSubmit(e)}className="btn primary high">Run it</button>
      </div>
    </div>
  )

}

export default f389dn;

