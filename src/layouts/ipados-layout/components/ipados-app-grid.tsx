import { memo, useMemo } from "react";
import { type IpadosApp } from "../constants/ipados-apps";

interface IpadosAppGridProps {
  apps: IpadosApp[];
  onAppClick: (appId: string) => void;
  getAppLabel: (appId: string, appName: string) => string;
}

// Memoized individual app item
const AppItem = memo(({
  app,
  onClick,
  label,
}: {
  app: IpadosApp;
  onClick: (id: string) => void;
  label: string;
}) => {
  return (
    <div
      className="flex flex-col items-center gap-2 group cursor-pointer"
      onClick={() => onClick(app.id)}
    >
      <button
        id={`ipados-app-${app.id}`}
        className="w-[56px] h-[56px] rounded-[12px] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md"
        aria-label={`Open ${label}`}
      >
        <img
          src={app.icon}
          alt={app.name}
          className="w-full h-full object-cover pointer-events-none"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </button>
      <span className="text-[11px] font-semibold text-white text-center drop-shadow-md select-none group-hover:text-slate-200 transition-colors">
        {label}
      </span>
    </div>
  );
});

AppItem.displayName = "AppItem";

export const IpadosAppGrid = memo(({
  apps,
  onAppClick,
  getAppLabel,
}: IpadosAppGridProps) => {
  // Strictly filter out "vscode" from the grid array
  const filteredGridApps = useMemo(() => {
    return apps.filter((app) => app.id !== "vscode");
  }, [apps]);

  return (
    <div
      id="ipados-app-grid"
      className="grid grid-cols-4 gap-x-12 gap-y-10 px-8 py-6 w-full max-w-3xl mx-auto"
    >
      {filteredGridApps.map((app) => (
        <AppItem
          key={app.id}
          app={app}
          onClick={onAppClick}
          label={getAppLabel(app.id, app.name)}
        />
      ))}
    </div>
  );
});

IpadosAppGrid.displayName = "IpadosAppGrid";
