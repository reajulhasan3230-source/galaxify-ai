import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCL7HsOAzff0kWCBwYAz0Y152ewPSqsymw",
  authDomain: "galaxify-ai-761e4.firebaseapp.com",
  projectId: "galaxify-ai-761e4",
  storageBucket: "galaxify-ai-761e4.firebasestorage.app",
  messagingSenderId: "396422828172",
  appId: "1:396422828172:web:dae2aadd76dc4ce5532ba9",
  measurementId: "G-4F13JQYRT1"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Quick test function for your Login page
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);