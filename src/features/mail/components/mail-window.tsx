import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Inbox, Send, File, AlertOctagon, Trash, 
  Plus, Search, Reply, SendHorizontal, X, CheckCircle2, ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatWithAppleEmojis } from '@/components/apple-emoji'
import { AnimatePresence, motion, useDragControls, useMotionValue, animate } from 'framer-motion'

interface Email {
  id: string
  fromName: string
  fromEmail: string
  date: string
  subject: string
  body: string
}

export function MailWindow() {
  const { t } = useTranslation('common')
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'junk' | 'trash'>('inbox')
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileView, setMobileView] = useState<'folders' | 'list' | 'detail'>('folders')

  const [isMobile, setIsMobile] = useState(false)
  const listDragX = useMotionValue(0)
  const listDragControls = useDragControls()
  const detailDragX = useMotionValue(0)
  const detailDragControls = useDragControls()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    listDragX.set(0)
    detailDragX.set(0)
  }, [mobileView, listDragX, detailDragX])

  // Handle global swipe-back custom event
  useEffect(() => {
    const handleSwipe = (e: Event) => {
      if (mobileView === 'detail') {
        e.preventDefault()
        setMobileView('list')
      } else if (mobileView === 'list') {
        e.preventDefault()
        setMobileView('folders')
      }
    }
    window.addEventListener('ios-swipe-back', handleSwipe)
    return () => window.removeEventListener('ios-swipe-back', handleSwipe)
  }, [mobileView])
  
  // Compose modal states
  const [isComposing, setIsComposing] = useState(false)
  const [composeTo, setComposeTo] = useState('danielalejandre1050@gmail.com')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Sent emails local storage persistence
  const [sentEmails, setSentEmails] = useState<Email[]>(() => {
    try {
      const saved = localStorage.getItem('ing_juanda_sent_mails')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sync sent emails to localStorage
  useEffect(() => {
    localStorage.setItem('ing_juanda_sent_mails', JSON.stringify(sentEmails))
  }, [sentEmails])

  // Load standard emails from translation
  const defaultEmails = useMemo(() => {
    const raw = t('mail.emails', { returnObjects: true })
    if (!Array.isArray(raw)) return []
    return raw as Email[]
  }, [t])

  // Get emails for active folder
  const folderEmails = useMemo(() => {
    if (activeFolder === 'inbox') {
      return defaultEmails
    }
    if (activeFolder === 'sent') {
      return sentEmails
    }
    return []
  }, [activeFolder, defaultEmails, sentEmails])

  // Filter emails by query
  const filteredEmails = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return folderEmails
    return folderEmails.filter(
      (email) =>
        email.fromName.toLowerCase().includes(query) ||
        email.fromEmail.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query)
    )
  }, [folderEmails, searchQuery])

  // Sync selected email selection if current folder has emails and none selected
  const activeEmail = useMemo(() => {
    if (filteredEmails.length === 0) return null
    const found = filteredEmails.find((email) => email.id === selectedEmailId)
    return found || filteredEmails[0] || null
  }, [filteredEmails, selectedEmailId])

  // Compose Trigger
  const handleNewMessage = () => {
    setComposeTo('danielalejandre1050@gmail.com')
    setComposeSubject('')
    setComposeBody('')
    setIsComposing(true)
  }

  // Reply Trigger
  const handleReply = (email: Email) => {
    setComposeTo(email.fromEmail)
    setComposeSubject(`${t('mail.compose.replyPrefix')} ${email.subject}`)
    setComposeBody(`\n\n-------------------\nOn ${email.date}, ${email.fromName} wrote:\n> ${email.body.split('\n').join('\n> ')}`)
    setIsComposing(true)
  }

  // Form submission handler
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!composeTo || !composeSubject || !composeBody) return

    setIsSending(true)
    
    // Simulate sending network latency
    setTimeout(() => {
      const now = new Date()
      const formattedDate = now.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      const newEmail: Email = {
        id: `sent-${Date.now()}`,
        fromName: t('mail.sidebar.newMsg'),
        fromEmail: 'recruiter@portfolio-visitor.com',
        date: formattedDate,
        subject: composeSubject,
        body: composeBody
      }

      setSentEmails((prev) => [newEmail, ...prev])
      setIsSending(false)
      setIsComposing(false)
      setShowToast(true)
      setActiveFolder('sent')
      setSelectedEmailId(newEmail.id)
      setMobileView('detail')

      // Auto dismiss toast
      setTimeout(() => setShowToast(false), 3000)
    }, 1500)
  }

  // Folders map
  const folders = [
    { id: 'inbox' as const, label: t('mail.sidebar.inbox'), icon: Inbox, count: defaultEmails.length },
    { id: 'sent' as const, label: t('mail.sidebar.sent'), icon: Send, count: sentEmails.length },
    { id: 'drafts' as const, label: t('mail.sidebar.drafts'), icon: File, count: 0 },
    { id: 'junk' as const, label: t('mail.sidebar.junk'), icon: AlertOctagon, count: 0 },
    { id: 'trash' as const, label: t('mail.sidebar.trash'), icon: Trash, count: 0 }
  ]

  return (
    <div className="flex h-full w-full bg-background dark:bg-[#1a1a1c] text-foreground font-sans text-sm select-none relative overflow-hidden">
      {/* 1st Pane: Sidebar */}
      <div className={cn("w-full md:w-44 shrink-0 border-r border-border/50 bg-vscode-sidebar/95 p-3 flex flex-col justify-between overflow-y-auto", isMobile ? "w-full h-full" : "flex")}>
        <div className="space-y-4">
          <button
            onClick={handleNewMessage}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold py-2 px-3 text-xs shadow-md transition-all"
          >
            <Plus className="size-4" />
            <span>{t('mail.sidebar.newMsg')}</span>
          </button>

          <div className="space-y-1">
            {folders.map((folder) => {
              const Icon = folder.icon
              const isActive = activeFolder === folder.id
              return (
                <button
                  key={folder.id}
                  onClick={() => {
                    setActiveFolder(folder.id)
                    setSelectedEmailId(null)
                    setMobileView('list')
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors text-left',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0" />
                    <span>{folder.label}</span>
                  </div>
                  {folder.count > 0 && (
                    <span className={cn(
                      'text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-black/10 dark:bg-white/10 text-muted-foreground'
                    )}>
                      {folder.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Info label */}
        <div className="text-[10px] text-muted-foreground/60 text-center border-t border-border/30 pt-3">
          Juan Gonzalez Mailbox
        </div>
      </div>

      {/* 2nd Pane: Email List */}
      {(mobileView === 'list' || mobileView === 'detail' || !isMobile) && (
        <motion.div
          drag={isMobile && mobileView === 'list' ? "x" : false}
          dragControls={listDragControls}
          dragListener={false}
          dragConstraints={{ left: 0, right: 400 }}
          dragElastic={{ left: 0, right: 0.1 }}
          style={isMobile ? { x: listDragX } : {}}
          onDragEnd={(_, info) => {
            if (info.offset.x > 80 || info.velocity.x > 300) {
              setMobileView('folders');
            } else {
              animate(listDragX, 0, { type: "spring", stiffness: 300, damping: 30 });
            }
          }}
          className={cn(
            "w-full md:w-64 shrink-0 border-r border-border/40 bg-background/50 dark:bg-[#1a1a1c]/50 backdrop-blur-md flex flex-col min-h-0",
            isMobile ? "absolute inset-0 z-10 bg-background dark:bg-[#1a1a1c] shadow-2xl" : "relative"
          )}
        >
          {/* Edge drag gesture handle for list */}
          {isMobile && mobileView === 'list' && (
            <div
              onPointerDown={(e) => listDragControls.start(e)}
              className="absolute left-0 top-0 bottom-0 w-6 z-50 cursor-ew-resize bg-transparent"
            />
          )}

          {/* Mobile Back Button */}
          <button 
            onClick={() => setMobileView('folders')}
            className="md:hidden flex items-center text-blue-500 gap-1 px-3 py-2 font-semibold text-xs border-b border-border/20 self-start select-none"
          >
            <ChevronLeft className="size-4" />
            <span>Mailboxes</span>
          </button>

          {/* Search */}
          <div className="p-3 border-b border-border/40 relative">
            <Search className="absolute left-6 top-5 size-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder={t('music.sidebar.inputPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-background/50 dark:bg-[#1e1e1e] py-1 pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 text-foreground transition-colors"
            />
          </div>

          {/* Email Items list */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/20">
            {filteredEmails.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-xs text-muted-foreground italic">
                {t('notes.noNotes')}
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = activeEmail?.id === email.id
                return (
                  <button
                    key={email.id}
                    onClick={() => {
                      setSelectedEmailId(email.id)
                      setMobileView('detail')
                    }}
                    className={cn(
                      'w-full text-left p-3 flex flex-col gap-1 transition-colors outline-none border-l-4',
                      isSelected
                        ? 'bg-primary/10 border-primary text-foreground'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground truncate max-w-[130px]">
                        {formatWithAppleEmojis(email.fromName)}
                      </span>
                      <span className="text-[9px] text-muted-foreground/80 shrink-0">
                        {email.date.split(',')[0]}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground truncate leading-snug">
                      {formatWithAppleEmojis(email.subject)}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 line-clamp-2 leading-relaxed">
                      {formatWithAppleEmojis(email.body)}
                    </p>
                  </button>
                )
              })
            )}
          </div>
        </motion.div>
      )}

      {/* 3rd Pane: Email Details */}
      {(mobileView === 'detail' || !isMobile) && (
        <motion.div
          drag={isMobile ? "x" : false}
          dragControls={detailDragControls}
          dragListener={false}
          dragConstraints={{ left: 0, right: 400 }}
          dragElastic={{ left: 0, right: 0.1 }}
          style={isMobile ? { x: detailDragX } : {}}
          onDragEnd={(_, info) => {
            if (info.offset.x > 80 || info.velocity.x > 300) {
              setMobileView('list');
            } else {
              animate(detailDragX, 0, { type: "spring", stiffness: 300, damping: 30 });
            }
          }}
          className={cn(
            "flex-1 bg-background dark:bg-[#1a1a1c] p-6 flex flex-col justify-between overflow-y-auto select-text min-w-0",
            isMobile ? "absolute inset-0 z-20 bg-background dark:bg-[#1a1a1c] shadow-2xl" : "relative"
          )}
        >
          {/* Edge drag gesture handle for detail */}
          {isMobile && mobileView === 'detail' && (
            <div
              onPointerDown={(e) => detailDragControls.start(e)}
              className="absolute left-0 top-0 bottom-0 w-6 z-50 cursor-ew-resize bg-transparent"
            />
          )}

          {/* Mobile Back Button */}
          <button 
            onClick={() => setMobileView('list')}
            className="md:hidden flex items-center text-blue-500 gap-1 mb-4 font-semibold text-xs self-start select-none"
          >
            <ChevronLeft className="size-4" />
            <span>Emails</span>
          </button>
          {activeEmail ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header card info */}
                <div className="flex items-start justify-between border-b border-border/30 pb-4">
                  <div className="space-y-1 min-w-0">
                    <h2 className="text-base font-bold text-foreground leading-tight truncate">
                      {formatWithAppleEmojis(activeEmail.subject)}
                    </h2>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-bold text-foreground">{formatWithAppleEmojis(activeEmail.fromName)}</span>
                      <span className="ml-1.5 font-mono select-all">&lt;{activeEmail.fromEmail}&gt;</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      <span>{t('mail.compose.to')}</span>
                      <span className="ml-1 font-semibold select-all">danielalejandre1050@gmail.com</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-muted-foreground">{activeEmail.date}</span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap font-sans select-text pl-1">
                  {formatWithAppleEmojis(activeEmail.body)}
                </div>
              </div>

              {/* Reply Actions bottom block */}
              <div className="pt-4 border-t border-border/30 flex justify-end">
                <button
                  onClick={() => handleReply(activeEmail)}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-background hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all px-3.5 py-1.5 text-xs font-semibold text-foreground"
                >
                  <Reply className="size-4 text-blue-500 shrink-0" />
                  <span>{t('mail.compose.send')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center p-6 select-none">
              <Inbox className="size-12 mb-3 text-muted-foreground/30" />
              <p className="text-sm font-semibold">{t('finder.preview.noDocument')}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Compose Overlay Modal */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.form
              onSubmit={handleSend}
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-lg rounded-2xl border border-white/20 bg-background/95 dark:bg-[#1e1e1e]/98 p-5 shadow-2xl backdrop-blur-2xl text-foreground flex flex-col gap-4"
            >
              {/* Compose Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border/30">
                <h3 className="font-bold text-sm">{t('mail.compose.title')}</h3>
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="size-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Fields Inputs */}
              <div className="space-y-2.5">
                <div className="flex items-center border-b border-border/20 py-1.5 text-xs">
                  <span className="w-12 text-muted-foreground font-semibold">{t('mail.compose.to')}</span>
                  <input
                    type="email"
                    required
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-foreground select-text font-mono"
                  />
                </div>
                <div className="flex items-center border-b border-border/20 py-1.5 text-xs">
                  <span className="w-12 text-muted-foreground font-semibold">{t('mail.compose.subject')}</span>
                  <input
                    type="text"
                    required
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-foreground select-text font-semibold"
                  />
                </div>
              </div>

              {/* Message Editor textarea */}
              <textarea
                required
                rows={7}
                placeholder={t('mail.compose.messagePlaceholder')}
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-background/50 dark:bg-black/15 p-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 text-foreground transition-all select-text font-sans resize-none"
              />

              {/* Compose footer actions */}
              <div className="flex justify-end gap-2.5 border-t border-border/30 pt-3">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-border hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 text-xs font-semibold transition-all"
                >
                  {t('app.actions.close')}
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md disabled:opacity-40 disabled:scale-100 transition-all"
                >
                  {isSending ? (
                    <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <SendHorizontal className="size-3.5" />
                  )}
                  <span>{isSending ? t('mail.compose.sending') : t('mail.compose.send')}</span>
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-5 right-5 z-[99999] rounded-xl bg-green-500 text-white shadow-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{t('mail.compose.success')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
