import React from "react";
import { formatWithAppleEmojis } from "../../../components/apple-emoji-utils";
import type { DialogOption } from "../types";

interface ReplyOptionsProps {
  dialogOptions: DialogOption[];
  isTyping: boolean;
  onOptionClick: (option: DialogOption) => void;
}

export const ReplyOptions: React.FC<ReplyOptionsProps> = ({
  dialogOptions,
  isTyping,
  onOptionClick,
}) => {
  if (dialogOptions.length === 0) return null;

  return (
    <div className="px-4 py-2 bg-black/[0.02] dark:bg-white/[0.01] border-t border-border/30 shrink-0">
      <div className="flex flex-wrap items-center gap-1.5 overflow-hidden py-1 pr-4">
        {dialogOptions.map((opt) => (
          <button
            key={opt.key}
            disabled={isTyping}
            onClick={() => onOptionClick(opt)}
            className="shrink-0 rounded-full border border-border bg-background hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all px-3 py-1.5 text-xs font-semibold text-foreground flex items-center gap-1 cursor-pointer"
          >
            {formatWithAppleEmojis(opt.label)}
          </button>
        ))}
      </div>
    </div>
  );
};
