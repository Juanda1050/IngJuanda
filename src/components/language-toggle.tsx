import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui'

const languages = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
] as const

export function LanguageToggle() {
  const { i18n, t } = useTranslation('common')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('app.language')}>
          <Languages className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('app.language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.value}
            checked={i18n.resolvedLanguage === item.value}
            onCheckedChange={() => void i18n.changeLanguage(item.value)}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
