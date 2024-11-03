import { useState, useEffect, forwardRef, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Dropdown } from "react-bootstrap";
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
	};

	useEffect(() => {
		setScreenWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);

		const unsubscribe = fire.auth().onAuthStateChanged((user) => {
			if (user) {
				loggedInRoute(user);
				// getSubscription(user)
			} else {
				if (userContext == "" && typeof localStorage.shortlist != "undefined") {
					setShortlist(JSON.parse(localStorage.shortlist));
					getNames(JSON.parse(localStorage.shortlist));
					setRetreivingNames(false);
				} else {
					setRetreivingNames(false);
				}
			}
		});
		return () => {
			// Unmouting
			unsubscribe();
		};
	}, []);

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
          setRetreivingNames(false)
				} else {
					console.log("No such document!");
				}
			})
			.catch((error) => {
        setRetreivingNames(false)
				console.log("Error getting document:", error);
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
		<div className="overflow-hidden" style={{backgroundColor: '#F6F6F4'}}>
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
			<div className="d-flex flex-row justify-content-between align-items-center p-2 px-md-3 w-100">
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
			</div>
			<div
				className="d-flex flex-column align-items-center px-3 px-md-5 w-100"
				style={{ paddingTop: "48px", paddingBottom: "96px" }}
			>
				{/* {shortlist.map((id, index) => <p key={index} className="large">{id}</p>)} */}

				<div className="w-100" style={{ maxWidth: "1200px" }}>
					<div className="d-flex flex-row align-items-center gap-3 mb-4">
						<h2 className="mb-0">Shortlist</h2>
            {!retreivingNames && shortlist?.length > 0 ? 
              <div
                className={`${
                  retreivingNames ? "loadingAnimation" : ""
                } tag dark medium small`}
                style={{ minWidth: "24px", minHeight: "24px" }}
              >
                {!retreivingNames ? shortlist?.length : null}
              </div> 
            : 
              null
            }
						
					</div>
					{!retreivingNames ? (
						<>
							{retreivedNames.length > 0 ? (
								<div className={`${styles.shortlistLayout}`}>
									{retreivedNames.map((name, index) => {
										return (
											<div
												key={index}
												className={`${styles.shortlistItem} d-flex flex-column radius-4 p-4`}
											>
												<div className="d-flex flex-row align-items-start justify-content-between">
													<div>
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
														<h3 className="mb-3" style={{ maxWidth: "720px" }}>
															{name?.name}
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
															</div>
														</Dropdown.Menu>
													</Dropdown>
												</div>
												<div>
													{name.description?.map((description, index) => {
														return (
															<p key={index} className="mb-0">
																{description.content}
															</p>
														);
													})}
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
											</div>
										);
									})}
                  {!loggedIn && (
                    <div
												className={`${styles.shortlistItem} d-flex flex-column align-items-start justify-content-between radius-4 p-4`}
											>
												<div className="d-flex flex-row align-items-start justify-content-between">
													<div>
														<h3 className="mb-3" style={{ maxWidth: "720px" }}>
															Want to save your shortlist?
														</h3>
													</div>
												</div>
                        <Link
                          href="/users/register"
                          disabled={removing}
                          className="btn dark high small w-100"
                        >
                          Create an account
                        </Link>
											</div>
                  )}
                  {/* <div
                    onClick={() => router.push("/names")}
										className={`${styles.shortlistMore} d-flex flex-column align-items-center justify-content-center radius-4 p-4`}
                  >
                    <svg height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d={ICONS.SEARCH} 
                      />
                    </svg>
                    <p className="mb-0">
                      Browse more names
                    </p>
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
	);
};

export default Shortlist;
