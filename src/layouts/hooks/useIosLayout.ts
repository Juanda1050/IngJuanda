// src/layouts/hooks/useIosLayout.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { useUiStore, type AppId } from "@/store/ui-store";
import { useBattery } from "@/hooks/use-system-info";

export type AppType =
  | "dashboard"
  | "settings"
  | "phone"
  | "notes"
  | "calendar"
  | "safari"
  | "messages"
  | "mail"
  | null;

type WallpaperId = string;

interface DragInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

interface UseIosLayoutReturn {
  t: TFunction;
  currentTime: Date;
  activeApp: AppType;
  setActiveApp: (app: AppType) => void;
  wallpaper: WallpaperId;
  level: number;
  charging: boolean;

  // MotionValues tipados explícitamente
  homeDragY: MotionValue<number>;
  edgeDragX: MotionValue<number>;
  appY: MotionValue<number>;
  appScale: MotionValue<number>;
  appBorderRadius: MotionValue<string>;
  appOpacity: MotionValue<number>;

  // Handlers
  handleHomeDragEnd: (event: unknown, info: DragInfo) => void;
  handleEdgeDragEnd: (event: unknown, info: DragInfo) => void;
  getAppLabel: (appId: string, appName: string) => string;
}

export function useIosLayout(): UseIosLayoutReturn {
  const { t } = useTranslation("common");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeApp, _setActiveApp] = useState<AppType>("dashboard");
  const wallpaper = useUiStore((state) => state.wallpaper);
  const { level, charging } = useBattery();

  // MotionValues - inicializados con tipos explícitos
  const homeDragY = useMotionValue<number>(0);
  const edgeDragX = useMotionValue<number>(0);

  // Transforms - estos retornan MotionValue<number> y MotionValue<string>
  const appY = useTransform<number, number>(homeDragY, [-150, 0], [-100, 0]);

  const appScale = useTransform<number, number>(
    homeDragY,
    [-150, 0],
    [0.85, 1],
  );

  const appBorderRadius = useTransform<number, string>(
    homeDragY,
    [-150, 0],
    ["40px", "0px"],
  );

  const appOpacity = useTransform<number, number>(
    homeDragY,
    [-150, -100, 0],
    [0, 1, 1],
  );

  const openApp = useUiStore((state) => state.openApp);
  const closeApp = useUiStore((state) => state.closeApp);

  const setActiveApp = useCallback((nextApp: AppType) => {
    _setActiveApp((prevApp) => {
      if (prevApp !== nextApp) {
        if (prevApp && prevApp !== "phone") {
          closeApp(prevApp as AppId);
        }
        if (nextApp && nextApp !== "phone") {
          openApp(nextApp as AppId);
        }
      }
      return nextApp;
    });
  }, [openApp, closeApp]);

  // Open the initial active app in the store on mount
  useEffect(() => {
    if (activeApp && activeApp !== "phone") {
      openApp(activeApp as AppId);
    }
  }, [openApp]);

  // Reset dragValues cuando cambia activeApp
  useEffect(() => {
    homeDragY.set(0);
    edgeDragX.set(0);
  }, [activeApp, homeDragY, edgeDragX]);

  // Actualizar hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handler: Cerrar app con swipe back
  const handleSwipeBack = useCallback(() => {
    const event = new CustomEvent("ios-swipe-back", { cancelable: true });
    window.dispatchEvent(event);
    if (!event.defaultPrevented) {
      setActiveApp(null);
    } else {
      animate(edgeDragX, 0, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  }, [edgeDragX]);

  // Handler: Drag del home indicator (abrir/cerrar app)
  const handleHomeDragEnd = useCallback(
    (_: unknown, info: DragInfo) => {
      if (info.offset.y < -60 || info.velocity.y < -300) {
        setActiveApp(null);
      } else {
        animate(homeDragY, 0, {
          type: "spring",
          stiffness: 300,
          damping: 30,
        });
      }
    },
    [homeDragY],
  );

  // Handler: Swipe back gesture (edge drag)
  const handleEdgeDragEnd = useCallback(
    (_: unknown, info: DragInfo) => {
      if (info.offset.x > 80 || info.velocity.x > 300) {
        handleSwipeBack();
      } else {
        animate(edgeDragX, 0, {
          type: "spring",
          stiffness: 300,
          damping: 30,
        });
      }
    },
    [edgeDragX, handleSwipeBack],
  );

  // Obtener label traducido de la app
  const getAppLabel = useCallback(
    (appId: string, appName: string): string => {
      const labels: Record<string, string> = {
        dashboard: t("dashboard.dockLabel"),
        settings: t("settings.title"),
        calendar: t("calendar.title"),
        notes: t("notes.title"),
        phone: t("phone.title") || "Phone",
        safari: t("safari.title") || "Safari",
        messages: t("messages.title") || "Messages",
        mail: t("mail.title") || "Mail",
      };
      return labels[appId] ?? appName;
    },
    [t],
  );

  return useMemo<UseIosLayoutReturn>(
    () => ({
      t,
      currentTime,
      activeApp,
      setActiveApp,
      wallpaper,
      level,
      charging,
      homeDragY,
      edgeDragX,
      appY,
      appScale,
      appBorderRadius,
      appOpacity,
      handleHomeDragEnd,
      handleEdgeDragEnd,
      getAppLabel,
    }),
    [
      t,
      currentTime,
      activeApp,
      wallpaper,
      level,
      charging,
      homeDragY,
      edgeDragX,
      appY,
      appScale,
      appBorderRadius,
      appOpacity,
      handleHomeDragEnd,
      handleEdgeDragEnd,
      getAppLabel,
    ],
  );
}
