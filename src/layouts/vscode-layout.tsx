import { AnimatePresence, motion } from 'framer-motion'
import {
  Command,
  CodeSquare,
  FileCode2,
  Folder,
  GitBranch,
  Menu,
  Search,
  Terminal,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CommandPalette } from '@/components/command-palette'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { portfolioFiles } from '@/features/portfolio/data/portfolio-data'
import { EditorContent } from '@/features/portfolio/components/editor-content'
import { useMobile } from '@/hooks/use-mobile'
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

function SidebarContent({ onPick }: { onPick?: () => void }) {
  const { t } = useTranslation('common')
  const activeFile = useUiStore((state) => state.activeFile)
  const setActiveFile = useUiStore((state) => state.setActiveFile)

  return (
    <Card className="h-full rounded-none border-0 border-r border-border/70 bg-vscode-sidebar shadow-none">
      <CardContent className="h-full p-2">
        <p className="mb-2 px-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t('app.explorer')}</p>
        <ScrollArea className="h-[calc(100vh-14rem)] lg:h-[calc(100vh-16rem)]">
          <div className="space-y-1">
            {portfolioFiles.map((file) => {
              const Icon = file.icon
              const isActive = activeFile === file.id
              return (
                <Button
                  key={file.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2 font-mono text-xs"
                  onClick={() => {
                    setActiveFile(file.id)
                    onPick?.()
                  }}
                >
                  <Icon className="size-4" />
                  {t(file.key)}
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export function VscodeLayout() {
  const { t } = useTranslation('common')
  const isMobile = useMobile()
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)

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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40 p-2 md:p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mx-auto h-[calc(100vh-1rem)] max-w-[1400px] overflow-hidden rounded-2xl border border-border/70 bg-vscode-surface shadow-[0_20px_80px_-40px_hsl(var(--foreground)/0.45)] backdrop-blur-xl md:h-[calc(100vh-2rem)]"
        >
          <div className="flex h-12 items-center justify-between border-b border-border/60 px-3 bg-vscode-titlebar/80 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
              </div>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/20 text-[10px] font-bold text-primary">JF</AvatarFallback>
              </Avatar>
              <p className="hidden text-sm text-muted-foreground md:block">{t('app.subtitle')}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="hidden gap-2 md:flex" onClick={() => setCommandOpen(true)}>
                <Command className="size-4" />
                {t('app.openCommand')}
              </Button>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>

          <div className="grid h-[calc(100%-3rem)] grid-cols-[3.25rem_1fr]">
            <Card className="rounded-none border-0 border-r border-border/60 bg-vscode-activity shadow-none">
              <CardContent className="flex h-full flex-col items-center gap-2 p-2">
                {[
                  { icon: FileCode2, label: t('app.explorer'), action: toggleSidebar },
                  { icon: Search, label: t('app.openCommand'), action: () => setCommandOpen(true) },
                  { icon: Folder, label: t('app.portfolioFiles'), action: () => void 0 },
                ].map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={item.action}>
                        <item.icon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ))}
              </CardContent>
            </Card>

            <div className="grid h-full grid-cols-1 lg:grid-cols-[18rem_1fr]">
              {isMobile ? (
                <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="absolute left-16 top-14 z-20 lg:hidden">
                      <Menu className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 border-r border-border/60 p-0">
                    <SidebarContent onPick={() => setIsMobileSheetOpen(false)} />
                  </SheetContent>
                </Sheet>
              ) : null}

              <AnimatePresence initial={false}>
                {!isMobile && isSidebarOpen ? (
                  <motion.aside
                    key="sidebar"
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -12, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <SidebarContent />
                  </motion.aside>
                ) : null}
              </AnimatePresence>

              <div className="flex h-full flex-col overflow-hidden">
                <ScrollArea className="w-full border-b border-border/60 bg-vscode-tabs">
                  <div className="flex min-h-10 min-w-full items-stretch">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      const isActive = activeFile === tab.id
                      return (
                        <motion.div
                          key={tab.id}
                          initial={{ opacity: 0.75 }}
                          animate={{ opacity: 1 }}
                          className="group flex items-center border-r border-border/50"
                        >
                          <Button
                            variant="ghost"
                            className={cn(
                              'h-10 rounded-none gap-2 px-3 font-mono text-xs',
                              isActive ? 'bg-background/70 text-foreground' : 'text-muted-foreground',
                            )}
                            onClick={() => setActiveFile(tab.id)}
                          >
                            <Icon className="size-3.5" />
                            {t(tab.key)}
                          </Button>
                          {tabs.length > 1 ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-[-0.5rem] mr-1 hidden size-6 rounded-sm group-hover:inline-flex"
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

                <ScrollArea className="flex-1 bg-vscode-editor">
                  <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
                    <EditorContent section={activeFile} />
                  </div>
                </ScrollArea>

                <div className="flex h-8 items-center justify-between border-t border-border/60 bg-vscode-status px-3 text-[11px] text-muted-foreground">
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
                    <CodeSquare className="size-3.5" />
                    <span>⌘K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CommandPalette />
        </motion.div>
      </div>
    </TooltipProvider>
  )
}
