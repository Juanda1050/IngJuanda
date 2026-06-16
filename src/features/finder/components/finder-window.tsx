import { useState, useMemo } from 'react'
import { 
  Folder, 
  FileText, 
  Download, 
  Clock, 
  HardDrive, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Laptop
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'
import { formatWithAppleEmojis } from '@/components/apple-emoji-utils'
import { useDevice } from '@/hooks/use-device'

interface FileItem {
  name: string
  path: string
  size: string
  type: 'pdf' | 'folder'
  created: string
  modified: string
}

export function FinderWindow() {
  const { t, i18n } = useTranslation('common')
  const { isMobile, isTablet } = useDevice()
  
  const openApp = useUiStore((state) => state.openApp)
  const setPreviewPdfUrl = useUiStore((state) => state.setPreviewPdfUrl)
  const finderClickMode = useUiStore((state) => state.finderClickMode)

  const isEn = i18n.language === 'en'

  // Document Files definition (correct sizes)
  const cvEsFile: FileItem = useMemo(() => ({
    name: t('finder.files.cvEs.name'),
    path: '/profile/CV_Juan_Daniel_Gonzalez_ES.pdf',
    size: '344 KB',
    type: 'pdf',
    created: isEn ? 'June 15, 2026 at 10:45 AM' : '15 de junio de 2026 a las 10:45 a.m.',
    modified: isEn ? 'June 15, 2026 at 10:45 AM' : '15 de junio de 2026 a las 10:45 a.m.',
  }), [t, isEn])

  const cvEnFile: FileItem = useMemo(() => ({
    name: t('finder.files.cvEn.name'),
    path: '/profile/Resume_Juan_Daniel_Gonzalez_EN.pdf',
    size: '340 KB',
    type: 'pdf',
    created: isEn ? 'June 14, 2026 at 3:20 PM' : '14 de junio de 2026 a las 3:20 p.m.',
    modified: isEn ? 'June 14, 2026 at 3:20 PM' : '14 de junio de 2026 a las 3:20 p.m.',
  }), [t, isEn])

  // Folders definition
  const documentsFolder: FileItem = useMemo(() => ({
    name: isEn ? 'Documents' : 'Documentos',
    path: 'documents',
    size: '2 items',
    type: 'folder',
    created: 'June 15, 2026',
    modified: 'June 15, 2026',
  }), [isEn])

  const downloadsFolder: FileItem = useMemo(() => ({
    name: isEn ? 'Downloads' : 'Descargas',
    path: 'downloads',
    size: '1 item',
    type: 'folder',
    created: 'June 14, 2026',
    modified: 'June 14, 2026',
  }), [isEn])

  // Files by Folder
  const folderContents: Record<string, FileItem[]> = useMemo(() => ({
    root: [documentsFolder, downloadsFolder],
    documents: [cvEnFile, cvEsFile],
    downloads: [cvEnFile],
  }), [cvEsFile, cvEnFile, documentsFolder, downloadsFolder])

  // --- STATE FOR MOBILE/TABLET FILES APP ---
  const [searchQuery, setSearchQuery] = useState('')
  // History stack navigation: [] means Browse Menu Root
  const [navigationHistory, setNavigationHistory] = useState<string[][]>([[]])
  const currentPath = navigationHistory[navigationHistory.length - 1] || []
  
  const [activeMobileTab, setActiveMobileTab] = useState<'recents' | 'browse'>('browse')
  const [selectedSidebar, setSelectedSidebar] = useState<'on-my-ipad' | 'documents' | 'downloads'>('on-my-ipad')
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showMobileInfoFile, setShowMobileInfoFile] = useState<FileItem | null>(null)



  // Direct Blob Download Helper
  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(filePath);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed, falling back:', error);
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      link.target = '_blank';
      link.click();
    }
  }

  // Open PDF directly in a new window/tab
  const handleOpenFileDirectly = (file: FileItem) => {
    if (file.type === 'pdf') {
      window.open(file.path, '_blank', 'noopener,noreferrer')
      setSelectedFile(null)
      setShowMobileInfoFile(null)
    }
  }

  // --- DESKTOP RENDER (CLASSIC FINDER) ---
  const [activeDesktopTab, setActiveDesktopTab] = useState<'documents' | 'desktop' | 'downloads'>('documents')
  const filesByDesktopTab = useMemo(() => ({
    documents: [cvEnFile, cvEsFile],
    desktop: [],
    downloads: [cvEnFile],
  }), [cvEsFile, cvEnFile])

  // Mock Recents View showing the CV files (must be top-level per Rules of Hooks)
  const recentsContents = useMemo(() => [cvEsFile, cvEnFile], [cvEsFile, cvEnFile])

  const handleDesktopFileClick = (file: FileItem) => {
    if (file.type === 'pdf') {
      setPreviewPdfUrl(file.path)
      openApp('preview')
    }
  }

  // ----------------------------------------------------
  // RENDER IPAD FILES LAYOUT
  // ----------------------------------------------------
  if (isTablet) {
    // Determine contents shown in secondary pane
    let mainContents: FileItem[] = []
    let currentFolderName = 'On My iPad'

    if (selectedSidebar === 'on-my-ipad') {
      mainContents = folderContents.root!
      currentFolderName = isEn ? 'On My iPad' : 'En mi iPad'
    } else if (selectedSidebar === 'documents') {
      mainContents = folderContents.documents!
      currentFolderName = isEn ? 'Documents' : 'Documentos'
    } else if (selectedSidebar === 'downloads') {
      mainContents = folderContents.downloads!
      currentFolderName = isEn ? 'Downloads' : 'Descargas'
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      mainContents = mainContents.filter(item => item.name.toLowerCase().includes(q))
    }

    const handleiPadItemClick = (item: FileItem) => {
      if (item.type === 'folder') {
        if (item.path === 'documents') setSelectedSidebar('documents')
        else if (item.path === 'downloads') setSelectedSidebar('downloads')
      } else {
        setSelectedFile(item)
      }
    }

    return (
      <div className="flex h-full w-full bg-background dark:bg-[#1a1a1a] text-foreground font-sans select-none overflow-hidden">
        {/* Left Sidebar (260px) */}
        <div className="w-[260px] shrink-0 bg-[#f2f2f7] dark:bg-[#1c1c1e] border-r border-border/40 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground select-none px-2 pt-2">
              {isEn ? 'Files' : 'Archivos'}
            </h2>

            {/* Locations Section (No iCloud or Recently Deleted) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                <span>{isEn ? 'Locations' : 'Ubicaciones'}</span>
              </div>
              <div className="space-y-0.5">
                {[
                  { id: 'on-my-ipad' as const, label: isEn ? 'On My iPad' : 'En mi iPad', icon: <Laptop className="size-4 text-[#007aff]" /> },
                  { id: 'documents' as const, label: isEn ? 'Documents' : 'Documentos', icon: <Folder className="size-4 text-[#007aff]" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedSidebar(item.id)
                      setSelectedFile(null)
                      setSearchQuery('')
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all text-left outline-none border border-transparent',
                      selectedSidebar === item.id
                        ? 'bg-[#007aff] text-white shadow-sm font-bold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Favourites Section */}
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                {isEn ? 'Favorites' : 'Favoritos'}
              </div>
              <button
                onClick={() => {
                  setSelectedSidebar('downloads')
                  setSelectedFile(null)
                  setSearchQuery('')
                }}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all text-left border border-transparent outline-none',
                  selectedSidebar === 'downloads'
                    ? 'bg-[#007aff] text-white shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                )}
              >
                <Download className="size-4 text-[#007aff]" />
                <span>{isEn ? 'Downloads' : 'Descargas'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Browser Pane (Flexible) */}
        <div className="flex-1 flex flex-col bg-background dark:bg-[#1a1a1a] overflow-hidden">
          {/* Header Bar */}
          <div className="h-[52px] border-b border-border/20 px-6 flex items-center justify-between shrink-0">
            <span className="text-sm font-bold text-foreground">{currentFolderName}</span>
            <div className="relative w-48 select-text">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search" : "Buscar"}
                className="w-full bg-muted/50 dark:bg-white/5 border-none rounded-lg pl-8 pr-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#007aff]"
              />
            </div>
          </div>

          {/* Browser Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {mainContents.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-xs text-muted-foreground italic">
                <span>{isEn ? 'This folder is empty' : 'Esta carpeta está vacía'}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mainContents.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => handleiPadItemClick(item)}
                    className={cn(
                      'group flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer select-none',
                      selectedFile?.name === item.name
                        ? 'border-[#007aff]/30 bg-[#007aff]/5 dark:bg-[#007aff]/10'
                        : 'border-transparent hover:border-border/30 hover:bg-muted/30 active:bg-muted/50'
                    )}
                  >
                    {item.type === 'folder' ? (
                      <div className="relative flex size-16 items-center justify-center text-sky-400 dark:text-sky-500 mb-2 group-hover:scale-105 transition-transform select-none">
                        <Folder className="size-12 fill-current opacity-85" />
                      </div>
                    ) : (
                      <div className="relative flex size-16 items-center justify-center bg-red-500/10 text-red-500 rounded-xl mb-2 group-hover:scale-105 transition-transform">
                        <FileText className="size-9" />
                        <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[8px] px-1 rounded-sm shadow-sm uppercase">PDF</span>
                      </div>
                    )}
                    <span className="text-xs font-semibold leading-tight text-foreground/90 break-all line-clamp-2 px-1">
                      {formatWithAppleEmojis(item.name)}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 mt-1 select-none">
                      {item.size}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Details Pane (Visible if selectedFile is set, No Tags, No visual preview container) */}
        {selectedFile && (
          <div className="w-[280px] shrink-0 bg-[#f8f8fa] dark:bg-[#1e1e20] border-l border-border/40 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* File details Header */}
              <div className="flex flex-col items-center py-6 border-b border-border/20">
                <div className="relative flex size-20 items-center justify-center bg-red-500/10 text-red-500 rounded-2xl shadow-sm mb-4">
                  <FileText className="size-10" />
                  <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-md shadow-sm uppercase">PDF</span>
                </div>
                <h3 className="text-sm font-bold text-foreground text-center truncate w-full px-2">
                  {selectedFile.name}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1 select-none">
                  PDF Document • {selectedFile.size}
                </p>
              </div>

              {/* Information List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {isEn ? 'Information' : 'Información'}
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isEn ? 'Kind' : 'Clase'}</span>
                    <span className="font-semibold text-foreground text-right">{isEn ? 'PDF Document' : 'Documento PDF'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isEn ? 'Size' : 'Tamaño'}</span>
                    <span className="font-semibold text-foreground text-right">{selectedFile.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isEn ? 'Created' : 'Creado'}</span>
                    <span className="font-semibold text-foreground text-right">{selectedFile.created}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isEn ? 'Modified' : 'Modificado'}</span>
                    <span className="font-semibold text-foreground text-right">{selectedFile.modified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isEn ? 'Where' : 'Dónde'}</span>
                    <span className="font-semibold text-foreground text-right">On My iPad</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct CTAs */}
            <div className="space-y-2.5 pt-4">
              <button
                onClick={() => handleOpenFileDirectly(selectedFile)}
                className="w-full flex items-center justify-center gap-1.5 bg-[#007aff] hover:bg-[#0062cc] active:scale-98 text-white text-xs font-semibold py-2.5 rounded-xl shadow-sm transition-all"
              >
                <span>{isEn ? 'OPEN' : 'ABRIR'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile(selectedFile.path, selectedFile.name)}
                className="w-full flex items-center justify-center gap-1.5 bg-background hover:bg-muted active:scale-98 border border-border text-foreground text-xs font-semibold py-2.5 rounded-xl transition-all"
              >
                <Download className="size-3.5" />
                <span>{isEn ? 'Download' : 'Descargar'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ----------------------------------------------------
  // RENDER IPHONE FILES LAYOUT
  // ----------------------------------------------------
  if (isMobile) {
    const isAtRoot = currentPath.length === 0
    const activeFolderId = currentPath[currentPath.length - 1]

    let mobileContents: FileItem[] = []
    let headerTitle = 'Browse'

    if (activeFolderId === 'on-my-iphone') {
      mobileContents = folderContents.root!
      headerTitle = isEn ? 'On My iPhone' : 'En mi iPhone'
    } else if (activeFolderId === 'documents') {
      mobileContents = folderContents.documents!
      headerTitle = isEn ? 'Documents' : 'Documentos'
    } else if (activeFolderId === 'downloads') {
      mobileContents = folderContents.downloads!
      headerTitle = isEn ? 'Downloads' : 'Descargas'
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      mobileContents = mobileContents.filter(item => item.name.toLowerCase().includes(q))
    }

    const handleMobileItemClick = (item: FileItem) => {
      if (item.type === 'folder') {
        const nextPath = [...currentPath, item.path]
        setNavigationHistory([...navigationHistory, nextPath])
      } else {
        setShowMobileInfoFile(item)
      }
    }

    const handleMobileGoBack = () => {
      if (navigationHistory.length > 1) {
        setNavigationHistory(navigationHistory.slice(0, -1))
      }
    }

    // Determine back button label based on history stack
    const previousPath = navigationHistory[navigationHistory.length - 2] || []
    let backButtonLabel = isEn ? 'Browse' : 'Explorar'
    if (previousPath.length > 0) {
      const prevFolder = previousPath[previousPath.length - 1]
      if (prevFolder === 'on-my-iphone') {
        backButtonLabel = isEn ? 'On My iPhone' : 'En mi iPhone'
      } else if (prevFolder === 'documents') {
        backButtonLabel = isEn ? 'Documents' : 'Documentos'
      } else if (prevFolder === 'downloads') {
        backButtonLabel = isEn ? 'Downloads' : 'Descargas'
      }
    }


    return (
      <div className="flex flex-col h-full w-full bg-[#f2f2f7] dark:bg-black text-foreground font-sans select-none overflow-hidden relative">
        
        {/* Tab 1: Recents Tab (Shows CVs directly) */}
        {activeMobileTab === 'recents' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-background dark:bg-black">
            <div className="px-4 pt-12 pb-3 shrink-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground select-none">
                {isEn ? 'Recents' : 'Recientes'}
              </h1>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 pb-6">
                {recentsContents.map((file) => (
                  <div
                    key={file.name}
                    onClick={() => setShowMobileInfoFile(file)}
                    className="flex flex-col items-center text-center p-3 rounded-2xl border border-transparent hover:bg-muted/40 active:bg-muted/60 transition-colors cursor-pointer select-none"
                  >
                    <div className="relative flex size-14 items-center justify-center bg-red-500/10 text-red-500 rounded-xl mb-2">
                      <FileText className="size-8" />
                      <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[7px] px-1 rounded-sm shadow-sm uppercase">PDF</span>
                    </div>
                    <span className="text-xs font-bold leading-tight text-foreground/90 break-all line-clamp-2 px-1">
                      {formatWithAppleEmojis(file.name)}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 mt-0.5 select-none">
                      {file.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Browse Tab (Real navigation matching screenshots) */}
        {activeMobileTab === 'browse' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-background dark:bg-black">
            {isAtRoot ? (
              // SCREEN 1: BROWSE ROOT MENU (No Tags, iCloud, or Deleted)
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 pt-12 pb-3 shrink-0 space-y-3">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground select-none">
                    {isEn ? 'Browse' : 'Explorar'}
                  </h1>
                  
                  {/* Search Bar pill */}
                  <div className="relative select-text">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isEn ? "Search" : "Buscar"}
                      className="w-full bg-[#e3e3e9] dark:bg-[#1c1c1e] border-none rounded-xl pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#007aff]"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
                  {searchQuery.trim() ? (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                        {isEn ? 'Search Results' : 'Resultados de búsqueda'}
                      </h3>
                      {(() => {
                        const q = searchQuery.toLowerCase().trim()
                        const allFiles = [cvEnFile, cvEsFile]
                        const filtered = allFiles.filter(f => f.name.toLowerCase().includes(q))
                        if (filtered.length === 0) {
                          return (
                            <p className="text-xs text-muted-foreground italic pl-1">
                              {isEn ? 'No results found' : 'No se encontraron resultados'}
                            </p>
                          )
                        }
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            {filtered.map((file) => (
                              <div
                                key={file.name}
                                onClick={() => setShowMobileInfoFile(file)}
                                className="flex flex-col items-center text-center p-3 rounded-2xl border border-transparent hover:bg-muted/40 active:bg-muted/60 transition-colors cursor-pointer select-none"
                              >
                                <div className="relative flex size-14 items-center justify-center bg-red-500/10 text-red-500 rounded-xl mb-2">
                                  <FileText className="size-8" />
                                  <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[7px] px-1 rounded-sm shadow-sm uppercase">PDF</span>
                                </div>
                                <span className="text-xs font-bold leading-tight text-foreground/90 break-all line-clamp-2 px-1">
                                  {formatWithAppleEmojis(file.name)}
                                </span>
                                <span className="text-[10px] text-muted-foreground/60 mt-0.5 select-none">
                                  {file.size}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </div>
                  ) : (
                    <div>
                      {/* Locations Collapsible */}
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                          {isEn ? 'Locations' : 'Ubicaciones'}
                        </h3>
                    <div className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden divide-y divide-border/20 shadow-sm border border-black/5 dark:border-white/5">
                      {[
                        { id: 'on-my-iphone', label: isEn ? 'On My iPhone' : 'En mi iPhone', icon: <Laptop className="size-5 text-[#007aff]" /> }
                      ].map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => {
                            const next = [loc.id]
                            setNavigationHistory([...navigationHistory, next])
                            setSearchQuery('')
                          }}
                          className="w-full flex items-center justify-between p-3.5 text-sm font-semibold text-foreground text-left transition-colors active:bg-muted/40 outline-none"
                        >
                          <div className="flex items-center gap-3">
                            {loc.icon}
                            <span>{loc.label}</span>
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground/60" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Favorites */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                      {isEn ? 'Favorites' : 'Favoritos'}
                    </h3>
                    <div className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden divide-y divide-border/20 shadow-sm border border-black/5 dark:border-white/5">
                      <button
                        onClick={() => {
                          const next = ['on-my-iphone', 'downloads']
                          setNavigationHistory([...navigationHistory, next])
                          setSearchQuery('')
                        }}
                        className="w-full flex items-center justify-between p-3.5 text-sm font-semibold text-foreground text-left transition-colors active:bg-muted/40 outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <Download className="size-5 text-[#007aff]" />
                          <span>{isEn ? 'Downloads' : 'Descargas'}</span>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground/60" />
                      </button>
                    </div>
                  </div>
                  </div>
                )}
              </div>
            </div>
            ) : (
              // SCREEN 2: FOLDER DIRECTORY GRID VIEW (No Select Button)
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* iPhone Navigation Bar */}
                <div className="px-4 h-12 flex items-center justify-between border-b border-border/10 shrink-0 bg-[#f2f2f7] dark:bg-black select-none">
                  <button
                    onClick={handleMobileGoBack}
                    className="flex items-center text-[#007aff] hover:opacity-70 active:opacity-50 text-sm font-semibold cursor-pointer outline-none"
                  >
                    <ChevronLeft className="size-5 shrink-0" />
                    <span className="truncate max-w-[100px]">{backButtonLabel}</span>
                  </button>
                  <span className="font-bold text-sm text-foreground truncate max-w-[150px]">{headerTitle}</span>
                  <span className="w-12" /> {/* Replaced select button with visual balance spacer */}
                </div>

                {/* Subfolder Contents view */}
                <div className="flex-1 p-4 overflow-y-auto bg-background dark:bg-black">
                  {mobileContents.length === 0 ? (
                    <div className="flex h-48 flex-col items-center justify-center text-xs text-muted-foreground italic select-none">
                      <span>{isEn ? 'This folder is empty' : 'Esta carpeta está vacía'}</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 pb-6">
                      {mobileContents.map((item) => (
                        <div
                          key={item.name}
                          onClick={() => handleMobileItemClick(item)}
                          className="flex flex-col items-center text-center p-3 rounded-2xl border border-transparent hover:bg-muted/40 active:bg-muted/60 transition-colors cursor-pointer select-none"
                        >
                          {item.type === 'folder' ? (
                            <div className="relative flex size-14 items-center justify-center text-sky-400 dark:text-sky-500 mb-2">
                              <Folder className="size-11 fill-current opacity-85" />
                            </div>
                          ) : (
                            <div className="relative flex size-14 items-center justify-center bg-red-500/10 text-red-500 rounded-xl mb-2">
                              <FileText className="size-8" />
                              <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[7px] px-1 rounded-sm shadow-sm uppercase">PDF</span>
                            </div>
                          )}
                          <span className="text-xs font-bold leading-tight text-foreground/90 break-all line-clamp-2 px-1">
                            {formatWithAppleEmojis(item.name)}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60 mt-0.5 select-none">
                            {item.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Folder Statistics Footer (Native look) */}
                <div className="h-10 border-t border-border/10 flex items-center justify-center text-[10px] text-muted-foreground shrink-0 bg-background dark:bg-black select-none">
                  {mobileContents.length} {mobileContents.length === 1 ? (isEn ? 'item' : 'elemento') : (isEn ? 'items' : 'elementos')}, 228.96 GB {isEn ? 'available' : 'disponibles'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Tab Bar */}
        <div className="h-[49px] border-t border-border/20 bg-[#f9f9f9]/90 dark:bg-[#161616]/90 backdrop-blur-md flex items-center shrink-0 select-none pb-safe">
          <button
            onClick={() => {
              setActiveMobileTab('recents')
              setSearchQuery('')
            }}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1 outline-none',
              activeMobileTab === 'recents' ? 'text-[#007aff]' : 'text-muted-foreground'
            )}
          >
            <Clock className="size-5" />
            <span className="text-[9px] mt-0.5 font-medium">{isEn ? 'Recents' : 'Recientes'}</span>
          </button>
          <button
            onClick={() => {
              setActiveMobileTab('browse')
              setNavigationHistory([[]]) // Clear stack to return to Browse Root menu
              setSearchQuery('')
            }}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1 outline-none',
              activeMobileTab === 'browse' ? 'text-[#007aff]' : 'text-muted-foreground'
            )}
          >
            <Folder className="size-5" />
            <span className="text-[9px] mt-0.5 font-medium">{isEn ? 'Browse' : 'Explorar'}</span>
          </button>
        </div>

        {/* ----------------------------------------------------
            SCREEN 3: IPHONE INFO SHEET OVERLAY (No Tags)
            ---------------------------------------------------- */}
        {showMobileInfoFile && (
          <div className="absolute inset-0 z-50 bg-[#f2f2f7] dark:bg-black flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250 select-none">
            {/* Header (No Select Button) */}
            <div className="h-12 border-b border-border/10 flex items-center justify-between px-4 shrink-0 bg-[#f2f2f7] dark:bg-black">
              <span className="w-12" />
              <span className="font-bold text-sm text-foreground">Info</span>
              <button
                onClick={() => setShowMobileInfoFile(null)}
                className="text-[#007aff] hover:opacity-75 text-sm font-semibold cursor-pointer outline-none"
              >
                {isEn ? 'Done' : 'Listo'}
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Document Icon & Title Header */}
              <div className="flex flex-col items-center bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                <div className="relative flex size-20 items-center justify-center bg-red-500/10 text-red-500 rounded-2xl shadow-sm mb-4">
                  <FileText className="size-10" />
                  <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-md shadow-sm uppercase">PDF</span>
                </div>
                <h3 className="text-sm font-bold text-foreground text-center truncate w-full px-2">
                  {showMobileInfoFile.name}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 select-none">
                  PDF Document • {showMobileInfoFile.size}
                </p>

                {/* Big Action buttons */}
                <div className="w-full flex flex-col gap-2 pt-4">
                  <button
                    onClick={() => handleOpenFileDirectly(showMobileInfoFile)}
                    className="w-full flex items-center justify-center bg-[#007aff] hover:bg-[#0062cc] active:scale-98 text-white text-xs font-semibold py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <span>{isEn ? 'OPEN' : 'ABRIR'}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDownloadFile(showMobileInfoFile.path, showMobileInfoFile.name)}
                    className="w-full flex items-center justify-center gap-1.5 bg-background hover:bg-muted active:scale-98 border border-border text-foreground text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    <span>{isEn ? 'Download' : 'Descargar'}</span>
                  </button>
                </div>
              </div>

              {/* Information Group */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
                  {isEn ? 'Information' : 'Información'}
                </h4>
                <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 divide-y divide-border/20 border border-black/5 dark:border-white/5 shadow-sm text-xs space-y-0.5">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">{isEn ? 'Kind' : 'Clase'}</span>
                    <span className="font-semibold text-foreground text-right">{isEn ? 'PDF Document' : 'Documento PDF'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">{isEn ? 'Size' : 'Tamaño'}</span>
                    <span className="font-semibold text-foreground text-right">{showMobileInfoFile.size}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">{isEn ? 'Created' : 'Creado'}</span>
                    <span className="font-semibold text-[#8e8e93] text-right">{showMobileInfoFile.created}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">{isEn ? 'Modified' : 'Modificado'}</span>
                    <span className="font-semibold text-[#8e8e93] text-right">{showMobileInfoFile.modified}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">{isEn ? 'Where' : 'Dónde'}</span>
                    <span className="font-semibold text-[#007aff] text-right">On My iPhone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ----------------------------------------------------
  // RENDER DESKTOP VIRTUAL MAC WINDOW RENDER
  // ----------------------------------------------------
  return (
    <div className="flex h-full w-full bg-background dark:bg-[#1e1e1e] text-foreground font-sans text-sm select-none">
      {/* Finder Sidebar */}
      <div className="w-44 shrink-0 border-r border-border/50 bg-vscode-sidebar/95 px-2 py-3 space-y-4">
        {/* Favorites */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">
            {t('finder.sidebar.favorites')}
          </p>
          {[
            { id: 'desktop' as const, label: t('finder.sidebar.desktop'), icon: <Clock className="size-4 text-blue-500" /> },
            { id: 'documents' as const, label: t('finder.sidebar.documents'), icon: <Folder className="size-4 text-blue-500" /> },
            { id: 'downloads' as const, label: t('finder.sidebar.downloads'), icon: <Download className="size-4 text-blue-500" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDesktopTab(tab.id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors text-left outline-none border border-transparent',
                activeDesktopTab === tab.id
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.icon}
              <span>{formatWithAppleEmojis(tab.label)}</span>
            </button>
          ))}
        </div>

        {/* Locations */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">
            {t('finder.sidebar.locations')}
          </p>
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground font-medium">
            <HardDrive className="size-4 text-muted-foreground/80" />
            <span>Macintosh HD</span>
          </div>
        </div>
      </div>

      {/* File Grid Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-background dark:bg-[#1a1a1a]">
        <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-4 text-xs text-muted-foreground">
          <span>{t('finder.table.name')}</span>
          <span>{t('finder.table.size')}</span>
        </div>

        {filesByDesktopTab[activeDesktopTab].length === 0 ? (
          <div className="flex h-44 items-center justify-center text-xs text-muted-foreground italic">
            {t('finder.table.emptyFolder')}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {filesByDesktopTab[activeDesktopTab].map((file) => (
              <div
                key={file.name}
                onClick={finderClickMode === 'single' ? () => handleDesktopFileClick(file) : undefined}
                onDoubleClick={finderClickMode === 'double' ? () => handleDesktopFileClick(file) : undefined}
                className="group flex flex-col items-center text-center p-2 rounded-xl border border-transparent hover:border-border/30 hover:bg-primary/5 active:bg-primary/10 cursor-pointer select-none"
              >
                {/* PDF Red Icon */}
                <div className="relative flex size-14 items-center justify-center bg-red-500/10 text-red-500 rounded-xl mb-2 group-hover:scale-105 transition-transform">
                  <FileText className="size-8" />
                  <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[8px] px-1 rounded-sm shadow-sm uppercase">PDF</span>
                </div>
                
                {/* Filename */}
                <span className="text-[11.5px] leading-tight font-medium break-all line-clamp-2 px-1 text-muted-foreground group-hover:text-foreground">
                  {formatWithAppleEmojis(file.name)}
                </span>
                
                {/* Size */}
                <span className="text-[10px] text-muted-foreground/60 mt-1">
                  {file.size}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
