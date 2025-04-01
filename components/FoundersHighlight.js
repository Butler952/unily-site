import React from "react";

// Data for all founders
const foundersData = [
  {
    name: "Freddy",
    company: "Cuvva",
    founderImage: "/images/cuvva-founder.png",
    companyImage: "/images/cuvva.png"
  },
  {
    name: "Layla",
    company: "The Seam",
    founderImage: "/images/the-seam-founder.png",
    companyImage: "/images/the-seam.png"
  },
  {
    name: "Beniamino",
    company: "Good Morning Italia",
    founderImage: "/images/gmi-founder.png",
    companyImage: "/images/gmi.png"
  },
  {
    name: "Fiona & Christine",
    company: "Smash",
    founderImage: "/images/smash-founder.png",
    companyImage: "/images/smash.png"
  },
  {
    name: "Gus & Fahad",
    company: "Tomo",
    founderImage: "/images/tomo-founder.png",
    companyImage: "/images/tomo.png"
  },
  {
    name: "Sam",
    company: "Tailwise",
    founderImage: "/images/tailwise-founder.png",
    companyImage: "/images/tailwise.png"
  },
  {
    name: "Kim",
    company: "Isoshealth",
    founderImage: "/images/isoshealth-founder.png",
    companyImage: "/images/isoshealth.png"
  },
  {
    name: "Laurence, Oscar & Eamon",
    company: "Splitzy",
    founderImage: "/images/splitzy-founder.png",
    companyImage: "/images/splitzy.png"
  },
  {
    name: "Dean",
    company: "Playerstate",
    founderImage: "/images/playerstate-founder.png",
    companyImage: "/images/playerstate.png"
  },
  {
    name: "Harvir",
    company: "Doyenne",
    founderImage: "/images/doyenne-founder.png",
    companyImage: "/images/doyenne.png"
  }
];

// FounderCard component for mobile view
const FounderCard = ({ founder }) => {
  return (
    <div className="d-flex flex-column align-items-start gap-4">
      <div className="d-flex flex-row align-items-center gap-4">
        <div className="position-relative">
          <img
            style={{ width: "80px", minWidth: "80px" }}
            src={founder.founderImage}
            alt={`${founder.company} Founder`}
            className="image-ff rotate-2 radius-3"
          />
          <img
            width="40"
            src={founder.companyImage}
            alt={founder.company}
            className="image-ff rotate-1 small radius-2"
            style={{
              position: "absolute",
              bottom: "-16px",
              right: "-8px",
            }}
          />
        </div>
        <div>
          <h5 className="mb-2" style={{ lineHeight: "1.2" }}>{founder.name}</h5>
          <h6 className="text-dark-low mb-0" style={{ lineHeight: "1.2" }}>
            {founder.company}
          </h6>
        </div>
      </div>
    </div>
  );
};

const FoundersHighlight = () => {
  return (
    <div style={{ marginTop: "280px", marginBottom: "200px" }}>
      {/* Desktop version - visible only on md and larger screens */}
      <div className="d-none d-lg-flex flex-column align-items-center gap-5">
        <div className="d-flex flex-row align-items-start justify-content-between w-100 mb-5">
          <div className="position-relative">
            <img
              width="80"
              src="/images/the-seam-founder.png"
              alt="The Seam Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/the-seam.png"
              alt="The Seam"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "64px",
                left: "64px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-48px",
                left: "-80px",
                whiteSpace: "nowrap",
              }}
            >
              Layla, The Seam
            </p>
          </div>
          <div className="position-relative" style={{ marginTop: "-56px" }}>
            <img
              width="80"
              src="/images/gmi-founder.png"
              alt="Good Morning Italia Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/gmi.png"
              alt="Good Morning Italia"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-24px",
                left: "-24px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-80px",
                left: "-160px",
                whiteSpace: "nowrap",
              }}
            >
              Beniamino, Good Morning Italia
            </p>
          </div>
          <div className="position-relative" style={{ marginTop: "-64px" }}>
            <img
              width="80"
              src="/images/smash-founder.png"
              alt="Smash Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/smash.png"
              alt="Smash"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "56px",
                left: "56px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-56px",
                left: "-48px",
                whiteSpace: "nowrap",
              }}
            >
              Fiona & Christine, Smash
            </p>
          </div>
          <div className="position-relative" style={{ marginTop: "-16px" }}>
            <img
              width="80"
              src="/images/tomo-founder.png"
              alt="Tomo Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/tomo.png"
              alt="Tomo"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-16px",
                left: "-40px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-56px",
                left: "0px",
                whiteSpace: "nowrap",
              }}
            >
              Gus & Fahad, Tomo
            </p>
          </div>
        </div>
        <div
          className="d-flex flex-row align-items-start justify-content-between"
          style={{ width: "120%" }}
        >
          <div className="position-relative" style={{ marginTop: "-16px" }}>
            <img
              width="80"
              src="/images/cuvva-founder.png"
              alt="Cuvva Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/cuvva.png"
              alt="Cuvva"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-24px",
                left: "-24px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "112px",
                left: "-48px",
                whiteSpace: "nowrap",
              }}
            >
              Freddy, Cuvva
            </p>
          </div>
          <h3
            className="text-left text-md-center"
            style={{ maxWidth: "560px", marginTop: "-24px" }}
          >
            Some of the incredible founders I've worked with along the way
          </h3>
          <div className="position-relative" style={{ marginTop: "-32px" }}>
            <img
              width="80"
              src="/images/tailwise-founder.png"
              alt="Tailwise Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/tailwise.png"
              alt="Tailwise"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "64px",
                left: "64px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-48px",
                left: "24px",
                whiteSpace: "nowrap",
              }}
            >
              Sam, Tailwise
            </p>
          </div>
        </div>
        <div className="d-flex flex-row align-items-start justify-content-between w-100 mt-5">
          <div className="position-relative" style={{ marginTop: "-56px" }}>
            <img
              width="80"
              src="/images/isoshealth-founder.png"
              alt="Isoshealth Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/isoshealth.png"
              alt="Isoshealth"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-24px",
                left: "64px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "104px",
                left: "-64px",
                whiteSpace: "nowrap",
              }}
            >
              Kim, isoshealth
            </p>
          </div>
          <div className="position-relative" style={{ marginTop: "-32px" }}>
            <img
              width="80"
              src="/images/splitzy-founder.png"
              alt="Splitzy Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/splitzy.png"
              alt="Splitzy"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "64px",
                left: "-24px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "140px",
                left: "-96px",
                whiteSpace: "nowrap",
              }}
            >
              Laurence, Oscar & Eamon, Splitzy
            </p>
          </div>
          <div className="position-relative">
            <img
              width="80"
              src="/images/playerstate-founder.png"
              alt="Playerstate Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/playerstate.png"
              alt="Playerstate"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "-24px",
                left: "-24px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "112px",
                left: "32px",
                whiteSpace: "nowrap",
              }}
            >
              Dean, Playerstate
            </p>
          </div>
          <div className="position-relative" style={{ marginTop: "-64px" }}>
            <img
              width="80"
              src="/images/doyenne-founder.png"
              alt="Doyenne Founder"
              className="image-ff rotate-2 radius-3 order-0"
              style={{ zIndex: 1 }}
            />
            <img
              width="48"
              src="/images/doyenne.png"
              alt="Doyenne"
              className="image-ff rotate-1 radius-3 order-0"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "64px",
                left: "-24px",
              }}
            />
            <p
              className="font-caveat static-rotate-1"
              style={{
                zIndex: 1,
                position: "absolute",
                top: "112px",
                left: "64px",
                whiteSpace: "nowrap",
              }}
            >
              Harvir, Doyenne
            </p>
          </div>
        </div>
      </div>

      {/* Mobile version - visible only on screens smaller than md */}
      <div className="d-flex d-lg-none flex-column align-items-start gap-5">
        <div className="d-block d-lg-none">
          <h3>Some of the incredible founders I've worked with along the way</h3>
        </div>
        
        {/* Map through founders data to create cards */}
        {foundersData.map((founder, index) => (
          <FounderCard key={index} founder={founder} />
        ))}
      </div>
    </div>
  );
};

export default FoundersHighlight;
