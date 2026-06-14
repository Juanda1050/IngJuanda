import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

export function IpadosWallpaper({
  thumbnail = false,
}: {
  thumbnail?: boolean;
}) {
  const graphicsAcceleration = useUiStore((state) => state.graphicsAcceleration);

  // SVG dimensions for iPad view
  const viewBox = "0 0 1366 1024";
  const width = 1366;
  const height = 1024;

  const waveShadow = graphicsAcceleration ? "url(#ipad-wave-shadow)" : undefined;

  return (
    <div
      className={cn(
        "w-full h-full select-none overflow-hidden transition-all duration-700 ease-out-quint",
        thumbnail ? "absolute inset-0 rounded-xl" : "fixed inset-0 z-[-10]"
      )}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full scale-105 pointer-events-none select-none"
      >
        <defs>
          {/* Subtle noise/grain filter for premium feel */}
          <filter id="ipad-wallpaper-noise" x="0" y="0" width={width} height={height} filterUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.045 0" />
          </filter>

          {/* Deep professional shadows */}
          <filter id="ipad-wave-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx={-5}
              dy={15}
              stdDeviation={20}
              floodColor="#000000"
              floodOpacity={0.8}
            />
          </filter>

          {/* Slate & Gunmetal Gradients */}
          <radialGradient id="ipad-radial-bg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Silver/Steel Metallic Outline Gradients */}
          <linearGradient id="metal-silver-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="35%" stopColor="#475569" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="65%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="metal-chrome-grad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="25%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="75%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="steel-blue-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Base Slate Radial Canvas */}
        <rect width={width} height={height} fill="url(#ipad-radial-bg)" />

        {/* --- Metallic Structural Curves (Premium Gunmetal/Steel Plates) --- */}
        
        {/* Rear Deep Slate Wave */}
        <path
          d="M -100 400 C 300 200, 900 650, 1500 350 L 1500 1100 L -100 1100 Z"
          fill="#0f172a"
          filter={waveShadow}
        />
        <path
          d="M -100 400 C 300 200, 900 650, 1500 350"
          fill="none"
          stroke="url(#metal-silver-grad)"
          strokeWidth="3.5"
          opacity="0.8"
        />

        {/* Middle Charcoal/Zinc Wave */}
        <path
          d="M -100 600 C 400 700, 800 400, 1500 650 L 1500 1100 L -100 1100 Z"
          fill="#18181b"
          filter={waveShadow}
        />
        <path
          d="M -100 600 C 400 700, 800 400, 1500 650"
          fill="none"
          stroke="url(#metal-chrome-grad)"
          strokeWidth="4"
          opacity="0.95"
        />

        {/* Front Dark Carbon Wave */}
        <path
          d="M -100 800 C 350 700, 1000 900, 1500 750 L 1500 1100 L -100 1100 Z"
          fill="#09090b"
          filter={waveShadow}
        />
        <path
          d="M -100 800 C 350 700, 1000 900, 1500 750"
          fill="none"
          stroke="url(#metal-silver-grad)"
          strokeWidth="2.5"
          opacity="0.75"
        />

        {/* Ambient Steel-Blue Light Streaks */}
        {graphicsAcceleration && (
          <>
            <path
              d="M -100 600 C 400 700, 800 400, 1500 650"
              fill="none"
              stroke="url(#steel-blue-grad)"
              strokeWidth="25"
              opacity="0.5"
              filter="url(#glow-blur)"
            />
            <circle cx="1000" cy="300" r="350" fill="#38bdf8" opacity="0.06" filter="url(#aurora-blur-2)" />
            <circle cx="300" cy="700" r="280" fill="#475569" opacity="0.12" filter="url(#aurora-blur-2)" />
          </>
        )}

        {/* Reusable Subtle Noise/Grain Overlay */}
        {graphicsAcceleration && (
          <rect
            width={width}
            height={height}
            fill="#808080"
            filter="url(#ipad-wallpaper-noise)"
            opacity="0.065"
            style={{ mixBlendMode: "overlay" }}
          />
        )}
      </svg>

      {/* Glassy reflection overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/3 via-transparent to-black/30 dark:from-white/1 dark:via-transparent dark:to-black/45" />
    </div>
  );
}
