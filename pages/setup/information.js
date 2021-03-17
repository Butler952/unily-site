// Step 2 - Select Info
// Generate profile > [id].js

// Step 1 -  Enter LinkedIn Profile URL (sync)
// Fail > Error message and try again
// Success > Continue to next step

import { useState } from 'react';
import fire from '../../config/fire-config';
import { useRouter } from 'next/router'
import Link from 'next/link';

const Information = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [notify, setNotification] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    fire.auth()
      .signInWithEmailAndPassword(username, password)
      .catch((err) => {

        console.log(err.code, err.message)
        setNotification(err.message)

        setTimeout(() => {
          setNotification('')
        }, 2000)
      })

    setUsername('')
    setPassword('')
    router.push("/")
  }

  return (
    <div>
      <h1>Choose Information</h1>
      {notify}
      <form onSubmit={handleSubmit}>
        LinkedIn profile URL
        <p>We will use this to collect your information on your profile.</p>
        <div>
          https://www.linkedin.com/in/ 
          <input type="text" value={profileUrl} onChange={({target}) => setProfileUrl(target.value)} />
        </div>
        <br />
        <button type="submit">Sync data</button>
      </form>
    </div>
  )

}

export default Information
