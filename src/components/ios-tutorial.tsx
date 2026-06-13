import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { useUiStore } from "@/store/ui-store";

interface TourStep {
  targetId?: string;
  title: string;
  description: string;
  placement: "top" | "bottom" | "center";
}

export function IosTutorial({
  activeApp,
  setActiveApp,
}: {
  activeApp: string | null;
  setActiveApp?: (app: string | null) => void;
}) {
  const { t } = useTranslation("common");
  const isMobileTutorialActive = useUiStore(
    (state) => state.isMobileTutorialActive,
  );
  const setMobileTutorialActive = useUiStore(
    (state) => state.setMobileTutorialActive,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: TourStep[] = [
    {
      title: t("tutorial.mobile.step1.title", "Welcome to iPhone UI 📱"),
      description: t(
        "tutorial.mobile.step1.desc",
        "This is a mobile-optimized view of the portfolio. Let's do a quick tour!",
      ),
      placement: "center",
    },
    {
      targetId: "ios-status-bar",
      title: t("tutorial.mobile.statusbar.title", "Status Bar 🔋"),
      description: t(
        "tutorial.mobile.statusbar.desc",
        "Shows the current time, Wi-Fi status, and battery percentage.",
      ),
      placement: "bottom",
    },
    {
      targetId: "ios-home-indicator",
      title: t("tutorial.mobile.home.title", "Home Indicator 🏠"),
      description: t(
        "tutorial.mobile.home.desc",
        "When inside any app, swipe this bar up or tap it to close the app and return to the home screen. Try it now!",
      ),
      placement: "top",
    },
    {
      targetId: "ios-app-grid",
      title: t("tutorial.mobile.apps.title", "Juanda's Applications 📁"),
      description: t(
        "tutorial.mobile.apps.desc",
        "Tap any icon here to open apps like Notes or Calendar.",
      ),
      placement: "bottom",
    },
    {
      targetId: "ios-dock",
      title: t("tutorial.mobile.dock.title", "App Dock 📥"),
      description: t(
        "tutorial.mobile.dock.desc",
        "Quick access to Phone, Safari, Messages, and Mail.",
      ),
      placement: "top",
    },
    {
      targetId: "ios-app-settings",
      title: t("tutorial.mobile.step2.title", "Settings App ⚙️"),
      description: t(
        "tutorial.mobile.step2.desc",
        "Open Settings to change the language or toggle dark/light themes.",
      ),
      placement: "bottom",
    },
    {
      title: t("tutorial.mobile.finishStep.title", "All Set! 🎉"),
      description: t(
        "tutorial.mobile.finishStep.desc",
        "You are ready to explore. Have fun clicking around the iOS interface!",
      ),
      placement: "center",
    },
  ];

  useEffect(() => {
    if (localStorage.getItem("mobile-tutorial-seen") === "true") return;
    const timer = setTimeout(() => {
      setMobileTutorialActive(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [setMobileTutorialActive]);

  useEffect(() => {
    if (isMobileTutorialActive) {
      setIsVisible(true);
      setStep(0);
    } else {
      setIsVisible(false);
    }
  }, [isMobileTutorialActive]);

  // Reset rect immediately on step change so the mask collapses instead of
  // spring-travelling across the screen to the new element position
  useEffect(() => {
    setTargetRect(null);
  }, [step]);

  // Continuously track the target element bounding box via rAF loop so the
  // SVG mask and hit-area stay perfectly aligned during Framer Motion animations.
  //
  // WHY no z-index elevation:
  //   Elements with backdrop-filter, transform, or opacity < 1 in ancestor
  //   elements create isolated stacking contexts — their children cannot
  //   escape via z-index regardless of the value used. The clip-path on
  //   the overlay itself (+ a hit-area div on top) is the only reliable fix.
  useEffect(() => {
    if (!isVisible) return;

    const targetId = steps[step]?.targetId;
    let rafId: number;
    let alive = true;

    const poll = () => {
      if (!alive) return;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          setTargetRect(el.getBoundingClientRect());
        }
      }
      rafId = requestAnimationFrame(poll);
    };

    rafId = requestAnimationFrame(poll);

    const handleResize = () => {
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) setTargetRect(el.getBoundingClientRect());
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [step, isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    setMobileTutorialActive(false);
    localStorage.setItem("mobile-tutorial-seen", "true");
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleDismiss();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (steps[step]?.targetId !== "ios-home-indicator") {
          handleNext();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, step]);

  const prevStepRef = useRef<number>(step);
  // Tracks whether the current null-activeApp originated from the user's
  // own swipe/tap (real close) vs. from the step-sync effect below.
  const stepSyncedRef = useRef<boolean>(false);

  // Sync activeApp state based on the current tutorial step to ensure context is correct
  useEffect(() => {
    if (!isVisible || !setActiveApp) return;

    const prevStep = prevStepRef.current;
    prevStepRef.current = step;

    if (step === prevStep) return;

    if (step === 2) {
      // Home Indicator step — dashboard must be open so the user can close it.
      stepSyncedRef.current = false;
      setActiveApp("dashboard");
    } else if (step === 3 || step === 4 || step === 5 || step === 6) {
      // All other steps after step 2: close any open app programmatically.
      // Guard prevents the auto-advance from firing on this programmatic null.
      stepSyncedRef.current = true;
      setActiveApp(null);
    }
  }, [step, isVisible, setActiveApp]);

  // Auto-advance step when the user genuinely closes the app via the home indicator.
  // Guard: skip if the null was caused by step-sync (stepSyncedRef.current === true).
  useEffect(() => {
    if (
      isVisible &&
      steps[step]?.targetId === "ios-home-indicator" &&
      activeApp === null &&
      !stepSyncedRef.current
    ) {
      handleNext();
    }
    // Reset the guard after each activeApp change so future real closes work.
    if (activeApp !== null) {
      stepSyncedRef.current = false;
    }
  }, [activeApp, isVisible, step]);

  if (!isVisible) return null;

  const currentStepObj = steps[step]!;
  const padding = 6;

  // Mask dimensions
  const maskX = targetRect ? targetRect.left - padding : window.innerWidth / 2;
  const maskY = targetRect ? targetRect.top - padding : window.innerHeight / 2;
  const maskW = targetRect ? targetRect.width + padding * 2 : 0;
  const maskH = targetRect ? targetRect.height + padding * 2 : 0;
  const maskRx = 16;

  // Card placement on mobile — position card away from the highlighted element
  const getCardStyle = (): React.CSSProperties => {
    if (!currentStepObj.targetId || !targetRect) {
      // Center steps (welcome / finish): place near vertical center
      return {
        position: "fixed",
        left: "16px",
        right: "16px",
        top: "30%",
        zIndex: 100000,
      };
    }

    const screenMidY = window.innerHeight / 2;
    const elementCenterY = targetRect.top + targetRect.height / 2;

    if (elementCenterY < screenMidY) {
      // Element is in the upper half → card goes to bottom
      return {
        position: "fixed",
        left: "16px",
        right: "16px",
        bottom: "34px",
        zIndex: 100000,
      };
    } else {
      // Element is in the lower half → card goes to top (below status bar)
      return {
        position: "fixed",
        left: "16px",
        right: "16px",
        top: "64px",
        zIndex: 100000,
      };
    }
  };

  const DARK = "rgba(0,0,0,0.65)" as const;
  const hasTarget = !!targetRect && !!currentStepObj.targetId;

  return (
    <div className="fixed inset-0 z-[99999] select-none pointer-events-none">
      {/* ── 4-panel spotlight backdrop ── */}
      {!hasTarget ? (
        /* Full-screen dark for center steps (welcome / finish) */
        <div
          className="absolute inset-0 pointer-events-auto cursor-default"
          style={{ background: DARK }}
        />
      ) : (
        <>
          {/* Top panel — above the target */}
          <div
            className="pointer-events-auto cursor-default"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: Math.max(0, maskY),
              background: DARK,
            }}
          />
          {/* Bottom panel — below the target */}
          <div
            className="pointer-events-auto cursor-default"
            style={{
              position: "fixed",
              top: maskY + maskH,
              left: 0,
              right: 0,
              bottom: 0,
              background: DARK,
            }}
          />
          {/* Left panel — left of the target */}
          <div
            className="pointer-events-auto cursor-default"
            style={{
              position: "fixed",
              top: maskY,
              left: 0,
              width: Math.max(0, maskX),
              height: maskH,
              background: DARK,
            }}
          />
          {/* Right panel — right of the target */}
          <div
            className="pointer-events-auto cursor-default"
            style={{
              position: "fixed",
              top: maskY,
              left: maskX + maskW,
              right: 0,
              height: maskH,
              background: DARK,
            }}
          />
        </>
      )}

      {hasTarget && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: maskY,
            left: maskX,
            width: maskW,
            height: maskH,
            borderRadius: maskRx,
            zIndex: 100001,
            pointerEvents: "auto",
            cursor: "pointer",
          }}
          onClick={() => {
            const el = document.getElementById(currentStepObj.targetId!);
            el?.click();
          }}
        />
      )}

      {/* Floating Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          style={getCardStyle() as any}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="rounded-2xl border border-white/20 dark:border-white/10 bg-[#1c1c1e]/90 backdrop-blur-2xl p-5 shadow-2xl text-white pointer-events-auto max-w-md mx-auto"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="flex w-6 h-6 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                {t("tutorial.stepCount", {
                  current: step + 1,
                  total: steps.length,
                }) !== `tutorial.stepCount`
                  ? t("tutorial.stepCount", {
                      current: step + 1,
                      total: steps.length,
                    })
                  : `Step ${step + 1} of ${steps.length}`}
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close tutorial"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Body */}
          <div className="space-y-1.5 mb-5">
            <h3 className="text-base font-bold tracking-tight text-white">
              {currentStepObj.title}
            </h3>
            <p className="text-xs leading-relaxed text-white/80">
              {currentStepObj.description}
            </p>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between">
            {/* Progress Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (
                      steps[step]?.targetId !== "ios-home-indicator" ||
                      idx < step
                    ) {
                      setStep(idx);
                    }
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    idx === step
                      ? "bg-blue-500 w-3.5"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {steps[step]?.targetId === "ios-home-indicator" ? (
                <>
                  <span className="text-[11px] text-blue-400 font-bold animate-pulse px-1 select-none shrink-0">
                    {t(
                      "tutorial.mobile.home.actionPrompt",
                      "Swipe up or tap the bar to close",
                    )}
                  </span>
                  {step > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBack();
                      }}
                      className="text-xs rounded-lg px-2.5 py-1.5 flex items-center gap-1 border border-white/10 hover:bg-white/5 font-medium transition-colors shrink-0"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{t("tutorial.back", "Back")}</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  {step < steps.length - 1 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                      }}
                      className="text-xs text-white/60 hover:text-white font-medium px-2 py-1 shrink-0"
                    >
                      {t("tutorial.skip", "Skip")}
                    </button>
                  ) : null}

                  {step > 0 && step !== 3 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBack();
                      }}
                      className="text-xs rounded-lg px-2.5 py-1.5 flex items-center gap-1 border border-white/10 hover:bg-white/5 font-medium transition-colors shrink-0"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{t("tutorial.back", "Back")}</span>
                    </button>
                  ) : null}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="text-xs rounded-lg px-3 py-1.5 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all font-semibold shadow-md shrink-0"
                  >
                    <span>
                      {step === steps.length - 1
                        ? t("tutorial.finish", "Got it")
                        : t("tutorial.next", "Next")}
                    </span>
                    {step < steps.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
