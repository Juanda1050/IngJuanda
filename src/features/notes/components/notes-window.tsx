import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, FileText, Calendar, AlignLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NoteItem {
  id: string
  title: { en: string; es: string }
  date: { en: string; es: string }
  category: { en: string; es: string }
  content: {
    en: string
    es: string
  }
}

const NOTES_DATA: NoteItem[] = [
  {
    id: 'about_me',
    title: { en: 'About Juan Daniel', es: 'Sobre Juan Daniel' },
    date: { en: 'Today, 12:00 PM', es: 'Hoy, 12:00 PM' },
    category: { en: 'Profile', es: 'Perfil' },
    content: {
      en: `I am a passionate Fullstack Developer with 4+ years of experience leading migrations, designing systems, and building scalable web interfaces.

Focus areas:
• Web Performance (Core Web Vitals tuning)
• Developer Experience (DX) & clean setups
• Modern component architectures & modular UI design

Hobbies & Interests:
• Building side projects & hacking APIs
• Gaming & science-fiction reading
• Specialty coffee enthusiast`,
      es: `Soy un Desarrollador Fullstack apasionado con más de 4 años de experiencia liderando migraciones, diseñando sistemas y construyendo interfaces web escalables.

Áreas de enfoque:
• Rendimiento Web (Ajuste de Core Web Vitals)
• Experiencia de Desarrollo (DX) y configuraciones limpias
• Arquitecturas modernas de componentes y diseño UI modular

Pasatiempos e Intereses:
• Programar proyectos personales y explorar nuevas APIs
• Jugar videojuegos y leer ciencia ficción
• Entusiasta del café de especialidad`
    }
  },
  {
    id: 'career_path',
    title: { en: 'Professional Background', es: 'Trayectoria Profesional' },
    date: { en: 'Yesterday, 4:30 PM', es: 'Ayer, 4:30 PM' },
    category: { en: 'Experience', es: 'Experiencia' },
    content: {
      en: `Tech Studio (2022 - Present)
Position: Senior Frontend Developer
Core Achievements:
• Led architecture definitions for multi-product frontend portals.
• Improved Web Vitals scoring, cutting bundle size by 28%.
• Standardized UI component libraries and automated CI testing gates.

Digital Labs (2019 - 2022)
Position: Frontend Engineer
Core Achievements:
• Modernized old legacy portal systems, migrating them fully to React and TypeScript.
• Maintained modular components and robust state stores.

Education:
• Bachelor's in Computer Systems Engineering - Universidad de Colima (Graduated 2018)`,
      es: `Tech Studio (2022 - Actualidad)
Puesto: Senior Frontend Developer
Logros Clave:
• Liderazgo de arquitectura frontend en portales multi-producto.
• Optimización de Core Web Vitals, reduciendo tamaño del bundle en 28%.
• Estandarización de componentes UI y automatización de pruebas en CI.

Digital Labs (2019 - 2022)
Puesto: Frontend Engineer
Logros Clave:
• Modernización de portales web legacy heredados migrándolos a React y TypeScript.
• Mantenimiento de componentes modulares y estados lógicos robustos.

Educación:
• Ingeniería en Sistemas Computacionales - Universidad de Colima (Graduado en 2018)`
    }
  },
  {
    id: 'tech_stack',
    title: { en: 'Tech Stack & Setup', es: 'Tecnologías y Configuración' },
    date: { en: 'June 3, 2026', es: '3 de junio de 2026' },
    category: { en: 'Technical', es: 'Técnico' },
    content: {
      en: `Core Technologies:
• Languages: JavaScript, TypeScript, HTML, CSS
• Frameworks: React, Next.js, Vue.js, Express
• Tooling: Vite, Webpack, ESLint, Git, Docker, CI/CD
• Libraries: Zustand, Redux, Framer Motion, TailwindCSS
• Testing: Vitest, RTL (React Testing Library), Cypress

Development Environment:
• OS: macOS / Windows
• Editor: VS Code with custom themes
• Terminal: Zsh with Oh-My-Zsh & Starship prompt
• Hardware: Laptop + Ultra-wide monitor`,
      es: `Tecnologías Principales:
• Lenguajes: JavaScript, TypeScript, HTML, CSS
• Frameworks: React, Next.js, Vue.js, Express
• Herramientas: Vite, Webpack, ESLint, Git, Docker, CI/CD
• Librerías: Zustand, Redux, Framer Motion, TailwindCSS
• Pruebas: Vitest, RTL (React Testing Library), Cypress

Entorno de Desarrollo:
• SO: macOS / Windows
• Editor: VS Code con temas personalizados
• Terminal: Zsh con Oh-My-Zsh y prompt Starship
• Hardware: Laptop + Monitor Ultra-wide`
    }
  }
]

export function NotesWindow() {
  const { i18n } = useTranslation('common')
  const isEn = i18n.language === 'en'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNoteId, setSelectedNoteId] = useState('about_me')

  // Search filter
  const filteredNotes = useMemo(() => {
    return NOTES_DATA.filter(note => {
      const title = isEn ? note.title.en : note.title.es
      const content = isEn ? note.content.en : note.content.es
      const search = searchQuery.toLowerCase()
      return title.toLowerCase().includes(search) || content.toLowerCase().includes(search)
    })
  }, [searchQuery, isEn])

  // Selected note object
  const activeNote = useMemo(() => {
    return NOTES_DATA.find(note => note.id === selectedNoteId) || NOTES_DATA[0]!
  }, [selectedNoteId])

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
              placeholder={isEn ? "Search notes..." : "Buscar notas..."}
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
              {isEn ? "No notes found" : "No se encontraron notas"}
            </div>
          ) : (
            filteredNotes.map((note) => {
              const title = isEn ? note.title.en : note.title.es
              const desc = isEn ? note.content.en : note.content.es
              const dateStr = isEn ? note.date.en : note.date.es
              const category = isEn ? note.category.en : note.category.es
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
                    <span className="font-bold text-xs truncate text-foreground/90">{title}</span>
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
            <span>{isEn ? activeNote.date.en : activeNote.date.es}</span>
          </div>

          {/* Note Main Title */}
          <h1 className="text-2xl font-extrabold tracking-tight mb-4 text-foreground/90 shrink-0">
            {isEn ? activeNote.title.en : activeNote.title.es}
          </h1>

          {/* Note Content Textarea (Read only / Styled mock editor) */}
          <div className="flex-1 font-sans text-sm leading-relaxed text-muted-foreground/95 whitespace-pre-wrap select-text pr-1 focus:outline-none">
            {isEn ? activeNote.content.en : activeNote.content.es}
          </div>

          {/* Bottom helper tag */}
          <div className="mt-8 pt-4 border-t border-border/20 flex items-center justify-between text-[10px] text-muted-foreground/50 select-none shrink-0">
            <span className="flex items-center gap-1">
              <FileText className="size-3 text-muted-foreground/45" />
              <span>{isEn ? "iCloud Sync Enabled" : "Sincronizado con iCloud"}</span>
            </span>
            <span className="flex items-center gap-1">
              <AlignLeft className="size-3 text-muted-foreground/45" />
              <span>{isEn ? `${activeNote.content.en.split(' ').length} words` : `${activeNote.content.es.split(' ').length} palabras`}</span>
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
