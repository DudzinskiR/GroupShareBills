import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    projectId: process.env.PROJECT_ID,
  }),
  databaseURL:
    "https://groupsharebills-default-rtdb.europe-west1.firebasedatabase.app",
});

export const db = admin.firestore();
export const firebaseAuth = admin.auth();

export default admin;
