import React from "react";
import { CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatWithAppleEmojis } from "@/components/apple-emoji";
import type { Message } from "../types";

interface MessageThreadProps {
  messages: Message[];
  isTyping: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  isTyping,
  chatEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      {messages.map((msg) => {
        const isBot = msg.sender === "bot";

        return (
          <motion.div
            key={msg.id}
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "flex flex-col max-w-[85%] sm:max-w-[70%]",
              isBot ? "mr-auto items-start" : "ml-auto items-end",
            )}
          >
            <div
              className={cn(
                "px-4 py-2.5 text-xs leading-relaxed select-text shadow-sm border border-transparent",
                isBot
                  ? "rounded-2xl rounded-bl-sm bg-[#e9e9eb] text-black border-[#dbdbdd] dark:bg-[#2c2c2e] dark:text-white dark:border-white/5"
                  : "rounded-2xl rounded-br-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600",
              )}
            >
              {formatWithAppleEmojis(msg.text)}
            </div>

            <span className="text-[9px] text-muted-foreground/60 font-semibold mt-1 px-1 flex items-center gap-1 select-none">
              <span>{msg.timestamp}</span>
              {!isBot && (
                <CheckCheck className="size-3 text-blue-500 shrink-0" />
              )}
            </span>
          </motion.div>
        );
      })}

      {/* Typing Bubble Indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col mr-auto max-w-[85%] sm:max-w-[70%] items-start"
        >
          <div className="flex items-center gap-1 bg-[#e9e9eb] dark:bg-[#2c2c2e] px-4 py-2.5 rounded-2xl rounded-bl-sm border border-[#dbdbdd] dark:border-white/5">
            {[0, 0.15, 0.3].map((delay) => (
              <motion.span
                key={delay}
                className="size-1.5 rounded-full bg-muted-foreground/50"
                animate={{
                  y: [0, -4, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Auto-scroll target anchor */}
      <div ref={chatEndRef} />
    </div>
  );
};
