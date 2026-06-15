export const mailEn = {
  title: "Mail",
  sidebar: {
    inbox: "Inbox",
    sent: "Sent",
    drafts: "Drafts",
    archive: "Archive",
    junk: "Junk",
    trash: "Trash",
    newMsg: "New Message"
  },
  compose: {
    title: "New Message",
    to: "To:",
    subject: "Subject:",
    messagePlaceholder: "Write your message here...",
    send: "Send",
    sending: "Sending...",
    success: "Message sent successfully!",
    replyPrefix: "Re:",
    cancel: "Cancel",
    you: "You",
    visitorEmail: "visitor@juanda.dev",
    visitorName: "Visitor",
    draft: "Draft",
    draftEmail: "draft@juanda.dev",
    noSubject: "(No Subject)",
    placeholder: "Sent from my Portfolio",
    editDraft: "Edit Draft",
    ccBcc: "Cc/Bcc:",
    errorOnlyRealEmail: "Emails can only be sent to the owner's real email address (danielalejandre1050@gmail.com).",
    undo: "Undo"
  },
  emails: [
    {
      id: "1",
      fromName: "GitHub Notifications",
      fromEmail: "noreply@github.com",
      date: "Today, 10:15 AM",
      subject: "[GitHub] Security Alert: dependency vulnerability in package.json (CVE-2026-1234)",
      body: "Hi Juanda,\n\nA security vulnerability has been identified in one of your repository dependencies: next-auth. We recommend upgrading to version 14.2.1 immediately to resolve this issue.\n\nRepository: Juanda1050/IngJuanda\nSeverity: High\nDependency: next-auth (v14.2.0)\nFixed in: 14.2.1\n\nTo automatically patch this vulnerability, you can run:\nnpm update next-auth\n\nFor more details, visit the GitHub Advisory Database."
    },
    {
      id: "2",
      fromName: "Vercel Team",
      fromEmail: "reports@vercel.com",
      date: "Yesterday, 3:40 PM",
      subject: "Monthly Analytics Report & Invoice - May 2026",
      body: "Hi Juan Daniel,\n\nYour monthly analytics report and usage invoice for your Vercel projects are now available.\n\nSummary for Juanda's Workspace:\n- Total Projects: 12\n- Bandwidth Used: 45.8 GB (45% of quota)\n- Serverless Function Executions: 230k (23% of quota)\n- Total Amount Due: $0.00 USD (Hobby Plan)\n\nWe have attached the PDF invoice and complete metrics breakdown to this email for your records.\n\nThank you for choosing Vercel!\nThe Vercel Team"
    },
    {
      id: "3",
      fromName: "Sentry Alerts",
      fromEmail: "alerts@sentry.io",
      date: "June 3, 2026",
      subject: "[Sentry] New Issue: TypeError: Cannot read properties of undefined (reading 'map') in products.tsx",
      body: "Hi Juanda,\n\nA new unresolved issue has been detected in your production environment.\n\nTypeError: Cannot read properties of undefined (reading 'map')\n  at ProductsGrid (src/features/products/components/products-grid.tsx:142:18)\n  at RenderWithHooks (react-dom.development.js:15486)\n\nFirst Seen: 5 minutes ago\nTriggered by: Chrome/125.0.0.0 (Windows 11)\nOccurrence Count: 28 occurrences impacting 14 users.\n\nView details in your Sentry dashboard to inspect the full stack trace and breadcrumbs."
    }
  ],
  summaries: {
    "1": [
      "GitHub has alerted Juanda to a security vulnerability in next-auth (CVE-2026-1234).",
      "The vulnerability is rated as High severity.",
      "Recommended action is to run 'npm update next-auth' to patch the dependency immediately."
    ],
    "2": [
      "Vercel has sent the monthly usage and analytics report for May 2026.",
      "Shows total of 12 projects on Hobby Plan with total amount due of $0.00 USD.",
      "Attached is the usage report PDF detailing billing and performance metrics."
    ],
    "3": [
      "Sentry has captured a new uncaught TypeError in production under src/features/products.",
      "Impacts 14 users with 28 occurrences in Chrome/Windows 11.",
      "Redirects to dashboard to inspect stack trace and breadcrumbs."
    ]
  },
  draftPrompt: {
    title: "Save Draft?",
    description: "What would you like to do with this message?",
    save: "Save Draft",
    delete: "Delete Draft",
    keepEditing: "Keep Editing"
  },
  undoSend: "Undo Send",
  messageSent: "Message Sent Successfully",
  noMail: "No Mail",
  noMessageSelected: "No Message Selected",
  updatedJustNow: "Updated Just Now",
  oneMessage: "1 Message",
  summarize: "Summarize"
} as const;
