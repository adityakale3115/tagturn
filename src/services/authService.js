import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

// Create account
export const registerUser = async (email, password, name) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  
  await setDoc(doc(db, "users", res.user.uid), {
    name,
    email,
    role: "customer", 
    createdAt: new Date()
  });

  return res.user;
};

// Login
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Get user role
export const getUserRole = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.data()?.role;
};
