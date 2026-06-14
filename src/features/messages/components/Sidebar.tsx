import React from "react";
import { Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { SidebarChat } from "../types";

interface SidebarProps {
  sidebarChats: SidebarChat[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isEn: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarChats,
  searchQuery,
  setSearchQuery,
  isEn,
}) => {
  return (
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
  );
};
