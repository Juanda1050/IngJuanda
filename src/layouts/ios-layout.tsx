import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Battery, Signal } from "lucide-react";
import { CalendarWindow } from "@/features/calendar/components/calendar-window";
import { NotesWindow } from "@/features/notes/components/notes-window";
import { SafariWindow } from "@/features/safari/components/safari-window";
import { MessagesWindow } from "@/features/messages/components/messages-window";
import { MailWindow } from "@/features/mail/components/mail-window";
import { cn } from "@/lib/utils";
import { IosTutorial } from "@/components/ios-tutorial";
import { IosSettings } from "@/features/settings/components/ios-settings";
import { useUiStore } from "@/store/ui-store";
import { PhoneWindow } from "@/features/phone/components/phone-window";

const WALLPAPER_CLASSES: Record<string, string> = {
  default:
    "bg-gradient-to-br from-blue-200 to-blue-400 dark:from-slate-900 dark:to-blue-950",
  monterey:
    "bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-700 dark:from-purple-900 dark:via-indigo-950 dark:to-zinc-950",
  sonoma:
    "bg-gradient-to-br from-amber-400 via-orange-500 to-emerald-600 dark:from-amber-950 dark:via-orange-950 dark:to-emerald-950",
  aurora:
    "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950",
  midnight: "bg-zinc-100 dark:bg-zinc-950",
};

function IosAppContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full w-full bg-[#f2f2f7] dark:bg-black text-black dark:text-white font-sans overflow-hidden select-none pb-6">
      {/* iOS Navigation Bar */}
      <div className="flex items-center justify-between px-4 h-[88px] bg-[#f2f2f7]/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 z-10 pt-[44px] shrink-0">
        <div className="w-[60px]" /> {/* Spacer for centering */}
        <span className="font-semibold text-base md:text-lg truncate max-w-[150px]">
          {title}
        </span>
        <div className="w-[60px]" /> {/* Spacer for centering */}
      </div>
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </div>
  );
}

const IOS_APPS = [
  {
    id: "settings",
    name: "Settings",
    icon: "/dock-icons/settings.svg",
    color: "#8E8E93",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "/dock-icons/calendar.svg",
    color: "#fff",
  },
  { id: "notes", name: "Notes", icon: "/dock-icons/notes.svg", color: "#fff" },
];

const IOS_DOCK_APPS = [
  {
    id: "phone",
    name: "Phone",
    icon: "/dock-icons/phone.svg",
    color: "#34C759",
  },
  {
    id: "safari",
    name: "Safari",
    icon: "/dock-icons/safari.svg",
    color: "#fff",
  },
  {
    id: "messages",
    name: "Messages",
    icon: "/dock-icons/messages.svg",
    color: "#34C759",
  },
  { id: "mail", name: "Mail", icon: "/dock-icons/mail.svg", color: "#007AFF" },
];

export function IosLayout() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const wallpaper = useUiStore((state) => state.wallpaper);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderApp = () => {
    switch (activeApp) {
      case "settings":
        return <IosSettings />;
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
        return (
          <IosAppContainer title="Mail">
            <MailWindow />
          </IosAppContainer>
        );
      default:
        return null;
    }
  };

  const renderIcon = (app: any) => (
    <button
      id={`ios-app-${app.id}`}
      onClick={() => setActiveApp(app.id)}
      className="w-[60px] h-[60px] rounded-[14px] flex items-center justify-center shadow-sm active:opacity-70 transition-opacity overflow-hidden bg-transparent"
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
      {/* iOS Background */}
      <div
        className={cn(
          "absolute inset-0 z-0 transition-all duration-500",
          WALLPAPER_CLASSES[wallpaper] || WALLPAPER_CLASSES.default,
        )}
      />

      {/* iOS Status Bar */}
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
          <Signal size={16} />
          <Wifi size={16} />
          <Battery size={20} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 w-full overflow-hidden flex flex-col justify-between pb-8">
        <AnimatePresence>
          {activeApp ? (
            <motion.div
              key="active-app"
              initial={{ scale: 0.2, y: 350, opacity: 0, borderRadius: "40px" }}
              animate={{ scale: 1, y: 0, opacity: 1, borderRadius: "0px" }}
              exit={{ scale: 0.2, y: 350, opacity: 0, borderRadius: "40px" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-0 bg-black z-20 overflow-hidden"
            >
              {renderApp()}
            </motion.div>
          ) : (
            <motion.div
              key="home-screen"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pt-16 flex flex-col justify-between"
            >
              {/* App Grid */}
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
                      {app.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* iOS Dock */}
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

      {/* iOS Home Indicator */}
      <button
        id="ios-home-indicator"
        onClick={() => setActiveApp(null)}
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
      </button>

      <IosTutorial />
    </div>
  );
}
