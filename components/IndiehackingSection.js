import React, { forwardRef } from "react";
import ProjectCard from "./ProjectCard";

const IndiehackingSection = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="d-flex flex-column align-items-start"
      style={{ marginTop: "120px", marginBottom: "120px", gap: "64px" }}
    >
      <div className="d-flex flex-column align-items-start ">
        <h5 className="text-dark-low mb-0">Indiehacking</h5>
        <h3>Building things</h3>
        <h6 className="text-dark-low mb-2">
          Having got a real taste of turning an idea into a product-led
          business, I could think of nothing else but to build and launch my
          own. Here's a list of products I've built and some that are in the
          works.
        </h6>
      </div>
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <ProjectCard
          logo={{
            src: "/images/playbook.png",
            alt: "Play Designer Pro",
          }}
          name="Play Designer Pro"
          description="Create and learn an American Football playbook with auto-generated bite-size quizzes"
          url="https://www.playdesignerpro.com/"
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
            { id: "stripe", name: "Stripe", icon: "/images/stripe.png" },
          ]}
        />

        {/* Screenshots section kept as raw code */}
        <div className="d-flex flex-row align-items-start gap-0 w-100 mt-3 mt-md-5">
          <div
            className="d-flex flex-column align-items-center gap-5 mr-0"
            style={{ width: "60%", marginTop: "120px" }}
          >
            <div className="position-relative aspect-ratio-square">
              <img
                width="400"
                src="/images/playbook-1.png"
                alt="Play Designer Pro screenshot 1"
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
                alt="Play Designer Pro screenshot 2"
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
                alt="Play Designer Pro screenshot 3"
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
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
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

        {/* Screenshots section kept as raw code */}
        <div className="d-flex flex-row align-items-start gap-0 w-100">
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
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <ProjectCard
          logo={{
            src: "/images/epic-baby-names.png",
            alt: "Epic Baby Names",
          }}
          name="Epic Baby Names"
          // url="https://epicbababynames.com"
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

        {/* Screenshots section kept as raw code */}
        <div className="d-flex flex-column align-items-center gap-0 w-100">
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
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
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

        {/* Screenshots section kept as raw code */}
        <div className="d-flex flex-row align-items-start gap-0 w-100">
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
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
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

        {/* Screenshots section kept as raw code */}
        <div className="d-flex flex-column align-items-center gap-0 w-100">
          <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-md-4">
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
          <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4">
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
          <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4">
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
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
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

        {/* Screenshots section kept as raw code */}
        <div className="d-flex flex-column align-items-center gap-0 w-100">
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
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <ProjectCard
          logo={{
            src: "/images/bamboo.png",
            alt: "Bamboo",
          }}
          name="Bamboo (Landing page only)"
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

        {/* Screenshots section kept as raw code */}
        <div className="d-flex flex-row align-items-start gap-0 w-100">
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
      <div className="d-flex flex-column align-items-start gap-5 mb-3 mb-md-5 pb-3 w-100">
        <ProjectCard
          logo={{
            src: "/images/histartup.png",
            alt: "HiStartup",
          }}
          name="HiStartup (Landing page only)"
          url="https://histartup.co.uk/"
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

        {/* Screenshots section kept as raw code */}
        <div className="d-flex flex-column align-items-center gap-0 w-100">
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
    </div>
  );
});

export default IndiehackingSection;
