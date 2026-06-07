import { create } from 'zustand'
import { portfolioFiles } from '@/features/portfolio/data/portfolio-data'
import { type SectionId } from '@/types/portfolio'

export type AppId = 'vscode' | 'safari' | 'notes' | 'messages' | 'finder' | 'calendar' | 'preview' | 'mail' | 'settings'

export interface AppWindowState {
  state: 'open' | 'minimized' | 'closed'
  isMaximized: boolean
}

interface UiState {
  // Legacy VS Code window state (for compatibility)
  windowState: 'open' | 'minimized' | 'closed'
  isWindowMaximized: boolean
  closeWindow: () => void
  minimizeWindow: () => void
  restoreWindow: () => void
  toggleWindowMaximize: () => void

  // File explorer states
  activeFile: SectionId
  openFiles: SectionId[]
  isSidebarOpen: boolean
  isCommandOpen: boolean
  setActiveFile: (file: SectionId) => void
  closeFile: (file: SectionId) => void
  toggleSidebar: () => void
  setCommandOpen: (open: boolean) => void

  // New multi-window app state
  apps: Record<AppId, AppWindowState>
  stackingOrder: AppId[]
  activeApp: AppId | null
  previewPdfUrl: string | null
  
  openApp: (appId: AppId) => void
  closeApp: (appId: AppId) => void
  minimizeApp: (appId: AppId) => void
  focusApp: (appId: AppId) => void
  toggleAppMaximize: (appId: AppId) => void
  setPreviewPdfUrl: (url: string | null) => void

  // Terminal state
  isTerminalOpen: boolean
  terminalLines: string[]
  setTerminalOpen: (open: boolean) => void
  runDevServer: () => void

  // Volume state
  volume: number
  muted: boolean
  setVolume: (vol: number) => void
  setMuted: (muted: boolean) => void

  // System Settings states
  wallpaper: string
  brightness: number
  nightShift: boolean
  setWallpaper: (wp: string) => void
  setBrightness: (brightness: number) => void
  setNightShift: (active: boolean) => void

  // Tutorial states
  isTutorialActive: boolean
  currentTutorialStep: number
  setTutorialActive: (active: boolean) => void
  setCurrentTutorialStep: (step: number) => void
}

const fallbackFile: SectionId = portfolioFiles[0]?.id ?? 'about'

export const useUiStore = create<UiState>((set, get) => ({
  // Legacy VS Code window state
  windowState: 'open',
  isWindowMaximized: false,

  // File explorer states
  activeFile: fallbackFile,
  openFiles: [fallbackFile],
  isSidebarOpen: true,
  isCommandOpen: false,

  // New multi-window app state
  apps: {
    vscode: { state: 'open', isMaximized: false },
    safari: { state: 'closed', isMaximized: false },
    notes: { state: 'closed', isMaximized: false },
    messages: { state: 'closed', isMaximized: false },
    finder: { state: 'closed', isMaximized: false },
    calendar: { state: 'closed', isMaximized: false },
    preview: { state: 'closed', isMaximized: false },
    mail: { state: 'closed', isMaximized: false },
    settings: { state: 'closed', isMaximized: false },
  },
  stackingOrder: ['vscode'],
  activeApp: 'vscode',
  previewPdfUrl: null,

  // File actions
  setActiveFile: (file) =>
    set((state) => ({
      activeFile: file,
      openFiles: state.openFiles.includes(file) ? state.openFiles : [...state.openFiles, file],
    })),
  closeFile: (file) =>
    set((state) => {
      const remaining = state.openFiles.filter((item) => item !== file)
      const nextOpen = remaining.length > 0 ? remaining : [fallbackFile]
      const nextActive = state.activeFile === file ? (nextOpen[nextOpen.length - 1] ?? fallbackFile) : state.activeFile
      return {
        openFiles: nextOpen,
        activeFile: nextActive,
      }
    }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setCommandOpen: (open) => set({ isCommandOpen: open }),

  // Multi-window app actions
  openApp: (appId) => {
    set((state) => {
      const updatedApps = {
        ...state.apps,
        [appId]: {
          ...state.apps[appId],
          state: 'open' as const,
        },
      }
      
      // Update legacy state for VS Code
      const legacyState = appId === 'vscode' ? { windowState: 'open' as const } : {}

      return {
        apps: updatedApps,
        ...legacyState,
      }
    })
    get().focusApp(appId)
  },

  closeApp: (appId) =>
    set((state) => {
      const updatedApps = {
        ...state.apps,
        [appId]: {
          ...state.apps[appId],
          state: 'closed' as const,
          isMaximized: false,
        },
      }
      const newStack = state.stackingOrder.filter((id) => id !== appId)
      const nextActive = newStack.length > 0 ? (newStack[newStack.length - 1] ?? null) : null
      
      // Update legacy state for VS Code
      const legacyState = appId === 'vscode' ? { windowState: 'closed' as const, isWindowMaximized: false } : {}

      return {
        apps: updatedApps,
        stackingOrder: newStack,
        activeApp: nextActive,
        ...legacyState,
      }
    }),

  minimizeApp: (appId) =>
    set((state) => {
      const updatedApps = {
        ...state.apps,
        [appId]: {
          ...state.apps[appId],
          state: 'minimized' as const,
        },
      }
      const newStack = state.stackingOrder.filter((id) => id !== appId)
      const nextActive = newStack.length > 0 ? (newStack[newStack.length - 1] ?? null) : null
      
      // Update legacy state for VS Code
      const legacyState = appId === 'vscode' ? { windowState: 'minimized' as const } : {}

      return {
        apps: updatedApps,
        stackingOrder: newStack,
        activeApp: nextActive,
        ...legacyState,
      }
    }),

  focusApp: (appId) =>
    set((state) => {
      // Bring to front in stacking order
      const newStack = state.stackingOrder.filter((id) => id !== appId)
      newStack.push(appId)

      // Ensure state is open if focused
      const updatedApps = {
        ...state.apps,
        [appId]: {
          ...state.apps[appId],
          state: state.apps[appId].state === 'closed' ? ('open' as const) : state.apps[appId].state,
        },
      }

      return {
        apps: updatedApps,
        stackingOrder: newStack,
        activeApp: appId,
      }
    }),

  toggleAppMaximize: (appId) => {
    set((state) => {
      const updatedApps = {
        ...state.apps,
        [appId]: {
          ...state.apps[appId],
          isMaximized: !state.apps[appId].isMaximized,
        },
      }
      
      // Update legacy state for VS Code
      const legacyState = appId === 'vscode' ? { isWindowMaximized: !state.isWindowMaximized } : {}

      return {
        apps: updatedApps,
        ...legacyState,
      }
    })
    get().focusApp(appId)
  },

  setPreviewPdfUrl: (url) => set({ previewPdfUrl: url }),

  // Terminal initial state and actions
  isTerminalOpen: false,
  terminalLines: [],
  setTerminalOpen: (open) => set({ isTerminalOpen: open }),
  runDevServer: () => {
    set({ isTerminalOpen: true, terminalLines: [] })
    const lines = [
      'guest@juanda.dev:~/portfolio$ npm run dev',
      '',
      '> ingjuanda@0.0.0 dev',
      '> vite',
      '',
      '  VITE v8.0.11  ready in 480 ms',
      '',
      '  ➜  Local:   http://localhost:5174/cv',
      '  ➜  Network: use --host to expose',
      '  ➜  press h + enter to show help',
      '',
      '  [vite] hot module replacement enabled',
    ]
    
    // Print lines one by one
    let currentLine = 0
    const printNextLine = () => {
      if (currentLine < lines.length) {
        set((state) => ({
          terminalLines: [...state.terminalLines, lines[currentLine]!],
        }))
        currentLine++
        setTimeout(printNextLine, 120)
      } else {
        // Once done, open Safari window!
        setTimeout(() => {
          get().openApp('safari')
        }, 300)
      }
    }
    printNextLine()
  },

  // Volume initial state and actions
  volume: 70,
  muted: false,
  setVolume: (vol) => set({ volume: vol }),
  setMuted: (muted) => set({ muted }),

  // System Settings initial state and actions
  wallpaper: 'default',
  brightness: 100,
  nightShift: false,
  setWallpaper: (wp) => set({ wallpaper: wp }),
  setBrightness: (brightness) => set({ brightness }),
  setNightShift: (nightShift) => set({ nightShift }),

  // Tutorial initial state and actions
  isTutorialActive: false,
  currentTutorialStep: 0,
  setTutorialActive: (active) => set({ isTutorialActive: active }),
  setCurrentTutorialStep: (step) => set({ currentTutorialStep: step }),

  // Legacy window actions wrappers
  closeWindow: () => get().closeApp('vscode'),
  minimizeWindow: () => get().minimizeApp('vscode'),
  restoreWindow: () => get().openApp('vscode'),
  toggleWindowMaximize: () => get().toggleAppMaximize('vscode'),
}))
