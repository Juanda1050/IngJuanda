export interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export interface DialogOption {
  key: string;
  label: string;
  prompt: string;
  response: string;
}

export interface SidebarChat {
  id: string;
  name: string;
  status: string;
  avatar: string;
  latestText: string;
}
