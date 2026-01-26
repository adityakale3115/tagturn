import { useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      navigate("/");
    });
  }, [navigate]);

  return <p>Signing you in...</p>;
}
