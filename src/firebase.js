// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq8aZNHaUlcThdNapEHg9fgmjE08n5uhA",
  authDomain: "mortage-loan-calculator.firebaseapp.com",
  projectId: "mortage-loan-calculator",
  storageBucket: "mortage-loan-calculator.firebasestorage.app",
  messagingSenderId: "667867415208",
  appId: "1:667867415208:web:99d51f98f94bbf86bf389d",
  measurementId: "G-9XDR644HC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
export default app;
