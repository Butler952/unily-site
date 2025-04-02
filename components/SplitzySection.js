import React, { forwardRef } from 'react';

const SplitzySection = forwardRef((props, ref) => {
  return (
    <div ref={ref}
      className="d-flex flex-column align-items-start"
      style={{ marginTop: "120px", marginBottom: "120px", gap: "64px" }}
    >
      <div className="d-flex flex-column align-items-start ">
        <h5 className="text-dark-low mb-0">Splitzy</h5>
        <h3>Splitting made easy</h3>
        <h6 className="text-dark-low">
          The Splitzy founding team approached me as they completed their
          pre-seed round with a dream of becoming the go to destination for
          organising and collecting money from a group of people for an event or
          shared expense.
        </h6>
        <h6 className="text-dark-low">
          To help the team narrow down the scope of their MVP, we went through a
          series of exercises to understand who they envisioned as their users,
          and determine the key problems they have with organising events and
          collecting money that we wanted to tackle first.
        </h6>
        <h6 className="text-dark-low">
          Given the founding team were mostly undergraduates, they decided to
          lean on their advantages and focus on fellow students.
        </h6>
        <h6 className="text-dark-low">
          After chatting with fellow students and using anecdotal evidence of
          their own, we arrived at a few scenarios as archetypes for this
          different type of splitting that they wanted to help out with.
        </h6>

        <h6 className="text-dark-low">
          We arrived at four different use cases we wanted to account for:
        </h6>
        <h6 className="text-dark-low mb-0">
          <ul>
            <li>
              <i>Fixed</i> (you know the exact amount of money and people—e.g.
              dinner)
            </li>
            <li>
              <i>Variable</i> (same cost per person but unsure of number of
              people—e.g. booking tickets to an event)
            </li>
            <li>
              <i>Open</i> (pay what you want—e.g. collecting for a gift)
            </li>
            <li>
              <i>Multiple expenses</i> (effectively a tab that can have multiple
              expenses by different people—e.g. booking a holiday)
            </li>
          </ul>
        </h6>
        <h6 className="text-dark-low">
          Having arrived at the scope of the MVP, I created wireframes to show
          the experience that we wanted to create to cover these core use cases.
        </h6>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-start gap-md-5 w-100">
        <div className="d-flex flex-column align-items-center gap-5 w-100 order-1 order-md-0">
          <div className="aspect-ratio-wide">
            <img
              width="560"
              src="/images/splitzy-1.png"
              alt="Cuvva"
              className="image-ff rotate-6 radius-3 order-0 article-image"
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
        <div className="d-flex flex-column align-items-start order-0 order-md-1 ml-5 ml-md-0 mt-0 mt-md-5">
          <p
            className="font-caveat static-rotate-1 mb-1 ml-3"
            style={{ maxWidth: "320px" }}
          >
            Venture design exercises to help the team understand their target
            user, jobs, and pains
          </p>
          <img
            src="/images/arrows/arrow-2.svg"
            width="48"
            alt="Decorative arrow"
            className="mb-2 d-none d-md-block"
          />
          <img
            src="/images/arrows/arrow-5.svg"
            width="48"
            alt="Decorative arrow"
            className="mb-2 d-block d-md-none"
            style={{ marginLeft: "160px", marginTop: "-16px" }}
          />
        </div>
      </div>
      <div
        className="d-flex flex-column flex-md-row align-items-start gap-md-5 w-100"
        style={{ marginTop: "-56px" }}
      >
        <div className="d-flex flex-column align-items-center gap-5 w-100 order-0 order-md-1">
          <div className="aspect-ratio-wide">
            <img
              width="560"
              src="/images/splitzy-2.png"
              alt="Cuvva"
              className="image-ff rotate-5 radius-3 order-0 article-image"
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
        <div className="d-flex flex-column align-items-end order-1 order-md-0 mt-5">
          <img
            src="/images/arrows/arrow-1.svg"
            width="48"
            alt="Decorative arrow"
            className="d-block d-md-none"
            style={{ marginLeft: "160px", marginTop: "-16px" }}
          />
          <p
            className="font-caveat static-rotate-1 mb-1 ml-5"
            style={{ maxWidth: "320px" }}
          >
            Wireframing the core flows to tackle our target users' more
            important problems
          </p>
          <img
            src="/images/arrows/arrow-5-rotated-2.svg"
            width="48"
            alt="Decorative arrow"
            className="mb-2 d-none d-md-block"
          />
        </div>
      </div>

      <div className="d-flex flex-column align-items-start mt-5">
        <h6 className="text-dark-low">
          Having iterated on the wireframes using feedback from the founding
          team and their friends, it was time to bring the app to life.
        </h6>
      </div>

      <div className="d-flex flex-row align-items-start gap-0 w-100">
        <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4">
          <div className="position-relative w-100 aspect-ratio-wide">
            <img
              width="400"
              src="/images/splitzy-3.png"
              alt="Splitzy"
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
        <div
          className="d-flex flex-column align-items-center gap-5 mr-0"
          style={{ width: "40%", marginLeft: "-24px" }}
        >
          <div className="position-relative aspect-ratio-tall">
            <img
              width="400"
              src="/images/splitzy-4.png"
              alt="Splitzy"
              className="image-ff rotate-6 radius-3 order-0 article-image"
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
      <div
        className="d-flex flex-row align-items-start gap-0 w-100"
        style={{ marginTop: "-112px" }}
      >
        <div
          className="d-flex flex-column align-items-center gap-5 mr-0"
          style={{ width: "40%", marginLeft: "-24px" }}
        >
          <div className="position-relative aspect-ratio-tall">
            <video
              width="400"
              src="/images/splitzy-1.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="image-ff rotate-3 radius-3 order-0 article-image"
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
        <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4">
          <div className="position-relative w-100 aspect-ratio-wide">
            <img
              width="400"
              src="/images/splitzy-6.png"
              alt="Splitzy"
              className="image-ff rotate-4 radius-3 order-0 article-image"
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
      <div>
        <h6 className="text-dark-low mt-5">
          We worked through a few cycles of iterations before landing on
          something that the team really enjoyed.
        </h6>
        <h6 className="text-dark-low">
          The team also wanted a placeholder website for them to ensure they
          could begin to create hype and capture a list of people who were
          interested in the product when it went live.
        </h6>
      </div>
      <div className="d-flex flex-row align-items-start gap-0 w-100">
        <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4">
          <div className="position-relative w-100 aspect-ratio-wide">
            <img
              width="400"
              src="/images/splitzy-7.png"
              alt="Splitzy"
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
        <div
          className="d-flex flex-column align-items-center gap-5 mr-0"
          style={{ width: "40%", marginLeft: "-24px" }}
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
              className="image-ff rotate-6 radius-3 order-0 article-image"
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
      <div
        className="d-flex flex-row align-items-start gap-0 w-100"
        style={{ marginTop: "-112px" }}
      >
        <div
          className="d-flex flex-column align-items-center gap-5 mr-0"
          style={{ width: "40%", marginLeft: "-24px" }}
        >
          <div className="position-relative aspect-ratio-tall">
            <img
              width="400"
              src="/images/splitzy-9.png"
              className="image-ff rotate-3 radius-3 order-0 article-image"
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
        <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4">
          <div className="position-relative w-100 aspect-ratio-wide">
            <video
              width="400"
              src="/images/splitzy-3.mp4"
              autoPlay
              muted
              loop
              playsInline
              alt="Splitzy"
              className="image-ff rotate-4 radius-3 order-0 article-image"
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

      <div>
        <h6 className="text-dark-low mt-5">
          Splitzy launched in the autumn of 2024 and has been growing on
          campuses throughout the country, starting with an epicentre at the
          University of Leeds.
        </h6>
        <h6 className="text-dark-low">
          Since the launch, I have supported the team with some marketing
          materials as well as concept designs; to bring to life the team's
          vision for growing into a B2B product as they put their pitch deck
          together for their next fundraising round.
        </h6>
      </div>
    </div>
  );
});

export default SplitzySection;
