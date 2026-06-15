import React, { useState } from 'react'

interface AppleEmojiProps {
  emoji: string
  className?: string
}

export const AppleEmoji: React.FC<AppleEmojiProps> = ({ emoji, className = '' }) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <span className={className}>{emoji}</span>
  }

  // Emojicdn requires raw emoji character. We encode it for URLs.
  const encodedEmoji = encodeURIComponent(emoji)
  
  return (
    <img
      src={`https://emojicdn.elk.sh/${encodedEmoji}?style=apple`}
      alt={emoji}
      className={`inline-block w-[1.2em] h-[1.2em] align-middle select-none mx-0.5 ${className}`}
      draggable={false}
      onError={() => setHasError(true)}
    />
  )
}


