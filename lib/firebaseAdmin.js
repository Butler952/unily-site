import * as admin from 'firebase-admin';

const firebaseProjectId = "homeric-name-picker-dev"
const firebaseClientEmail = "firebase-adminsdk-c72y9@homeric-name-picker-dev.iam.gserviceaccount.com"
const firebasePrivateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLCfdFfppK2Ndu\nTx0za62MEgTvzWEmCtXpQcgw1SMuSG5mdP9C7SLjNmoykzabu8QWfJpBeyIFXOEn\nyWB2aKZQy/vJpkqPkK+Li9d5x1B+rcjMPvvSeKCITBJ8FBKf8mcgYRyvXzhht6Hh\nyxgZJ4Lfif5rxrYR6ptX9VxHLh61JSI/b0O4r0IvOu0g45MdSrz1/nxIZNtB7vYg\nsd9EBfta9QJg/xu8zBe/LsCf9ZHAhqOjHg6BRspz5PHVeI4QOjvfgSFgxcuA0lFW\nxBENXAZZbN4eHf2dkweJIn/PYo7zebER/DtsGoNRHsDzJbyV15g4M0YnXi7IgJwg\nsznqdU+/AgMBAAECggEAE00ROoP8etz+LbhLmFXGG6ii24D0mT8ycogUVcANJhsw\nk4DPuzb7uAm2MrSX3loNG+4gY9UmuMfJh5S3HMp59PhPKS4rrFYeue9DPopZ9pDi\no7fhDHL3H73LjAwEcTwD3aodpfYxT+i69NHvqoR9Bm8BxpEPQcjBl6z1ZrbVqHaB\nx0V6owgnVyedhIEKkTuQil6fHYRjT2hj+13J3YuFYj7kw8V6lXtGBBJYE8tOMHiy\nj6BsFbIR7DDu+SQsU51+NlADfhquO04UAczjL7da4K+Bo/0koHrzgvCa7HUJEaoc\nYfNCgw7KtIAEEh7swjlUfsOLw6KfTy3J4c9zTRKpgQKBgQDVJpTPFHyKQnuFbwWH\nJmDZspaFA6Q/VBlCmYCXWACUCpLtEp1RTy2MZPMlrDYHSLO75rDapol0HmKIVfrf\nq0kkQhXGCoj67uMtFY8Vl41PNKB6CK3xDU7ALBqrDeEW7mVoKs1Abwh5ziG5tvBh\nxzaJYPJ55Lu3T1f2PTBv9OIanwKBgQDz2wAEW8MuS/VfJJJk9RmlN8VDxnUhkSUI\nbuAyqfighd9z9CKT0blbTWXCT+aUF7cqyLavngAA2l03sSoffJ4tPK5DAX/xxcdk\nsPBmryYiOfxfVn6R9kXsOhkYWUylBwDOM4vUBVE+4KW5+kG6a8JlDANNpmOO0kg+\nrvDzW6XW4QKBgQCjqMv5dDFrt0BAY85Kxxz2CjmoR/OE7H24tUQW8GsBQF0vymsg\nUzsV4S0Qb/nL/faC/84rFFPV5L6jD+Fge5PdUyCEvvIOOf4UT8ldOtA1UKMnECL+\nQsmEpFiVnkKF6OXT5YlTP+2yGKOshNptORiWwulqzkWTqkhPuQvH6q7w4QKBgQDN\n0Cu+gfhFDeUFrSdFwDwp3t1Ga6yWbRt1d6cP+7cVPIgxJH8+hYbM0ZEuJCO3ICD/\nIjJWHKNiFOsSQxwLQTF7eriVYyGqXEQC7venovIrdwdTK/xdkx7G1u4xR8VRj4yV\nfJnqk6ZTzGTzh42MGsESacYr9mAWvdIt3ZcNvm9E4QKBgCNnuonwBv0P/pUVgQCD\nbX5d+W6X95fLp4Luw5J5o/riQRJWr6vY6pLMDb34KrXTov92YCe6Oxu4tage4hZo\nz8robolIehNEc5e1jNBHnEnwTBZ5aQ7z+U+6LMiWG9qPgZzdS940AXIUCXD8KkKq\ne7jWqF6cmKfvK9DodbfEFU93\n-----END PRIVATE KEY-----\n"

// Initialize Firebase Admin if it hasn't been initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // your service account details
      // projectId: process.env.FIREBASE_PROJECT_ID,
      // clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      projectId: firebaseProjectId,
      clientEmail: firebaseClientEmail,
      privateKey: firebasePrivateKey?.replace(/\\n/g, '\n'),
    }),
  });
}

export const firebaseAdmin = admin;
// OR
// export default admin;


// import admin from 'firebase-admin';

// var serviceAccount = require("/lib/homeric-name-picker-dev-firebase-adminsdk-c72y9-744d7fe04e.json");

// function initFirebaseAdmin() {
//   // Check if Firebase Admin is already initialized
//   if (!admin.apps.length) {
//     try {
//       // Parse the credentials from environment variables
//       admin.initializeApp({
//         credential: admin.credential.cert({serviceAccount}),
//       });
//       // admin.initializeApp({
//       //   credential: admin.credential.cert({
//       //     // projectId: process.env.FIREBASE_PROJECT_ID,
//       //     projectId: "homeric-name-picker-dev",
//       //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       //     // Ensure you replace \n with actual newlines
//       //     privateKey: "/lib/homeric-name-picker-dev-firebase-adminsdk-c72y9-744d7fe04e.json".replace(/\\n/g, '\n')
//       //     // privateKey: process.env.FIREBASE_PRIVATE_KEY 
//       //       // ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
//       //       // : undefined
//       //   }),
//       //   // Optional: Add database URL if needed
//       //   // databaseURL: process.env.FIREBASE_DATABASE_URL
//       // });
//     } catch (error) {
//       console.error('Firebase Admin initialization error', error);
//     }
//   }

//   return admin;
// }

// // Singleton pattern to prevent re-initialization
// export const firebaseAdmin = initFirebaseAdmin();