import React from "react";
import { Emoji } from "react-apple-emojis";

const UNICODE_TO_NAME: Record<string, string> = {
  "👨‍💻": "man-technologist-light-skin-tone",
  "🚀": "rocket",
  "💼": "briefcase",
  "📁": "file-folder",
  "📝": "memo",
  "⚙️": "gear",
  "💻": "laptop",
  "📱": "mobile-phone",
  "🌐": "globe-with-meridians",
  "🔧": "wrench",
  "🖥️": "desktop-computer",
  "🇲🇽": "flag-mexico"
};

interface AppleEmojiProps {
  emoji: string;
  className?: string;
}

export const AppleEmoji: React.FC<AppleEmojiProps> = ({
  emoji,
  className = "",
}) => {
  const cleanEmoji = emoji.includes("\u200D")
    ? emoji
    : emoji.replace(/\uFE0F/g, "");

  const emojiName = UNICODE_TO_NAME[cleanEmoji];

  if (emojiName) {
    return (
      <Emoji
        name={emojiName}
        className={`inline-block align-middle select-none mx-0.5 w-[1.2em] h-[1.2em] ${className}`}
      />
    );
  }

  return <span className={className}>{emoji}</span>;
};
