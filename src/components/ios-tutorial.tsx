import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { useUiStore } from '@/store/ui-store'

interface TourStep {
  targetId?: string
  title: string
  description: string
  placement: 'top' | 'bottom' | 'center'
}

export function IosTutorial() {
  const { t } = useTranslation('common')
  const isMobileTutorialActive = useUiStore((state) => state.isMobileTutorialActive)
  const setMobileTutorialActive = useUiStore((state) => state.setMobileTutorialActive)
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  const steps: TourStep[] = [
    {
      title: t('tutorial.mobile.step1.title', 'Welcome to iPhone UI 📱'),
      description: t('tutorial.mobile.step1.desc', 'This is a mobile-optimized view of the portfolio. Let\'s do a quick tour!'),
      placement: "center"
    },
    {
      targetId: "ios-status-bar",
      title: t('tutorial.mobile.statusbar.title', 'Status Bar 🔋'),
      description: t('tutorial.mobile.statusbar.desc', 'Shows the current time, Wi-Fi status, and battery percentage.'),
      placement: "bottom"
    },
    {
      targetId: "ios-app-grid",
      title: t('tutorial.mobile.apps.title', 'Applications Grid 📁'),
      description: t('tutorial.mobile.apps.desc', 'Tap any icon here to open apps like Notes or Calendar.'),
      placement: "bottom"
    },
    {
      targetId: "ios-app-settings",
      title: t('tutorial.mobile.step2.title', 'Settings App ⚙️'),
      description: t('tutorial.mobile.step2.desc', 'Open Settings to change the language or toggle dark/light themes.'),
      placement: "bottom"
    },
    {
      targetId: "ios-dock",
      title: t('tutorial.mobile.dock.title', 'App Dock 📥'),
      description: t('tutorial.mobile.dock.desc', 'Quick access to Phone, Safari, Messages, and Mail.'),
      placement: "top"
    },
    {
      targetId: "ios-home-indicator",
      title: t('tutorial.mobile.home.title', 'Home Indicator 🏠'),
      description: t('tutorial.mobile.home.desc', 'When inside any app, tap this bottom bar to return to the home screen.'),
      placement: "top"
    },
    {
      title: t('tutorial.mobile.finishStep.title', 'All Set! 🎉'),
      description: t('tutorial.mobile.finishStep.desc', 'You are ready to explore. Have fun clicking around the iOS interface!'),
      placement: "center"
    }
  ]

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('mobile-tutorial-seen')
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => {
        setMobileTutorialActive(true)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [setMobileTutorialActive])

  useEffect(() => {
    if (isMobileTutorialActive) {
      setIsVisible(true)
      setStep(0)
    } else {
      setIsVisible(false)
    }
  }, [isMobileTutorialActive])

  // Track the target element bounding box
  useEffect(() => {
    if (!isVisible) return

    const updateRect = () => {
      const currentStepObj = steps[step]
      if (currentStepObj?.targetId) {
        const el = document.getElementById(currentStepObj.targetId)
        if (el) {
          setTargetRect(el.getBoundingClientRect())
          return
        }
      }
      setTargetRect(null)
    }

    updateRect()

    window.addEventListener("resize", updateRect)
    const observer = new MutationObserver(updateRect)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("resize", updateRect)
      observer.disconnect()
    }
  }, [step, isVisible])

  const handleDismiss = () => {
    setIsVisible(false)
    setMobileTutorialActive(false)
    localStorage.setItem('mobile-tutorial-seen', 'true')
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleDismiss()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss()
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault()
        handleNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        handleBack()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isVisible, step])

  if (!isVisible) return null

  const currentStepObj = steps[step]!
  const padding = 6

  // Mask dimensions
  const maskX = targetRect ? targetRect.left - padding : window.innerWidth / 2
  const maskY = targetRect ? targetRect.top - padding : window.innerHeight / 2
  const maskW = targetRect ? targetRect.width + padding * 2 : 0
  const maskH = targetRect ? targetRect.height + padding * 2 : 0
  const maskRx = 16

  // Card placement on mobile
  const getCardStyle = (): React.CSSProperties => {
    const isDockHighlighted = currentStepObj.targetId === 'ios-dock' || currentStepObj.targetId === 'ios-home-indicator'
    return {
      position: "fixed",
      left: "16px",
      right: "16px",
      bottom: isDockHighlighted ? "auto" : "24px",
      top: isDockHighlighted ? "80px" : "auto",
      zIndex: 100000,
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden select-none pointer-events-none">
      {/* SVG Dark Backdrop Mask */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="ios-tutorial-mask">
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
          mask="url(#ios-tutorial-mask)"
          className="pointer-events-auto cursor-default"
        />
      </svg>

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
                {t('tutorial.stepCount', { current: step + 1, total: steps.length }) !== `tutorial.stepCount`
                  ? t('tutorial.stepCount', { current: step + 1, total: steps.length })
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
                  onClick={() => setStep(idx)}
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
            <div className="flex items-center gap-2">
              {step < steps.length - 1 ? (
                <button
                  onClick={handleDismiss}
                  className="text-xs text-white/60 hover:text-white font-medium px-2 py-1"
                >
                  {t('tutorial.skip', 'Skip')}
                </button>
              ) : null}

              {step > 0 ? (
                <button
                  onClick={handleBack}
                  className="text-xs rounded-lg px-2.5 py-1.5 flex items-center gap-1 border border-white/10 hover:bg-white/5 font-medium transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{t('tutorial.back', 'Back')}</span>
                </button>
              ) : null}

              <button
                onClick={handleNext}
                className="text-xs rounded-lg px-3 py-1.5 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all font-semibold shadow-md"
              >
                <span>
                  {step === steps.length - 1
                    ? t('tutorial.finish', 'Got it')
                    : t('tutorial.next', 'Next')}
                </span>
                {step < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
