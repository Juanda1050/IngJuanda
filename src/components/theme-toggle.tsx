import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
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

const themes = [
  { value: 'light', icon: Sun, key: 'actions.light' },
  { value: 'dark', icon: Moon, key: 'actions.dark' },
  { value: 'system', icon: Monitor, key: 'actions.system' },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('common')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('app.theme')}>
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('app.theme')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuCheckboxItem
              key={item.value}
              checked={theme === item.value}
              onCheckedChange={() => setTheme(item.value)}
            >
              <Icon className="mr-2 size-4" />
              {t(item.key)}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
