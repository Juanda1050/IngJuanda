import React from "react";

interface HeaderProps {
  name: string;
  statusText: string;
  avatarUrl: string;
}

export const Header: React.FC<HeaderProps> = ({
  name,
  statusText,
  avatarUrl,
}) => {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/40 bg-background/50 dark:bg-[#1c1c1e]/50 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-2.5 min-w-0">
        <img
          src={avatarUrl}
          alt={name}
          className="size-7 rounded-full border border-border/60 object-cover shrink-0"
        />
        <div className="min-w-0">
          <h4 className="font-bold text-xs leading-none truncate text-foreground">
            {name}
          </h4>
          <span className="text-[9px] font-semibold text-emerald-500 uppercase tracking-wider block mt-0.5 select-none">
            {statusText}
          </span>
        </div>
      </div>
    </header>
  );
};
