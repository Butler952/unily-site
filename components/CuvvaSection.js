import React, { forwardRef, useState } from 'react';

const CuvvaSection = forwardRef((props, ref) => {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    // You can change this PIN to whatever you want
    if (pin === '8810') {
      setIsLocked(false);
      setHasError(false);
    } else {
      // alert('Incorrect PIN');
      setHasError(true);
    }
  };

  const handlePinChange = (index, value) => {
    if (value.length <= 1) {
      const newPin = pin.split('');
      newPin[index] = value;
      setPin(newPin.join(''));
      
      // Clear error state when any input changes
      if (hasError) {
        setHasError(false);
      }
      
      // Auto-focus next input if a value was entered
      if (value && index < 3) {
        document.getElementById(`pin-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // If backspace is pressed and the input is empty, focus on previous input
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      document.getElementById(`pin-input-${index - 1}`).focus();
    }
  };

  return (
    <div ref={ref}
      className="d-flex flex-column align-items-start position-relative"
      style={{ marginTop: "120px", marginBottom: "120px", gap: "64px" }}
    >
      <div className="d-flex flex-column align-items-start w-100">
        <h5 className="text-dark-low mb-0">Cuvva</h5>
        <h3>Making cars multiplayer</h3>
        <h6 className="text-dark-low">
          Cuvva's mission statement is to{" "}
          <i>give everyone affordable access to a car anytime, anywhere.</i>
        </h6>
        <h6 className="text-dark-low">
          Building on the success of the short-term car insurance product;
          Cuvva's founder, Freddy, has a vision to achieve this ambitious
          mission by <i>making cars multiplayer.</i>
        </h6>
        <h6 className="text-dark-low">
          This side steps the need to add thousands of cars to Britain's roads
          and instead focuses on making better use of the many cars which are
          often sat idle.
        </h6>
        <h6 className="text-dark-low">
          Given that the existing short-term car insurance product often caters
          to people borrowing a car from someone that they already know (Mum's
          car to nip to the shop, your cousin's more comfy saloon for a long
          drive, a mate's van to move house), one of our focus areas was to grow
          these behaviours by resolving sharing pain points and providing a
          smoother experience.
        </h6>
        <h6 className="text-dark-low">
          After gathering new data and looking at existing data with this existing
          user base using surveys and user interviews, we collated the findings
          and identified key problems that users face with access, ownership,
          and lending their car.
        </h6>
        <h6 className="text-dark-low">
          We then went on to ideate on solutions to these problems, and created
          a business model canvas to test the viability of the solution.
        </h6>
        <h6 className="text-dark-low">
          The team ideated on "how can we help to give everyone affordable
          access to a car anytime, anywhere?" and arrived at four concepts:
        </h6>
      </div>
      
      {isLocked ? (
        <div 
          className="d-flex flex-column align-items-center justify-content-end w-100 position-absolute"
          style={{
            background: 'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.98) 50%, rgba(255,255,255,1))',
            minHeight: '300px',
            padding: '20px',
            top: '200px',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10
          }}
        >
          <div className="text-center" style={{ maxWidth: '400px' }}>
            <h3 className="mb-2">This content is locked</h3>
            <p className="text-dark-low mb-4">Please enter the PIN to unlock this section</p>
            <form onSubmit={handleUnlock} className="d-flex flex-column align-items-center">
              <div className="d-flex gap-2 mb-3">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`pin-input-${index}`}
                    type="text"
                    value={pin[index] || ''}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    className={`form-control text-center ${hasError ? 'error' : ''}`}
                    placeholder="•"
                    style={{ 
                      width: '45px', 
                      height: '45px', 
                      padding: '0px', 
                      fontFamily: 'monospace' 
                    }}
                    onFocus={(e) => e.target.placeholder = ''}
                    onBlur={(e) => e.target.placeholder = '•'}
                  />
                ))}
              </div>
              <button type="submit" className="btn dark high">Unlock</button>
            </form>
          </div>
        </div>
      ) : null}
      
      {!isLocked && (
        <>
          <div className="d-flex flex-column flex-md-row align-items-end gap-md-5 w-100">
            <div className="d-flex flex-column align-items-center gap-5 w-100 order-1 order-md-0">
              <div className="aspect-ratio-4-3">
                <img
                  width="400"
                  src="/images/cuvva-1.png"
                  alt="Cuvva"
                  className="image-ff rotate-1 radius-3 order-0 article-image"
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
                className="font-caveat static-rotate-1 mb-1 ml-5 d-none d-md-block"
                style={{ maxWidth: "320px" }}
              >
                Unpacking the key assumptions for each concept and planning
                experiments to test them
              </p>
              <img
                src="/images/arrows/arrow-4.svg"
                width="40"
                alt="Decorative arrow"
                className="mb-2 d-none d-md-block"
              />
            </div>
          </div>
          <div
            className="d-flex flex-column flex-md-row align-items-end gap-md-5 w-100"
            style={{ marginTop: "-56px" }}
          >
            <div className="d-flex flex-column align-items-center gap-5 w-100 order-0 order-md-1">
              <div className="aspect-ratio-wide">
                <img
                  width="560"
                  src="/images/cuvva-2.png"
                  alt="Cuvva"
                  className="image-ff rotate-4 radius-3 order-0 article-image"
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
            <div className="d-none d-md-flex flex-column align-items-end">
              <p
                className="font-caveat static-rotate-1 mb-1 ml-3 d-none d-md-block"
                style={{ maxWidth: "320px" }}
              >
                The team voting on our confidence meter towards committing to build
              </p>
              <img
                src="/images/arrows/arrow-4-flip.svg"
                width="40"
                alt="Decorative arrow"
                className="mb-2"
              />
            </div>
          </div>
          <div
            className="d-flex flex-column align-items-start w-100"
            style={{ marginTop: "-56px" }}
          >
            <div className="d-flex flex-column align-items-start gap-5 w-100 order-0 order-md-1">
              <div className="aspect-ratio-4-55-1 w-md-80">
                <img
                  width="560"
                  src="/images/cuvva-3.png"
                  alt="Cuvva"
                  className="image-ff rotate-3 radius-3 order-0 article-image"
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
            <div className="d-flex flex-column align-items-end order-1 order-md-0 mt-5 d-block d-md-none">
              <img
                src="/images/arrows/arrow-1.svg"
                width="48"
                alt="Decorative arrow"
                className="d-block d-md-none"
                style={{ marginLeft: "160px", marginTop: "-16px" }}
              />
              <p
                className="font-caveat static-rotate-1 mb-1 ml-0 d-block d-md-none"
                style={{ maxWidth: "320px" }}
              >
                The team voting on our confidence meter towards committing to build
              </p>
            </div>
          </div>
          <div className="d-flex flex-column align-items-start mt-5">
            <h6 className="text-dark-low">
              We assessed the jobs, pains and gains behind each idea and pulled the
              assumptions that underpinned those ideas. After prioritising our
              assumptions in order of which ones would kill the idea if found to be
              untrue, it was time to test them. So we set about coming up with ideas
              for experiments to run.
            </h6>
            <h6 className="text-dark-low">
              These experiments came in a mix of formats including surveys delivered
              via CRM to certain user segments, landing pages with paid ads driving
              traffic, and in-app fake doors.
            </h6>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-start gap-md-5 w-100">
            <div className="d-flex flex-column align-items-center gap-5 w-100 order-1 order-md-0">
              <div className="aspect-ratio-wide">
                <img
                  width="560"
                  src="/images/cuvva-4.png"
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
                Landing page + paid ads to test the co-subscription concept
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
                  src="/images/cuvva-5.png"
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
                Fake doors to capture interest in borrowing and lending cars to test
                the social garage concept
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
              By this point we had discounted the Co-Ownership concept due to a lack
              of desire internally to get into financing cars or to be a creditor,
              and due to the perceived effort required.
            </h6>
            <h6 className="text-dark-low">
              We also put community sharing concept on the back burner. There were
              some concerns with the scale of the scope required to deliver it, but
              we also felt that the Social Garage concept would provide a way to
              build stronger evidence that people wanted to lend and discover cars
              to borrow through Cuvva.
            </h6>
            <h6 className="text-dark-low">
              For Co-Subscription, from surveying customers and from the results of
              the paid ads to the landing page, we weren't confident that we were
              seeing enough demand to commit to delivering this concept either.{" "}
            </h6>
            <h6 className="text-dark-low">
              That left Social Garage concept. The fake door results looked
              promising that people has an interest in borrowing and lending cars,
              so we decided to built out a bit further behind the fake door.
            </h6>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-start gap-md-5 w-100">
            <div className="d-flex flex-column align-items-center gap-5 w-100 order-1 order-md-0">
              <div className="aspect-ratio-4-3">
                <img
                  width="400"
                  src="/images/cuvva-6.png"
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
                className="font-caveat static-rotate-1 mb-1 ml-5"
                style={{ maxWidth: "320px" }}
              >
                Share a link with people who might have a car you can borrow
              </p>
              <img
                src="/images/arrows/arrow-2.svg"
                width="48"
                alt="Decorative arrow"
                className="mb-2 d-none d-md-block"
              />
              <img
                src="/images/arrows/arrow-9-flip.svg"
                width="56"
                alt="Decorative arrow"
                className="mb-2 d-block d-md-none"
                style={{ marginLeft: "160px" }}
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
                  src="/images/cuvva-7.png"
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
                className="font-caveat static-rotate-1 mb-1 ml-3"
                style={{ maxWidth: "320px" }}
              >
                Invite people you already know to borrow your car
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
              Having contacted and interviewed some of those that tapped the "Lend
              your car" fake door (and subsequently real door), not being able to
              charge a fee was identified as the probably next biggest barrier to
              further lending activity.
            </h6>
            <h6 className="text-dark-low">
              Again we opted for a fake door to determine demand before committing
              to build the feature in full. To begin with we had a yes/no question
              leading to a fake door, then we updated it to learn how much they
              wanted to charge for lending their car out.
            </h6>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-start gap-md-5 w-100">
            <div
              className="d-flex flex-column align-items-center gap-5 w-100 order-1 order-md-0"
              style={{ marginRight: "-48px" }}
            >
              <div className="aspect-ratio-wide">
                <img
                  width="400"
                  src="/images/cuvva-8.png"
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
            <div
              className="d-flex flex-column align-items-start order-0 order-md-1 ml-5 ml-md-0 mt-0 mt-md-5"
              style={{ zIndex: "2", marginBottom: "-32px" }}
            >
              <p
                className="font-caveat static-rotate-1 mb-1 ml-5"
                style={{ maxWidth: "320px" }}
              >
                Version one to capture intent to add fees
              </p>
              <img
                src="/images/arrows/arrow-2.svg"
                width="48"
                alt="Decorative arrow"
                className="mb-2 d-none d-md-block"
              />
              <img
                src="/images/arrows/arrow-9-flip.svg"
                width="56"
                alt="Decorative arrow"
                className="mb-2 d-block d-md-none"
                style={{ marginLeft: "160px" }}
              />
            </div>
          </div>
          <div
            className="d-flex flex-column flex-md-row align-items-start gap-md-5 ml-4 ml-md-0 w-100 mb-2 mb-md-5"
            style={{ marginTop: "-80px" }}
          >
            <div
              className="d-flex flex-column align-items-center gap-5 w-100 order-0 order-md-1"
              style={{ maxWidth: "360px" }}
            >
              <div className="aspect-ratio-wide">
                <img
                  width="560"
                  src="/images/cuvva-9.png"
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
            <div
              className="d-flex flex-column align-items-end order-1 order-md-0"
              style={{ marginTop: "80px" }}
            >
              <img
                src="/images/arrows/arrow-1.svg"
                width="48"
                alt="Decorative arrow"
                className="d-block d-md-none"
                style={{ marginLeft: "160px", marginTop: "-16px" }}
              />
              <p
                className="font-caveat static-rotate-1 mb-1 ml-3"
                style={{ maxWidth: "320px" }}
              >
                Version two to gauge how much they want to charge
              </p>
              <img
                src="/images/arrows/arrow-5-rotated-2.svg"
                width="48"
                alt="Decorative arrow"
                className="mb-2 d-none d-md-block"
                style={{ marginTop: "-24px" }}
              />
            </div>
          </div>
          <div>
            <h6 className="text-dark-low">
              We saw enough interested in setting prices that we went ahead and
              built the full feature. There was now some activity being driven by
              the borrowing and lending link sharing, but not enough.
            </h6>
            <h6 className="text-dark-low">
              For the activity that was there, we also felt we might not be driving
              new borrows and lends, instead just making it easier for people who
              were going to do it anyway by allowing them to share a link with the
              person who was about to borrow their car, rather than telling the
              person to download the app and type in their registration.
            </h6>
            <h6 className="text-dark-low">
              We needed to encourage new borrowing that wouldn't have happened
              otherwise in order to drive a positive ROI. However, we were concerned
              about opening up stranger to stranger borrows and would rather keep it
              between people that know each other outside of the app.
            </h6>
            <h6 className="text-dark-low">
              So we decided to allow people to make the cars that they own in the
              Cuvva app visible to people who have their number in their contacts.
              This enabled people to discover cars to borrow from people that they
              already know.
            </h6>
          </div>
          <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-md-4">
            <div className="position-relative w-100 aspect-ratio-wide">
              <img
                width="400"
                src="/images/cuvva-10.png"
                alt="Cuvva"
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
          <div>
            <h6 className="text-dark-low">
              We also explored a ton of other concepts for improving the experience
              of discovering, borrowing and lending your car through Cuvva.
            </h6>
          </div>
          <div className="d-flex flex-row align-items-start gap-0 w-100">
            <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4">
              <div className="position-relative w-100 aspect-ratio-wide">
                <img
                  width="400"
                  src="/images/cuvva-11.png"
                  alt="Cuvva"
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
                  src="/images/cuvva-12.png"
                  alt="Cuvva"
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
                  src="/images/cuvva-lending.mp4"
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
                  src="/images/cuvva-14.png"
                  alt="Cuvva"
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
              After enabling people to discover cars to borrow from people that they
              already know showing user, we were still disappointed with the amount
              of lending/borrowing activity that this generated. We heard from users
              that they either didn't know anyone that would need to borrow their
              car or they were reluctant to charge people that they already knew.
            </h6>
            <h6 className="text-dark-low">
              We wanted to see regular borrowing from multiple people on one car but
              it wasn't happening right now.
            </h6>
            <h6 className="text-dark-low">
              An opportunity arose from outside of the company or our existing user
              base. Headlines were popping up around the country that car clubs were
              being left in the lurch by their insurers.
            </h6>
            <h6 className="text-dark-low">
              What is a car club? it's centred around a communal car or cars that
              are used by many different people—often residents in a local area,
              street, or even housing block. They could be provided by the council
              in that area, organised independently or provided by the housing
              developer in order to meet new legislation.
            </h6>
            <h6 className="text-dark-low">
              A car club allows people to have access to a car for semi-regular or
              infrequent use, without the burden—and crucially the cost—of owning a
              car. There's a booking system where members select in advance when
              they would like to use the car.
            </h6>
            <h6 className="text-dark-low">
              Members pay an annual or monthly fee to join the club, which helps to
              cover to the cost of purchasing, insuring and maintaining the car.
              Crucially, the fee is the same for anyone that joins the club,
              regardless of age, driving experience or incident history—and this is
              where their existing insurers had an issue.
            </h6>
            <h6 className="text-dark-low">
              Their insurers weren't comfortable with insuring a large number of
              people on one car at a flat rate, without taking into account the risk
              of each person who would be driving and decided to pull out from
              offering the policy which the clubs relied on.
            </h6>
            <h6 className="text-dark-low">
              We felt we were in the perfect position to step in and help keep these
              car clubs going. Whenever someone wanted to use the car, they would be
              able to book a slot in the 3rd party booking platform that they
              already used and then purchase short-term insurance through Cuvva. It
              would mean that someone would have to have an underlying policy on the
              vehicle to prevent the need for the car to be registered SORN between
              each booking, but it felt like better than letting the club collapse
              for good.
            </h6>
            <h6 className="text-dark-low">
              For Cuvva, it didn't represent a huge opportunity to grow the
              short-term insurance business by taking on these car clubs, but what
              it did do is allow us to work with people who are already exhibiting
              the types of behaviour that we were hoping to encourage in the wider
              population; multiple people regularly driving one car.
            </h6>
            <h6 className="text-dark-low">
              If we can make a great product for them, the early adopters of car
              sharing, perhaps that solution would also be useful as the wider
              popular begins to adopt those behaviours as well.
            </h6>
            <h6 className="text-dark-low">
              Unfortunately, car clubs were very resistant to changing their
              behaviours. Members typically have a "collective" mindset, and feel it
              is fundamentally wrong for people to be paying different amount for
              the same access to the same car—something that was not possible with
              out pricing model in which the most important variable of cost is the
              driver themselves.{" "}
            </h6>
          </div>
          <div className="d-flex flex-row align-items-start gap-0 w-100">
            <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4">
              <div className="position-relative w-100 aspect-ratio-wide">
                <img
                  width="400"
                  src="/images/cuvva-15.png"
                  alt="Cuvva"
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
                  src="/images/cuvva-16.png"
                  alt="Cuvva"
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
                  src="/images/cuvva-car-club.mp4"
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
                  src="/images/cuvva-18.png"
                  alt="Cuvva"
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
          <div
            className="d-flex flex-row align-items-start gap-0 w-100"
            style={{ marginTop: "-112px" }}
          >
            <div className="d-flex flex-column align-items-start gap-4 w-100 mb-4 mt-4">
              <div className="position-relative w-100 aspect-ratio-wide">
                <img
                  width="400"
                  src="/images/cuvva-19.png"
                  alt="Cuvva"
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
              style={{ width: "60%", marginLeft: "-24px" }}
            >
              <div className="position-relative aspect-ratio-square">
                <img
                  width="400"
                  src="/images/cuvva-20.png"
                  alt="Cuvva"
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
          <div>
            <h6 className="text-dark-low mt-5">
              After focusing on the essential items to solve the user concerns and
              questions we had identified in chats with people exhibiting borrowing
              and lending behaviours with Cuvva, we launched private car clubs,
              where people can create a group containing members and cars.
            </h6>
            <h6 className="text-dark-low">
              We hope this would enable existing car clubs and other people to share
              one or multiple cars with a group of people in a high-trust way (i.e.
              they know each other off-platform).
            </h6>
            <h6 className="text-dark-low">
              However, car clubs did not want to engage with it as it would mean a
              change in how they operated (by having to pay different amounts each
              person, each time they borrowed the car) and it failed to trigger more
              sharing behaviour that wouldn't have happened anyway.
            </h6>
            <h6 className="text-dark-low">
              So we decided to leap to make the leap to starting to allow people to
              discover cars to borrow from people that they don't already know and
              launched public car clubs.
            </h6>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-start gap-md-5 w-100">
            <div className="d-flex flex-column align-items-center gap-5 w-100 order-1 order-md-0">
              <div className="aspect-ratio-4-3">
                <img
                  width="400"
                  src="/images/cuvva-21.png"
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
                className="font-caveat static-rotate-1 mb-1 ml-5"
                style={{ maxWidth: "320px" }}
              >
                Creating a public club and making it visible to potential borrowers
              </p>
              <img
                src="/images/arrows/arrow-2.svg"
                width="48"
                alt="Decorative arrow"
                className="mb-2 d-none d-md-block"
              />
              <img
                src="/images/arrows/arrow-9-flip.svg"
                width="56"
                alt="Decorative arrow"
                className="mb-2 d-block d-md-none"
                style={{ marginLeft: "160px" }}
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
                  src="/images/cuvva-22.png"
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
                className="font-caveat static-rotate-1 mb-1 ml-3"
                style={{ maxWidth: "320px" }}
              >
                Discovering cars to borrow in car clubs near your home address
              </p>
              <img
                src="/images/arrows/arrow-5-rotated-2.svg"
                width="48"
                alt="Decorative arrow"
                className="mb-2 d-none d-md-block"
              />
            </div>
          </div>
          <div>
            <h6 className="text-dark-low mt-5">
              Despite the launch, there hasn't been much sharing behaviour driven by
              public car clubs. Limiting the discovering distance ot maximum 1 mile
              and keeping the framing of "Car Club" has been a mistake.
            </h6>
            <h6 className="text-dark-low">
              When we first realised that Car Clubs were not going to engage with a
              product that forced them to change their behaviour and expectations on
              how car sharing can work, we should have moved away from the car club
              concept.{" "}
            </h6>
            <h6 className="text-dark-low">
              Based on evidence we accumulated through interviews, surveys and fake
              doors, it is confusing for people who want to look for a car to borrow
              to have to be met with a "car club" that thy have to join in order to
              see more about the car, let alone book or send a request to borrow the
              car.{" "}
            </h6>
            <h6 className="text-dark-low">
              It stemmed from the business hoping to drive more car sharing
              behaviour, and thus more short-term insurance sales, without wanted to
              take responsibility for liability when things inevitably go wrong
              (disputes, damage and theft).{" "}
            </h6>
          </div>
        </>
      )}
    </div>
  );
});

export default CuvvaSection;
