import { useState, useEffect } from 'react';
import Link from 'next/link';
//import "./Blog.scss"
import Post from '../../components/blog/Post';
import styles from './blog.module.scss';
import Header from '../../components/header/Header';
import PostCard from '../../components/blog/PostCard';

const Blog = () => {

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Header />
      <div className="container py-5">
        <div className="d-flex flex-column" style={{gap: '24px'}}>
          <PostCard 
            image="../../images/profile-preview.png"
            title="How to create a personal landing page"
            duration="2"
            bodyPreview="A landing page is typically the first page that a user may come to when looking for information about a particular product..."
            postUrl="/blog/how-to-create-a-personal-landing-page"
          />
          <PostCard 
            // image="../../images/profile-preview.png"
            title="How to create an online CV in 2 minutes"
            duration="2"
            bodyPreview="Much like an offline CV; an online CV is a chance to share a bit about yourself, your professional experience and you..."
            postUrl="/blog/how-to-create-an-online-cv"
          />
        </div>
      </div>
    </div>
  )
}

export default Blog;

