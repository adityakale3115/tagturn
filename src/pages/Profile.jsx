import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import useSupabaseUser from "../hooks/useAuthListener";
import { toast } from "react-toastify";
import "../styles/Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseUser();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    mobile: "",
    address: ""
  });

  /* ---------- LOAD PROFILE ---------- */
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (!user) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error(error);
        return;
      }

      if (data) {
        setFormData({
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          gender: data.gender ?? "",
          dob: data.dob ?? "",
          mobile: data.mobile ?? "",
          address: data.address ?? ""
        });
      }
    };

    loadProfile();
  }, [user, loading, navigate]);

  /* ---------- SAVE PROFILE ---------- */
  const handleSave = async () => {
    if (!formData.mobile) {
      return toast.error("Mobile number is required");
    }

    setSaving(true);

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      gender: formData.gender,
      dob: formData.dob || null,
      mobile: formData.mobile,
      address: formData.address,
      updated_at: new Date()
    });

    setSaving(false);

    if (error) {
      toast.error("Failed to save profile");
      console.error(error);
    } else {
      toast.success("Profile updated successfully");
    }
  };

  /* ---------- LOGOUT ---------- */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  /* ---------- DELETE ACCOUNT (SAFE WAY) ---------- */
  const handleDeleteAccount = async () => {
    if (!window.confirm("This will permanently delete your data. Continue?"))
      return;

    // Delete profile row
    await supabase.from("users").delete().eq("id", user.id);

    // Log out (auth deletion requires Edge Function)
    await supabase.auth.signOut();

    toast.success("Account data deleted");
    navigate("/");
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <h2>{formData.firstName} {formData.lastName}</h2>
        <p>{user.email}</p>

        <button onClick={handleDeleteAccount} className="danger">
          Delete Account
        </button>
        <button onClick={handleLogout}>Logout</button>
      </aside>

      <main className="profile-content">
        <h1>Edit Profile</h1>

        <input value={user.email} disabled />

        <input
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />

        <input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />

        <input
          placeholder="Mobile"
          value={formData.mobile}
          onChange={(e) =>
            setFormData({ ...formData, mobile: e.target.value })
          }
        />

        <textarea
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </main>
    </div>
  );
}
