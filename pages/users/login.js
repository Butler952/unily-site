import { useEffect, useState } from "react";
import fire from "../../config/fire-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../../components/header/Header";
import { Container } from "react-bootstrap";
import Head from "next/head";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "config/mixpanel-config";

const Login = () => {
  const [windowLocationOrigin, setWindowLocationOrigin] = useState(undefined);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [notify, setNotification] = useState("");

  const [showEmailPassword, setShowEmailPassword] = useState(false);
	const [sendingLink, setSendingLink] = useState(false);
	const [linkSent, setLinkSent] = useState(false);
	const [linkCooldown, setLinkCooldown] = useState(null);
	const [signingIn, setSigningIn] = useState(false);

	const router = useRouter();

	// const provider = new firebase.auth.GoogleAuthProvider();
	// const provider = new fire.auth.GoogleAuthProvider();

	const usernameChange = (value) => {
		setUsername(value), setEmailError("");
	};

	const passwordChange = (value) => {
		setPassword(value);
		setPasswordError("");
	};

	//   const signIn = () => auth.signInWithPopup(provider);
	// const signOut = () => auth.signOut();

	const handleLoginWithGoogle = (e) => {
		e.preventDefault();
		fire
			.auth()
			.signInWithPopup(new fire.auth.GoogleAuthProvider())
			.then(() => {
				mixpanel.init(mixpanelConfig);
				mixpanel.track("Signed in");
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
      })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setSendingLink(false);
        setLinkSent(true);
        setLinkCooldown(10);
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
    .catch((error) => {
      console.log('error', error);
      setSendingLink(false);
      alert('Failed to send sign-in link');
    });
  }

	const handleLogin = (e) => {
		e.preventDefault();

		setSigningIn(true);

		fire
			.auth()
			.signInWithEmailAndPassword(username, password)
			.then(() => {
				mixpanel.init(mixpanelConfig);
				mixpanel.track("Signed in");
			})
			.then(() => {
				setSigningIn(false);
			})
			.catch((err) => {
				if (err.code === "auth/invalid-email") {
					setEmailError("Please enter a valid email address");
				}
				if (err.code === "auth/user-disabled") {
					setEmailError("This account has been disabled");
				}
				if (err.code === "auth/user-not-found") {
					//setEmailError('Please check you have entered your email correctly or sign up to create an account')
					setPasswordError("The email address and password do not match");
				}
				if (err.code === "auth/wrong-password") {
					setPasswordError("The email address and password do not match");
				}
				setSigningIn(false);
				// console.log(err.code, err.message)
			});
	};

	useEffect(() => {
    setWindowLocationOrigin(window.location.origin)
		mixpanel.init(mixpanelConfig);
		const unsubscribe = fire.auth().onAuthStateChanged((user) => {
			if (user) {
				var docRef = fire.firestore().collection("users").doc(user.uid);
				docRef
					.get()
					.then((doc) => {
						if (doc.exists) {
							mixpanel.track("Login", { method: "Password" });
							localStorage.removeItem("shortlist");
							localStorage.removeItem("rejected");
							router.push("/names");
						} else {
							fire
								.firestore()
								.collection("users")
								.doc(user.uid)
								.set({
									email: user.user.email,
									shortlist: shortlist,
									rejected: rejected,
									created: fire.firestore.FieldValue.serverTimestamp(),
									lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
								})
								.then(() => {
									mixpanel.track("Login", { method: "Google" });
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

	return (
		<div>
			<Header hideBackground />
			<Head>
				<title>Sign in to your account</title>
			</Head>
			<Container className="py-5">
				<div className="card m-auto p-4 p-md-5" style={{ maxWidth: "560px" }}>
					{/* <div className="">
						<h3 className="text-dark-high">Sign in</h3>
						<p className="mb-4">
							Not got an account? <Link href="/users/register">Sign up</Link>
						</p>
						<form onSubmit={handleLogin}>
							<div className="mb-4">
								<input
									type="text"
									placeholder="Email"
									className={emailError !== "" ? `error w-100` : `w-100`}
									value={username}
									onChange={({ target }) => usernameChange(target.value)}
								/>
								{emailError !== "" ? (
									<p className="small text-error-high mt-2">{emailError}</p>
								) : null}
							</div>
							<div className="mb-4">
								<input
									type="password"
									placeholder="Password"
									className={passwordError !== "" ? `error w-100` : `w-100`}
									value={password}
									onChange={({ target }) => passwordChange(target.value)}
								/>
								{passwordError !== "" ? (
									<p className="small text-error-high mt-2">{passwordError}</p>
								) : null}
							</div>
							<p className="mb-4">
								Forgot your password?{" "}
								<Link href="/users/reset">Reset your password</Link>
							</p>
							<button
								type="submit"
								className="btn primary high w-100"
								disabled={signingIn}
							>
								{signingIn ? "Signing in..." : "Sign in"}
							</button>
						</form>
						<div className="d-flex flex-row align-items-center w-100 gap-3 my-3">
							<hr className="w-100 m-0"></hr>
							<p className="small mb-0">or</p>
							<hr className="w-100 m-0"></hr>
						</div>
						<button
							type="button"
							onClick={(e) => handleLoginWithGoogle(e)}
							className="btn dark medium w-100"
							disabled={signingIn}
						>
							<img
								className="mr-2"
								width="24"
								src="/images/third-party/google.svg"
							></img>
							Sign in with Google
						</button>
					</div> */}
					<div
						className={`w-100 d-flex flex-column align-items-start gap-3`}
					>
						<h2 className="text-dark-high w-100 mb-0">
							Sign in
						</h2>
						<p className="mb-3">
							Not got an account?{" "}
							<Link className="link" href="/users/register">
								Create an account
							</Link>
						</p>
						<div className="w-100">
							<button
								type="button"
								onClick={(e) => handleLoginWithGoogle(e)}
								className="btn dark high w-100"
								disabled={signingIn}
							>
								<img
									className="mr-2"
									width="24"
									src="/images/third-party/google.svg"
								></img>
								Sign in with Google
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
								<form onSubmit={generateEmailLink}>
									<div className="mb-2">
										<input
											type="text"
											placeholder="Email"
											className={emailError !== "" ? `error w-100` : `w-100`}
											value={username}
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
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Login;
