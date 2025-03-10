import { useState, useEffect, forwardRef, useContext, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Dropdown, Modal } from "react-bootstrap";
import fire from "/config/fire-config";

import styles from "./shortlist.module.scss";
import Icon from "/components/icon/Icon";
import ICONS from "/components/icon/IconPaths";
import Footer from "/components/footer/Footer";
import PostCard from "/components/blog/PostCard";
import NAMES from "../names";
import { UserContext } from "pages/_app";
import Menu from "components/header/Menu";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import MenuSidebar from "components/header/MenuSidebar";
import { motion, AnimatePresence } from "framer-motion";
import SidebarLayout from "components/layout/SidebarLayout";

const Shortlist = () => {
	const router = useRouter();

	const { userContext, setUserContext } = useContext(UserContext);
	const [loggedIn, setLoggedIn] = useState(false);
	const [userData, setUserData] = useState("");

	const [screenWidth, setScreenWidth] = useState("");
	const [removing, setRemoving] = useState(false);
	const [shortlist, setShortlist] = useState(
		userContext && userContext.shortlist ? userContext.shortlist : []
	);
	const [retreivingNames, setRetreivingNames] = useState(true);
	const [retreivedNames, setRetreivedNames] = useState([]);
	const [initialized, setInitialized] = useState(false);

	const [shareName, setShareName] = useState(null);
	const [shareDescription, setShareDescription] = useState(null);
	const [showNameDetailsView, setShowNameDetailsView] = useState(false);

	const [windowLocationOrigin, setWindowLocationOrigin] = useState(undefined);
	const [sharingName, setSharingName] = useState(false);

	const [showMenu, setShowMenu] = useState(false);

	// Add ref for the sidebar
	const sidebarRef = useRef(null);

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

	// [x] Get shortlist from local
	// [x] Save to a state
	// [x] Get the names of all id's in the array
	// [x] Output the array to a map
	// [ ] Have a button next to each one to remove the item (from state + local storage)
	//  [ ] get current array,
	//  [ ] remove item that matches id
	//  [ ] set shortlist as the new array in local storage
	// [ ] Navigate back to the 'names' pages

	const handleResize = () => {
		setScreenWidth(window.innerWidth);
    if (window.innerWidth > 767 && showMenu) {
      setShowMenu(false)
    }
	};

	useEffect(() => {
		setScreenWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		setWindowLocationOrigin(window.location.origin);

		const { signIn } = router.query;

		// Check for signIn query parameter
		if (signIn === "complete") {
			confirmLoginWithLink();
		}

		const unsubscribe = fire.auth().onAuthStateChanged((user) => {
			if (user) {
				loggedInRoute(user);
				// getSubscription(user)
			} else {
				if (userContext == "" && typeof localStorage.shortlist != "undefined") {
					setShortlist(JSON.parse(localStorage.shortlist));
					getNames(JSON.parse(localStorage.shortlist));
				}
				setRetreivingNames(false);
				setInitialized(true);
			}
		});
		return () => {
			// Unmouting
			unsubscribe();
		};
	}, [router.query]);

	const confirmLoginWithLink = (e) => {
		console.log("1");
		// Confirm the link is a sign-in with email link.
		if (fire.auth().isSignInWithEmailLink(window.location.href)) {
			console.log("2");
			var email = localStorage.getItem("emailForSignIn");
			if (!email) {
				email = window.prompt("Please provide your email for confirmation");
			}

			fire
				.auth()
				.signInWithEmailLink(email, window.location.href)
				.then((userCredential) => {
					console.log("3");
					// First check if user document exists
					return fire
						.firestore()
						.collection("users")
						.doc(userCredential.user.uid)
						.get()
						.then((doc) => {
							if (!doc.exists) {
								// Only create document if it doesn't exist
								return fire
									.firestore()
									.collection("users")
									.doc(userCredential.user.uid)
									.set({
										email: userCredential.user.email,
										shortlist:
											typeof localStorage.getItem("shortlist") != "undefined"
												? JSON.parse(localStorage.shortlist)
												: [],
										rejected:
											typeof localStorage.getItem("rejected") != "undefined"
												? JSON.parse(localStorage.rejected)
												: [],
										created: fire.firestore.FieldValue.serverTimestamp(),
										lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
									});
							}
							// If doc exists, continue without setting
							return Promise.resolve();
						});
				})
				.then(() => {
					console.log("4");
					toast("Signed in");
					localStorage.removeItem("emailForSignIn");
					localStorage.removeItem("shortlist");
					localStorage.removeItem("rejected");
				})
				.catch((error) => {
					// Some error occurred, you can inspect the code: error.code
					// Common errors could be invalid email and invalid or expired OTPs.
				});
		}
	};

	const loggedInRoute = (user) => {
		setLoggedIn(true);
		setUserData(user);
		// console.log(user)
		fire
			.firestore()
			.collection("users")
			.doc(user.uid)
			.get()
			.then((doc) => {
				if (doc.exists) {
					setUserContext(doc.data());
					setShortlist(doc.data().shortlist);
					getNames(doc.data().shortlist);
					setRetreivingNames(false);
					setInitialized(true);
				} else {
					console.log("No such document!");
					setInitialized(true);
				}
			})
			.catch((error) => {
				setRetreivingNames(false);
				console.log("Error getting document:", error);
				setInitialized(true);
			});
	};

	const removeName = (nameId) => {
		setRemoving(true);
		let idArray = shortlist;
		let namesArray = retreivedNames;

		const filteredIdArray = idArray.filter((id) => id !== nameId);
		const filteredNamesArray = namesArray.filter((name) => name.id !== nameId);

		setShortlist(filteredIdArray);

		if (loggedIn) {
			fire
				.firestore()
				.collection("users")
				.doc(userData.uid)
				.update({
					shortlist: filteredIdArray,
					lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
				})
				.catch((err) => {
					console.log(err.code, err.message);
				});
		} else {
			localStorage.setItem("shortlist", JSON.stringify(filteredIdArray));
		}
		setRetreivedNames(filteredNamesArray);
		// console.log(filteredIdArray)
		// console.log(nameId)
		setRemoving(false);
	};

	const getNames = (shortlistIds) => {
		// let an empty name array
		// for each item in the shortlist array
		// get the name from firebase
		// add each name object to the name array
		// setRetreivingNames(false)

		if (shortlistIds) {
			let namesArray = [];
			for (let i = 0; i < shortlistIds.length; i++) {
				const nameId = shortlistIds[i];
				fire
					.firestore()
					.collection("names")
					.doc(nameId)
					.get()
					.then((doc) => {
						let nameData = doc.data();
						nameData.id = nameId;
						namesArray.push(nameData);
					})
					.then(() => {
						if (i === shortlistIds.length - 1) {
							setRetreivedNames(namesArray);
							setRetreivingNames(false);
						}
					})
					.catch((error) => {
						console.log("Error getting document:", error);
					});
			}
		}
		// if (shortlistIds) {

		//   let namesArray = []
		//   shortlistIds.forEach((nameId) => {
		//     fire.firestore().collection('names').doc(nameId).get()
		//     .then((doc) => {
		//       // console.log(doc.data())
		//       let nameData = doc.data()
		//       nameData.id = nameId
		//       namesArray.push(nameData)
		//     })
		//     .then(() => {
		//       setRetreivedNames(namesArray)
		//       setRetreivingNames(false)
		//     })
		//     .catch((error) => {
		//       console.log("Error getting document:", error);
		//     })
		//   })
		// }
		else {
			setRetreivingNames(false);
			console.log("no names in shortlist");
		}
	};

  const handleShowMenu = () => {
		setShowMenu(true);
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

	const handleShowNameDetailsView = (name, description) => {
		setShareName(name);
		setShareDescription(description);
		setShowNameDetailsView(true);
	};

	const handleNameDetailsViewClose = () => {
		setShowNameDetailsView(false);
	};

	const nameShareData = `I might have found the perfect name for our baby: ${shareName}. \n\nDon't like it? Find more on ${windowLocationOrigin}`;
	const shortlistShareData = `I love these names for our baby:\n${retreivedNames
		.map((name) => `• ${name.name}`)
		.join("\n")}\n\nDon't like them? Find more on ${windowLocationOrigin}`;
	const whatsappShareNameData = `https://wa.me/?text=${encodeURIComponent(
		nameShareData
	)}`;
	const whatsappShareShortlistData = `https://wa.me/?text=${encodeURIComponent(
		shortlistShareData
	)}`;
	// const whatsappShareShortlistData = `https://wa.me/?text=I%20love%20these%20names%20for%20our%20baby%3A%20${shareName}.%20Don%E2%80%99t%20like%20it%3F%20Find%20more%20on%20${window.location.origin}.`
	const instagramShareLink = `https://www.instagram.com/direct/inbox/`;

	const copyNameToClipboard = () => {
		navigator.clipboard.writeText(nameShareData);
		toast("Copied name to clipboard");
	};

	const copyShortlistToClipboard = () => {
		navigator.clipboard.writeText(shortlistShareData);
		toast("Copied name to clipboard");
	};

	const handleNavigatorShare = async (data) => {
		setSharingName(true);
		try {
			await navigator.share({ text: data });
			// console.log("Shared successfully");
			toast("Shared");
			setSharingName(false);
		} catch (err) {
			// console.error("Error sharing:", err);
			setSharingName(false);
		}
	};

	return (
		<div className="overflow-hidden" style={{ backgroundColor: "#F6F6F4" }}>
			<Head>
				<title>Shortlist</title>
				<meta
					name="description"
					content="Turn your Linkedin profile into a resume in just two minutes."
				/>
				<meta
					property="og:title"
					content="Turn your Linkedin profile into a resume | vitaely.me"
				/>
				<meta
					property="og:description"
					content="Turn your Linkedin profile into a resume in just two minutes."
				/>
				<meta
					property="og:url"
					content="https://www.vitaely.me/linkedin-to-resume"
				/>
				<meta property="og:type" content="website" />
				{/* <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me%2Flinkedin-to-resume"/> */}
			</Head>
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
				<div className="w-100">
					{/* <div className="d-flex flex-row justify-content-between align-items-center p-2 px-md-3 w-100">
						<Link
							href="/names"
							className="btn dark ultraLow small icon-left text-only"
						>
							<svg viewBox="0 0 24 24">
								<path d={ICONS.ARROW_LEFT}></path>
							</svg>
							Find more names
						</Link>
						<Menu />
					</div> */}
					<div
						className="d-flex flex-column align-items-center px-3 px-md-5 w-100"
						style={{ paddingTop: "48px", paddingBottom: "160px" }}
					>
						{/* {shortlist.map((id, index) => <p key={index} className="large">{id}</p>)} */}

						<div className="w-100" style={{ maxWidth: "560px" }}>
							<div className="d-flex flex-row align-items-center justify-content-between mb-4">
								<div className="d-flex flex-row align-items-center gap-3">
									<h2 className="mb-0">Shortlist</h2>
									{!retreivingNames && shortlist?.length > 0 ? (
										<div
											className={`${
												retreivingNames ? "loadingAnimation" : ""
											} tag dark medium small`}
											style={{ minWidth: "24px", minHeight: "24px" }}
										>
											{!retreivingNames ? shortlist?.length : null}
										</div>
									) : null}
								</div>
                <div className="d-flex flex-row gap-3">
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      as={CustomToggle}
                      id="dropdown-custom-components"
                      className="text-decoration-none"
                    >
                      {screenWidth > 575 ? (
                        <button
                          className="btn primary medium outlined x-small icon-left"
                          disabled={shortlist?.length == 0}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d={ICONS.SHARE}></path>
                          </svg>
                          <span className="text-decoration-none">
                            Share shortlist
                          </span>
                        </button>
                      ) : (
                        <button
                          className="btn primary medium outlined x-small icon-only"
                          disabled={shortlist?.length == 0}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d={ICONS.SHARE}></path>
                          </svg>
                        </button>
                      )}
                    </Dropdown.Toggle>
                    <Dropdown.Menu 
                        as={CustomMenu}
                        align="end"
                        className="mt-2">
                      <div className="p-2">
                        {/* <button onClick={() => console.log()}></button> */}
                        {screenWidth > 575 ? (
                          <div
                            className={`${styles.shareGrid} gap-2 w-100 p-3`}
                            style={{ minWidth: "400px" }}
                          >
                            <div className="d-flex flex-column align-items-center gap-2">
                              <button
                                onClick={
                                  () => handleNavigatorShare(shortlistShareData)
                                  // navigator.share({
                                  // 	// files,
                                  // 	// title: "Images",
                                  // 	text: `I might have found the perfect name for our baby: ${shareName}. Don't like it? Find more on epicbabynames.com`,
                                  // })
                                }
                                className="btn light medium icon-only"
                                disabled={sharingName}
                              >
                                <svg viewBox="0 0 24 24">
                                  <path d={ICONS.SHARE}></path>
                                </svg>
                              </button>
                              <p className="text-dark-high mb-0">Share</p>
                            </div>
                            <div className="d-flex flex-column align-items-center gap-2">
                              <button
                                onClick={() => copyShortlistToClipboard()}
                                className="btn light medium icon-only"
                              >
                                <svg viewBox="0 0 24 24">
                                  <path d={ICONS.COPY}></path>
                                </svg>
                              </button>
                              <p className="text-dark-high mb-0">Copy</p>
                            </div>
                            <div className="d-flex flex-column align-items-center gap-2">
                              <a href={whatsappShareShortlistData}>
                                <img
                                  height="56"
                                  src="/images/social-sharing/Whatsapp.svg"
                                />
                              </a>
                              <p className="text-dark-high mb-0">Whatsapp</p>
                            </div>
                            <div className="d-flex flex-column align-items-center gap-2">
                              <a href={instagramShareLink}>
                                <img
                                  height="56"
                                  src="/images/social-sharing/Instagram.svg"
                                />
                              </a>
                              <p className="text-dark-high mb-0">Instagram</p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="d-flex flex-column w-100 p-2 gap-2"
                            style={{ maxWidth: "240px" }}
                          >
                            <button
                              onClick={() =>
                                handleNavigatorShare(shortlistShareData)
                              }
                              className="btn light medium small icon-left w-100"
                              disabled={sharingName}
                            >
                              <svg viewBox="0 0 24 24">
                                <path d={ICONS.SHARE}></path>
                              </svg>
                              Share
                            </button>
                            <button
                              onClick={() => copyShortlistToClipboard()}
                              className="btn light medium small icon-left w-100"
                            >
                              <svg viewBox="0 0 24 24">
                                <path d={ICONS.COPY}></path>
                              </svg>
                              Copy
                            </button>
                            <a
                              href={whatsappShareShortlistData}
                              className="btn primary medium small icon-left w-100"
                              style={{ backgroundColor: "rgb(0, 217, 95)" }}
                            >
                              <img
                                src="/images/social-sharing/Whatsapp-outline.svg"
                                height="24"
                                className="mr-2"
                              />
                              <span className="text-light-high">Whatsapp</span>
                            </a>
                            <a
                              href={instagramShareLink}
                              className="btn primary high small icon-left w-100"
                              // style={{background: 'linear-gradient(340deg, #FCBB45 21%, #F75274 38%,  #D53692 52%,  #8F39CE 74%, #5B4FE9 100%)'}}
                              style={{
                                background:
                                  "linear-gradient(330deg, #FCBB45 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #5B4FE9 100%)",
                              }}
                            >
                              <img
                                src="/images/social-sharing/Instagram-outline.svg"
                                height="24"
                                className="mr-2"
                              />
                              Instagram
                            </a>
                          </div>
                        )}
                        {/* <Dropdown.Item
                        onClick={() => setShowNameDetailsView(true)}
                        className="dropdownItem"
                      >
                        <Icon icon={ICONS.SHARE} size="24" />
                        Share
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => removeName(name.id)}
                        className="dropdownItem"
                      >
                        <Icon icon={ICONS.DELETE} size="24" />
                        Remove
                      </Dropdown.Item> */}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                  { screenWidth < 768 &&
                    <button
                      className="btn primary medium outlined x-small icon-only"
                      onClick={() => handleShowMenu()}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d={ICONS.MENU}></path>
                      </svg>
                    </button>
                  }
                </div>
							</div>
							{!retreivingNames && initialized ? (
								<>
									{shortlist?.length > 0 ? (
										<div className={`${styles.shortlistLayout}`}>
											{retreivedNames.map((name, index) => {
												return (
													<div key={index}>
														<div
															className={`${styles.shortlistItem} d-flex flex-column justify-content-between radius-4 p-4 gap-3`}
														>
															<div className="d-flex flex-column justify-content-between">
																<div>
																	<div className="d-flex flex-row align-items-center justify-content-between mb-3 gap-2">
																		{/* {name?.allegiance[0] != null && (
                                  <div className="d-flex b-4 gap-3 mb-3">
                                    {name?.allegiance?.map((allegiance, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="tag light high icon-left"
                                          style={{ textTransform: "capitalize" }}
                                        >
                                          <svg viewBox="0 0 24 24">
                                            <path d={ICONS.WEBSITE}></path>
                                          </svg>
                                          {allegiance}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )} */}
																		<h3
																			className="mb-0"
																			style={{ maxWidth: "720px" }}
																		>
																			{name?.name}
																		</h3>
																		<div className="d-flex gap-1">
																			{name?.gender !== "female" && (
																				<svg height="24" viewBox="0 0 24 24">
																					<path
																						className="fill-male"
																						d={ICONS.MALE}
																					></path>
																				</svg>
																			)}
																			{name?.gender !== "male" && (
																				<svg height="24" viewBox="0 0 24 24">
																					<path
																						className="fill-female"
																						d={ICONS.FEMALE}
																					></path>
																				</svg>
																			)}
																		</div>
																	</div>

																	{/* <div className="d-flex gap-0">
                                  <button
                                    onClick={() => removeName(name.id)}
                                    className="btn dark small ultraLow icon-only"
                                  >
                                    <Icon icon={ICONS.DELETE} size="24" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleShowNameDetailsView(
                                        name?.name,
                                        name?.description
                                      )
                                    }
                                    className="btn dark small ultraLow icon-only"
                                  >
                                    <Icon icon={ICONS.SHARE} size="24" />
                                  </button>
                                </div> */}

																	{/* <Dropdown align="end">
                                  <Dropdown.Toggle
                                    as={CustomToggle}
                                    id="dropdown-custom-components"
                                    className="text-decoration-none"
                                  >
                                    <>
                                      <div className="d-flex flex-row align-items-center btn dark ultraLow small icon-only">
                                        <svg viewBox="0 0 24 24">
                                          <path d={ICONS.MORE}></path>
                                        </svg>
                                      </div>
                                    </>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu
                                    as={CustomMenu}
                                    align="end"
                                    className="mt-2"
                                  >
                                    <div className="p-2">
                                      <Dropdown.Item
                                        onClick={() => setShowNameDetailsView(true)}
                                        className="dropdownItem"
                                      >
                                        <Icon icon={ICONS.SHARE} size="24" />
                                        Share
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() => removeName(name.id)}
                                        className="dropdownItem"
                                      >
                                        <Icon icon={ICONS.DELETE} size="24" />
                                        Remove
                                      </Dropdown.Item>
                                    </div>
                                  </Dropdown.Menu>
                                </Dropdown> */}
																</div>
																<div>
																	{name.description?.map(
																		(description, index) => {
																			return (
																				<p key={index} className="mb-0">
																					{description.content}
																				</p>
																			);
																		}
																	)}
																</div>
															</div>

															{/* <div>
                            <button
                              onClick={() => removeName(name.id)}
                              disabled={removing}
                              className="btn icon-only dark low"
                            >
                              <svg viewBox="0 0 24 24">
                                <path d={ICONS.DELETE}></path>
                              </svg>
                            </button>
                          </div> */}
															<div className="d-flex justify-content-between w-100">
																<button
																	onClick={() =>
																		handleShowNameDetailsView(
																			name?.name,
																			name?.description
																		)
																	}
																	className="btn dark x-small medium icon-left"
																>
																	<Icon icon={ICONS.SHARE} size="24" />
																	Share
																</button>
																<Dropdown align="end">
																	<Dropdown.Toggle
																		as={CustomToggle}
																		id="dropdown-custom-components"
																		className="text-decoration-none"
																	>
																		<>
																			<div className="d-flex flex-row align-items-center btn dark ultraLow x-small icon-only">
																				<svg viewBox="0 0 24 24">
																					<path d={ICONS.MORE}></path>
																				</svg>
																			</div>
																		</>
																	</Dropdown.Toggle>
																	<Dropdown.Menu
																		as={CustomMenu}
																		align="end"
																		className="mt-2"
																	>
																		<div className="p-2">
																			{/* <Dropdown.Item
                                        onClick={() => setShowNameDetailsView(true)}
                                        className="dropdownItem"
                                      >
                                        <Icon icon={ICONS.SHARE} size="24" />
                                        Share
                                      </Dropdown.Item> */}
																			<Dropdown.Item
																				onClick={() => removeName(name.id)}
																				className="dropdownItem"
																			>
																				<Icon icon={ICONS.DELETE} size="24" />
																				Remove name
																			</Dropdown.Item>
																		</div>
																	</Dropdown.Menu>
																</Dropdown>
																{/* <button
                                onClick={() => removeName(name.id)}
                                className="btn dark small ultraLow icon-only"
                              >
                                <Icon icon={ICONS.DELETE} size="24" />
                              </button> */}
															</div>
														</div>
														{/* {showNameDetailsView && 
                            <div 
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              zIndex: 1030,
                              width: '100%',
                              height: '100%',
                              overflow: 'hidden',
                            }}>
                              
                              <div
                                // onClick={() => setShowNameDetailsView(false)}
                                style={{
                                  // opacity: 0.18,
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  zIndex: 1,
                                  width: '100vw',
                                  height: '100vh',
                                  backgroundColor: 'rgba(0,0,0,0.18)',
                                  backdropFilter: 'blur(6px)'
                                }}
                              >               
                              </div>
                              <div className="d-flex align-items-center justify-content-center radius-4 m-4" style={{zIndex: 1}}>
                                <div className="d-flex flex-column gap-5" style={{maxWidth: '500px'}}>
                                  <button
                                    onClick={() => setShowNameDetailsView(false)}
                                    className="btn light medium high icon-only"
                                  >
                                    <svg viewBox="0 0 24 24">
                                      <path d={ICONS.CLOSE}></path>
                                    </svg>
                                  </button>
                                  <div className="d-flex flex-column justify-content-between bg-light-900 radius-4 shadow-1 p-5" style={{aspectRatio: '1 / 1'}}>
                                    <div>
                                      <h2
                                        className="mb-0"
                                      >
                                        {name?.name}
                                      </h2>
                                      {name.description?.map((description, index) => {
                                        return (
                                          <p key={index} className="mt-3 mb-0">
                                            {description.content}
                                          </p>
                                        );
                                      })}
                                    </div>
                                    <p className="pt-5 mt-5 mb-0 text-dark-low">I might have found the perfect name for our baby! Don't like it? Find more on <a href="/">{window.location.origin}</a></p>
                                  </div>
                                  <div className={`${styles.shareGrid} gap-2 px-4`}>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                      <img height='64' src="/images/social-sharing/Instagram.svg" />
                                      <p className="text-dark-high">Instagram</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                      <img height='64' src="/images/social-sharing/Instagram.svg" />
                                      <p className="text-dark-high">Instagram</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                      <img height='64' src="/images/social-sharing/Instagram.svg" />
                                      <p className="text-dark-high">Instagram</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                      <img height='64' src="/images/social-sharing/Instagram.svg" />
                                      <p className="text-dark-high">Instagram</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                      <button
                                        onClick={() => navigator.share({
                                          // files,
                                          // title: "Images",
                                          title: "I might have found the perfect name for our baby!",
                                          text: `${name.name}. Don't like it? Find more on ${window.location.origin}`
                                        })}
                                        className="btn light large medium icon-only"
                                      >
                                        <svg viewBox="0 0 24 24">
                                          <path d={ICONS.SHARE}></path>
                                        </svg>
                                      </button>
                                      <p className="text-dark-high">Share</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                      <button
                                        onClick={() => copyNameToClipboard(name.name)}
                                        className="btn light large medium icon-only"
                                      >
                                        <svg viewBox="0 0 24 24">
                                          <path d={ICONS.COPY}></path>
                                        </svg>
                                      </button>
                                      <p className="text-dark-high">Copy name</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                      <button
                                        onClick={() => setShowNameDetailsView(false)}
                                        className="btn light large medium icon-only"
                                      >
                                        <svg viewBox="0 0 24 24">
                                          <path d={ICONS.DOWNLOAD}></path>
                                        </svg>
                                      </button>
                                      <p className="text-dark-high">Save image</p>
                                    </div>
                                    <div className="d-flex flex-column align-items-center gap-2">
                                      <button
                                        onClick={() => setShowNameDetailsView(false)}
                                        className="btn light large medium icon-only"
                                      >
                                        <svg viewBox="0 0 24 24">
                                          <path d={ICONS.MORE}></path>
                                        </svg>
                                      </button>
                                      <p className="text-dark-high">More</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          } */}

														{/* <Modal
                            show={showNameDetailsView}
                            onHide={handleNameDetailsViewClose}
                            keyboard={false}
                            size={"md"}
                            centered
                            // backdrop="static"
                          >
                            <div
                              className="d-flex flex-column justify-content-between p-5"
                              style={{ aspectRatio: "1 / 1" }}
                            >
                              <div>
                                <h2 className="mb-0">{name?.name}</h2>
                                {name.description?.map((description, index) => {
                                  return (
                                    <p key={index} className="mt-3 mb-0">
                                      {description.content}
                                    </p>
                                  );
                                })}
                              </div>
                              <p className="pt-5 mt-5 mb-0 text-dark-low">
                                I might have found the perfect name for our baby!
                                Don't like it? Find more on{" "}
                                <a href="/">{window.location.origin}</a>
                              </p>
                            </div>
                            <img
                              height="64"
                              src="/images/social-sharing/Instagram.svg"
                            />
                          </Modal> */}
													</div>
												);
											})}
											{!loggedIn && (
												<div
													className={`${styles.shortlistItem} d-flex flex-column align-items-start justify-content-between radius-4 p-4 bg-dark-100 gap-3`}
												>
													<div className="d-flex flex-row align-items-start justify-content-between">
														<div>
															<h3
																className="mb-3"
																style={{ maxWidth: "720px" }}
															>
																Save your shortlist?
															</h3>
                              <p className="mb-0">
                                Create an account to avoid forgetting these names and being forced to name your child Steve or Blue Ivy.
                              </p>
														</div>
													</div>
													<Link
														href="/users/register"
														disabled={removing}
														className="btn dark high x-small w-auto"
													>
														Create account
													</Link>
												</div>
											)}
											{/* <div
                      className="position-relative d-flex flex-column radius-4 bg-dark-200"
                      style={{ minHeight: "240px" }}
                    >
                      <div
                        className={`${styles.shortlistItemExpand} position-absolute w-100 h-100 d-flex flex-column radius-4 p-4`}
                        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                      >
                        <div className="d-flex flex-row align-items-start justify-content-between">
                          <div>
                            <h3 className="mb-3" style={{ maxWidth: "720px" }}>
                              Laomedon
                            </h3>
                          </div>
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              as={CustomToggle}
                              id="dropdown-custom-components"
                              className="text-decoration-none"
                            >
                              <>
                                <div className="d-flex flex-row align-items-center btn dark ultraLow small icon-only">
                                  <svg viewBox="0 0 24 24">
                                    <path d={ICONS.MORE}></path>
                                  </svg>
                                </div>
                              </>
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              as={CustomMenu}
                              align="end"
                              className="mt-2"
                            >
                              <div className="p-2">
                                <Dropdown.Item
                                  onClick={() => removeName(name.id)}
                                  className="dropdownItem"
                                >
                                  <Icon icon={ICONS.DELETE} size="24" />
                                  Remove name
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => copyNameToClipboard(name.name)}
                                  className="dropdownItem"
                                >
                                  <Icon icon={ICONS.SHARE} size="24" />
                                  Share name
                                </Dropdown.Item>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        <div>
                          <p className="mb-0">
                            There once was an epic warrior from the Agean
                          </p>
                        </div>
                      </div>
                    </div> */}
										</div>
									) : (
										<div
											className="d-flex flex-column align-items-center justify-content-center w-100 h-100"
											style={{ paddingTop: "160px", paddingBottom: "160px" }}
										>
											<h3
												className="text-center mx-auto"
												style={{ maxWidth: "320px" }}
											>
												Not quite found the right name?
											</h3>
											<Link
												href="/names"
												className="btn primary high small text-only"
											>
												Browse more names
											</Link>
										</div>
									)}
								</>
							) : (
								<div className={`${styles.shortlistLayout}`}>
									<div
										className={`${styles.shortlistItemLoading} loadingAnimation d-flex flex-row justify-content-between radius-4 bg-dark-200 p-4`}
									></div>
									<div
										className={`${styles.shortlistItemLoading} loadingAnimation d-flex flex-row justify-content-between radius-4 bg-dark-200 p-4`}
									></div>
									<div
										className={`${styles.shortlistItemLoading} loadingAnimation d-flex flex-row justify-content-between radius-4 bg-dark-200 p-4`}
									></div>
								</div>
							)}
						</div>

						{/* <button onClick={() => getRandomDocument()} disabled={sending} className="btn icon-only primary high large mx-auto">Get another name</button> */}
					</div>
				</div>
				<Modal
					show={showNameDetailsView}
					onHide={handleNameDetailsViewClose}
					keyboard={false}
					size={"md"}
					centered
				>
					<div className="position-relative bg-background">
						<div className="d-flex flex-column flex-lg-row bg-light-900">
							<div
								className="d-flex flex-column justify-content-between p-4 p-sm-5"
								style={{ aspectRatio: "1 / 1" }}
							>
								<div>
									<h1 className="mb-0">{shareName}</h1>
									{shareDescription?.map((description, index) => {
										return (
											<p key={index} className="mt-3 mb-0">
												{description.content}
											</p>
										);
									})}
								</div>
								<p className="pt-5 mt-5 mb-0 text-dark-low">
									I might have found the perfect name for our baby! Don't like
									it? Find more on <a href="/">{windowLocationOrigin}</a>
								</p>
							</div>
						</div>
						<div
							className={`w-100 d-flex flex-column align-items-center justify-content-between gap-4`}
						>
							{screenWidth > 575 ? (
								<div className={`${styles.shareGrid} gap-2 w-100 p-3 p-sm-4`}>
									<div className="d-flex flex-column align-items-center gap-2">
										<button
											onClick={
												() => handleNavigatorShare(nameShareData)
												// navigator.share({
												// 	// files,
												// 	// title: "Images",
												// 	text: `I might have found the perfect name for our baby: ${shareName}. Don't like it? Find more on epicbabynames.com`,
												// })
											}
											className="btn light medium icon-only"
											disabled={sharingName}
										>
											<svg viewBox="0 0 24 24">
												<path d={ICONS.SHARE}></path>
											</svg>
										</button>
										<p className="text-dark-high mb-0">Share</p>
									</div>
									<div className="d-flex flex-column align-items-center gap-2">
										<button
											onClick={() => copyNameToClipboard()}
											className="btn light medium icon-only"
										>
											<svg viewBox="0 0 24 24">
												<path d={ICONS.COPY}></path>
											</svg>
										</button>
										<p className="text-dark-high mb-0">Copy name</p>
									</div>
									<div className="d-flex flex-column align-items-center gap-2">
										<a href={whatsappShareNameData}>
											<img
												height="56"
												src="/images/social-sharing/Whatsapp.svg"
											/>
										</a>
										<p className="text-dark-high mb-0">Whatsapp</p>
									</div>
									<div className="d-flex flex-column align-items-center gap-2">
										<a href={instagramShareLink}>
											<img
												height="56"
												src="/images/social-sharing/Instagram.svg"
											/>
										</a>
										<p className="text-dark-high mb-0">Instagram</p>
									</div>
								</div>
							) : (
								<div className="d-flex flex-column w-100 p-4 gap-2">
									<button
										onClick={() => handleNavigatorShare(nameShareData)}
										className="btn light medium small icon-left w-100"
										disabled={sharingName}
									>
										<svg viewBox="0 0 24 24">
											<path d={ICONS.SHARE}></path>
										</svg>
										Share
									</button>
									<button
										onClick={() => copyNameToClipboard()}
										className="btn light medium small icon-left w-100"
									>
										<svg viewBox="0 0 24 24">
											<path d={ICONS.COPY}></path>
										</svg>
										Copy name
									</button>
									<a
										href={whatsappShareNameData}
										className="btn primary medium small icon-left w-100"
										style={{ backgroundColor: "rgb(0, 217, 95)" }}
									>
										<img
											src="/images/social-sharing/Whatsapp-outline.svg"
											height="24"
											className="mr-2"
										/>
										<span className="text-light-high">Whatsapp</span>
									</a>
									<a
										href={instagramShareLink}
										className="btn primary high small icon-left w-100"
										// style={{background: 'linear-gradient(340deg, #FCBB45 21%, #F75274 38%,  #D53692 52%,  #8F39CE 74%, #5B4FE9 100%)'}}
										style={{
											background:
												"linear-gradient(330deg, #FCBB45 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #5B4FE9 100%)",
										}}
									>
										<img
											src="/images/social-sharing/Instagram-outline.svg"
											height="24"
											className="mr-2"
										/>
										Instagram
									</a>
								</div>
							)}
						</div>
					</div>
				</Modal>
			</div>
		</div>
	);
};

// Add this to make the layout persistent
Shortlist.getLayout = function getLayout(page) {
	return (
		<SidebarLayout>
			{page}
		</SidebarLayout>
	);
};

export default Shortlist;
