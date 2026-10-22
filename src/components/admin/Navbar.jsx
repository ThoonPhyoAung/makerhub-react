import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { userLogout } from "../../api/userService";
import { useAlert } from "../../context/AlertContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Cpu,
  User,
  Settings,
  LogOut,
  Bell,
  Plus,
} from "lucide-react";

function Navbar({ onToggleSidebar }) {
  const profileDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // 📌 ThemeContext မှ theme နှင့် toggleTheme ကို ရယူခြင်း
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const showAlert = useAlert();
  const { user, isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Outside click close effects
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const response = userLogout();
    dispatch(logout());
    showAlert(response.message);
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-nav-bg border-b border-border relative">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3 gap-4">
        {/* ဘယ်ဘက်ခြမ်းမှာ Mobile Hamburger နဲ့ Title ကို အတူတူ ထည့်ပေးခြင်း */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-text bg-surface rounded-xl border border-border cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <span className="text-text font-bold text-base md:text-lg truncate">
            Maker<span className="text-primary">Hub</span> MM . Admin
          </span>
        </div>

        {/* Desktop Right Controls (Theme, Notifications, Profile) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full bg-bg-elevated text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notification Bell */}
          {isLogin && (
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-full bg-bg-elevated text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border rounded-lg shadow-lg py-2 z-20">
                  <p className="px-4 py-2 text-sm font-semibold text-text border-b border-border truncate">
                    Notifications
                  </p>
                  <div>
                    <p className="px-4 py-2 text-sm text-text-muted">Not yet</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer flex items-center"
            >
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User",
                  )}&background=161b22&color=0d9488&bold=true`
                }
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#0d9488]"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border rounded-lg shadow-lg py-2 z-20">
                <p className="px-4 py-2 text-sm font-semibold text-text border-b border-border truncate">
                  {user?.name || "User Name"}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-bg-subtle text-left cursor-pointer"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Right Side (Theme toggle) */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-surface text-text-muted cursor-pointer"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;