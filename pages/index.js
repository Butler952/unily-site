import { useState, useEffect } from 'react';
import Head from 'next/head';
import fire from '../config/fire-config';
import CreatePost from '../components/CreatePost';
import { useRouter } from 'next/router'
import Link from 'next/link';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  fire.auth()
    .onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true)
        loggedInRoute(user)
      } else {
        setLoggedIn(false)
      }
    })


    const loggedInRoute = (user) => {
      var docRef = fire.firestore().collection('users').doc(user.uid)

      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          router.push(doc.data().stage)
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });

      /*
      fire.firestore().collection('users').doc(user.uid).set({
        receiveEmails,
        email: user.email,
        stage: '/setup/sync'
      })
      .then(() => {
        router.push("/setup/sync")
      })*/
    }
    

  useEffect(() => {
    const unsubscribe =  fire.firestore()
      .collection('blog')
      .onSnapshot(snap => {
        const blogs = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogs);
      });
      return () => {
        // Unmouting
        unsubscribe();
      };
  }, []);

  const handleLogout = () => {
    fire.auth()
      .signOut()
      .then(() => {
        setNotification('Logged out')
        setTimeout(() => {
          setNotification('')
        }, 2000)
      });
  }

  return (
    <div>
      <Head>
        <title>Personal Page Generator App</title>
      </Head>
      <h1>Personal Page Generator</h1>
      {notification}
      {!loggedIn 
      ?
        <div>
          <Link href="/users/register">
            <a>Register</a>
          </Link> | 
          <Link href="/users/login">
            <a> Login</a>
          </Link>
        </div>
      :
        <button onClick={handleLogout}>Logout</button>
      }

      <ul>
        {blogs.map(blog =>
          <li key={blog.id}>
            <Link href="/profile/[id]" as={'/profile/' + blog.id }>
              <a itemProp="hello">{blog.title}</a>
            </Link>
          </li>
        )}
      </ul>
      {loggedIn && <CreatePost />}
    </div>
  )
}

export default Home;