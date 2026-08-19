import { useState } from "react";
import { NavLink } from "react-router-dom";
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
} from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Firebase မချိတ်ရသေး, dummy state
  const [searchValue, setSearchValue] = useState("");

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Learning", path: "/learning" },
    { name: "Community", path: "/community" },
    { name: "Marketplace", path: "/marketplace" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // TODO: search logic နောက်ပိုင်း ထည့်မယ်
    console.log("Searching:", searchValue);
  };

  return (
    <header className="sticky top-0 z-50 bg-nav-bg border-b border-border">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3 gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <Cpu size={20} className="text-primary" />
          <span className="text-text font-bold text-lg">
            Maker<span className="text-primary">Hub</span> MM
          </span>
        </a>

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
            className="p-2 rounded-full bg-bg-elevated text-text-muted hover:text-text transition-colors"
          >
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer"
              >
                <img
                  src="https://ui-avatars.com/api/?name=User&background=161b22&color=0d9488&bold=true"
                  alt="Profile"
                  className="w-9 h-9 rounded-full"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border rounded-lg shadow-lg py-2">
                  <p className="px-4 py-2 text-sm font-semibold text-text border-b border-border">
                    User Name
                  </p>
                  <a
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-bg-subtle"
                  >
                    <User size={14} /> Profile
                  </a>
                  <a
                    href="/profile/edit"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-bg-subtle"
                  >
                    <Settings size={14} /> Settings
                  </a>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-bg-subtle"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/login"
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-bg-elevated text-text hover:bg-bg-subtle transition-colors"
              >
                Log in
              </a>
              <a
                href="/signup"
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                Sign up
              </a>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-text"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu (Collapsible) */}
      {isMenuOpen && (
        <div className="lg:hidden px-4 pb-4 border-t border-border">
          {/* Mobile top strip: auth/profile + theme */}
          <div className="flex items-center justify-between py-3 border-b border-border-muted">
            {isLoggedIn ? (
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    src="https://ui-avatars.com/api/?name=User&background=161b22&color=0d9488&bold=true"
                    alt="Profile"
                    className="w-9 h-9 rounded-full"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-bg-elevated border border-border rounded-lg shadow-lg py-2 z-10">
                    <p className="px-4 py-2 text-sm font-semibold text-text border-b border-border">
                      User Name
                    </p>
                    <a
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text"
                    >
                      <User size={14} /> Profile
                    </a>
                    <a
                      href="/profile/edit"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text"
                    >
                      <Settings size={14} /> Settings
                    </a>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="px-3 py-1 rounded-full text-sm bg-bg-elevated text-text"
                >
                  Log in
                </a>
                <a
                  href="/signup"
                  className="px-3 py-1 rounded-full text-sm bg-primary text-white"
                >
                  Sign up
                </a>
              </div>
            )}

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-bg-elevated text-text-muted"
            >
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

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
              className="w-full bg-bg-elevated border border-border rounded-full pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </form>
        </div>
      )}
    </header>
  );
}

export default Navbar;
