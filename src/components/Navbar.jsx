import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { userLogout } from "../api/userService";
import { useAlert } from "../context/AlertContext";
import { useTheme } from "../context/ThemeContext";
import { useFetch } from "../hooks/useFetch";
import { getMarketplaceItems } from "../api/marketplaceApi";
import { getPosts } from "../api/postsApi";
import { getLessons } from "../api/lessonsApi";

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
  Package,
  GraduationCap,
  BookOpen,
  Loader2,
} from "lucide-react";

function Navbar() {
  const profileDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const searchRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const { data: marketData, loading: marketLoading } =
    useFetch(getMarketplaceItems);
  const { data: postsData, loading: postsLoading } = useFetch(getPosts);
  const { data: lessonsData, loading: lessonsLoading } = useFetch(getLessons);

  const items = Array.isArray(marketData) ? marketData : [];
  const posts = Array.isArray(postsData) ? postsData : [];
  const lessons = Array.isArray(lessonsData) ? lessonsData : [];

  const isLoading = marketLoading || postsLoading || lessonsLoading;

  const showAlert = useAlert();
  const { user, isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const query = searchValue.trim().toLowerCase();

  const filteredItems = query
    ? items
        .filter(
          (i) =>
            i.title?.toLowerCase().includes(query) ||
            i.category?.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  const filteredPosts = query
    ? posts
        .filter(
          (p) =>
            p.title?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  const filteredLessons = query
    ? lessons
        .filter((l) =>
          typeof l.title === "object"
            ? l.title?.en?.toLowerCase().includes(query)
            : l.title?.toLowerCase().includes(query),
        )
        .slice(0, 3)
    : [];

  const totalResultsCount =
    filteredItems.length + filteredPosts.length + filteredLessons.length;

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    setIsOpen(val.trim().length > 0);
  };

  const handleLogout = () => {
    const response = userLogout();
    dispatch(logout());
    showAlert(response.message);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Learning", path: "/learning" },
    { name: "Community", path: "/community" },
    { name: "Marketplace", path: "/marketplace" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setIsOpen(false);
    setIsMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-nav-bg border-b border-border">
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

        {/* Desktop Search with Live Dropdown */}
        <div
          className="hidden lg:block relative flex-1 max-w-sm"
          ref={searchRef}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center relative"
          >
            <Search size={16} className="absolute left-3 text-text-muted" />
            <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              onFocus={() => {
                if (searchValue.trim().length > 0) setIsOpen(true);
              }}
              placeholder="Search items, posts, or lessons..."
              className="w-full bg-bg-elevated border border-border rounded-full pl-9 pr-8 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  setIsOpen(false);
                }}
                className="absolute right-3 text-text-muted hover:text-text cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Live Search Dropdown Panel */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-bg-elevated border border-border rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto no-scrollbar">
              {isLoading ? (
                <div className="p-6 text-center text-text-muted text-xs flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary" />{" "}
                  Searching...
                </div>
              ) : totalResultsCount > 0 ? (
                <div className="p-2 space-y-4">
                  {/* Marketplace Items */}
                  {filteredItems.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                        <Package size={12} className="text-primary" />{" "}
                        Marketplace Items
                      </div>
                      <div className="space-y-1 mt-1">
                        {filteredItems.map((item) => (
                          <Link
                            key={item.id || item._id}
                            to={`/marketplace/items/${item.id || item._id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface transition-colors group"
                          >
                            <img
                              src={
                                item.images?.[0] ||
                                "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=500"
                              }
                              alt={item.title}
                              className="w-9 h-9 rounded-lg object-cover bg-bg border border-border shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-text truncate group-hover:text-primary transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-primary font-semibold">
                                {typeof item.price === "number"
                                  ? `${item.price.toLocaleString()} MMK`
                                  : item.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Community Posts */}
                  {filteredPosts.length > 0 && (
                    <div className="border-t border-border/60 pt-2">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                        <GraduationCap size={12} className="text-primary" />{" "}
                        Community Posts
                      </div>
                      <div className="space-y-1 mt-1">
                        {filteredPosts.map((post) => (
                          <Link
                            key={post.id || post._id}
                            to={`/community/project/${post.id || post._id}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-xl hover:bg-surface transition-colors group"
                          >
                            <h4 className="text-xs font-bold text-text truncate group-hover:text-primary transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-[11px] text-text-muted truncate mt-0.5">
                              {post.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning Lessons */}
                  {filteredLessons.length > 0 && (
                    <div className="border-t border-border/60 pt-2">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                        <BookOpen size={12} className="text-primary" /> Learning
                        Lessons
                      </div>
                      <div className="space-y-1 mt-1">
                        {filteredLessons.map((lesson) => {
                          const lessonTitle =
                            typeof lesson.title === "object"
                              ? lesson.title?.en
                              : lesson.title;

                          // 📌 Journey ID နှင့် Chapter ID ကို ယူ၍ သင့်တော်သော URL ပုံစံတည်ဆောက်ခြင်း
                          const jId =
                            lesson.journeyId || lesson.journey || "esp32";
                          const cId =
                            lesson.chapterId || lesson.chapter || "esp32-basic";
                          const lId = lesson.id || lesson._id;

                          return (
                            <Link
                              key={lId}
                              to={`/learning/${jId}/${cId}/${lId}`}
                              onClick={() => {
                                setIsOpen(false);
                                setIsMenuOpen(false); // Mobile menu ပိတ်ရန်
                              }}
                              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface transition-colors group"
                            >
                              <span className="text-xs font-bold text-text truncate group-hover:text-primary transition-colors">
                                {lessonTitle}
                              </span>
                              <span className="text-[10px] text-text-muted shrink-0 bg-bg px-1.5 py-0.5 rounded border border-border">
                                Lesson
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-text-muted text-xs">
                  No results found for &quot;
                  <span className="text-text font-semibold">{searchValue}</span>
                  &quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Right Controls */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full bg-bg-elevated border border-border text-text-muted hover:text-text hover:bg-bg-subtle transition-all cursor-pointer shadow-sm"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isLogin && (
            <Link
              to="/community/create-post"
              className="inline-flex items-center gap-1.5 bg-primary hover:brightness-110 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>New Post</span>
            </Link>
          )}

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
                onClick={toggleTheme}
                className="p-1.5 rounded-full bg-bg-subtle border border-border text-text-muted cursor-pointer shadow-sm"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

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

          {isNotifOpen && (
            <div className="bg-bg-elevated border border-border rounded-lg my-3">
              <p className="px-4 py-2 text-sm font-semibold text-text border-b border-border">
                Notifications
              </p>
              <p className="px-4 py-2 text-sm text-text-muted">Not yet</p>
            </div>
          )}

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

          {isLogin && (
            <div className="pt-2 border-t border-border-muted space-y-2 mb-3">
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 py-1.5 text-sm text-text-muted hover:text-text"
              >
                <User size={14} /> Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 py-1.5 text-sm text-red-500 cursor-pointer"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}

          {/* 📌 Mobile Search with Live Dropdown */}
          <div className="relative pt-2">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center"
            >
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={searchValue}
                onChange={handleInputChange}
                onFocus={() => {
                  if (searchValue.trim().length > 0) setIsOpen(true);
                }}
                placeholder="Search items, posts, or lessons..."
                className="w-full bg-bg-subtle border border-border rounded-full pl-9 pr-8 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue("");
                    setIsOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Mobile Live Search Dropdown Panel */}
            {isOpen && (
              <div className="mt-2 bg-bg border border-border rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto no-scrollbar">
                {isLoading ? (
                  <div className="p-4 text-center text-text-muted text-xs flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-primary" />{" "}
                    Searching...
                  </div>
                ) : totalResultsCount > 0 ? (
                  <div className="p-2 space-y-3">
                    {/* Marketplace Items */}
                    {filteredItems.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                          <Package size={12} className="text-primary" />{" "}
                          Marketplace Items
                        </div>
                        <div className="space-y-1 mt-1">
                          {filteredItems.map((item) => (
                            <Link
                              key={item.id || item._id}
                              to={`/marketplace/items/${item.id || item._id}`}
                              onClick={() => {
                                setIsOpen(false);
                                setIsMenuOpen(false);
                              }}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface transition-colors"
                            >
                              <img
                                src={
                                  item.images?.[0] ||
                                  "https://images.unsplash.com/photo-1608564697171-2f6118fc5f37?w=500"
                                }
                                alt={item.title}
                                className="w-7 h-7 rounded-md object-cover bg-bg-elevated border border-border shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-text truncate">
                                  {item.title}
                                </h4>
                                <p className="text-[10px] text-primary font-semibold">
                                  {typeof item.price === "number"
                                    ? `${item.price.toLocaleString()} MMK`
                                    : item.price}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Community Posts */}
                    {filteredPosts.length > 0 && (
                      <div className="border-t border-border/60 pt-2">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                          <GraduationCap size={12} className="text-primary" />{" "}
                          Community Posts
                        </div>
                        <div className="space-y-1 mt-1">
                          {filteredPosts.map((post) => (
                            <Link
                              key={post.id || post._id}
                              to={`/community/project/${post.id || post._id}`}
                              onClick={() => {
                                setIsOpen(false);
                                setIsMenuOpen(false);
                              }}
                              className="block px-2 py-1.5 rounded-lg hover:bg-surface transition-colors"
                            >
                              <h4 className="text-xs font-bold text-text truncate">
                                {post.title}
                              </h4>
                              <p className="text-[10px] text-text-muted truncate">
                                {post.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Lessons */}

                    {filteredLessons.length > 0 && (
                      <div className="border-t border-border/60 pt-2">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                          <BookOpen size={12} className="text-primary" />{" "}
                          Learning Lessons
                        </div>
                        <div className="space-y-1 mt-1">
                          {filteredLessons.map((lesson) => {
                            const lessonTitle =
                              typeof lesson.title === "object"
                                ? lesson.title?.en
                                : lesson.title;

                            // 📌 Journey ID နှင့် Chapter ID ကို ယူ၍ သင့်တော်သော URL ပုံစံတည်ဆောက်ခြင်း
                            const jId =
                              lesson.journeyId || lesson.journey || "esp32";
                            const cId =
                              lesson.chapterId ||
                              lesson.chapter ||
                              "esp32-basic";
                            const lId = lesson.id || lesson._id;

                            return (
                              <Link
                                key={lId}
                                to={`/learning/${jId}/${cId}/${lId}`}
                                onClick={() => {
                                  setIsOpen(false);
                                  setIsMenuOpen(false); // Mobile menu ပိတ်ရန်
                                }}
                                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface transition-colors group"
                              >
                                <span className="text-xs font-bold text-text truncate group-hover:text-primary transition-colors">
                                  {lessonTitle}
                                </span>
                                <span className="text-[10px] text-text-muted shrink-0 bg-bg px-1.5 py-0.5 rounded border border-border">
                                  Lesson
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-text-muted text-xs">
                    No results for &quot;
                    <span className="text-text font-semibold">
                      {searchValue}
                    </span>
                    &quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
