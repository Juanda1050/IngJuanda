import { useUiStore } from '@/store/ui-store'
import { FileText, Eye, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDevice } from '@/hooks/use-device'

export function PreviewWindow() {
  const { t } = useTranslation('common')
  const { isMobile, isTablet } = useDevice()
  const previewPdfUrl = useUiStore((state) => state.previewPdfUrl)

  if (!previewPdfUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-background text-muted-foreground p-6">
        <FileText className="size-12 mb-3 text-muted-foreground/45 animate-pulse" />
        <p className="text-sm font-medium">{t('finder.preview.noDocument')}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{t('finder.preview.instructions')}</p>
      </div>
    )
  }

  // Encode the spaces and special characters safely for URLs
  const encodedUrl = encodeURI(previewPdfUrl)
  const fileName = decodeURIComponent(previewPdfUrl.split('/').pop() || '')

  if (isMobile || isTablet) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#f2f2f7] to-[#e5e5ea] dark:from-black dark:to-[#1c1c1e] text-foreground p-6 select-none">
        <div className="w-full max-w-sm bg-white/60 dark:bg-[#2c2c2e]/60 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-3xl shadow-xl flex flex-col items-center text-center space-y-5">
          
          {/* PDF Red Icon Container */}
          <div className="relative flex size-20 items-center justify-center bg-red-500/10 dark:bg-red-500/20 text-red-500 rounded-2xl shadow-sm mb-2">
            <FileText className="size-10" />
            <span className="absolute bottom-1 right-1 bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-md shadow-sm uppercase">PDF</span>
          </div>

          {/* File Metadata */}
          <div className="space-y-1 w-full font-sans">
            <h3 className="text-sm font-bold tracking-tight text-foreground truncate px-2">
              {fileName}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Documento PDF • {fileName.includes('Resume') ? '340 KB' : '344 KB'}
            </p>
          </div>

          {/* Descriptive Help Text */}
          <p className="text-[11px] text-muted-foreground/85 leading-relaxed max-w-xs px-2 font-sans">
            {t('finder.preview.mobileInstructions') || 'This PDF will open in a new tab for optimal viewing on iOS and iPadOS devices.'}
          </p>

          {/* Actions */}
          <div className="w-full flex flex-col gap-2.5 pt-2">
            <a
              href={encodedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-blue-500 hover:bg-blue-600 active:scale-98 text-white rounded-xl py-3 shadow-md transition-all duration-200 select-none cursor-pointer"
            >
              <Eye className="size-4" />
              <span>{t('finder.preview.openPdf') || 'Open PDF'}</span>
            </a>
            
            <a
              href={encodedUrl}
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch(encodedUrl);
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
                  window.open(encodedUrl, '_blank');
                }
              }}
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-background hover:bg-muted border border-border active:scale-98 text-foreground rounded-xl py-3 shadow-sm transition-all duration-200 select-none cursor-pointer"
            >
              <Download className="size-4" />
              <span>{t('finder.preview.downloadPdf') || 'Download PDF'}</span>
            </a>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-background overflow-hidden flex flex-col">
      {/* Native Browser PDF Viewer embedding */}
      <iframe
        src={encodedUrl}
        className="flex-1 w-full h-full border-none bg-background"
        title="PDF Resume Previewer"
      />
    </div>
  )
}
