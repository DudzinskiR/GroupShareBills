import { initializeApp } from "firebase/app";
import {
  getAuth,
  getIdToken,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import FirebaseAuthResponse from "../models/auth/firebase-auth-error";

interface FirebaseError extends Error {
  code: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyDExV_a-r4Ek6gjf0knTg5Dmy7koKODjb4",
  authDomain: "groupsharebills.firebaseapp.com",
  projectId: "groupsharebills",
  storageBucket: "groupsharebills.appspot.com",
  messagingSenderId: "440232480191",
  appId: "1:440232480191:web:72e5bd931d99584b8fe50a",
  measurementId: "G-GT7DY6J8EF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);

    return FirebaseAuthResponse.SUCCESS;
  } catch (e) {
    return decodeAuthError((e as FirebaseError).code);
  }
};

export const getToken = async () => {
  const auth = getAuth();
  const { currentUser } = auth;

  if (!currentUser) return "";
  const token = await getIdToken(currentUser!, true);

  return token;
};

export const firebaseAuth = () => {
  return getAuth();
};

export const signInWithMail = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    return FirebaseAuthResponse.SUCCESS;
  } catch (e) {
    return decodeAuthError((e as FirebaseError).code);
  }
};

export const signUpWithMail = async (
  email: string,
  password: string,
): Promise<FirebaseAuthResponse> => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);

    return FirebaseAuthResponse.SUCCESS;
  } catch (e) {
    return decodeAuthError((e as FirebaseError).code);
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);

    return FirebaseAuthResponse.SUCCESS;
  } catch (e) {
    return decodeAuthError((e as FirebaseError).code);
  }
};

export const changePassword = async (oldPassword: string, password: string) => {
  try {
    await signInWithMail(auth.currentUser!.email!, oldPassword);

    await updatePassword(auth.currentUser!, password);
    return FirebaseAuthResponse.SUCCESS;
  } catch (e) {
    return decodeAuthError((e as FirebaseError).code);
  }
};

export const signOutAccount = async () => {
  const auth = getAuth();
  signOut(auth);
};

const decodeAuthError = (code: string): FirebaseAuthResponse => {
  console.log("🚀 ~ file: firebase.ts:118 ~ decodeAuthError ~ code:", code);

  switch (code) {
    case "auth/email-already-in-use":
      return FirebaseAuthResponse.EMAIL_EXISTS;
    case "auth/invalid-email":
      return FirebaseAuthResponse.INVALID_EMAIL;
    case "auth/weak-password":
      return FirebaseAuthResponse.INVALID_PASSWORD;
    case "auth/wrong-password":
      return FirebaseAuthResponse.WRONG_PASSWORD;
    case "auth/missing-password":
      return FirebaseAuthResponse.MISSING_PASSWORD;
    case "auth/user-not-found":
      return FirebaseAuthResponse.USER_NOT_FOUND;
    case "auth/uid-already-exists":
      return FirebaseAuthResponse.UID_EXISTS;
    default:
      return FirebaseAuthResponse.UNKNOWN;
  }
};
