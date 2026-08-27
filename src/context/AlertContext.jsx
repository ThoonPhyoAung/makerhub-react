import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2 } from "lucide-react";

const AlertContext = createContext(null);

// App.jsx level မှာ Provider ချထားလို့ route ပြောင်းလည်း (navigate() ဖြစ်လည်း)
// alert state မပျောက်ဘူး — Login.jsx လို component တစ်ခုတည်းရဲ့ local state
// နဲ့ မတူဘဲ App တစ်ခုလုံးမှာ persist ဖြစ်တယ်.
//
// browser ရဲ့ native alert() နဲ့ မတူတာက — user "OK" click လုပ်စရာမလို,
// screen ကို block လည်းမလုပ်ဘူး, အချိန်ရောက်ရင် အလိုအလျောက် ပျောက်သွားမယ်.
export function AlertProvider({ children }) {
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = useCallback((message, duration = 3000) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), duration);
  }, []);

  return (
    <AlertContext.Provider value={showAlert}>
      {children}

      {alertMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-bg-elevated border border-green-500/30 text-text px-4 py-3 rounded-xl shadow-lg">
          <CheckCircle2 size={18} className="text-green-400 shrink-0" />
          <span className="text-sm font-medium">{alertMessage}</span>
        </div>
      )}
    </AlertContext.Provider>
  );
}

// Component မှာ: const showAlert = useAlert(); showAlert("Login successful!");
export function useAlert() {
  return useContext(AlertContext);
}
