import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { getUserRole } from "../services/authService";

export default function useAuthListener() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session
    supabase.auth.getUser().then(async ({ data }) => {
      const authUser = data?.user;

      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const role = await getUserRole(authUser.id);

      setUser({
        id: authUser.id,
        email: authUser.email,
        role
      });

      setLoading(false);
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user;

        if (!authUser) {
          setUser(null);
          return;
        }

        const role = await getUserRole(authUser.id);

        setUser({
          id: authUser.id,
          email: authUser.email,
          role
        });
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
