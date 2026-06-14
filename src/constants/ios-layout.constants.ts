export interface IosApp {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const IOS_APPS: IosApp[] = [
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
  { id: "notes", name: "Notes", icon: "/dock-icons/notes.svg", color: "#fff" },
];

export const IOS_DOCK_APPS: IosApp[] = [
  {
    id: "phone",
    name: "Phone",
    icon: "/dock-icons/phone.svg",
    color: "#34C759",
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
  { id: "mail", name: "Mail", icon: "/dock-icons/mail.svg", color: "#007AFF" },
];
