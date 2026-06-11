import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import {
  Folder,
  Globe,
  Mail,
  MessageSquare,
  StickyNote,
  Calendar,
  Settings as SettingsIcon,
  Terminal,
  FileText,
  Laptop,
  Languages,
  SunMoon,
} from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { useUiStore } from '@/store/ui-store'
import type { AppId } from '@/store/ui-store'
import { portfolioFiles } from '@/features/portfolio/data/portfolio-data'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui'

export function SpotlightSearch() {
  const { t, i18n } = useTranslation('common')
  const { theme, setTheme } = useTheme()

  const isSpotlightOpen = useUiStore((state) => state.isSpotlightOpen)
  const setSpotlightOpen = useUiStore((state) => state.setSpotlightOpen)

  const openApp = useUiStore((state) => state.openApp)
  const setActiveFile = useUiStore((state) => state.setActiveFile)
  const setPreviewPdfUrl = useUiStore((state) => state.setPreviewPdfUrl)
  const setWallpaper = useUiStore((state) => state.setWallpaper)

  const isEn = i18n.language === 'en'

  const categories = useMemo(() => ({
    apps: isEn ? 'Applications' : 'Aplicaciones',
    quickActions: isEn ? 'System Actions' : 'Acciones del Sistema',
    portfolio: isEn ? 'Portfolio Files' : 'Archivos del Portafolio',
    links: isEn ? 'Links & Contact' : 'Enlaces y Contacto',
  }), [isEn])

  const appItems = useMemo(() => [
    { id: 'vscode' as AppId, name: 'VS Code', desc: isEn ? 'Developer Code Editor' : 'Editor de Código de Desarrollo', icon: Terminal },
    { id: 'safari' as AppId, name: 'Safari', desc: isEn ? 'Web Browser & Links' : 'Navegador Web y Enlaces', icon: Globe },
    { id: 'finder' as AppId, name: 'Finder', desc: isEn ? 'File Explorer & Resume PDFs' : 'Explorador de Archivos y PDFs', icon: Folder },
    { id: 'notes' as AppId, name: 'Notes', desc: isEn ? 'Rich Text Editor' : 'Editor de Notas de Texto', icon: StickyNote },
    { id: 'messages' as AppId, name: 'Messages', desc: isEn ? 'Interactive Chat Assistant' : 'Asistente de Chat Interactivo', icon: MessageSquare },
    { id: 'mail' as AppId, name: 'Mail', desc: isEn ? 'Email Client / Contact' : 'Cliente de Correo / Contacto', icon: Mail },
    { id: 'calendar' as AppId, name: 'Calendar', desc: isEn ? 'Schedule Meeting Slots' : 'Agendar Reunión y Citas', icon: Calendar },
    { id: 'settings' as AppId, name: 'Settings', desc: isEn ? 'System Settings & Wallpapers' : 'Configuración de Sistema y Fondos', icon: SettingsIcon },
  ], [isEn])

  const portfolioItems = useMemo(() =>
    portfolioFiles.map((file) => ({
      id: file.id,
      name: file.id === 'about' ? 'about.tsx' : file.id === 'projects' ? 'projects.json' : file.id === 'skills' ? 'skills.ts' : file.id === 'experience' ? 'experience.ts' : 'README.md',
      desc: t(file.key),
      icon: file.icon,
    })),
    [t]
  )

  const quickActionItems = useMemo(() => [
    {
      name: isEn ? 'Toggle Theme (Light / Dark)' : 'Alternar Tema (Claro / Oscuro)',
      desc: isEn ? 'Appearance' : 'Apariencia del Sistema',
      icon: SunMoon,
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
    {
      name: isEn ? 'Switch Language (ES / EN)' : 'Cambiar Idioma (ES / EN)',
      desc: isEn ? 'Current: English' : 'Actual: Español',
      icon: Languages,
      action: () => i18n.changeLanguage(isEn ? 'es' : 'en'),
    },
    {
      name: isEn ? 'Cycle Desktop Wallpaper' : 'Cambiar Fondo de Pantalla',
      desc: isEn ? 'Next random background' : 'Siguiente fondo de pantalla',
      icon: Laptop,
      action: () => {
        const wallpapers = ['default', 'monterey', 'sonoma', 'aurora', 'midnight']
        const current = useUiStore.getState().wallpaper
        const currentIndex = wallpapers.indexOf(current)
        const nextIndex = (currentIndex + 1) % wallpapers.length
        setWallpaper(wallpapers[nextIndex]!)
      },
    },
    {
      name: isEn ? 'Open Spanish CV (PDF)' : 'Abrir CV en Español (PDF)',
      desc: 'PDF Reader',
      icon: FileText,
      action: () => {
        setPreviewPdfUrl('/profile/CV Juan Daniel González Alejandre.pdf')
        openApp('preview')
      },
    },
    {
      name: isEn ? 'Open English Resume (PDF)' : 'Abrir Resume en Inglés (PDF)',
      desc: 'PDF Reader',
      icon: FileText,
      action: () => {
        setPreviewPdfUrl('/profile/Resume Juan Daniel González Alejandre.pdf')
        openApp('preview')
      },
    },
  ], [isEn, theme, setTheme, i18n, setWallpaper, setPreviewPdfUrl, openApp])

  const linkItems = useMemo(() => [
    {
      name: 'LinkedIn Profile',
      desc: 'linkedin.com/in/daniel-alejandre-3331951b5',
      icon: FaLinkedin,
      action: () => window.open('https://linkedin.com/in/daniel-alejandre-3331951b5', '_blank'),
    },
    {
      name: 'GitHub Profile',
      desc: 'github.com/Juanda1050',
      icon: FaGithub,
      action: () => window.open('https://github.com/Juanda1050', '_blank'),
    },
    {
      name: isEn ? 'Email Juan Daniel' : 'Enviar Correo a Juan Daniel',
      desc: 'danielalejandre1050@gmail.com',
      icon: Mail,
      action: () => openApp('mail'),
    },
  ], [isEn, openApp])

  return (
    <CommandDialog open={isSpotlightOpen} onOpenChange={setSpotlightOpen}>
      <CommandInput placeholder={isEn ? "Spotlight Search (Search apps, files, settings...)" : "Spotlight (Busca apps, archivos, ajustes...)"} />
      <CommandList className="max-h-[380px]">
        <CommandEmpty>{isEn ? "No results found." : "No se encontraron resultados."}</CommandEmpty>

        {/* Applications */}
        <CommandGroup heading={categories.apps}>
          {appItems.map((app) => {
            const Icon = app.icon
            return (
              <CommandItem
                key={app.id}
                value={app.name}
                onSelect={() => {
                  openApp(app.id)
                  setSpotlightOpen(false)
                }}
                className="flex items-center justify-between py-2 px-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground/80">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[13px] font-medium text-foreground">{app.name}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{app.desc}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        {/* Quick Actions */}
        <CommandGroup heading={categories.quickActions}>
          {quickActionItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={idx}
                value={item.name}
                onSelect={() => {
                  item.action()
                  setSpotlightOpen(false)
                }}
                className="flex items-center justify-between py-2 px-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground/80">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[13px] font-medium text-foreground">{item.name}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{item.desc}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        {/* Portfolio Files */}
        <CommandGroup heading={categories.portfolio}>
          {portfolioItems.map((item) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => {
                  openApp('vscode')
                  setActiveFile(item.id)
                  setSpotlightOpen(false)
                }}
                className="flex items-center justify-between py-2 px-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground/80">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[13px] font-mono text-foreground">{item.name}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{item.desc}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        {/* Links */}
        <CommandGroup heading={categories.links}>
          {linkItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={idx}
                value={item.name}
                onSelect={() => {
                  item.action()
                  setSpotlightOpen(false)
                }}
                className="flex items-center justify-between py-2 px-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground/80">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[13px] font-medium text-foreground">{item.name}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{item.desc}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
