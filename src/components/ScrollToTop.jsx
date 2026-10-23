import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Page Route ပြောင်းသွားတိုင်း Scroll ကို အပေါ်ဆုံး (Top: 0) သို့ ပြန်ပို့ပေးမည်
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
