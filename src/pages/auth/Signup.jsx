import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Cpu, Moon, Sun } from "lucide-react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Login.jsx ရဲ့ dummy state pattern အတိုင်း

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: authApi.signup({ name, email, password }) ချိတ်မယ်.
    // Success -> navigate("/"), Fail -> setError(err.message)
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Top bar — Navbar.jsx ရဲ့ design language အတိုင်း (bg-nav-bg, border,
          max-w-7xl container, padding) ချည်းသာ tabs/search မပါဘဲ stripped-down */}
      <header className="bg-nav-bg border-b border-border">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Cpu size={20} className="text-primary" />
            <span className="text-text font-bold text-lg">
              Maker<span className="text-primary">Hub</span> MM
            </span>
          </Link>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Theme"
            className="p-2 rounded-full bg-bg-elevated text-text-muted hover:text-text transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </header>

      {/* Card — form ချည်းပဲ */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="bg-bg-elevated border border-border rounded-2xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-text text-2xl font-bold tracking-tight mb-1.5">
                Sign Up
              </h1>
              <p className="text-text-muted text-sm max-w-xs mx-auto leading-relaxed">
                Create an account to Join our community.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-text-muted text-sm font-medium mb-1.5"
                >
                  Full Name
                </label>
                <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2.5 focus-within:border-primary transition-colors">
                  <User size={16} className="text-text-subtle shrink-0" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aung Aung"
                    className="w-full bg-transparent text-text placeholder:text-text-subtle text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-text-muted text-sm font-medium mb-1.5"
                >
                  Email address
                </label>
                <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2.5 focus-within:border-primary transition-colors">
                  <Mail size={16} className="text-text-subtle shrink-0" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-text placeholder:text-text-subtle text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-text-muted text-sm font-medium mb-1.5"
                >
                  Password
                </label>
                <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2.5 focus-within:border-primary transition-colors">
                  <Lock size={16} className="text-text-subtle shrink-0" />
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-transparent text-text placeholder:text-text-subtle text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm py-2.5 rounded-xl mt-2 hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating account..." : "Get Started"}
                {!isSubmitting && <ArrowRight size={15} />}
              </button>
            </form>

            <p className="text-center text-text-muted text-sm mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
