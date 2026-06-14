import React from "react";
import { Smile, Send } from "lucide-react";
import { cn } from "../../../lib/utils";

interface InputFormProps {
  typedMessage: string;
  setTypedMessage: (text: string) => void;
  isTyping: boolean;
  onSubmit: (e: React.FormEvent) => void;
  placeholderText: string;
}

export const InputForm: React.FC<InputFormProps> = ({
  typedMessage,
  setTypedMessage,
  isTyping,
  onSubmit,
  placeholderText,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="p-4 border-t border-border/40 bg-background/50 dark:bg-[#1c1c1e]/50 backdrop-blur-md flex items-center gap-2 shrink-0"
    >
      <button
        type="button"
        className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <Smile className="size-4" />
      </button>

      <input
        type="text"
        disabled={isTyping}
        value={typedMessage}
        onChange={(e) => setTypedMessage(e.target.value)}
        placeholder={placeholderText}
        className="flex-1 rounded-full border border-border/80 bg-background/60 dark:bg-[#1a1a1c] px-4 py-1.5 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 text-foreground transition-all focus:bg-background"
      />

      <button
        type="submit"
        disabled={!typedMessage.trim() || isTyping}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full transition-all text-white",
          typedMessage.trim() && !isTyping
            ? "bg-blue-600 hover:opacity-90 active:scale-95 cursor-pointer shadow-md"
            : "bg-muted text-muted-foreground/40 cursor-default",
        )}
        aria-label="Send message"
      >
        <Send className="size-3.5" />
      </button>
    </form>
  );
};
