import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react'
import { useUiStore } from '@/store/ui-store'
import { portfolioFiles } from '@/features/portfolio/data/portfolio-data'
import { type SectionId, type ContactItem, type ExperienceItem, type ProjectItem } from '@/types/portfolio'
import { Card, CardContent, ScrollArea, Input, Button } from '@/shared/ui'
import { cn } from '@/lib/utils'

interface SearchMatch {
  lineNumber: number
  content: string
}

interface FileSearchResult {
  fileId: SectionId
  fileName: string
  icon: (typeof portfolioFiles)[number]['icon']
  matches: SearchMatch[]
}

export function SearchSidebar({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation('common')
  const [query, setQuery] = useState('')
  const [expandedFiles, setExpandedFiles] = useState<Record<SectionId, boolean>>({
    about: true,
    experience: true,
    projects: true,
    skills: true,
    contact: true,
  })

  const activeFile = useUiStore((state) => state.activeFile)
  const setActiveFile = useUiStore((state) => state.setActiveFile)

  const isEn = i18n.language === 'en'

  // Build the code-like text representation for each file to search against
  const fileContents = useMemo(() => {
    // 1. About
    const aboutRole = t('sections.about.focus')
    const aboutSummary = t('sections.about.aboutMe')
    const aboutLines = [
      `const aboutMe = {`,
      `  name: "Juan Daniel González Alejandre",`,
      `  focus: "${aboutRole}",`,
      `  about_me: "${aboutSummary}",`,
      `};`,
    ]

    // 2. Experience
    const expItems = t('sections.experience.items', { returnObjects: true }) as ExperienceItem[]
    const expLines = [`const experience = [`]
    expItems.forEach((item) => {
      expLines.push(`  {`)
      expLines.push(`    role: "${item.role}",`)
      expLines.push(`    company: "${item.company}",`)
      expLines.push(`    period: "${item.period}",`)
      expLines.push(`    bullets: [`)
      item.bullets.forEach((bullet) => {
        expLines.push(`      "${bullet}",`)
      })
      expLines.push(`    ]`)
      expLines.push(`  },`)
    })
    expLines.push(`];`)

    // 3. Projects
    const projItems = t('sections.projects.items', { returnObjects: true }) as ProjectItem[]
    const projLines = [`const projects = [`]
    projItems.forEach((project) => {
      projLines.push(`  {`)
      projLines.push(`    name: "${project.name}",`)
      projLines.push(`    description: "${project.description}",`)
      projLines.push(`    stack: [`)
      project.stack.forEach((tech) => {
        projLines.push(`      "${tech}",`)
      })
      projLines.push(`    ],`)
      if (project.href) {
        projLines.push(`    href: "${project.href}"`)
      }
      projLines.push(`  },`)
    })
    projLines.push(`];`)

    // 4. Skills
    const skillGroups = t('sections.skills.groups', { returnObjects: true }) as Record<string, string[]>
    const skillLines = [`const skills = {`]
    Object.entries(skillGroups).forEach(([group, values]) => {
      skillLines.push(`  ${group}: [`)
      values.forEach((value) => {
        skillLines.push(`    "${value}",`)
      })
      skillLines.push(`  ],`)
    })
    skillLines.push(`};`)

    // 5. Contact / README
    const contactItems = t('sections.contact.items', { returnObjects: true }) as ContactItem[]
    const contactLines = [`const contact = [`]
    contactItems.forEach((item) => {
      contactLines.push(`  {`)
      contactLines.push(`    label: "${item.label}",`)
      contactLines.push(`    value: "${item.value}",`)
      contactLines.push(`    href: "${item.href}"`)
      contactLines.push(`  },`)
    })
    contactLines.push(`];`)

    return {
      about: aboutLines,
      experience: expLines,
      projects: projLines,
      skills: skillLines,
      contact: contactLines,
    }
  }, [t])

  // Search filter matching
  const searchResults = useMemo<FileSearchResult[]>(() => {
    if (!query.trim()) return []

    const cleanQuery = query.toLowerCase().trim()

    return portfolioFiles.map((file) => {
      const lines = fileContents[file.id] || []
      const matches: SearchMatch[] = []

      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(cleanQuery)) {
          matches.push({
            lineNumber: index + 1,
            content: line.trim(),
          })
        }
      })

      const fileNames = {
        about: 'about.tsx',
        experience: 'experience.ts',
        projects: 'projects.json',
        skills: 'skills.ts',
        contact: 'README.md',
      }

      return {
        fileId: file.id,
        fileName: fileNames[file.id] || file.id,
        icon: file.icon,
        matches,
      }
    }).filter((res) => res.matches.length > 0)
  }, [query, fileContents])

  const toggleFile = (id: SectionId) => {
    setExpandedFiles((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const highlightMatch = (text: string, searchVal: string) => {
    if (!searchVal) return text
    const escaped = searchVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchVal.toLowerCase() ? (
            <span key={i} className="bg-amber-500/35 text-amber-500 dark:text-amber-400 font-semibold rounded-[2px] px-0.5">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    )
  }

  const totalMatchesCount = searchResults.reduce((acc, curr) => acc + curr.matches.length, 0)

  return (
    <Card className="h-full rounded-none border-0 border-r border-border/70 bg-vscode-sidebar/90 shadow-none backdrop-blur-xl">
      <CardContent className={cn('flex h-full min-h-0 flex-col p-3', compact && 'p-2')}>
        <p className="mb-2 px-2 text-xs uppercase tracking-[0.2em] text-muted-foreground select-none font-bold">
          {isEn ? 'Search' : 'Buscar'}
        </p>

        {/* Input box */}
        <div className="relative mb-3 flex items-center px-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isEn ? 'Search keywords...' : 'Buscar palabras clave...'}
            className="h-8 pl-8 pr-8 text-xs font-mono bg-vscode-editor/20 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/50 text-foreground"
          />
          <Search className="absolute left-3 size-3.5 text-muted-foreground/80 pointer-events-none" />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuery('')}
              className="absolute right-2 size-6 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>

        {/* Total matches count label */}
        {query && (
          <p className="px-2 pb-2 text-[11px] text-muted-foreground select-none">
            {isEn
              ? `${totalMatchesCount} result${totalMatchesCount !== 1 ? 's' : ''} found`
              : `${totalMatchesCount} resultado${totalMatchesCount !== 1 ? 's' : ''} encontrado${totalMatchesCount !== 1 ? 's' : ''}`}
          </p>
        )}

        {/* Scroll area for search results */}
        <ScrollArea className="h-full min-h-0 flex-1">
          {searchResults.length > 0 ? (
            <div className="space-y-2.5">
              {searchResults.map((result) => {
                const Icon = result.icon
                const isExpanded = expandedFiles[result.fileId] !== false
                return (
                  <div key={result.fileId} className="space-y-0.5">
                    {/* File Header */}
                    <button
                      onClick={() => toggleFile(result.fileId)}
                      className="w-full flex items-center gap-1.5 px-1 py-1 rounded text-left hover:bg-white/5 text-foreground/90 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="size-3 text-muted-foreground/70 shrink-0" />
                      ) : (
                        <ChevronRight className="size-3 text-muted-foreground/70 shrink-0" />
                      )}
                      <Icon className="size-3.5 text-foreground/80 shrink-0" />
                      <span className="text-xs font-mono truncate flex-1">{result.fileName}</span>
                      <span className="text-[10px] bg-primary/20 text-primary font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {result.matches.length}
                      </span>
                    </button>

                    {/* Matching Lines list */}
                    {isExpanded && (
                      <div className="pl-4 border-l border-border/30 ml-2.5 space-y-1 mt-1">
                        {result.matches.map((match, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveFile(result.fileId)}
                            className={cn(
                              'w-full block text-left py-1 px-2 rounded hover:bg-white/5 transition-all text-xs font-mono truncate leading-normal',
                              activeFile === result.fileId ? 'bg-primary/5 text-primary border-l border-primary/45' : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <span className="text-[10px] text-primary/75 mr-2 select-none">
                              {match.lineNumber}
                            </span>
                            <span className="text-[11px]">
                              {highlightMatch(match.content, query)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : query ? (
            <p className="text-center text-xs text-muted-foreground py-8">
              {isEn ? 'No results found.' : 'No se encontraron resultados.'}
            </p>
          ) : (
            <p className="text-center text-[11px] text-muted-foreground/60 py-8 px-2 select-none">
              {isEn
                ? 'Type in the search field above to query keywords within code files.'
                : 'Escribe en el campo superior para buscar palabras clave dentro de los archivos.'}
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
