import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Search, Send, CheckCheck, Smile, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatWithAppleEmojis } from "@/components/apple-emoji";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

interface DialogOption {
  key: string;
  label: string;
  prompt: string;
  response: string;
}

export function MessagesWindow() {
  const { t, i18n } = useTranslation("common");
  const isEn = i18n.language === "en";

  const [searchQuery, setSearchQuery] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const dialogOptions = useMemo(() => {
    return t("messages.dialogs", { returnObjects: true }) as DialogOption[];
  }, [t]);

  // Set initial welcome message when translated
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: t("messages.welcome"),
          timestamp: new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [t]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Dialog option click trigger
  const handleOptionClick = (option: DialogOption) => {
    if (isTyping) return;

    const now = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: option.prompt,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate natural typing delay
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: option.response,
        timestamp: new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // Handle typing send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || isTyping) return;

    const now = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userText = typedMessage.trim();
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setTypedMessage("");
    setIsTyping(true);

    // Analyze keywords to trigger semi-intelligent responses
    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      let responseText = "";

      if (
        lowerText.includes("experiencia") ||
        lowerText.includes("trabaj") ||
        lowerText.includes("experience") ||
        lowerText.includes("career") ||
        lowerText.includes("job")
      ) {
        responseText =
          dialogOptions.find((d) => d.key === "experience")?.response || "";
      } else if (
        lowerText.includes("tecnolog") ||
        lowerText.includes("stack") ||
        lowerText.includes("skill") ||
        lowerText.includes("habilidad") ||
        lowerText.includes("herramienta")
      ) {
        responseText =
          dialogOptions.find((d) => d.key === "skills")?.response || "";
      } else if (
        lowerText.includes("contact") ||
        lowerText.includes("correo") ||
        lowerText.includes("email") ||
        lowerText.includes("linkedin") ||
        lowerText.includes("telefono")
      ) {
        responseText =
          dialogOptions.find((d) => d.key === "contact")?.response || "";
      } else if (
        lowerText.includes("chiste") ||
        lowerText.includes("joke") ||
        lowerText.includes("funny")
      ) {
        responseText =
          dialogOptions.find((d) => d.key === "joke")?.response || "";
      } else {
        responseText = t("messages.fallbackResponse");
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // Filter sidebar chats (mock)
  const sidebarChats = useMemo(() => {
    return [
      {
        id: "juanda",
        name: t("profile.name"),
        status: isEn ? "online" : "activo",
        avatar: "/profile.jpg",
        latestText: messages[messages.length - 1]?.text || "",
      },
    ].filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [messages, searchQuery, isEn, t]);

  return (
    <div className="flex h-full w-full bg-background dark:bg-[#1e1e1e] text-foreground font-sans text-sm select-none">
      {/* Messages Sidebar */}
      <div
        className={cn(
          "w-60 shrink-0 border-r border-border/50 bg-[#f6f6f6] dark:bg-[#252526] flex flex-col min-h-0",
          "hidden md:flex",
        )}
      >
        {/* Search */}
        <div className="p-3 border-b border-border/40 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 size-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder={
                isEn ? "Search conversations..." : "Buscar conversaciones..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-background/50 dark:bg-[#1e1e1e] py-1 pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 text-foreground transition-colors"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {sidebarChats.map((chat) => (
            <div
              key={chat.id}
              className="w-full rounded-lg p-2.5 flex items-center gap-3 bg-primary/10 border border-primary/20 text-foreground"
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="size-9 rounded-full border border-border/60 object-cover shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-bold text-xs truncate leading-none text-foreground/90">
                    {chat.name}
                  </span>
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground truncate leading-normal">
                  {chat.latestText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main iMessage Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-background dark:bg-[#1c1c1e] relative">
        {/* Chat Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/40 bg-background/50 dark:bg-[#1c1c1e]/50 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/profile.jpg"
              alt="Juan Daniel"
              className="size-7 rounded-full border object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-xs leading-none truncate">
                {t("profile.name")}
              </h4>
              <span className="text-[9px] font-semibold text-emerald-500 uppercase tracking-wider block mt-0.5 select-none">
                {t("messages.statusOnline")}
              </span>
            </div>
          </div>
          <button className="flex size-7 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </button>
        </div>

        {/* Message Thread Box */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[85%] sm:max-w-[70%]",
                  isBot
                    ? "mr-auto items-start animate-fade-in-left"
                    : "ml-auto items-end animate-fade-in-right",
                )}
              >
                {/* Bubble */}
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
                {/* Time Indicator */}
                <span className="text-[9px] text-muted-foreground/60 font-semibold mt-1 px-1 flex items-center gap-1 select-none">
                  <span>{msg.timestamp}</span>
                  {!isBot && (
                    <CheckCheck className="size-3 text-blue-500 shrink-0" />
                  )}
                </span>
              </div>
            );
          })}

          {/* Typing Animation */}
          {isTyping && (
            <div className="flex flex-col mr-auto max-w-[85%] items-start">
              <div className="flex items-center gap-1 bg-[#e9e9eb] dark:bg-[#2c2c2e] px-4 py-2.5 rounded-2xl rounded-bl-sm border border-[#dbdbdd] dark:border-white/5">
                <span
                  className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Reply Options Capsules */}
        <div className="px-4 py-2 bg-black/[0.02] dark:bg-white/[0.01] border-t border-border/30 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none pr-4">
            {dialogOptions.map((opt) => (
              <button
                key={opt.key}
                disabled={isTyping}
                onClick={() => handleOptionClick(opt)}
                className="shrink-0 rounded-full border border-border bg-background hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all px-3 py-1.5 text-xs font-semibold text-foreground flex items-center gap-1"
              >
                {formatWithAppleEmojis(opt.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Footer Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-border/40 bg-background/50 dark:bg-[#1c1c1e]/50 backdrop-blur-md flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
          >
            <Smile className="size-4" />
          </button>

          <input
            type="text"
            disabled={isTyping}
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder={t("messages.inputPlaceholder")}
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
      </div>
    </div>
  );
}
