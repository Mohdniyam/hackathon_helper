import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkyWiEyj7054PqBAI6QIMyIGX5GOtoSHM",
  authDomain: "hackathonhelper-290e7.firebaseapp.com",
  projectId: "hackathonhelper-290e7",
  storageBucket: "hackathonhelper-290e7.firebasestorage.app",
  messagingSenderId: "555162158029",
  appId: "1:555162158029:web:d344bd188e648ce91b3a84",
  measurementId: "G-4ME52TYE3L",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
