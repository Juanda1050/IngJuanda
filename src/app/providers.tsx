import { ThemeProvider } from 'next-themes'
import { type PropsWithChildren } from 'react'
import { EmojiProvider } from 'react-apple-emojis'
import emojiData from 'react-apple-emojis/src/data.json'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <EmojiProvider data={emojiData}>
        {children}
      </EmojiProvider>
    </ThemeProvider>
  )
}
