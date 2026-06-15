// src/layouts/ios-layout.tsx

import { motion, AnimatePresence } from "framer-motion";
import { CalendarWindow } from "@/features/calendar/components/calendar-window";
import { NotesWindow } from "@/features/notes/components/notes-window";
import { SafariWindow } from "@/features/safari/components/safari-window";
import { MessagesWindow } from "@/features/messages/messages-window";
import { MailWindow } from "@/features/mail/components/mail-window";
import { cn } from "@/lib/utils";
import { IosTutorial } from "@/components/ios-tutorial";
import { IosSettings } from "@/features/settings/components/ios-settings";
import { PhoneWindow } from "@/features/phone/components/phone-window";
import { WallpaperBackground } from "@/components/wallpaper-background";
import { DashboardWindow } from "@/features/dashboard/components/dashboard-window";
import { IOS_APPS, IOS_DOCK_APPS } from "../constants/ios-layout.constants";
import { useIosLayout, type AppType } from "./hooks/useIosLayout";
import { AppWrapper } from "@/components/app-wrapper";

function IosSignalIcon() {
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 512 470"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M99.1,379.04c0-10.35-4.99-20.2-13.64-25.88-2.72-1.79-5.67-3.1-8.7-3.77C70.33,348.05,61.59,346.75,49.66,346.72c-11.94,.02-20.68,1.33-27.1,2.67-3.02,.67-5.98,1.99-8.7,3.77C5,358.84,.01,368.69,.01,379.04v60.01c0,10.35,4.99,20.2,13.64,25.88,2.72,1.79,5.67,3.1,8.7,3.77,6.43,1.34,15.17,2.65,27.1,2.67,11.94-.02,20.68-1.33,27.1-2.67,3.02-.67,5.98-1.99,8.7-3.77,8.65-5.68,13.64-15.53,13.64-25.88v-60.01Z" />
      <path d="M137.78,439.05c0,10.35,4.99,20.2,13.64,25.88,2.72,1.79,5.67,3.1,8.7,3.77,6.43,1.34,15.17,2.65,27.1,2.67,11.94-.02,20.68-1.33,27.1-2.67,3.02-.67,5.98-1.99,8.7-3.77,8.65-5.68,13.64-15.53,13.64-25.88v-162.04c0-10.35-4.99-20.2-13.64-25.88-2.72-1.79-5.67-3.1-8.7-3.77-6.43-1.34-15.17-2.64-27.1-2.67-11.94,.02-20.68,1.33-27.1,2.67-3.02,.67-5.98,1.99-8.7,3.77-8.65,5.68-13.64,15.53-13.64,25.88v162.04Z" />
      <path d="M374.22,174.98c0-10.35-4.99-20.2-13.64-25.88-2.72-1.79-5.67-3.1-8.7-3.77-6.43-1.34-15.17-2.64-27.1-2.67-11.94,.02-20.68,1.33-27.1,2.67-3.02,.67-5.98,1.99-8.7,3.77-8.65,5.68-13.64,15.53-13.64,25.88V439.05c0,10.35,4.99,20.2,13.64,25.88,2.72,1.79,5.67,3.1,8.7,3.77,6.43,1.34,15.17,2.65,27.1,2.67,11.94-.02,20.68-1.33,27.1-2.67,3.02-.67,5.98-1.99,8.7-3.77,8.65-5.68,13.64-15.53,13.64-25.88V174.98Z" />
      <path d="M511.78,72.95c0-10.35-4.99-20.2-13.64-25.88-2.72-1.79-5.67-3.1-8.7-3.77-6.43-1.34-15.17-2.64-27.1-2.67-11.94,.02-20.68,1.33-27.1,2.67-3.02,.67-5.98,1.99-8.7,3.77-8.65,5.68-13.64,15.53-13.64,25.88V439.05c0,10.35,4.99,20.2,13.64,25.88,2.72,1.79,5.67,3.1,8.7,3.77,6.43,1.34,15.17,2.65,27.1,2.67,11.94-.02,20.68-1.33,27.1-2.67,3.02-.67,5.98-1.99,8.7-3.77,8.65-5.68,13.64-15.53,13.64-25.88V72.95Z" />
    </svg>
  );
}

function IosWifiIcon() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 1024 800"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M512 192c-163 0-326 67.2-443 176.6-6.6 6-6.8 16.2-0.6 22.8l53.4 55.8c6.2 6.6 16.6 6.8 23.2 0.6 46.6-43.2 99.8-77.6 158.6-102 66-27.6 136.2-41.4 208.6-41.4s142.6 14 208.6 41.4c58.8 24.6 112 58.8 158.6 102 6.6 6.2 17 6 23.2-0.6l53.4-55.8c6.2-6.4 6-16.6-0.6-22.8C838 259.2 675 192 512 192z" />
      <path d="M226.4 555l57.2 56.6c6.2 6 16 6.4 22.4 0.6 56.6-50.2 129.2-77.8 205.8-77.8s149.2 27.4 205.8 77.8c6.4 5.8 16.2 5.4 22.4-0.6l57.2-56.6c6.6-6.6 6.4-17.2-0.6-23.4-75-67.8-175.2-109.2-285-109.2s-210 41.4-285 109.2c-6.6 6.2-6.8 16.8-0.2 23.4z" />
      <path d="M512 648.4c-46.8 0-89.2 19.6-118.8 51-6 6.4-5.8 16.2 0.4 22.4l106.8 105.4c6.4 6.4 16.8 6.4 23.2 0l106.8-105.4c6.2-6.2 6.4-16 0.4-22.4-29.6-31.2-72-51-118.8-51z" />
    </svg>
  );
}

function IosBatteryIcon({
  level = 100,
  charging = false,
}: {
  level?: number;
  charging?: boolean;
}) {
  const fillColor = charging
    ? "#34c759"
    : level <= 20
      ? "#ff3b30"
      : "currentColor";
  const innerX = 54.3;
  const innerY = 48.54;
  const innerW = 348.0;
  const innerH = 161.17;
  const fillW = Math.max(0, (innerW * level) / 100);

  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 512 150"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="battery-fill-clip">
          <rect
            x={innerX}
            y={innerY}
            width={innerW}
            height={innerH}
            rx="15"
            ry="15"
          />
        </clipPath>
      </defs>
      {fillW > 0 && (
        <rect
          x={innerX}
          y={innerY}
          width={fillW}
          height={innerH}
          rx="15"
          ry="15"
          fill={fillColor}
          clipPath="url(#battery-fill-clip)"
        />
      )}
      <path
        fillRule="nonzero"
        d="M472.06 38.53v29.62h27.84c3.36 0 6.38 1.37 8.55 3.55 2.19 2.19 3.55 5.25 3.55 8.55v97.76c0 3.32-1.39 6.37-3.56 8.54-2.17 2.16-5.22 3.56-8.54 3.56h-27.84v29.61c0 21.2-17.35 38.53-38.53 38.53h-395C17.33 258.25 0 240.93 0 219.72V38.53C0 17.35 17.37 0 38.53 0h395c21.22 0 38.53 17.31 38.53 38.53zm-69.88 10.01c8.57 0 15.59 7.13 15.59 15.59v129.99c0 8.46-7.13 15.59-15.59 15.59H69.88c-8.46 0-15.58-7.02-15.58-15.59V64.13c0-8.57 7.01-15.59 15.58-15.59h332.3zm44.42 168.41V41.3c0-8.69-7.15-15.84-15.83-15.84H41.3c-8.71 0-15.84 7.13-15.84 15.84v175.65c0 8.68 7.17 15.84 15.84 15.84h389.47c8.69 0 15.83-7.12 15.83-15.84z"
      />
      {charging && (
        <path
          d="M278 58 L230 140 h38 L244 198 L300 110 h-40 Z"
          fill="currentColor"
          opacity="0.9"
        />
      )}
    </svg>
  );
}

function IosAppContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full bg-[#f2f2f7] dark:bg-black text-black dark:text-white font-sans overflow-hidden select-none pb-6">
      <div className="flex items-center justify-between px-4 h-[88px] bg-[#f2f2f7]/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 z-10 pt-[44px] shrink-0">
        <div className="w-[60px]" />
        <span className="font-semibold text-base md:text-lg truncate max-w-[150px]">
          {title}
        </span>
        <div className="w-[60px]" />
      </div>
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </div>
  );
}

export function IosLayout() {
  const {
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
  } = useIosLayout();

  const renderApp = () => {
    switch (activeApp) {
      case "dashboard":
        return (
          <IosAppContainer title={t("dashboard.dockLabel")}>
            <DashboardWindow />
          </IosAppContainer>
        );
      case "settings":
        return <IosSettings onClose={() => setActiveApp(null)} />;
      case "phone":
        return (
          <IosAppContainer title="Phone">
            <PhoneWindow />
          </IosAppContainer>
        );
      case "notes":
        return (
          <IosAppContainer title="Notes">
            <NotesWindow />
          </IosAppContainer>
        );
      case "calendar":
        return (
          <IosAppContainer title="Calendar">
            <CalendarWindow />
          </IosAppContainer>
        );
      case "safari":
        return (
          <IosAppContainer title="Safari">
            <SafariWindow />
          </IosAppContainer>
        );
      case "messages":
        return (
          <IosAppContainer title="Messages">
            <MessagesWindow />
          </IosAppContainer>
        );
      case "mail":
        return <MailWindow />;
      default:
        return null;
    }
  };

  const renderIcon = (app: { id: string; name: string; icon: string }) => (
    <button
      id={`ios-app-${app.id}`}
      onClick={() => setActiveApp(app.id as AppType)}
      className={`w-[52px] h-[52px] rounded-[11px] flex items-center justify-center shadow-sm active:opacity-70 transition-opacity overflow-hidden ${app.id === "dashboard" ? "bg-white rounded-sm p-1" : "bg-white/5 border border-white/5"} bg-transparent`}
    >
      <img
        src={app.icon}
        alt={app.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex flex-col font-sans select-none antialiased text-white">
      <WallpaperBackground id={wallpaper} layout="ios" />

      <div
        id="ios-status-bar"
        className={cn(
          "absolute top-0 left-0 right-0 z-30 h-[44px] flex justify-between items-center px-6 text-[15px] font-semibold transition-colors duration-300",
          activeApp
            ? "text-black dark:text-white"
            : "text-white drop-shadow-md",
        )}
      >
        <span>
          {currentTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
        <div className="flex items-center gap-1.5">
          <IosSignalIcon />
          <IosWifiIcon />
          <IosBatteryIcon level={level} charging={charging} />
        </div>
      </div>

      <div className="relative z-10 flex-1 w-full overflow-hidden flex flex-col justify-between pb-8">
        <AnimatePresence mode="wait">
          {activeApp ? (
            <AppWrapper
              layoutKey={`active-app-${activeApp}`}
              edgeDragX={edgeDragX}
              appY={appY}
              appScale={appScale}
              appBorderRadius={appBorderRadius}
              appOpacity={appOpacity}
            >
              {renderApp()}
            </AppWrapper>
          ) : (
            <motion.div
              key="home-screen"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 pt-16 flex flex-col justify-between"
            >
              <div
                id="ios-app-grid"
                className="grid grid-cols-4 gap-x-4 gap-y-8 px-6"
              >
                {IOS_APPS.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col items-center gap-1.5"
                  >
                    {renderIcon(app)}
                    <span className="text-[11px] font-medium text-white drop-shadow-md">
                      {getAppLabel(app.id, app.name)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                id="ios-dock"
                className="mx-4 mb-8 rounded-[24px] bg-white/20 backdrop-blur-2xl border border-white/10 p-4 flex justify-between"
              >
                {IOS_DOCK_APPS.map((app) => (
                  <div key={app.id} className="flex flex-col items-center">
                    {renderIcon(app)}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        id="ios-home-indicator"
        drag={activeApp ? "y" : false}
        dragConstraints={{ top: -150, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        dragMomentum={false}
        style={{ y: homeDragY }}
        onDragEnd={handleHomeDragEnd}
        onClick={() => {
          if (activeApp) setActiveApp(null);
        }}
        className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center pb-2 z-30 cursor-pointer outline-none border-none bg-transparent"
        aria-label="Home"
      >
        <motion.div
          whileHover={{ scaleX: 1.05, scaleY: 1.2 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-[140px] h-1.5 rounded-full shadow-sm transition-colors duration-200",
            activeApp ? "bg-black/60 dark:bg-white/60" : "bg-white/60",
          )}
        />
      </motion.button>

      {activeApp && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 375 }}
          dragElastic={{ left: 0, right: 0.2 }}
          dragMomentum={false}
          style={{ x: edgeDragX }}
          onDragEnd={handleEdgeDragEnd}
          className="absolute left-0 top-0 bottom-0 w-8 z-45 cursor-ew-resize bg-transparent"
        />
      )}

      <IosTutorial setActiveApp={setActiveApp} />
    </div>
  );
}
