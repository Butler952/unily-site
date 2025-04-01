import React, { forwardRef } from 'react';

const ActivateSection = forwardRef((props, ref) => {
  return (
    <div ref={ref}
      className="d-flex flex-column align-items-start"
      style={{ marginTop: "120px", marginBottom: "120px", gap: "64px" }}
    >
      <div className="d-flex flex-column align-items-start ">
        <h5 className="text-dark-low mb-0">Activate</h5>
        <h3>From idea to MVP</h3>
        <h6 className="text-dark-low">
          Activate is a startup studio that helps non-technical founders with
          industry knowledge to go from idea to launched MVP and beyond.
        </h6>
        <h6 className="text-dark-low">
          Once or twice a year we would open applications. When a founder has
          been selected, we would help them to refine their business idea,
          define their target user, create a prototype, and start validating
          their key business hypotheses.
        </h6>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-start gap-5 w-100">
        <div className="d-flex flex-column align-items-center gap-5 w-100">
          <div className="aspect-ratio-4-3">
            <img
              width="400"
              src="/images/activate-2.png"
              alt="Activate"
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
        <div className="d-flex flex-column align-items-start gap-4 w-100 activate-images-1">
          <div className="aspect-ratio-4-3">
            <img
              width="400"
              src="/images/activate-1.png"
              alt="Activate"
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
      <div
        className="d-flex flex-column align-items-center ml-auto mr-5"
        style={{ marginTop: "-24px" }}
      >
        <img
          src="/images/arrows/arrow-1.svg"
          width="48"
          alt="Decorative arrow"
          className="mb-2"
        />
        <p
          className="font-caveat static-rotate-1"
          style={{ maxWidth: "320px" }}
        >
          Facilitating a business model Workshop whilst working with early-stage
          startups at Activate
        </p>
      </div>
      <div className="d-flex flex-column align-items-start ">
        <h6 className="text-dark-low">
          If the business case seems sound, we would help them prepare to their
          pitch deck for their first round of funding and make initial
          introductions to investors.
        </h6>
        <h6 className="text-dark-low">
          After the funding is secured, Activate would become the founding
          technical team—building and launching their MVP to get them to market.
          Ideally, the business then grows out from there, building their own
          tech team and becoming self-sustaining.
        </h6>
      </div>
      <div
        className="d-flex flex-row align-items-start gap-5 w-100"
        style={{ marginLeft: "24px" }}
      >
        <div className="d-flex flex-column align-items-center gap-5 w-100">
          <div className="aspect-ratio-square">
            <img
              width="400"
              src="/images/activate-3.png"
              alt="Activate"
              className="image-ff rotate-6 radius-3 order-0 article-image article-image-scale"
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
          className="d-flex flex-column align-items-start gap-4 w-100"
          style={{ marginLeft: "-24px" }}
        >
          <div className="aspect-ratio-square">
            <img
              width="400"
              src="/images/activate-4.png"
              alt="Activate"
              className="image-ff rotate-3 radius-3 order-0 article-image article-image-scale"
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
      </div>
      <div
        className="d-flex flex-row align-items-start gap-5 w-100"
        style={{ marginTop: "-96px" }}
      >
        <div className="d-flex flex-column align-items-center gap-5 w-100">
          <div className="aspect-ratio-square">
            <img
              width="400"
              src="/images/activate-5.png"
              alt="Activate"
              className="image-ff rotate-1 radius-3 order-0 article-image article-image-scale"
              style={{
                position: "absolute",
                top: 0,
                height: "100%",
                objectFit: "cover",
                zIndex: 3,
              }}
            />
          </div>
        </div>
        <div
          className="d-flex flex-column align-items-start gap-4 w-100"
          style={{ marginLeft: "-24px", marginTop: "24px" }}
        >
          <div className="aspect-ratio-square">
            <img
              width="400"
              src="/images/activate-6.png"
              alt="Activate"
              className="image-ff rotate-4 radius-3 order-0 article-image article-image-scale"
              style={{
                position: "absolute",
                top: 0,
                height: "100%",
                objectFit: "cover",
                zIndex: 4,
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <h6 className="text-dark-low mt-5">
          During my time at a small startup studio, I had over three years of
          experience helping non-technical founders from a range of
          industries—including mental health, pets, gaming, holistic health and
          film production—to take their business from just an idea to a working
          MVP and beyond.
        </h6>
        <h6 className="text-dark-low">
          What I learned:
          <ul>
            <li>Insight into fundraising and pitch decks.</li>
            <li>How to build a business case around an idea</li>
            <li>
              Defining key business hypotheses and run experiments to test them
            </li>
            <li>Starting with a customer problem based on industry insight</li>
            <li>
              Facilitating workshops gather inspiration, generate ideas and
              align the team on a direction to go in
            </li>
            <li>How to quickly move from idea to prototype and get feedback</li>
            <li>Insight into tech stacks for web and mobile</li>
            <li>
              Managing a team of engineers as Product Manager of our internal
              product "Activate U"; a tool to manage our flow of applications to
              the startup studio programme.
            </li>
            <li>
              Experience working directly with founders Gathering information on
              turning ideas into businesses and trying to formulate a repeatable
              process for doing so successfully
            </li>
            <li>
              Some insight into pricing, growth hacking and marketing techniques
              across a variety of channels
            </li>
          </ul>
        </h6>
      </div>
    </div>
  );
});

export default ActivateSection;
