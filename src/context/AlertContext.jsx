import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const AlertContext = createContext(null);

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [alertConfig, setAlertConfig] = useState(null);
  const timerRef = useRef(null);

  const closeAlert = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAlertConfig(null);
  }, []);

  const showAlert = useCallback((options) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (typeof options === "string") {
      setAlertConfig({
        message: options,
        type: "success",
        isModal: false,
      });
      timerRef.current = setTimeout(() => setAlertConfig(null), 3500);
      return;
    }

    const isModal = options.isModal || Boolean(options.actionText);

    setAlertConfig({
      type: "success",
      isModal,
      ...options,
    });

    if (!isModal) {
      const autoDismissTime = options.duration ?? 4000;
      if (autoDismissTime > 0) {
        timerRef.current = setTimeout(() => {
          setAlertConfig(null);
        }, autoDismissTime);
      }
    }
  }, []);

  const getTypeStyles = (type) => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle size={24} className="text-amber-400 shrink-0" />,
          smallIcon: (
            <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          ),
          border: "border-amber-500/30",
          badgeBg: "bg-amber-500/10 border-amber-500/20",
          glow: "shadow-[0_0_25px_rgba(245,158,11,0.15)]",
        };
      case "error":
        return {
          icon: <AlertCircle size={24} className="text-red-400 shrink-0" />,
          smallIcon: (
            <AlertCircle size={18} className="text-red-400 shrink-0" />
          ),
          border: "border-red-500/30",
          badgeBg: "bg-red-500/10 border-red-500/20",
          glow: "shadow-[0_0_25px_rgba(239,68,68,0.15)]",
        };
      case "info":
        return {
          icon: <Info size={24} className="text-blue-400 shrink-0" />,
          smallIcon: <Info size={18} className="text-blue-400 shrink-0" />,
          border: "border-blue-500/30",
          badgeBg: "bg-blue-500/10 border-blue-500/20",
          glow: "shadow-[0_0_25px_rgba(59,130,246,0.15)]",
        };
      default:
        return {
          icon: (
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
          ),
          smallIcon: (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ),
          border: "border-emerald-500/30",
          badgeBg: "bg-emerald-500/10 border-emerald-500/20",
          glow: "shadow-[0_0_25px_rgba(16,185,129,0.15)]",
        };
    }
  };

  const style = alertConfig ? getTypeStyles(alertConfig.type) : null;

  return (
    <AlertContext.Provider value={showAlert}>
      {children}

      {/* AnimatePresence သည် Component ပိတ်သွားချိန် Exit Animation အိအိလေး အလုပ်လုပ်စေသည် */}
      <AnimatePresence>
        {alertConfig && (
          <>
            {alertConfig.isModal ? (
              /* ======================================================== */
              /* 1. CENTER MODAL BOX (Animate Presence Included)         */
              /* ======================================================== */
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop Fade Animation */}
                <motion.div
                  key="modal-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={closeAlert}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                />

                {/* Modal Box Scale & Fade Animation */}
                <motion.div
                  key="modal-box"
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{
                    duration: 0.18,
                    ease: [0.16, 1, 0.3, 1], // Custom smooth cubic-bezier
                  }}
                  className={`bg-bg-elevated border ${style.border} ${style.glow} text-text rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative z-10`}
                >
                  <button
                    onClick={closeAlert}
                    className="absolute top-4 right-4 text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-surface transition-colors"
                  >
                    <X size={18} />
                  </button>

                  <div
                    className={`p-3.5 rounded-2xl border ${style.badgeBg} mb-4 flex items-center justify-center`}
                  >
                    {style.icon}
                  </div>

                  {alertConfig.title && (
                    <h3 className="text-base sm:text-lg font-bold text-text mb-1">
                      {alertConfig.title}
                    </h3>
                  )}

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
                    {alertConfig.message}
                  </p>

                  <div className="flex items-center gap-3 w-full">
                    <button
                      onClick={closeAlert}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-surface-2 text-text text-xs sm:text-sm font-semibold transition-all active:scale-95"
                    >
                      {alertConfig.cancelText || "Cancel"}
                    </button>

                    {alertConfig.actionText && (
                      <button
                        onClick={() => {
                          alertConfig.onAction?.();
                          closeAlert();
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-text text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                      >
                        {alertConfig.actionText}
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : (
              /* ======================================================== */
              /* 2. TOP FLOATING TOAST (Slide Down & Fade Animation)      */
              /* ======================================================== */
              <motion.div
                key="toast-box"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 bg-bg-elevated/95 backdrop-blur-md border ${style.border} ${style.glow} text-text px-4 py-3 rounded-2xl shadow-xl w-[calc(100%-2rem)] max-w-md sm:w-auto sm:min-w-[340px]`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {style.smallIcon}
                  <span className="text-xs sm:text-sm font-medium leading-snug break-words">
                    {alertConfig.message}
                  </span>
                </div>

                <button
                  onClick={closeAlert}
                  className="text-text-subtle hover:text-text p-1 rounded-lg hover:bg-surface transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
}

/* Modal Alert စနစ်သစ်မှာ သုံးထားတဲ့ Tailwind CSS Design Architecture နဲ့ Utility Classes တွေကို Step-by-Step အသေးစိတ် ခွဲခြားရှင်းပြပေးထားပါတယ်။

---

### Step 1: Modal Backdrop Overlay (အနောက်ခံ ဝါးဆတ်ဆတ် မှောင်သည့်အလွှာ)

Modal ပေါ်လာချိန်မှာ အနောက်က Screen ကို အာရုံမရောက်အောင် မည်းသွားစေပြီး Blur လုပ်ပေးသည့် Overlay Class ဖြစ်ပါတယ်။

```jsx
className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"

```

* **`fixed inset-0`**: Screen တစ်ခုလုံး (Top, Right, Bottom, Left 0) ကို နေရာယူလိုက်တာဖြစ်ပါတယ်။
* **`z-50`**: Navbar သို့မဟုတ် အခြား Element တွေရဲ့ အပေါ်ဆုံးမှာ ရောက်နေစေဖို့ Z-index မြှင့်ထားတာပါ။
* **`bg-black/70`**: Tailwind ရဲ့ Opacity Modifier ဖြစ်ပြီး အနက်ရောင်ကို 70% Opacity နဲ့ အုပ်လိုက်တာပါ။
* **`backdrop-blur-sm`**: Backdrop Filter သုံးပြီး အနောက်က Content တွေကို သဘာဝကျကျ ဝါး (Blur) သွားစေပါတယ်။
* **`flex items-center justify-center`**: အထဲက Modal Box ကို Screen ရဲ့ **ကွက်တိ အလယ်ခေါင်** ရောက်အောင် Alignment ညှိပေးတာပါ။

---

### Step 2: Center Modal Box Container (အလယ်က Alert Card)

Modal Box ရဲ့ Size, Shape နဲ့ Shadow စနစ်ဖြစ်ပါတယ်။

```jsx
className="bg-bg-elevated border ${style.border} ${style.glow} text-text rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative"

```

* **`max-w-sm w-full`**: Mobile ဖုန်းမှာ မမဲဘဲ Screen အပြည့်နီးပါး ယူမည်ဖြစ်ပြီး Desktop မှာ `384px` ထက် မပိုအောင် ထိန်းထားတာပါ။
* **`rounded-2xl`**: Modern Design Trend အတိုင်း ထောင့်တွေကို ခပ်ဝိုင်းဝိုင်း (`16px`) ပြုလုပ်ထားပါတယ်။
* **`p-6`**: အထဲက Content တွေ ပိတ်မနေရအောင် Padding `24px` ပေးထားပါတယ်။
* **`shadow-2xl`**: Card ကို Screen ထက် အပေါ်ကြွတက်လာသလို မြင်ရအောင် အနက်ရှိုင်းဆုံး Elevation Shadow ထည့်ထားတာပါ။
* **`flex flex-col items-center text-center`**: အထဲက Icon, Title, Text နဲ့ Buttons တွေကို အလယ်တည့်တည့်မှာ တန်းစီပေးထားပါတယ်။

---

### Step 3: Dynamic Glow & Color System ( Warning/Error/Success အလိုက် အရောင်ပြောင်းခြင်း)

Tailwind ရဲ့ **Opacity Modifiers** နဲ့ **Arbitrary Values (`[...]`)** သုံးပြီး Status အလိုက် Neon Glow Effect ထည့်ထားတာပါ။

```javascript
// Warning Dynamic Styles Example
border: "border-amber-500/30",
badgeBg: "bg-amber-500/10 border-amber-500/20",
glow: "shadow-[0_0_25px_rgba(245,158,11,0.15)]",

```

* **`border-amber-500/30`**: Amber အရောင် Border ကို Opacity 30% ပဲ ထားပေးတာကြောင့် Dark Theme နဲ့ ကြည့်ရ အရမ်းရိုးရှင်းပြီး Subtle ဖြစ်သွားပါတယ်။
* **`shadow-[0_0_25px_rgba(...)]`**: Tailwind မှာ မရှိသေးတဲ့ Custom Drop-Shadow ကို Arbitrary Value Syntax `[...]` နဲ့ ရေးပြီး Box ရဲ့ ဘေးပတ်ပတ်လည်မှာ **Glow Effect** ရအောင် ဖန်တီးထားတာဖြစ်ပါတယ်။

---

### Step 4: Icon Badge Structure (အိုင်ကွန် ကွက်)

Icon ကို သီးသန့် အကွက်လေးထဲ ထည့်ပြထားသည့် Styling ဖြစ်ပါတယ်။

```jsx
className="p-3.5 rounded-2xl border ${style.badgeBg} mb-4 flex items-center justify-center"

```

* **`p-3.5`**: Padding `14px` ပေးထားပြီး Icon ဘေးမှာ ညီညီညာညာ အကွာအဝေး ရစေပါတယ်။
* **`rounded-2xl`**: Card ရဲ့ Roundness နဲ့ ပုံစံတူ `16px` Squircle shape လုပ်ထားတာပါ။
* **`border ${style.badgeBg}`**: Status အလိုက် (ဥပမာ Red/Green/Amber) Background မှိန်မှိန်လေးနဲ့ Border ထည့်ပေးထားပါတယ်။

---

### Step 5: Action Buttons (Cancel & Confirm ခလုတ်များ)

ခလုတ် ၂ ခုကို ဘေးချင်းယှဉ်ပြီး တုံ့ပြန်မှုမြန်ဆန်သည့် UI ဖြစ်အောင် ပြင်ဆင်ထားတာပါ။

```jsx
// Button Wrapper
className="flex items-center gap-3 w-full"

// Cancel Button
className="flex-1 py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-surface-2 text-text text-xs sm:text-sm font-semibold transition-all active:scale-95"

// Action Button
className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-text text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"

```

* **`flex-1`**: Cancel နဲ့ Confirm ခလုတ် ၂ ခုလုံးကို Flex grow ညီတူညီမျှ (`50% - 50%`) Width ယူစေတာပါ။
* **`active:scale-95`**: User ခလုတ်ကို နှိပ်လိုက်သည့်အခါ ခလုတ်လေး 5% သေးသွားပြီး တကယ့် Physical Button တစ်ခုကို နှိပ်လိုက်ရသလိုမျိုး **Micro-interaction Feel** ကို ပေးပါတယ်။
* **`shadow-lg shadow-primary/20`**: Confirm Button မှာ Primary Color နဲ့ လိုက်ဖက်သည့် Soft Shadow လေး ပါဝင်သွားအောင် သုံးထားတာဖြစ်ပါတယ်။

---

### Step 6: Responsive Top Toast (ရိုးရိုး မက်ဆေ့ခ်ျပြသည့် Toast အကွက်)

မက်ဆေ့ခ်ျရိုးရိုး ပြသည့်အခါ Screen ပေါ်မှာ လှပစွာ နေရာယူနိုင်အောင် Responsive Width ချိန်ထားတာပါ။

```jsx
className="fixed top-5 left-1/2 -translate-x-1/2 z-50 ... w-[calc(100%-2rem)] max-w-md sm:w-auto sm:min-w-[340px]"

```

* **`left-1/2 -translate-x-1/2`**: `left: 50%` ရွှေ့ပြီး X-axis အတိုင်း `-50%` ပြန်ဆွဲထုတ်ကာ Horizontal Center ကျစေတာပါ။
* **`w-[calc(100%-2rem)]`**: Mobile Screen အသေးတွေမှာ ဘေးဘက် ၂ ဖက်လုံးမှာ `1rem` (16px) စီ အလွတ်ချန်ပြီး အနားမထိအောင် ထိန်းပေးပါတယ်။
* **`sm:w-auto sm:min-w-[340px]`**: Desktop Screen ရောက်သွားရင်တော့ Screen အပြည့်မယူတော့ဘဲ အနည်းဆုံး `340px` ရှိသည့် Toast Box အဖြစ် အလိုအလျောက် ပြောင်းသွားပါမည်။
* 
* 
* 
* 
* 
* 
* 
💡 Framer Motion ရဲ့ အရေးကြီး လုပ်ဆောင်ချက်များ
<AnimatePresence>: React ရဲ့ သဘာဝအရ State က null ဖြစ်သွားချိန်မှာ Component ကို DOM ထဲကနေ ချက်ချင်း ဖြုတ်ပစ်ပါသဖြင့် အနှုတ် (Exit) Animation ပြလို့ မရပါဘူး။ <AnimatePresence> က Exit Animation ပြီးမှ DOM ထဲကနေ ဖျက်ပေးတာပါ။

initial: Component စပေါ်ချိန် အခြေအနေ (ဥပမာ- opacity: 0, scale: 0.95)။

animate: Animation ပြီးသွားချိန် အခြေအနေ (ဥပမာ- opacity: 1, scale: 1)။

exit: Alert ပိတ်လိုက်ချိန် ပျောက်သွားသည့် အခြေအနေ (ဥပမာ- opacity: 0, scale: 0.95)။

ease: [0.16, 1, 0.3, 1]: Apple ရဲ့ iOS UI နီးပါး အိအိလေးနဲ့ သဘာဝကျကျ ရွေ့လျားစေသည့် Custom Spring Easing Curve ဖြစ်ပါတယ်။



*/
