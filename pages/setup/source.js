import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import { UserContext } from '../_app';

const Source = () => {
  const { userContext, setUserContext } = useContext(UserContext);

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
      let newUserContext = userContext;
      newUserContext.stage = '/setup/sync';
      setUserContext(newUserContext)
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
        <title>How did you hear about us?</title>
      </Head>
      <Header hideShadow />

      <Container className="d-flex flex-column align-items-center py-5" style={{ maxWidth: "640px" }}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high text-center mb-2">How did you hear about ExpertPage?</h2>
          :
          <h3 className="text-dark-high text-center mb-2">How did you hear about ExpertPage?</h3>
        }
        <p className="large text-center" style={{ maxWidth: '480px' }}>Select one option</p>

        <div className="d-flex flex-column w-100 mt-4">
          <div className="d-flex flex-wrap justify-content-center" style={{gap: '8px'}}>
          {sources.map((source, index) => {
            return (
              <button 
                key={index} 
                onClick={() => toggleSource(index)}
                className={`tag interactive primary ${selectedSource == source.name ? 'high' : 'medium'}`}>{source.name}
              </button>
            )
          })}
          </div>
          { selectedSource == 'Other' &&
            <div className="mt-5">
              <p className="mb-2">Okay, so where did you hear about us?</p>
              <input
                type="text"
                className="small w-100"
                disabled={saving}
                value={otherSourceReason}
                onChange={({ target }) => setOtherSourceReason(target.value)}
              />
            </div>
          }
          <br />
          <div className="d-flex flex-column align-items-center my-4 my-sm-5">
            {screenWidth > 575 ?
              <button type="button" onClick={(e) => {handleSubmit(e)}} className="btn primary high w-100" style={{ maxWidth: '320px' }} disabled={selectedSource == 'Other' ? (otherSourceReason == '' ? true : false) : selectedSource == ''}>Continue</button>
              :
              <button type="button" onClick={(e) => {handleSubmit(e)}} className="btn primary high w-100" disabled={selectedSource == 'Other' ? (otherSourceReason == '' ? true : false) : selectedSource == ''}>Continue</button>
            }
          </div>
        </div>
      </Container>
    </div>
  )

}

export default Source
