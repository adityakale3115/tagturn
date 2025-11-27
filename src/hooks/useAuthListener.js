import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { getUserRole } from "../services/authService";

export default function useAuthListener() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return setUserData(null);

      const role = await getUserRole(user.uid);

      setUserData({ uid: user.uid, email: user.email, role });
    });

    return () => unsubscribe();
  }, []);

  return userData;
}
    