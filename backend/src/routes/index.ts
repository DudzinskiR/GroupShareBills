import express from "express";
import db from "../utils/firebase/firebase-config";
const router = express.Router();

router.use("", () => {
  console.log(2);
  db.collection("users").add({ name: "jedne", email: "dwa" });
});

export default router;
