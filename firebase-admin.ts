import { initFirestore } from "@next-auth/firebase-adapter";
import admin from "firebase-admin";

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Fix newlines in env
};

// Ensure Firebase Admin is only initialized once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

// Use the existing initialized app
const adminDb = initFirestore({
  credential: admin.credential.cert(firebaseConfig),
});

const adminAuth = admin.auth(); // No need to pass `app`

export { adminDb, adminAuth };
