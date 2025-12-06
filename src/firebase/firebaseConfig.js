import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBTu8YqXvUGdW4Oh7sOIIqXi1i1xsFBPE0",
  authDomain: "medimateai-c1e36.firebaseapp.com",
  projectId: "medimateai-c1e36",
  storageBucket: "medimateai-c1e36.firebasestorage.app",
  messagingSenderId: "339022812872",
  appId: "1:339022812872:web:5b95cf4e8f3dd0bee6b7fd",
  measurementId: "G-2WFJEDC8QJ"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
