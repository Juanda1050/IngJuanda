import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, FileText, Calendar, AlignLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatWithAppleEmojis } from '@/components/apple-emoji'

interface NoteItem {
  id: string
  title: string
  date: string
  category: string
  content: string
}

export function NotesWindow() {
  const { t } = useTranslation('common')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNoteId, setSelectedNoteId] = useState('about_me')

  const notesData = useMemo(() => {
    return t('notes.notesData', { returnObjects: true }) as NoteItem[]
  }, [t])

  // Search filter
  const filteredNotes = useMemo(() => {
    if (!Array.isArray(notesData)) return []
    return notesData.filter(note => {
      const title = note.title || ''
      const content = note.content || ''
      const search = searchQuery.toLowerCase()
      return title.toLowerCase().includes(search) || content.toLowerCase().includes(search)
    })
  }, [searchQuery, notesData])

  // Selected note object
  const activeNote = useMemo(() => {
    if (!Array.isArray(notesData) || notesData.length === 0) {
      return { id: '', title: '', date: '', category: '', content: '' }
    }
    return notesData.find(note => note.id === selectedNoteId) || notesData[0]!
  }, [selectedNoteId, notesData])

  return (
    <div className="flex h-full w-full bg-[#fdfcf7] dark:bg-[#1c1c1e] text-foreground font-sans text-sm select-none">
      
      {/* Notes Sidebar */}
      <div className="w-56 shrink-0 border-r border-border/50 bg-[#f4f2ea] dark:bg-[#252526] flex flex-col min-h-0">
        
        {/* Search Input */}
        <div className="p-3 border-b border-border/40 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 size-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder={t('notes.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-background/50 dark:bg-[#1e1e1e] py-1 pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 text-foreground transition-colors"
            />
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground italic">
              {t('notes.noNotes')}
            </div>
          ) : (
            filteredNotes.map((note) => {
              const title = note.title || ''
              const desc = note.content || ''
              const dateStr = note.date || ''
              const category = note.category || ''
              const isSelected = note.id === selectedNoteId

              return (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={cn(
                    "w-full rounded-lg p-2.5 text-left transition-all relative border border-transparent",
                    isSelected
                      ? "bg-[#e5dfc9] dark:bg-[#323234] text-foreground border-[#d2c9ab] dark:border-white/10"
                      : "hover:bg-[#ebe6d5] dark:hover:bg-[#2c2c2e]/70 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs truncate text-foreground/90">{formatWithAppleEmojis(title)}</span>
                    <span className="text-[9px] uppercase font-extrabold tracking-wider bg-foreground/5 dark:bg-white/5 px-1.5 py-0.5 rounded text-muted-foreground/70 shrink-0">
                      {category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/80">
                    <span className="shrink-0">{dateStr.split(',')[0]}</span>
                    <span className="truncate leading-normal">{desc.replace(/\n/g, ' ')}</span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Note Body Editor Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col relative select-text bg-[#fcfbf9] dark:bg-[#1e1e1e]">
        {/* Apple Notes styled paper texture overlay (simulated by subtle border / shadow layout) */}
        <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col h-full">
          
          {/* Note Metadata Header */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/75 font-semibold border-b border-border/20 pb-3 mb-6 select-none shrink-0">
            <Calendar className="size-3.5 text-primary/70" />
            <span>{activeNote.date}</span>
          </div>

          {/* Note Main Title */}
          <h1 className="text-2xl font-extrabold tracking-tight mb-4 text-foreground/90 shrink-0">
            {formatWithAppleEmojis(activeNote.title)}
          </h1>

          {/* Note Content Textarea (Read only / Styled mock editor) */}
          <div className="flex-1 font-sans text-sm leading-relaxed text-muted-foreground/95 whitespace-pre-wrap select-text pr-1 focus:outline-none">
            {formatWithAppleEmojis(activeNote.content)}
          </div>

          {/* Bottom helper tag */}
          <div className="mt-8 pt-4 border-t border-border/20 flex items-center justify-between text-[10px] text-muted-foreground/50 select-none shrink-0">
            <span className="flex items-center gap-1">
              <FileText className="size-3 text-muted-foreground/45" />
              <span>{t('notes.syncText')}</span>
            </span>
            <span className="flex items-center gap-1">
              <AlignLeft className="size-3 text-muted-foreground/45" />
              <span>{t('notes.wordsCount', { count: (activeNote.content || '').trim().split(/\s+/).length })}</span>
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
