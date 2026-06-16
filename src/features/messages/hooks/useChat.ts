import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { DialogOption, Message, SidebarChat } from "../types";

export const useChat = () => {
  const { t, i18n } = useTranslation("common");
  const isEn = i18n.language === "en";

  const [searchQuery, setSearchQuery] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [usedOptionKeys, setUsedOptionKeys] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>(() => [
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

  const chatEndRef = useRef<HTMLDivElement>(null);

  const dialogOptions = useMemo(() => {
    const options = t("messages.dialogs", { returnObjects: true });
    return Array.isArray(options) ? (options as DialogOption[]) : [];
  }, [t]);



  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages, isTyping]);

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
    setUsedOptionKeys(prev => new Set(prev).add(option.key));

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

    setTimeout(() => {
      const lowerText = userText.toLowerCase();

      const getResponseText = (): string => {
        if (
          lowerText.includes("experiencia") ||
          lowerText.includes("trabaj") ||
          lowerText.includes("experience") ||
          lowerText.includes("career") ||
          lowerText.includes("job")
        ) {
          return dialogOptions.find((d) => d.key === "experience")?.response ?? "";
        }
        if (
          lowerText.includes("tecnolog") ||
          lowerText.includes("stack") ||
          lowerText.includes("skill") ||
          lowerText.includes("habilidad") ||
          lowerText.includes("herramienta")
        ) {
          return dialogOptions.find((d) => d.key === "skills")?.response ?? "";
        }
        if (
          lowerText.includes("contact") ||
          lowerText.includes("correo") ||
          lowerText.includes("email") ||
          lowerText.includes("linkedin") ||
          lowerText.includes("telefono")
        ) {
          return dialogOptions.find((d) => d.key === "contact")?.response ?? "";
        }
        return t("messages.fallbackResponse");
      };

      const responseText = getResponseText();

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

  const sidebarChats = useMemo<SidebarChat[]>(() => {
    const list: SidebarChat[] = [
      {
        id: "juanda",
        name: t("toolbar.profile.name"),
        status: isEn ? "online" : "activo",
        avatar: "/profile.jpg",
        latestText: messages[messages.length - 1]?.text || "",
      },
    ];
    return list.filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [messages, searchQuery, isEn, t]);

  return {
    isEn,
    searchQuery,
    setSearchQuery,
    typedMessage,
    setTypedMessage,
    isTyping,
    messages,
    dialogOptions,
    sidebarChats,
    chatEndRef,
    handleOptionClick,
    handleSendMessage,
    t,
    usedOptionKeys,
  };
};
