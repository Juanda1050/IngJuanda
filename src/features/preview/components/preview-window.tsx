import { useUiStore } from '@/store/ui-store'
import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function PreviewWindow() {
  const { t } = useTranslation('common')
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
