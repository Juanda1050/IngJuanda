import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import {
  BatteryFull,
  CalendarDays,
  Command,
  Compass,
  FileCode2,
  Folder,
  GitBranch,
  Mail,
  Menu,
  MessageCircle,
  NotebookText,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  SlidersHorizontal,
  Smile,
  Terminal,
  TerminalSquare,
  Wifi,
  X,
} from 'lucide-react'
import { SiApple } from 'react-icons/si'
import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CommandPalette } from '@/components/command-palette'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { EditorContent } from '@/features/portfolio/components/editor-content'
import { portfolioFiles } from '@/features/portfolio/data/portfolio-data'
import { useDevice } from '@/hooks/use-device'
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui'
import { useUiStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'
import { type SectionId } from '@/types/portfolio'

function SidebarContent({ onPick, compact = false }: { onPick?: () => void; compact?: boolean }) {
  const { t } = useTranslation('common')
  const activeFile = useUiStore((state) => state.activeFile)
  const setActiveFile = useUiStore((state) => state.setActiveFile)

  return (
    <Card className="h-full rounded-none border-0 border-r border-border/70 bg-vscode-sidebar/90 shadow-none backdrop-blur-xl">
      <CardContent className={cn('h-full p-3', compact && 'p-2')}>
        <p className="mb-2 px-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{t('app.explorer')}</p>
        <ScrollArea className="h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)]">
          <div className="space-y-1">
            {portfolioFiles.map((file) => {
              const Icon = file.icon
              const isActive = activeFile === file.id
              return (
                <Button
                  key={file.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2.5 rounded-lg px-2.5 font-mono text-xs',
                    isActive && 'bg-primary/15 text-primary hover:bg-primary/20',
                  )}
                  onClick={() => {
                    setActiveFile(file.id)
                    onPick?.()
                  }}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{t(file.key)}</span>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function MobileSidebarSheet() {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0" aria-label={t('app.explorer')}>
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[86vw] max-w-[22rem] border-r border-border/70 p-0 pt-[max(0.75rem,env(safe-area-inset-top))]"
      >
        <SidebarContent onPick={() => setOpen(false)} compact />
      </SheetContent>
    </Sheet>
  )
}

function MacMenuBar() {
  const [now, setNow] = useState(() => new Date())
  const clockIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000
    const timeoutId = window.setTimeout(() => {
      tick()
      clockIntervalRef.current = window.setInterval(tick, 60000)
    }, msUntilNextMinute)

    return () => {
      window.clearTimeout(timeoutId)
      if (clockIntervalRef.current) {
        window.clearInterval(clockIntervalRef.current)
      }
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/20 px-4 py-1.5 backdrop-blur-2xl dark:border-black/20 dark:bg-black/25"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 text-sm">
        <div className="flex min-w-0 items-center gap-3 text-[13px]">
          <SiApple className="size-3.5" />
          <div className="hidden items-center gap-3 sm:flex">
            <span className="font-medium">Finder</span>
            {['File', 'Edit', 'View', 'Window', 'Help'].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-md px-1.5 text-foreground/80 transition-colors hover:bg-white/15 dark:hover:bg-white/10"
                aria-label={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-0.5 text-foreground/85">
          <div className="flex items-center gap-0.5 rounded-lg bg-white/10 px-1 dark:bg-white/5">
            {[Wifi, BatteryFull, Search, SlidersHorizontal].map((Icon) => (
              <span key={Icon.displayName ?? Icon.name} className="flex size-7 items-center justify-center rounded-md hover:bg-white/20 dark:hover:bg-white/10">
                <Icon className="size-3.5" />
              </span>
            ))}
          </div>
          <p className="hidden px-2 text-[12px] font-medium md:block">
            {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
            {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </p>
          <Avatar className="size-6">
            <AvatarFallback className="bg-primary/30 text-[10px] font-semibold text-primary">JF</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.header>
  )
}

type DockItem = {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  className: string
  onClick?: () => void
  active?: boolean
  dockRef?: (node: HTMLButtonElement | null) => void
}

const DOCK_HOVER_DISTANCE = 140
const DOCK_HOVER_LIFT = 12
const DOCK_FALLBACK_DISTANCE = 180
const DOCK_SCROLL_STEP = 72

function DockIcon({ item, mouseX }: { item: DockItem; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const distance = useTransform(mouseX, (value) => {
    if (!ref.current) {
      return DOCK_FALLBACK_DISTANCE
    }
    const rect = ref.current.getBoundingClientRect()
    return value - (rect.left + rect.width / 2)
  })
  const scale = useSpring(
    useTransform(distance, [-DOCK_HOVER_DISTANCE, 0, DOCK_HOVER_DISTANCE], [1, 1.55, 1]),
    {
      damping: 18,
      stiffness: 230,
      mass: 0.14,
    },
  )
  const y = useSpring(
    useTransform(distance, [-DOCK_HOVER_DISTANCE, 0, DOCK_HOVER_DISTANCE], [0, -DOCK_HOVER_LIFT, 0]),
    {
      damping: 20,
      stiffness: 230,
      mass: 0.2,
    },
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          ref={(node) => {
            ref.current = node
            item.dockRef?.(node)
          }}
          style={{ scale, y }}
          whileTap={{ scale: 0.94 }}
  className="relative flex size-13 items-center justify-center rounded-[1rem] border border-white/20 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6),0_16px_32px_-10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur"
          onClick={item.onClick}
          aria-label={item.label}
        >
          <span className={cn('absolute inset-0 rounded-[0.9rem]', item.className)} />
          <item.icon className="relative size-6 text-white drop-shadow" />
          {item.active ? <span className="absolute -bottom-2 size-1.5 rounded-full bg-white/90 dark:bg-white" /> : null}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top">{item.label}</TooltipContent>
    </Tooltip>
  )
}

function MacDock({
  items,
  isMobile,
}: {
  items: DockItem[]
  isMobile: boolean
}) {
  const mouseX = useMotionValue<number>(Number.POSITIVE_INFINITY)
  const dockRef = useRef<HTMLDivElement | null>(null)

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="fixed inset-x-0 bottom-2 z-50 flex justify-center px-2 pb-[max(0.3rem,env(safe-area-inset-bottom))]"
    >
      <div
        ref={dockRef}
        role="toolbar"
        aria-label="macOS dock"
        tabIndex={0}
        className={cn(
          'flex items-end gap-2.5 rounded-[1.35rem] border border-white/35 bg-white/22 px-4 py-3 backdrop-blur-2xl dark:border-white/15 dark:bg-black/28',
          isMobile && 'w-full overflow-x-auto justify-start',
        )}
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        onKeyDown={(event) => {
          if (!isMobile || !dockRef.current) {
            return
          }
          if (event.key === 'ArrowRight') {
            dockRef.current.scrollBy({ left: DOCK_SCROLL_STEP, behavior: 'smooth' })
          }
          if (event.key === 'ArrowLeft') {
            dockRef.current.scrollBy({ left: -DOCK_SCROLL_STEP, behavior: 'smooth' })
          }
        }}
      >
        {items.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} />
        ))}
      </div>
    </motion.div>
  )
}

function PhonePreview({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto select-none" style={{ width: 'clamp(260px, 28vw, 340px)' }}>
      {/* Outer phone body */}
      <div
        className="relative rounded-[3.2rem] p-[10px]"
        style={{
          background: 'linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 50%, #2a2a2c 100%)',
          boxShadow:
            '0 0 0 0.5px rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.3), 0 20px 60px -10px rgba(0,0,0,0.7), 0 40px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Side buttons */}
        <div className="absolute -left-[3.5px] top-[90px] h-8 w-[3.5px] rounded-l-full" style={{ background: 'linear-gradient(to right, #2a2a2c, #3a3a3c)' }} />
        <div className="absolute -left-[3.5px] top-[136px] h-[42px] w-[3.5px] rounded-l-full" style={{ background: 'linear-gradient(to right, #2a2a2c, #3a3a3c)' }} />
        <div className="absolute -left-[3.5px] top-[186px] h-[42px] w-[3.5px] rounded-l-full" style={{ background: 'linear-gradient(to right, #2a2a2c, #3a3a3c)' }} />
        <div className="absolute -right-[3.5px] top-[130px] h-[56px] w-[3.5px] rounded-r-full" style={{ background: 'linear-gradient(to left, #2a2a2c, #3a3a3c)' }} />

        {/* Screen bezel */}
        <div
          className="relative overflow-hidden rounded-[2.6rem] bg-black"
          style={{ boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.04)' }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute left-1/2 top-[10px] z-20 -translate-x-1/2 rounded-full bg-black"
            style={{ width: '110px', height: '32px', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.06)' }}
          />

          {/* Status bar */}
          <div className="flex items-center justify-between px-7 pt-4 pb-1">
            <span className="text-[11px] font-semibold text-foreground/90 dark:text-white/90">9:41</span>
            <div className="flex items-center gap-1 text-foreground/80 dark:text-white/80">
              <Wifi className="size-3" />
              <BatteryFull className="size-3.5" />
            </div>
          </div>

          {/* Scrollable content */}
          <div className="h-[520px] overflow-y-auto scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
            {children}
          </div>

          {/* Home indicator */}
          <div aria-hidden="true" className="flex justify-center py-2 bg-white dark:bg-[#0d0d0d]">
            <div className="h-1 w-28 rounded-full bg-black/20 dark:bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}

function VscodeWindow({
  isMobile,
  isTablet,
  isDesktop,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
}: {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isMaximized: boolean
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}) {
  const { t } = useTranslation('common')
  const openFiles = useUiStore((state) => state.openFiles)
  const activeFile = useUiStore((state) => state.activeFile)
  const closeFile = useUiStore((state) => state.closeFile)
  const setActiveFile = useUiStore((state) => state.setActiveFile)
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const setCommandOpen = useUiStore((state) => state.setCommandOpen)

  const tabs = useMemo(
    () => openFiles.map((id) => portfolioFiles.find((file) => file.id === id)).filter(Boolean),
    [openFiles],
  ) as { id: SectionId; key: string; icon: (typeof portfolioFiles)[number]['icon'] }[]

  const frameClass = cn(
    'overflow-hidden border border-white/25 bg-vscode-surface/90 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.55),0_60px_120px_-30px_rgba(0,0,0,0.4),0_0_0_0.5px_rgba(255,255,255,0.12)] backdrop-blur-2xl',
    isMobile ? 'rounded-2xl' : 'rounded-[1.6rem]',
    isMaximized && !isMobile && 'rounded-[1.05rem]',
  )

  const sizeClass = cn(
    'h-[calc(100%-2.5rem)]',
    isMobile
      ? 'w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)]'
      : isMaximized
        ? 'h-[calc(100dvh-5.75rem)] w-[calc(100vw-1.5rem)] max-w-none'
        : isTablet
          ? 'h-[calc(100dvh-6.5rem)] w-[min(96vw,1200px)]'
          : 'h-[calc(100dvh-6rem)] w-[min(92vw,1520px)]',
  )

  const panelGridClass = cn('grid h-[calc(100%-3rem)] overflow-hidden', isMobile ? 'grid-cols-1' : 'grid-cols-[3.25rem_1fr]')

  return (
    <motion.div layout className={cn('relative', sizeClass)}>
      <div className={frameClass}>
        <div className="flex h-12 items-center justify-between border-b border-border/60 bg-vscode-titlebar/85 px-3 backdrop-blur-xl md:px-4">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            {isMobile ? (
              <MobileSidebarSheet />
            ) : (
              <div className="group flex items-center gap-1.5">
                <button
                  type="button"
                  className="size-3 rounded-full bg-[#ff5f57] transition-transform hover:scale-110"
                  onClick={onClose}
                  aria-label={t('actions.close')}
                />
                <button
                  type="button"
                  className="size-3 rounded-full bg-[#febc2e] transition-transform hover:scale-110"
                  onClick={onMinimize}
                  aria-label={t('actions.minimize')}
                />
                <button
                  type="button"
                  className="size-3 rounded-full bg-[#28c840] transition-transform hover:scale-110"
                  onClick={onMaximize}
                  aria-label={t('actions.maximize')}
                />
              </div>
            )}
            <Separator orientation="vertical" className="h-4" />
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary/20 text-[10px] font-bold text-primary">JF</AvatarFallback>
            </Avatar>
            <p className="truncate text-sm text-muted-foreground">{t('app.subtitle')}</p>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="hidden gap-2 md:flex" onClick={() => setCommandOpen(true)}>
              <Command className="size-4" />
              {t('app.openCommand')}
            </Button>
            {!isDesktop ? (
              <Button variant="ghost" size="icon" onClick={() => setCommandOpen(true)} aria-label={t('app.openCommand')}>
                <Search className="size-4" />
              </Button>
            ) : null}
            {!isMobile ? (
              <>
                <LanguageToggle />
                <ThemeToggle />
              </>
            ) : null}
          </div>
        </div>

        <div className={panelGridClass}>
          {!isMobile ? (
            <Card className="rounded-none border-0 border-r border-border/60 bg-vscode-activity/90 shadow-none">
              <CardContent className="flex h-full flex-col items-center gap-2 p-2">
                {[
                  {
                    icon: isSidebarOpen ? PanelLeftClose : PanelLeftOpen,
                    label: isSidebarOpen ? `${t('actions.close')} ${t('app.explorer')}` : t('app.explorer'),
                    action: toggleSidebar,
                  },
                  { icon: Search, label: t('app.openCommand'), action: () => setCommandOpen(true) },
                  { icon: Folder, label: t('app.portfolioFiles'), action: () => void 0 },
                ].map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                        aria-label={item.label}
                        onClick={item.action}
                      >
                        <item.icon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <div
            className={cn(
              'grid h-full overflow-hidden',
              isMobile ? 'grid-cols-1' : isSidebarOpen ? 'grid-cols-[clamp(15.5rem,24vw,19rem)_1fr]' : 'grid-cols-1',
            )}
          >
            <AnimatePresence initial={false}>
              {!isMobile && isSidebarOpen ? (
                <motion.aside
                  key="desktop-sidebar"
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -16, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="min-w-0"
                >
                  <SidebarContent compact={isTablet} />
                </motion.aside>
              ) : null}
            </AnimatePresence>

            <div className="flex h-full min-w-0 flex-col overflow-hidden bg-vscode-editor/45">
              <ScrollArea className="w-full border-b border-border/60 bg-vscode-tabs/85">
                <div className="flex min-h-10 min-w-full items-stretch">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeFile === tab.id
                    return (
                      <motion.div key={tab.id} initial={{ opacity: 0.75 }} animate={{ opacity: 1 }} className="group flex items-center border-r border-border/40">
                        <Button
                          variant="ghost"
                          className={cn(
                            'h-10 rounded-none gap-2 px-3 font-mono text-xs',
                            isActive ? 'bg-background/80 text-foreground' : 'text-muted-foreground',
                          )}
                          onClick={() => setActiveFile(tab.id)}
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span className="truncate">{t(tab.key)}</span>
                        </Button>
                        {tabs.length > 1 ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-[-0.25rem] mr-1 hidden size-6 rounded-sm group-hover:inline-flex"
                            onClick={() => closeFile(tab.id)}
                          >
                            <X className="size-3" />
                          </Button>
                        ) : null}
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>

              <ScrollArea className="flex-1">
                <div className="flex min-h-full items-center justify-center py-6 px-4">
                  {isMobile ? (
                    <div className="w-full max-w-lg">
                      <EditorContent section={activeFile} />
                    </div>
                  ) : (
                    <PhonePreview>
                      <EditorContent section={activeFile} />
                    </PhonePreview>
                  )}
                </div>
              </ScrollArea>

              {!isMobile ? (
                <div className="flex h-8 items-center justify-between border-t border-border/60 bg-vscode-status/90 px-3 text-xs text-muted-foreground backdrop-blur">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="gap-1 rounded-sm px-2 py-0.5">
                      <GitBranch className="size-3" />
                      {t('app.branch')}
                    </Badge>
                    <span>{t('app.status')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="size-3.5" />
                    <span>{t('app.terminal')}</span>
                    <Command className="size-3.5" />
                    <span>⌘K</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-14 items-center justify-between border-t border-border/60 bg-vscode-status/95 px-4 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-2 text-xs text-muted-foreground backdrop-blur-2xl">
                  <Button variant="ghost" className="h-9 gap-2 px-2" onClick={() => setCommandOpen(true)}>
                    <Search className="size-4" />
                    {t('app.openCommand')}
                  </Button>
                  <div className="flex items-center gap-1">
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function VscodeLayout() {
  const { t } = useTranslation('common')
  const { isMobile, isTablet, isDesktop } = useDevice()
  const windowState = useUiStore((state) => state.windowState)
  const isWindowMaximized = useUiStore((state) => state.isWindowMaximized)
  const minimizeWindow = useUiStore((state) => state.minimizeWindow)
  const closeWindow = useUiStore((state) => state.closeWindow)
  const restoreWindow = useUiStore((state) => state.restoreWindow)
  const toggleWindowMaximize = useUiStore((state) => state.toggleWindowMaximize)
  const setCommandOpen = useUiStore((state) => state.setCommandOpen)

  const dockVscodeRef = useRef<HTMLButtonElement | null>(null)
  const [openFromDock, setOpenFromDock] = useState(false)
  const [dockOffset, setDockOffset] = useState({ x: 0, y: 260 })
  const [exitMode, setExitMode] = useState<'minimized' | 'closed'>('closed')

  useEffect(() => {
    const onCommandShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener('keydown', onCommandShortcut)
    return () => window.removeEventListener('keydown', onCommandShortcut)
  }, [setCommandOpen])

  useEffect(() => {
    const updateOffset = () => {
      const target = dockVscodeRef.current?.getBoundingClientRect()
      const viewportCenterX = window.innerWidth / 2
      const viewportCenterY = window.innerHeight / 2
      if (!target) {
        setDockOffset({ x: 0, y: 260 })
        return
      }
      setDockOffset({
        x: target.left + target.width / 2 - viewportCenterX,
        y: target.top + target.height / 2 - viewportCenterY,
      })
    }

    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [])

  const dockItems: DockItem[] = [
    { id: 'finder', label: 'Finder', icon: Smile, className: 'bg-gradient-to-br from-[#4da5ff] to-[#0077ff]' },
    { id: 'safari', label: 'Safari', icon: Compass, className: 'bg-gradient-to-br from-[#5ac8ff] to-[#2563eb]' },
    { id: 'mail', label: 'Mail', icon: Mail, className: 'bg-gradient-to-br from-[#67a8ff] to-[#2563eb]' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, className: 'bg-gradient-to-br from-[#6de278] to-[#16a34a]' },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays, className: 'bg-gradient-to-br from-[#ff7b7b] to-[#ef4444]' },
    { id: 'notes', label: 'Notes', icon: NotebookText, className: 'bg-gradient-to-br from-[#ffe582] to-[#f59e0b]' },
    { id: 'settings', label: 'Settings', icon: Settings, className: 'bg-gradient-to-br from-[#9ea6b6] to-[#6b7280]' },
    { id: 'terminal', label: 'Terminal', icon: TerminalSquare, className: 'bg-gradient-to-br from-[#3b3b3b] to-[#111111]' },
    {
      id: 'vscode',
      label: 'VS Code',
      icon: FileCode2,
      className: 'bg-gradient-to-br from-[#30b5ff] to-[#0f75ff]',
      active: windowState === 'open',
      onClick: () => {
        setOpenFromDock(true)
        restoreWindow()
      },
      dockRef: (node) => {
        dockVscodeRef.current = node
      },
    },
  ]

  const shouldRenderWindow = windowState === 'open'
  const enteringFromDock = shouldRenderWindow && openFromDock

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 dark:from-black/20 dark:via-transparent dark:to-black/40" />

        <MacMenuBar />

        <div className="fixed inset-x-0 top-[2.75rem] bottom-[5rem] flex items-center justify-center px-2 sm:px-4">
          <AnimatePresence mode="wait">
            {shouldRenderWindow ? (
              <motion.div
                key="vscode-window"
                initial={
                  enteringFromDock
                    ? { opacity: 0, scale: 0.2, x: dockOffset.x, y: dockOffset.y }
                    : { opacity: 0, scale: 0.96, y: 16 }
                }
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={
                  exitMode === 'minimized'
                    ? { opacity: 0, scale: 0.2, x: dockOffset.x, y: dockOffset.y }
                    : { opacity: 0, scale: 0.9, y: 30 }
                }
                onAnimationComplete={() => setOpenFromDock(false)}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <VscodeWindow
                  isMobile={isMobile}
                  isTablet={isTablet}
                  isDesktop={isDesktop}
                  isMaximized={isWindowMaximized}
                  onMinimize={() => {
                    setExitMode('minimized')
                    setOpenFromDock(false)
                    minimizeWindow()
                  }}
                  onMaximize={toggleWindowMaximize}
                  onClose={() => {
                    setExitMode('closed')
                    setOpenFromDock(false)
                    closeWindow()
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-20 right-3 z-40 hidden lg:flex">
          <Button
            variant="secondary"
            className="rounded-full bg-black/35 text-white hover:bg-black/45"
            onClick={() => setCommandOpen(true)}
            aria-keyshortcuts="Meta+K Control+K"
          >
            <Command className="mr-2 size-4" /> {t('app.openCommand')}
          </Button>
        </div>

        <MacDock items={dockItems} isMobile={isMobile} />

        <CommandPalette />
      </div>
    </TooltipProvider>
  )
}
