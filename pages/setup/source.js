import { useState, useEffect, useContext } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Head from 'next/head';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import Header from '../../components/header/Header';
import { Container } from 'react-bootstrap';
import { UserContext } from '../_app';
import ICONS from 'components/icon/IconPaths';

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
    mixpanel.init(mixpanelConfig); 
    mixpanel.track('Source');
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
      mixpanel.init(mixpanelConfig); 
      mixpanel.register_once({"Source": selectedSource});
      mixpanel.track('Source added');
    })
    .then(() => {
      router.push('/setup/sync')
    })
  }

  const handleBack = (e) => {
    e.preventDefault();

    setSaving(true);

    fire.firestore().collection('users').doc(userData.uid).update({
      stage: '/setup/handle',
      lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        let newUserContext = userContext;
        newUserContext.stage = '/setup/handle';
        setUserContext(newUserContext)
      })
      .then(() => {
        router.push('/setup/handle')
      })
      .catch(error => console.log('error', error));
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

      <Container className="d-flex flex-column align-items-start my-5 py-5" style={{ maxWidth: "640px" }}>
        {screenWidth > 575 ?
          <h2 className="text-dark-high mb-2">How did you hear about Vitaely?</h2>
          :
          <h3 className="text-dark-high mb-2">How did you hear about Vitaely?</h3>
        }
        <p className="large" style={{ maxWidth: '480px' }}>Select one option</p>

        <div className="d-flex flex-column w-100 mt-4">
          <div className="d-flex flex-wrap justify-content-start" style={{gap: '8px'}}>
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
          <div className="d-flex flex-column flex-sm-row align-items-start justify-content-between my-4 my-sm-5 gap-3">
            <button type="button" onClick={(e) => {handleSubmit(e)}} className="btn primary high w-100 w-sm-auto order-0 order-sm-1" disabled={saving || selectedSource == 'Other' ? (otherSourceReason == '' ? true : false) : selectedSource == ''}>Continue</button>
            {screenWidth > 575 ?
              <button type="button" onClick={(e) => handleBack(e)} className="btn dark medium icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.ARROW_LEFT}></path>
                </svg>
              </button>
            :
              <button type="button" onClick={(e) => handleBack(e)} className="btn dark medium w-100 w-sm-auto order-1 order-sm-0" disabled={saving}>Back</button>
            }
          </div>
        </div>
      </Container>
    </div>
  )

}

export default Source
