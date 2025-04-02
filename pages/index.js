import Head from "next/head";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ProjectCard from "../components/ProjectCard";
import FoundersHighlight from "../components/FoundersHighlight";
import { useState, useRef, useEffect } from "react";

import styles from "./index.module.scss";
import IndiehackingSection from "components/IndiehackingSection";
import ActivateSection from "components/ActivateSection";
import CuvvaSection from "components/CuvvaSection";
import SplitzySection from "components/SplitzySection";
import ICONS from "components/icon/IconPaths";
import Icon from "components/icon/Icon";

const Home = (props) => {
  const [isHoveringArticle1, setIsHoveringArticle1] = useState(false);
  const [isHoveringArticle2, setIsHoveringArticle2] = useState(false);
  const [isHoveringSideProjects, setIsHoveringSideProjects] = useState(false);
  const [isHoveringCuvva, setIsHoveringCuvva] = useState(false);
  const [isHoveringSplitzy, setIsHoveringSplitzy] = useState(false);
  const [isHoveringActivate, setIsHoveringActivate] = useState(false);
  const [isHoveringEmail, setIsHoveringEmail] = useState(false);
  const [isHoveringLinkedIn, setIsHoveringLinkedIn] = useState(false);
  const [isHoveringX, setIsHoveringX] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [ffImagePosition, setFfImagePosition] = useState(-144);
  const [ffImageOpacity, setFfImageOpacity] = useState(0);

  // Add state for paragraph animations
  const [para1Style, setPara1Style] = useState({
    opacity: 0,
    transform: "translateY(20px)",
  });
  const [para2Style, setPara2Style] = useState({
    opacity: 0,
    transform: "translateY(20px)",
  });
  const [para3Style, setPara3Style] = useState({
    opacity: 0,
    transform: "translateY(20px)",
  });
  const [para4Style, setPara4Style] = useState({
    opacity: 0,
    transform: "translateY(20px)",
  });
  const [signatureStyle, setSignatureStyle] = useState({
    opacity: 0,
    transform: "translateY(20px)",
  });
  const [nameStyle, setNameStyle] = useState({
    opacity: 0,
    transform: "translateY(20px)",
  });
  const [titleStyle, setTitleStyle] = useState({
    opacity: 0,
    transform: "translateY(20px)",
  });

  const indiehackingSectionRef = useRef(null);
  const cuvvaSectionRef = useRef(null);
  const splitzySectionRef = useRef(null);
  const activateSectionRef = useRef(null);
  const experienceSectionRef = useRef(null);
  const articlesSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  const scrollToIndiehacking = () => {
    indiehackingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCuvva = () => {
    cuvvaSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSplitzy = () => {
    splitzySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToActivate = () => {
    activateSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToExperience = () => {
    experienceSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToArticles = () => {
    articlesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add a function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Determine which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Get positions of all sections
      const experiencePosition = experienceSectionRef.current?.offsetTop || 0;
      const articlesPosition = articlesSectionRef.current?.offsetTop || 0;
      const indiehackingPosition =
        indiehackingSectionRef.current?.offsetTop || 0;
      const cuvvaPosition = cuvvaSectionRef.current?.offsetTop || 0;
      const splitzyPosition = splitzySectionRef.current?.offsetTop || 0;
      const activatePosition = activateSectionRef.current?.offsetTop || 0;
      const contactPosition = contactSectionRef.current?.offsetTop || 0;

      // Determine which section is active
      if (scrollPosition >= contactPosition) {
        setActiveSection("contact");
      } else if (scrollPosition >= activatePosition) {
        setActiveSection("activate");
      } else if (scrollPosition >= splitzyPosition) {
        setActiveSection("splitzy");
      } else if (scrollPosition >= cuvvaPosition) {
        setActiveSection("cuvva");
      } else if (scrollPosition >= indiehackingPosition) {
        setActiveSection("indiehacking");
      } else if (scrollPosition >= articlesPosition) {
        setActiveSection("articles");
      } else if (scrollPosition >= experiencePosition) {
        setActiveSection("experience");
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Add effect for Founders Factory image animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setFfImagePosition(0);
      setFfImageOpacity(1);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, []);

  // Add effect for paragraph animations with staggered delays
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPara1Style({ opacity: 1, transform: "translateY(0)" });
    }, 1300); // First paragraph delay

    const timer2 = setTimeout(() => {
      setPara2Style({ opacity: 1, transform: "translateY(0)" });
    }, 1500); // Second paragraph delay

    const timer3 = setTimeout(() => {
      setPara3Style({ opacity: 1, transform: "translateY(0)" });
    }, 1700); // Third paragraph delay

    const timer4 = setTimeout(() => {
      setPara4Style({ opacity: 1, transform: "translateY(0)" });
    }, 1900); // Fourth paragraph delay

    const timer5 = setTimeout(() => {
      setSignatureStyle({ opacity: 1, transform: "translateY(0)" });
    }, 2100); // Signature delay

    const timer6 = setTimeout(() => {
      setNameStyle({ opacity: 1, transform: "translateY(0)" });
      setTitleStyle({ opacity: 1, transform: "translateY(0)" });
    }, 2300); // Name and title delay

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []);

  return (
    <div>
      <Head>

        {/* <meta
          name="twitter:image"
          content="https://www.epicbabynames.com/images/twitter-summary-large-image.jpeg"
        />
        <meta
          property="og:image"
          content="https://www.epicbabynames.com/images/twitter-summary-large-image.jpeg"
        /> */}
      </Head>
      <div
        style={{ maxWidth: "720px", margin: "160px auto" }}
        className="p-4 p-sm-5 p-md-3"
      >
        <div className="d-flex flex-row mb-5">
          <img
            width="160"
            src="/images/aaronbutlerdark.png"
            alt="Aaron Butler"
            className="image-ff radius-5 order-0"
            style={{ marginLeft: "-24px", zIndex: 1 }}
          />
          <img
            width="160"
            src="/images/founders-factory.png"
            alt="Founders Factory"
            className="image-ff radius-5 order-1 z-0 transition-long"
            style={{
              left: `${ffImagePosition}px`,
              position: "relative",
              marginLeft: "-24px",
              opacity: ffImageOpacity,
            }}
          />
        </div>
        {/* <h1 className="mb-0" style={{ lineHeight: "1.1" }}>
          Aaron Butler
        </h1>
        <h2 className="text-dark-low mb-5">0→1 Product Designer & Builder</h2> */}
        <div style={{ marginTop: "64px" }}>
          <h5
            className="text-dark-med"
            style={{
              ...para1Style,
              transition: "opacity 0.5s, transform 0.5s",
            }}
          >
            For the last three years I have worked at Cuvva, helping to achieve
            the company's mission of giving everyone affordable access to a car
            anytime, anywhere by making cars multiplayer.
          </h5>
          <h5
            className="text-dark-med"
            style={{
              ...para2Style,
              transition: "opacity 0.5s, transform 0.5s",
            }}
          >
            Before that I was at Activate helping non-technical founders with
            industry knowledge to go from idea to launched MVP and beyond.
          </h5>
          <h5
            className="text-dark-med"
            style={{
              ...para3Style,
              transition: "opacity 0.5s, transform 0.5s",
            }}
          >
            Alongside these I've been building, launching and growing my own
            digital products, as well as a little freelancing.
          </h5>
          <h5
            className="text-dark-med"
            style={{
              ...para4Style,
              transition: "opacity 0.5s, transform 0.5s",
            }}
          >
            Next step? I would love to join the team at Founders Factory to work
            with founders and turn early-stage ideas into high-growth startups.
          </h5>
          <h5
            className="font-caveat mb-3 mt-5"
            style={{
              ...signatureStyle,
              fontSize: "64px",
              transition: "opacity 0.5s, transform 0.5s",
            }}
          >
            Aaron Butler
          </h5>
          <h5
            className="text-dark-med mb-0"
            style={{ ...nameStyle, transition: "opacity 0.5s, transform 0.5s" }}
          >
            Aaron Butler
          </h5>
          <h5
            className="text-dark-med"
            style={{
              ...titleStyle,
              transition: "opacity 0.5s, transform 0.5s",
            }}
          >
            0→1 Product Designer & Builder
          </h5>
        </div>
        <FoundersHighlight />
        <div
          className="d-flex flex-column align-items-start gap-5"
          style={{ marginTop: "120px", marginBottom: "120px", gap: "80px" }}
          ref={experienceSectionRef}
        >
          <h3>Experience</h3>
          <div className="d-flex flex-column align-items-start gap-4 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
              <img
                width="64"
                src="/images/aaronbutlerdark.png"
                alt="Aaron Butler"
                className="image-ff rotate-1 radius-3 order-0"
                style={{ zIndex: 1 }}
              />
              <div>
                <h5 className="mb-2" style={{ lineHeight: "1.2" }}>
                  Indiehacking
                </h5>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  Building things
                </h6>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  2020 - Forever
                </h6>
              </div>
            </div>
            <h6 className="text-dark-low mb-2">
              I solemnly swear that I am up to no git. Okay that's a lie. Having
              got a real taste of turning an idea into a product-led business
              during my time at Activate, I could think of nothing else but to
              build and launch my own.
            </h6>
            <div
              className="d-flex flex-column align-items-start gap-4 bg-dark-100 w-100 overflow-hidden radius-4"
              style={{
                padding: "32px",
                cursor: "pointer",
              }}
              onClick={scrollToIndiehacking}
              onMouseEnter={() => setIsHoveringSideProjects(true)}
              onMouseLeave={() => setIsHoveringSideProjects(false)}
            >
              <div className="d-flex flex-row align-items-center justify-content-between w-100">
                <h6
                  className={`${
                    isHoveringSideProjects ? "text-dark-high" : "text-dark-low"
                  } mb-0`}
                  style={{ transition: "color 0.3s" }}
                >
                  See more about my side projects
                </h6>
                <h6
                  className={`${
                    isHoveringSideProjects ? "text-dark-high" : "text-dark-low"
                  } mb-0`}
                  style={{ transition: "color 0.3s" }}
                >
                  →
                </h6>
              </div>
              <div
                className="d-flex flex-row align-items-start gap-0 w-100"
                style={{ marginBottom: "-80px" }}
              >
                <div
                  className="d-none d-md-flex flex-column align-items-center gap-5 mr-0"
                  style={{ width: "40%" }}
                >
                  <div className="position-relative aspect-ratio-tall">
                    <img
                      width="400"
                      src="/images/vitaely-2.png"
                      alt="Vitaely"
                      className="image-ff rotate-2 radius-3 order-0"
                      style={{
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 2,
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4"
                  style={{ marginLeft: "-64px" }}
                >
                  <div className="position-relative w-100 aspect-ratio-wide">
                    <video
                      width="400"
                      src="/images/epic-baby-names.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="image-ff rotate-5 radius-3 order-0"
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
          </div>
          <div className="d-flex flex-column align-items-start gap-4 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
              <img
                width="64"
                src="/images/cuvva.png"
                alt="Cuvva"
                className="image-ff rotate-1 radius-3 order-0"
                style={{ zIndex: 1 }}
              />
              <div>
                <h5 className="mb-2" style={{ lineHeight: "1.2" }}>
                  Cuvva
                </h5>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  Making cars multiplayer
                </h6>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  2021 - 2025
                </h6>
              </div>
            </div>
            <div>
              <h6 className="text-dark-low mb-2">
                Building on the success of the short-term car insurance product;
                Cuvva's founder, Freddy, has a vision to achieve this ambitious
                mission by making cars multiplayer. Sole Product Designer
                working in teams dedicated to realising this vision.
              </h6>
            </div>
            <div
              className="d-flex flex-column align-items-start gap-4 bg-dark-100 w-100 overflow-hidden radius-4"
              style={{
                padding: "32px",
                cursor: "pointer",
              }}
              onClick={scrollToCuvva}
              onMouseEnter={() => setIsHoveringCuvva(true)}
              onMouseLeave={() => setIsHoveringCuvva(false)}
            >
              <div className="d-flex flex-row align-items-center justify-content-between w-100">
                <h6
                  className={`${
                    isHoveringCuvva ? "text-dark-high" : "text-dark-low"
                  } mb-0`}
                  style={{ transition: "color 0.3s" }}
                >
                  See more about my work at Cuvva
                </h6>
                <h6
                  className={`${
                    isHoveringCuvva ? "text-dark-high" : "text-dark-low"
                  } mb-0`}
                  style={{ transition: "color 0.3s" }}
                >
                  →
                </h6>
              </div>
              <div
                className="d-flex flex-row align-items-start gap-0 w-100"
                style={{ marginBottom: "-80px" }}
              >
                <div
                  className="flex-column align-items-start gap-4 w-100 mb-4 mt-4"
                  style={{ marginLeft: "-64px" }}
                >
                  <div className="position-relative w-100 aspect-ratio-wide">
                    <img
                      width="400"
                      src="/images/cuvva-14.png"
                      alt="Cuvva"
                      className="image-ff rotate-6 radius-3 order-0"
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
                  className="d-none d-md-flex flex-column align-items-center gap-5 mr-0"
                  style={{ width: "40%", marginLeft: "-24px" }}
                >
                  <div className="position-relative aspect-ratio-tall">
                    <video
                      width="400"
                      src="/cuvva-lending.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="image-ff rotate-1 radius-3 order-0"
                      style={{
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 2,
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-start gap-4 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
              <img
                width="64"
                src="/images/splitzy.png"
                alt="Splitzy"
                className="image-ff rotate-1 radius-3 order-0"
                style={{ zIndex: 1 }}
              />
              <div>
                <h5 className="mb-2" style={{ lineHeight: "1.2" }}>
                  Splitzy (Freelance)
                </h5>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  Splitting made easy
                </h6>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  2024 - 2025
                </h6>
              </div>
            </div>
            <div>
              <h6 className="text-dark-low">
                The Splitzy founding team approached me as they completed their
                pre-seed round with a dream of becoming the go to destination
                for organising and collecting money from a group of people for
                an event or shared expense.
              </h6>
              <h6 className="text-dark-low">
                I helped them work through establishing who their target user is
                and what their most important jobs, pains and gains are, before
                creating wireframes and high-fidelity deliverables for their
                mobile app MVP.
              </h6>
              <h6 className="text-dark-low mb-2">
                Also put together their basic branding, marketing assets and
                built their initial landing page.
              </h6>
            </div>
            <div
              className="d-flex flex-column align-items-start gap-4 bg-dark-100 w-100 overflow-hidden radius-4"
              style={{
                padding: "32px",
                cursor: "pointer",
              }}
              onClick={scrollToSplitzy}
              onMouseEnter={() => setIsHoveringSplitzy(true)}
              onMouseLeave={() => setIsHoveringSplitzy(false)}
            >
              <div className="d-flex flex-row align-items-center justify-content-between w-100">
                <h6
                  className={`${
                    isHoveringSplitzy ? "text-dark-high" : "text-dark-low"
                  } mb-0`}
                  style={{ transition: "color 0.3s" }}
                >
                  See more about my work with Splitzy
                </h6>
                <h6
                  className={`${
                    isHoveringSplitzy ? "text-dark-high" : "text-dark-low"
                  } mb-0`}
                  style={{ transition: "color 0.3s" }}
                >
                  →
                </h6>
              </div>
              <div
                className="d-flex flex-row align-items-start gap-0 w-100"
                style={{ marginBottom: "-80px" }}
              >
                <div
                  className="d-none d-md-flex flex-column align-items-center gap-5 mr-0"
                  style={{ width: "40%" }}
                >
                  <div className="position-relative aspect-ratio-tall">
                    <video
                      width="400"
                      src="/images/splitzy-2.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      alt="Splitzy"
                      className="image-ff rotate-2 radius-3 order-0"
                      style={{
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 2,
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4"
                  style={{ marginLeft: "-64px" }}
                >
                  <div className="position-relative w-100 aspect-ratio-wide">
                    <img
                      width="400"
                      src="/images/splitzy-3.png"
                      className="image-ff rotate-5 radius-3 order-0"
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
          </div>
          <div className="d-flex flex-column align-items-start gap-4 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
              <img
                width="64"
                src="/images/activate.png"
                alt="Activate"
                className="image-ff rotate-1 radius-3 order-0"
                style={{ zIndex: 1 }}
              />
              <div>
                <h5 className="mb-2" style={{ lineHeight: "1.2" }}>
                  Activate
                </h5>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  From idea to MVP
                </h6>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  2018 - 2021
                </h6>
              </div>
            </div>
            <div>
              <h6 className="text-dark-low">
                Product Designer in a startup studio that helps non-technical
                founders with industry knowledge to go from idea to launched MVP
                and beyond.
              </h6>
              <h6 className="text-dark-low">
                Owned designs from idea to MVP and beyond across multiple
                fledgling startups. Facilitated value proposition design
                workshops and design sprints.
              </h6>
              <h6 className="text-dark-low">
                Product Manager for our internal product that managed
                applications from founders to join the studio.
              </h6>
            </div>
            <div
              className="d-flex flex-column align-items-start gap-4 bg-dark-100 w-100 overflow-hidden radius-4"
              style={{
                padding: "32px",
                cursor: "pointer",
              }}
              onClick={scrollToActivate}
              onMouseEnter={() => setIsHoveringActivate(true)}
              onMouseLeave={() => setIsHoveringActivate(false)}
            >
              <div className="d-flex flex-row align-items-center justify-content-between w-100">
                <h6
                  className={`${
                    isHoveringActivate ? "text-dark-high" : "text-dark-low"
                  } mb-0`}
                  style={{ transition: "color 0.3s" }}
                >
                  See more about my work at Activate
                </h6>
                <h6
                  className={`${
                    isHoveringActivate ? "text-dark-high" : "text-dark-low"
                  } mb-0`}
                  style={{ transition: "color 0.3s" }}
                >
                  →
                </h6>
              </div>
              <div
                className="d-flex flex-row align-items-start gap-0 w-100"
                style={{ marginBottom: "-80px" }}
              >
                <div
                  className="d-none d-md-flex flex-column align-items-center gap-5 mr-0"
                  style={{ width: "40%" }}
                >
                  <div className="position-relative aspect-ratio-square">
                    <img
                      width="400"
                      src="/images/activate-4.png"
                      alt="Activate"
                      className="image-ff rotate-2 radius-3 order-0"
                      style={{
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 2,
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4"
                  style={{ marginLeft: "-64px" }}
                >
                  <div className="position-relative w-100 aspect-ratio-wide">
                    <img
                      width="400"
                      src="/images/activate-2.png"
                      className="image-ff rotate-5 radius-3 order-0"
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
          </div>
          <div className="d-flex flex-column align-items-start gap-4 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
              <img
                width="64"
                src="/images/market-gravity.png"
                alt="Market Gravity"
                className="image-ff rotate-1 radius-3 order-0"
                style={{ zIndex: 1 }}
              />
              <div>
                <h5 className="mb-2" style={{ lineHeight: "1.2" }}>
                  Market Gravity (Summer Intern)
                </h5>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  Intra-preneurship through proposition design
                </h6>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  2016
                </h6>
              </div>
            </div>
            <h6 className="text-dark-low mb-2">
              Worked with Bupa to generate new ideas for new offerings outside
              of their core Private Medical Insurance product. Helped out with
              customer research and co-creation sessions (where we worked with
              people who did or didn't have private medical insurance to
              generate ideas).
              <br />
              <br />
              Produced pitch deck slides, mockup ads, illustrations, animations,
              video summaries and landing pages in a bid to help the team get
              approval from Bupa leadership to continue to pursue these ideas.
            </h6>
          </div>
          <div className="d-flex flex-column align-items-start gap-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
              <img
                width="64"
                src="/images/loughborough-university.png"
                alt="Loughborough University"
                className="image-ff rotate-1 radius-3 order-0"
                style={{ zIndex: 1 }}
              />
              <div>
                <h5 className="mb-2" style={{ lineHeight: "1.2" }}>
                  Loughborough University
                </h5>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  BA Industrial Design & Technology
                </h6>
                <h6
                  className="text-dark-low mb-2"
                  style={{ lineHeight: "1.2" }}
                >
                  2013 - 2017
                </h6>
              </div>
            </div>
            <h6 className="text-dark-low mb-2">
              Optional modules: UX Design, Entrepreneurship & Innovation
            </h6>
          </div>
        </div>
        <div
          className="d-flex flex-column align-items-start gap-5"
          style={{ marginTop: "120px", marginBottom: "120px" }}
          ref={articlesSectionRef}
        >
          <div className="d-flex flex-column align-items-start ">
            <h3>Articles</h3>
            <h6 className="text-dark-low mb-2">
              Occasionally I decide to write about things I've learned along the
              way, or something that has infuriated me enough to cause me to
              redesign it. Some of my articles have been featured in Mobbin's
              Weekly Update and TLDR's Design newsletter (going out to over
              300,000 people).
            </h6>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-start gap-5 w-100">
            <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4">
              <div className="d-flex flex-column align-items-center gap-5 w-100">
                <div className="position-relative w-100 aspect-ratio-4-3">
                  <img
                    width="400"
                    src="/images/flight-app.png"
                    alt="Loughborough University"
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
                <div className="w-100">
                  <h5
                    className="mb-2"
                    style={{ lineHeight: "1.2" }}
                    onMouseEnter={() => setIsHoveringArticle1(true)}
                    onMouseLeave={() => setIsHoveringArticle1(false)}
                  >
                    <a
                      href="https://www.aaron-butler.co.uk/blog/missing-connecting-flights-app-redesign"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      What if missing a connecting flight wasn't awful?
                      <span
                        className="transition-standard"
                        style={{
                          marginLeft: "8px",
                          opacity: isHoveringArticle1 ? 1 : 0,
                          transform: isHoveringArticle1
                            ? "translateX(0)"
                            : "translateX(-10px)",
                          display: "inline-block",
                        }}
                      >
                        →
                      </span>
                    </a>
                  </h5>
                  <h6
                    className="text-dark-low mb-2"
                    style={{ lineHeight: "1.2" }}
                  >
                    13 min read
                  </h6>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column align-items-start gap-4 w-100">
              <div className="d-flex flex-column align-items-center gap-5 w-100">
                <div className="position-relative w-100 aspect-ratio-4-3">
                  <img
                    width="400"
                    src="/images/variant-testing.png"
                    alt="Variants"
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
                <div className="w-100">
                  <h5
                    className="mb-2"
                    style={{ lineHeight: "1.2" }}
                    onMouseEnter={() => setIsHoveringArticle2(true)}
                    onMouseLeave={() => setIsHoveringArticle2(false)}
                  >
                    <a
                      href="https://www.aaron-butler.co.uk/blog/what-I-learned-from-running-multivariant-tests-on-my-funnel"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      What I learned from running multivariant tests on my
                      funnel
                      <span
                        className="transition-standard"
                        style={{
                          marginLeft: "8px",
                          opacity: isHoveringArticle2 ? 1 : 0,
                          transform: isHoveringArticle2
                            ? "translateX(0)"
                            : "translateX(-10px)",
                          display: "inline-block",
                        }}
                      >
                        →
                      </span>
                    </a>
                  </h5>
                  <h6
                    className="text-dark-low mb-2"
                    style={{ lineHeight: "1.2" }}
                  >
                    3 min read
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <IndiehackingSection ref={indiehackingSectionRef} />
        <CuvvaSection ref={cuvvaSectionRef} />
        <SplitzySection ref={splitzySectionRef} />
        <ActivateSection ref={activateSectionRef} />
        <div
          className="d-flex flex-column align-items-start gap-5"
          style={{ marginTop: "120px" }}
          ref={contactSectionRef}
        >
          <div className="d-flex flex-column align-items-start ">
            <h3>Contact</h3>
            <h6 className="text-dark-low mb-2">
              Thank you for sticking with me and reaching this far down the
              page. If you'd like to get in touch with me, you can do so on any
              one of these channels:
            </h6>
          </div>
          <div className="d-flex flex-column align-items-start gap-5 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
              <img
                width="64"
                src="/images/mail.png"
                alt="Email"
                className="image-ff rotate-1 radius-3 order-0"
                style={{ zIndex: 1 }}
              />
              <div
                onMouseEnter={() => setIsHoveringEmail(true)}
                onMouseLeave={() => setIsHoveringEmail(false)}
              >
                <a
                  href="mailto:butler952@gmail.com"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <h5 className="mb-2" style={{ lineHeight: "1.2" }}>
                    Email
                    <span
                      className="transition-standard"
                      style={{
                        marginLeft: "8px",
                        opacity: isHoveringEmail ? 1 : 0,
                        transform: isHoveringEmail
                          ? "translateX(0)"
                          : "translateX(-10px)",
                        display: "inline-block",
                      }}
                    >
                      →
                    </span>
                  </h5>
                  <h6
                    className="text-dark-low mb-0"
                    style={{ lineHeight: "1.2" }}
                  >
                    butler952@gmail.com
                  </h6>
                </a>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
              <img
                width="64"
                src="/images/linkedin.png"
                alt="Email"
                className="image-ff rotate-1 radius-3 order-0"
                style={{ zIndex: 1 }}
              />
              <div
                onMouseEnter={() => setIsHoveringLinkedIn(true)}
                onMouseLeave={() => setIsHoveringLinkedIn(false)}
              >
                <a
                  href="https://www.linkedin.com/in/butler952/"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <h5 className="mb-2" style={{ lineHeight: "1.2" }}>
                    LinkedIn
                    <span
                      className="transition-standard"
                      style={{
                        marginLeft: "8px",
                        opacity: isHoveringLinkedIn ? 1 : 0,
                        transform: isHoveringLinkedIn
                          ? "translateX(0)"
                          : "translateX(-10px)",
                        display: "inline-block",
                      }}
                    >
                      →
                    </span>
                  </h5>
                  <h6
                    className="text-dark-low mb-0"
                    style={{ lineHeight: "1.2" }}
                  >
                    /butler952
                  </h6>
                </a>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-4">
              <img
                width="64"
                src="/images/twitter.png"
                alt="x/twitter"
                className="image-ff rotate-1 radius-3 order-0"
                style={{ zIndex: 1 }}
              />
              <div
                onMouseEnter={() => setIsHoveringX(true)}
                onMouseLeave={() => setIsHoveringX(false)}
              >
                <a
                  href="https://www.x.com/butler952/"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <h5 className="mb-2" style={{ lineHeight: "1.2" }}>
                    X
                    <span
                      className="transition-standard"
                      style={{
                        marginLeft: "8px",
                        opacity: isHoveringX ? 1 : 0,
                        transform: isHoveringX
                          ? "translateX(0)"
                          : "translateX(-10px)",
                        display: "inline-block",
                      }}
                    >
                      →
                    </span>
                  </h5>
                  <h6
                    className="text-dark-low mb-0"
                    style={{ lineHeight: "1.2" }}
                  >
                    /butler952
                  </h6>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* White gradient background for navigation */}
        <div
          className="position-fixed"
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "56px",
            background:
              "linear-gradient(to bottom, white 0%, rgba(255,255,255,0) 100%)",
            zIndex: 999,
          }}
        />

        {/* Floating Navigation Bar */}
        <div
          className="position-fixed d-flex justify-content-center w-100"
          style={{
            top: "20px",
            left: 0,
            zIndex: 1000,
          }}
          >
          <div
            className="d-flex align-items-center bg-dark-900 radius-4 shadow-1"
            style={{
              padding: "10px 16px",
              maxWidth: "100%",
              overflowX: "auto",
              height: "56px",
            }}
          >
            {/* Back to top button with small round image */}
            <button
              className="btn p-0 me-3 d-flex align-items-center justify-content-center"
              onClick={scrollToTop}
              title="Back to top"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src="/images/aaronbutlerdark.png"
                alt="Back to top"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </button>

            {/* Existing navigation buttons */}
            <div className="d-none d-md-flex flex-row align-items-center gap-0">
              <button
                className={`btn light small px-3 py-1 ${
                  activeSection === "experience" ? "low" : "ultraLow"
                }`}
                onClick={scrollToExperience}
              >
                Experience
              </button>
              <button
                className={`btn light small px-3 py-1 ${
                  activeSection === "articles" ? "low" : "ultraLow"
                }`}
                onClick={scrollToArticles}
              >
                Articles
              </button>
              <button
                className={`btn light small px-3 py-1 ${
                  activeSection === "indiehacking" ? "low" : "ultraLow"
                }`}
                onClick={scrollToIndiehacking}
              >
                Indiehacking
              </button>
              <button
                className={`btn light small px-3 py-1 ${
                  activeSection === "cuvva" ? "low" : "ultraLow"
                }`}
                onClick={scrollToCuvva}
              >
                Cuvva
              </button>
              <button
                className={`btn light small px-3 py-1 ${
                  activeSection === "splitzy" ? "low" : "ultraLow"
                }`}
                onClick={scrollToSplitzy}
              >
                Splitzy
              </button>
              <button
                className={`btn light small px-3 py-1 ${
                  activeSection === "activate" ? "low" : "ultraLow"
                }`}
                onClick={scrollToActivate}
              >
                Activate
              </button>
              <button
                className={`btn light small px-3 py-1 ${
                  activeSection === "contact" ? "low" : "ultraLow"
                }`}
                onClick={scrollToContact}
              >
                Contact
              </button>
            </div>
            <div className="d-flex d-md-none flex-row align-items-center gap-0">
              <button
                className={`btn light x-small ${
                  activeSection === "experience" ? "low" : "ultraLow icon-only"
                }`}
                onClick={scrollToExperience}
              >
                {activeSection === "experience" ? (
                  "Experience"
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d={ICONS.DOT}></path>
                  </svg>
                )}
              </button>

              <button
                className={`btn light x-small ${
                  activeSection === "articles" ? "low" : "ultraLow icon-only"
                }`}
                onClick={scrollToArticles}
              >
                {activeSection === "articles" ? (
                  "Articles"
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d={ICONS.DOT}></path>
                  </svg>
                )}
              </button>
              <button
                className={`btn light x-small ${
                  activeSection === "indiehacking"
                    ? "low"
                    : "ultraLow icon-only"
                }`}
                onClick={scrollToIndiehacking}
              >
                {activeSection === "indiehacking" ? (
                  "Indiehacking"
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d={ICONS.DOT}></path>
                  </svg>
                )}
              </button>
              <button
                className={`btn light x-small ${
                  activeSection === "cuvva" ? "low" : "ultraLow icon-only"
                }`}
                onClick={scrollToCuvva}
              >
                {activeSection === "cuvva" ? (
                  "Cuvva"
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d={ICONS.DOT}></path>
                  </svg>
                )}
              </button>
              <button
                className={`btn light x-small ${
                  activeSection === "splitzy" ? "low" : "ultraLow icon-only"
                }`}
                onClick={scrollToSplitzy}
              >
                {activeSection === "splitzy" ? (
                  "Splitzy"
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d={ICONS.DOT}></path>
                  </svg>
                )}
              </button>

              <button
                className={`btn light x-small ${
                  activeSection === "activate" ? "low" : "ultraLow icon-only"
                }`}
                onClick={scrollToActivate}
              >
                {activeSection === "activate" ? (
                  "Activate"
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d={ICONS.DOT}></path>
                  </svg>
                )}
              </button>
              <button
                className={`btn light x-small ${
                  activeSection === "contact" ? "low" : "ultraLow icon-only"
                }`}
                onClick={scrollToContact}
              >
                {activeSection === "contact" ? (
                  "Contact"
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d={ICONS.DOT}></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
