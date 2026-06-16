import React from "react";
import { AppleEmoji } from "./apple-emoji";

const EMOJI_REGEX =
  /(\p{Regional_Indicator}{2}|\p{Extended_Pictographic}\uFE0F?(?:\u200d\p{Extended_Pictographic}\uFE0F?)*)/gu;

const isApplePlatform = (): boolean => {
  if (typeof window === "undefined" || typeof navigator === "undefined")
    return false;
  const ua = navigator.userAgent;
  const platform = navigator.platform || "";

  const isAppleDevice =
    /Mac|iPod|iPhone|iPad/.test(platform) || /Mac|iPod|iPhone|iPad/.test(ua);
  const isIPadOS = platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return isAppleDevice || isIPadOS;
};

export function formatWithAppleEmojis(text: string): React.ReactNode {
  if (!text) return "";

  if (isApplePlatform()) {
    return text;
  }

  const parts = text.split(EMOJI_REGEX);

  return (
    <>
      {parts.map((part, index) => {
        if (
          /\p{Extended_Pictographic}/u.test(part) ||
          /\p{Regional_Indicator}/u.test(part)
        ) {
          return <AppleEmoji key={`emoji-${index}`} emoji={part} />;
        }
        return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
      })}
    </>
  );
}
