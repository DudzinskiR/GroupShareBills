import admin from "firebase-admin";
const serviceAccount = require("./firebase-private-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://groupsharebills-default-rtdb.europe-west1.firebasedatabase.app",
});
const db = admin.firestore();

export default db;
