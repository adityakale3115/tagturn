import { supabase } from "../supabase/supabaseClient";

/* ---------- LOGIN ---------- */
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data.user;
}

/* ---------- SIGNUP ---------- */
export async function registerUser(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  });

  if (error) throw error;
  if (!data.user) throw new Error("Signup failed");

  // Create profile row
  const { error: profileError } = await supabase.from("users").insert({
    id: data.user.id,
    first_name: name,
    role: "user"
  });

  if (profileError) {
    console.error("Profile insert error:", profileError);
  }

  return data.user;
}

/* ---------- GOOGLE LOGIN / SIGNUP ---------- */
export async function googleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) throw error;
}

/* ---------- GET USER ROLE ---------- */
export async function getUserRole(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Role fetch error:", error);
    return "user";
  }

  return data?.role || "user";
}
