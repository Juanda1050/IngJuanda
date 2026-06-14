import { useState, useEffect } from "react";
import { useMotionValue, useTransform, animate } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useUiStore } from "@/store/ui-store";
import { useBattery } from "@/hooks/use-system-info";

export function useIpadosLayout() {
  const { t } = useTranslation("common");
  const [currentTime, setCurrentTime] = useState(new Date());
  // The app "mi-logo" (dashboard app containing Juanda's logo) is open by default
  const [activeApp, setActiveApp] = useState<string | null>("dashboard");
  const wallpaper = useUiStore((state) => state.wallpaper);
  const { level, charging } = useBattery();

  const homeDragY = useMotionValue(0);
  const edgeDragX = useMotionValue(0);

  const appY = useTransform(homeDragY, [-150, 0], [-100, 0]);
  const appScale = useTransform(homeDragY, [-150, 0], [0.9, 1]);
  const appBorderRadius = useTransform(homeDragY, [-150, 0], ["30px", "0px"]);
  const appOpacity = useTransform(homeDragY, [-150, -100, 0], [0, 1, 1]);

  useEffect(() => {
    homeDragY.set(0);
    edgeDragX.set(0);
  }, [activeApp, homeDragY, edgeDragX]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSwipeBack = () => {
    const event = new CustomEvent("ipados-swipe-back", { cancelable: true });
    window.dispatchEvent(event);
    if (!event.defaultPrevented) {
      setActiveApp(null);
    } else {
      animate(edgeDragX, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  const handleHomeDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y < -60 || info.velocity.y < -300) {
      setActiveApp(null);
    } else {
      animate(homeDragY, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  const handleEdgeDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x > 80 || info.velocity.x > 300) {
      handleSwipeBack();
    } else {
      animate(edgeDragX, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  const getAppLabel = (appId: string, appName: string) => {
    const labels: Record<string, string> = {
      dashboard: t("dashboard.dockLabel", "Juanda's"),
      settings: t("settings.title", "Settings"),
      calendar: t("calendar.title", "Calendar"),
      notes: t("notes.title", "Notes"),
    };
    return labels[appId] ?? appName;
  };

  return {
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
  };
}
