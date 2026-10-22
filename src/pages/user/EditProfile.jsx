import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Mail, Image, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import { syncUserStorage } from "../../api/userService"; // 📌 syncUserStorage ကို import လုပ်ရန်
import { login } from "../../features/auth/authSlice"; // Redux state update လုပ်ရန် (အကယ်၍ လိုအပ်ပါက)

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showAlert = useAlert();

  // Redux မှ လက်ရှိ user data ယူခြင်း
  const currentUser = useSelector((state) => state?.auth?.user) || {
    name: "Admin",
    email: "admin@gmail.com",
    avatar: "",
  };

  // Form State
  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [avatar, setAvatar] = useState(currentUser.avatar || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Updated User Object ကို တည်ဆောက်ခြင်း
      const updatedUser = {
        ...currentUser,
        name: name,
        email: email,
        avatar: avatar, // 👈 Input ထဲက ထည့်လိုက်တဲ့ Image URL အသစ်ကို ထည့်ပေးခြင်း
      };

      // 2. LocalStorage (active user နှင့် users list) ကို ချက်ချင်း Sync လုပ်ခြင်း
      syncUserStorage(updatedUser);

      // 3. Redux State ကိုပါ update ဖြစ်အောင် dispatch လုပ်ခြင်း (auth slice ထဲက login သို့မဟုတ် update action)
      dispatch(login(updatedUser)); // project မှာ သုံးထားတဲ့ update user action

      setTimeout(() => {
        setLoading(false);
        showAlert("Profile updated successfully!");
        navigate("/profile");
      }, 500);
    } catch (err) {
      setLoading(false);
      showAlert({ message: "Failed to update profile. Please try again." });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2 text-text-muted hover:text-text text-xs font-semibold mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Profile
      </button>

      <div className="bg-bg-elevated border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-text mb-1">Edit Profile</h2>
        <p className="text-xs text-text-muted mb-6">
          Update your personal information and profile appearance.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Preview & URL Input */}
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary/40 flex items-center justify-center font-bold text-xl uppercase overflow-hidden shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : name ? (
                name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              ) : (
                "AD"
              )}
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold text-text">
                Profile Avatar URL
              </label>
              <div className="flex items-center bg-bg border border-border rounded-xl px-3 py-2">
                <Image size={16} className="text-text-subtle mr-2 shrink-0" />
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-transparent text-text text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">Full Name</label>
            <div className="flex items-center bg-bg border border-border rounded-xl px-3.5 py-2.5">
              <User size={16} className="text-text-subtle mr-2.5 shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-transparent text-text text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Email (Read-only / Cannot edit directly) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">
              Email Address (Cannot be changed)
            </label>
            <div className="flex items-center bg-bg-subtle border border-border rounded-xl px-3.5 py-2.5 opacity-70">
              <Mail size={16} className="text-text-subtle mr-2.5 shrink-0" />
              <input
                type="email"
                value={email}
                disabled // 👈 ဒီနေရာမှာ disabled လုပ်ထားလိုက်ခြင်းဖြင့် ဝင်မပြင်နိုင်အောင် တားနိုင်ပါတယ်
                className="w-full bg-transparent text-text text-xs focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-bg-subtle text-text text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-[#052010] text-xs font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={15} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
