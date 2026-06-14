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
    replyPrefix: "Re:"
  },
  emails: [
    {
      id: "1",
      fromName: "Recruitment Global",
      fromEmail: "hr@techglobal.io",
      date: "Today, 10:15 AM",
      subject: "Interview Invitation - Senior Frontend Developer",
      body: "Hi Juan Daniel,\n\nWe reviewed your portfolio and absolutely loved your macOS desktop simulator on the web. It's a great example of modular frontend code, dynamic state management, and visual polish.\n\nWe'd love to schedule a technical interview with you for our Senior Frontend Developer position. Do you have some availability this week?\n\nBest regards,\nRecruitment Global Team"
    },
    {
      id: "2",
      fromName: "Sarah Creative Studios",
      fromEmail: "sarah@creative-studios.co",
      date: "Yesterday, 3:40 PM",
      subject: "Project Inquiry - Freelance Collaboration",
      body: "Hi Juanda,\n\nHope you are doing great. Your interactive portfolio is amazing 🚀. The volume synchronization between the Control Center and the Apple Music app, and the custom Apple Emoji rendering, are top-tier visual details.\n\nWe have a project for an international client requiring custom interactive component design and would love to collaborate with you as a Freelancer. Could we jump on a call?\n\nSarah Miller\nCreative Director"
    },
    {
      id: "3",
      fromName: "Dev Relations OS Labs",
      fromEmail: "dev-relations@os-labs.org",
      date: "June 3, 2026",
      subject: "Collaboration Proposal - Open Source UI Library",
      body: "Dear Juan Daniel,\n\nWe've been following your work with TailwindCSS and Storybook to create accessible UI design systems. We'd love to invite you to participate as a core contributor to our upcoming open-source component library focused on accessibility and adaptive layouts.\n\nLet us know if you're interested so we can schedule a quick brief.\n\nSincerely,\nOS Labs Team"
    }
  ],
  summaries: {
    "1": [
      "Recruitment Global has invited Juan Daniel to a Senior Frontend Developer interview.",
      "They noted his macOS desktop simulator is a great showcase of technical modularity.",
      "Requested reply about his calendar availability for a videocall."
    ],
    "2": [
      "Sarah Miller from Creative Studios proposed a freelance collaboration.",
      "She praised details like volume sync and native-like UI components.",
      "Attached is a project brief document detailing client interactive design requirements."
    ],
    "3": [
      "Dev Relations at OS Labs invited Juanda to be a core contributor to an open-source UI design system library.",
      "They mentioned tracking his work using Storybook and Tailwind CSS.",
      "Suggested arranging a quick call to go over onboarding materials."
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
