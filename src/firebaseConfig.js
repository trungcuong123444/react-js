// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import getStorage

const firebaseConfig = {
  apiKey: "AIzaSyAcX8oDUqyMVXsmA7crgurto9vi6lQ8tPI",
  authDomain: "my-app-190fd.firebaseapp.com",
  projectId: "my-app-190fd",
  storageBucket: "my-app-190fd.appspot.com",
  messagingSenderId: "694501414058",
  appId: "1:694501414058:web:c188869fce5921e8fbecd3",
  measurementId: "G-3RCY7NTY5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize storage

export { app, db, auth, storage };
