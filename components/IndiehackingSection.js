import React, { forwardRef, useState, useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";

const IndiehackingSection = forwardRef((props, ref) => {
  // Add state for animations
  const [headerStyle, setHeaderStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  
  // States for each project's animations
  const [vitaelyStyle, setVitaelyStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [vitaelyImgStyle, setVitaelyImgStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  
  const [smartChainStyle, setSmartChainStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [smartChainImgStyle, setSmartChainImgStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  
  const [talentDojoStyle, setTalentDojoStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [talentDojoImg1Style, setTalentDojoImg1Style] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [talentDojoImg2Style, setTalentDojoImg2Style] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [talentDojoImg3Style, setTalentDojoImg3Style] = useState({ opacity: 0, transform: 'translateY(24px)' });
  
  const [expertPageStyle, setExpertPageStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [expertPageImgStyle, setExpertPageImgStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  
  const [bambooStyle, setBambooStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [bambooImgStyle, setBambooImgStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  
  const [hiStartupStyle, setHiStartupStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [hiStartupImgStyle, setHiStartupImgStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  
  const [epicBabyStyle, setEpicBabyStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [epicBabyImgStyle, setEpicBabyImgStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  
  const [playbookStyle, setPlaybookStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });
  const [playbookImgStyle, setPlaybookImgStyle] = useState({ opacity: 0, transform: 'translateY(24px)' });

  // Create refs for all elements
  const headerRef = useRef(null);
  
  const vitaelyRef = useRef(null);
  const vitaelyImgRef = useRef(null);
  
  const smartChainRef = useRef(null);
  const smartChainImgRef = useRef(null);
  
  const talentDojoRef = useRef(null);
  const talentDojoImg1Ref = useRef(null);
  const talentDojoImg2Ref = useRef(null);
  const talentDojoImg3Ref = useRef(null);
  
  const expertPageRef = useRef(null);
  const expertPageImgRef = useRef(null);
  
  const bambooRef = useRef(null);
  const bambooImgRef = useRef(null);
  
  const hiStartupRef = useRef(null);
  const hiStartupImgRef = useRef(null);
  
  const epicBabyRef = useRef(null);
  const epicBabyImgRef = useRef(null);
  
  const playbookRef = useRef(null);
  const playbookImgRef = useRef(null);

  // Set up intersection observers
  useEffect(() => {
    const options = { threshold: 0.2 };
    
    const createObserver = (elementRef, setStyle) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStyle({ opacity: 1, transform: 'translateY(0)' });
            observer.disconnect();
          }
        },
        options
      );
      
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      
      return observer;
    };
    
    const observers = [
      createObserver(headerRef, setHeaderStyle),
      
      createObserver(vitaelyRef, setVitaelyStyle),
      createObserver(vitaelyImgRef, setVitaelyImgStyle),
      
      createObserver(smartChainRef, setSmartChainStyle),
      createObserver(smartChainImgRef, setSmartChainImgStyle),
      
      createObserver(talentDojoRef, setTalentDojoStyle),
      createObserver(talentDojoImg1Ref, setTalentDojoImg1Style),
      createObserver(talentDojoImg2Ref, setTalentDojoImg2Style),
      createObserver(talentDojoImg3Ref, setTalentDojoImg3Style),
      
      createObserver(expertPageRef, setExpertPageStyle),
      createObserver(expertPageImgRef, setExpertPageImgStyle),
      
      createObserver(bambooRef, setBambooStyle),
      createObserver(bambooImgRef, setBambooImgStyle),
      
      createObserver(hiStartupRef, setHiStartupStyle),
      createObserver(hiStartupImgRef, setHiStartupImgStyle),
      
      createObserver(epicBabyRef, setEpicBabyStyle),
      createObserver(epicBabyImgRef, setEpicBabyImgStyle),
      
      createObserver(playbookRef, setPlaybookStyle),
      createObserver(playbookImgRef, setPlaybookImgStyle)
    ];
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);
  
  const transitionStyle = {
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
  };

  return (
    <div ref={ref} className="d-flex flex-column align-items-start" style={{ marginTop: "120px", marginBottom: "120px", gap: "64px" }}>
      <div 
        ref={headerRef} 
        className="d-flex flex-column align-items-start"
        style={{
          ...headerStyle,
          ...transitionStyle
        }}
      >
        <h5 className="text-dark-low mb-0">Indiehacking</h5>
        <h3>Building things</h3>
        <h6 className="text-dark-low mb-2">
          Having got a real taste of turning an idea into a product-led
          business, I could think of nothing else but to build and launch my
          own. Here's a list of products I've built and some that are in the
          works.
        </h6>
      </div>
      
      {/* Vitaely */}
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <div 
          ref={vitaelyRef}
          style={{
            ...vitaelyStyle,
            ...transitionStyle,
            width: '100%'
          }}
        >
          <ProjectCard
            logo={{
              src: "/images/vitaely.png",
              alt: "Vitaely",
            }}
            name="Vitaely"
            description="Turn your LinkedIn profile into a landing page in two minutes"
            url="https://vitaely.me"
            technologies={[
              { id: "cursor", name: "Cursor", icon: "/images/cursor.png" },
              { id: "next", name: "Next.js", icon: "/images/next.png" },
              { id: "vercel", name: "Vercel", icon: "/images/vercel.png" },
              {
                id: "firebase",
                name: "Firebase",
                icon: "/images/firebase.png",
              },
              { id: "stripe", name: "Stripe", icon: "/images/stripe.png" },
            ]}
          />
        </div>

        <div 
          ref={vitaelyImgRef}
          className="d-flex flex-row align-items-start gap-0 w-100"
          style={{
            ...vitaelyImgStyle,
            ...transitionStyle
          }}
        >
          <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4">
            <div className="position-relative w-100 aspect-ratio-wide">
              <img
                width="400"
                src="/images/vitaely-1.png"
                alt="Vitaely screenshot 1"
                className="image-ff rotate-6 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
          <div
            className="d-flex flex-column align-items-center gap-5 mr-0"
            style={{ width: "40%", marginLeft: "-24px" }}
          >
            <div className="position-relative aspect-ratio-tall">
              <img
                width="400"
                src="/images/vitaely-2.png"
                alt="Vitaely screenshot 2"
                className="image-ff rotate-3 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                  backgroundColor: "white",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Smart Chain Tracker */}
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <div 
          ref={smartChainRef}
          style={{
            ...smartChainStyle,
            ...transitionStyle,
            width: '100%'
          }}
        >
          <ProjectCard
            logo={{
              src: "/images/smart-chain-tracker.png",
              alt: "Smart Chain Tracker",
            }}
            name="Smart Chain Tracker"
            url="https://bsc-crypto-tracker.vercel.app/"
            description="View your Binance Smart Chain portfolio"
            technologies={[
              { id: "next", name: "Next.js", icon: "/images/next.png" },
              { id: "vercel", name: "Vercel", icon: "/images/vercel.png" },
              {
                id: "firebase",
                name: "Firebase",
                icon: "/images/firebase.png",
              },
              {
                id: "metamask",
                name: "Metamask",
                icon: "/images/metamask.png",
              },
            ]}
          />
        </div>

        <div 
          ref={smartChainImgRef}
          className="d-flex flex-row align-items-start gap-0 w-100"
          style={{
            ...smartChainImgStyle,
            ...transitionStyle
          }}
        >
          <div
            className="d-flex flex-column align-items-center gap-5 mr-0"
            style={{ width: "60%" }}
          >
            <div className="position-relative aspect-ratio-square">
              <img
                width="400"
                src="/images/smart-chain-tracker-1.png"
                alt="Smart Chain Tracker screenshot 1"
                className="image-ff rotate-2 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 2,
                }}
              />
            </div>
          </div>
          <div
            className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-5"
            style={{ marginLeft: "-24px" }}
          >
            <div className="position-relative w-100 aspect-ratio-wide">
              <img
                width="400"
                src="/images/smart-chain-tracker-2.png"
                alt="Smart Chain Tracker screenshot 2"
                className="image-ff rotate-3 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Talent Dojo */}
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <div 
          ref={talentDojoRef}
          style={{
            ...talentDojoStyle,
            ...transitionStyle,
            width: '100%'
          }}
        >
          <ProjectCard
            logo={{
              src: "/images/talentdojo.png",
              alt: "Talent Dojo",
            }}
            name="Talent Dojo"
            url="https://recruitment-data-tool.vercel.app/"
            description="Make an anonymised resume from a LinkedIn profile"
            technologies={[
              { id: "next", name: "Next.js", icon: "/images/next.png" },
              { id: "vercel", name: "Vercel", icon: "/images/vercel.png" },
            ]}
          />
        </div>

        <div className="d-flex flex-column align-items-center gap-0 w-100">
          <div 
            ref={talentDojoImg1Ref}
            className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-md-4"
            style={{
              ...talentDojoImg1Style,
              ...transitionStyle
            }}
          >
            <div className="position-relative w-100 aspect-ratio-wide-2">
              <img
                width="400"
                src="/images/talentdojo-1.png"
                alt="Talent Dojo screenshot 1"
                className="image-ff rotate-2 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
          <div 
            ref={talentDojoImg2Ref}
            className="d-flex flex-column align-items-start gap-4 w-100 mb-4"
            style={{
              ...talentDojoImg2Style,
              ...transitionStyle
            }}
          >
            <div className="position-relative w-100 aspect-ratio-wide-2">
              <img
                width="400"
                src="/images/talentdojo-2.png"
                alt="Talent Dojo screenshot 2"
                className="image-ff rotate-3 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
          <div 
            ref={talentDojoImg3Ref}
            className="d-flex flex-column align-items-start gap-4 w-100 mb-4"
            style={{
              ...talentDojoImg3Style,
              ...transitionStyle
            }}
          >
            <div className="position-relative w-100 aspect-ratio-wide">
              <img
                width="400"
                src="/images/talentdojo-3.png"
                alt="Talent Dojo screenshot 3"
                className="image-ff rotate-2 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Expert Page */}
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <div 
          ref={expertPageRef}
          style={{
            ...expertPageStyle,
            ...transitionStyle,
            width: '100%'
          }}
        >
          <ProjectCard
            logo={{
              src: "/images/expertpage.png",
              alt: "Expert Page",
            }}
            name="Expert Page"
            url="https://expertpage.io/"
            description="Make your own professional site for freelancers, consultants and small business owners"
            technologies={[
              { id: "next", name: "Next.js", icon: "/images/next.png" },
              { id: "vercel", name: "Vercel", icon: "/images/vercel.png" },
              {
                id: "firebase",
                name: "Firebase",
                icon: "/images/firebase.png",
              },
              { id: "stripe", name: "Stripe", icon: "/images/stripe.png" },
            ]}
          />
        </div>

        <div 
          ref={expertPageImgRef}
          className="d-flex flex-column align-items-center gap-0 w-100"
          style={{
            ...expertPageImgStyle,
            ...transitionStyle
          }}
        >
          <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-md-4">
            <div className="position-relative w-100 aspect-ratio-wide">
              <img
                width="400"
                src="/images/expertpage-1.png"
                alt="Expert Page screenshot 1"
                className="image-ff rotate-1 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bamboo */}
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <div 
          ref={bambooRef}
          style={{
            ...bambooStyle,
            ...transitionStyle,
            width: '100%'
          }}
        >
          <ProjectCard
            logo={{
              src: "/images/bamboo.png",
              alt: "Bamboo",
            }}
            name="Bamboo"
            url="https://getbamboo.co.uk/"
            description="Build credit with a debit card"
            technologies={[
              { id: "react", name: "React", icon: "/images/react.png" },
              { id: "gatsby", name: "Gatsby", icon: "/images/gatsby.png" },
              { id: "netlify", name: "Netlify", icon: "/images/netlify.png" },
              {
                id: "sheets",
                name: "Google Sheets",
                icon: "/images/sheets.png",
              },
            ]}
          />
        </div>

        <div 
          ref={bambooImgRef}
          className="d-flex flex-row align-items-start gap-0 w-100"
          style={{
            ...bambooImgStyle,
            ...transitionStyle
          }}
        >
          <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4">
            <div className="position-relative w-100 aspect-ratio-wide-2">
              <video
                width="400"
                src="/images/bamboo-1.mp4"
                autoPlay
                muted
                loop
                playsInline
                alt="Bamboo screenshot 1"
                className="image-ff rotate-6 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
          <div
            className="d-flex flex-column align-items-center gap-5"
            style={{
              width: "40%",
              marginLeft: "-120px",
              marginTop: "180px",
            }}
          >
            <div className="position-relative aspect-ratio-4-3">
              <img
                width="400"
                src="/images/bamboo-2.png"
                alt="Bamboo screenshot 2"
                className="image-ff rotate-3 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                  backgroundColor: "white",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* HiStartup */}
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <div 
          ref={hiStartupRef}
          style={{
            ...hiStartupStyle,
            ...transitionStyle,
            width: '100%'
          }}
        >
          <ProjectCard
            logo={{
              src: "/images/histartup.png",
              alt: "HiStartup",
            }}
            name="HiStartup"
            url="https://histartup.co.k/"
            description="Where startups and investors discover each other"
            technologies={[
              { id: "react", name: "React", icon: "/images/react.png" },
              { id: "gatsby", name: "Gatsby", icon: "/images/gatsby.png" },
              { id: "netlify", name: "Netlify", icon: "/images/netlify.png" },
              {
                id: "firebase",
                name: "Firebase",
                icon: "/images/firebase.png",
              },
            ]}
          />
        </div>

        <div 
          ref={hiStartupImgRef}
          className="d-flex flex-column align-items-center gap-0 w-100"
          style={{
            ...hiStartupImgStyle,
            ...transitionStyle
          }}
        >
          <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-md-4">
            <div className="position-relative w-100 aspect-ratio-wide">
              <img
                width="400"
                src="/images/histartup-1.png"
                alt="HiStartup screenshot 1"
                className="image-ff rotate-2 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Epic Baby Names */}
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <div 
          ref={epicBabyRef}
          style={{
            ...epicBabyStyle,
            ...transitionStyle,
            width: '100%'
          }}
        >
          <ProjectCard
            logo={{
              src: "/images/epic-baby-names.png",
              alt: "Epic Baby Names",
            }}
            name="Epic Baby Names"
            url="https://epicbababynames.com"
            description="With hundreds of names from Homer's epic poems, you'll never have to call your kid Michael or Samantha ever again."
            technologies={[
              { id: "cursor", name: "Cursor", icon: "/images/cursor.png" },
              { id: "next", name: "Next.js", icon: "/images/next.png" },
              { id: "vercel", name: "Vercel", icon: "/images/vercel.png" },
              {
                id: "firebase",
                name: "Firebase",
                icon: "/images/firebase.png",
              },
              { id: "stripe", name: "Stripe", icon: "/images/stripe.png" },
            ]}
          />
        </div>

        <div 
          ref={epicBabyImgRef}
          className="d-flex flex-column align-items-center gap-0 w-100"
          style={{
            ...epicBabyImgStyle,
            ...transitionStyle
          }}
        >
          <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-md-4">
            <div className="position-relative w-100 aspect-ratio-wide">
              <video
                width="400"
                src="/images/epic-baby-names.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="image-ff rotate-1 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Playbook Quiz */}
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <div 
          ref={playbookRef}
          style={{
            ...playbookStyle,
            ...transitionStyle,
            width: '100%'
          }}
        >
          <ProjectCard
            logo={{
              src: "/images/playbook.png",
              alt: "Playbook Quiz",
            }}
            name="Playbook Quiz"
            description="Create and learn an American Football playbook with auto-generated bite-size quizzes"
            url="https://football-playbook-sage.vercel.app/"
            technologies={[
              { id: "cursor", name: "Cursor", icon: "/images/cursor.png" },
              { id: "v0", name: "V0", icon: "/images/v0.png" },
              { id: "next", name: "Next.js", icon: "/images/next.png" },
              { id: "vercel", name: "Vercel", icon: "/images/vercel.png" },
              {
                id: "firebase",
                name: "Firebase",
                icon: "/images/firebase.png",
              },
            ]}
          />
        </div>

        <div 
          ref={playbookImgRef}
          className="d-flex flex-row align-items-start gap-0 w-100 mt-3 mt-md-5"
          style={{
            ...playbookImgStyle,
            ...transitionStyle
          }}
        >
          <div
            className="d-flex flex-column align-items-center gap-5 mr-0"
            style={{ width: "60%", marginTop: "120px" }}
          >
            <div className="position-relative aspect-ratio-square">
              <img
                width="400"
                src="/images/playbook-1.png"
                alt="Playbook Quiz screenshot 1"
                className="image-ff rotate-2 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 2,
                }}
              />
            </div>
          </div>
          <div
            className="d-flex flex-column align-items-start gap-4 w-100 mb-4"
            style={{ marginLeft: "-160px" }}
          >
            <div className="position-relative w-100 aspect-ratio-wide">
              <img
                width="400"
                src="/images/playbook-2.png"
                alt="Playbook Quiz screenshot 2"
                className="image-ff rotate-5 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            </div>
          </div>
          <div
            className="d-flex flex-column align-items-center gap-5 mr-0"
            style={{ width: "30%", marginLeft: "-64px", marginTop: "96px" }}
          >
            <div className="position-relative aspect-ratio-tall-2">
              <img
                width="400"
                src="/images/playbook-3.png"
                alt="Playbook Quiz screenshot 3"
                className="image-ff rotate-3 radius-3 order-0 article-image"
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                  backgroundColor: "white",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default IndiehackingSection;
