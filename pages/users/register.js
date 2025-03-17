import { useState, useEffect } from "react";
import fire from "../../config/fire-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../../components/header/Header";
import { Container } from "react-bootstrap";
import Head from "next/head";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "config/mixpanel-config";

const Register = () => {
	const router = useRouter();
  const [windowLocationOrigin, setWindowLocationOrigin] = useState(undefined);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	// const [passConf, setPassConf] = useState('');
	const [loggedIn, setLoggedIn] = useState(false);
	const [termsAndPrivacy, setTermsAndPrivacy] = useState(false);
	const [receiveEmails, setReceiveEmails] = useState(false);

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [passConfError, setPassConfError] = useState("");
	const [creating, setCreating] = useState(false);

	const [shortlist, setShortlist] = useState([]);
	const [rejected, setRejected] = useState([]);

	const [notify, setNotification] = useState("");

  const [showEmailPassword, setShowEmailPassword] = useState(false);
	const [sendingLink, setSendingLink] = useState(false);
	const [linkSent, setLinkSent] = useState(false);
	const [linkCooldown, setLinkCooldown] = useState(null);
	const [signingIn, setSigningIn] = useState(false);

	useEffect(() => {
    setWindowLocationOrigin(window.location.origin)
		mixpanel.init(mixpanelConfig);
		mixpanel.track("Register");
		if (typeof localStorage.shortlist != "undefined") {
			setShortlist(JSON.parse(localStorage.shortlist));
		}
		if (typeof localStorage.rejected != "undefined") {
			setRejected(JSON.parse(localStorage.rejected));
		}
		const unsubscribe = fire.auth().onAuthStateChanged((user) => {
			if (user) {
				var docRef = fire.firestore().collection("users").doc(user.uid);
				docRef
					.get()
					.then((doc) => {
						if (doc.exists) {
							mixpanel.track("Registered", { method: "Password" });
							localStorage.removeItem("shortlist");
							localStorage.removeItem("rejected");
							router.push("/names");
						} else {
							fire
								.firestore()
								.collection("users")
								.doc(user.uid)
								.set({
									email: userCredential.user.email,
									shortlist: shortlist,
									rejected: rejected,
									created: fire.firestore.FieldValue.serverTimestamp(),
									lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
								})
								.then(() => {
									mixpanel.track("Registered", { method: "Google" });
									localStorage.removeItem("shortlist");
									localStorage.removeItem("rejected");
									router.push("/names");
								})
								.catch((error) => {
									console.log("Error getting document:", error);
								});
						}
					})
					.catch((error) => {
						console.log("Error getting document:", error);
					});
			}
		});
		return () => {
			// Unmouting
			unsubscribe();
		};
	}, []);

	const usernameChange = (value) => {
		setUsername(value), setEmailError("");
	};

	const passwordChange = (value) => {
		setPassword(value);
		setPasswordError("");
		setPassConfError("");
	};

	const termsAndPrivacyChange = () => {
		setTermsAndPrivacy((termsAndPrivacy) => !termsAndPrivacy);
		setNotification("");
	};

	const handleLoginWithGoogle = (e) => {
		e.preventDefault();
		fire
			.auth()
			.signInWithPopup(new fire.auth.GoogleAuthProvider())
			.then(() => {
				mixpanel.init(mixpanelConfig);
				// mixpanel.track("Registered", {"method": "Google"});
			})
			.catch((err) => {
				console.log(err.code, err.message);
			});
	};

  var actionCodeSettings = {
		// URL you want to redirect back to. The domain (www.example.com) for this
		// URL must be in the authorized domains list in the Firebase Console.
		// url: 'https://www.example.com/finishSignUp?cartId=1234',
		url: `${windowLocationOrigin}/names?signIn=complete`,
		// This must be true.
		handleCodeInApp: true,
		// iOS: {
		//   bundleId: 'com.example.ios'
		// },
		// android: {
		//   packageName: 'com.example.android',
		//   installApp: true,
		//   minimumVersion: '12'
		// },
		// dynamicLinkDomain: 'example.page.link'
	};

  // const generateEmailLink = () => {
  //   fire
  //     .auth()
  //     .generateSignInWithEmailLink(username, actionCodeSettings)
  //     .then((link) => {
  //       // Construct sign-in with email link template, embed the link and
  //       // send using custom SMTP server.
  //       alert(username, link);
  //       // return sendSignInEmail(useremail, displayName, link);
  //     })
  //     .catch((error) => {
  //       // Some error occurred.
  //     });
  // }

  const generateEmailLink = (e) => {
    e.preventDefault();
    setSendingLink(true);
    let email = username
    fetch('/api/generate-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(async response => {
      // First check if the response was ok (status in 200-299 range)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("emailForSignIn", username);
      fetch('/api/send-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          to: email,
        }),
        // body: JSON.stringify({
        //   to: email,
        //   // from: 'team@epicbabynames.com',
        //   from: {
        //     email: 'team@epicbabynames.com',
        //     name: 'Epic Baby Names'
        //   },
        //   subject: 'Sending with SendGrid is Fun',
        //   text: 'and easy to do anywhere, even with Node.js',
        //   html: `<strong>and easy to do anywhere, even with Node.js. Here's even a <a href=${data.link}>sign in link</a></strong>`
        // }),
      })
      .then(async response => {
        // First check if the response was ok (status in 200-299 range)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // alert('Sign-in link sent! Check your email.');
        setSendingLink(false);
        setLinkSent(true);
				setLinkCooldown(10);
				// Create interval to countdown
				const countdownInterval = setInterval(() => {
					setLinkCooldown(prevCount => {
						if (prevCount <= 1) {
							clearInterval(countdownInterval);
							return null;
						}
						return prevCount - 1;
					});
				}, 1000);
      })
      .catch((error) => {
        console.log('error', error);
        setSendingLink(false);
        alert('Failed to send sign-in link');
      });
    })
    // .then((data) => {
    //   localStorage.setItem("emailForSignIn", username);
    //   alert('Sign-in link sent! Check your email.');
    //   // Optionally, you can log the link for testing (remove in production)
    //   console.log('Sign-in Link:', data.link);
    // })
    .catch((error) => {
      console.log('error', error);
      setSendingLink(false);
      alert('Failed to send sign-in link');
    });
  }

  // fetch('/api/generate-link', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ email }),
  // })
  //   .then(res => res.json())
  //     if (res.ok) {
  //       setMessage('Sign-in link sent! Check your email.');
  //       // Optionally, you can log the link for testing (remove in production)
  //       console.log('Sign-in Link:', res.link);
  //     } else {
  //       // Handle error response
  //       setMessage(res.error || 'Failed to send sign-in link');
  //     }
  //   .then((result) => {
  //     setSyncLoading('Storing your data');
  //     fire.firestore().collection('users').doc(userData.uid).update({
  //       profile: result,
  //       displayInfo: {
  //         'basicInfo': {
  //           'section': true,
  //           'each': {
  //             'profilePic': true,
  //             'headerImage': true,
  //             'name': true,
  //             'headline': true,
  //             'email': true
  //           }
  //         },
  //         about: result.summary === null ? false : true,
  //         'experience': {
  //           'section': result.experiences < 1 ? false : true,
  //           'each': createExperienceList(result.experiences)
  //         },
  //         'education': {
  //           'section': result.education < 1 ? false : true,
  //           'each': createEducationList(result.education)
  //         },
  //         'volunteering': {
  //           'section': result.volunteer_work < 1 ? false : true,
  //           'each': createVolunteerList(result.volunteer_work)
  //         },
  //       },
  //       //syncsRemaining: (syncsRemaining - 1), 
  //       lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
  //       lastSync: fire.firestore.FieldValue.serverTimestamp(),
  //     })
  //   })
  //   .then(() => {
  //     setTimeout(
  //       setSyncLoading('Sync successfully completed'), 2000
  //     )
  //   })
  //   .then(() => {
  //     router.push('/settings')
  //   })
  //   .catch((error) => {
  //     console.log('error', error)
  //   });

  const handleLoginWithLink = (e) => {
		e.preventDefault();
    setSendingLink(true);
		fire
			.auth()
			.sendSignInLinkToEmail(username, actionCodeSettings)
			.then(() => {
        // alert('Magic link sent')
				// The link was successfully sent. Inform the user.
				// Save the email locally so you don't need to ask the user for it again
				// if they open the link on the same device.
        
				localStorage.setItem("emailForSignIn", username);
				setSendingLink(false);
				setLinkSent(true);
				
				// Start countdown from 10
				setLinkCooldown(10);
				
				// Create interval to countdown
				const countdownInterval = setInterval(() => {
					setLinkCooldown(prevCount => {
						if (prevCount <= 1) {
							clearInterval(countdownInterval);
							return null;
						}
						return prevCount - 1;
					});
				}, 1000);
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				// Handle errors here if needed
				setSendingLink(false);
			});
	};

	const handleLogin = (e) => {
		e.preventDefault();

		if (!termsAndPrivacy) {
			setNotification("Please accept the terms and conditions");
			return null;
		}

		setCreating(true);

		fire
			.auth()
			.createUserWithEmailAndPassword(username, password)
			.then((userCredential) => {
				fire.firestore().collection("users").doc(userCredential.user.uid).set({
					email: userCredential.user.email,
					shortlist: shortlist,
					rejected: rejected,
					created: fire.firestore.FieldValue.serverTimestamp(),
					lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
				});
			})
			.then(() => {
				mixpanel.init(mixpanelConfig);
				localStorage.removeItem("shortlist");
				localStorage.removeItem("rejected");
			})
			.then(() => {
				router.push("/names");
			})
			.catch((err) => {
				if (err.code === "auth/email-already-in-use") {
					setEmailError("This email is already in use");
				}
				if (err.code === "auth/invalid-email") {
					setEmailError("Please enter a valid email address");
				}
				if (err.code === "auth/weak-password") {
					setPasswordError("Your password must be at least 6 characters long");
				}
				setCreating(false);
				console.log(err.code, err.message);
			});
	};
  

	return (
		<div>
			<Header hideBackground />
			<Head>
				<title>Create an account | Epic Baby Names</title>
			</Head>
			<Container className="py-5">
				<div className="card m-auto p-4 p-md-5" style={{ maxWidth: "560px" }}>
					{/* <h3 className="text-dark-high">Create your account</h3>
          <div className="">
            <p className="mb-4">Already got an account? <Link href="/users/login">Sign in</Link></p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input type="text" placeholder="Email" className={emailError !== '' ? `error w-100` : `w-100`} value={username} onChange={({target}) => usernameChange(target.value)} />
                {emailError !== '' ? <p className="small text-error-high mt-2">{emailError}</p> : null}
              </div>
              <div className="mb-4">
                <input type="password" placeholder="Password" className={passwordError !== '' ? `error w-100` : `w-100`} value={password} onChange={({target}) => passwordChange(target.value)} />
                {passwordError !== '' ? <p className="small text-error-high mt-2">{passwordError}</p> : null}
              </div>
              <label className="checkbox-container small mb-4">I agree to the <a href="/legal/terms" target="_blank">Terms</a> and <a href="/legal/privacy" target="_blank">Privacy Policy</a>
                <input type="checkbox" onChange={() => termsAndPrivacyChange()} checked={termsAndPrivacy}></input>
                {notify !== '' ? <p className="small text-error-high">{notify}</p> : null}
                <span className="checkmark"></span>
              </label>
              <button type="submit" className="btn primary high w-100" disabled={creating}>{creating ? 'Creating account...' : 'Create account'}</button>
            </form>
            <div className="d-flex flex-row align-items-center w-100 gap-3 my-3">
              <hr className="w-100 m-0"></hr>
              <p className="small mb-0">or</p>
              <hr className="w-100 m-0"></hr>
            </div>
            <button type="button" onClick={(e) => handleLoginWithGoogle(e)} className="btn dark medium w-100" disabled={creating}>
              <img className="mr-2" width="24" src="/images/third-party/google.svg"></img>
              Continue with Google
            </button>
          </div> */}

					<div
						className={`w-100 d-flex flex-column align-items-start gap-3`}
					>
						<h2 className="text-dark-high w-100 mb-0">Create an account</h2>
						<p className="w-100 mt-0 mb-3">
							By creating an account you agree to our{" "}
							<a href="/legal/terms" target="_blank">
								Terms
							</a>{" "}
							and{" "}
							<a href="/legal/privacy" target="_blank">
								Privacy Policy
							</a>
							. Already got an account?{" "}
							<Link className="link" href="/users/login">
								Sign in
							</Link>
							.
						</p>
						<div className="w-100">
							<button
								type="button"
								onClick={(e) => handleLoginWithGoogle(e)}
								className="btn dark high w-100"
								disabled={sendingLink}
							>
								<img
									className="mr-2"
									width="24"
									src="/images/third-party/google.svg"
								></img>
								Continue with Google
							</button>
							<div className="d-flex flex-row align-items-center w-100 gap-3 my-3">
								<hr className="w-100 m-0"></hr>
								<p className="small mb-0">or</p>
								<hr className="w-100 m-0"></hr>
							</div>
							{!showEmailPassword ? (
								<button
									type="submit"
									className="btn primary medium w-100"
									disabled={sendingLink}
									onClick={() => setShowEmailPassword(true)}
								>
									Continue with email
								</button>
							) : !linkSent ? (
								// <form onSubmit={handleLoginWithLink}>
								<form onSubmit={generateEmailLink}>
									<div className="mb-2">
										<input
											type="text"
											placeholder="Email"
											className={emailError !== "" ? `error w-100` : `w-100`}
											value={username}
                      disabled={sendingLink}
											onChange={({ target }) => usernameChange(target.value)}
										/>
										{emailError !== "" ? (
											<p className="small text-error-high mt-2">{emailError}</p>
										) : null}
									</div>
									<button
										type="submit"
										className="btn primary high w-100"
										disabled={sendingLink}
									>
										{sendingLink ? "Sending link..." : "Send magic link"}
									</button>
								</form>
							) : (
								<div>
									<h4 className="mb-3">Check your inbox</h4>
									<p>
										We just sent an email to{" "}
										<span className="font-weight-semibold">{username}</span>{" "}
										with a magic link that'll log you in.
									</p>
									<p className="mt-3 mb-0">
										Didn't receive it?{" "}
										<button
											className="link"
											onClick={() => setLinkSent(false)}
											disabled={linkCooldown !== null}
										>
											Request another link{linkCooldown && ` (${linkCooldown})`}
										</button>
									</p>
								</div>
							)}
              	{/* <button
									type="submit"
									className="btn primary high w-100 mt-5"
									// disabled={sendingLink}
									onClick={() => generateEmailLink()}
								>
									Generate link
								</button> */}
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Register;
