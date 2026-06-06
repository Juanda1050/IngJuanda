import { useState } from 'react'
import { Folder, FileText, Download, Clock, HardDrive } from 'lucide-react'
import { useUiStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'

interface FileItem {
  name: string
  path: string
  size: string
  type: 'pdf' | 'folder'
}

export function FinderWindow() {
  const [activeTab, setActiveTab] = useState<'documents' | 'desktop' | 'downloads'>('documents')
  const openApp = useUiStore((state) => state.openApp)
  const setPreviewPdfUrl = useUiStore((state) => state.setPreviewPdfUrl)

  const documentFiles: FileItem[] = [
    {
      name: 'Resume Juan Daniel González Alejandre.pdf',
      path: '/profile/Resume Juan Daniel González Alejandre.pdf',
      size: '93 KB',
      type: 'pdf',
    },
    {
      name: 'CV Juan Daniel González Alejandre.pdf',
      path: '/profile/CV Juan Daniel González Alejandre.pdf',
      size: '97 KB',
      type: 'pdf',
    },
  ]

  const filesByTab: Record<'documents' | 'desktop' | 'downloads', FileItem[]> = {
    documents: documentFiles,
    desktop: [],
    downloads: [
      {
        name: 'Resume Juan Daniel González Alejandre.pdf',
        path: '/profile/Resume Juan Daniel González Alejandre.pdf',
        size: '93 KB',
        type: 'pdf',
      },
    ],
  }

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'pdf') {
      setPreviewPdfUrl(file.path)
      openApp('preview')
    }
  }

  return (
    <div className="flex h-full w-full bg-background dark:bg-[#1e1e1e] text-foreground font-sans text-sm select-none">
      {/* Finder Sidebar */}
      <div className="w-44 shrink-0 border-r border-border/50 bg-vscode-sidebar/95 px-2 py-3 space-y-4">
        {/* Favorites */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Favorites</p>
          {[
            { id: 'desktop', label: 'Desktop', icon: <Clock className="size-4 text-blue-500" /> },
            { id: 'documents', label: 'Documents', icon: <Folder className="size-4 text-blue-500" /> },
            { id: 'downloads', label: 'Downloads', icon: <Download className="size-4 text-blue-500" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors text-left',
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Locations */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Locations</p>
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground font-medium">
            <HardDrive className="size-4 text-muted-foreground/80" />
            <span>Macintosh HD</span>
          </div>
        </div>
      </div>

      {/* File Grid Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-background dark:bg-[#1a1a1a]">
        <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-4 text-xs text-muted-foreground">
          <span>Name</span>
          <span>Size</span>
        </div>

        {filesByTab[activeTab].length === 0 ? (
          <div className="flex h-44 items-center justify-center text-xs text-muted-foreground italic">
            This folder is empty
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {filesByTab[activeTab].map((file) => (
              <div
                key={file.name}
                onDoubleClick={() => handleFileDoubleClick(file)}
                onTouchEnd={() => handleFileDoubleClick(file)} // Mobile double-tap help
                className="group flex flex-col items-center text-center p-2 rounded-xl border border-transparent hover:border-border/30 hover:bg-primary/5 active:bg-primary/10 cursor-pointer select-none"
              >
                {/* PDF Red Icon */}
                <div className="relative flex size-14 items-center justify-center bg-red-500/10 text-red-500 rounded-xl mb-2 group-hover:scale-105 transition-transform">
                  <FileText className="size-8" />
                  <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[8px] px-1 rounded-sm shadow-sm uppercase">PDF</span>
                </div>
                
                {/* Filename */}
                <span className="text-[11.5px] leading-tight font-medium break-all line-clamp-2 px-1 text-muted-foreground group-hover:text-foreground">
                  {file.name}
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
