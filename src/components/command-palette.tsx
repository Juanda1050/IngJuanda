import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { portfolioFiles } from '@/features/portfolio/data/portfolio-data'
import { useUiStore } from '@/store/ui-store'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/ui'

export function CommandPalette() {
  const { t } = useTranslation('common')
  const isCommandOpen = useUiStore((state) => state.isCommandOpen)
  const setCommandOpen = useUiStore((state) => state.setCommandOpen)
  const setActiveFile = useUiStore((state) => state.setActiveFile)

  const items = useMemo(
    () => portfolioFiles.map((file) => ({ id: file.id, label: t(file.key), icon: file.icon })),
    [t],
  )

  return (
    <CommandDialog open={isCommandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder={t('app.commandPlaceholder')} />
      <CommandList>
        <CommandEmpty>{t('actions.close')}</CommandEmpty>
        <CommandGroup heading={t('app.portfolioFiles')}>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => {
                  setActiveFile(item.id)
                  setCommandOpen(false)
                }}
              >
                <Icon className="size-4" />
                {item.label}
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
