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

    // fire.firestore().collection('mailingList').get().then((querySnapshot) => { 
    //   querySnapshot.forEach((doc) => { 
    //     let newData = doc.data()
    //     let custom_fields = {
    //       'signUpSurveyComplete': newData.signUpSurveyComplete ? newData.signUpSurveyComplete : (newData?.custom_fields?.signUpSurveyComplete ? newData.custom_fields.signUpSurveyComplete : false),
    //       'stage': newData.stage ? newData.stage : (newData?.custom_fields?.stage ? newData.custom_fields.stage : null),
    //     }
    //     if (newData.signUpSurveyComplete !== undefined) {
    //       delete newData.signUpSurveyComplete;
    //     }
    //     if (newData.stage !== undefined) {
    //       delete newData.stage;
    //     }
    //     newData.custom_fields = custom_fields
    //     fire.firestore().collection("mailingList").doc(doc.id).set(newData)  
    //   }); 
    // });

    fire.firestore().collection('mailingList').get().then((querySnapshot) => { 
      querySnapshot.forEach((doc) => { 
        let newData = doc.data()
        let custom_fields = {
          'signUpSurveyComplete': newData.signUpSurveyComplete !== undefined ? newData.signUpSurveyComplete : (newData?.custom_fields?.signUpSurveyComplete !== undefined ? newData.custom_fields.signUpSurveyComplete : false),
          'stage': newData.stage ? newData.stage : (newData?.custom_fields?.stage ? newData.custom_fields.stage : null),
        }
        if (newData.signUpSurveyComplete !== undefined) {
          delete newData.signUpSurveyComplete;
        }
        if (newData.stage !== undefined) {
          delete newData.stage;
        }
        newData.custom_fields = custom_fields
        fire.firestore().collection("mailingList").doc(doc.id).set(newData)  
      }); 
    });
    
    // fire.firestore().collection('mailingList').get().then((querySnapshot) => { 
    //   querySnapshot.forEach((doc) => { 
    //     let newData = doc.data()
    //     let custom_fields = {
    //       'signUpSurveyComplete': newData.signUpSurveyComplete == null ? false : newData.custom_fields.signUpSurveyComplete,
    //       'stage': newData.stage ? newData.stage : (newData?.custom_fields?.stage ? newData.custom_fields.stage : null),
    //     }
    //     if (newData.signUpSurveyComplete !== undefined) {
    //       delete newData.signUpSurveyComplete;
    //     }
    //     if (newData.stage !== undefined) {
    //       delete newData.stage;
    //     }
    //     newData.custom_fields = custom_fields
    //     fire.firestore().collection("mailingList").doc(doc.id).set(newData)  
    //   }); 
    // });

    // fire.firestore().collection('testCollection').get().then((querySnapshot) => { 
    //   querySnapshot.forEach((doc) => { 
    //     let newData = doc.data()
    //     let custom_fields = {
    //       'newField': newData.newField ? newData.newField : (newData?.custom_fields?.newField ? newData.custom_fields.newField : null),
    //       'notMe': newData.notMe ? newData.notMe : (newData?.custom_fields?.notMe ? newData.custom_fields.notMe : null),
    //     }

    //     // let newData.custom_fields.newField
    //     // if (newData.subscriberEmail) {
    //     //   newData.email = newData.subscriberEmail;
    //     //   delete newData.subscriberEmail;
    //     // }
    //     // if (newData.firstName) {
    //     //   newData.first_name = newData.firstName;
    //     //   delete newData.firstName;
    //     // }
    //     // if (newData.lastName) {
    //     //   newData.last_name = newData.lastName;
    //     //   delete newData.lastName;
    //     // }
    //     if (newData.newField) {
    //       // newData.custom_fields.newField = newData.newField
    //       delete newData.newField;
    //     }
    //     if (newData.notMe) {
    //       // newData.custom_fields.notMe = newData.notMe
    //       delete newData.notMe;
    //     }
    //     newData.custom_fields = custom_fields
    //     // newData.first_name = doc.data().firstName ? doc.data().firstName : (doc.data().first_name ? )doc.data().first_name;
    //     fire.firestore().collection("testCollection").doc(doc.id).set(newData) 
    //     // fire.firestore().collection("testCollection").doc(doc.id).set({
    //     //   displayInfo: {
    //     //     'basicInfo': {
    //     //       'section': true,
    //     //       'each': {
    //     //         'profilePic': true,
    //     //         'headerImage': true,
    //     //         'name': true,
    //     //         'headline': true,
    //     //         'email': true
    //     //       }
    //     //     },
    //     //     about: result.summary === null ? false : true,
    //     //     'experience': {
    //     //       'section': result.experiences < 1 ? false : true,
    //     //       'each': createExperienceList(result.experiences)
    //     //     },
    //     //     'education': {
    //     //       'section': result.education < 1 ? false : true,
    //     //       'each': createEducationList(result.education)
    //     //     },
    //     //     'volunteering': {
    //     //       'section': result.volunteer_work < 1 ? false : true,
    //     //       'each': createVolunteerList(result.volunteer_work)
    //     //     },
    //     //   },
    //     // }) 
    //   }); 
    // });

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

