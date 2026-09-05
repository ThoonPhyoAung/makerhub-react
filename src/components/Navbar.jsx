import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { userLogout } from "../api/userService";
import { useAlert } from "../context/AlertContext";
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

function Navbar() {
  const profileDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const showAlert = useAlert();
  const { user, isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Dark Mode DOM Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Close dropdown on outside click
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
    setIsMenuOpen(false);
    navigate("/"); // 3. Redirect to home page on logout
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Learning", path: "/learning" },
    { name: "Community", path: "/community" },
    { name: "Marketplace", path: "/marketplace" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching:", searchValue);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-nav-bg border-b border-border relative">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Cpu size={20} className="text-primary" />
          <span className="text-text font-bold text-lg">
            Maker<span className="text-primary">Hub</span> MM
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-text-muted hover:text-text"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center relative flex-1 max-w-sm"
        >
          <Search size={16} className="absolute left-3 text-text-muted" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search projects or items..."
            className="w-full bg-bg-elevated border border-border rounded-full pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </form>

        {/* Desktop Right Controls */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Theme"
            className="p-2 rounded-full bg-bg-elevated text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* New Post Button (Pill Style) */}
          {isLogin && (
            <Link
              to="/community/create-post"
              className="inline-flex items-center gap-1.5 bg-primary hover:brightness-110 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Plus size={16} strokeWidth={2.5} />

              <span>New Post</span>
            </Link>
          )}

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
          {isLogin ? (
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
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-bg-subtle"
                  >
                    <User size={14} /> Profile
                  </Link>
                  <Link
                    to="/profile/edit"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-bg-subtle"
                  >
                    <Settings size={14} /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-bg-subtle text-left cursor-pointer"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-bg-elevated text-text hover:bg-bg-subtle transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-text cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute left-4 right-4 top-full overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen
            ? "max-h-[80vh] opacity-100 mt-3"
            : "max-h-0 opacity-0 mt-0 pointer-events-none"
        }`}
      >
        <div className="bg-bg-elevated border border-border rounded-2xl shadow-lg p-4 overflow-y-auto max-h-[80vh]">
          {/* Mobile top strip */}
          <div className="flex items-center justify-between pb-3 border-b border-border-muted gap-2">
            {isLogin ? (
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User",
                    )}&background=161b22&color=0d9488&bold=true`
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#0d9488] shrink-0"
                />
                <span className="text-sm font-semibold text-text truncate">
                  {user?.name || "User"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-1 rounded-full text-xs bg-bg-subtle text-text"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-1 rounded-full text-xs bg-primary text-white"
                >
                  Sign up
                </Link>
              </div>
            )}

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-full bg-bg-subtle text-text-muted cursor-pointer"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Mobile New Post Button: Icon-only on mobile, text on sm screens */}
              {isLogin && (
                <Link
                  to="/community/create-post"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Create new post"
                  className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-primary hover:brightness-110 text-white flex items-center gap-1 text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">New Post</span>
                </Link>
              )}

              {isLogin && (
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-1.5 rounded-full bg-bg-elevated text-text-muted hover:text-text transition-colors cursor-pointer"
                >
                  <Bell size={16} />
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Notification Panel */}
          {isNotifOpen && (
            <div className="bg-bg-elevated border border-border rounded-lg my-3">
              <p className="px-4 py-2 text-sm font-semibold text-text border-b border-border">
                Notifications
              </p>
              <p className="px-4 py-2 text-sm text-text-muted">Not yet</p>
            </div>
          )}

          {/* Mobile Nav Links */}
          <ul className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 text-sm font-medium ${
                      isActive ? "text-primary" : "text-text-muted"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Authenticated Links in Mobile View */}
          {isLogin && (
            <div className="pt-2 border-t border-border-muted space-y-2 mb-3">
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 py-1.5 text-sm text-text-muted hover:text-text"
              >
                <User size={14} /> Profile
              </Link>
              <Link
                to="/profile/edit"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 py-1.5 text-sm text-text-muted hover:text-text"
              >
                <Settings size={14} /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 py-1.5 text-sm text-red-500 cursor-pointer"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}

          {/* new post btn*/}
          {/* {isLogin && (
            <Link
              to="/community/create-post"
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:brightness-110 text-white py-2.5 px-4 rounded-xl text-sm font-semibold shadow-sm my-2 transition-all active:scale-[0.98]"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Create New Post</span>
            </Link>
          )} */}

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search projects or items..."
              className="w-full bg-bg-subtle border border-border rounded-full pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </form>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
