import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zypwhkzflpsrufgwfase.supabase.co";
const supabaseAnonKey = "sb_publishable_jlEtkI9zZFH34kA1QnNxPw_f0_i2pV-"; // Use environment variables for safety!

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
const testConnection = async () => {
  try {
    // We try to fetch the session. This doesn't require RLS permissions 
    // and confirms the URL and Key are valid.
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Supabase connection error:", error.message);
    } else {
      console.log("✅ Supabase connected successfully!");
    }
  } catch (err) {
    console.error("Unexpected error connecting to Supabase:", err);
  }
};

testConnection();