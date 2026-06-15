import React from 'react'
import { AppleEmoji } from './apple-emoji'

// Regex matching general emojis and symbols using Extended_Pictographic property (supported in modern browsers)
const EMOJI_REGEX = /(\p{Regional_Indicator}{2}|\p{Extended_Pictographic}\uFE0F?(?:\u200d\p{Extended_Pictographic}\uFE0F?)*)/gu

const isApplePlatform = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const platform = navigator.platform || '';
  
  // Standard macOS/iOS detection
  const isAppleDevice = /Mac|iPod|iPhone|iPad/.test(platform) || /Mac|iPod|iPhone|iPad/.test(ua);
  
  // iPadOS 13+ detection (reports as MacIntel but has touch points)
  const isIPadOS = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  
  return isAppleDevice || isIPadOS;
};

export function formatWithAppleEmojis(text: string): React.ReactNode {
  if (!text) return ''
  
  // Apple devices natively render high-quality Apple Color Emojis, so bypassing is faster & more reliable
  if (isApplePlatform()) {
    return text;
  }
  
  // Split the text, retaining the matched emojis
  const parts = text.split(EMOJI_REGEX)
  
  return (
    <>
      {parts.map((part, index) => {
        // Test if this specific part is an emoji or a regional indicator flag
        if (/\p{Extended_Pictographic}/u.test(part) || /\p{Regional_Indicator}/u.test(part)) {
          return <AppleEmoji key={index} emoji={part} />
        }
        return part
      })}
    </>
  )
}
