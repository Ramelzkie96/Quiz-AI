import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

// ✅ Sign in with Google (SAVE PROFILE)
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  await setDoc(
    doc(db, "users", user.uid),
    {
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      lastLogin: serverTimestamp(),
    },
    { merge: true } // 👈 VERY IMPORTANT
  );

  return user;
};

// Sign out
export const logoutUser = () => signOut(auth);
