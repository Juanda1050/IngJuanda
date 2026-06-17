import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/ui-store'

export function WallpaperBackground({
  id,
  thumbnail = false,
  layout = 'macos',
}: {
  id: string
  thumbnail?: boolean
  layout?: 'macos' | 'ios' | 'ipad'
}) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const graphicsAcceleration = useUiStore((state) => state.graphicsAcceleration)

  const isIos = layout === 'ios'
  const isIpad = layout === 'ipad'
  const viewBox = isIos ? '0 0 900 1440' : isIpad ? '0 0 1366 1024' : '0 0 1440 900'
  const width = isIos ? 900 : isIpad ? 1366 : 1440
  const height = isIos ? 1440 : isIpad ? 1024 : 900

  const waveShadow = graphicsAcceleration ? 'url(#wave-shadow)' : undefined
  const glowBlur = graphicsAcceleration ? 'url(#glow-blur)' : undefined

  return (
    <div
      className={cn(
        'w-full h-full select-none overflow-hidden transition-all duration-700 ease-out-quint',
        thumbnail ? 'absolute inset-0 rounded-xl' : 'fixed inset-0 z-[-10]'
      )}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full scale-105 pointer-events-none select-none"
      >
        <defs>
          <filter id="wallpaper-noise" x="0" y="0" width={width} height={height} filterUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.055 0" />
          </filter>

          {/* Depth Drop Shadows */}
          <filter id="wave-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx={0}
              dy={thumbnail ? 3 : 15}
              stdDeviation={thumbnail ? 4 : 22}
              floodColor="#000000"
              floodOpacity={isDark ? 0.45 : 0.25}
            />
          </filter>

          <filter id="ios-cup-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx={0}
              dy={thumbnail ? 4 : 25}
              stdDeviation={thumbnail ? 5 : 30}
              floodColor="#000000"
              floodOpacity="0.65"
            />
          </filter>

          {/* Glow/Flare Blur */}
          <filter id="glow-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={thumbnail ? 3 : 15} />
          </filter>

          {/* Large Aurora Blur */}
          <filter id="aurora-blur-1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={thumbnail ? 10 : 45} />
          </filter>
          <filter id="aurora-blur-2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={thumbnail ? 15 : 60} />
          </filter>
          <filter id="mesh-blur-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={thumbnail ? 50 : 200} />
          </filter>

          {/* Horizontal Arc Glow Gradient (Symmetric) */}
          <linearGradient id="ios-arc-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="20%" stopColor="var(--glow-color)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--glow-color)" stopOpacity="0.95" />
            <stop offset="80%" stopColor="var(--glow-color)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Metallic Outline Gradients */}
          <linearGradient id="metallic-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="metallic-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bae6ff" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Radial Gradients for iOS hourglass cups */}
          <radialGradient id="ios-default-top" cx="50%" cy="10%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#172554" />
                <stop offset="55%" stopColor="#020617" />
                <stop offset="100%" stopColor="#000205" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="55%" stopColor="#bae6ff" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </>
            )}
          </radialGradient>
          <radialGradient id="ios-default-bottom" cx="50%" cy="90%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="55%" stopColor="#020617" />
                <stop offset="100%" stopColor="#000205" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="55%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </>
            )}
          </radialGradient>

          <radialGradient id="ios-monterey-top" cx="50%" cy="10%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#4a044e" />
                <stop offset="55%" stopColor="#0f0714" />
                <stop offset="100%" stopColor="#020105" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fdf2f8" />
                <stop offset="55%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#f472b6" />
              </>
            )}
          </radialGradient>
          <radialGradient id="ios-monterey-bottom" cx="50%" cy="90%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#701a75" />
                <stop offset="55%" stopColor="#0f0714" />
                <stop offset="100%" stopColor="#020105" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fae8ff" />
                <stop offset="55%" stopColor="#f5d0fe" />
                <stop offset="100%" stopColor="#d946ef" />
              </>
            )}
          </radialGradient>

          <radialGradient id="ios-aurora-top" cx="50%" cy="10%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#3b0764" />
                <stop offset="55%" stopColor="#0a0515" />
                <stop offset="100%" stopColor="#020005" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f5f3ff" />
                <stop offset="55%" stopColor="#ddd6fe" />
                <stop offset="100%" stopColor="#a78bfa" />
              </>
            )}
          </radialGradient>
          <radialGradient id="ios-aurora-bottom" cx="50%" cy="90%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="55%" stopColor="#0a0515" />
                <stop offset="100%" stopColor="#020005" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="55%" stopColor="#c7d2fe" />
                <stop offset="100%" stopColor="#818cf8" />
              </>
            )}
          </radialGradient>

          <radialGradient id="ios-sonoma-top" cx="50%" cy="10%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="55%" stopColor="#022c22" />
                <stop offset="100%" stopColor="#01140f" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="55%" stopColor="#dcfce7" />
                <stop offset="100%" stopColor="#86efac" />
              </>
            )}
          </radialGradient>
          <radialGradient id="ios-sonoma-bottom" cx="50%" cy="90%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#047857" />
                <stop offset="55%" stopColor="#022c22" />
                <stop offset="100%" stopColor="#01140f" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#ecfdf5" />
                <stop offset="55%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#34d399" />
              </>
            )}
          </radialGradient>

          <radialGradient id="ios-midnight-top" cx="50%" cy="10%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="65%" stopColor="#09090b" />
                <stop offset="100%" stopColor="#020202" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f4f4f5" />
                <stop offset="65%" stopColor="#e4e4e7" />
                <stop offset="100%" stopColor="#d4d4d8" />
              </>
            )}
          </radialGradient>
          <radialGradient id="ios-midnight-bottom" cx="50%" cy="90%" r="90%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#18181b" />
                <stop offset="65%" stopColor="#09090b" />
                <stop offset="100%" stopColor="#020202" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#e4e4e7" />
                <stop offset="65%" stopColor="#d4d4d8" />
                <stop offset="100%" stopColor="#a1a1aa" />
              </>
            )}
          </radialGradient>
          {/* Dedicated Rich/Saturated Sky Gradients for iOS & iPad */}
          <linearGradient id="ios-ipad-sky-default" x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#030712" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#60a5fa" />
              </>
            )}
          </linearGradient>

          <linearGradient id="ios-ipad-sky-monterey" x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#120e36" />
                <stop offset="100%" stopColor="#060410" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#701a75" />
                <stop offset="50%" stopColor="#db2777" />
                <stop offset="100%" stopColor="#f43f5e" />
              </>
            )}
          </linearGradient>

          <linearGradient id="ios-ipad-sky-sonoma" x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#022c22" />
                <stop offset="100%" stopColor="#050b0a" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="50%" stopColor="#047857" />
                <stop offset="100%" stopColor="#10b981" />
              </>
            )}
          </linearGradient>

          <linearGradient id="ios-ipad-sky-aurora" x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#0c061a" />
                <stop offset="100%" stopColor="#04020a" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#3b0764" />
                <stop offset="50%" stopColor="#5b21b6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </>
            )}
          </linearGradient>

          <linearGradient id="ios-ipad-sky-midnight" x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#09090b" />
                <stop offset="100%" stopColor="#000000" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#475569" />
              </>
            )}
          </linearGradient>

          {/* Gradients for macOS Waves Backgrounds */}
          <linearGradient id="macos-sky-default" x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#030712" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#bae6ff" />
              </>
            )}
          </linearGradient>

          <linearGradient id="macos-sky-monterey" x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#120e36" />
                <stop offset="100%" stopColor="#060410" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fdf2f8" />
                <stop offset="50%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#db2777" />
              </>
            )}
          </linearGradient>

          <linearGradient id="macos-sky-sonoma" x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#022c22" />
                <stop offset="100%" stopColor="#050b0a" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="50%" stopColor="#dcfce7" />
                <stop offset="100%" stopColor="#bbf7d0" />
              </>
            )}
          </linearGradient>

          <linearGradient id="macos-sky-aurora" x1="0" y1="0" x2="1" y2="1">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#0c061a" />
                <stop offset="100%" stopColor="#04020a" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f3e8ff" />
                <stop offset="100%" stopColor="#e0e7ff" />
              </>
            )}
          </linearGradient>

          <linearGradient id="macos-sky-midnight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#09090b" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          {/* iPad-specific Slate & Metal Gradients */}
          <radialGradient id="ipad-radial-default" cx="50%" cy="50%" r="75%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="60%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </>
            )}
          </radialGradient>
          <radialGradient id="ipad-radial-monterey" cx="50%" cy="50%" r="75%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#2e1065" />
                <stop offset="60%" stopColor="#0f052d" />
                <stop offset="100%" stopColor="#02000d" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fae8ff" />
                <stop offset="60%" stopColor="#f5d0fe" />
                <stop offset="100%" stopColor="#d946ef" />
              </>
            )}
          </radialGradient>
          <radialGradient id="ipad-radial-sonoma" cx="50%" cy="50%" r="75%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="60%" stopColor="#022c22" />
                <stop offset="100%" stopColor="#000f0b" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="60%" stopColor="#dcfce7" />
                <stop offset="100%" stopColor="#86efac" />
              </>
            )}
          </radialGradient>
          <radialGradient id="ipad-radial-aurora" cx="50%" cy="50%" r="75%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#172554" />
                <stop offset="60%" stopColor="#0c1836" />
                <stop offset="100%" stopColor="#020617" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="60%" stopColor="#bae6ff" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </>
            )}
          </radialGradient>
          <radialGradient id="ipad-radial-midnight" cx="50%" cy="50%" r="75%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#18181b" />
                <stop offset="60%" stopColor="#09090b" />
                <stop offset="100%" stopColor="#020202" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f4f4f5" />
                <stop offset="65%" stopColor="#e4e4e7" />
                <stop offset="100%" stopColor="#d4d4d8" />
              </>
            )}
          </radialGradient>

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

        {/* ======================================================== */}
        {/* iOS PORTRAIT HOURGLASS LAYOUT (viewBox="0 0 900 1440") */}
        {/* ======================================================== */}        {isIos && (
          <>
            {/* Background Sky Canvas */}
            {id === 'default' && <rect width="900" height="1440" fill="url(#ios-ipad-sky-default)" />}
            {id === 'monterey' && <rect width="900" height="1440" fill="url(#ios-ipad-sky-monterey)" />}
            {id === 'sonoma' && <rect width="900" height="1440" fill="url(#ios-ipad-sky-sonoma)" />}
            {id === 'aurora' && <rect width="900" height="1440" fill="url(#ios-ipad-sky-aurora)" />}
            {id === 'midnight' && <rect width="900" height="1440" fill="url(#ios-ipad-sky-midnight)" />}

            {/* Wave 4 */}
            <path
              d="M-100,500 C150,300 750,700 1000,550 L1000,1540 L-100,1540 Z"
              fill={
                id === 'default' ? (isDark ? '#0f172a' : '#1e3a8a') :
                id === 'monterey' ? (isDark ? '#3b0764' : '#c084fc') :
                id === 'sonoma' ? (isDark ? '#064e3b' : '#a7f3d0') :
                id === 'aurora' ? (isDark ? '#1e1b4b' : '#8b5cf6') :
                /* midnight */ (isDark ? '#18181b' : '#334155')
              }
              opacity={
                id === 'default' ? (isDark ? 0.7 : 0.2) :
                id === 'monterey' ? (isDark ? 0.5 : 0.45) :
                id === 'sonoma' ? (isDark ? 0.6 : 0.5) :
                id === 'aurora' ? (isDark ? 0.55 : 0.5) :
                /* midnight */ (isDark ? 0.7 : 0.5)
              }
              filter={waveShadow}
            />

            {/* Wave 3 */}
            <path
              d="M-100,650 C200,500 800,850 1000,720 L1000,1540 L-100,1540 Z"
              fill={
                id === 'default' ? (isDark ? '#1e3a8a' : '#2563eb') :
                id === 'monterey' ? (isDark ? '#701a75' : '#fbcfe8') :
                id === 'sonoma' ? (isDark ? '#047857' : '#f0fdf4') :
                id === 'aurora' ? (isDark ? '#5b21b6' : '#a78bfa') :
                /* midnight */ (isDark ? '#27272a' : '#475569')
              }
              opacity={
                id === 'default' ? (isDark ? 0.65 : 0.4) :
                id === 'monterey' ? (isDark ? 0.65 : 0.55) :
                id === 'sonoma' ? (isDark ? 0.65 : 0.55) :
                id === 'aurora' ? (isDark ? 0.65 : 0.6) :
                /* midnight */ (isDark ? 0.65 : 0.55)
              }
              filter={waveShadow}
            />
            {/* Highlight line for Monterey/Sonoma/Aurora Wave 3 */}
            {graphicsAcceleration && id === 'monterey' && (
              <path
                d="M-100,650 C200,500 800,850 1000,720"
                fill="none"
                stroke="#ffffff"
                strokeWidth={thumbnail ? 1 : 2.5}
                opacity="0.3"
                filter={glowBlur}
              />
            )}
            {graphicsAcceleration && id === 'sonoma' && (
              <path
                d="M-100,650 C200,500 800,850 1000,720"
                fill="none"
                stroke="#34d399"
                strokeWidth={thumbnail ? 1 : 2}
                opacity="0.5"
                filter={glowBlur}
              />
            )}
            {graphicsAcceleration && id === 'aurora' && (
              <path
                d="M-100,650 C200,500 800,850 1000,720"
                fill="none"
                stroke="#ffffff"
                strokeWidth={thumbnail ? 1.5 : 4}
                opacity="0.32"
                filter={glowBlur}
              />
            )}

            {/* Wave 2 */}
            <path
              d="M-100,800 C250,650 850,1000 1000,880 L1000,1540 L-100,1540 Z"
              fill={
                id === 'default' ? (isDark ? '#2563eb' : '#3b82f6') :
                id === 'monterey' ? (isDark ? '#9f1239' : '#f43f5e') :
                id === 'sonoma' ? (isDark ? '#059669' : '#d1fae5') :
                id === 'aurora' ? (isDark ? '#701a75' : '#c084fc') :
                /* midnight */ (isDark ? '#3f3f46' : '#64748b')
              }
              opacity={
                id === 'default' ? (isDark ? 0.6 : 0.5) :
                id === 'monterey' ? (isDark ? 0.7 : 0.65) :
                id === 'sonoma' ? (isDark ? 0.7 : 0.6) :
                id === 'aurora' ? (isDark ? 0.72 : 0.65) :
                /* midnight */ (isDark ? 0.6 : 0.6)
              }
              filter={waveShadow}
            />

            {/* Wave 1 */}
            <path
              d="M-100,950 C300,800 900,1150 1000,1020 L1000,1540 L-100,1540 Z"
              fill={
                id === 'default' ? (isDark ? '#3b82f6' : '#60a5fa') :
                id === 'monterey' ? (isDark ? '#881337' : '#be123c') :
                id === 'sonoma' ? (isDark ? '#065f46' : '#ffffff') :
                id === 'aurora' ? (isDark ? '#3b0764' : '#86198f') :
                /* midnight */ (isDark ? '#52525b' : '#94a3b8')
              }
              opacity={
                id === 'default' ? (isDark ? 0.75 : 0.6) :
                id === 'monterey' ? (isDark ? 0.85 : 0.75) :
                id === 'sonoma' ? (isDark ? 0.85 : 0.7) :
                id === 'aurora' ? (isDark ? 0.85 : 0.75) :
                /* midnight */ (isDark ? 0.75 : 0.7)
              }
              filter={waveShadow}
            />
          </>
        )}

        {/* ======================================================== */}
        {/* iPad LANDSCAPE/PORTRAIT METALLIC LAYOUT (viewBox="0 0 1366 1024") */}
        {/* ======================================================== */}
        {layout === 'ipad' && (
          <>
            {/* Background Sky Canvas */}
            {id === 'default' && <rect width="1366" height="1024" fill="url(#ios-ipad-sky-default)" />}
            {id === 'monterey' && <rect width="1366" height="1024" fill="url(#ios-ipad-sky-monterey)" />}
            {id === 'sonoma' && <rect width="1366" height="1024" fill="url(#ios-ipad-sky-sonoma)" />}
            {id === 'aurora' && <rect width="1366" height="1024" fill="url(#ios-ipad-sky-aurora)" />}
            {id === 'midnight' && <rect width="1366" height="1024" fill="url(#ios-ipad-sky-midnight)" />}

            {/* Wave 4 */}
            <path
              d="M-100,200 C250,70 700,430 1500,250 L1500,1100 L-100,1100 Z"
              fill={
                id === 'default' ? (isDark ? '#0f172a' : '#1e3a8a') :
                id === 'monterey' ? (isDark ? '#3b0764' : '#c084fc') :
                id === 'sonoma' ? (isDark ? '#064e3b' : '#a7f3d0') :
                id === 'aurora' ? (isDark ? '#1e1b4b' : '#8b5cf6') :
                /* midnight */ (isDark ? '#18181b' : '#334155')
              }
              opacity={
                id === 'default' ? (isDark ? 0.7 : 0.2) :
                id === 'monterey' ? (isDark ? 0.5 : 0.45) :
                id === 'sonoma' ? (isDark ? 0.6 : 0.5) :
                id === 'aurora' ? (isDark ? 0.55 : 0.5) :
                /* midnight */ (isDark ? 0.7 : 0.5)
              }
              filter={waveShadow}
            />

            {/* Wave 3 */}
            <path
              d="M-100,320 C350,220 750,530 1500,360 L1500,1100 L-100,1100 Z"
              fill={
                id === 'default' ? (isDark ? '#1e3a8a' : '#2563eb') :
                id === 'monterey' ? (isDark ? '#701a75' : '#fbcfe8') :
                id === 'sonoma' ? (isDark ? '#047857' : '#f0fdf4') :
                id === 'aurora' ? (isDark ? '#5b21b6' : '#a78bfa') :
                /* midnight */ (isDark ? '#27272a' : '#475569')
              }
              opacity={
                id === 'default' ? (isDark ? 0.65 : 0.4) :
                id === 'monterey' ? (isDark ? 0.65 : 0.55) :
                id === 'sonoma' ? (isDark ? 0.65 : 0.55) :
                id === 'aurora' ? (isDark ? 0.65 : 0.6) :
                /* midnight */ (isDark ? 0.65 : 0.55)
              }
              filter={waveShadow}
            />
            {/* Highlight line for Monterey/Sonoma/Aurora Wave 3 */}
            {graphicsAcceleration && id === 'monterey' && (
              <path
                d="M-100,320 C350,220 750,530 1500,360"
                fill="none"
                stroke="#ffffff"
                strokeWidth={thumbnail ? 1 : 2.5}
                opacity="0.3"
                filter={glowBlur}
              />
            )}
            {graphicsAcceleration && id === 'sonoma' && (
              <path
                d="M-100,320 C350,220 750,530 1500,360"
                fill="none"
                stroke="#34d399"
                strokeWidth={thumbnail ? 1 : 2}
                opacity="0.5"
                filter={glowBlur}
              />
            )}
            {graphicsAcceleration && id === 'aurora' && (
              <path
                d="M-100,320 C350,220 750,530 1500,360"
                fill="none"
                stroke="#ffffff"
                strokeWidth={thumbnail ? 1.5 : 4}
                opacity="0.32"
                filter={glowBlur}
              />
            )}

            {/* Wave 2 */}
            <path
              d="M-100,440 C400,340 800,630 1500,480 L1500,1100 L-100,1100 Z"
              fill={
                id === 'default' ? (isDark ? '#2563eb' : '#3b82f6') :
                id === 'monterey' ? (isDark ? '#9f1239' : '#f43f5e') :
                id === 'sonoma' ? (isDark ? '#059669' : '#d1fae5') :
                id === 'aurora' ? (isDark ? '#701a75' : '#c084fc') :
                /* midnight */ (isDark ? '#3f3f46' : '#64748b')
              }
              opacity={
                id === 'default' ? (isDark ? 0.6 : 0.5) :
                id === 'monterey' ? (isDark ? 0.7 : 0.65) :
                id === 'sonoma' ? (isDark ? 0.7 : 0.6) :
                id === 'aurora' ? (isDark ? 0.72 : 0.65) :
                /* midnight */ (isDark ? 0.6 : 0.6)
              }
              filter={waveShadow}
            />

            {/* Wave 1 */}
            <path
              d="M-100,560 C450,480 850,750 1500,610 L1500,1100 L-100,1100 Z"
              fill={
                id === 'default' ? (isDark ? '#3b82f6' : '#60a5fa') :
                id === 'monterey' ? (isDark ? '#881337' : '#be123c') :
                id === 'sonoma' ? (isDark ? '#065f46' : '#ffffff') :
                id === 'aurora' ? (isDark ? '#3b0764' : '#86198f') :
                /* midnight */ (isDark ? '#52525b' : '#94a3b8')
              }
              opacity={
                id === 'default' ? (isDark ? 0.75 : 0.6) :
                id === 'monterey' ? (isDark ? 0.85 : 0.75) :
                id === 'sonoma' ? (isDark ? 0.85 : 0.7) :
                id === 'aurora' ? (isDark ? 0.85 : 0.75) :
                /* midnight */ (isDark ? 0.75 : 0.7)
              }
              filter={waveShadow}
            />
          </>
        )}

        {/* ======================================================== */}
        {/* macOS LANDSCAPE LAYOUT (viewBox="0 0 1440 900") */}
        {/* ======================================================== */}
        {layout === 'macos' && (
          <>
            {/* Background Sky */}
            {id === 'default' && <rect width="1440" height="900" fill="url(#ios-ipad-sky-default)" />}
            {id === 'monterey' && <rect width="1440" height="900" fill="url(#ios-ipad-sky-monterey)" />}
            {id === 'sonoma' && <rect width="1440" height="900" fill="url(#ios-ipad-sky-sonoma)" />}
            {id === 'aurora' && <rect width="1440" height="900" fill="url(#ios-ipad-sky-aurora)" />}
            {id === 'midnight' && <rect width="1440" height="900" fill="url(#ios-ipad-sky-midnight)" />}

            {/* --- macOS Wave Shapes --- */}

            {/* Wave 4 */}
            <path
              d="M-100,180 C300,50 850,380 1600,220 L1600,1000 L-100,1000 Z"
              fill={
                id === 'default' ? (isDark ? '#0f172a' : '#1e3a8a') :
                id === 'monterey' ? (isDark ? '#3b0764' : '#701a75') :
                id === 'sonoma' ? (isDark ? '#064e3b' : '#047857') :
                id === 'aurora' ? (isDark ? '#1e1b4b' : '#3b0764') :
                /* midnight */ (isDark ? '#18181b' : '#334155')
              }
              opacity={
                id === 'default' ? (isDark ? 0.7 : 0.5) :
                id === 'monterey' ? (isDark ? 0.5 : 0.5) :
                id === 'sonoma' ? (isDark ? 0.6 : 0.5) :
                id === 'aurora' ? (isDark ? 0.55 : 0.5) :
                /* midnight */ (isDark ? 0.7 : 0.5)
              }
              filter={waveShadow}
            />

            {/* Wave 3 */}
            <path
              d="M-100,280 C400,190 900,470 1600,320 L1600,1000 L-100,1000 Z"
              fill={
                id === 'default' ? (isDark ? '#1e3a8a' : '#2563eb') :
                id === 'monterey' ? (isDark ? '#701a75' : '#9d174d') :
                id === 'sonoma' ? (isDark ? '#047857' : '#059669') :
                id === 'aurora' ? (isDark ? '#5b21b6' : '#4f46e5') :
                /* midnight */ (isDark ? '#27272a' : '#475569')
              }
              opacity={
                id === 'default' ? (isDark ? 0.65 : 0.55) :
                id === 'monterey' ? (isDark ? 0.65 : 0.55) :
                id === 'sonoma' ? (isDark ? 0.65 : 0.55) :
                id === 'aurora' ? (isDark ? 0.65 : 0.55) :
                /* midnight */ (isDark ? 0.65 : 0.55)
              }
              filter={waveShadow}
            />
            {/* Highlight line for Monterey/Sonoma/Aurora Wave 3 */}
            {graphicsAcceleration && id === 'monterey' && (
              <path
                d="M-100,250 C400,180 900,460 1600,310"
                fill="none"
                stroke="#ffffff"
                strokeWidth={thumbnail ? 1 : 2.5}
                opacity="0.3"
                filter={glowBlur}
              />
            )}
            {graphicsAcceleration && id === 'sonoma' && (
              <path
                d="M-100,330 C300,200 850,480 1600,370"
                fill="none"
                stroke="#34d399"
                strokeWidth={thumbnail ? 1 : 2}
                opacity="0.5"
                filter={glowBlur}
              />
            )}
            {graphicsAcceleration && id === 'aurora' && (
              <path
                d="M-100,250 C400,180 900,460 1600,310"
                fill="none"
                stroke="#ffffff"
                strokeWidth={thumbnail ? 1.5 : 4}
                opacity="0.32"
                filter={glowBlur}
              />
            )}

            {/* Wave 2 */}
            <path
              d="M-100,380 C450,300 950,560 1600,420 L1600,1000 L-100,1000 Z"
              fill={
                id === 'default' ? (isDark ? '#2563eb' : '#3b82f6') :
                id === 'monterey' ? (isDark ? '#9f1239' : '#c026d3') :
                id === 'sonoma' ? (isDark ? '#059669' : '#10b981') :
                id === 'aurora' ? (isDark ? '#701a75' : '#6366f1') :
                /* midnight */ (isDark ? '#3f3f46' : '#64748b')
              }
              opacity={
                id === 'default' ? (isDark ? 0.6 : 0.6) :
                id === 'monterey' ? (isDark ? 0.7 : 0.6) :
                id === 'sonoma' ? (isDark ? 0.7 : 0.6) :
                id === 'aurora' ? (isDark ? 0.72 : 0.6) :
                /* midnight */ (isDark ? 0.6 : 0.6)
              }
              filter={waveShadow}
            />

            {/* Wave 1 */}
            <path
              d="M-100,490 C500,420 1000,660 1600,540 L1600,1000 L-100,1000 Z"
              fill={
                id === 'default' ? (isDark ? '#3b82f6' : '#60a5fa') :
                id === 'monterey' ? (isDark ? '#881337' : '#db2777') :
                id === 'sonoma' ? (isDark ? '#065f46' : '#34d399') :
                id === 'aurora' ? (isDark ? '#3b0764' : '#818cf8') :
                /* midnight */ (isDark ? '#52525b' : '#94a3b8')
              }
              opacity={
                id === 'default' ? (isDark ? 0.75 : 0.7) :
                id === 'monterey' ? (isDark ? 0.85 : 0.7) :
                id === 'sonoma' ? (isDark ? 0.85 : 0.7) :
                id === 'aurora' ? (isDark ? 0.85 : 0.7) :
                /* midnight */ (isDark ? 0.75 : 0.7)
              }
              filter={waveShadow}
            />
          </>
        )}

        {/* Reusable Subtle Noise/Grain Overlay */}
        {graphicsAcceleration && (
          <rect
            width={width}
            height={height}
            fill="#808080"
            filter="url(#wallpaper-noise)"
            opacity="0.055"
            style={{ mixBlendMode: 'overlay' }}
          />
        )}
      </svg>

      {/* Glassy reflection overlay on top of everything */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-black/5 dark:from-white/2 dark:via-transparent dark:to-black/10',
          thumbnail ? 'rounded-xl' : ''
        )}
      />
    </div>
  )
}
