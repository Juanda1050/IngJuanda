export interface IpadosApp {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const IPADOS_APPS: IpadosApp[] = [
  { id: "dashboard", name: "Juanda's", icon: "/juanda.svg", color: "#000" },
  {
    id: "settings",
    name: "Settings",
    icon: "/dock-icons/settings.svg",
    color: "#8E8E93",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "/dock-icons/calendar.svg",
    color: "#fff",
  },
  {
    id: "notes",
    name: "Notes",
    icon: "/dock-icons/notes.svg",
    color: "#fff",
  },
];

export const IPADOS_DOCK_APPS: IpadosApp[] = [
  {
    id: "finder",
    name: "Files",
    icon: "/dock-icons/files.svg",
    color: "#fff",
  },
  {
    id: "safari",
    name: "Safari",
    icon: "/dock-icons/safari.svg",
    color: "#fff",
  },
  {
    id: "messages",
    name: "Messages",
    icon: "/dock-icons/messages.svg",
    color: "#34C759",
  },
  {
    id: "mail",
    name: "Mail",
    icon: "/dock-icons/mail.svg",
    color: "#007AFF",
  },
];
