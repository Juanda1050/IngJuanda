import React from 'react'
import { AppleEmoji } from './apple-emoji'

// Regex matching general emojis and symbols using Extended_Pictographic property (supported in modern browsers)
const EMOJI_REGEX = /(\p{Extended_Pictographic})/gu

export function formatWithAppleEmojis(text: string): React.ReactNode {
  if (!text) return ''
  
  // Split the text, retaining the matched emojis
  const parts = text.split(EMOJI_REGEX)
  
  return (
    <>
      {parts.map((part, index) => {
        // Test if this specific part is an emoji
        if (/\p{Extended_Pictographic}/u.test(part)) {
          return <AppleEmoji key={index} emoji={part} />
        }
        return part
      })}
    </>
  )
}
