// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDp-xepotmxkDrYEswGcgxdVwSom7KvTWI",
  authDomain: "annammatraders-b3618.firebaseapp.com",
  projectId: "annammatraders-b3618",
  storageBucket: "annammatraders-b3618.firebasestorage.app",
  messagingSenderId: "321945183856",
  appId: "1:321945183856:web:5d89814793e341e206f6b5",
  measurementId: "G-9YJSYQ0DZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
