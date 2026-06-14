export interface Email {
  id: string;
  fromName: string;
  fromEmail: string;
  date: string;
  subject: string;
  body: string;
  unread?: boolean;
  recipient?: string;
  dateTime?: string;
  hasAttachment?: boolean;
  defaultFolder?: string;
}

export type MailFolder =
  | "inbox"
  | "sent"
  | "drafts"
  | "archive"
  | "junk"
  | "trash"
  | "work"
  | "school"
  | "pets";

export interface FolderConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  color?: string;
}

/**
 * Fallback emails used when i18n translations haven't loaded yet.
 * The canonical source of truth is the translation files:
 * - src/i18n/locales/en/mail.ts
 * - src/i18n/locales/es/mail.ts
 */
export const FALLBACK_EMAILS: Email[] = [
  {
    id: "1",
    fromName: "Recruitment Global",
    fromEmail: "hr@techglobal.io",
    date: "Today, 10:15 AM",
    dateTime: "Today, 10:15 AM",
    subject: "Interview Invitation - Senior Frontend Developer",
    body: "Hi Juan Daniel,\n\nWe reviewed your portfolio and absolutely loved your macOS desktop simulator on the web. It's a great example of modular frontend code, dynamic state management, and visual polish.\n\nWe'd love to schedule a technical interview with you for our Senior Frontend Developer position. Do you have some availability this week?\n\nBest regards,\nRecruitment Global Team",
    recipient: "danielalejandre1050@gmail.com",
  },
  {
    id: "2",
    fromName: "Sarah Creative Studios",
    fromEmail: "sarah@creative-studios.co",
    date: "Yesterday, 3:40 PM",
    dateTime: "Yesterday, 3:40 PM",
    subject: "Project Inquiry - Freelance Collaboration",
    body: "Hi Juanda,\n\nHope you are doing great. Your interactive portfolio is amazing 🚀. The volume synchronization between the Control Center and the Apple Music app, and the custom Apple Emoji rendering, are top-tier visual details.\n\nWe have a project for an international client requiring custom interactive component design and would love to collaborate with you as a Freelancer. Could we jump on a call?\n\nSarah Miller\nCreative Director",
    recipient: "danielalejandre1050@gmail.com",
    hasAttachment: true,
  },
  {
    id: "3",
    fromName: "Dev Relations OS Labs",
    fromEmail: "dev-relations@os-labs.org",
    date: "June 3, 2026",
    dateTime: "June 3, 2026",
    subject: "Collaboration Proposal - Open Source UI Library",
    body: "Dear Juan Daniel,\n\nWe've been following your work with TailwindCSS and Storybook to create accessible UI design systems. We'd love to invite you to participate as a core contributor to our upcoming open-source component library focused on accessibility and adaptive layouts.\n\nLet us know if you're interested so we can schedule a quick brief.\n\nSincerely,\nOS Labs Team",
    recipient: "danielalejandre1050@gmail.com",
  },
];

/** Attachment metadata mapped by email id */
export const EMAIL_ATTACHMENTS: Record<string, { filename: string; size: string }> = {
  "2": { filename: "Project_Brief_Creative_Studios.pdf", size: "1.4 MB" },
};

/** Apple Intelligence summary data mapped by email id */
export const EMAIL_SUMMARIES: Record<string, string[]> = {
  "1": [
    "Recruitment Global has invited Juan Daniel to a Senior Frontend Developer interview.",
    "They noted his macOS desktop simulator is a great showcase of technical modularity.",
    "Requested reply about his calendar availability for a videocall.",
  ],
  "2": [
    "Sarah Miller from Creative Studios proposed a freelance collaboration.",
    "She praised details like volume sync and native-like UI components.",
    "Attached is a project brief document detailing client interactive design requirements.",
  ],
  "3": [
    "Dev Relations at OS Labs invited Juanda to be a core contributor to an open-source UI design system library.",
    "They mentioned tracking his work using Storybook and Tailwind CSS.",
    "Suggested arranging a quick call to go over onboarding materials.",
  ],
};

/** Parses localized email data from i18n and merges with static metadata */
export function parseLocalizedEmails(
  localized: unknown,
  readEmailIds: string[]
): Email[] {
  if (Array.isArray(localized) && localized.length > 0) {
    return localized.map((email: Record<string, unknown>) => ({
      id: (email.id as string) || `mail-${Math.random()}`,
      fromName: (email.fromName as string) || "",
      fromEmail: (email.fromEmail as string) || "",
      date: (email.date as string) || "",
      dateTime: (email.dateTime as string) || (email.date as string) || "",
      subject: (email.subject as string) || "",
      body: (email.body as string) || "",
      unread: !readEmailIds.includes(email.id as string),
      recipient: "danielalejandre1050@gmail.com",
      hasAttachment: email.id === "2",
    }));
  }

  // Return fallback with read-status applied
  return FALLBACK_EMAILS.map((email) => ({
    ...email,
    unread: !readEmailIds.includes(email.id),
  }));
}
