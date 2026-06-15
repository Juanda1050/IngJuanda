import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, MapPin, Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { formatWithAppleEmojis } from '@/components/apple-emoji-utils'
import { useMobile } from '@/hooks/use-mobile'

interface MilestoneEvent {
  id: string
  date: string // YYYY-MM-DD
  title: string
  type: 'work' | 'education' | 'project'
  location: string
  company: string
  description: string
  bullets: string[]
}

const getColorForType = (type: 'work' | 'education' | 'project') => {
  if (type === 'education') {
    return {
      bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30',
      dot: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    }
  }
  if (type === 'work') {
    return {
      bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30',
      dot: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    }
  }
  return {
    bg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30',
    dot: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
  }
}

export function CalendarWindow() {
  const { t, i18n } = useTranslation('common')
  const isEn = i18n.language === 'en'
  const isMobile = useMobile()

  // Map filters
  const [filters, setFilters] = useState({
    work: true,
    education: true,
    project: true
  })

  const [showEventsList, setShowEventsList] = useState(false)
  
  // Date View State (Defaults to June 2026 which has our portfolio launch)
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 5, 1))
  const [selectedEvent, setSelectedEvent] = useState<MilestoneEvent | null>(null)
  
  const popoverRef = useRef<HTMLDivElement>(null)

  const milestonesData = useMemo(() => {
    const raw = t('calendar.milestones', { returnObjects: true })
    if (!Array.isArray(raw)) return []
    return raw as MilestoneEvent[]
  }, [t])

  // Filter events based on selections
  const filteredEvents = useMemo(() => {
    return milestonesData.filter(evt => filters[evt.type])
  }, [filters, milestonesData])

  // Map events to date strings for quick grid lookup
  const eventsByDate = useMemo(() => {
    const acc: Record<string, MilestoneEvent[]> = {}
    filteredEvents.forEach(evt => {
      if (!acc[evt.date]) acc[evt.date] = []
      acc[evt.date]!.push(evt)
    })
    return acc
  }, [filteredEvents])

  // Handle Month Navigation
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    setSelectedEvent(null)
  }

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    setSelectedEvent(null)
  }

  const jumpToToday = () => {
    // Jump to the current execution month/year: June 2026
    setCurrentMonth(new Date(2026, 5, 1))
    setSelectedEvent(null)
  }

  // Jump directly to event's month
  const selectMilestone = (evt: MilestoneEvent) => {
    const evtDate = new Date(evt.date + 'T00:00:00')
    setCurrentMonth(new Date(evtDate.getFullYear(), evtDate.getMonth(), 1))
    setSelectedEvent(evt)
  }

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setSelectedEvent(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calculate Calendar Grid days (42 cells: 6 rows of 7 days)
  const gridCells = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const startDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday
    const daysInM = new Date(year, month + 1, 0).getDate()
    const daysInPrevM = new Date(year, month, 0).getDate()

    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean; events: MilestoneEvent[] }[] = []

    // Padding from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, daysInPrevM - i)
      const dateStr = prevDate.toISOString().split('T')[0]!
      cells.push({
        dateStr,
        dayNum: daysInPrevM - i,
        isCurrentMonth: false,
        isToday: false,
        events: eventsByDate[dateStr] || []
      })
    }

    // Days of current month
    const today = new Date()
    for (let i = 1; i <= daysInM; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i
      cells.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: true,
        isToday,
        events: eventsByDate[dateStr] || []
      })
    }

    // Padding from next month
    const totalCells = 42
    const remaining = totalCells - cells.length
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i)
      const dateStr = nextDate.toISOString().split('T')[0]!
      cells.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: false,
        isToday: false,
        events: eventsByDate[dateStr] || []
      })
    }

    return cells
  }, [currentMonth, eventsByDate])

  // Get localized labels
  const monthLabel = currentMonth.toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
    month: 'long',
    year: 'numeric'
  })

  // Weekday headings
  const weekdayHeadings = useMemo(() => {
    // Return localized abbreviations of weekdays starting Sunday
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(2026, 4, 3 + idx) // May 3, 2026 is a Sunday
      return d.toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
        weekday: isMobile ? 'narrow' : 'short'
      })
    })
  }, [isEn, isMobile])

  // Format date helper
  const formatEventDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={cn(
      "flex h-full w-full flex-col md:flex-row text-foreground font-sans text-sm select-none",
      isMobile ? "bg-white dark:bg-black" : "bg-background dark:bg-[#1a1a1a]"
    )}>
      
      {/* Sidebar Filter and Upcoming List */}
      <div className={cn(
        "w-full md:w-64 shrink-0 p-4 flex flex-col overflow-y-auto",
        isMobile 
          ? "bg-[#f2f2f7] dark:bg-black border-transparent justify-start" 
          : "justify-between border-b md:border-b-0 md:border-r border-border/50 bg-vscode-sidebar/95",
        showEventsList ? "flex w-full h-full" : "hidden md:flex"
      )}>
        {isMobile && showEventsList && (
          <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4 shrink-0">
            <button
              onClick={() => setShowEventsList(false)}
              className="flex items-center gap-0.5 text-[#ff3b30] dark:text-[#ff453a] font-semibold text-[16px] -ml-2"
            >
              <ChevronLeft className="size-5 shrink-0" />
              <span>{t('calendar.title', 'Calendar')}</span>
            </button>
            <span className="font-bold text-[17px] text-foreground">
              {t('calendar.sidebar.listTitle', 'Events')}
            </span>
            <div className="w-16" />
          </div>
        )}
        <div className="space-y-6">
          {/* Calendar Selectors */}
          <div className="space-y-2.5">
            <h3 className={cn(
              "text-xs font-bold uppercase tracking-wider px-1",
              isMobile ? "text-gray-500 dark:text-gray-400" : "text-muted-foreground"
            )}>
              {t('calendar.sidebar.title')}
            </h3>
            <div className={cn(
              "space-y-1.5",
              isMobile ? "bg-white dark:bg-[#1c1c1e] rounded-xl p-2.5 divide-y divide-gray-200 dark:divide-white/10" : ""
            )}>
              {[
                { type: 'work', label: t('calendar.sidebar.work'), color: 'bg-emerald-500' },
                { type: 'education', label: t('calendar.sidebar.education'), color: 'bg-blue-500' },
                { type: 'project', label: t('calendar.sidebar.projects'), color: 'bg-purple-500' }
              ].map(item => (
                <button
                  key={item.type}
                  onClick={() => setFilters(prev => ({ ...prev, [item.type]: !prev[item.type as keyof typeof prev] }))}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors text-left",
                    isMobile 
                      ? "text-black dark:text-white text-[15px] py-3 hover:bg-transparent" 
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  <span className={cn(
                    "flex size-4 items-center justify-center rounded border transition-all",
                    filters[item.type as keyof typeof filters] 
                      ? "border-transparent bg-primary text-primary-foreground" 
                      : "border-muted-foreground/30 bg-transparent"
                  )}>
                    {filters[item.type as keyof typeof filters] && <Check className="size-3 stroke-[3]" />}
                  </span>
                  <span className={cn("size-2.5 rounded-full shrink-0", item.color)} />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Milestone list (Chronological shortcut) */}
          <div className="space-y-2.5">
            <h3 className={cn(
              "text-xs font-bold uppercase tracking-wider px-1",
              isMobile ? "text-gray-500 dark:text-gray-400" : "text-muted-foreground"
            )}>
              {t('calendar.sidebar.listTitle')}
            </h3>
            <div className={cn(
              "space-y-1.5 pr-1",
              isMobile ? "space-y-2.5 max-h-none overflow-visible" : "max-h-44 md:max-h-none overflow-y-auto"
            )}>
              {milestonesData.map(evt => (
                <button
                  key={evt.id}
                  onClick={() => selectMilestone(evt)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg p-2 text-xs transition-all text-left border border-transparent",
                    isMobile
                      ? "bg-white dark:bg-[#1c1c1e] p-3 rounded-xl shadow-sm"
                      : selectedEvent?.id === evt.id
                        ? "bg-primary/10 border-primary/20 text-foreground"
                        : "hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className={cn("size-2 rounded-full shrink-0 mt-1.5", getColorForType(evt.type).dot)} />
                  <div className="min-w-0">
                    <p className={cn("font-semibold truncate", isMobile ? "text-[14px]" : "")}>{formatWithAppleEmojis(evt.title)}</p>
                    <p className={cn("text-[10px] text-muted-foreground/70", isMobile ? "text-[12px] mt-0.5" : "")}>{formatWithAppleEmojis(evt.company)} • {evt.date.split('-')[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Small legend block */}
        <div className="hidden md:flex items-center gap-2.5 border-t border-border/40 pt-4 text-[11px] text-muted-foreground">
          <CalendarIcon className="size-4 shrink-0 text-primary/70 animate-pulse" />
          <span>{t('calendar.sidebar.infoText')}</span>
        </div>
      </div>

      {/* Main Grid Calendar Container */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 relative",
        isMobile ? "bg-white dark:bg-black" : "bg-background dark:bg-[#1c1c1e]",
        showEventsList ? "hidden md:flex" : "flex"
      )}>
        
        {/* Calendar Nav Header */}
        <div className={cn(
          "flex h-12 shrink-0 items-center justify-between border-b backdrop-blur-md px-4 md:px-6",
          isMobile 
            ? "border-transparent bg-white/50 dark:bg-black/50" 
            : "border-border/40 bg-background/50 dark:bg-[#1c1c1e]/50"
        )}>
          {/* Month/Year Name */}
          <h2 className={cn(
            "text-base font-bold capitalize tracking-tight",
            isMobile ? "text-[#ff3b30] dark:text-[#ff453a]" : "text-foreground/90"
          )}>
            {monthLabel}
          </h2>

          {/* Actions & Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEventsList(!showEventsList)}
              className={cn(
                "md:hidden px-3 py-1 text-xs font-semibold rounded-md border active:scale-95 transition-all",
                isMobile 
                  ? "border-[#ff3b30]/20 bg-[#ff3b30]/10 hover:bg-[#ff3b30]/20 text-[#ff3b30] dark:text-[#ff453a]" 
                  : "border-border/80 hover:bg-black/5 dark:hover:bg-white/5 text-foreground"
              )}
            >
              {showEventsList ? "Calendar" : "Events"}
            </button>
            <button
              onClick={jumpToToday}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md active:scale-95 transition-all",
                isMobile 
                  ? "text-[#ff3b30] dark:text-[#ff453a] hover:text-[#ff3b30]/80 font-bold" 
                  : "border border-border/80 hover:bg-black/5 dark:hover:bg-white/5 text-foreground"
              )}
            >
              {t('calendar.header.today')}
            </button>
            <div className={cn(
              "flex items-center overflow-hidden",
              isMobile 
                ? "text-[#ff3b30] dark:text-[#ff453a]" 
                : "rounded-md border border-border/80 bg-background dark:bg-transparent"
            )}>
              <button
                onClick={prevMonth}
                className={cn(
                  "flex size-7 items-center justify-center transition-colors",
                  isMobile 
                    ? "hover:text-[#ff3b30]/80 active:scale-90" 
                    : "border-r border-border hover:bg-black/5 dark:hover:bg-white/5"
                )}
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={nextMonth}
                className={cn(
                  "flex size-7 items-center justify-center transition-colors",
                  isMobile 
                    ? "hover:text-[#ff3b30]/80 active:scale-90" 
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                )}
                aria-label="Next month"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Weekday Row */}
        <div className={cn(
          "grid grid-cols-7 border-b bg-black/[0.02] dark:bg-white/[0.01]",
          isMobile ? "border-transparent bg-transparent" : "border-border/30"
        )}>
          {weekdayHeadings.map((day, idx) => (
            <div
              key={`${day}-${idx}`}
              className="py-2 text-center text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className={cn(
          "flex-1 grid grid-cols-7 grid-rows-6 min-h-0",
          isMobile ? "bg-transparent" : "bg-black/[0.01] dark:bg-white/[0.003]"
        )}>
          {gridCells.map((cell, idx) => (
            <div
              key={`${cell.dateStr}-${idx}`}
              className={cn(
                "relative flex flex-col select-none min-h-0",
                isMobile 
                  ? "items-center justify-start pt-2 bg-transparent" 
                  : "border-b border-r border-border/30 p-1 md:p-1.5",
                !isMobile && !cell.isCurrentMonth && "opacity-30 dark:opacity-20 bg-muted/10",
                !isMobile && idx % 7 === 6 && "border-r-0"
              )}
            >
              {/* Day Number */}
              <div className={cn(
                "flex flex-col items-center justify-center relative",
                isMobile ? "size-10" : "w-full flex-row justify-between items-center mb-1"
              )}>
                <span className={cn(
                  "flex size-7 md:size-6 items-center justify-center rounded-full text-xs font-bold transition-all shrink-0",
                  cell.isToday 
                    ? "bg-[#ff3b30] text-white shadow-sm" 
                    : cell.isCurrentMonth 
                      ? "text-foreground" 
                      : isMobile
                        ? "text-muted-foreground/30"
                        : "text-muted-foreground"
                )}>
                  {cell.dayNum}
                </span>

                {/* Mobile indicators if any events present */}
                {isMobile && cell.events.length > 0 && (
                  <span className="absolute bottom-0.5 flex gap-0.5 justify-center w-full">
                    {cell.events.map(evt => (
                      <span key={evt.id} className={cn("size-1 rounded-full", getColorForType(evt.type).dot)} />
                    ))}
                  </span>
                )}
                
                {!isMobile && cell.events.length > 0 && (
                  <span className="flex gap-0.5 md:hidden">
                    {cell.events.map(evt => (
                      <span key={evt.id} className={cn("size-1 rounded-full", getColorForType(evt.type).dot)} />
                    ))}
                  </span>
                )}
              </div>

              {/* Event lists inside cell (Visible only on Desktop/Tablet sizes) */}
              <div className="flex-1 hidden md:flex flex-col gap-1 overflow-hidden min-h-0">
                {cell.events.map(evt => (
                  <button
                    key={evt.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEvent(evt)
                    }}
                    className={cn(
                      "w-full rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide leading-normal text-left truncate transition-all active:scale-95 shadow-sm border-l-[3px] border-l-solid",
                      getColorForType(evt.type).bg,
                      selectedEvent?.id === evt.id ? "ring-2 ring-primary/45 scale-[1.01]" : ""
                    )}
                  >
                    {formatWithAppleEmojis(evt.title)}
                  </button>
                ))}
              </div>

              {/* Mobile overlay tap catcher */}
              <button
                className="absolute inset-0 block md:hidden bg-transparent border-0 outline-none cursor-pointer"
                onClick={() => {
                  if (cell.events.length > 0) {
                    setSelectedEvent(cell.events[0] || null)
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Dynamic Detail Card Popover */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "absolute z-30 bottom-4 right-4 left-4 md:left-auto md:w-96 rounded-2xl border p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl text-foreground",
                isMobile 
                  ? "bg-background/95 dark:bg-[#1c1c1e]/98 border-gray-200 dark:border-white/10"
                  : "border-white/20 bg-background/95 dark:bg-[#2c2c2e]/98"
              )}
            >
              {/* Event Category Color Accent Dot */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("size-3 rounded-full shrink-0", getColorForType(selectedEvent.type).dot)} />
                  <h4 className="font-bold text-sm tracking-tight truncate">
                    {formatWithAppleEmojis(selectedEvent.title)}
                  </h4>
                </div>
                <Badge className={cn("shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 border-none", getColorForType(selectedEvent.type).badge)}>
                  {t('calendar.sidebar.' + selectedEvent.type)}
                </Badge>
              </div>

              {/* Company & Date */}
              <div className="space-y-1.5 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground/90">{formatEventDate(selectedEvent.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{formatWithAppleEmojis(selectedEvent.company)} • {formatWithAppleEmojis(selectedEvent.location)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <p className="text-xs leading-relaxed text-muted-foreground/90 bg-muted/20 p-2.5 rounded-lg border border-border/20">
                  {formatWithAppleEmojis(selectedEvent.description)}
                </p>

                {/* Achievements bullet points */}
                <div className="space-y-1.5 pl-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="size-3 text-primary" />
                    <span>{t('calendar.detailCard.highlights')}</span>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                    {selectedEvent.bullets.map((bullet, idx) => (
                      <li key={idx} className="leading-relaxed pl-1 text-[11px] list-none relative before:content-['•'] before:absolute before:left-[-10px] before:text-primary">
                        {formatWithAppleEmojis(bullet)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end border-t border-border/40 mt-4 pt-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className={cn(
                    "px-3 py-1.5 font-semibold rounded-lg text-xs hover:opacity-90 active:scale-95 transition-all shadow-md",
                    isMobile 
                      ? "bg-[#ff3b30] text-white" 
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {t('calendar.detailCard.dismiss')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  )
}
