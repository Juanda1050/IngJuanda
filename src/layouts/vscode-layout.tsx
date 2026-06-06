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
  BatteryFull,
  Command,
  Folder,
  GitBranch,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  SlidersHorizontal,
  Terminal,
  Wifi,
  X,
  Play,
} from "lucide-react";
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
  const [now, setNow] = useState(() => new Date());
  const clockIntervalRef = useRef<number | null>(null);

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

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/20 px-4 py-1.5 backdrop-blur-2xl dark:border-black/20 dark:bg-black/25"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 text-sm">
        <div className="flex min-w-0 items-center gap-3 text-[13px]">
          <SiApple className="size-3.5" />
          <div className="hidden items-center gap-3 sm:flex">
            <span className="font-medium">Finder</span>
            {["File", "Edit", "View", "Window", "Help"].map((item) => (
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
              <span
                key={Icon.displayName ?? Icon.name}
                className="flex size-7 items-center justify-center rounded-md hover:bg-white/20 dark:hover:bg-white/10"
              >
                <Icon className="size-3.5" />
              </span>
            ))}
          </div>
          <p className="hidden px-2 text-[12px] font-medium md:block">
            {now.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            {now.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <Avatar className="size-6">
            <AvatarImage src="/profile.jpg" alt="Profile" />
            <AvatarFallback className="bg-primary/30 text-[10px] font-semibold text-primary">
              JF
            </AvatarFallback>
          </Avatar>
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

export function VscodeLayout() {
  const { isMobile, isTablet, isDesktop } = useDevice();
  const apps = useUiStore((state) => state.apps);
  const openApp = useUiStore((state) => state.openApp);
  const runDevServer = useUiStore((state) => state.runDevServer);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
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
    { id: "finder", label: "Finder", iconSrc: "/juanda.svg", active: apps.finder.state === "open", onClick: () => openApp("finder") },
    { id: "safari", label: "Safari", iconSrc: "/dock-icons/safari.svg", active: apps.safari.state === "open", onClick: () => openApp("safari") },
    { id: "mail", label: "Mail", iconSrc: "/dock-icons/mail.svg", active: apps.mail.state === "open", onClick: () => openApp("mail") },
    { id: "messages", label: "Messages", iconSrc: "/dock-icons/messages.svg", active: apps.messages.state === "open", onClick: () => openApp("messages") },
    { id: "calendar", label: "Calendar", iconSrc: "/dock-icons/calendar.svg", active: apps.calendar.state === "open", onClick: () => openApp("calendar") },
    { id: "notes", label: "Notes", iconSrc: "/dock-icons/notes.svg", active: apps.notes.state === "open", onClick: () => openApp("notes") },
    { id: "files", label: "Files", iconSrc: "/dock-icons/files.svg", active: apps.finder.state === "open", onClick: () => openApp("finder") },
    { id: "music", label: "Music", iconSrc: "/dock-icons/music.svg", active: apps.music.state === "open", onClick: () => openApp("music") },
    { id: "settings", label: "Settings", iconSrc: "/dock-icons/settings.svg", active: apps.settings.state === "open", onClick: () => openApp("settings") },
    {
      id: "vscode",
      label: "VS Code",
      iconSrc: "/dock-icons/vscode.svg",
      active: apps.vscode.state === "open",
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

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-hidden">
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
                <div className="absolute pointer-events-auto">
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
                          variant="ghost"
                          size="sm"
                          className="gap-2 h-8 text-[11px] px-2 text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
                          onClick={() => runDevServer()}
                        >
                          <Play className="size-3.5 shrink-0 fill-current" />
                          <span>Live Preview</span>
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
                <div className="absolute pointer-events-auto">
                  <DesktopWindow
                    appId="safari"
                    title="Safari"
                    defaultSizeClass="w-[min(90vw,1100px)] h-[75vh] min-h-[550px]"
                  >
                    <SafariWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Finder Window */}
              {apps.finder.state === "open" && (
                <div className="absolute pointer-events-auto">
                  <DesktopWindow
                    appId="finder"
                    title="Finder"
                    defaultSizeClass="w-[min(85vw,800px)] h-[55vh] min-h-[400px]"
                  >
                    <FinderWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Preview Window */}
              {apps.preview.state === "open" && (
                <div className="absolute pointer-events-auto">
                  <DesktopWindow
                    appId="preview"
                    title="Preview"
                    defaultSizeClass="w-[min(85vw,750px)] h-[75vh] min-h-[500px]"
                  >
                    <PreviewWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Calendar Window */}
              {apps.calendar.state === "open" && (
                <div className="absolute pointer-events-auto">
                  <DesktopWindow
                    appId="calendar"
                    title="Calendar"
                    defaultSizeClass="w-[min(90vw,950px)] h-[65vh] min-h-[480px]"
                  >
                    <CalendarWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Notes Window */}
              {apps.notes.state === "open" && (
                <div className="absolute pointer-events-auto">
                  <DesktopWindow
                    appId="notes"
                    title="Notes"
                    defaultSizeClass="w-[min(85vw,850px)] h-[60vh] min-h-[420px]"
                  >
                    <NotesWindow />
                  </DesktopWindow>
                </div>
              )}

              {/* Messages Window */}
              {apps.messages.state === "open" && (
                <div className="absolute pointer-events-auto">
                  <DesktopWindow
                    appId="messages"
                    title="Messages"
                    defaultSizeClass="w-[min(85vw,750px)] h-[65vh] min-h-[480px]"
                  >
                    <MessagesWindow />
                  </DesktopWindow>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <MacDock items={dockItems} isMobile={isMobile} />

        <CommandPalette />
      </div>
    </TooltipProvider>
  );
}
