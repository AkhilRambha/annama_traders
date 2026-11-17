// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe_Ayf1oo0YqmIBBUF62OF8TtJxVfn8MA",
  authDomain: "annammatraders-6e6bd.firebaseapp.com",
  projectId: "annammatraders-6e6bd",
  storageBucket: "annammatraders-6e6bd.firebasestorage.app",
  messagingSenderId: "857380525436",
  appId: "1:857380525436:web:087d06e462cd57327b00f9",
  measurementId: "G-JQXX31EJQ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
