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
          icon: <AlertTriangle size={24} className="text-amber-500 dark:text-amber-400 shrink-0" />,
          smallIcon: (
            <AlertTriangle size={18} className="text-amber-500 dark:text-amber-400 shrink-0" />
          ),
          border: "border-amber-500/30",
          badgeBg: "bg-amber-500/10 border-amber-500/20",
          glow: "shadow-[0_0_25px_rgba(245,158,11,0.15)]",
          actionBtn: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20",
        };
      case "error":
      case "delete":
        return {
          icon: <AlertTriangle size={24} className="text-red-500 dark:text-red-400 shrink-0" />,
          smallIcon: (
            <AlertCircle size={18} className="text-red-500 dark:text-red-400 shrink-0" />
          ),
          border: "border-red-500/30",
          badgeBg: "bg-red-500/10 border-red-500/20",
          glow: "shadow-[0_0_25px_rgba(239,68,68,0.15)]",
          actionBtn: "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20",
        };
      case "info":
        return {
          icon: <Info size={24} className="text-blue-500 dark:text-blue-400 shrink-0" />,
          smallIcon: <Info size={18} className="text-blue-500 dark:text-blue-400 shrink-0" />,
          border: "border-blue-500/30",
          badgeBg: "bg-blue-500/10 border-blue-500/20",
          glow: "shadow-[0_0_25px_rgba(59,130,246,0.15)]",
          actionBtn: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20",
        };
      default:
        return {
          icon: (
            <CheckCircle2 size={24} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
          ),
          smallIcon: (
            <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
          ),
          border: "border-emerald-500/30",
          badgeBg: "bg-emerald-500/10 border-emerald-500/20",
          glow: "shadow-[0_0_25px_rgba(16,185,129,0.15)]",
          actionBtn: "bg-primary hover:bg-primary/90 text-white shadow-primary/20",
        };
    }
  };

  const style = alertConfig ? getTypeStyles(alertConfig.type) : null;

  return (
    <AlertContext.Provider value={showAlert}>
      {children}

      <AnimatePresence>
        {alertConfig && (
          <>
            {alertConfig.isModal ? (
              /* =================Modal Box================= */
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  key="modal-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={closeAlert}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                />

                <motion.div
                  key="modal-box"
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{
                    duration: 0.18,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`bg-bg-elevated border ${style.border} ${style.glow} text-text rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative z-10`}
                >
                  <button
                    onClick={closeAlert}
                    className="absolute top-4 right-4 text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer"
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
                      className="flex-1 py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-surface/80 text-text text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                    >
                      {alertConfig.cancelText || "Cancel"}
                    </button>

                    {alertConfig.actionText && (
                      <button
                        onClick={() => {
                          alertConfig.onAction?.();
                          closeAlert();
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95 cursor-pointer ${style.actionBtn}`}
                      >
                        {alertConfig.actionText}
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : (
              /* =================Top Floating Toast================= */
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
                  className="text-text-subtle hover:text-text p-1 rounded-lg hover:bg-surface transition-colors shrink-0 cursor-pointer"
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