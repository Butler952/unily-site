import fire from "/config/fire-config";

export async function handlePurchase(uid, product, successUrl, cancelUrl) {
	let price;

	switch (product) {
		case "iliad":
			price = "price_1QHBsIIjM8EQ1LKWKFUdGf1k"; // Replace with env variable
			break;
		// case 'iliad':
		//   price = "price_1GqIC8HYgolSBA35zoTTN2Zl"
		//   break;
	}

	//New stripe checkout start
	const docRef = await fire
		.firestore()
		.collection("users")
		.doc(uid)
		.collection("checkout_sessions")
		.add({
      mode: "payment",
			price: price,
			success_url: successUrl ? successUrl : window.location.origin,
      cancel_url: cancelUrl ? cancelUrl : window.location.origin,
			// success_url: window.location.origin + "/settings?upgrade=success",
			// cancel_url: window.location.origin + "/settings?upgrade=cancelled",
		});
	// Wait for the CheckoutSession to get attached by the extension
	docRef.onSnapshot((snap) => {
		const { error, url } = snap.data();
		if (error) {
			// Show an error to your customer and
			// inspect your Cloud Function logs in the Firebase console.
			alert(`An error occured: ${error.message}`);
		}
		if (url) {
			// We have a Stripe Checkout URL, let's redirect.
			window.location.assign(url);
		}
	});
}
