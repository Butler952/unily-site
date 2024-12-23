// pages/api/generate-link.js
// import { generateEmailSignInLink } from '../../lib/auth';
import { firebaseAdmin } from '/lib/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      const { redirectUrl } = req.body;

      // Validate email
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      const admin = firebaseAdmin;
      const actionCodeSettings = {
        url: redirectUrl ? redirectUrl : `http://localhost:3000/shortlist?signIn=complete`,
        // url: `${windowLocationOrigin}/names?signIn=complete`,
        // url: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || 'http://localhost:3000/verify-email',
        handleCodeInApp: true,
      };

      // Generate sign-in link
      const signInLink = await admin.auth().generateSignInWithEmailLink(
        email, 
        actionCodeSettings
      );

      // In a real app, you would send this link via email
      // This example just returns the link (not recommended for production)
      res.status(200).json({ 
        message: 'Sign-in link generated',
        link: signInLink 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


// // pages/api/generate-link.js
// import { generateEmailSignInLink } from '../../lib/auth';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const { email } = req.body;

//       // Validate email
//       if (!email || !email.includes('@')) {
//         return res.status(400).json({ error: 'Invalid email address' });
//       }

//       // Generate sign-in link
//       const signInLink = await generateEmailSignInLink(email);

//       // In a real app, you would send this link via email
//       // This example just returns the link (not recommended for production)
//       res.status(200).json({ 
//         message: 'Sign-in link generated',
//         link: signInLink 
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }