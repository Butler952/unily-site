import { useState, useEffect } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import styles from './setup.module.scss'

const Route = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [notify, setNotification] = useState('');
  const [userData, setUserData] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [otherSourceReason, setOtherSourceReason] = useState('');
  const [saving, setSaving] = useState('');

  const router = useRouter();

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    fire.firestore().collection('users').doc(userData.uid).update({
      'stage': '/setup/sync',
      'source': {
        'name': selectedSource,
        'other': selectedSource == 'Other' ? otherSourceReason : null
      },
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      router.push('/setup/sync')
    })
  }

  const toggleSource = (index) => {
    if (selectedSource == sources[index].name) { 
      setSelectedSource('')
    } else {
      setSelectedSource(sources[index].name)
    }
  }

  const sources = [ 
    { name: 'Google' },
    { name: 'Product Hunt' },
    { name: 'Indiehackers' },
    { name: 'Twitter' },
    { name: 'TikTok' },
    { name: 'Facebook' },
    { name: 'Reddit' },
    { name: 'Other' }
  ]

  return (
    <div className="bg-light-900" style={{ minHeight: '100vh' }}>

      <Head>
        <title>How would you like to build your page?</title>
      </Head>
      <Header hideShadow />

      <Container className="d-flex flex-column align-items-center py-5" style={{ maxWidth: "720px" }}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high text-center mb-2">How would you like to build your page?</h2>
          :
          <h3 className="text-dark-high text-center mb-2">How would you like to build your page?</h3>
        }
        {/* <p className="large text-center" style={{ maxWidth: '480px' }}>Select one option</p> */}

        <div className="d-flex flex-column w-100 mt-5">
          <div className="d-flex flex-row justify-content-center gap-4">
            <div className={`${styles.choiceCard}`}>
              <div className="mb-4">
                <h4>Import from Linkedin</h4>
                <p>Simply enter the URL of your Linkedin profile and we’ll grab your information of the content from there.</p>
              </div>
              <button type="button" onClick={(e) => {handleSubmit(e)}} className="btn primary high small w-100" disabled={saving}>Import from Linkedin</button>
            </div>
            <div className={`${styles.choiceCard}`}>
              <div className="mb-4">
                <h4>Add everything manually</h4>
                <p>Fill in your professional information manually.</p>
              </div>
              <button type="button" onClick={(e) => {handleSubmit(e)}} className="btn primary medium small w-100" disabled={saving}>Add manually</button>
            </div>
          </div>
 
        </div>
      </Container>
    </div>
  )

}

export default Route
