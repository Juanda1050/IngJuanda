import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, type MotionStyle } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { useUiStore } from "@/store/ui-store";
import { type AppType } from "../hooks/use-ipados-layout";
import { formatWithAppleEmojis } from "@/components/apple-emoji-utils";

interface TourStep {
  targetId?: string;
  title: string;
  description: string;
  placement: "top" | "bottom" | "center";
}

export function IpadosTutorial({
  setActiveApp,
}: {
  setActiveApp?: (app: AppType) => void;
}) {
  const { t } = useTranslation("common");
  const isMobileTutorialActive = useUiStore(
    (state) => state.isMobileTutorialActive,
  );
  const setMobileTutorialActive = useUiStore(
    (state) => state.setMobileTutorialActive,
  );
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isRestart, setIsRestart] = useState<boolean>(false);

  // Synchronously adjust step, targetRect and isRestart during render when active state changes
  const [prevMobileTutorialActive, setPrevMobileTutorialActive] = useState(isMobileTutorialActive);
  if (isMobileTutorialActive !== prevMobileTutorialActive) {
    setPrevMobileTutorialActive(isMobileTutorialActive);
    if (isMobileTutorialActive) {
      setStep(0);
      setTargetRect(null);
      setIsRestart(localStorage.getItem("ipad-tutorial-seen") === "true");
    }
  }

  // Reset rect immediately on step change so the mask collapses instead of
  // spring-travelling across the screen to the new element position
  const [prevStep, setPrevStep] = useState(step);
  if (step !== prevStep) {
    setPrevStep(step);
    setTargetRect(null);
  }

  const steps: TourStep[] = useMemo(() => [
    {
      title: t("tutorial.ipad.step1.title", "Welcome to iPadOS UI 📱"),
      description: t(
        "tutorial.ipad.step1.desc",
        "This is a tablet-optimized view of the portfolio. Let's do a quick tour!",
      ),
      placement: "center",
    },
    {
      targetId: "ipados-status-bar",
      title: t("tutorial.ipad.statusbar.title", "Status Bar 🔋"),
      description: t(
        "tutorial.ipad.statusbar.desc",
        "Provides local time, date details, Wi-Fi connection, and real-time battery charge indicators at the top.",
      ),
      placement: "bottom",
    },
    {
      targetId: "ipados-home-indicator",
      title: t("tutorial.ipad.home.title", "Home Indicator 🏠"),
      description: t(
        "tutorial.ipad.home.desc",
        "Provides a universal home gesture. Swipe this bar up or tap it from within any app to return to the home screen.",
      ),
      placement: "top",
    },
    {
      targetId: "ipados-app-grid",
      title: t("tutorial.ipad.apps.title", "Spaced Application Grid 📁"),
      description: t(
        "tutorial.ipad.apps.desc",
        "Organized grid for quick access to system applications such as Calendar or Notes.",
      ),
      placement: "bottom",
    },
    {
      targetId: "ipados-dock",
      title: t("tutorial.ipad.dock.title", "Centered Wide Dock 📥"),
      description: t(
        "tutorial.ipad.dock.desc",
        "Wider, floating centered dock containing shortcut applications for communication, web, and mail.",
      ),
      placement: "top",
    },
    {
      targetId: "ipados-app-settings",
      title: t("tutorial.ipad.step2.title", "Settings Panel ⚙️"),
      description: t(
        "tutorial.ipad.step2.desc",
        "Open Settings to change system languages, or customize UI brightness and dark theme values.",
      ),
      placement: "bottom",
    },
    {
      title: t("tutorial.ipad.finishStep.title", "iPadOS Ready! 🎉"),
      description: t(
        "tutorial.ipad.finishStep.desc",
        "You are fully set to navigate and inspect the tablet dashboard environment. Enjoy exploring!",
      ),
      placement: "center",
    },
  ], [t]);

  useEffect(() => {
    if (localStorage.getItem("ipad-tutorial-seen") === "true") return;
    const timer = setTimeout(() => {
      setMobileTutorialActive(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [setMobileTutorialActive]);

  // Spotlight tracking and timing effects below

  useEffect(() => {
    if (!isMobileTutorialActive) return;

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
  }, [step, isMobileTutorialActive, steps]);

  const handleDismiss = useCallback(() => {
    setMobileTutorialActive(false);
    localStorage.setItem("ipad-tutorial-seen", "true");
  }, [setMobileTutorialActive]);

  const handleNext = useCallback(() => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleDismiss();
    }
  }, [step, steps.length, handleDismiss]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep(step - 1);
    }
  }, [step]);

  // Keyboard navigation
  useEffect(() => {
    if (!isMobileTutorialActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileTutorialActive, handleDismiss, handleNext, handleBack]);

  const prevStepRef = useRef<number>(step);
  const stepSyncedRef = useRef<boolean>(false);
  // Sync activeApp layout based on tutorial step
  useEffect(() => {
    if (!isMobileTutorialActive || !setActiveApp || isRestart) return;

    const prevStep = prevStepRef.current;
    prevStepRef.current = step;

    if (step === prevStep) return;

    if (step === 2 || step === 3 || step === 4 || step === 5 || step === 6) {
      // Close open apps programmatically for other steps
      stepSyncedRef.current = true;
      setActiveApp(null);
    }
  }, [step, isMobileTutorialActive, setActiveApp, isRestart]);

  if (!isMobileTutorialActive) return null;

  const currentStepObj = steps[step]!;
  const padding = 8;

  // Mask cutout coordinates
  const maskX = targetRect ? targetRect.left - padding : window.innerWidth / 2;
  const maskY = targetRect ? targetRect.top - padding : window.innerHeight / 2;
  const maskW = targetRect ? targetRect.width + padding * 2 : 0;
  const maskH = targetRect ? targetRect.height + padding * 2 : 0;
  const maskRx = 16;

  const getCardStyle = (): React.CSSProperties => {
    if (!currentStepObj.targetId || !targetRect) {
      return {
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
        height: "fit-content",
        zIndex: 100000,
      };
    }

    const screenMidY = window.innerHeight / 2;
    const elementCenterY = targetRect.top + targetRect.height / 2;

    if (elementCenterY < screenMidY) {
      return {
        position: "fixed",
        left: 0,
        right: 0,
        margin: "0 auto",
        bottom: "40px",
        zIndex: 100000,
      };
    } else {
      return {
        position: "fixed",
        left: 0,
        right: 0,
        margin: "0 auto",
        top: "70px",
        zIndex: 100000,
      };
    }
  };

  const DARK = "rgba(0,0,0,0.7)" as const;
  const hasTarget = !!targetRect && !!currentStepObj.targetId;

  return (
    <div className="fixed inset-0 z-[99999] select-none pointer-events-none font-sans" style={{ fontFamily: "system-ui, -apple-system, 'Apple Color Emoji', sans-serif" }}>
      {/* 4-panel spotlight background overlay */}
      {!hasTarget ? (
        <div
          className="absolute inset-0 pointer-events-auto cursor-default"
          style={{ background: DARK }}
        />
      ) : (
        <>
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
            pointerEvents: isRestart && step === 2 ? "none" : "auto",
            cursor: isRestart && step === 2 ? "default" : "pointer",
          }}
          onClick={() => {
            if (isRestart && step === 2) return;
            const el = document.getElementById(currentStepObj.targetId!);
            el?.click();
          }}
        />
      )}

      {/* Floating Spotlight Info Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          style={getCardStyle() as MotionStyle}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-[90%] max-w-md rounded-2xl border border-white/10 bg-[#1c1c1e]/90 backdrop-blur-2xl p-5 shadow-2xl text-white pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="flex w-6 h-6 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                Step {step + 1} of {steps.length}
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

          {/* Body */}
          <div className="space-y-1.5 mb-5">
            <h3 className="text-base font-bold tracking-tight text-white">
              {formatWithAppleEmojis(currentStepObj.title)}
            </h3>
            <p className="text-xs leading-relaxed text-white/80">
              {formatWithAppleEmojis(currentStepObj.description)}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Indicators */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setStep(idx);
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

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {step < steps.length - 1 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                  }}
                  className="text-xs text-white/60 hover:text-white font-medium px-2 py-1 shrink-0"
                >
                  Skip
                </button>
              ) : null}

              {step > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBack();
                  }}
                  className="text-xs rounded-lg px-2.5 py-1.5 flex items-center gap-1 border border-white/10 hover:bg-white/5 font-medium transition-colors shrink-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : null}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="text-xs rounded-lg px-3 py-1.5 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all font-semibold shadow-md shrink-0"
              >
                <span>{step === steps.length - 1 ? "Got it" : "Next"}</span>
                {step < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
