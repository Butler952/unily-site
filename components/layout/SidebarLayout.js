import { useState, useEffect, useRef } from 'react';
import MenuSidebar from '../header/MenuSidebar';
import Header from '../header/Header';
import { useRouter } from 'next/router';

const SidebarLayout = ({ children }) => {
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  
  // Add ref for the sidebar
  const sidebarRef = useRef(null);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
    if (window.innerWidth > 767 && showMenu) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Add click handler for outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Add event listener when menu is shown
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="overflow-hidden">
      {/* <Header /> */}
      <div className={screenWidth > 767 && `d-flex flex-row`}>
        {screenWidth > 767 ? (
          <div
            ref={sidebarRef}
            style={{ position: "fixed", left: 0, zIndex: 1 }}
          >
            <MenuSidebar />
          </div>
        ) : (
          <div
            ref={sidebarRef}
            style={
              showMenu
                ? { position: "fixed", right: 0, zIndex: 1 }
                : { position: "fixed", right: -240, zIndex: 1 }
            }
            className={`sidebarWrapper ${showMenu && `shadow-5`}`}
          >
            <MenuSidebar smallScreen />
          </div>
        )}
        <div 
          className="w-100" 
          style={screenWidth > 767 ? { marginLeft: '240px' } : { marginLeft: 0 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout; 