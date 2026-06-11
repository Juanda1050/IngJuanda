import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import {
  Play,
  Square,
  Columns,
  Terminal as TerminalIcon,
  Trash2,
  Languages,
  SunMoon,
  HelpCircle,
  RotateCcw,
} from 'lucide-react'
import { useUiStore } from '@/store/ui-store'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui'

export function CommandPalette() {
  const { i18n } = useTranslation('common')
  const { theme, setTheme } = useTheme()

  const isCommandOpen = useUiStore((state) => state.isCommandOpen)
  const setCommandOpen = useUiStore((state) => state.setCommandOpen)

  // Store actions
  const runDevServer = useUiStore((state) => state.runDevServer)
  const isTerminalOpen = useUiStore((state) => state.isTerminalOpen)
  const setTerminalOpen = useUiStore((state) => state.setTerminalOpen)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const setWallpaper = useUiStore((state) => state.setWallpaper)
  const setBrightness = useUiStore((state) => state.setBrightness)
  const setVolume = useUiStore((state) => state.setVolume)
  const setMuted = useUiStore((state) => state.setMuted)
  const setTutorialActive = useUiStore((state) => state.setTutorialActive)
  const setCurrentTutorialStep = useUiStore((state) => state.setCurrentTutorialStep)

  const isEn = i18n.language === 'en'

  const commands = useMemo(() => [
    {
      label: isEn ? '> Live Preview: Run Dev Server (Vite)' : '> Vista en Vivo: Iniciar Servidor (Vite)',
      icon: Play,
      action: () => {
        runDevServer()
      },
    },
    {
      label: isEn ? '> Live Preview: Stop Dev Server' : '> Vista en Vivo: Detener Servidor',
      icon: Square,
      action: () => {
        useUiStore.setState({ terminalLines: [] })
        setTerminalOpen(false)
      },
    },
    {
      label: isEn ? '> View: Toggle Sidebar Explorer' : '> Vista: Alternar Barra Lateral',
      icon: Columns,
      action: () => {
        toggleSidebar()
      },
    },
    {
      label: isEn ? '> View: Toggle Terminal Console' : '> Vista: Alternar Consola Terminal',
      icon: TerminalIcon,
      action: () => {
        setTerminalOpen(!isTerminalOpen)
      },
    },
    {
      label: isEn ? '> Terminal: Clear Console Output' : '> Terminal: Limpiar Consola de Salida',
      icon: Trash2,
      action: () => {
        useUiStore.setState({ terminalLines: [] })
      },
    },
    {
      label: isEn ? '> Preferences: Toggle Theme (Dark / Light)' : '> Preferencias: Alternar Tema (Oscuro / Claro)',
      icon: SunMoon,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      },
    },
    {
      label: isEn ? '> Preferences: Switch Language (ES / EN)' : '> Preferencias: Cambiar Idioma (ES / EN)',
      icon: Languages,
      action: () => {
        i18n.changeLanguage(isEn ? 'es' : 'en')
      },
    },
    {
      label: isEn ? '> Help: Start Welcome Tour' : '> Ayuda: Iniciar Guía de Bienvenida',
      icon: HelpCircle,
      action: () => {
        setTutorialActive(true)
        setCurrentTutorialStep(0)
      },
    },
    {
      label: isEn ? '> Reset: Restore Desktop to Defaults' : '> Restablecer: Ajustes Predeterminados de Escritorio',
      icon: RotateCcw,
      action: () => {
        setWallpaper('default')
        setBrightness(100)
        setVolume(70)
        setMuted(false)
      },
    },
  ], [isEn, runDevServer, isTerminalOpen, setTerminalOpen, toggleSidebar, theme, setTheme, i18n, setWallpaper, setBrightness, setVolume, setMuted, setTutorialActive, setCurrentTutorialStep])

  return (
    <CommandDialog open={isCommandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder={isEn ? 'Type a developer command...' : 'Escribe un comando de desarrollo...'} />
      <CommandList>
        <CommandEmpty>{isEn ? 'No commands matching.' : 'No se encontraron comandos coincidentes.'}</CommandEmpty>
        <CommandGroup heading={isEn ? 'Developer Commands' : 'Comandos de Desarrollo'}>
          {commands.map((cmd, idx) => {
            const Icon = cmd.icon
            return (
              <CommandItem
                key={idx}
                value={cmd.label}
                onSelect={() => {
                  cmd.action()
                  setCommandOpen(false)
                }}
                className="flex items-center gap-3 py-2 px-3 hover:bg-accent rounded-lg cursor-pointer transition-colors text-xs font-mono"
              >
                <Icon className="size-4 text-muted-foreground/80 shrink-0" />
                <span className="text-foreground">{cmd.label}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
