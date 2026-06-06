import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Wifi,
  WifiOff,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
  BatteryCharging,
  Search,
  SlidersHorizontal,
  Sun,
  Moon,
  Monitor,
  Volume2,
  VolumeX,
  Globe,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useBattery, useNetwork } from '@/hooks/use-system-info'
import { useUiStore } from '@/store/ui-store'
import { AppleEmoji } from '@/components/apple-emoji'


// ------- WiFi Button -------
export function WifiStatus() {
  const { online, type, downlink } = useNetwork()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('common')

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const isWifi = type === 'wifi' || type === 'unknown' || type === 'other'
  const label = online
    ? isWifi ? 'Wi-Fi' : type.toUpperCase()
    : t('wifi.disconnected')

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex size-7 items-center justify-center rounded-md transition-colors',
          open ? 'bg-white/30 dark:bg-white/15' : 'hover:bg-white/20 dark:hover:bg-white/10'
        )}
        title={label}
      >
        {online ? (
          <Wifi className={cn('size-3.5', isWifi ? 'text-foreground/85' : 'text-amber-400')} />
        ) : (
          <WifiOff className="size-3.5 text-red-400" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-black/10 dark:border-white/10 bg-[#f0f0f0]/95 dark:bg-[#1f1f1f]/95 backdrop-blur-2xl shadow-2xl py-2 px-3 z-[9999]"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              {t('wifi.title')}
            </p>
            <div className="flex items-center gap-2.5 py-1">
              <div className={cn('size-6 rounded-full flex items-center justify-center', online ? 'bg-green-500/20' : 'bg-red-500/20')}>
                {online ? <Wifi className="size-3 text-green-500" /> : <WifiOff className="size-3 text-red-400" />}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">{online ? label : t('wifi.disconnected')}</p>
                {online && downlink !== undefined && (
                  <p className="text-[11px] text-muted-foreground">{downlink} Mbps</p>
                )}
                {!online && (
                  <p className="text-[11px] text-muted-foreground">{t('wifi.disconnected')}</p>
                )}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                <span>{t('wifi.type')}</span>
                <span className={cn('font-semibold', online ? 'text-green-500' : 'text-red-400')}>
                  {online ? t('wifi.connected') : t('wifi.disconnected')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ------- Battery Button -------
export function BatteryStatus() {
  const { supported, level, charging } = useBattery()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('common')

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const BatteryIcon = charging
    ? BatteryCharging
    : level > 75 ? BatteryFull
    : level > 40 ? BatteryMedium
    : level > 15 ? BatteryLow
    : BatteryWarning

  const batteryColor = charging
    ? 'text-green-400'
    : level > 40 ? 'text-foreground/85'
    : level > 15 ? 'text-amber-400'
    : 'text-red-400'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex size-7 items-center justify-center rounded-md transition-colors',
          open ? 'bg-white/30 dark:bg-white/15' : 'hover:bg-white/20 dark:hover:bg-white/10'
        )}
        title={supported ? `${level}% ${charging ? `(${t('battery.charging')})` : ''}` : t('battery.title')}
      >
        <BatteryIcon className={cn('size-3.5', batteryColor)} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-black/10 dark:border-white/10 bg-[#f0f0f0]/95 dark:bg-[#1f1f1f]/95 backdrop-blur-2xl shadow-2xl py-2 px-3 z-[9999]"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              {t('battery.title')}
            </p>
            {supported ? (
              <>
                <div className="flex items-center gap-2.5 py-1">
                  <div className={cn('size-6 rounded-full flex items-center justify-center', charging ? 'bg-green-500/20' : level < 20 ? 'bg-red-500/20' : 'bg-muted')}>
                    <BatteryIcon className={cn('size-3', batteryColor)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-foreground">{level}%</p>
                      {charging && (
                        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                          {t('battery.charging')}
                        </span>
                      )}
                    </div>
                    {/* Battery bar */}
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${level}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={cn('h-full rounded-full', charging ? 'bg-green-500' : level > 40 ? 'bg-foreground/70' : level > 15 ? 'bg-amber-400' : 'bg-red-400')}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[12px] text-muted-foreground py-1">{t('battery.notSupported')}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ------- Search Button -------
export function SearchButton() {
  const setCommandOpen = useUiStore((state) => state.setCommandOpen)

  return (
    <button
      onClick={() => setCommandOpen(true)}
      className="flex size-7 items-center justify-center rounded-md hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
      title="Search (⌘K)"
    >
      <Search className="size-3.5" />
    </button>
  )
}

// ------- Control Center Button -------
export function ControlCenter() {
  const { theme, setTheme } = useTheme()
  const { i18n, t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const volume = useUiStore((state) => state.volume)
  const setVolume = useUiStore((state) => state.setVolume)
  const muted = useUiStore((state) => state.muted)
  const setMuted = useUiStore((state) => state.setMuted)
  const ref = useRef<HTMLDivElement>(null)
  const openApp = useUiStore((state) => state.openApp)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const isEn = i18n.language === 'en'
  const toggleLang = () => i18n.changeLanguage(isEn ? 'es' : 'en')

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex size-7 items-center justify-center rounded-md transition-colors',
          open ? 'bg-white/30 dark:bg-white/15' : 'hover:bg-white/20 dark:hover:bg-white/10'
        )}
        title={t('toolbar.controlCenter.title')}
      >
        <SlidersHorizontal className="size-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-black/10 dark:border-white/10 bg-[#f0f0f0]/95 dark:bg-[#1f1f1f]/95 backdrop-blur-2xl shadow-2xl p-3 z-[9999]"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
              {t('toolbar.controlCenter.title')}
            </p>

            {/* Top row: Theme + Language */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {/* Theme */}
              <div className="rounded-xl bg-black/5 dark:bg-white/5 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground">{t('toolbar.controlCenter.appearance')}</p>
                <div className="flex items-center gap-1">
                  {([
                    { value: 'light', icon: Sun },
                    { value: 'dark', icon: Moon },
                    { value: 'system', icon: Monitor },
                  ] as const).map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={cn(
                        'flex-1 flex items-center justify-center rounded-lg py-1.5 transition-all',
                        theme === value ? 'bg-blue-500 text-white shadow-sm' : 'hover:bg-black/10 dark:hover:bg-white/10 text-foreground/60'
                      )}
                    >
                      <Icon className="size-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="rounded-xl bg-black/5 dark:bg-white/5 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground">{t('toolbar.controlCenter.language')}</p>
                <button
                  onClick={toggleLang}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-500 text-white py-1.5 text-[12px] font-semibold hover:bg-blue-600 transition-colors"
                >
                  <Globe className="size-3" />
                  {isEn ? 'ES →' : 'EN →'}
                </button>
              </div>
            </div>

            {/* Volume */}
            <div className="rounded-xl bg-black/5 dark:bg-white/5 p-3 mb-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-muted-foreground">{t('toolbar.controlCenter.volume')}</p>
                <button onClick={() => setMuted(!muted)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <VolumeX className="size-3 text-muted-foreground/50 shrink-0" />
                <input
                  type="range" min={0} max={100} value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(+e.target.value); setMuted(false) }}
                  className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <Volume2 className="size-3 text-muted-foreground/50 shrink-0" />
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: t('toolbar.controlCenter.shortcuts.music'), emoji: '🎵', app: 'music' as const },
                { label: t('toolbar.controlCenter.shortcuts.calendar'), emoji: '📅', app: 'calendar' as const },
                { label: t('toolbar.controlCenter.shortcuts.settings'), emoji: '⚙️', app: 'settings' as const },
              ].map(({ label, emoji, app }) => (
                <button
                  key={app}
                  onClick={() => { openApp(app); setOpen(false) }}
                  className="flex flex-col items-center gap-1 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-blue-500/10 hover:text-blue-500 transition-colors text-foreground/70"
                >
                  <AppleEmoji emoji={emoji} className="text-base select-none shrink-0 pointer-events-none" />
                  <span className="text-[10px] font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
