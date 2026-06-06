import React from 'react'

interface AppleEmojiProps {
  emoji: string
  className?: string
}

export const AppleEmoji: React.FC<AppleEmojiProps> = ({ emoji, className = '' }) => {
  // Emojicdn requires raw emoji character. We encode it for URLs.
  const encodedEmoji = encodeURIComponent(emoji)
  
  return (
    <img
      src={`https://emojicdn.elk.sh/${encodedEmoji}?style=apple`}
      alt={emoji}
      className={`inline-block w-[1.2em] h-[1.2em] align-middle select-none mx-0.5 ${className}`}
      draggable={false}
      onError={(e) => {
        // Fallback to native text emoji if the image fails to load
        const target = e.target as HTMLImageElement
        const span = document.createElement('span')
        span.textContent = emoji
        span.className = className
        target.replaceWith(span)
      }}
    />
  )
}

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
