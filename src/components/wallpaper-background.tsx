import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function WallpaperBackground({
  id,
  thumbnail = false,
  layout = 'macos',
}: {
  id: string
  thumbnail?: boolean
  layout?: 'macos' | 'ios'
}) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const isIos = layout === 'ios'
  const viewBox = isIos ? '0 0 900 1440' : '0 0 1440 900'
  const width = isIos ? 900 : 1440
  const height = isIos ? 1440 : 900

  return (
    <div
      className={cn(
        'w-full h-full select-none overflow-hidden transition-all duration-700 ease-out-quint',
        thumbnail ? 'absolute inset-0 rounded-xl' : 'fixed inset-0 z-[-10]'
      )}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        className="w-full h-full scale-105 pointer-events-none select-none"
      >
        <defs>
          {/* Reusable Subtle Noise/Grain Filter */}
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
            <feGaussianBlur stdDeviation={thumbnail ? 15 : 60} />
          </filter>
          <filter id="aurora-blur-2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={thumbnail ? 22 : 80} />
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
            <stop offset="0%" stopColor="#172554" />
            <stop offset="55%" stopColor="#020617" />
            <stop offset="100%" stopColor="#000205" />
          </radialGradient>
          <radialGradient id="ios-default-bottom" cx="50%" cy="90%" r="90%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="55%" stopColor="#020617" />
            <stop offset="100%" stopColor="#000205" />
          </radialGradient>

          <radialGradient id="ios-monterey-top" cx="50%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#4a044e" />
            <stop offset="55%" stopColor="#0f0714" />
            <stop offset="100%" stopColor="#020105" />
          </radialGradient>
          <radialGradient id="ios-monterey-bottom" cx="50%" cy="90%" r="90%">
            <stop offset="0%" stopColor="#701a75" />
            <stop offset="55%" stopColor="#0f0714" />
            <stop offset="100%" stopColor="#020105" />
          </radialGradient>

          <radialGradient id="ios-aurora-top" cx="50%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#3b0764" />
            <stop offset="55%" stopColor="#0a0515" />
            <stop offset="100%" stopColor="#020005" />
          </radialGradient>
          <radialGradient id="ios-aurora-bottom" cx="50%" cy="90%" r="90%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="55%" stopColor="#0a0515" />
            <stop offset="100%" stopColor="#020005" />
          </radialGradient>

          <radialGradient id="ios-sonoma-top" cx="50%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="55%" stopColor="#022c22" />
            <stop offset="100%" stopColor="#01140f" />
          </radialGradient>
          <radialGradient id="ios-sonoma-bottom" cx="50%" cy="90%" r="90%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="55%" stopColor="#022c22" />
            <stop offset="100%" stopColor="#01140f" />
          </radialGradient>

          <radialGradient id="ios-midnight-top" cx="50%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="65%" stopColor="#09090b" />
            <stop offset="100%" stopColor="#020202" />
          </radialGradient>
          <radialGradient id="ios-midnight-bottom" cx="50%" cy="90%" r="90%">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="65%" stopColor="#09090b" />
            <stop offset="100%" stopColor="#020202" />
          </radialGradient>

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
        </defs>

        {/* ======================================================== */}
        {/* iOS PORTRAIT HOURGLASS LAYOUT (viewBox="0 0 900 1440") */}
        {/* ======================================================== */}
        {isIos && (
          <>
            {/* Background Canvas */}
            {id === 'default' && <rect width="900" height="1440" fill="url(#ios-default-bottom)" />}
            {id === 'monterey' && <rect width="900" height="1440" fill="url(#ios-monterey-bottom)" />}
            {id === 'aurora' && <rect width="900" height="1440" fill="url(#ios-aurora-bottom)" />}
            {id === 'sonoma' && <rect width="900" height="1440" fill="url(#ios-sonoma-bottom)" />}
            {id === 'midnight' && <rect width="900" height="1440" fill="url(#ios-midnight-bottom)" />}

            {/* Central Ambient Glow Flare */}
            {id === 'default' && (
              <circle cx="450" cy="720" r="280" fill="#2563eb" opacity="0.3" filter="url(#aurora-blur-2)" />
            )}
            {id === 'monterey' && (
              <circle cx="450" cy="720" r="280" fill="#db2777" opacity="0.32" filter="url(#aurora-blur-2)" />
            )}
            {id === 'aurora' && (
              <circle cx="450" cy="720" r="280" fill="#7c3aed" opacity="0.35" filter="url(#aurora-blur-2)" />
            )}
            {id === 'sonoma' && (
              <circle cx="450" cy="720" r="280" fill="#10b981" opacity="0.28" filter="url(#aurora-blur-2)" />
            )}
            {id === 'midnight' && (
              <circle cx="450" cy="720" r="240" fill="#3f3f46" opacity="0.2" filter="url(#aurora-blur-2)" />
            )}

            {/* Top Funnel / Cup */}
            <path
              d="M-100,-100 L1000,-100 L1000,500 C750,780 150,780 -100,500 Z"
              fill={
                id === 'default'
                  ? 'url(#ios-default-top)'
                  : id === 'monterey'
                  ? 'url(#ios-monterey-top)'
                  : id === 'aurora'
                  ? 'url(#ios-aurora-top)'
                  : id === 'sonoma'
                  ? 'url(#ios-sonoma-top)'
                  : 'url(#ios-midnight-top)'
              }
              filter="url(#ios-cup-shadow)"
            />

            {/* Bottom Funnel / Cup */}
            <path
              d="M-100,1540 L1000,1540 L1000,940 C750,660 150,660 -100,940 Z"
              fill={
                id === 'default'
                  ? 'url(#ios-default-bottom)'
                  : id === 'monterey'
                  ? 'url(#ios-monterey-bottom)'
                  : id === 'aurora'
                  ? 'url(#ios-aurora-bottom)'
                  : id === 'sonoma'
                  ? 'url(#ios-sonoma-bottom)'
                  : 'url(#ios-midnight-bottom)'
              }
              filter="url(#ios-cup-shadow)"
            />

            {/* Top Glowing Arc */}
            <path
              d="M-100,500 C150,780 750,780 1000,500"
              fill="none"
              stroke="url(#ios-arc-glow)"
              strokeWidth={thumbnail ? 4.5 : 14}
              opacity="0.3"
              filter="url(#glow-blur)"
              style={{
                '--glow-color':
                  id === 'default'
                    ? '#38bdf8'
                    : id === 'monterey'
                    ? '#f472b6'
                    : id === 'aurora'
                    ? '#c084fc'
                    : id === 'sonoma'
                    ? '#10b981'
                    : '#ffffff',
              } as React.CSSProperties}
            />
            <path
              d="M-100,500 C150,780 750,780 1000,500"
              fill="none"
              stroke="url(#ios-arc-glow)"
              strokeWidth={thumbnail ? 1.25 : 3.5}
              opacity="0.9"
              style={{
                '--glow-color':
                  id === 'default'
                    ? '#e0f2fe'
                    : id === 'monterey'
                    ? '#fdf2f8'
                    : id === 'aurora'
                    ? '#f5f3ff'
                    : id === 'sonoma'
                    ? '#d1fae5'
                    : '#ffffff',
              } as React.CSSProperties}
            />

            {/* Bottom Glowing Arc */}
            <path
              d="M-100,940 C150,660 750,660 1000,940"
              fill="none"
              stroke="url(#ios-arc-glow)"
              strokeWidth={thumbnail ? 4.5 : 14}
              opacity="0.28"
              filter="url(#glow-blur)"
              style={{
                '--glow-color':
                  id === 'default'
                    ? '#60a5fa'
                    : id === 'monterey'
                    ? '#a855f7'
                    : id === 'aurora'
                    ? '#818cf8'
                    : id === 'sonoma'
                    ? '#059669'
                    : '#71717a',
              } as React.CSSProperties}
            />
            <path
              d="M-100,940 C150,660 750,660 1000,940"
              fill="none"
              stroke="url(#ios-arc-glow)"
              strokeWidth={thumbnail ? 1.25 : 3.5}
              opacity="0.85"
              style={{
                '--glow-color':
                  id === 'default'
                    ? '#dbeafe'
                    : id === 'monterey'
                    ? '#ddd6fe'
                    : id === 'aurora'
                    ? '#e0e7ff'
                    : id === 'sonoma'
                    ? '#ecfdf5'
                    : '#e4e4e7',
              } as React.CSSProperties}
            />
          </>
        )}

        {/* ======================================================== */}
        {/* macOS LANDSCAPE LAYOUT (viewBox="0 0 1440 900") */}
        {/* ======================================================== */}
        {!isIos && (
          <>
            {/* Background Sky */}
            {id === 'default' && <rect width="1440" height="900" fill="url(#macos-sky-default)" />}
            {id === 'monterey' && <rect width="1440" height="900" fill="url(#macos-sky-monterey)" />}
            {id === 'sonoma' && <rect width="1440" height="900" fill="url(#macos-sky-sonoma)" />}
            {id === 'aurora' && <rect width="1440" height="900" fill="url(#macos-sky-aurora)" />}
            {id === 'midnight' && <rect width="1440" height="900" fill="url(#macos-sky-midnight)" />}

            {/* --- macOS Wave Shapes --- */}

            {id === 'default' && (
              <>
                {/* Wave 4 */}
                <path
                  d="M-100,180 C300,50 850,380 1600,220 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#0f172a' : '#1e3a8a'}
                  opacity={isDark ? 0.7 : 0.2}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 3 */}
                <path
                  d="M-100,280 C400,190 900,470 1600,320 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#1e3a8a' : '#2563eb'}
                  opacity={isDark ? 0.65 : 0.4}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 2 */}
                <path
                  d="M-100,380 C450,300 950,560 1600,420 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#2563eb' : '#3b82f6'}
                  opacity={isDark ? 0.6 : 0.5}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 1 */}
                <path
                  d="M-100,490 C500,420 1000,660 1600,540 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#3b82f6' : '#60a5fa'}
                  opacity={isDark ? 0.75 : 0.6}
                  filter="url(#wave-shadow)"
                />
              </>
            )}

            {id === 'monterey' && (
              <>
                {/* Pure Red/Pink/Magenta Sunset Waves */}
                {/* Wave 4 */}
                <path
                  d="M-100,160 C350,50 850,380 1600,220 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#3b0764' : '#c084fc'}
                  opacity={isDark ? 0.5 : 0.45}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 3 */}
                <path
                  d="M-100,250 C400,180 900,460 1600,310 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#701a75' : '#fbcfe8'}
                  opacity={isDark ? 0.65 : 0.55}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 2 */}
                <path
                  d="M-100,330 C450,270 950,530 1600,390 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#9f1239' : '#f43f5e'}
                  opacity={isDark ? 0.7 : 0.65}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 1 */}
                <path
                  d="M-100,420 C500,370 1000,610 1600,510 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#881337' : '#be123c'}
                  opacity={isDark ? 0.85 : 0.75}
                  filter="url(#wave-shadow)"
                />
                {/* Highlight line */}
                <path
                  d="M-100,250 C400,180 900,460 1600,310"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={thumbnail ? 1 : 2.5}
                  opacity="0.3"
                  filter="url(#glow-blur)"
                />
              </>
            )}

            {id === 'sonoma' && (
              <>
                {/* Premium Emerald & Mint Green Wave Theme */}
                {/* Wave 4 */}
                <path
                  d="M-100,180 C250,80 800,350 1600,240 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#064e3b' : '#a7f3d0'}
                  opacity={isDark ? 0.6 : 0.5}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 3 */}
                <path
                  d="M-100,330 C300,200 850,480 1600,370 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#047857' : '#f0fdf4'}
                  opacity={isDark ? 0.65 : 0.55}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 2 */}
                <path
                  d="M-100,480 C350,320 900,580 1600,490 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#059669' : '#d1fae5'}
                  opacity={isDark ? 0.7 : 0.6}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 1 */}
                <path
                  d="M-100,620 C400,450 950,700 1600,600 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#065f46' : '#ffffff'}
                  opacity={isDark ? 0.85 : 0.7}
                  filter="url(#wave-shadow)"
                />
                {/* Emerald Highlight reflection */}
                <path
                  d="M-100,330 C300,200 850,480 1600,370"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth={thumbnail ? 1 : 2}
                  opacity="0.5"
                  filter="url(#glow-blur)"
                />
              </>
            )}

            {id === 'aurora' && (
              <>
                {/* Deep Purple/Violet Wave Canyons (Image 1 of the new batch) */}
                {/* Wave 4 */}
                <path
                  d="M-100,160 C350,50 850,380 1600,220 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#1e1b4b' : '#8b5cf6'}
                  opacity={isDark ? 0.55 : 0.5}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 3 */}
                <path
                  d="M-100,250 C400,180 900,460 1600,310 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#5b21b6' : '#a78bfa'}
                  opacity={isDark ? 0.65 : 0.6}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 2 */}
                <path
                  d="M-100,340 C450,280 950,540 1600,400 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#701a75' : '#c084fc'}
                  opacity={isDark ? 0.72 : 0.65}
                  filter="url(#wave-shadow)"
                />
                {/* Wave 1 */}
                <path
                  d="M-100,440 C500,380 1000,640 1600,530 L1600,1000 L-100,1000 Z"
                  fill={isDark ? '#3b0764' : '#86198f'}
                  opacity={isDark ? 0.85 : 0.75}
                  filter="url(#wave-shadow)"
                />
                {/* Glowing arc highlights */}
                <path
                  d="M-100,250 C400,180 900,460 1600,310"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={thumbnail ? 1.5 : 4}
                  opacity="0.32"
                  filter="url(#glow-blur)"
                />
              </>
            )}

            {id === 'midnight' && (
              <>
                {/* macOS Midnight Folds / Metallic Curves (Image 2 style) */}
                {/* Plate 3 (Back) */}
                <path
                  d="M-100,200 C300,500 1140,500 1640,200 L1640,1000 L-100,1000 Z"
                  fill="url(#ios-midnight-top)"
                  filter="url(#wave-shadow)"
                />
                <path
                  d="M-100,200 C300,500 1140,500 1640,200"
                  fill="none"
                  stroke="url(#metallic-blue)"
                  strokeWidth={thumbnail ? 1.5 : 3.5}
                  opacity="0.95"
                />

                {/* Plate 2 */}
                <path
                  d="M-100,450 C300,750 1140,750 1640,450 L1640,1000 L-100,1000 Z"
                  fill="url(#ios-midnight-bottom)"
                  filter="url(#wave-shadow)"
                />
                <path
                  d="M-100,450 C300,750 1140,750 1640,450"
                  fill="none"
                  stroke="url(#metallic-gold)"
                  strokeWidth={thumbnail ? 1.5 : 3.5}
                  opacity="0.95"
                />

                {/* Plate 1 (Front) */}
                <path
                  d="M-100,700 C300,1000 1140,1000 1640,700 L1640,1000 L-100,1000 Z"
                  fill="url(#ios-midnight-top)"
                  filter="url(#wave-shadow)"
                />
                <path
                  d="M-100,700 C300,1000 1140,1000 1640,700"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={thumbnail ? 1 : 2}
                  opacity="0.8"
                />
              </>
            )}
          </>
        )}

        {/* Reusable Subtle Noise/Grain Overlay */}
        <rect
          width={width}
          height={height}
          fill="#808080"
          filter="url(#wallpaper-noise)"
          opacity="0.055"
          style={{ mixBlendMode: 'overlay' }}
        />
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
