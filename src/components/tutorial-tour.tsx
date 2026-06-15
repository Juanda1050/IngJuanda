import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, type MotionStyle } from "framer-motion";
import { useUiStore } from "@/store/ui-store";
import { Button } from "@/shared/ui/button";
import { useDevice } from "@/hooks/use-device";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { formatWithAppleEmojis } from "@/components/apple-emoji-utils";

interface TourStep {
  targetId?: string;
  titleKey: string;
  descKey: string;
  placement: "top" | "bottom" | "left" | "right" | "center";
}

const SYSTEM_TOUR_STEPS: TourStep[] = [
  {
    titleKey: "tutorial.steps.welcome.title",
    descKey: "tutorial.steps.welcome.description",
    placement: "center",
  },
  {
    targetId: "top-bar-search",
    titleKey: "tutorial.steps.spotlight.title",
    descKey: "tutorial.steps.spotlight.description",
    placement: "bottom",
  },
  {
    targetId: "profile-avatar",
    titleKey: "tutorial.steps.profile.title",
    descKey: "tutorial.steps.profile.description",
    placement: "bottom",
  },
  {
    targetId: "mac-dock",
    titleKey: "tutorial.steps.dock.title",
    descKey: "tutorial.steps.dock.description",
    placement: "top",
  },
  {
    targetId: "dock-item-vscode",
    titleKey: "tutorial.steps.dockVscode.title",
    descKey: "tutorial.steps.dockVscode.description",
    placement: "top",
  },
  {
    titleKey: "tutorial.steps.finish.title",
    descKey: "tutorial.steps.finish.description",
    placement: "center",
  },
];

const VSCODE_TOUR_STEPS: TourStep[] = [
  {
    titleKey: "tutorial.steps.vscodeWelcome.title",
    descKey: "tutorial.steps.vscodeWelcome.description",
    placement: "center",
  },
  {
    targetId: "vscode-sidebar",
    titleKey: "tutorial.steps.sidebar.title",
    descKey: "tutorial.steps.sidebar.description",
    placement: "right",
  },
  {
    targetId: "activity-bar-search",
    titleKey: "tutorial.steps.searchSidebar.title",
    descKey: "tutorial.steps.searchSidebar.description",
    placement: "right",
  },
  {
    targetId: "vscode-command-btn",
    titleKey: "tutorial.steps.commandPalette.title",
    descKey: "tutorial.steps.commandPalette.description",
    placement: "bottom",
  },
  {
    targetId: "live-preview-btn",
    titleKey: "tutorial.steps.livePreview.title",
    descKey: "tutorial.steps.livePreview.description",
    placement: "bottom",
  },
  {
    titleKey: "tutorial.steps.vscodeFinish.title",
    descKey: "tutorial.steps.vscodeFinish.description",
    placement: "center",
  },
];

export function TutorialTour() {
  const { t } = useTranslation("common");
  const { isMobile } = useDevice();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState(340);
  const [cardHeight, setCardHeight] = useState(200);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const isTutorialActive = useUiStore((state) => state.isTutorialActive);
  const currentStep = useUiStore((state) => state.currentTutorialStep);
  const activeTutorialType = useUiStore((state) => state.activeTutorialType);
  const setTutorialActive = useUiStore((state) => state.setTutorialActive);
  const setCurrentStep = useUiStore((state) => state.setCurrentTutorialStep);
  const setActiveTutorialType = useUiStore((state) => state.setActiveTutorialType);
  
  const vscodeState = useUiStore((state) => state.apps.vscode.state);
  const systemState = useUiStore((state) => state.systemState);

  const steps = activeTutorialType === "vscode" ? VSCODE_TOUR_STEPS : SYSTEM_TOUR_STEPS;

  // Trigger system tutorial automatically on first load
  useEffect(() => {
    if (systemState !== "normal") return;

    const completed = localStorage.getItem("portfolio_system_tutorial_completed");
    if (completed !== "true") {
      const timer = setTimeout(() => {
        setActiveTutorialType("system");
        setTutorialActive(true);
        setCurrentStep(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [setTutorialActive, setCurrentStep, setActiveTutorialType, systemState]);

  // Trigger vscode tutorial automatically when VS Code opens for the first time
  useEffect(() => {
    if (systemState !== "normal" || isTutorialActive) return;

    if (vscodeState === "open") {
      const completed = localStorage.getItem("portfolio_vscode_tutorial_completed");
      if (completed !== "true") {
        const timer = setTimeout(() => {
          setActiveTutorialType("vscode");
          setTutorialActive(true);
          setCurrentStep(0);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [vscodeState, isTutorialActive, setActiveTutorialType, setTutorialActive, setCurrentStep, systemState]);

  // Close VS Code tutorial if VS Code app is closed
  useEffect(() => {
    if (isTutorialActive && activeTutorialType === "vscode" && vscodeState !== "open") {
      setTutorialActive(false);
      setActiveTutorialType(null);
    }
  }, [vscodeState, isTutorialActive, activeTutorialType, setTutorialActive, setActiveTutorialType]);

  // Track the target element bounding box
  useEffect(() => {
    if (!isTutorialActive) return;

    const updateRect = () => {
      const currentStepObj = steps[currentStep];
      if (currentStepObj?.targetId && !isMobile) {
        const el = document.getElementById(currentStepObj.targetId);
        if (el) {
          setTargetRect(el.getBoundingClientRect());
          return;
        }
      }
      setTargetRect(null);
    };

    updateRect();

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    const observer = new MutationObserver(updateRect);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      observer.disconnect();
    };
  }, [currentStep, isTutorialActive, isMobile, steps]);

  // Adjust recorded card width and height for clamping calculations
  useLayoutEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.offsetWidth);
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [currentStep, isTutorialActive]);

  // Handle step actions
  const handleSkip = useCallback(() => {
    if (activeTutorialType === "system") {
      localStorage.setItem("portfolio_system_tutorial_completed", "true");
    } else if (activeTutorialType === "vscode") {
      localStorage.setItem("portfolio_vscode_tutorial_completed", "true");
    }
    setTutorialActive(false);
    setActiveTutorialType(null);
  }, [activeTutorialType, setTutorialActive, setActiveTutorialType]);

  const handleComplete = useCallback(() => {
    if (activeTutorialType === "system") {
      localStorage.setItem("portfolio_system_tutorial_completed", "true");
    } else if (activeTutorialType === "vscode") {
      localStorage.setItem("portfolio_vscode_tutorial_completed", "true");
    }
    setTutorialActive(false);
    setActiveTutorialType(null);
  }, [activeTutorialType, setTutorialActive, setActiveTutorialType]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, steps.length, setCurrentStep, handleComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  // Keyboard navigation
  useEffect(() => {
    if (!isTutorialActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
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
  }, [isTutorialActive, handleSkip, handleNext, handleBack]);

  if (!isTutorialActive || systemState !== "normal") return null;

  const currentStepObj = steps[currentStep]!;
  const padding = 8;

  // Mask dimensions
  const maskX = targetRect ? targetRect.left - padding : window.innerWidth / 2;
  const maskY = targetRect ? targetRect.top - padding : window.innerHeight / 2;
  const maskW = targetRect ? targetRect.width + padding * 2 : 0;
  const maskH = targetRect ? targetRect.height + padding * 2 : 0;
  const maskRx = 12;

  // Calculate card position styles
  const getCardStyle = (): React.CSSProperties => {
    if (isMobile) {
      return {
        position: "fixed",
        left: "16px",
        right: "16px",
        bottom: "24px",
        zIndex: 100000,
      };
    }

    if (!targetRect) {
      return {
        position: "fixed",
        left: `${window.innerWidth / 2 - cardWidth / 2}px`,
        top: `${window.innerHeight / 2 - cardHeight / 2}px`,
        zIndex: 100000,
      };
    }

    const spacing = 16;
    const placement = currentStepObj.placement;

    let left = 0;
    let top = 0;

    if (placement === "bottom") {
      const targetCenterX = targetRect.left + targetRect.width / 2;
      left = targetCenterX - cardWidth / 2;
      top = targetRect.bottom + spacing;
    } else if (placement === "top") {
      const targetCenterX = targetRect.left + targetRect.width / 2;
      left = targetCenterX - cardWidth / 2;
      top = targetRect.top - cardHeight - spacing;
    } else if (placement === "left") {
      left = targetRect.left - cardWidth - spacing;
      top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
    } else if (placement === "right") {
      left = targetRect.right + spacing;
      top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
    }

    // Clamp coordinates to stay completely on screen with a margin of 16px
    const clampedLeft = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));
    const clampedTop = Math.max(16, Math.min(window.innerHeight - cardHeight - 16, top));

    return {
      position: "fixed",
      left: `${clampedLeft}px`,
      top: `${clampedTop}px`,
      zIndex: 100000,
    };
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden select-none" style={{ fontFamily: "system-ui, -apple-system, 'Apple Color Emoji', sans-serif" }}>
      {/* SVG Dark Backdrop Mask */}
      <svg className="absolute inset-0 size-full pointer-events-none">
        <defs>
          <mask id="tutorial-mask-cutout">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.rect
              animate={{
                x: maskX,
                y: maskY,
                width: maskW,
                height: maskH,
                rx: maskRx,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.65)"
          mask="url(#tutorial-mask-cutout)"
          className="pointer-events-auto cursor-default"
        />
      </svg>

      {/* Floating Tour Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          ref={cardRef}
          style={getCardStyle() as MotionStyle}
          initial={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : 10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-[380px] max-w-full rounded-2xl border border-white/20 dark:border-white/10 bg-[#fbfbfb]/85 dark:bg-[#1c1c1e]/85 backdrop-blur-2xl p-5 shadow-2xl transition-shadow duration-300 text-foreground"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-3.5" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("tutorial.steps.welcome.title") !== "tutorial.steps.welcome.title"
                  ? `${currentStep + 1} / ${steps.length}`
                  : `Paso ${currentStep + 1} de ${steps.length}`}
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="rounded-full p-1 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Cerrar tutorial"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Card Body */}
          <div className="space-y-2 mb-5">
            <h3 className="text-[16px] font-bold tracking-tight text-foreground">
              {formatWithAppleEmojis(t(currentStepObj.titleKey))}
            </h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground dark:text-foreground/80">
              {formatWithAppleEmojis(t(currentStepObj.descKey))}
            </p>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between">
            {/* Progress Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`size-1.5 rounded-full transition-all duration-200 ${
                    idx === currentStep
                      ? "bg-primary w-3.5"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Ir al paso ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              {currentStep < steps.length - 1 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-xs h-8 text-muted-foreground hover:text-foreground"
                >
                  {t("tutorial.skip")}
                </Button>
              ) : null}

              {currentStep > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="text-xs h-8 rounded-lg px-2.5 flex items-center gap-1 border-black/10 dark:border-white/10"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>{t("tutorial.back")}</span>
                </Button>
              ) : null}

              <Button
                variant="default"
                size="sm"
                onClick={handleNext}
                className="text-xs h-8 rounded-lg px-3 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all font-medium"
              >
                <span>
                  {currentStep === steps.length - 1
                    ? t("tutorial.finish")
                    : t("tutorial.next")}
                </span>
                {currentStep < steps.length - 1 && (
                  <ChevronRight className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
