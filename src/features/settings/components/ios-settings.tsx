import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, Info, Monitor } from "lucide-react";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { WallpaperBackground } from "@/components/wallpaper-background";

export function IosSettings() {
  const { t, i18n } = useTranslation("common");
  const { theme, setTheme } = useTheme();
  const wallpaper = useUiStore((state) => state.wallpaper);
  const setWallpaper = useUiStore((state) => state.setWallpaper);

  const wallpaperOptions = [
    { id: "default", label: t("settings.desktop.options.default", "Default") },
    { id: "monterey", label: t("settings.desktop.options.monterey", "Monterey") },
    { id: "sonoma", label: t("settings.desktop.options.sonoma", "Sonoma") },
    { id: "aurora", label: t("settings.desktop.options.aurora", "Aurora") },
    { id: "midnight", label: t("settings.desktop.options.midnight", "Midnight") },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ];

  const themes = [
    { id: "light", label: t("settings.appearance.light", "Light"), icon: Sun },
    { id: "dark", label: t("settings.appearance.dark", "Dark"), icon: Moon },
    {
      id: "system",
      label: t("settings.appearance.system", "System"),
      icon: Monitor,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f2f2f7] dark:bg-black text-black dark:text-white font-sans select-none pb-6">
      {/* iOS Navigation Bar */}
      <div className="flex items-center justify-between px-4 h-[88px] bg-[#f2f2f7]/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 z-10 pt-[44px]">
        <div className="w-[60px]" /> {/* Spacer for centering */}
        <span className="font-semibold text-lg">
          {t("settings.title", "Settings")}
        </span>
        <div className="w-[60px]" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Appearance Group */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-500 uppercase ml-4">
            {t("settings.appearance.title", "Appearance")}
          </span>
          <div className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-white/10">
            {themes.map((mode) => {
              const Icon = mode.icon;
              const isActive = theme === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setTheme(mode.id)}
                  className="w-full flex items-center justify-between px-4 py-3 active:bg-gray-100 dark:active:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-blue-500 text-white flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                    <span className="text-[17px]">{mode.label}</span>
                  </div>
                  {isActive && <span className="text-blue-500 text-lg">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Group */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-500 uppercase ml-4">
            {t("settings.language.title", "Language")}
          </span>
          <div className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-white/10">
            {languages.map((lang) => {
              const isActive = i18n.language.startsWith(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className="w-full flex items-center justify-between px-4 py-3 active:bg-gray-100 dark:active:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-green-500 text-white flex items-center justify-center">
                      <Globe size={16} />
                    </div>
                    <span className="text-[17px]">{lang.label}</span>
                  </div>
                  {isActive && <span className="text-blue-500 text-lg">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wallpaper Group */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-500 uppercase ml-4">
            {t("settings.desktop.title", "Wallpaper")}
          </span>
          <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4">
            <div className="grid grid-cols-3 gap-3">
              {wallpaperOptions.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setWallpaper(wp.id)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-full aspect-[9/16] rounded-lg border shadow-sm transition-all relative overflow-hidden",
                      wallpaper === wp.id
                        ? "border-blue-500 ring-2 ring-blue-500/50 scale-105"
                        : "border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100",
                    )}
                  >
                    <WallpaperBackground id={wp.id} thumbnail={true} layout="ios" />
                    {wallpaper === wp.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <span className="text-white text-[10px] font-bold bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-center truncate w-full text-foreground/80">
                    {wp.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* About Group */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-500 uppercase ml-4">
            {t("settings.sidebar.about", "About")}
          </span>
          <div className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-white/10">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-gray-400 text-white flex items-center justify-center">
                  <Info size={16} />
                </div>
                <span className="text-[17px]">Developer</span>
              </div>
              <span className="text-gray-500 text-[17px]">
                Juan Daniel Gonzalez
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[17px] ml-10">Version</span>
              <span className="text-gray-500 text-[17px]">2026 Edition</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
