import { motion, useDragControls, AnimatePresence } from 'framer-motion'
import { useUiStore, type AppId } from '@/store/ui-store'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useDevice } from '@/hooks/use-device'

interface DesktopWindowProps {
  appId: AppId
  title: string
  defaultSizeClass: string
  maximizedSizeClass?: string
  children: React.ReactNode
  icon?: React.ReactNode
  customHeaderLeft?: React.ReactNode
  customHeaderRight?: React.ReactNode
  initial?: any
  animate?: any
  exit?: any
}

export function DesktopWindow({
  appId,
  title,
  defaultSizeClass,
  maximizedSizeClass = 'h-full w-full max-w-none rounded-xl',
  children,
  icon,
  customHeaderLeft,
  customHeaderRight,
  initial,
  animate,
  exit,
}: DesktopWindowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const { isMobile } = useDevice()
  const [isHoveringTrafficLights, setIsHoveringTrafficLights] = useState(false)

  const app = useUiStore((state) => state.apps[appId])
  const activeApp = useUiStore((state) => state.activeApp)
  const stackingOrder = useUiStore((state) => state.stackingOrder)

  const focusApp = useUiStore((state) => state.focusApp)
  const closeApp = useUiStore((state) => state.closeApp)
  const minimizeApp = useUiStore((state) => state.minimizeApp)
  const toggleAppMaximize = useUiStore((state) => state.toggleAppMaximize)

  // Only render if open
  if (app.state !== 'open') return null

  const isFocused = activeApp === appId
  const isMaximized = app.isMaximized
  const zIndex = stackingOrder.indexOf(appId) + 10

  const sizeClass = cn(
    isMobile
      ? 'h-full w-full max-w-none rounded-none'
      : isMaximized
        ? maximizedSizeClass
        : defaultSizeClass,
  )

  const frameClass = cn(
    'relative flex flex-col h-full w-full overflow-hidden border bg-background/92 text-foreground transition-shadow duration-200 select-none',
    isMobile 
      ? 'rounded-none border-x-0 border-b-0' 
      : isMaximized
        ? cn(
            'rounded-xl',
            isFocused 
              ? 'shadow-[0_30px_80px_-15px_rgba(0,0,0,0.55),0_0_0_0.5px_rgba(255,255,255,0.15)] border-white/25 dark:border-white/12' 
              : 'shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4),0_0_0_0.5px_rgba(255,255,255,0.15)] border-white/15 dark:border-white/8',
          )
        : cn(
            'rounded-[1.4rem]',
            isFocused 
              ? 'shadow-[0_30px_80px_-15px_rgba(0,0,0,0.55),0_0_0_0.5px_rgba(255,255,255,0.15)] border-white/25 dark:border-white/12' 
              : 'shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4),0_0_0_0.5px_rgba(255,255,255,0.15)] border-white/15 dark:border-white/8',
          ),
  )

  return (
    <motion.div
      ref={ref}
      drag={!isMobile && !isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      initial={initial || { opacity: 0, scale: 0.94 }}
      animate={animate || {
        opacity: 1,
        scale: 1,
        x: isMaximized ? 0 : undefined,
        y: isMaximized ? 0 : undefined,
      }}
      exit={exit || { opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      style={{ zIndex }}
      onPointerDown={() => focusApp(appId)}
      className={cn(
        'pointer-events-auto',
        isMaximized
          ? isMobile
            ? 'fixed inset-x-0 top-[2.75rem] bottom-[5.75rem]'
            : 'fixed inset-x-2 top-[3.8rem] bottom-[8.75rem]'
          : cn('relative max-h-full max-w-full', sizeClass)
      )}
    >
      <div className={frameClass}>
        {/* macOS Titlebar */}
        <div
          className={cn(
            'flex h-12 shrink-0 items-center justify-between border-b border-border/50 px-4 select-none',
            isFocused ? 'bg-vscode-titlebar/85' : 'bg-vscode-titlebar/60',
          )}
          style={{ cursor: isMaximized || isMobile ? 'default' : 'grab' }}
          onPointerDown={(event) => {
            if (!isMobile && !isMaximized) {
              dragControls.start(event)
            }
          }}
          onDoubleClick={() => {
            if (!isMobile) {
              toggleAppMaximize(appId)
            }
          }}
        >
          {/* Traffic Lights & Custom Left items */}
          <div className="flex items-center gap-3" onPointerDown={(e) => e.stopPropagation()}>
            {isMobile ? null : (
              <div
                className="group flex items-center gap-1.5 mr-1"
                onMouseEnter={() => setIsHoveringTrafficLights(true)}
                onMouseLeave={() => setIsHoveringTrafficLights(false)}
              >
                {/* Red – Close */}
                <button
                  type="button"
                  className={cn(
                    "size-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/40 transition-all hover:brightness-90 active:brightness-75 flex items-center justify-center",
                    !isFocused && "bg-[#ff5f57]/40 border-[#e0443e]/20"
                  )}
                  onClick={() => closeApp(appId)}
                  aria-label="Close"
                  title="Close"
                >
                  <AnimatePresence>
                    {isHoveringTrafficLights && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="text-[8px] font-black text-[#4d0000]/70 leading-none pointer-events-none"
                        style={{ fontFamily: 'system-ui' }}
                      >
                        ✕
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Yellow – Minimize */}
                <button
                  type="button"
                  className={cn(
                    "size-3 rounded-full bg-[#febc2e] border border-[#dfa024]/40 transition-all hover:brightness-90 active:brightness-75 flex items-center justify-center",
                    !isFocused && "bg-[#febc2e]/40 border-[#dfa024]/20"
                  )}
                  onClick={() => minimizeApp(appId)}
                  aria-label="Minimize"
                  title="Minimize"
                >
                  <AnimatePresence>
                    {isHoveringTrafficLights && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="text-[8px] font-black text-[#5c3d00]/70 leading-none pointer-events-none"
                        style={{ fontFamily: 'system-ui' }}
                      >
                        −
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Green – Full Screen / Zoom */}
                <button
                  type="button"
                  className={cn(
                    "size-3 rounded-full bg-[#28c840] border border-[#1aab2f]/40 transition-all hover:brightness-90 active:brightness-75 flex items-center justify-center",
                    !isFocused && "bg-[#28c840]/40 border-[#1aab2f]/20"
                  )}
                  onClick={() => toggleAppMaximize(appId)}
                  aria-label={isMaximized ? "Exit Full Screen" : "Enter Full Screen"}
                  title={isMaximized ? "Exit Full Screen" : "Enter Full Screen"}
                >
                  <AnimatePresence>
                    {isHoveringTrafficLights && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="text-[8px] font-black text-[#004d12]/70 leading-none pointer-events-none"
                        style={{ fontFamily: 'system-ui' }}
                      >
                        {isMaximized ? '⊙' : '⤢'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            )}
            {customHeaderLeft}
          </div>

          {/* Window Title */}
          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none gap-2 text-xs font-semibold text-muted-foreground/90">
            {icon && <span className="pointer-events-auto">{icon}</span>}
            <span>{title}</span>
          </div>

          {/* Custom Action Area (Right) */}
          <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
            {customHeaderRight}
          </div>
        </div>

        {/* Window Content */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
