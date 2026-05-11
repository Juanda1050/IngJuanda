import { create } from 'zustand'
import { portfolioFiles } from '@/features/portfolio/data/portfolio-data'
import { type SectionId } from '@/types/portfolio'

interface UiState {
  activeFile: SectionId
  openFiles: SectionId[]
  isSidebarOpen: boolean
  isCommandOpen: boolean
  setActiveFile: (file: SectionId) => void
  closeFile: (file: SectionId) => void
  toggleSidebar: () => void
  setCommandOpen: (open: boolean) => void
}

const fallbackFile: SectionId = portfolioFiles[0]?.id ?? 'about'

export const useUiStore = create<UiState>((set) => ({
  activeFile: fallbackFile,
  openFiles: [fallbackFile],
  isSidebarOpen: true,
  isCommandOpen: false,
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
}))
