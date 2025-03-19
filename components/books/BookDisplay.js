import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import styles from "../../pages/index.module.scss";
import IllustrationIliad from "../index/IllustrationIliad";
import IllustrationOdyssey from "../index/IllustrationOdyssey";

const BookDisplay = ({ isIliadActive, isOdysseyActive, navigateToView, viewportHeight, screenWidth }) => {
  const [iliadCardHovered, setIliadCardHovered] = useState(false);
  const [odysseyCardHovered, setOdysseyCardHovered] = useState(false);
  const [iliadZIndexDelay, setIliadZIndexDelay] = useState(false);
  const [odysseyZIndexDelay, setOdysseyZIndexDelay] = useState(false);
  
  // Handle the delayed z-index change for Iliad
  useEffect(() => {
    let timer;
    if (!isIliadActive && !iliadCardHovered) {
      // When no longer active/hovered, set delay flag
      setIliadZIndexDelay(true);
      // After delay time, clear the delay flag
      timer = setTimeout(() => {
        setIliadZIndexDelay(false);
      }, 250);
    } else {
      // Immediately clear delay flag when active/hovered
      setIliadZIndexDelay(false);
    }
    
    return () => clearTimeout(timer);
  }, [isIliadActive, iliadCardHovered]);

  // Handle the delayed z-index change for Odyssey
  useEffect(() => {
    let timer;
    if (!isOdysseyActive && !odysseyCardHovered) {
      // When no longer active/hovered, set delay flag
      setOdysseyZIndexDelay(true);
      // After delay time, clear the delay flag
      timer = setTimeout(() => {
        setOdysseyZIndexDelay(false);
      }, 250);
    } else {
      // Immediately clear delay flag when active/hovered
      setOdysseyZIndexDelay(false);
    }
    
    return () => clearTimeout(timer);
  }, [isOdysseyActive, odysseyCardHovered]);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center border-0 border-bottom-1 border-solid border-dark-300 overflow-hidden transition-long"
      style={{ height: (isIliadActive || isOdysseyActive) ? `${viewportHeight}px` : (screenWidth <= 767 ? "1000px" : "440px") }}
    >
      <div
        className="container d-flex flex-column align-items-center justify-content-center transition-long"
        style={{
          paddingTop: (isIliadActive || isOdysseyActive) ? "0" : "160px",
          paddingBottom: (isIliadActive || isOdysseyActive) ? "0" : "0",
        }}
      >
        <div
          className="d-flex flex-column align-items-center justify-content-center w-100 gap-5"
          style={{ maxWidth: "960px" }}
        >
          <div className="w-100 align-items-center justify-content-center d-flex flex-column flex-md-row gap-5">
            {/* Iliad Book */}
            <div style={{ 
              perspective: "1200px", 
              width: screenWidth <= 767 ? '300px' : (isOdysseyActive ? '0px' : '300px'),
              height: screenWidth <= 767 ? (isOdysseyActive ? '0px' : '450px') : '450px',
              transition: screenWidth <= 767 
                ? "height 1s ease, padding-top 1s ease" 
                : "width 1s ease, padding-top 1s ease",
              paddingTop: isIliadActive ? '150px' : '0px',
              zIndex: isIliadActive || iliadCardHovered || iliadZIndexDelay ? 1 : 0
            }}>
              <div
                className={`
                  ${styles.book} 
                  ${ isIliadActive ? styles.active : ""}
                  ${ isOdysseyActive ? styles.inactive : ""}
                `}
                onClick={() => navigateToView('iliad')}
                onMouseEnter={() => setIliadCardHovered(true)}
                onMouseLeave={() => setIliadCardHovered(false)}
              >
                <div className={`${styles.back} ${styles.iliad}`}></div>
                <div
                  className={`${styles.page6}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ rotate: "90deg", transform: "scale(-1, -1)" }}>
                    <p className="mb-0">Hero of Athens, 1.265</p>
                  </div>
                </div>
                <div
                  className={`${styles.page5}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ rotate: "90deg", transform: "scale(-1, 1)" }}>
                    <h3 className="mb-0">Theseus</h3>
                  </div>
                </div>
                <div className={`${styles.page4}`}></div>
                <div className={`${styles.page3}`}></div>
                <div className={`${styles.page2}`}></div>
                <div className={`${styles.page1}`}></div>
                <div className={`${styles.front} ${styles.iliad} shine`}>
                  <div
                    className="position-absolute"
                    style={{
                      top: "8%",
                      left: "16%",
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                    }}
                  >
                    <h5 className="mb-0">Iliad</h5>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: "-12.5%",
                      top: "0",
                      width: "125%",
                    }}
                  >
                    <IllustrationIliad width="100%" height="100%" />
                  </div>
                </div>
              </div>
            </div>

            {/* Odyssey Book */}
            <div style={{ 
              perspective: "1200px",
              width: screenWidth <= 767 ? '300px' : (isIliadActive ? '0px' : '300px'),
              height: screenWidth <= 767 ? (isIliadActive ? '0px' : '450px') : '450px',
              transition: screenWidth <= 767 
                ? "height 1s ease, padding-top 1s ease" 
                : "width 1s ease, padding-top 1s ease",
              paddingTop: isOdysseyActive ? '150px' : '0px',
              zIndex: isOdysseyActive || odysseyCardHovered || odysseyZIndexDelay ? 1 : 0
            }}>
              <div
                className={`
                  ${styles.book} 
                  ${ isOdysseyActive ? styles.active : ""}
                  ${ isIliadActive ? styles.inactive : ""}
                `}
                onClick={() => navigateToView('odyssey')}
                onMouseEnter={() => setOdysseyCardHovered(true)}
                onMouseLeave={() => setOdysseyCardHovered(false)}
              >
                <div className={`${styles.back} ${styles.odyssey}`}></div>
                <div
                  className={`${styles.page6}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ rotate: "90deg", transform: "scale(-1, -1)" }}>
                    <p className="mb-0">Hero of Athens, 1.265</p>
                  </div>
                </div>
                <div
                  className={`${styles.page5}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ rotate: "90deg", transform: "scale(-1, 1)" }}>
                    <h3 className="mb-0">Theseus</h3>
                  </div>
                </div>
                <div className={`${styles.page4}`}></div>
                <div className={`${styles.page3}`}></div>
                <div className={`${styles.page2}`}></div>
                <div className={`${styles.page1}`}></div>
                <div className={`${styles.front} ${styles.odyssey} shine`}>
                  <div
                    className="position-absolute"
                    style={{
                      top: "8%",
                      left: "16%",
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                    }}
                  >
                    <h5 className="mb-0">Odyssey</h5>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: "-3%",
                      top: "-1%",
                      width: "205%",
                    }}
                  >
                    <IllustrationOdyssey width="100%" height="100%" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDisplay; 