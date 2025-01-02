import { useState, useEffect, forwardRef, Children, useContext } from "react";
import fire from "../../config/fire-config";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { Dropdown, Modal } from "react-bootstrap";
import styles from "./Header.module.scss";
import Icon from "../icon/Icon";
import ICONS from "../icon/IconPaths";
import { loadStripe } from "@stripe/stripe-js";
import { UserContext } from "../../pages/_app";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "config/mixpanel-config";
import { Img } from "react-image";

const MenuSidebar = ({
	dark,
	hideShadow,
	topOfLanding,
	positionFixed,
	showEditProfileModal,
	setShowEditProfileModal,
	editProfileModalState,
	setEditProfileModalState,
	editProfileModalSubtitle,
	setEditProfileModalSubtitle,
	editProfileModalIndex,
	setEditProfileModalIndex,
	handleEditProfileClose,
	handleEditProfileShow,
	handleEditProfileChangeView,
  smallScreen
}) => {
	const { userContext, setUserContext } = useContext(UserContext);

	const [loggedIn, setLoggedIn] = useState(false);
	const [profileUrl, setProfileUrl] = useState(
		userContext && userContext.profileUrl && userContext.profileUrl
	);
	const [customDomain, setCustomDomain] = useState(userContext?.domain?.name);
	const [windowUrl, setWindowUrl] = useState("");
	// const [profile, setProfile] = useState('')
	const [userData, setUserData] = useState("");
	const [stage, setStage] = useState(
		userContext && userContext.stage && userContext.stage
	);
	const router = useRouter();
	const [redirectToStripe, setRedirectToStripe] = useState(false);
	const [product, setProduct] = useState("");
	const [active, setActive] = useState("");
	const [status, setStatus] = useState("");
	const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
	const [cancelAt, setCancelAt] = useState("");
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [commentsAndSuggestions, setCommentsAndSuggestions] = useState("");
	const [commentsAndSuggestionsError, setCommentsAndSuggestionsError] =
		useState("");
	const [furtherResearch, setFurtherResearch] = useState(false);
	const [submittingFeedback, setSubmittingFeedback] = useState(false);
	const [submittedFeedback, setSubmittedFeedback] = useState(false);
	const [headerImageError, setHeaderImageError] = useState(false);
	const [shortlist, setShortlist] = useState(
		userContext && userContext.shortlist ? userContext.shortlist : []
	);

	// const { profile, setProfile } = useContext(ProfileContext);

	const [screenWidth, setScreenWidth] = useState("");

	const handleResize = () => {
		setScreenWidth(window.innerWidth);
	};

	useEffect(() => {
		Router.events.on("routeChangeComplete", () => {
			setWindowUrl(window.location.pathname);
		});
		setWindowUrl(window.location.pathname);
		setScreenWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		// document.body.style.background = '#F6F6F4';
		const unsubscribe = fire.auth().onAuthStateChanged((user) => {
			if (user) {
				loggedInRoute(user);
				// getSubscription(user)
			} else {
				if (typeof localStorage.shortlist != "undefined") {
					setShortlist(JSON.parse(localStorage.shortlist));
				}
			}
		});
		return () => {
			// Unmouting
			unsubscribe();
		};
	}, []);

	const loggedInRoute = (user) => {
		setUserData(user);
		setLoggedIn(true);
		if (userContext !== "") {
			// setStage(userContext && userContext.stage && userContext.stage)
			// setStage(userContext.stage)
			// if (userContext.profileUrl) {
			//   setProfileUrl(userContext.profileUrl)
			// }
		} else {
			var docRef = fire.firestore().collection("users").doc(user.uid);

			docRef
				.get()
				.then((doc) => {
					if (doc.exists) {
						setUserContext(doc.data());
						setShortlist(doc.data().shortlist ? doc.data().shortlist : []);
						//setProfile(doc.data().profile)
						//setStage(doc.data().stage)
						// if (doc.data().stage !== 'complete') {
						//   router.push(doc.data().stage)
						// } else {
						//   setProfileUrl(doc.data().profileUrl)
						//   setCustomDomain(doc.data().domain?.name)
						// }
					} else {
						console.log("No such document!");
					}
				})
				.catch((error) => {
					console.log("Error getting document:", error);
				});
		}
	};

	const handleLogout = () => {
		setUserContext("");
		fire
			.auth()
			.signOut()
			.then(() => {
				localStorage.removeItem("shortlist");
				localStorage.removeItem("rejected");
				localStorage.removeItem("lastRandomDocumentId");
				localStorage.removeItem("emailForSignIn");
				router.push("/");
			});
	};

	const getSubscription = (user) => {
		var docRef = fire
			.firestore()
			.collection("users")
			.doc(user.uid)
			.collection("subscriptions");
		//docRef.get()
		docRef
			.where("status", "==", "active")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setProduct(doc.data().items[0].plan.product);
					setActive(doc.data().items[0].plan.active);
					setStatus(doc.data().status);
					setCancelAtPeriodEnd(doc.data().cancel_at_period_end);
					doc.data().cancel_at &&
						doc.data().cancel_at.seconds &&
						setCancelAt(doc.data().cancel_at.seconds);
				});
			})
			.then(() => {
				// console.log('Retreived subscription data from database')
			})
			.catch((error) => {
				console.log("Error getting document:", error);
			});
	};

	async function handleUpgrade(e, user) {
		e.preventDefault();
		setRedirectToStripe(true);
		const docRef = await fire
			.firestore()
			.collection("users")
			.doc(userData.uid)
			.collection("checkout_sessions")
			.add({
				price: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
				success_url: window.location.origin + "/settings?upgrade=success",
				cancel_url: window.location.origin + "/settings?upgrade=cancelled",
			});
		// Wait for the CheckoutSession to get attached by the extension
		docRef.onSnapshot(async (snap) => {
			const { error, sessionId } = snap.data();
			if (error) {
				// Show an error to your customer and
				// inspect your Cloud Function logs in the Firebase console.
				alert(`An error occured: ${error.message}`);
			}
			if (sessionId) {
				// We have a session, let's redirect to Checkout
				// Init Stripe
				const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);
				stripe.redirectToCheckout({ sessionId });
			}
		});
	}
	// Dev Premium Subscription End

	// Dev Customer Portal Start
	async function handleUpdate(e) {
		e.preventDefault();
		const functionRef = fire
			.app()
			.functions("europe-west2")
			.httpsCallable("ext-firestore-stripe-subscriptions-createPortalLink");
		const { data } = await functionRef({
			returnUrl: window.location.origin + "/settings",
		});
		window.location.assign(data.url);
	}
	// Dev Customer Portal End

	// const defaultOptions = {
	//   loop: true,
	//   autoplay: true,
	//   animationData: animationData,
	//   rendererSettings: {
	//     preserveAspectRatio: 'xMidYMid slice'
	//   }
	// };

	const handleFeedbackClose = () => {
		setShowFeedbackModal(false);
	};
	const handleFeedbackShow = () => {
		setSubmittedFeedback(false);
		setShowFeedbackModal(true);
	};

	// const handleEditProfileClose = () => {
	//   setShowEditProfileModal(false);
	//   // setEditProfileModalState('default')
	// };

	// These two (above and below) need to be moved to the Profile page
	// const handleEditProfileShow = () => {
	//   setShowEditProfileModal(true)
	//   setEditProfileModalState('default')
	//   setEditProfileModalIndex('')
	//   mixpanel.init(mixpanelConfig);
	//   mixpanel.track('Launch edit profile modal');
	// };

	// const handleEditProfileChangeView = (page, subtitle, index) => {
	//   setEditProfileModalState(page)
	//   setEditProfileModalSubtitle(subtitle)
	//   setEditProfileModalIndex(index)
	// }

	const commentsAndSuggestionsChange = (value) => {
		setCommentsAndSuggestions(value);
		setCommentsAndSuggestionsError("");
	};

	const furtherResearchChange = () => {
		setFurtherResearch((furtherResearch) => !furtherResearch);
	};

	const copyProfileAddress = () => {
		if (customDomain !== undefined) {
			navigator.clipboard.writeText(`${customDomain}`);
		} else {
			navigator.clipboard.writeText(`${window.location.origin}${profileUrl}`);
		}
		toast("Copied profile link to clipboard");
	};

	const goToProfile = () => {
		if (customDomain !== undefined) {
			return customDomain;
		} else {
			return `${window.location.origin}${profileUrl}`;
		}
	};

	const handleFeedbackSubmit = (e) => {
		e.preventDefault();

		if (commentsAndSuggestions == "") {
			setCommentsAndSuggestionsError("Please provide a response");
			return null;
		}

		setSubmittingFeedback(true);

		fire
			.firestore()
			.collection("surveys")
			.doc("generalFeedback")
			.collection("responses")
			.add({
				commentsAndSuggestions: commentsAndSuggestions,
				furtherResearch: furtherResearch,
				userID: userData.uid,
				submitted: fire.firestore.FieldValue.serverTimestamp(),
			})
			.then(() => {
				setSubmittedFeedback(true);
				setSubmittingFeedback(false);
				setCommentsAndSuggestions("");
				setFurtherResearch(false);
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});
	};

	// The forwardRef is important!!
	// Dropdown needs access to the DOM node in order to position the Menu
	const CustomToggle = forwardRef(({ children, onClick }, ref) => (
		<a
			href=""
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
		</a>
	));

	// forwardRef again here!
	// Dropdown needs access to the DOM of the Menu to measure it
	const CustomMenu = forwardRef(
		({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
			return (
				<div
					ref={ref}
					style={style}
					className={className}
					aria-labelledby={labeledBy}
				>
					<ul className="list-unstyled m-0">{children}</ul>
				</div>
			);
		}
	);

	return (
		<div>
			<>
				<div className={`border-1 border-top-0 border-bottom-0 border-solid border-dark-300 ${!smallScreen && `border-left-0 border-right-1`} d-flex flex-column justify-content-between d-flex h-100 p-3 bg-background`} style={{width: '240px', minHeight: '100vh'}}>
          <div className="d-flex flex-column" style={{gap: '32px'}}>
            <Link href="/" className="w-lg-100 m-2">
              <svg height="32" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  className={`fill-dark-900`}
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d={ICONS.LOGO_ICON} 
                />
              </svg>
            </Link>
            {!windowUrl.startsWith('/names') && 
              <Link href="/names" className={`btn dark ${windowUrl.startsWith('/names') ? 'low' : 'high'} x-small icon-left`}>
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.SEARCH}></path>
                </svg>
                Browse names
              </Link>
            }
            <div className="d-flex flex-column">
              <Link href="/shortlist" className={`btn dark ${windowUrl.startsWith('/shortlist') ? 'low' : 'ultraLow'} x-small icon-left`}>
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.SHORTLIST}></path>
                </svg>
                Shortlist
              </Link>
              <Link href="/store" className={`btn dark ${windowUrl.startsWith('/store') ? 'low' : 'ultraLow'} x-small icon-left`}>
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.STORE}></path>
                </svg>
                Store
              </Link>
              <Link href="/settings" className={`btn dark ${windowUrl.startsWith('/settings') ? 'low' : 'ultraLow'} x-small icon-left`}>
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.SETTINGS}></path>
                </svg>
                Settings
              </Link>
            </div>
          </div>
          <div className="d-flex flex-column">
            <button onClick={() => handleFeedbackShow()} className="btn dark ultraLow x-small icon-left">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.FEEDBACK}></path>
              </svg>
              Send feedback
            </button>
            <Link href="users/register" className="btn dark ultraLow x-small icon-left">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.CREATE_ACCOUNT}></path>
              </svg>
              Create account
            </Link>
            <Link href="users/login" className="btn dark ultraLow x-small icon-left">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.SIGN_IN}></path>
              </svg>
              Sign in
            </Link>
            <p className="text-dark-dis caption m-3">Terms・Privacy・Cookies</p>
          </div>
          {/* <div className="d-flex flex-row justify-content-center align-items-center"> */}
						{/* <Dropdown align="end">
              <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" className="text-decoration-none">
                <>
                  <div className="d-flex flex-row align-items-center btn dark low small icon-only">
                    <svg viewBox="0 0 24 24">
                      <path 
                        d={ICONS.MENU}
                      ></path>
                    </svg>
                  </div>
                </>

              </Dropdown.Toggle>
              <Dropdown.Menu as={CustomMenu} align="end" className="mt-2">
                
                {!loggedIn && (
                  <>
                    <div className="p-2">
                      <Dropdown.Item onClick={() => router.push('/users/register')} className={`dropdownItem `}>
                        Create account
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => router.push('/users/login')} className={`dropdownItem`}>
                        Login
                      </Dropdown.Item>
                    </div>
                    <hr className={`m-0`} />
                  </>
                )}
                <div className="p-2">
                  { screenWidth < 768 && (
                  <Dropdown.Item onClick={() => router.push('/shortlist')} className={`dropdownItem d-flex justify-content-between`}>
                    <div className="d-flex flex-row align-items-center gap-3">
                      Shortlist{" "}
                    </div>
                    <div className="tag dark medium small ml-2">{shortlist.length}</div>
                  </Dropdown.Item>
                  )}
                  {loggedIn &&
                    <Dropdown.Item onClick={() => router.push('/settings')} className={`dropdownItem`}>
                      Account
                    </Dropdown.Item>
                  }
                  <Dropdown.Item onClick={() => handleFeedbackShow()} className={`dropdownItem`}>
                    Submit feedback
                  </Dropdown.Item>
                </div>
                {loggedIn && 
                  <>
                  <hr className={`m-0`} />
                  <div className="p-2">
                    <Dropdown.Item onClick={() => handleLogout()} className={`dropdownItem dropdownItemLow`}>
                      Sign out
                    </Dropdown.Item>
                  </div>
                  </>
                }
              </Dropdown.Menu>
            </Dropdown> */}
					{/* </div> */}
				</div>
			</>

			<Modal
				show={showFeedbackModal}
				onHide={handleFeedbackClose}
				keyboard={false}
				// size="lg"
			>
				{!submittedFeedback ? (
					<Modal.Body>
						<div>
							<div className="d-flex flex-row align-items-center justify-content-between mb-2">
								<h3 className="mb-0">Feedback survey</h3>
								<button
									onClick={handleFeedbackClose}
									className="btn dark low icon-only"
								>
									<svg viewBox="0 0 24 24">
										<path d={ICONS.CLOSE}></path>
									</svg>
								</button>
							</div>
							<form onSubmit={handleFeedbackSubmit}>
								<div className="mb-4">
									<p>
										Tell us all about:
										<ul>
											<li>...what you love</li>
											<li>...what you hate</li>
											<li>...what you want to see more of</li>
											<li>
												...your child who has begun forming an empire by raising
												an army of local shepherds
											</li>
										</ul>
									</p>
									<textarea
										className="w-100 small"
										style={{ minHeight: "10rem" }}
										disabled={submittingFeedback}
										value={commentsAndSuggestions}
										onChange={({ target }) =>
											commentsAndSuggestionsChange(target.value)
										}
									/>
									{commentsAndSuggestionsError !== "" ? (
										<p className="small text-error-high">
											{commentsAndSuggestionsError}
										</p>
									) : null}
								</div>
								<br />
								<button
									type="submit"
									className="btn primary high w-100"
									disabled={submittingFeedback}
								>
									{submittingFeedback ? "Submitting..." : "Submit feedback"}
								</button>
							</form>
						</div>
					</Modal.Body>
				) : (
					<Modal.Body>
						<div>
							<h4 className="text-center">Feedback successfully submitted</h4>
							<p className="text-center large mb-5">
								Thank you for taking the time to send over your comments and
								feedback. Your response will help us to make the product even
								better for you.
							</p>
							<button
								type="button"
								onClick={handleFeedbackClose}
								className="btn primary high w-100"
							>
								Close
							</button>
						</div>
					</Modal.Body>
				)}
			</Modal>
		</div>
	);
};

export default MenuSidebar;
