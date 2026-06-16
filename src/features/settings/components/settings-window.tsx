import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import {
  Image,
  Monitor,
  Volume2,
  VolumeX,
  Battery,
  Wifi,
  Laptop,
  ExternalLink,
  Moon,
  Sun,
  ArrowUpRight,
  BatteryCharging,
} from "lucide-react";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/ui";
import { SiApple } from "react-icons/si";
import { WallpaperBackground } from "@/components/wallpaper-background";
import type { TFunction } from "i18next";

interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

interface NetworkInformation extends EventTarget {
  downlink?: number;
  effectiveType?: string;
  type?: string;
}

interface ExtendedNavigator extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

type TabId =
  | "profile"
  | "appearance"
  | "desktop"
  | "displays"
  | "sound"
  | "battery"
  | "wifi"
  | "about";

function ToggleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle cx="15" cy="12" r="4.5" fill="currentColor" />
    </svg>
  );
}

function formatBatteryTime(seconds: number | null, t: TFunction): string {
  if (
    seconds === null ||
    seconds === Infinity ||
    isNaN(seconds) ||
    seconds === 0
  ) {
    return t("settings.battery.calculating");
  }

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0) {
    return t("settings.battery.hoursAndMins", {
      hrs,
      mins,
    });
  }

  return t("settings.battery.onlyMins", { mins });
}

export function SettingsWindow() {
  const { t } = useTranslation("common");
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const volume = useUiStore((state) => state.volume);
  const setVolume = useUiStore((state) => state.setVolume);
  const muted = useUiStore((state) => state.muted);
  const setMuted = useUiStore((state) => state.setMuted);

  const wallpaper = useUiStore((state) => state.wallpaper);
  const setWallpaper = useUiStore((state) => state.setWallpaper);

  const brightness = useUiStore((state) => state.brightness);
  const setBrightness = useUiStore((state) => state.setBrightness);

  const nightShift = useUiStore((state) => state.nightShift);
  const setNightShift = useUiStore((state) => state.setNightShift);

  const graphicsAcceleration = useUiStore(
    (state) => state.graphicsAcceleration,
  );
  const setGraphicsAcceleration = useUiStore(
    (state) => state.setGraphicsAcceleration,
  );

  const finderClickMode = useUiStore((state) => state.finderClickMode);
  const setFinderClickMode = useUiStore((state) => state.setFinderClickMode);

  const [energySaver, setEnergySaver] = useState(false);

  // Hardware Real States
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [chargingTime, setChargingTime] = useState<number | null>(null);
  const [dischargingTime, setDischargingTime] = useState<number | null>(null);

  const [networkType, setNetworkType] = useState<string>("Wi-Fi");
  const [downlink, setDownlink] = useState<number | null>(null);
  const [effectiveType, setEffectiveType] = useState<string>("");

  useEffect(() => {
    const nav = navigator as ExtendedNavigator;

    if (nav.getBattery) {
      nav.getBattery().then((battery: BatteryManager) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        setChargingTime(battery.chargingTime);
        setDischargingTime(battery.dischargingTime);

        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
          setChargingTime(battery.chargingTime);
          setDischargingTime(battery.dischargingTime);
        };

        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
        battery.addEventListener("chargingtimechange", updateBattery);
        battery.addEventListener("dischargingtimechange", updateBattery);

        return () => {
          battery.removeEventListener("levelchange", updateBattery);
          battery.removeEventListener("chargingchange", updateBattery);
          battery.removeEventListener("chargingtimechange", updateBattery);
          battery.removeEventListener("dischargingtimechange", updateBattery);
        };
      });
    }

    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    if (connection) {
      const updateNetwork = () => {
        setNetworkType(connection.type || "Wi-Fi");
        setDownlink(connection.downlink ?? null);
        setEffectiveType(connection.effectiveType ?? "");
      };
      updateNetwork();
      connection.addEventListener("change", updateNetwork);
      return () => connection.removeEventListener("change", updateNetwork);
    }
  }, []);

  const navItems = [
    {
      id: "appearance" as const,
      label: t("settings.sidebar.appearance"),
      icon: ToggleIcon,
      color: "bg-[#007aff]",
    },
    {
      id: "desktop" as const,
      label: t("settings.sidebar.desktop"),
      icon: Image,
      color: "bg-gradient-to-tr from-[#ff5e3a] via-[#ff9500] to-[#ffcc00]",
    },
    {
      id: "displays" as const,
      label: t("settings.sidebar.displays"),
      icon: Monitor,
      color: "bg-[#0a84ff]",
    },
    {
      id: "sound" as const,
      label: t("settings.sidebar.sound"),
      icon: Volume2,
      color: "bg-[#ff2d55]",
    },
    {
      id: "battery" as const,
      label: t("settings.sidebar.battery"),
      icon: Battery,
      color: "bg-[#34c759]",
    },
    {
      id: "wifi" as const,
      label: t("settings.sidebar.wifi"),
      icon: Wifi,
      color: "bg-[#007aff]",
    },
    {
      id: "about" as const,
      label: t("settings.sidebar.about"),
      icon: SiApple,
      color: "bg-[#8e8e93]",
    },
  ];

  const wallpaperOptions = [
    { id: "default", label: t("settings.desktop.options.default") },
    { id: "monterey", label: t("settings.desktop.options.monterey") },
    { id: "sonoma", label: t("settings.desktop.options.sonoma") },
    { id: "aurora", label: t("settings.desktop.options.aurora") },
    { id: "midnight", label: t("settings.desktop.options.midnight") },
  ];

  return (
    <div className="flex h-full w-full bg-[#f3f3f3] dark:bg-[#1a1a1e] text-foreground font-sans text-sm select-none">
      {/* Settings Left Sidebar */}
      <div className="w-56 shrink-0 border-r border-border/40 bg-vscode-sidebar/95 px-2.5 py-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <p className="px-3 text-[10px] font-extrabold text-muted-foreground/80 uppercase tracking-wider select-none">
            System Settings
          </p>

          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl px-2.5 py-2 transition-all text-left outline-none border border-transparent",
              activeTab === "profile"
                ? "bg-[#007aff] text-white shadow-sm"
                : "hover:bg-black/5 dark:hover:bg-white/5 text-foreground",
            )}
          >
            <img
              src="/profile.jpg"
              alt="Profile"
              className="size-10 rounded-full border border-black/10 dark:border-white/10 object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-bold truncate leading-tight">
                Juan Gonzalez
              </p>
              <p
                className={cn(
                  "text-[9.5px] truncate leading-none mt-0.5",
                  activeTab === "profile"
                    ? "text-white/80"
                    : "text-muted-foreground",
                )}
              >
                Apple ID, iCloud, +
              </p>
            </div>
          </button>

          <hr className="border-border/30 mx-1" />

          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all text-left outline-none",
                    isActive
                      ? "bg-[#007aff] text-white shadow-sm"
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "size-6 rounded-md flex items-center justify-center text-white shrink-0 shadow-sm border border-black/5 dark:border-white/5",
                      item.color,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground/60 text-center border-t border-border/30 pt-3 select-none">
          macOS Settings
        </div>
      </div>

      {/* Settings Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-background dark:bg-[#1e1e1e]">
        {/* Render Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-lg">
            <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/30">
              <img
                src="/profile.jpg"
                alt="Juan Gonzalez"
                className="size-16 rounded-full border border-border object-cover"
              />
              <div className="min-w-0">
                <h3 className="text-base font-bold text-foreground">
                  Juan Gonzalez
                </h3>
                <p className="text-xs text-muted-foreground">
                  danielalejandre1050@gmail.com
                </p>
                <p className="text-xs text-primary font-semibold mt-1">
                  Senior Fullstack Developer
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
                {t("settings.profile.subtitle")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="/profile/CV_Juan_Daniel_Gonzalez_ES.pdf"
                  download="CV_Juan_Daniel_Gonzalez_ES.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 hover:translate-y-[-1px] transition-all"
                >
                  <span>{t("settings.profile.downloadEs")}</span>
                  <ArrowUpRight className="size-4 text-blue-500" />
                </a>
                <a
                  href="/profile/Resume_Juan_Daniel_Gonzalez_EN.pdf"
                  download="Resume_Juan_Daniel_Gonzalez_EN.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 hover:translate-y-[-1px] transition-all"
                >
                  <span>{t("settings.profile.downloadEn")}</span>
                  <ArrowUpRight className="size-4 text-blue-500" />
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
                {t("settings.profile.linksTitle")}
              </h4>
              <div className="rounded-xl border border-border bg-background divide-y divide-border/20 overflow-hidden">
                {[
                  {
                    label: "LinkedIn",
                    url: "https://www.linkedin.com/in/daniel-alejandre-3331951b5/",
                    handle: "daniel-alejandre",
                  },
                  {
                    label: "GitHub",
                    url: "https://github.com/Juanda1050",
                    handle: "Juanda1050",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold">{social.label}</span>
                    <span className="text-muted-foreground font-mono text-[11px] flex items-center gap-1">
                      {social.handle}{" "}
                      <ExternalLink className="size-3 text-primary" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-2">
              <h3 className="text-base font-bold">
                {t("settings.appearance.title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("settings.appearance.mode")}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  {
                    id: "light",
                    label: t("settings.appearance.light"),
                    icon: Sun,
                    bg: "bg-white border-zinc-200 dark:text-zinc-900",
                  },
                  {
                    id: "dark",
                    label: t("settings.appearance.dark"),
                    icon: Moon,
                    bg: "bg-zinc-950 border-zinc-800 text-zinc-100",
                  },
                  {
                    id: "system",
                    label: t("settings.appearance.system"),
                    icon: Monitor,
                    bg: "bg-gradient-to-br from-white/50 via-white/45 to-zinc-600/60 border-zinc-200/50",
                  },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setTheme(mode.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-2xl border-2 p-4 text-center transition-all outline-none",
                    theme === mode.id
                      ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                      : "border-border/60 hover:bg-black/5 dark:hover:bg-white/5 bg-background",
                  )}
                >
                  <div
                    className={cn(
                      "size-10 rounded-xl flex items-center justify-center shadow-md border",
                      mode.bg,
                    )}
                  >
                    <mode.icon className="size-5 shrink-0" />
                  </div>
                  <span className="text-xs font-semibold leading-none">
                    {mode.label}
                  </span>
                </button>
              ))}
            </div>

            <hr className="border-border/30" />

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
                {t("settings.appearance.finderTitle")}
              </h4>

              <div className="rounded-2xl border border-border bg-background p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    {t("settings.appearance.finderClickToOpen")}
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-normal max-w-sm">
                    {t("settings.appearance.finderClickToOpenDesc")}
                  </p>
                </div>
                <div className="flex bg-muted/40 dark:bg-black/20 p-1 rounded-xl border border-border/40 w-fit shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setFinderClickMode("single")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      finderClickMode === "single"
                        ? "bg-background text-foreground shadow-sm font-bold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t("settings.appearance.singleClick")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinderClickMode("double")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      finderClickMode === "double"
                        ? "bg-background text-foreground shadow-sm font-bold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t("settings.appearance.doubleClick")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Desktop Tab */}
        {activeTab === "desktop" && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-2">
              <h3 className="text-base font-bold">
                {t("settings.desktop.title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("settings.desktop.select")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wallpaperOptions.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setWallpaper(wp.id)}
                  className={cn(
                    "flex flex-col rounded-2xl border-2 p-2.5 gap-2 transition-all outline-none items-start bg-background",
                    wallpaper === wp.id
                      ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                      : "border-border/60 hover:bg-black/5 dark:hover:bg-white/5",
                  )}
                >
                  <div className="w-full h-16 rounded-xl border border-black/10 dark:border-white/10 shadow-sm shrink-0 overflow-hidden relative">
                    <WallpaperBackground
                      id={wp.id}
                      thumbnail={true}
                      layout="macos"
                    />
                  </div>
                  <span className="text-[11.5px] font-bold px-1">
                    {wp.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Displays Tab */}
        {activeTab === "displays" && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-4">
              <h3 className="text-base font-bold">
                {t("settings.displays.title")}
              </h3>

              <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{t("settings.displays.brightness")}</span>
                  <span className="text-blue-500 font-bold">{brightness}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={brightness}
                    onChange={(e) => setBrightness(+e.target.value)}
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-blue-500 bg-black/10 dark:bg-white/10 outline-none"
                  />
                  <Sun className="size-4.5 text-muted-foreground/60 shrink-0" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 flex items-start gap-4">
                <input
                  type="checkbox"
                  id="night-shift-toggle"
                  checked={nightShift}
                  onChange={(e) => setNightShift(e.target.checked)}
                  className="size-4.5 rounded-md border-border accent-blue-500 text-white cursor-pointer mt-0.5"
                />
                <div className="space-y-1">
                  <label
                    htmlFor="night-shift-toggle"
                    className="text-xs font-bold cursor-pointer hover:text-blue-500 transition-colors"
                  >
                    {t("settings.displays.nightShift")}
                  </label>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {t("settings.displays.nightShiftDesc")}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 flex items-start gap-4">
                <input
                  type="checkbox"
                  id="gfx-accel-toggle"
                  checked={graphicsAcceleration}
                  onChange={(e) => setGraphicsAcceleration(e.target.checked)}
                  className="size-4.5 rounded-md border-border accent-blue-500 text-white cursor-pointer mt-0.5"
                />
                <div className="space-y-1">
                  <label
                    htmlFor="gfx-accel-toggle"
                    className="text-xs font-bold cursor-pointer hover:text-blue-500 transition-colors"
                  >
                    {t("settings.displays.gfxAccel")}
                  </label>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {t("settings.displays.gfxAccelDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Sound Tab */}
        {activeTab === "sound" && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-4">
              <h3 className="text-base font-bold">
                {t("settings.sound.title")}
              </h3>

              <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{t("settings.sound.masterVolume")}</span>
                  <span className="text-blue-500 font-bold">
                    {muted ? 0 : volume}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMuted(!muted)}
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    {muted ? (
                      <VolumeX className="size-4 text-red-500" />
                    ) : (
                      <Volume2 className="size-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={muted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(+e.target.value);
                      setMuted(false);
                    }}
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-blue-500 bg-black/10 dark:bg-white/10 outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 flex items-center justify-between">
                <span className="text-xs font-semibold">
                  {t("settings.sound.mute")}
                </span>
                <input
                  type="checkbox"
                  checked={muted}
                  onChange={(e) => setMuted(e.target.checked)}
                  className="size-4.5 accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Render Battery Tab */}
        {activeTab === "battery" && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-4">
              <h3 className="text-base font-bold">
                {t("settings.battery.title")}
              </h3>

              <div className="rounded-2xl border border-border bg-background p-4 space-y-4 divide-y divide-border/20">
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-semibold">
                      {t("settings.battery.health")}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      {isCharging ? (
                        <>
                          <BatteryCharging className="size-3" />
                          {t("settings.battery.charging", "Charging")}
                        </>
                      ) : (
                        t("settings.battery.onBatteryPower")
                      )}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-emerald-500/35 bg-emerald-500/5 text-emerald-500",
                      batteryLevel !== null &&
                        batteryLevel <= 20 &&
                        !isCharging &&
                        "border-red-500/35 bg-red-500/5 text-red-500",
                    )}
                  >
                    {batteryLevel !== null
                      ? `${batteryLevel}%`
                      : t("settings.battery.calculating")}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 pb-1">
                  <div>
                    <p className="text-xs font-semibold">
                      {t("settings.battery.timeRemaining")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {isCharging
                        ? t("settings.battery.timeUntilFull")
                        : t("settings.battery.usageTime")}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground font-semibold">
                    {isCharging && batteryLevel === 100
                      ? t("settings.battery.fullyCharged")
                      : formatBatteryTime(
                          isCharging ? chargingTime : dischargingTime,
                          t,
                        )}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 flex items-start gap-4">
                <input
                  type="checkbox"
                  id="energy-saver-toggle"
                  checked={energySaver}
                  onChange={(e) => setEnergySaver(e.target.checked)}
                  className="size-4.5 rounded-md border-border accent-blue-500 text-white cursor-pointer mt-0.5"
                />
                <div className="space-y-1">
                  <label
                    htmlFor="energy-saver-toggle"
                    className="text-xs font-bold cursor-pointer hover:text-blue-500 transition-colors"
                  >
                    {t("settings.battery.energySaver")}
                  </label>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {t("settings.battery.energySaverDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Wi-Fi Tab */}
        {activeTab === "wifi" && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-4">
              <h3 className="text-base font-bold">
                {t("settings.wifi.title")}
              </h3>

              <div className="rounded-2xl border border-border bg-background p-4 divide-y divide-border/20">
                <div className="flex justify-between py-2.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t("settings.wifi.networkName")}
                  </span>
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5 capitalize">
                    <Wifi className="size-3.5 text-green-500" />{" "}
                    {networkType === "wifi" || networkType === "Unknown"
                      ? "Local Network"
                      : networkType}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t("settings.wifi.ipAddress")}
                  </span>
                  <span className="text-xs font-mono font-semibold text-muted-foreground">
                    Private
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t("settings.wifi.connectionQuality")}
                  </span>
                  <span className="text-xs font-bold text-green-500 uppercase">
                    {effectiveType || "Excellent"}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t("settings.wifi.speed")}
                  </span>
                  <span className="text-xs font-semibold">
                    {downlink ? `${downlink} Mbps` : "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t("settings.wifi.secProtocol")}
                  </span>
                  <span className="text-xs font-semibold">WPA2/WPA3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render About Tab */}
        {activeTab === "about" && (
          <div className="space-y-6 max-w-md mx-auto text-center py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="size-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg border border-white/20 select-none">
                <Laptop className="size-9 animate-pulse" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-foreground mt-2">
                Juanda's MacBook Pro
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono select-none">
                2026 Developer Edition
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background text-left p-4 space-y-3 shadow-sm select-text">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-muted-foreground">
                  {t("settings.about.chip")}
                </span>
                <span className="font-medium text-foreground text-right">
                  {t("settings.about.chipVal")}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-muted-foreground">
                  {t("settings.about.memory")}
                </span>
                <span className="font-medium text-foreground text-right">
                  {t("settings.about.memoryVal")}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-muted-foreground">
                  {t("settings.about.storage")}
                </span>
                <span className="font-medium text-foreground text-right">
                  {t("settings.about.storageVal")}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-muted-foreground">
                  {t("settings.about.osVersion")}
                </span>
                <span className="font-medium text-foreground text-right">
                  {t("settings.about.osVersionVal")}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-muted-foreground">
                  {t("settings.about.serial")}
                </span>
                <span className="font-mono text-foreground text-right select-all">
                  {t("settings.about.serialVal")}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground/60 select-none leading-relaxed">
              ™ and © 2026 Juan Daniel Gonzalez Alejandre. All rights reserved.
              <br />
              Custom engineering, design layout, and interactive logic modules.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
