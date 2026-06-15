// src/layouts/use-vscode-layout.ts

import { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMotionValue } from "framer-motion";
import { useUiStore } from "@/store/ui-store";
import { useDevice } from "@/hooks/use-device";
import { portfolioFiles } from "@/features/portfolio/data/portfolio-data";
import type { SectionId } from "@/types/portfolio";

export interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

export function useMacMenuBar() {
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
  const setCurrentTutorialStep = useUiStore(
    (state) => state.setCurrentTutorialStep,
  );
  const setActiveTutorialType = useUiStore(
    (state) => state.setActiveTutorialType,
  );
  const setSystemState = useUiStore((state) => state.setSystemState);

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
      if (
        menuBarRef.current &&
        !menuBarRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null);
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuDefinitions = useMemo<Record<string, MenuItem[]>>(() => {
    return {
      Finder: [
        {
          label: t("toolbar.menus.finder.about"),
          action: () => openApp("safari"),
        },
        { divider: true, label: "" },
        {
          label: t("toolbar.menus.finder.settings"),
          shortcut: "⌘,",
          action: () => openApp("settings"),
        },
        { divider: true, label: "" },
        {
          label: t("toolbar.menus.finder.forceQuit"),
          shortcut: "⌥⌘⎋",
          disabled: true,
        },
        {
          label: t("toolbar.menus.finder.sleep"),
          action: () => setSystemState("sleep"),
        },
        {
          label: t("toolbar.menus.finder.restart"),
          action: () => setSystemState("restart"),
        },
        {
          label: t("toolbar.menus.finder.shutDown"),
          action: () => setSystemState("shutdown"),
        },
        { divider: true, label: "" },
        {
          label: t("toolbar.menus.finder.lockScreen"),
          shortcut: "⌃⌘Q",
          action: () => setSystemState("locked"),
        },
        {
          label: t("toolbar.menus.finder.logOut"),
          shortcut: "⇧⌘Q",
          action: () => setSystemState("logged_out"),
        },
      ],
      File: [
        {
          label: t("toolbar.menus.file.newWindow"),
          shortcut: "⌘N",
          action: () => openApp("finder"),
        },
        { divider: true, label: "" },
        {
          label: t("toolbar.profile.viewResume") + " (Spanish)",
          action: () => {
            setPreviewPdfUrl("/profile/CV Juan Daniel González Alejandre.pdf");
            openApp("preview");
          },
        },
        {
          label: t("toolbar.profile.viewResume") + " (English)",
          action: () => {
            setPreviewPdfUrl(
              "/profile/Resume Juan Daniel González Alejandre.pdf",
            );
            openApp("preview");
          },
        },
        { divider: true, label: "" },
        {
          label: t("toolbar.menus.file.closeWindow"),
          shortcut: "⌘W",
          disabled: true,
        },
      ],
      Edit: [
        { label: t("toolbar.menus.edit.undo"), shortcut: "⌘Z", disabled: true },
        {
          label: t("toolbar.menus.edit.redo"),
          shortcut: "⇧⌘Z",
          disabled: true,
        },
        { divider: true, label: "" },
        { label: t("toolbar.menus.edit.cut"), shortcut: "⌘X", disabled: true },
        { label: t("toolbar.menus.edit.copy"), shortcut: "⌘C", disabled: true },
        {
          label: t("toolbar.menus.edit.paste"),
          shortcut: "⌘V",
          disabled: true,
        },
        { divider: true, label: "" },
        { label: "Find…", shortcut: "⌘F", action: () => setCommandOpen(true) },
      ],
      View: [
        { label: "Open Safari", action: () => openApp("safari") },
        { label: "Open Calendar", action: () => openApp("calendar") },
        { label: "Open Notes", action: () => openApp("notes") },
        { divider: true, label: "" },
        {
          label: t("toolbar.menus.view.enterFullScreen"),
          shortcut: "⌃⌘F",
          disabled: true,
        },
      ],
      Window: [
        {
          label: t("toolbar.menus.window.minimize"),
          shortcut: "⌘M",
          disabled: true,
        },
        { label: t("toolbar.menus.window.zoom"), disabled: true },
        { divider: true, label: "" },
        { label: "Finder", action: () => openApp("finder") },
        { label: "Safari", action: () => openApp("safari") },
        { label: "Mail", action: () => openApp("mail") },
        { label: "Messages", action: () => openApp("messages") },
        { label: "Calendar", action: () => openApp("calendar") },
        { label: "Notes", action: () => openApp("notes") },
        {
          label: t("toolbar.controlCenter.shortcuts.settings"),
          action: () => openApp("settings"),
        },
      ],
      Help: [
        {
          label: t("toolbar.menus.help.portfolioHelp"),
          action: () => openApp("safari"),
        },
        {
          label: t("tutorial.startSystem"),
          action: () => {
            setActiveTutorialType("system");
            setTutorialActive(true);
            setCurrentTutorialStep(0);
          },
        },
        {
          label: t("tutorial.startVscode"),
          action: () => {
            openApp("vscode");
            setActiveTutorialType("vscode");
            setTutorialActive(true);
            setCurrentTutorialStep(0);
          },
        },
        { divider: true, label: "" },
        { label: "danielalejandre1050@gmail.com", disabled: true },
      ],
    };
  }, [
    t,
    openApp,
    setCommandOpen,
    setPreviewPdfUrl,
    setSystemState,
    setActiveTutorialType,
    setTutorialActive,
    setCurrentTutorialStep,
  ]);

  const getMenuLabel = (key: string) => {
    switch (key) {
      case "Finder":
        return t("toolbar.menus.finder.title");
      case "File":
        return t("toolbar.menus.file.title");
      case "Edit":
        return t("toolbar.menus.edit.title");
      case "View":
        return t("toolbar.menus.view.title");
      case "Window":
        return t("toolbar.menus.window.title");
      case "Help":
        return t("toolbar.menus.help.title");
      default:
        return key;
    }
  };

  return {
    t,
    i18n,
    now,
    openMenu,
    setOpenMenu,
    showProfile,
    setShowProfile,
    menuBarRef,
    menuDefinitions,
    getMenuLabel,
    openApp,
  };
}

export function useVscodeWindow() {
  const { t, i18n } = useTranslation("common");
  const openFiles = useUiStore((state) => state.openFiles);
  const activeFile = useUiStore((state) => state.activeFile);
  const closeFile = useUiStore((state) => state.closeFile);
  const setActiveFile = useUiStore((state) => state.setActiveFile);
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const activeSidebarTab = useUiStore((state) => state.activeSidebarTab);
  const setActiveSidebarTab = useUiStore((state) => state.setActiveSidebarTab);

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

  return {
    t,
    i18n,
    tabs,
    activeFile,
    closeFile,
    setActiveFile,
    isSidebarOpen,
    toggleSidebar,
    setCommandOpen,
    activeSidebarTab,
    setActiveSidebarTab,
    isTerminalOpen,
    terminalLines,
    setTerminalOpen,
  };
}

export function useVscodeLayout() {
  const { isMobile, isTablet, isDesktop } = useDevice();
  const apps = useUiStore((state) => state.apps);
  const openApp = useUiStore((state) => state.openApp);
  const runDevServer = useUiStore((state) => state.runDevServer);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const setSpotlightOpen = useUiStore((state) => state.setSpotlightOpen);

  const wallpaper = useUiStore((state) => state.wallpaper);
  const brightness = useUiStore((state) => state.brightness);
  const nightShift = useUiStore((state) => state.nightShift);

  const { t } = useTranslation("common");

  const dockVscodeRef = useRef<HTMLButtonElement | null>(null);
  const [openFromDock, setOpenFromDock] = useState(false);
  const [dockOffset, setDockOffset] = useState({ x: 0, y: 260 });

  const mouseX = useMotionValue<number>(Number.POSITIVE_INFINITY);
  const dockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onCommandShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (
        (event.metaKey || event.ctrlKey) &&
        (event.key === " " || event.code === "Space")
      ) {
        event.preventDefault();
        setSpotlightOpen(true);
      }
    };
    window.addEventListener("keydown", onCommandShortcut);
    return () => window.removeEventListener("keydown", onCommandShortcut);
  }, [setCommandOpen, setSpotlightOpen]);

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

  // Open the dashboard by default when macOS layout mounts
  useEffect(() => {
    openApp("dashboard");
  }, [openApp]);

  const dockItems = useMemo(
    () => [
      {
        id: "dashboard",
        label: t("dashboard.dockLabel"),
        iconSrc: "/juanda.svg",
        active: apps.dashboard.state !== "closed",
        onClick: () => openApp("dashboard"),
      },
      {
        id: "safari",
        label: t("safari.title"),
        iconSrc: "/dock-icons/safari.svg",
        active: apps.safari.state !== "closed",
        onClick: () => openApp("safari"),
      },
      {
        id: "mail",
        label: "Mail",
        iconSrc: "/dock-icons/mail.svg",
        active: apps.mail.state !== "closed",
        onClick: () => openApp("mail"),
      },
      {
        id: "messages",
        label: t("messages.title"),
        iconSrc: "/dock-icons/messages.svg",
        active: apps.messages.state !== "closed",
        onClick: () => openApp("messages"),
      },
      {
        id: "calendar",
        label: t("calendar.title"),
        iconSrc: "/dock-icons/calendar.svg",
        active: apps.calendar.state !== "closed",
        onClick: () => openApp("calendar"),
      },
      {
        id: "notes",
        label: t("notes.title"),
        iconSrc: "/dock-icons/notes.svg",
        active: apps.notes.state !== "closed",
        onClick: () => openApp("notes"),
      },
      {
        id: "files",
        label: t("finder.title"),
        iconSrc: "/dock-icons/files.svg",
        active: apps.finder.state !== "closed",
        onClick: () => openApp("finder"),
      },
      {
        id: "settings",
        label: t("toolbar.controlCenter.shortcuts.settings"),
        iconSrc: "/dock-icons/settings.svg",
        active: apps.settings.state !== "closed",
        onClick: () => openApp("settings"),
      },
      {
        id: "vscode",
        label: "VS Code",
        iconSrc: "/dock-icons/vscode.svg",
        active: apps.vscode.state !== "closed",
        onClick: () => {
          setOpenFromDock(true);
          openApp("vscode");
        },
        dockRef: (node: HTMLButtonElement | null) => {
          dockVscodeRef.current = node;
        },
      },
    ],
    [apps, openApp, t],
  );

  const shouldRenderWindow = apps.vscode.state === "open";
  const enteringFromDock = shouldRenderWindow && openFromDock;

  return {
    isMobile,
    isTablet,
    isDesktop,
    apps,
    openApp,
    runDevServer,
    setCommandOpen,
    setSpotlightOpen,
    wallpaper,
    brightness,
    nightShift,
    t,
    dockVscodeRef,
    openFromDock,
    setOpenFromDock,
    dockOffset,
    setDockOffset,
    dockItems,
    shouldRenderWindow,
    enteringFromDock,
    mouseX,
    dockRef,
  };
}
