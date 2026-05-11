import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
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
import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
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

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/20 px-3 py-2 backdrop-blur-2xl dark:border-black/20 dark:bg-black/25"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 text-sm">
        <div className="flex min-w-0 items-center gap-3 text-[13px]">
          <span className="font-semibold">􀣺</span>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="font-semibold">Finder</span>
            {['File', 'Edit', 'View', 'Window', 'Help'].map((item) => (
              <span key={item} className="text-foreground/80">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-foreground/85">
          {[Wifi, BatteryFull, Search, SlidersHorizontal].map((Icon, index) => (
            <span key={index} className="flex size-7 items-center justify-center rounded-md hover:bg-white/20 dark:hover:bg-white/10">
              <Icon className="size-3.5" />
            </span>
          ))}
          <p className="hidden px-1 text-[12px] md:block">
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

function DockIcon({ item, mouseX }: { item: DockItem; mouseX: ReturnType<typeof useMotionValue> }) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const distance = useTransform(mouseX, (value) => {
    if (!ref.current) {
      return 180
    }
    const rect = ref.current.getBoundingClientRect()
    return value - (rect.left + rect.width / 2)
  })
  const scale = useSpring(useTransform(distance, [-140, 0, 140], [1, 1.55, 1]), {
    damping: 18,
    stiffness: 230,
    mass: 0.14,
  })
  const y = useSpring(useTransform(distance, [-140, 0, 140], [0, -12, 0]), {
    damping: 20,
    stiffness: 230,
    mass: 0.2,
  })

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
          className="relative flex size-12 items-center justify-center rounded-[0.95rem] border border-white/30 shadow-[0_12px_24px_-15px_rgba(0,0,0,0.8)] backdrop-blur"
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
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="fixed inset-x-0 bottom-2 z-50 flex justify-center px-2 pb-[max(0.3rem,env(safe-area-inset-bottom))]"
    >
      <div
        className={cn(
          'flex items-end gap-2 rounded-[1.35rem] border border-white/35 bg-white/22 px-3 py-2 backdrop-blur-2xl dark:border-white/15 dark:bg-black/28',
          isMobile && 'w-full max-w-full overflow-x-auto justify-start',
        )}
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      >
        {items.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} />
        ))}
      </div>
    </motion.div>
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
    'overflow-hidden border border-white/30 bg-vscode-surface/88 shadow-[0_45px_130px_-55px_rgba(0,0,0,0.95)] backdrop-blur-2xl',
    isMobile ? 'rounded-2xl' : 'rounded-[1.6rem]',
    isMaximized && !isMobile && 'rounded-[1.05rem]',
  )

  const sizeClass = cn(
    'h-[calc(100%-3rem)]',
    isMobile
      ? 'w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)]'
      : isMaximized
        ? 'h-[calc(100dvh-6.5rem)] w-[calc(100vw-1.5rem)] max-w-none'
        : isTablet
          ? 'h-[calc(100dvh-7.2rem)] w-[min(94vw,1180px)]'
          : 'h-[calc(100dvh-7rem)] w-[min(90vw,1480px)]',
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
                <div className="mx-auto w-full max-w-5xl p-4 pb-20 sm:p-5 md:p-6 md:pb-8 lg:p-7">
                  <EditorContent section={activeFile} />
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
  const { isMobile, isTablet, isDesktop } = useDevice()
  const windowState = useUiStore((state) => state.windowState)
  const isWindowMaximized = useUiStore((state) => state.isWindowMaximized)
  const minimizeWindow = useUiStore((state) => state.minimizeWindow)
  const closeWindow = useUiStore((state) => state.closeWindow)
  const restoreWindow = useUiStore((state) => state.restoreWindow)
  const toggleWindowMaximize = useUiStore((state) => state.toggleWindowMaximize)
  const setCommandOpen = useUiStore((state) => state.setCommandOpen)

  const dockVscodeRef = useRef<HTMLButtonElement | null>(null)
  const previousWindowState = useRef(windowState)
  const [dockOffset, setDockOffset] = useState({ x: 0, y: 260 })
  const [exitMode, setExitMode] = useState<'minimized' | 'closed'>('closed')

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

  useEffect(() => {
    previousWindowState.current = windowState
  }, [windowState])

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
      onClick: () => restoreWindow(),
      dockRef: (node) => {
        dockVscodeRef.current = node
      },
    },
  ]

  const shouldRenderWindow = windowState === 'open'
  const enteringFromDock = shouldRenderWindow && previousWindowState.current !== 'open'

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.45),transparent_42%),radial-gradient(circle_at_80%_25%,rgba(251,146,60,0.35),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(59,130,246,0.35),transparent_52%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.28),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.22),transparent_38%),radial-gradient(circle_at_50%_90%,rgba(79,70,229,0.35),transparent_55%)]" />
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/20 dark:from-white/5 dark:to-black/55" />

        <MacMenuBar />

        <div className="fixed inset-x-0 top-10 bottom-20 flex items-center justify-center px-2 sm:px-4">
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
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <VscodeWindow
                  isMobile={isMobile}
                  isTablet={isTablet}
                  isDesktop={isDesktop}
                  isMaximized={isWindowMaximized}
                  onMinimize={() => {
                    setExitMode('minimized')
                    minimizeWindow()
                  }}
                  onMaximize={toggleWindowMaximize}
                  onClose={() => {
                    setExitMode('closed')
                    closeWindow()
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-20 right-3 z-40 hidden lg:flex">
          <Button variant="secondary" className="rounded-full bg-black/35 text-white hover:bg-black/45" onClick={() => setCommandOpen(true)}>
            <Command className="mr-2 size-4" /> Command Palette
          </Button>
        </div>

        <MacDock items={dockItems} isMobile={isMobile} />

        <CommandPalette />
      </div>
    </TooltipProvider>
  )
}
