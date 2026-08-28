import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Cpu, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// use fake api did with userService.jsx
import { login } from "../../features/auth/authSlice";
import { userSignUp } from "../../api/userService";

// show alert
import { useAlert } from "../../context/AlertContext";

function SignUp() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [signUpError, setSignUpError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showAlert = useAlert();

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateData();
    if (Object.keys(err).length > 0) {
      return false;
    } else {
      setIsSubmitting(true); // this is for button text "Signing in..."
      let name = nameRef.current.value;
      let email = emailRef.current.value;
      let password = passwordRef.current.value;

      //if api have,  call API - login API
      const response = userSignUp({ name, email, password });
      if (response.status === 1) {
        dispatch(login(response.data));
        showAlert(response.message); // "signup sucess"
        // navigate("/login");
        navigate("/");
      } else {
        setIsSubmitting(false);
        setSignUpError(response.message);
      }
    }
  };

  // validation
  const validateData = () => {
    const errs = {};
    if (!nameRef.current.value) errs.name = "Name is Required";
    if (!emailRef.current.value) errs.email = "Email is Required";
    if (!passwordRef.current.value) errs.password = "Password is required";
    setErrors(errs);
    return errs;
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

            {/* error message box */}
            {signUpError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
                {signUpError}
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
                    ref={nameRef}
                    autoComplete="name"
                    placeholder="e.g. Aung Aung"
                    className="w-full bg-transparent text-text placeholder:text-text-subtle text-sm focus:outline-none"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
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
                    ref={emailRef}
                    autoComplete="email"
                    // onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-text placeholder:text-text-subtle text-sm focus:outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
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
                    minLength={6}
                    ref={passwordRef}
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    className="w-full bg-transparent text-text placeholder:text-text-subtle text-sm focus:outline-none"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
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

export default SignUp;
