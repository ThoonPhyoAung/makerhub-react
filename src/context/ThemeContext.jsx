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
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
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
