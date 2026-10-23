import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // LocalStorage သို့မဟုတ် default အနေဖြင့် dark theme ကို သတ်မှတ်ခြင်း
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("makerhub_theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    // HTML root တွင် theme class ကို ထည့်သွင်းခြင်း
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // LocalStorage တွင် သိမ်းဆည်းခြင်း
    localStorage.setItem("makerhub_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    // 1. Disable transitions temporarily
    const css = document.createElement("style");
    css.appendChild(
      document.createTextNode(
        `* { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }`,
      ),
    );
    document.head.appendChild(css);

    // 2. Switch theme mode (dark/light class on html element)
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    // 3. Re-enable transitions after paint
    setTimeout(() => {
      document.head.removeChild(css);
    }, 10);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
