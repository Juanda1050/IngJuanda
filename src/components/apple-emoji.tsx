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
  "🇲🇽": "flag-mexico",
  "🔋": "battery",
  "🏠": "house",
  "📥": "inbox-tray",
  "🎉": "party-popper",
  "👋": "waving-hand-light-skin-tone",
  "📇": "card-index",
  "🔍": "magnifying-glass-tilted-left",
  "⌨️": "keyboard",
  "🔎": "magnifying-glass-tilted-right",
  "📅": "calendar",
};

interface AppleEmojiProps {
  emoji: string;
  className?: string;
}

export const AppleEmoji: React.FC<AppleEmojiProps> = ({
  emoji,
  className = "",
}) => {
  console.log("Rendering AppleEmoji:", { emoji });

  const emojiName = UNICODE_TO_NAME[emoji];

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
