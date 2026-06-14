import { cn } from "@/lib/utils";

function IpadosSignalIcon() {
  return (
    <svg
      width="16"
      height="11"
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

function IpadosWifiIcon() {
  return (
    <svg
      width="15"
      height="11"
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

function IpadosBatteryIcon({
  level = 100,
  charging = false,
}: {
  level?: number;
  charging?: boolean;
}) {
  const fillColor = charging
    ? "#30d158" // Apple battery green dark
    : level <= 20
      ? "#ff453a" // Apple battery red dark
      : "currentColor";

  const innerX = 54.3;
  const innerY = 48.54;
  const innerW = 348.0;
  const innerH = 161.17;
  const fillW = Math.max(0, (innerW * level) / 100);

  return (
    <svg
      width="18"
      height="11"
      viewBox="0 0 512 150"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none overflow-visible shrink-0"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="ipad-battery-fill-clip">
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
          clipPath="url(#ipad-battery-fill-clip)"
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

export function IpadosStatusBar({
  currentTime,
  level,
  charging,
  activeApp,
}: {
  currentTime: Date;
  level: number;
  charging: boolean;
  activeApp: string | null;
}) {
  // Format Date for iPadOS top bar (e.g. "Sun Jun 14 9:59 AM")
  const dateStr = currentTime.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  
  const timeStr = currentTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      id="ipados-status-bar"
      className={cn(
        "absolute top-0 left-0 right-0 z-30 h-[28px] flex justify-between items-center px-6 text-xs font-semibold select-none transition-colors duration-300",
        activeApp
          ? "text-black dark:text-white bg-slate-900/10 dark:bg-black/10 backdrop-blur-sm"
          : "text-white/95 drop-shadow-md",
      )}
    >
      <div className="flex items-center gap-1.5">
        <span>{dateStr}</span>
        <span className="opacity-50">•</span>
        <span>{timeStr}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <IpadosSignalIcon />
        <IpadosWifiIcon />
        <div className="flex items-center gap-1">
          <IpadosBatteryIcon level={level} charging={charging} />
        </div>
      </div>
    </div>
  );
}
