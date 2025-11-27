import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAAjYR83E0LNIdmqv7aISD9Dvkn2XMXyR8",
  authDomain: "tagturn-9a83f.firebaseapp.com",
  projectId: "tagturn-9a83f",
  storageBucket: "tagturn-9a83f.firebasestorage.app",
  messagingSenderId: "541026979614",
  appId: "1:541026979614:web:44a8f8ef30507d9fbf030f",
  measurementId: "G-3P7XQJXDQV"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
