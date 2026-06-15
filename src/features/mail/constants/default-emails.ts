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
    fromName: "GitHub Notifications",
    fromEmail: "noreply@github.com",
    date: "Today, 10:15 AM",
    dateTime: "Today, 10:15 AM",
    subject: "[GitHub] Security Alert: dependency vulnerability in package.json (CVE-2026-1234)",
    body: "Hi Juanda,\n\nA security vulnerability has been identified in one of your repository dependencies: next-auth. We recommend upgrading to version 14.2.1 immediately to resolve this issue.\n\nRepository: Juanda1050/IngJuanda\nSeverity: High\nDependency: next-auth (v14.2.0)\nFixed in: 14.2.1\n\nTo automatically patch this vulnerability, you can run:\nnpm update next-auth\n\nFor more details, visit the GitHub Advisory Database.",
    recipient: "danielalejandre1050@gmail.com",
  },
  {
    id: "2",
    fromName: "Vercel Team",
    fromEmail: "reports@vercel.com",
    date: "Yesterday, 3:40 PM",
    dateTime: "Yesterday, 3:40 PM",
    subject: "Monthly Analytics Report & Invoice - May 2026",
    body: "Hi Juan Daniel,\n\nYour monthly analytics report and usage invoice for your Vercel projects are now available.\n\nSummary for Juanda's Workspace:\n- Total Projects: 12\n- Bandwidth Used: 45.8 GB (45% of quota)\n- Serverless Function Executions: 230k (23% of quota)\n- Total Amount Due: $0.00 USD (Hobby Plan)\n\nWe have attached the PDF invoice and complete metrics breakdown to this email for your records.\n\nThank you for choosing Vercel!\nThe Vercel Team",
    recipient: "danielalejandre1050@gmail.com",
    hasAttachment: true,
  },
  {
    id: "3",
    fromName: "Sentry Alerts",
    fromEmail: "alerts@sentry.io",
    date: "June 3, 2026",
    dateTime: "June 3, 2026",
    subject: "[Sentry] New Issue: TypeError: Cannot read properties of undefined (reading 'map') in products.tsx",
    body: "Hi Juanda,\n\nA new unresolved issue has been detected in your production environment.\n\nTypeError: Cannot read properties of undefined (reading 'map')\n  at ProductsGrid (src/features/products/components/products-grid.tsx:142:18)\n  at RenderWithHooks (react-dom.development.js:15486)\n\nFirst Seen: 5 minutes ago\nTriggered by: Chrome/125.0.0.0 (Windows 11)\nOccurrence Count: 28 occurrences impacting 14 users.\n\nView details in your Sentry dashboard to inspect the full stack trace and breadcrumbs.",
    recipient: "danielalejandre1050@gmail.com",
  },
];

/** Attachment metadata mapped by email id */
export const EMAIL_ATTACHMENTS: Record<string, { filename: string; size: string }> = {
  "2": { filename: "Vercel_Usage_Report_May_2026.pdf", size: "2.1 MB" },
};

/** Apple Intelligence summary data mapped by email id */
export const EMAIL_SUMMARIES: Record<string, string[]> = {
  "1": [
    "GitHub has alerted Juanda to a security vulnerability in next-auth (CVE-2026-1234).",
    "The vulnerability is rated as High severity.",
    "Recommended action is to run 'npm update next-auth' to patch the dependency immediately.",
  ],
  "2": [
    "Vercel has sent the monthly usage and analytics report for May 2026.",
    "Shows total of 12 projects on Hobby Plan with total amount due of $0.00 USD.",
    "Attached is the usage report PDF detailing billing and performance metrics.",
  ],
  "3": [
    "Sentry has captured a new uncaught TypeError in production under src/features/products.",
    "Impacts 14 users with 28 occurrences in Chrome/Windows 11.",
    "Redirects to dashboard to inspect stack trace and breadcrumbs.",
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
