import { firebaseAdmin } from './firebaseAdmin';

// Server-side function to generate email sign-in link
export async function generateEmailSignInLink(email) {
  try {
    const admin = firebaseAdmin();
    
    // Configuration for the email sign-in link
    const actionCodeSettings = {

      // url: `${windowLocationOrigin}/names?signIn=complete`,
      url: `http://localhost:3000/names?signIn=complete`,
      // url: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || 'http://localhost:3000/verify-email',
      handleCodeInApp: true,

      // // URL you want to redirect back to (must be whitelisted in Firebase console)
      // url: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || 'http://localhost:3000/verify-email',
      
      // // This must be true for email link sign-in
      // handleCodeInApp: true,
      
      // // Optional: set dynamic link domain if using Firebase Dynamic Links
      // dynamicLinkDomain: process.env.FIREBASE_DYNAMIC_LINK_DOMAIN
    };

    // Generate the email sign-in link
    const emailLink = await admin.auth().generateSignInWithEmailLink(
      email, 
      actionCodeSettings
    );

    return emailLink;
  } catch (error) {
    console.error('Error generating email sign-in link:', error);
    throw new Error('Failed to generate sign-in link');
  }
}