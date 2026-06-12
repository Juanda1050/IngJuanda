import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/store/ui-store";
import { useTranslation } from "react-i18next";
import { Moon, RotateCw, Power, ArrowRight } from "lucide-react";
import { SiApple } from "react-icons/si";
import { cn } from "@/lib/utils";

// ----------------------------------------------------
// 1. BOOT SEQUENCE SCREEN
// ----------------------------------------------------
function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: number;
    const updateProgress = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          onComplete();
          return 100;
        }
        // Increment progress by a random amount to feel like a real boot loader
        const inc = Math.floor(Math.random() * 10) + 3;
        const next = Math.min(prev + inc, 100);

        // Random next step interval
        const nextTime = Math.floor(Math.random() * 200) + 80;
        timer = window.setTimeout(updateProgress, nextTime);
        return next;
      });
    };

    timer = window.setTimeout(updateProgress, 200);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center text-white select-none">
      <div className="flex flex-col items-center gap-14">
        <SiApple 
          className="size-20 text-white fill-current animate-pulse" 
          style={{ animationDuration: "3s" }} 
        />
        <div className="w-52 h-[6px] bg-zinc-800 rounded-full overflow-hidden relative border border-white/5">
          <motion.div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. MAIN SYSTEM OVERLAYS CONTROLLER
// ----------------------------------------------------
export function MacSystemOverlays() {
  const { systemState, setSystemState, setCurrentUser } = useUiStore();
  const { t, i18n } = useTranslation("common");

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [booting, setBooting] = useState(false);

  const isEs = i18n.language !== "en";
  const labels = {
    powerOn: isEs ? "Haz clic en cualquier parte para encender" : "Click anywhere to power on",
    loggingIn: isEs ? "Iniciando sesión..." : "Logging in...",
  };

  // Wake up listener for Sleep state
  useEffect(() => {
    if (systemState !== "sleep") return;

    const wakeUp = () => {
      setSystemState("locked");
    };

    window.addEventListener("keydown", wakeUp);
    window.addEventListener("click", wakeUp);

    return () => {
      window.removeEventListener("keydown", wakeUp);
      window.removeEventListener("click", wakeUp);
    };
  }, [systemState, setSystemState]);

  const handleLoginSubmit = () => {
    setIsLoggingIn(true);
    // Artificially delay login to show the loader, enhancing the UX
    setTimeout(() => {
      setCurrentUser("juan");
      if (typeof window !== "undefined") {
        localStorage.setItem("portfolio_login_completed", "true");
      }
      setSystemState("normal");
      setIsLoggingIn(false);
    }, 600);
  };

  // Global keydown handler to trigger login on Enter keypress
  useEffect(() => {
    if (systemState !== "locked" && systemState !== "logged_out") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isLoggingIn) {
        handleLoginSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [systemState, isLoggingIn]);

  // --------------------------------------------------
  // RENDER SLEEP STATE
  // --------------------------------------------------
  if (systemState === "sleep") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 bg-black z-[99999] flex items-center justify-center cursor-none"
        >
          {/* Pulsing LED Sleep indicator light */}
          <motion.div
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="fixed bottom-6 right-6 size-2 rounded-full bg-white/70 blur-[1px]"
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // --------------------------------------------------
  // RENDER SHUTDOWN STATE
  // --------------------------------------------------
  if (systemState === "shutdown") {
    if (booting) {
      return (
        <BootScreen
          onComplete={() => {
            setBooting(false);
            setSystemState("logged_out");
          }}
        />
      );
    }

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          onClick={() => setBooting(true)}
          className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center text-zinc-600 cursor-pointer select-none"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-4"
          >
            <Power className="size-10" />
            <p className="text-xs font-mono tracking-wider">{labels.powerOn}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // --------------------------------------------------
  // RENDER RESTART STATE
  // --------------------------------------------------
  if (systemState === "restart") {
    return (
      <BootScreen
        onComplete={() => {
          setSystemState("logged_out");
        }}
      />
    );
  }

  // --------------------------------------------------
  // RENDER LOGIN / LOCK SCREEN (LOCKED & LOGGED_OUT)
  // --------------------------------------------------
  if (systemState === "locked" || systemState === "logged_out") {
    const buttonText = systemState === "locked"
      ? (isEs ? "Desbloquear" : "Unlock")
      : (isEs ? "Iniciar sesión" : "Log In");

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] backdrop-blur-3xl saturate-150 bg-black/40 flex flex-col justify-between items-center py-12 px-6 select-none text-white font-sans"
        >
          {/* Top Apple Logo */}
          <div className="pt-6">
            <SiApple className="size-11 text-white/20 fill-current" />
          </div>

          {/* Center User Panel */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center w-full"
            >
              {/* User Portrait */}
              <div className="size-20 rounded-full border border-white/20 shadow-2xl overflow-hidden mb-3.5 bg-white/10 flex items-center justify-center text-white/80">
                <img src="/profile.jpg" alt="Juan Gonzalez" className="size-full object-cover animate-fade-in" />
              </div>

              {/* Username */}
              <h2 className="text-[16px] font-bold text-white mb-4.5 drop-shadow-sm">
                Juan Gonzalez
              </h2>

              {/* Login Button Container */}
              <div className="h-16 w-full flex flex-col items-center justify-start mt-2">
                <button
                  onClick={handleLoginSubmit}
                  disabled={isLoggingIn}
                  className={cn(
                    "px-6 py-2 text-xs font-bold bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 rounded-full text-white backdrop-blur-xl shadow-2xl transition-all tracking-wider uppercase flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-white/45",
                    isLoggingIn && "opacity-60 pointer-events-none"
                  )}
                >
                  {isLoggingIn ? (
                    <div className="flex items-center gap-1.5 justify-center">
                      <svg className="animate-spin size-3.5 text-white/50" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{labels.loggingIn}</span>
                    </div>
                  ) : (
                    <>
                      <span>{buttonText}</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Bottom System Power Controls */}
          <div className="flex items-center gap-10 pb-4">
            {/* Sleep (Reposo) */}
            <button
              onClick={() => setSystemState("sleep")}
              className="flex flex-col items-center gap-2 group text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <div className="size-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center shadow-lg group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-200">
                <Moon className="size-4.5" />
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                {t("toolbar.menus.finder.sleep")}
              </span>
            </button>

            {/* Restart (Reiniciar) */}
            <button
              onClick={() => setSystemState("restart")}
              className="flex flex-col items-center gap-2 group text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <div className="size-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center shadow-lg group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-200">
                <RotateCw className="size-4.5" />
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                {t("toolbar.menus.finder.restart").replace("...", "")}
              </span>
            </button>

            {/* Shut Down (Apagar) */}
            <button
              onClick={() => setSystemState("shutdown")}
              className="flex flex-col items-center gap-2 group text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <div className="size-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center shadow-lg group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-200">
                <Power className="size-4.5" />
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                {t("toolbar.menus.finder.shutDown").replace("...", "")}
              </span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
