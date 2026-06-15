import { motion, AnimatePresence } from "framer-motion";
import { CalendarWindow } from "@/features/calendar/components/calendar-window";
import { NotesWindow } from "@/features/notes/components/notes-window";
import { SafariWindow } from "@/features/safari/components/safari-window";
import { MessagesWindow } from "@/features/messages/messages-window";
import { MailWindow } from "@/features/mail/components/mail-window";
import { PhoneWindow } from "@/features/phone/components/phone-window";
import { DashboardWindow } from "@/features/dashboard/components/dashboard-window";
import { IosSettings } from "@/features/settings/components/ios-settings";
import { cn } from "@/lib/utils";

import { useIpadosLayout, type AppType } from "./hooks/use-ipados-layout";
import { AppWrapper } from "@/components/app-wrapper";
import { WallpaperBackground } from "@/components/wallpaper-background";
import { IpadosStatusBar } from "./components/ipados-status-bar";
import { IpadosAppGrid } from "./components/ipados-app-grid";
import { IpadosDock } from "./components/ipados-dock";
import { IpadosTutorial } from "./components/ipados-tutorial";
import { IPADOS_APPS, IPADOS_DOCK_APPS } from "./constants/ipados-apps";

function IpadosAppContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full bg-[#f2f2f7] dark:bg-black text-black dark:text-white font-sans overflow-hidden select-none pb-6">
      <div className="flex items-center justify-between px-6 h-[80px] bg-[#f2f2f7]/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 z-10 pt-[28px] shrink-0">
        <div className="w-[60px]" />
        <span className="font-bold text-base md:text-lg tracking-wide truncate max-w-[200px]">
          {title}
        </span>
        <div className="w-[60px]" />
      </div>
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </div>
  );
}

export function IpadosLayout() {
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
  } = useIpadosLayout();

  const renderApp = () => {
    switch (activeApp) {
      case "dashboard":
        return (
          <IpadosAppContainer title={t("dashboard.dockLabel")}>
            <DashboardWindow />
          </IpadosAppContainer>
        );
      case "settings":
        return <IosSettings onClose={() => setActiveApp(null)} layout="ipad" />;
      case "phone":
        return (
          <IpadosAppContainer title="Phone">
            <PhoneWindow />
          </IpadosAppContainer>
        );
      case "notes":
        return (
          <IpadosAppContainer title="Notes">
            <NotesWindow />
          </IpadosAppContainer>
        );
      case "calendar":
        return (
          <IpadosAppContainer title="Calendar">
            <CalendarWindow />
          </IpadosAppContainer>
        );
      case "safari":
        return (
          <IpadosAppContainer title="Safari">
            <SafariWindow />
          </IpadosAppContainer>
        );
      case "messages":
        return (
          <IpadosAppContainer title="Messages">
            <MessagesWindow />
          </IpadosAppContainer>
        );
      case "mail":
        return <MailWindow />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex flex-col font-sans select-none antialiased text-white">
      {/* Exclusive Slate/Metallic Wallpaper Background */}
      <WallpaperBackground id={wallpaper} layout="ipad" />

      {/* iPadOS top status bar */}
      <IpadosStatusBar
        currentTime={currentTime}
        level={level}
        charging={charging}
        activeApp={activeApp}
      />

      {/* Main workspace container */}
      <div className="relative z-10 flex-1 w-full overflow-hidden flex flex-col justify-between pt-7 pb-8">
        <AnimatePresence mode="wait">
          {activeApp ? (
            <AppWrapper
              layoutKey={`active-app-ipad-${activeApp}`}
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
              key="home-screen-ipad"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 pt-10 flex flex-col justify-between"
            >
              {/* Spaced grid of apps */}
              <div className="flex-1 pt-12 px-12 md:px-24">
                <IpadosAppGrid
                  apps={IPADOS_APPS}
                  onAppClick={(id) => setActiveApp(id as AppType)}
                  getAppLabel={getAppLabel}
                />
              </div>

              {/* Centered wide dock */}
              <IpadosDock
                apps={IPADOS_DOCK_APPS}
                onAppClick={(id) => setActiveApp(id as AppType)}
                activeApp={activeApp}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe up Home indicator */}
      <motion.button
        id="ipados-home-indicator"
        drag={activeApp ? "y" : false}
        dragConstraints={{ top: -150, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        dragMomentum={false}
        style={{ y: homeDragY }}
        onDragEnd={handleHomeDragEnd}
        onTap={() => {
          if (activeApp) setActiveApp(null);
        }}
        onClick={() => {
          if (activeApp) setActiveApp(null);
        }}
        className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center pb-2 z-30 cursor-pointer outline-none border-none bg-transparent"
        aria-label="Home"
      >
        <motion.div
          whileHover={{ scaleX: 1.05, scaleY: 1.2 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            if (activeApp) setActiveApp(null);
          }}
          className={cn(
            "w-[180px] h-1.5 rounded-full shadow-sm transition-colors duration-200",
            activeApp ? "bg-black/60 dark:bg-white/60" : "bg-white/60",
          )}
        />
      </motion.button>

      {/* Swipe back gesture detector (left edge) */}
      {activeApp && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 400 }}
          dragElastic={{ left: 0, right: 0.25 }}
          dragMomentum={false}
          style={{ x: edgeDragX }}
          onDragEnd={handleEdgeDragEnd}
          className="absolute left-0 top-0 bottom-0 w-8 z-45 cursor-ew-resize bg-transparent"
        />
      )}

      {/* Adapted Tutorial Spotlight */}
      <IpadosTutorial setActiveApp={setActiveApp} />
    </div>
  );
}
