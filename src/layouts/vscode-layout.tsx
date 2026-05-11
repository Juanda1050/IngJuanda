import { AnimatePresence, motion } from 'framer-motion'
import {
  Command,
  FileCode2,
  Folder,
  GitBranch,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Terminal,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
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
import { type SectionId } from '@/types/portfolio'
import { cn } from '@/lib/utils'

function SidebarContent({ onPick, compact = false }: { onPick?: () => void; compact?: boolean }) {
  const { t } = useTranslation('common')
  const activeFile = useUiStore((state) => state.activeFile)
  const setActiveFile = useUiStore((state) => state.setActiveFile)

  return (
    <Card className="h-full rounded-none border-0 border-r border-border/70 bg-vscode-sidebar/90 shadow-none backdrop-blur-xl">
      <CardContent className={cn('h-full p-3', compact && 'p-2')}>
        <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t('app.explorer')}</p>
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

function MacDock({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { t } = useTranslation('common')
  const items = [
    { icon: FileCode2, label: t('app.explorer') },
    { icon: Search, label: t('app.openCommand'), action: onOpenCommand },
    { icon: Folder, label: t('app.portfolioFiles') },
    { icon: Terminal, label: t('app.terminal') },
  ]

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="pointer-events-none fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 lg:flex"
    >
      <div className="pointer-events-auto flex items-end gap-2 rounded-2xl border border-border/60 bg-card/60 p-2 shadow-[0_20px_40px_-24px_hsl(var(--foreground)/0.7)] backdrop-blur-2xl">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <Tooltip key={`${item.label}-${index}`}>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ y: -6, scale: 1.08 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex size-11 items-center justify-center rounded-xl border border-border/40 bg-vscode-sidebar/80 text-foreground transition-colors hover:bg-primary/15"
                  onClick={item.action}
                >
                  <Icon className="size-5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="top">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </motion.div>
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

export function VscodeLayout() {
  const { t } = useTranslation('common')
  const { isMobile, isTablet, isDesktop } = useDevice()

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

  const appContainerClass = cn(
    'mx-auto overflow-hidden border border-border/70 bg-vscode-surface/90 backdrop-blur-2xl',
    isMobile
      ? 'h-[calc(100vh-env(safe-area-inset-bottom))] rounded-none border-x-0 border-b-0'
      : isTablet
        ? 'h-[calc(100vh-1.5rem)] rounded-[1.6rem] shadow-[0_22px_90px_-50px_hsl(var(--foreground)/0.55)]'
        : 'h-[calc(100vh-2.2rem)] max-w-[1520px] rounded-[1.85rem] shadow-[0_30px_100px_-52px_hsl(var(--foreground)/0.7)]',
  )

  const panelGridClass = cn('grid h-[calc(100%-3rem)] overflow-hidden', isMobile ? 'grid-cols-1' : 'grid-cols-[3.25rem_1fr]')

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-background via-background to-vscode-editor px-0 py-0 sm:px-3 sm:py-3 lg:px-4 lg:py-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={appContainerClass}
        >
          <div className="flex h-12 items-center justify-between border-b border-border/60 bg-vscode-titlebar/80 px-3 backdrop-blur-xl md:px-4">
            <div className="flex min-w-0 items-center gap-2 md:gap-3">
              {isMobile ? (
                <MobileSidebarSheet />
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-[#ff5f57] shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
                  <span className="size-3 rounded-full bg-[#febc2e] shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
                  <span className="size-3 rounded-full bg-[#28c840] shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
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
                      label: t('app.explorer'),
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
                        <motion.div
                          key={tab.id}
                          layout
                          initial={{ opacity: 0.75 }}
                          animate={{ opacity: 1 }}
                          className="group flex items-center border-r border-border/40"
                        >
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
                  <div className="flex h-8 items-center justify-between border-t border-border/60 bg-vscode-status/90 px-3 text-[11px] text-muted-foreground backdrop-blur">
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

          <CommandPalette />
        </motion.div>
        {isDesktop ? <MacDock onOpenCommand={() => setCommandOpen(true)} /> : null}
      </div>
    </TooltipProvider>
  )
}
