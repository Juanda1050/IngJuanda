import { memo, useMemo } from "react";
import { type IpadosApp } from "../constants/ipados-apps";

interface IpadosDockProps {
  apps: IpadosApp[];
  onAppClick: (appId: string) => void;
  activeApp: string | null;
}

export const IpadosDock = memo(({
  apps,
  onAppClick,
  activeApp,
}: IpadosDockProps) => {
  // Strictly filter out "vscode" from the dock array
  const filteredDockApps = useMemo(() => {
    return apps.filter((app) => app.id !== "vscode");
  }, [apps]);

  return (
    <div className="w-full flex justify-center px-4 mb-8 select-none">
      <div
        id="ipados-dock"
        className="rounded-[20px] bg-[#1c1c1e]/40 border border-white/10 p-2.5 px-5 flex items-center gap-4 justify-center backdrop-blur-3xl shadow-2xl transition-all duration-300"
      >
        {filteredDockApps.map((app) => {
          const isActive = activeApp === app.id;
          return (
            <button
              key={app.id}
              id={`ipados-app-${app.id}`}
              onClick={() => onAppClick(app.id)}
              className="w-[52px] h-[52px] rounded-[11px] flex items-center justify-center shadow-md hover:shadow-xl active:opacity-75 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden bg-white/5 border border-white/5 relative group"
              aria-label={`Open ${app.name}`}
            >
              <img
                src={app.icon}
                alt={app.name}
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white/80" />
              )}
              {/* App name tooltip on hover */}
              <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900/90 text-white border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-lg">
                {app.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

IpadosDock.displayName = "IpadosDock";
