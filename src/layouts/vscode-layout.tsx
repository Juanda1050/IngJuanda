import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { DesktopWindow } from "@/components/desktop-window";
import {
  Command,
  Folder,
  GitBranch,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Terminal,
  X,
  Play,
} from "lucide-react";
import { WifiStatus, BatteryStatus, SearchButton, ControlCenter } from "@/components/status-bar";
import { SiApple } from "react-icons/si";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { useTranslation } from "react-i18next";
import { CommandPalette } from "@/components/command-palette";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { EditorContent } from "@/features/portfolio/components/editor-content";
import { portfolioFiles } from "@/features/portfolio/data/portfolio-data";
import { SafariWindow } from "@/features/safari/components/safari-window";
import { FinderWindow } from "@/features/finder/components/finder-window";
import { PreviewWindow } from "@/features/preview/components/preview-window";
import { CalendarWindow } from "@/features/calendar/components/calendar-window";
import { NotesWindow } from "@/features/notes/components/notes-window";
import { MessagesWindow } from "@/features/messages/components/messages-window";
import { MailWindow } from "@/features/mail/components/mail-window";
import { SettingsWindow } from "@/features/settings/components/settings-window";
import { useDevice } from "@/hooks/use-device";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { type SectionId } from "@/types/portfolio";
import { formatWithAppleEmojis } from "@/components/apple-emoji";
import { TutorialTour } from "@/components/tutorial-tour";

function SidebarContent({
  onPick,
  compact = false,
}: {
  onPick?: () => void;
  compact?: boolean;
}) {
  const { t } = useTranslation("common");
  const activeFile = useUiStore((state) => state.activeFile);
  const setActiveFile = useUiStore((state) => state.setActiveFile);

  return (
    <Card className="h-full rounded-none border-0 border-r border-border/70 bg-vscode-sidebar/90 shadow-none backdrop-blur-xl">
      <CardContent
        className={cn("flex h-full min-h-0 flex-col p-3", compact && "p-2")}
      >
        <p className="mb-2 px-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("app.explorer")}
        </p>
        <ScrollArea className="h-full min-h-0 flex-1">
          <div className="space-y-1">
            {portfolioFiles.map((file) => {
              const Icon = file.icon;
              const isActive = activeFile === file.id;
              return (
                <Button
                  key={file.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2.5 rounded-lg px-2.5 font-mono text-xs",
                    isActive &&
                      "bg-primary/15 text-primary hover:bg-primary/20",
                  )}
                  onClick={() => {
                    setActiveFile(file.id);
                    onPick?.();
                  }}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{t(file.key)}</span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}



function MacMenuBar() {
  const { t, i18n } = useTranslation("common");
  const [now, setNow] = useState(() => new Date());
  const clockIntervalRef = useRef<number | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const menuBarRef = useRef<HTMLDivElement>(null);

  const openApp = useUiStore((state) => state.openApp);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const setPreviewPdfUrl = useUiStore((state) => state.setPreviewPdfUrl);
  const setTutorialActive = useUiStore((state) => state.setTutorialActive);
  const setCurrentTutorialStep = useUiStore((state) => state.setCurrentTutorialStep);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000;
    const timeoutId = window.setTimeout(() => {
      tick();
      clockIntervalRef.current = window.setInterval(tick, 60000);
    }, msUntilNextMinute);

    return () => {
      window.clearTimeout(timeoutId);
      if (clockIntervalRef.current) {
        window.clearInterval(clockIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  type MenuItem = { label: string; shortcut?: string; action?: () => void; divider?: boolean; disabled?: boolean };
  const menuDefinitions: Record<string, MenuItem[]> = {
    Finder: [
      { label: t('toolbar.menus.finder.about'), action: () => openApp('safari') },
      { divider: true, label: '' },
      { label: t('toolbar.menus.finder.settings'), shortcut: '⌘,', action: () => openApp('settings') },
      { divider: true, label: '' },
      { label: t('toolbar.menus.finder.forceQuit'), shortcut: '⌥⌘⎋', disabled: true },
      { label: t('toolbar.menus.finder.sleep'), action: () => {} },
      { label: t('toolbar.menus.finder.restart'), action: () => {} },
      { label: t('toolbar.menus.finder.shutDown'), action: () => {} },
      { divider: true, label: '' },
      { label: t('toolbar.menus.finder.lockScreen'), shortcut: '⌃⌘Q', action: () => {} },
      { label: t('toolbar.menus.finder.logOut'), shortcut: '⇧⌘Q', action: () => {} },
    ],
    File: [
      { label: t('toolbar.menus.file.newWindow'), shortcut: '⌘N', action: () => openApp('finder') },
      { divider: true, label: '' },
      { label: t('toolbar.profile.viewResume') + ' (Spanish)', action: () => {
          setPreviewPdfUrl('/profile/CV Juan Daniel González Alejandre.pdf');
          openApp('preview');
        } 
      },
      { label: t('toolbar.profile.viewResume') + ' (English)', action: () => {
          setPreviewPdfUrl('/profile/Resume Juan Daniel González Alejandre.pdf');
          openApp('preview');
        } 
      },
      { divider: true, label: '' },
      { label: t('toolbar.menus.file.closeWindow'), shortcut: '⌘W', disabled: true },
    ],
    Edit: [
      { label: t('toolbar.menus.edit.undo'), shortcut: '⌘Z', disabled: true },
      { label: t('toolbar.menus.edit.redo'), shortcut: '⇧⌘Z', disabled: true },
      { divider: true, label: '' },
      { label: t('toolbar.menus.edit.cut'), shortcut: '⌘X', disabled: true },
      { label: t('toolbar.menus.edit.copy'), shortcut: '⌘C', disabled: true },
      { label: t('toolbar.menus.edit.paste'), shortcut: '⌘V', disabled: true },
      { divider: true, label: '' },
      { label: 'Find…', shortcut: '⌘F', action: () => setCommandOpen(true) },
    ],
    View: [
      { label: 'Open Safari', action: () => openApp('safari') },
      { label: 'Open Calendar', action: () => openApp('calendar') },
      { label: 'Open Notes', action: () => openApp('notes') },
      { divider: true, label: '' },
      { label: t('toolbar.menus.view.enterFullScreen'), shortcut: '⌃⌘F', disabled: true },
    ],
    Window: [
      { label: t('toolbar.menus.window.minimize'), shortcut: '⌘M', disabled: true },
      { label: t('toolbar.menus.window.zoom'), disabled: true },
      { divider: true, label: '' },
      { label: 'Finder', action: () => openApp('finder') },
      { label: 'Safari', action: () => openApp('safari') },
      { label: 'Mail', action: () => openApp('mail') },
      { label: 'Messages', action: () => openApp('messages') },
      { label: 'Calendar', action: () => openApp('calendar') },
      { label: 'Notes', action: () => openApp('notes') },
      { label: t('toolbar.controlCenter.shortcuts.settings'), action: () => openApp('settings') },
    ],
    Help: [
      { label: t('toolbar.menus.help.portfolioHelp'), action: () => openApp('safari') },
      {
        label: t('tutorial.start'),
        action: () => {
          openApp('vscode');
          setTutorialActive(true);
          setCurrentTutorialStep(0);
        },
      },
      { divider: true, label: '' },
      { label: 'danielalejandre1050@gmail.com', disabled: true },
    ],
  };

  const getMenuLabel = (key: string) => {
    switch (key) {
      case 'Finder': return t('toolbar.menus.finder.title');
      case 'File': return t('toolbar.menus.file.title');
      case 'Edit': return t('toolbar.menus.edit.title');
      case 'View': return t('toolbar.menus.view.title');
      case 'Window': return t('toolbar.menus.window.title');
      case 'Help': return t('toolbar.menus.help.title');
      default: return key;
    }
  };

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/20 px-4 py-1.5 backdrop-blur-2xl dark:border-black/20 dark:bg-black/25"
    >
      <div ref={menuBarRef} className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 text-sm">
        <div className="flex min-w-0 items-center gap-0 text-[13px]">
          <button
            className="flex size-7 items-center justify-center rounded-md hover:bg-white/15 dark:hover:bg-white/10 transition-colors"
            onClick={() => setOpenMenu(openMenu === 'Finder' ? null : 'Finder')}
            aria-label="Apple Menu"
          >
            <SiApple className="size-3.5" />
          </button>
          <div className="hidden items-center gap-0 sm:flex">
            {Object.keys(menuDefinitions).map((menu) => (
              <div key={menu} className="relative">
                <button
                  type="button"
                  onMouseEnter={() => openMenu !== null && setOpenMenu(menu)}
                  onClick={() => setOpenMenu(openMenu === menu ? null : menu)}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[13px] transition-colors",
                    openMenu === menu ? "bg-white/30 dark:bg-white/15 text-foreground" : "text-foreground/80 hover:bg-white/15 dark:hover:bg-white/10",
                    menu === 'Finder' && "font-semibold"
                  )}
                >
                  {getMenuLabel(menu)}
                </button>
                <AnimatePresence>
                  {openMenu === menu && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.12, ease: 'easeOut' }}
                      className="absolute left-0 top-full mt-1.5 w-56 rounded-xl border border-black/10 dark:border-white/10 bg-[#f0f0f0]/95 dark:bg-[#1f1f1f]/95 backdrop-blur-2xl shadow-2xl shadow-black/30 py-1 z-[9999]"
                    >
                      {(menuDefinitions[menu] ?? []).map((item, idx) =>
                        item.divider ? (
                          <div key={idx} className="my-1 h-px bg-black/10 dark:bg-white/10 mx-2" />
                        ) : (
                          <button
                            key={idx}
                            onClick={() => { if (!item.disabled && item.action) { item.action(); setOpenMenu(null); } }}
                            disabled={item.disabled}
                            className={cn(
                              "flex items-center justify-between px-3 py-1 text-[13px] text-left rounded-md transition-colors mx-1",
                              item.disabled ? "text-foreground/30 cursor-default" : "text-foreground/90 hover:bg-blue-500 hover:text-white cursor-default"
                            )}
                            style={{ width: 'calc(100% - 8px)' }}
                          >
                            <span>{item.label}</span>
                            {item.shortcut && <span className="text-[11px] text-foreground/40 ml-4 shrink-0">{item.shortcut}</span>}
                          </button>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-foreground/85">
          <div className="flex items-center gap-0.5 rounded-lg bg-white/10 px-1 dark:bg-white/5">
            <WifiStatus />
            <BatteryStatus />
            <SearchButton />
            <ControlCenter />
          </div>
          <p className="hidden px-2 text-[12px] font-medium md:block select-none">
            {now.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'es-ES', {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            {now.toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'es-ES', {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <div className="relative" onMouseLeave={() => setShowProfile(false)}>
            <button
              id="profile-avatar"
              className="rounded-full ring-2 ring-transparent hover:ring-white/50 transition-all active:scale-95"
              onClick={() => setShowProfile(!showProfile)}
              onMouseEnter={() => setShowProfile(true)}
              aria-label="Profile"
            >
              <Avatar className="size-6 cursor-pointer">
                <AvatarImage src="/profile.jpg" alt="Profile" />
                <AvatarFallback className="bg-primary/30 text-[10px] font-semibold text-primary">JG</AvatarFallback>
              </Avatar>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onMouseLeave={() => setShowProfile(false)}
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-black/10 dark:border-white/10 bg-[#f0f0f0]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl shadow-2xl shadow-black/30 overflow-hidden z-[9999]"
                >
                  <div className="h-16 relative overflow-hidden">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: 'url(/profile.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top', filter: 'blur(10px) brightness(0.7)' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                  </div>
                  <div className="px-4 pb-4">
                    <div className="-mt-8 mb-2">
                      <Avatar className="size-16 ring-4 ring-[#f0f0f0] dark:ring-[#1c1c1e] shadow-xl">
                        <AvatarImage src="/profile.jpg" alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">JG</AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-[15px] font-bold text-foreground leading-tight">{t('toolbar.profile.name')}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{t('toolbar.profile.email')}</p>
                    <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 space-y-0.5">
                      {[
                        { emoji: '✉️', label: t('toolbar.profile.sendMessage'), app: 'messages' as const },
                        { emoji: '📅', label: t('toolbar.profile.scheduleMeeting'), app: 'calendar' as const },
                        { emoji: '📄', label: t('toolbar.profile.viewResume'), app: 'finder' as const },
                      ].map(({ emoji, label, app }) => (
                        <button key={app} onClick={() => { openApp(app); setShowProfile(false); }} className="w-full text-left px-3 py-1.5 text-[13px] rounded-lg hover:bg-blue-500 hover:text-white text-foreground/80 transition-colors">
                          {formatWithAppleEmojis(emoji)} {formatWithAppleEmojis(label)}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

type DockItem = {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  iconSrc?: string;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  dockRef?: (node: HTMLButtonElement | null) => void;
};

const DOCK_HOVER_DISTANCE = 140;
const DOCK_HOVER_LIFT = 12;
const DOCK_FALLBACK_DISTANCE = 180;
const DOCK_SCROLL_STEP = 72;

function DockIcon({
  item,
  mouseX,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const Icon = item.icon;
  const distance = useTransform(mouseX, (value) => {
    if (!ref.current) {
      return DOCK_FALLBACK_DISTANCE;
    }
    const rect = ref.current.getBoundingClientRect();
    return value - (rect.left + rect.width / 2);
  });
  const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 0.1,
  };
  const scale = useSpring(
    useTransform(
      distance,
      [-DOCK_HOVER_DISTANCE, 0, DOCK_HOVER_DISTANCE],
      [1, 1.55, 1],
    ),
    springConfig,
  );
  const y = useSpring(
    useTransform(
      distance,
      [-DOCK_HOVER_DISTANCE, 0, DOCK_HOVER_DISTANCE],
      [0, -DOCK_HOVER_LIFT, 0],
    ),
    springConfig,
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          ref={(node) => {
            ref.current = node;
            item.dockRef?.(node);
          }}
          style={{ scale, y }}
          whileTap={{ scale: 0.94 }}
          className="relative flex size-12 items-center justify-center bg-transparent border-0 outline-none select-none p-0 cursor-pointer"
          onClick={item.onClick}
          aria-label={item.label}
        >
          {item.iconSrc ? (
            <img
              src={item.iconSrc}
              alt={item.label}
              className="relative size-10 object-contain select-none pointer-events-none filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.15)]"
            />
          ) : Icon ? (
            <Icon className="relative size-7 text-white drop-shadow" />
          ) : (
            <span className="relative size-7 rounded-lg bg-white/80 shadow-sm" />
          )}
          {item.active ? (
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-white/90 dark:bg-white shadow-sm" />
          ) : null}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function MacDock({
  items,
  isMobile,
}: {
  items: DockItem[];
  isMobile: boolean;
}) {
  const mouseX = useMotionValue<number>(Number.POSITIVE_INFINITY);
  const dockRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-2 z-50 flex justify-center px-2 pb-[max(0.3rem,env(safe-area-inset-bottom))]"
    >
      <div
        id="mac-dock"
        ref={dockRef}
        role="toolbar"
        aria-label="macOS dock"
        tabIndex={0}
        className={cn(
          "flex items-end gap-2.5 rounded-[1.35rem] border border-white/35 bg-white/22 px-4 py-3 backdrop-blur-2xl dark:border-white/15 dark:bg-black/28",
          isMobile && "w-full overflow-x-auto justify-start",
        )}
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        onKeyDown={(event) => {
          if (!isMobile || !dockRef.current) {
            return;
          }
          if (event.key === "ArrowRight") {
            dockRef.current.scrollBy({
              left: DOCK_SCROLL_STEP,
              behavior: "smooth",
            });
          }
          if (event.key === "ArrowLeft") {
            dockRef.current.scrollBy({
              left: -DOCK_SCROLL_STEP,
              behavior: "smooth",
            });
          }
        }}
      >
        {items.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} />
        ))}
      </div>
    </motion.div>
  );
}

function VscodeWindow({
  isMobile,
  isTablet,
}: {
  isMobile: boolean;
  isTablet: boolean;
}) {
  const { t } = useTranslation("common");
  const openFiles = useUiStore((state) => state.openFiles);
  const activeFile = useUiStore((state) => state.activeFile);
  const closeFile = useUiStore((state) => state.closeFile);
  const setActiveFile = useUiStore((state) => state.setActiveFile);
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);

  const isTerminalOpen = useUiStore((state) => state.isTerminalOpen);
  const terminalLines = useUiStore((state) => state.terminalLines);
  const setTerminalOpen = useUiStore((state) => state.setTerminalOpen);

  const tabs = useMemo(
    () =>
      openFiles
        .map((id) => portfolioFiles.find((file) => file.id === id))
        .filter(Boolean),
    [openFiles],
  ) as {
    id: SectionId;
    key: string;
    icon: (typeof portfolioFiles)[number]["icon"];
  }[];



  const panelGridClass = cn(
    "grid h-full overflow-hidden",
    isMobile ? "grid-cols-1" : "grid-cols-[3.25rem_1fr]",
  );
  const editorLineCount = 24;

  return (
    <div className="flex flex-col h-full w-full bg-vscode-surface/40 backdrop-blur-xl">
      <div className={panelGridClass}>
          {!isMobile ? (
            <Card className="rounded-none border-0 border-r border-border/60 bg-vscode-activity/90 shadow-none">
              <CardContent className="flex h-full flex-col items-center gap-2 p-2">
                {[
                  {
                    icon: isSidebarOpen ? PanelLeftClose : PanelLeftOpen,
                    label: isSidebarOpen
                      ? `${t("actions.close")} ${t("app.explorer")}`
                      : t("app.explorer"),
                    action: toggleSidebar,
                  },
                  {
                    icon: Search,
                    label: t("app.openCommand"),
                    action: () => setCommandOpen(true),
                  },
                  {
                    icon: Folder,
                    label: t("app.portfolioFiles"),
                    action: () => void 0,
                  },
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
              "grid h-full overflow-hidden",
              isMobile
                ? "grid-cols-1"
                : isSidebarOpen
                  ? "grid-cols-[clamp(15.5rem,24vw,19rem)_1fr]"
                  : "grid-cols-1",
            )}
          >
            <AnimatePresence initial={false}>
              {!isMobile && isSidebarOpen ? (
                <motion.aside
                  id="vscode-sidebar"
                  key="desktop-sidebar"
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -16, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="min-w-0"
                >
                  <SidebarContent compact={isTablet} />
                </motion.aside>
              ) : null}
            </AnimatePresence>

            <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-vscode-editor/45">
              <ScrollArea className="w-full border-b border-border/60 bg-vscode-tabs/85">
                <div className="flex min-h-10 min-w-full items-stretch">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeFile === tab.id;
                    return (
                      <motion.div
                        key={tab.id}
                        initial={{ opacity: 0.75 }}
                        animate={{ opacity: 1 }}
                        className="group flex items-center border-r border-border/40"
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "h-10 rounded-none gap-2 px-3 font-mono text-xs",
                            isActive
                              ? "bg-background/80 text-foreground"
                              : "text-muted-foreground",
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
                    );
                  })}
                </div>
              </ScrollArea>

              <ScrollArea className="min-h-0 flex-1">
                <div className="flex min-h-full px-0 py-0 md:px-4 md:py-6">
                  <div className="grid w-full grid-cols-[3.25rem_1fr] bg-background/35 font-mono">
                    <div className="border-r border-border/60 bg-vscode-tabs/70 px-2 py-4 text-right text-xs leading-6 text-muted-foreground">
                      {Array.from({ length: editorLineCount }).map(
                        (_, index) => (
                          <p key={index + 1}>{index + 1}</p>
                        ),
                      )}
                    </div>
                    <div className="min-w-0 py-2">
                      <EditorContent section={activeFile} />
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Terminal panel */}
              {isTerminalOpen && (
                <div className="h-44 border-t border-border/50 bg-[#1e1e1e] text-emerald-500 font-mono text-[11px] leading-relaxed flex flex-col select-text shrink-0">
                  {/* Header */}
                  <div className="flex h-8 shrink-0 items-center justify-between border-b border-border/30 bg-[#252526] px-4 select-none">
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground/80">
                      <span className="font-bold border-b-2 border-blue-500 text-[#f3f3f3] pb-0.5 px-1">TERMINAL</span>
                      <span>PROBLEMS</span>
                      <span>OUTPUT</span>
                      <span>DEBUG CONSOLE</span>
                    </div>
                    <button onClick={() => setTerminalOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="size-3.5" />
                    </button>
                  </div>
                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-3 font-mono space-y-0.5 bg-[#1e1e1e]">
                    {terminalLines.map((line, idx) => (
                      <p key={idx} className="whitespace-pre-wrap">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {!isMobile ? (
                <div className="flex h-8 items-center justify-between border-t border-border/60 bg-vscode-status/90 px-3 text-xs text-muted-foreground backdrop-blur">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="gap-1 rounded-sm px-2 py-0.5"
                    >
                      <GitBranch className="size-3" />
                      {t("app.branch")}
                    </Badge>
                    <span>{t("app.status")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="size-3.5" />
                    <span>{t("app.terminal")}</span>
                    <Command className="size-3.5" />
                    <span>⌘K</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-14 items-center justify-between border-t border-border/60 bg-vscode-status/95 px-4 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-2 text-xs text-muted-foreground backdrop-blur-2xl">
                  <Button
                    variant="ghost"
                    className="h-9 gap-2 px-2"
                    onClick={() => setCommandOpen(true)}
                  >
                    <Search className="size-4" />
                    {t("app.openCommand")}
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
    );
}

const WALLPAPER_CLASSES: Record<string, string> = {
  default: "",
  monterey: "bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-700 dark:from-purple-900 dark:via-indigo-950 dark:to-zinc-950",
  sonoma: "bg-gradient-to-br from-amber-400 via-orange-500 to-emerald-600 dark:from-amber-950 dark:via-orange-950 dark:to-emerald-950",
  aurora: "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950",
  midnight: "bg-zinc-100 dark:bg-zinc-950"
};

export function VscodeLayout() {
  const { isMobile, isTablet, isDesktop } = useDevice();
  const apps = useUiStore((state) => state.apps);
  const openApp = useUiStore((state) => state.openApp);
  const runDevServer = useUiStore((state) => state.runDevServer);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  
  const wallpaper = useUiStore((state) => state.wallpaper);
  const brightness = useUiStore((state) => state.brightness);
  const nightShift = useUiStore((state) => state.nightShift);

  const { t } = useTranslation("common");

  const dockVscodeRef = useRef<HTMLButtonElement | null>(null);
  const [openFromDock, setOpenFromDock] = useState(false);
  const [dockOffset, setDockOffset] = useState({ x: 0, y: 260 });


  useEffect(() => {
    const onCommandShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onCommandShortcut);
    return () => window.removeEventListener("keydown", onCommandShortcut);
  }, [setCommandOpen]);

  useEffect(() => {
    const updateOffset = () => {
      const target = dockVscodeRef.current?.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      if (!target) {
        setDockOffset({ x: 0, y: 260 });
        return;
      }
      setDockOffset({
        x: target.left + target.width / 2 - viewportCenterX,
        y: target.top + target.height / 2 - viewportCenterY,
      });
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  const dockItems: DockItem[] = [
    { id: "finder", label: t('finder.title'), iconSrc: "/juanda.svg", active: apps.finder.state !== "closed", onClick: () => openApp("finder") },
    { id: "safari", label: t('safari.title'), iconSrc: "/dock-icons/safari.svg", active: apps.safari.state !== "closed", onClick: () => openApp("safari") },
    { id: "mail", label: "Mail", iconSrc: "/dock-icons/mail.svg", active: apps.mail.state !== "closed", onClick: () => openApp("mail") },
    { id: "messages", label: t('messages.title'), iconSrc: "/dock-icons/messages.svg", active: apps.messages.state !== "closed", onClick: () => openApp("messages") },
    { id: "calendar", label: t('calendar.title'), iconSrc: "/dock-icons/calendar.svg", active: apps.calendar.state !== "closed", onClick: () => openApp("calendar") },
    { id: "notes", label: t('notes.title'), iconSrc: "/dock-icons/notes.svg", active: apps.notes.state !== "closed", onClick: () => openApp("notes") },
    { id: "files", label: t('finder.title'), iconSrc: "/dock-icons/files.svg", active: apps.finder.state !== "closed", onClick: () => openApp("finder") },
    { id: "settings", label: t('toolbar.controlCenter.shortcuts.settings'), iconSrc: "/dock-icons/settings.svg", active: apps.settings.state !== "closed", onClick: () => openApp("settings") },
    {
      id: "vscode",
      label: "VS Code",
      iconSrc: "/dock-icons/vscode.svg",
      active: apps.vscode.state !== "closed",
      onClick: () => {
        setOpenFromDock(true);
        openApp("vscode");
      },
      dockRef: (node) => {
        dockVscodeRef.current = node;
      },
    },
  ];

  const shouldRenderWindow = apps.vscode.state === "open";
  const enteringFromDock = shouldRenderWindow && openFromDock;

  const customWallpaperClass = WALLPAPER_CLASSES[wallpaper] || "";

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-hidden">
        {/* Custom Wallpaper Backdrop */}
        {customWallpaperClass && (
          <div className={cn("fixed inset-0 transition-all duration-500 z-[-10]", customWallpaperClass)} />
        )}
        
        {/* Screen Brightness Dimmer Overlay */}
        {brightness < 100 && (
          <div 
            className="fixed inset-0 bg-black pointer-events-none transition-all duration-300 z-[99999]" 
            style={{ opacity: (100 - brightness) / 100 }}
          />
        )}

        {/* Night Shift Warm Overlay */}
        {nightShift && (
          <div className="fixed inset-0 bg-amber-500/10 pointer-events-none mix-blend-multiply transition-all duration-500 z-[99998]" />
        )}

        <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 dark:from-black/20 dark:via-transparent dark:to-black/40" />

        <MacMenuBar />

        <div
          className={cn(
            "fixed inset-x-0 flex items-center justify-center px-0 sm:px-4 pointer-events-none",
            isMobile
              ? "top-[2.75rem] bottom-[5.75rem]"
              : "top-[3.6rem] bottom-[8.5rem]",
          )}
        >
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <AnimatePresence>
              {apps.vscode.state === "open" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <DesktopWindow
                    appId="vscode"
                    title="VS Code"
                    defaultSizeClass="w-[min(88vw,1360px)] h-[70vh] min-h-[520px]"
                    initial={
                      enteringFromDock
                        ? {
                            opacity: 0,
                            scale: 0.2,
                            x: dockOffset.x,
                            y: dockOffset.y,
                          }
                        : { opacity: 0, scale: 0.96, y: 16 }
                    }
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: apps.vscode.isMaximized ? 0 : undefined,
                      y: apps.vscode.isMaximized ? 0 : undefined,
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    customHeaderLeft={
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <Avatar className="size-7">
                          <AvatarImage src="/profile.jpg" alt="Profile" />
                          <AvatarFallback className="bg-primary/20 text-[10px] font-bold text-primary">
                            JF
                          </AvatarFallback>
                        </Avatar>
                        <p className="truncate text-sm text-muted-foreground hidden sm:block">
                          {t("app.subtitle")}
                        </p>
                      </>
                    }
                    customHeaderRight={
                      <>
                        <Button
                          id="live-preview-btn"
                          variant="ghost"
                          size="sm"
                          className="gap-2 h-8 text-[11px] px-2 text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
                          onClick={() => runDevServer()}
                        >
                          <Play className="size-3.5 shrink-0 fill-current" />
                          <span>{t('app.livePreview')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hidden gap-2 md:flex h-8 text-[11px] px-2"
                          onClick={() => setCommandOpen(true)}
                        >
                          <Command className="size-3.5" />
                          {t("app.openCommand")}
                        </Button>
                        {!isDesktop ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => setCommandOpen(true)}
                            aria-label={t("app.openCommand")}
                          >
                            <Search className="size-3.5" />
                          </Button>
                        ) : null}
                        {!isMobile ? (
                          <>
                            <LanguageToggle />
                            <ThemeToggle />
                          </>
                        ) : null}
                      </>
                    }
                  >
                    <VscodeWindow isMobile={isMobile} isTablet={isTablet} />
                  </DesktopWindow>
                </div>
              )}

              {/* Safari Window */}
              {apps.safari.state === "open" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <DesktopWindow
                    appId="safari"
                    title={t('safari.title')}
                    defaultSizeClass="w-[min(90vw,1100px)] h-[75vh] min-h-[550px]"
                  >
                    <SafariWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Finder Window */}
              {apps.finder.state === "open" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <DesktopWindow
                    appId="finder"
                    title={t('finder.title')}
                    defaultSizeClass="w-[min(85vw,800px)] h-[55vh] min-h-[400px]"
                  >
                    <FinderWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Preview Window */}
              {apps.preview.state === "open" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <DesktopWindow
                    appId="preview"
                    title={t('finder.preview.title')}
                    defaultSizeClass="w-[min(85vw,750px)] h-[75vh] min-h-[500px]"
                  >
                    <PreviewWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Calendar Window */}
              {apps.calendar.state === "open" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <DesktopWindow
                    appId="calendar"
                    title={t('calendar.title')}
                    defaultSizeClass="w-[min(90vw,950px)] h-[65vh] min-h-[480px]"
                  >
                    <CalendarWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Notes Window */}
              {apps.notes.state === "open" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <DesktopWindow
                    appId="notes"
                    title={t('notes.title')}
                    defaultSizeClass="w-[min(85vw,850px)] h-[60vh] min-h-[420px]"
                  >
                    <NotesWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Messages Window */}
              {apps.messages.state === "open" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <DesktopWindow
                    appId="messages"
                    title={t('messages.title')}
                    defaultSizeClass="w-[min(85vw,750px)] h-[65vh] min-h-[480px]"
                  >
                    <MessagesWindow />
                  </DesktopWindow>
                </div>
              )}


              {/* Mail Window */}
              {apps.mail.state === "open" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <DesktopWindow
                    appId="mail"
                    title="Mail"
                    defaultSizeClass="w-[min(90vw,1000px)] h-[70vh] min-h-[480px]"
                  >
                    <MailWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Settings Window */}
              {apps.settings.state === "open" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <DesktopWindow
                    appId="settings"
                    title={t('toolbar.controlCenter.shortcuts.settings')}
                    defaultSizeClass="w-[min(85vw,850px)] h-[65vh] min-h-[450px]"
                  >
                    <SettingsWindow />
                  </DesktopWindow>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <MacDock items={dockItems} isMobile={isMobile} />

        <CommandPalette />
        <TutorialTour />
      </div>
    </TooltipProvider>
  );
}
