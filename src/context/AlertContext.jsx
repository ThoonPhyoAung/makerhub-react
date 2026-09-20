import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

// this is the context provider , do for all the components
// this, call AlertProvider * 2
const AlertContext = createContext(null);

// Component ထဲမှာ useContext(AlertContext) ကို တိုက်ရိုက်ခေါ်လည်း ရပါတယ်,
//  ဒါပေမဲ့ useAlert() လို့ ရေးရင် ဖတ်ရလွယ်
// when other page call , this will  work first * 1
export function useAlert() {
  return useContext(AlertContext);
  //   useContext(AlertContext) က "ကိုယ့်ရဲ့ parent tree ကို scroll တက်ပြီး,
  //  အနီးဆုံး <AlertContext.Provider value={...}> ကို ရှာ, ဒီ value ကို ပြန်ပေး"
  //  ဆိုတဲ့ React ရဲ့ built-in
}

// this is the AlertProvider, do render for all the components, * 3
// children are all pages
export function AlertProvider({ children }) {
  // to save the alert message
  const [alertConfig, setAlertConfig] = useState(null);

  // for auto dismiss
  const timerRef = useRef(null);

  // Alert ကို ပိတ်ပေးမည့် Function
  const closeAlert = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAlertConfig(null);
  }, []);

  //   showAlert is a function for showing the alert message *5
  //   alertConfig state ပြောင်းသွားလို့ AlertProvider re-render ဖြစ်ပေးမည်
  const showAlert = useCallback((options) => {
    // ယခင်ရှိပြီးသား Timer ကို ရှင်းထုတ်မည်
    if (timerRef.current) clearTimeout(timerRef.current);

    // String အဖြစ် ပို့ပါက ရိုးရိုး Toast အဖြစ် ၃ စက္ကန့်ပြသမည်
    // String အဖြစ် ပို့ပါက အမြဲတမ်း "success" ဖြစ်မည်
    if (typeof options === "string") {
      setAlertConfig({
        message: options,
        type: "success",
      });
      timerRef.current = setTimeout(() => setAlertConfig(null), 3000);
      return;
    }

    // Object အဖြစ် ပို့ပါက type မပါခဲ့ရင် Default "success" ယူမည်
    setAlertConfig({
      type: "success", // <-- Default အဖြစ် "success" ထည့်ထားပြီး
      ...options, // <-- options ထဲမှာ type ပါလာရင် auto override ဖြစ်သွားပါမည်
    });

    // duration သီးသန့် မပါရင် Default ၅ စက္ကန့်အကြာမှာ အလိုအလျောက် ပျောက်မည်
    const autoDismissTime = options.duration ?? 5000;
    if (autoDismissTime > 0) {
      timerRef.current = setTimeout(() => {
        setAlertConfig(null);
      }, autoDismissTime);
    }
  }, []);

  // AlertProvider ရဲ့ showAlert function run because of value={showAlert} *4
  return (
    <AlertContext.Provider value={showAlert}>
      {/* children is the whole app */}
      {children}

      {/* this is the alert */}
      {alertConfig && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 bg-bg-elevated border border-border text-text px-3.5 py-3 rounded-2xl shadow-2xl border-primary/30 w-[calc(100%-2rem)] max-w-md sm:w-auto sm:min-w-[360px]">
          {/* Left: Icon & Message */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Type အလိုက် Icon နဲ့ Color ခွဲထုတ်ခြင်း */}
            {alertConfig.type === "warning" && (
              <AlertTriangle size={18} className="text-amber-400 shrink-0" />
            )}
            {alertConfig.type === "error" && (
              <AlertCircle size={18} className="text-red-400 shrink-0" />
            )}
            {alertConfig.type === "info" && (
              <Info size={18} className="text-blue-400 shrink-0" />
            )}
            {(alertConfig.type === "success" || !alertConfig.type) && (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            )}

            <span className="text-xs sm:text-sm font-medium leading-tight break-words line-clamp-2">
              {alertConfig.message}
            </span>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            {/* Go to Login ခလုတ် */}
            {alertConfig.actionText && (
              <button
                onClick={() => {
                  alertConfig.onAction?.();
                  closeAlert();
                }}
                className="text-xs font-semibold bg-primary text-bg px-2.5 py-1.5 rounded-lg hover:bg-primary-hover active:scale-95 transition-all whitespace-nowrap"
              >
                {alertConfig.actionText}
              </button>
            )}

            {/* Cancel / Close (X) ခလုတ် */}
            <button
              onClick={closeAlert}
              className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
