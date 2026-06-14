import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Inbox,
  Send,
  File,
  AlertOctagon,
  Trash,
  Search,
  Reply,
  SendHorizontal,
  CheckCircle2,
  ChevronLeft,
  Archive,
  Flag,
  PenSquare,
  Folder,
  ChevronRight,
  ReplyAll,
  Forward,
  Sparkles,
  SlidersHorizontal,
  Menu,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useDevice } from "@/hooks/use-device";
import {
  type Email,
  parseLocalizedEmails,
  EMAIL_SUMMARIES,
  EMAIL_ATTACHMENTS,
} from "@/features/mail/constants/default-emails";

export function MailWindow({ onClose: _onClose }: { onClose?: () => void }) {
  const { t } = useTranslation("common");
  const { isMobile, isTablet } = useDevice();

  // Folders and navigation states
  const [activeFolder, setActiveFolder] = useState<string>("inbox");
  const [selectedEmailId, setSelectedEmailId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "primary" | "promotions" | "social" | "updates"
  >("primary");

  // Mobile Drill-Down navigation state
  const [mobileView, setMobileView] = useState<"folders" | "list" | "detail">(
    "folders",
  );

  // Apple Intelligence summary state
  const [showSummary, setShowSummary] = useState(false);

  // Compose Message states
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState("danielalejandre1050@gmail.com");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Tablet Sidebar sliding drawer toggle
  const [isTabletSidebarOpen, setIsTabletSidebarOpen] = useState(false);

  // Move to folder dropdown toggle
  const [showMoveDropdown, setShowMoveDropdown] = useState(false);

  // Draft cancel dialog prompt toggle
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);

  // Undo send states
  const [undoableEmail, setUndoableEmail] = useState<Email | null>(null);
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const [undoTimerId, setUndoTimerId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Sent emails local storage persistence
  const [sentEmails, setSentEmails] = useState<Email[]>(() => {
    try {
      const saved = localStorage.getItem("ing_juanda_sent_mails");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ing_juanda_sent_mails", JSON.stringify(sentEmails));
  }, [sentEmails]);

  // Draft emails local storage persistence
  const [draftEmails, setDraftEmails] = useState<Email[]>(() => {
    try {
      const saved = localStorage.getItem("ing_juanda_draft_mails");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ing_juanda_draft_mails", JSON.stringify(draftEmails));
  }, [draftEmails]);

  // Flagged emails tracking
  const [flaggedEmailIds, setFlaggedEmailIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ing_juanda_flagged_mails");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "ing_juanda_flagged_mails",
      JSON.stringify(flaggedEmailIds),
    );
  }, [flaggedEmailIds]);

  // Read status tracking
  const [readEmailIds, setReadEmailIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ing_juanda_read_mails");
      return saved ? JSON.parse(saved) : ["3"]; // Default email 3 is read
    } catch {
      return ["3"];
    }
  });

  useEffect(() => {
    localStorage.setItem("ing_juanda_read_mails", JSON.stringify(readEmailIds));
  }, [readEmailIds]);

  // Email folder assignments
  const [emailFolderAssignments, setEmailFolderAssignments] = useState<
    Record<string, string>
  >(() => {
    try {
      const saved = localStorage.getItem("ing_juanda_mail_assignments");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "ing_juanda_mail_assignments",
      JSON.stringify(emailFolderAssignments),
    );
  }, [emailFolderAssignments]);

  // Load localized default emails (portfolio themed)
  const defaultEmails = useMemo<Email[]>(() => {
    const localized = t("mail.emails", { returnObjects: true });
    return parseLocalizedEmails(localized, readEmailIds);
  }, [t, readEmailIds]);

  // Auto-select first visible email in active folder on mount/folder change
  useEffect(() => {
    const visible = defaultEmails
      .map((e) => ({ ...e, defaultFolder: "inbox" }))
      .concat(sentEmails.map((e) => ({ ...e, defaultFolder: "sent" })))
      .concat(draftEmails.map((e) => ({ ...e, defaultFolder: "drafts" })))
      .filter((email) => {
        const assignedFolder = emailFolderAssignments[email.id];
        if (assignedFolder) return assignedFolder === activeFolder;
        return email.defaultFolder === activeFolder;
      });

    if (visible.length > 0) {
      const firstEmail = visible[0];
      if (firstEmail) {
        setSelectedEmailId(firstEmail.id);
      }
    } else {
      setSelectedEmailId("");
    }
  }, [
    activeFolder,
    defaultEmails,
    sentEmails,
    draftEmails,
    emailFolderAssignments,
    selectedEmailId,
  ]);

  // Reset summary on email change
  useEffect(() => {
    setShowSummary(false);
    setShowMoveDropdown(false);
  }, [selectedEmailId]);

  // Filter messages by active folder
  const folderEmails = useMemo(() => {
    const allDefaults = defaultEmails.map((e) => ({
      ...e,
      defaultFolder: "inbox",
    }));
    const allSents = sentEmails.map((e) => ({ ...e, defaultFolder: "sent" }));
    const allDrafts = draftEmails.map((e) => ({
      ...e,
      defaultFolder: "drafts",
    }));

    const combined = [...allDefaults, ...allSents, ...allDrafts];

    return combined.filter((email) => {
      const assignedFolder = emailFolderAssignments[email.id];
      if (assignedFolder) {
        return assignedFolder === activeFolder;
      }
      return email.defaultFolder === activeFolder;
    });
  }, [
    activeFolder,
    defaultEmails,
    sentEmails,
    draftEmails,
    emailFolderAssignments,
  ]);

  // Tab filter: Primary contains emails, others Promotions/Social/Updates are empty (reduces clutter)
  const tabFilteredEmails = useMemo(() => {
    if (activeFolder !== "inbox") return folderEmails;
    if (activeTab === "primary") return folderEmails;
    return [];
  }, [folderEmails, activeFolder, activeTab]);

  // Filter messages by search query
  const filteredEmails = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return tabFilteredEmails;
    return tabFilteredEmails.filter(
      (email) =>
        email.fromName.toLowerCase().includes(query) ||
        email.fromEmail.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query),
    );
  }, [tabFilteredEmails, searchQuery]);

  // Selected email resolution
  const activeEmail = useMemo(() => {
    if (filteredEmails.length === 0) return null;
    const found = filteredEmails.find((email) => email.id === selectedEmailId);
    return found || filteredEmails[0] || null;
  }, [filteredEmails, selectedEmailId]);

  // Swipe back events on mobile layout
  useEffect(() => {
    const handleSwipe = (e: Event) => {
      if (isMobile) {
        if (mobileView === "detail") {
          e.preventDefault();
          setMobileView("list");
        } else if (mobileView === "list") {
          e.preventDefault();
          setMobileView("folders");
        }
      }
    };
    window.addEventListener("ios-swipe-back", handleSwipe);
    window.addEventListener("ipados-swipe-back", handleSwipe);
    return () => {
      window.removeEventListener("ios-swipe-back", handleSwipe);
      window.removeEventListener("ipados-swipe-back", handleSwipe);
    };
  }, [mobileView, isMobile]);

  // Folder Counts
  const inboxUnreadCount = useMemo(() => {
    return defaultEmails.filter(
      (e) =>
        !readEmailIds.includes(e.id) &&
        (!emailFolderAssignments[e.id] ||
          emailFolderAssignments[e.id] === "inbox"),
    ).length;
  }, [defaultEmails, readEmailIds, emailFolderAssignments]);

  const draftEmailCount = useMemo(() => {
    return draftEmails.filter(
      (e) =>
        !emailFolderAssignments[e.id] ||
        emailFolderAssignments[e.id] === "drafts",
    ).length;
  }, [draftEmails, emailFolderAssignments]);

  const junkEmailCount = useMemo(() => {
    return Object.values(emailFolderAssignments).filter((f) => f === "junk")
      .length;
  }, [emailFolderAssignments]);

  const trashEmailCount = useMemo(() => {
    return Object.values(emailFolderAssignments).filter((f) => f === "trash")
      .length;
  }, [emailFolderAssignments]);

  const archiveEmailCount = useMemo(() => {
    return Object.values(emailFolderAssignments).filter((f) => f === "archive")
      .length;
  }, [emailFolderAssignments]);

  // Action Handlers
  const handleNewMessage = () => {
    setComposeTo("danielalejandre1050@gmail.com");
    setComposeSubject("");
    setComposeBody("");
    setEditingDraftId(null);
    setIsComposing(true);
  };

  const handleReply = (email: Email) => {
    setComposeTo(email.fromEmail);
    setComposeSubject(`Re: ${email.subject}`);
    setComposeBody(
      `\n\nOn ${email.date}, ${email.fromName} wrote:\n> ${email.body.split("\n").join("\n> ")}`,
    );
    setEditingDraftId(null);
    setIsComposing(true);
  };

  const handleReplyAll = (email: Email) => {
    setComposeTo(email.fromEmail);
    setComposeSubject(`Re: ${email.subject}`);
    setComposeBody(
      `\n\nOn ${email.date}, ${email.fromName} wrote:\n> ${email.body.split("\n").join("\n> ")}`,
    );
    setEditingDraftId(null);
    setIsComposing(true);
  };

  const handleForward = (email: Email) => {
    setComposeTo("");
    setComposeSubject(`Fwd: ${email.subject}`);
    setComposeBody(
      `\n\n---------- Forwarded message ---------\nFrom: ${email.fromName} <${email.fromEmail}>\nDate: ${email.dateTime || email.date}\nSubject: ${email.subject}\nTo: ${email.recipient || "danielalejandre1050@gmail.com"}\n\n${email.body}`,
    );
    setEditingDraftId(null);
    setIsComposing(true);
  };

  const handleDelete = (email: Email) => {
    const assignedFolder = emailFolderAssignments[email.id];
    const currentFolder =
      assignedFolder ||
      email.defaultFolder ||
      (sentEmails.some((e) => e.id === email.id) ? "sent" : "inbox");

    if (currentFolder === "trash") {
      // Permanent delete
      setEmailFolderAssignments((prev) => ({
        ...prev,
        [email.id]: "deleted_forever",
      }));
      setSentEmails((prev) => prev.filter((e) => e.id !== email.id));
      setDraftEmails((prev) => prev.filter((d) => d.id !== email.id));
    } else {
      // Move to trash
      setEmailFolderAssignments((prev) => ({
        ...prev,
        [email.id]: "trash",
      }));
    }
    if (selectedEmailId === email.id) {
      setSelectedEmailId("");
    }
  };

  const handleArchive = (email: Email) => {
    const assignedFolder = emailFolderAssignments[email.id];
    const currentFolder =
      assignedFolder ||
      email.defaultFolder ||
      (sentEmails.some((e) => e.id === email.id) ? "sent" : "inbox");

    if (currentFolder === "archive") {
      setEmailFolderAssignments((prev) => {
        const copy = { ...prev };
        delete copy[email.id];
        return copy;
      });
    } else {
      setEmailFolderAssignments((prev) => ({
        ...prev,
        [email.id]: "archive",
      }));
    }
    if (selectedEmailId === email.id) {
      setSelectedEmailId("");
    }
  };

  const handleJunk = (email: Email) => {
    const assignedFolder = emailFolderAssignments[email.id];
    const currentFolder =
      assignedFolder ||
      email.defaultFolder ||
      (sentEmails.some((e) => e.id === email.id) ? "sent" : "inbox");

    if (currentFolder === "junk") {
      setEmailFolderAssignments((prev) => {
        const copy = { ...prev };
        delete copy[email.id];
        return copy;
      });
    } else {
      setEmailFolderAssignments((prev) => ({
        ...prev,
        [email.id]: "junk",
      }));
    }
    if (selectedEmailId === email.id) {
      setSelectedEmailId("");
    }
  };

  const handleToggleFlag = (email: Email) => {
    setFlaggedEmailIds((prev) =>
      prev.includes(email.id)
        ? prev.filter((id) => id !== email.id)
        : [...prev, email.id],
    );
  };

  const handleMoveToFolder = (emailId: string, folderId: string) => {
    setEmailFolderAssignments((prev) => ({
      ...prev,
      [emailId]: folderId,
    }));
    if (selectedEmailId === emailId) {
      setSelectedEmailId("");
    }
  };

  const handleSelectEmail = (email: Email) => {
    const assignedFolder = emailFolderAssignments[email.id];
    const currentFolder =
      assignedFolder ||
      email.defaultFolder ||
      (sentEmails.some((e) => e.id === email.id) ? "sent" : "inbox");

    if (currentFolder === "drafts") {
      setComposeTo(email.recipient || "");
      setComposeSubject(email.subject);
      setComposeBody(email.body);
      setEditingDraftId(email.id);
      setIsComposing(true);
    } else {
      setSelectedEmailId(email.id);
      if (!readEmailIds.includes(email.id)) {
        setReadEmailIds((prev) => [...prev, email.id]);
      }
    }
  };

  const handleSearchFocus = () => {
    const ids = [
      "mail-search-input-desktop",
      "mail-search-input-tablet",
      "mail-search-input-mobile",
    ];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        el.focus();
        break;
      }
    }
  };

  // Composer Actions
  const handleCancelCompose = () => {
    if (composeSubject.trim() || composeBody.trim()) {
      setShowDraftPrompt(true);
    } else {
      setIsComposing(false);
      setEditingDraftId(null);
    }
  };

  const handleSaveDraft = () => {
    const draftId = editingDraftId || `draft-${Date.now()}`;
    const newDraft: Email = {
      id: draftId,
      fromName: "Draft",
      fromEmail: "draft@juanda.dev",
      date: new Date().toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      }),
      dateTime: new Date().toLocaleString(),
      subject: composeSubject || "(No Subject)",
      body: composeBody,
      unread: false,
      recipient: composeTo,
    };

    setDraftEmails((prev) => {
      const filtered = prev.filter((d) => d.id !== draftId);
      return [newDraft, ...filtered];
    });

    setIsComposing(false);
    setShowDraftPrompt(false);
    setEditingDraftId(null);

    setActiveFolder("drafts");
    setSelectedEmailId(draftId);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo || !composeSubject || !composeBody) return;

    setIsSending(true);

    if (editingDraftId) {
      setDraftEmails((prev) => prev.filter((d) => d.id !== editingDraftId));
    }

    setTimeout(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString(undefined, {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      });

      const newEmail: Email = {
        id: `sent-${Date.now()}`,
        fromName: "You",
        fromEmail: "visitor@juanda.dev",
        date: formattedDate,
        dateTime: now.toLocaleString(),
        subject: composeSubject,
        body: composeBody,
        unread: false,
        recipient: composeTo,
      };

      setUndoableEmail(newEmail);
      setShowUndoBanner(true);

      setSentEmails((prev) => [newEmail, ...prev]);
      setIsSending(false);
      setIsComposing(false);
      setEditingDraftId(null);
      setShowToast(true);
      setActiveFolder("sent");
      setSelectedEmailId(newEmail.id);
      setMobileView("detail");

      if (undoTimerId) clearTimeout(undoTimerId);
      const timer = setTimeout(() => {
        setShowUndoBanner(false);
        setUndoableEmail(null);
      }, 8000);
      setUndoTimerId(timer);

      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const handleUndoSend = () => {
    if (!undoableEmail) return;

    if (undoTimerId) {
      clearTimeout(undoTimerId);
      setUndoTimerId(null);
    }

    setSentEmails((prev) => prev.filter((e) => e.id !== undoableEmail.id));

    setComposeTo(undoableEmail.recipient || "");
    setComposeSubject(undoableEmail.subject);
    setComposeBody(undoableEmail.body);
    setEditingDraftId(null);
    setIsComposing(true);

    setShowUndoBanner(false);
    setUndoableEmail(null);
  };

  // Initials Avatar helper
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
    }
    return (name[0] ?? "").toUpperCase();
  };

  // Folder configurations
  const favorites = useMemo(
    () => [
      {
        id: "inbox",
        label: t("mail.sidebar.inbox", "Inbox"),
        icon: Inbox,
        count: inboxUnreadCount,
        color: "text-blue-500",
      },
      {
        id: "sent",
        label: t("mail.sidebar.sent", "Sent"),
        icon: Send,
        count: 0,
        color: "text-sky-500",
      },
    ],
    [t, inboxUnreadCount],
  );

  const icloudFolders = useMemo(
    () => [
      {
        id: "inbox",
        label: t("mail.sidebar.inbox", "Inbox"),
        icon: Inbox,
        count: inboxUnreadCount,
      },
      {
        id: "drafts",
        label: t("mail.sidebar.drafts", "Drafts"),
        icon: File,
        count: draftEmailCount,
      },
      {
        id: "sent",
        label: t("mail.sidebar.sent", "Sent"),
        icon: Send,
        count: 0,
      },
      {
        id: "junk",
        label: t("mail.sidebar.junk", "Junk"),
        icon: AlertOctagon,
        count: junkEmailCount,
      },
      {
        id: "trash",
        label: t("mail.sidebar.trash", "Trash"),
        icon: Trash,
        count: trashEmailCount,
      },
      {
        id: "archive",
        label: t("mail.sidebar.archive", "Archive"),
        icon: Archive,
        count: archiveEmailCount,
      },
      {
        id: "pets",
        label: "Pets",
        icon: Folder,
        count: Object.values(emailFolderAssignments).filter((f) => f === "pets")
          .length,
      },
      {
        id: "school",
        label: "School",
        icon: Folder,
        count: Object.values(emailFolderAssignments).filter(
          (f) => f === "school",
        ).length,
      },
      {
        id: "work",
        label: "Work",
        icon: Folder,
        count: Object.values(emailFolderAssignments).filter((f) => f === "work")
          .length,
      },
    ],
    [
      t,
      inboxUnreadCount,
      draftEmailCount,
      junkEmailCount,
      trashEmailCount,
      archiveEmailCount,
      emailFolderAssignments,
    ],
  );

  const safeAreaTop = isMobile ? "pt-[44px]" : isTablet ? "pt-[28px]" : "pt-0";

  // Segmented Tabs Header component
  const TabsHeader = ({ className }: { className?: string }) => (
    <div
      className={cn(
        "flex bg-[#e3e3e6]/60 dark:bg-zinc-800/60 p-0.5 rounded-lg border border-black/[0.04] dark:border-white/[0.04] select-none",
        className,
      )}
    >
      <button
        onClick={() => setActiveTab("primary")}
        className={cn(
          "flex-1 py-1 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
          activeTab === "primary"
            ? "bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm font-bold"
            : "text-gray-500 hover:text-black dark:hover:text-white",
        )}
      >
        <span className="size-2 rounded-full bg-blue-500 inline-block" />
        Primary
      </button>
      {[
        { id: "promotions" as const, emoji: "🛒" },
        { id: "social" as const, emoji: "💬" },
        { id: "updates" as const, emoji: "📢" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex-1 py-1 rounded-md text-xs transition-all flex items-center justify-center",
            activeTab === tab.id
              ? "bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm"
              : "text-gray-400 hover:text-black dark:hover:text-white",
          )}
          aria-label={tab.id}
        >
          {tab.emoji}
        </button>
      ))}
    </div>
  );

  // Custom File Attachment Widget for portfolio emails
  const FileAttachmentWidget = ({
    filename,
    size,
  }: {
    filename: string;
    size: string;
  }) => (
    <div className="mt-6 p-4 border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-between shadow-sm max-w-md bg-white dark:bg-zinc-900/50 select-none">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-red-500/10 text-red-500 dark:bg-red-500/20 flex items-center justify-center font-bold text-xs shrink-0 border border-red-500/25">
          PDF
        </div>
        <div>
          <h4 className="font-bold text-xs text-foreground">{filename}</h4>
          <p className="text-muted-foreground text-[10px]">{size}</p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          alert(`Opening attachment: ${filename}`);
        }}
        className="px-3 py-1 rounded-full bg-blue-500 text-white font-bold text-[10px] hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
      >
        Open
      </button>
    </div>
  );

  // Email Summary component (Apple Intelligence)
  const EmailSummaryCard = () => {
    if (!activeEmail) return null;

    // Try localized summaries first, then fall back to constants
    const localizedSummary = t(`mail.summaries.${activeEmail.id}`, {
      returnObjects: true,
    });
    const summaryItems: string[] =
      Array.isArray(localizedSummary) && localizedSummary.length > 0
        ? localizedSummary
        : (EMAIL_SUMMARIES[activeEmail.id] ?? [
            `Email from ${activeEmail.fromName} (${activeEmail.fromEmail}).`,
            `Subject is "${activeEmail.subject}".`,
            `Content suggests a follow-up action or discussion regarding this topic.`,
          ]);

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-4 rounded-xl bg-blue-500/[0.06] border border-blue-500/25 dark:bg-blue-950/15 text-xs select-text text-foreground space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-155"
      >
        <div className="flex items-center gap-1.5 text-blue-500 font-bold">
          <Sparkles className="size-3.5" />
          <span>Apple Intelligence Summary</span>
        </div>
        <ul className="list-disc pl-4 space-y-1 text-foreground/90 select-text leading-relaxed">
          {summaryItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </motion.div>
    );
  };

  // Move To Folder Dropdown component
  const MoveToFolderDropdown = () => {
    if (!activeEmail) return null;
    return (
      <>
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowMoveDropdown(false)}
        />
        <div className="absolute top-12 right-4 z-[60] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-xl p-1.5 w-44 select-none animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="text-[10px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wide">
            Move to...
          </div>
          {[
            { id: "inbox", label: "Inbox", icon: Inbox },
            { id: "archive", label: "Archive", icon: Archive },
            { id: "junk", label: "Junk", icon: AlertOctagon },
            { id: "trash", label: "Trash", icon: Trash },
            { id: "work", label: "Work", icon: Folder },
            { id: "school", label: "School", icon: Folder },
            { id: "pets", label: "Pets", icon: Folder },
          ].map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => {
                  handleMoveToFolder(activeEmail.id, folder.id);
                  setShowMoveDropdown(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-left"
              >
                <Icon className="size-3.5 text-blue-500/80" />
                <span>{folder.label}</span>
              </button>
            );
          })}
        </div>
      </>
    );
  };

  // ==========================================
  // VIEW 1: DESKTOP / MAC OS LAYOUT
  // ==========================================
  const renderDesktopView = () => {
    return (
      <div className="flex h-full w-full bg-[#f3f3f3] dark:bg-[#1c1c1e]/60">
        {/* Pane 1: Mailboxes Sidebar */}
        <div className="w-56 shrink-0 bg-vscode-sidebar/95 border-r border-border/40 p-3.5 flex flex-col justify-between overflow-y-auto select-none">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-extrabold text-muted-foreground/80 uppercase tracking-wider">
                Mailboxes
              </span>
              <button
                onClick={handleNewMessage}
                className="p-1 rounded-md text-blue-500 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
              >
                <PenSquare className="size-4" />
              </button>
            </div>

            {/* Favorites group */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground/50 px-2 uppercase tracking-wide block mb-1">
                Favorites
              </span>
              {favorites.map((fav) => {
                const Icon = fav.icon;
                const isActive = activeFolder === fav.id;
                return (
                  <button
                    key={fav.id}
                    onClick={() => {
                      setActiveFolder(fav.id);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold rounded-lg transition-all text-left",
                      isActive
                        ? "bg-blue-500 text-white shadow-sm font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "size-3.5 shrink-0",
                          isActive ? "text-white" : fav.color,
                        )}
                      />
                      <span>{fav.label}</span>
                    </div>
                    {fav.count > 0 && (
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-black/5 dark:bg-white/10 text-gray-500",
                        )}
                      >
                        {fav.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <hr className="border-border/30 mx-1" />

            {/* iCloud group */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground/50 px-2 uppercase tracking-wide block mb-1">
                iCloud
              </span>
              {icloudFolders.map((folder) => {
                const Icon = folder.icon;
                const isActive = activeFolder === folder.id;
                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setActiveFolder(folder.id);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-1 text-xs rounded-lg transition-all text-left",
                      isActive
                        ? "bg-blue-500 text-white shadow-sm font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "size-3.5 shrink-0 text-blue-500/80",
                          isActive && "text-white",
                        )}
                      />
                      <span>{folder.label}</span>
                    </div>
                    {folder.count > 0 && (
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-black/5 dark:bg-white/10 text-gray-500",
                        )}
                      >
                        {folder.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 mt-4 select-none">
            {showUndoBanner ? (
              <button
                onClick={handleUndoSend}
                className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg border border-solid border-blue-500 bg-blue-500/10 text-xs text-blue-500 font-bold hover:bg-blue-500/20 active:scale-95 transition-all animate-pulse"
              >
                <span>↩️ Undo Send</span>
              </button>
            ) : (
              <div className="w-full h-8 flex items-center justify-center border border-dashed border-border/40 rounded-lg text-[10px] text-muted-foreground/45 select-none pointer-events-none">
                No active actions
              </div>
            )}
            <p className="text-[10px] text-muted-foreground/60 text-center select-none">
              Updated Just Now
            </p>
          </div>
        </div>

        {/* Pane 2: Message List */}
        <div className="w-[320px] shrink-0 border-r border-border/40 bg-background flex flex-col min-h-0 select-none">
          <div className="p-4 pb-2 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold capitalize text-foreground">
                {activeFolder}
              </h3>
              <button
                className="p-1 text-muted-foreground hover:text-foreground"
                onClick={handleSearchFocus}
              >
                <SlidersHorizontal className="size-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              <input
                id="mail-search-input-desktop"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-black/5 dark:bg-white/10 py-1.5 pl-8 pr-7 text-xs outline-none placeholder:text-muted-foreground/60 text-foreground focus:bg-black/10 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-[5px] size-5 flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-foreground"
                >
                  <span className="text-[14px]">×</span>
                </button>
              )}
            </div>
          </div>

          {/* Spacing and Tab filters */}
          <div className="text-[11px] font-bold text-muted-foreground/50 px-4 pb-1 select-none">
            {filteredEmails.length} messages,{" "}
            {filteredEmails.filter((e) => !readEmailIds.includes(e.id)).length}{" "}
            unread
          </div>

          <TabsHeader className="mx-4 mb-3 w-[288px]" />

          {/* List scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-black/[0.05] dark:divide-white/[0.05] border-t border-border/30">
            {filteredEmails.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-xs text-muted-foreground italic">
                No Mail
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmailId === email.id;
                const isFlagged = flaggedEmailIds.includes(email.id);
                return (
                  <button
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    className={cn(
                      "w-full text-left p-4 flex flex-col gap-1 transition-all outline-none relative pl-7 border-l-4",
                      isSelected
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "hover:bg-black/5 dark:hover:bg-white/5 border-transparent text-foreground",
                    )}
                  >
                    {/* Unread indicator */}
                    {!readEmailIds.includes(email.id) &&
                      email.defaultFolder === "inbox" && (
                        <span
                          className={cn(
                            "absolute left-2.5 top-5 size-2 rounded-full shadow-sm",
                            isSelected ? "bg-white" : "bg-blue-500",
                          )}
                        />
                      )}

                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "font-extrabold text-[13.5px] truncate pr-2 flex items-center gap-1",
                          isSelected ? "text-white" : "text-foreground",
                        )}
                      >
                        {email.fromName}
                        {isFlagged && (
                          <Flag className="size-3 text-orange-500 fill-orange-500" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] shrink-0 font-semibold",
                          isSelected
                            ? "text-white/80"
                            : "text-muted-foreground",
                        )}
                      >
                        {email.date}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "text-[12px] font-bold truncate leading-none",
                        isSelected ? "text-white" : "text-foreground",
                      )}
                    >
                      {email.subject}
                    </p>

                    <p
                      className={cn(
                        "text-[11.5px] line-clamp-2 leading-relaxed mt-0.5",
                        isSelected ? "text-white/85" : "text-muted-foreground",
                      )}
                    >
                      {email.body}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Pane 3: Detail view */}
        <div className="flex-1 bg-background p-6 flex flex-col min-h-0 select-text overflow-hidden relative">
          {/* Action Toolbar */}
          <div className="relative flex items-center justify-between border-b border-border/40 pb-3 mb-4 shrink-0 select-none">
            <div className="w-1" />
            <div className="flex items-center gap-1.5">
              {[
                { icon: PenSquare, title: "Compose", action: handleNewMessage },
                {
                  icon: Reply,
                  title: "Reply",
                  action: () => activeEmail && handleReply(activeEmail),
                },
                {
                  icon: ReplyAll,
                  title: "Reply All",
                  action: () => activeEmail && handleReplyAll(activeEmail),
                },
                {
                  icon: Forward,
                  title: "Forward",
                  action: () => activeEmail && handleForward(activeEmail),
                },
                {
                  icon: Archive,
                  title: "Archive",
                  action: () => activeEmail && handleArchive(activeEmail),
                },
                {
                  icon: Trash,
                  title: "Delete",
                  action: () => activeEmail && handleDelete(activeEmail),
                },
                {
                  icon: AlertOctagon,
                  title: "Junk",
                  action: () => activeEmail && handleJunk(activeEmail),
                },
                {
                  icon: Folder,
                  title: "Move to Folder",
                  action: () => setShowMoveDropdown(!showMoveDropdown),
                },
                {
                  icon: Flag,
                  title: "Flag",
                  action: () => activeEmail && handleToggleFlag(activeEmail),
                  active:
                    activeEmail && flaggedEmailIds.includes(activeEmail.id),
                },
                { icon: Search, title: "Search", action: handleSearchFocus },
              ].map((btn, idx) => {
                const Icon = btn.icon;
                const isFlagged = btn.active;
                return (
                  <button
                    key={idx}
                    onClick={btn.action}
                    className={cn(
                      "p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground active:scale-95 transition-all",
                      isFlagged &&
                        "text-orange-500 hover:text-orange-600 dark:text-orange-400",
                    )}
                    title={btn.title}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {showMoveDropdown && <MoveToFolderDropdown />}
            </AnimatePresence>
          </div>

          {activeEmail ? (
            <div className="flex-1 flex flex-col overflow-y-auto pr-2">
              {/* Header info */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11.5px] font-bold text-muted-foreground select-none">
                  1 Message
                </span>
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none border shadow-sm transition-all",
                    showSummary
                      ? "bg-blue-500 text-white border-blue-500 font-bold"
                      : "bg-[#e3e3e6]/60 dark:bg-zinc-800 text-foreground border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5",
                  )}
                >
                  <Sparkles className="size-3.5" />
                  <span>Summarize</span>
                </button>
              </div>

              {/* Summary card if enabled */}
              <AnimatePresence>
                {showSummary && <EmailSummaryCard />}
              </AnimatePresence>

              {/* Subject */}
              <h2 className="text-xl font-extrabold tracking-tight text-foreground leading-tight mb-4 select-text flex items-center gap-2">
                {activeEmail.subject}
                {flaggedEmailIds.includes(activeEmail.id) && (
                  <Flag className="size-4.5 text-orange-500 fill-orange-500 shrink-0" />
                )}
              </h2>

              {/* Sender Details */}
              <div className="flex items-center gap-3 border-b border-border/30 pb-4 mb-5 select-none">
                <div className="size-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center font-bold text-sm shrink-0 border border-black/5 dark:border-white/10">
                  {getInitials(activeEmail.fromName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-[14px] text-foreground">
                      {activeEmail.fromName}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {activeEmail.dateTime}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex flex-wrap gap-1 leading-none mt-0.5">
                    <span>From:</span>
                    <span className="font-mono text-foreground/70">
                      {activeEmail.fromEmail}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1 flex gap-1">
                    <span>To:</span>
                    <span className="font-medium text-foreground/70">
                      {activeEmail.recipient}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 text-[14.5px] leading-relaxed text-foreground/90 whitespace-pre-wrap font-sans select-text px-1">
                {activeEmail.body}
              </div>

              {/* File Attachment */}
              {activeEmail.hasAttachment &&
                EMAIL_ATTACHMENTS[activeEmail.id] && (
                  <FileAttachmentWidget
                    filename={EMAIL_ATTACHMENTS[activeEmail.id]!.filename}
                    size={EMAIL_ATTACHMENTS[activeEmail.id]!.size}
                  />
                )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground select-none">
              <Inbox className="size-12 mb-3 text-muted-foreground/30" />
              <p className="font-bold">No Message Selected</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW 2: TABLET / IPADOS LAYOUT
  // ==========================================
  const renderTabletView = () => {
    return (
      <div
        className={cn(
          "flex h-full w-full bg-[#f2f2f7] dark:bg-black text-foreground relative overflow-hidden",
          safeAreaTop,
        )}
      >
        {/* Left column (Sidebar list & Message items, width: 340px) */}
        <div className="w-[340px] shrink-0 border-r border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 flex flex-col h-full select-none">
          {/* Header */}
          <div className="p-4 pb-2 border-b border-black/[0.06] dark:border-white/[0.06] bg-[#f2f2f7]/50 dark:bg-zinc-900/35">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTabletSidebarOpen(true)}
                  className="p-1.5 rounded-lg text-blue-500 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-transform"
                >
                  <Menu className="size-5" />
                </button>
                <h3 className="text-lg font-black tracking-tight capitalize">
                  {t(`mail.sidebar.${activeFolder}`, activeFolder)} iCloud
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleNewMessage}
                  className="p-2 rounded-full text-blue-500 hover:bg-black/5"
                >
                  <PenSquare className="size-4.5" />
                </button>
                <button
                  onClick={() => setShowMoveDropdown(!showMoveDropdown)}
                  className="p-2 rounded-full text-blue-500 hover:bg-black/5"
                >
                  <Folder className="size-4.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-blue-500 font-bold mb-2 min-h-[22px]">
              {showUndoBanner ? (
                <button
                  onClick={handleUndoSend}
                  className="hover:underline animate-pulse flex items-center gap-1 text-blue-500 font-bold"
                >
                  <span>↩️ Undo Send</span>
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={handleSearchFocus}
                className="p-1 rounded-full text-blue-500 hover:bg-black/5"
              >
                <SlidersHorizontal className="size-3.5" />
              </button>
            </div>

            {/* Search - iPad specific padding fix (pl-9 instead of invalid pl-8.5) */}
            <div className="relative w-full mb-3 px-1">
              <Search className="absolute left-3.5 top-[9px] size-3.5 text-gray-400 pointer-events-none" />
              <input
                id="mail-search-input-tablet"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-black/5 dark:bg-white/10 py-1.5 pl-9 pr-7 text-xs outline-none placeholder:text-gray-400 text-foreground focus:bg-black/10 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-[7px] size-5 flex items-center justify-center rounded-full text-gray-400 hover:text-foreground"
                >
                  <span className="text-[14px]">×</span>
                </button>
              )}
            </div>

            <TabsHeader className="mx-0 w-full mb-3" />
          </div>

          {/* List items mapping */}
          <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
            {filteredEmails.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-xs text-gray-400 italic">
                No Mail
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmailId === email.id;
                const isFlagged = flaggedEmailIds.includes(email.id);
                return (
                  <button
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    className={cn(
                      "w-full text-left p-4 flex gap-3 transition-all outline-none border-l-4 relative",
                      isSelected
                        ? "bg-blue-500/10 dark:bg-blue-500/15 border-blue-500"
                        : "hover:bg-black/5 dark:hover:bg-white/5 border-transparent",
                    )}
                  >
                    {/* Unread circle indicator badge next to initials */}
                    {!readEmailIds.includes(email.id) &&
                      email.defaultFolder === "inbox" && (
                        <span className="absolute left-2 top-[32px] size-2 rounded-full bg-blue-500 shadow-sm z-10" />
                      )}

                    <div className="size-10 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 border border-black/5">
                      {getInitials(email.fromName)}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[13.5px] truncate pr-2 text-foreground flex items-center gap-1">
                          {email.fromName}
                          {isFlagged && (
                            <Flag className="size-3 text-orange-500 fill-orange-500" />
                          )}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                          {email.date}
                        </span>
                      </div>
                      <p className="text-[12px] font-bold text-foreground truncate leading-none">
                        {email.subject}
                      </p>
                      <p className="text-[11.5px] text-gray-400 line-clamp-2 leading-relaxed mt-0.5">
                        {email.body}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right column (Detail view, flex-1) */}
        <div className="flex-1 bg-white dark:bg-zinc-950 flex flex-col h-full overflow-hidden select-text p-6 relative">
          {/* Header Actions */}
          <div className="relative flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] pb-3 mb-4 shrink-0 select-none">
            <button className="p-2 rounded-full hover:bg-black/5 text-gray-400 hover:text-foreground">
              <Maximize2 className="size-4.5" />
            </button>

            <div className="flex items-center gap-3">
              {[
                { icon: PenSquare, title: "Compose", action: handleNewMessage },
                {
                  icon: Reply,
                  title: "Reply",
                  action: () => activeEmail && handleReply(activeEmail),
                },
                {
                  icon: ReplyAll,
                  title: "Reply All",
                  action: () => activeEmail && handleReplyAll(activeEmail),
                },
                {
                  icon: Forward,
                  title: "Forward",
                  action: () => activeEmail && handleForward(activeEmail),
                },
                {
                  icon: Flag,
                  title: "Flag",
                  action: () => activeEmail && handleToggleFlag(activeEmail),
                  active:
                    activeEmail && flaggedEmailIds.includes(activeEmail.id),
                },
                {
                  icon: Trash,
                  title: "Delete",
                  action: () => activeEmail && handleDelete(activeEmail),
                },
                {
                  icon: Folder,
                  title: "Move to Folder",
                  action: () => setShowMoveDropdown(!showMoveDropdown),
                },
              ].map((btn, idx) => {
                const Icon = btn.icon;
                const isFlagged = btn.active;
                return (
                  <button
                    key={idx}
                    onClick={btn.action}
                    className={cn(
                      "p-2 rounded-full hover:bg-black/5 text-gray-500 hover:text-foreground active:scale-95 transition-all",
                      isFlagged && "text-orange-500 hover:text-orange-600",
                    )}
                  >
                    <Icon className="size-4.5" />
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {showMoveDropdown && <MoveToFolderDropdown />}
            </AnimatePresence>
          </div>

          {activeEmail ? (
            <div className="flex-1 flex flex-col overflow-y-auto select-text pr-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold text-gray-400">
                  1 Message
                </span>
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold select-none border transition-all",
                    showSummary
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-[#e3e3e6]/60 dark:bg-zinc-800 text-foreground border-black/10 dark:border-white/10",
                  )}
                >
                  <Sparkles className="size-3.5" />
                  <span>Summarize</span>
                </button>
              </div>

              {/* Summary block */}
              <AnimatePresence>
                {showSummary && <EmailSummaryCard />}
              </AnimatePresence>

              {/* Subject Title */}
              <h2 className="text-xl font-black tracking-tight text-foreground mb-4 flex items-center gap-2">
                {activeEmail.subject}
                {flaggedEmailIds.includes(activeEmail.id) && (
                  <Flag className="size-4.5 text-orange-500 fill-orange-500 shrink-0" />
                )}
              </h2>

              {/* Details card */}
              <div className="flex items-center gap-3 border-b border-black/[0.06] dark:border-white/[0.06] pb-4 mb-5 select-none">
                <div className="size-10 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 border border-black/5">
                  {getInitials(activeEmail.fromName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-[14px] text-foreground">
                      {activeEmail.fromName}
                    </span>
                    <span className="text-[11px] text-gray-400 font-semibold">
                      {activeEmail.dateTime}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                    <span>To:</span>
                    <span className="bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full text-[10.5px] font-medium text-foreground/80">
                      {activeEmail.recipient}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap font-sans select-text">
                {activeEmail.body}
              </div>

              {/* File Attachment */}
              {activeEmail.hasAttachment &&
                EMAIL_ATTACHMENTS[activeEmail.id] && (
                  <FileAttachmentWidget
                    filename={EMAIL_ATTACHMENTS[activeEmail.id]!.filename}
                    size={EMAIL_ATTACHMENTS[activeEmail.id]!.size}
                  />
                )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 select-none">
              <Inbox className="size-12 mb-3 text-gray-300" />
              <p className="font-bold">No Message Selected</p>
            </div>
          )}
        </div>

        {/* iPad Folders Drawer Sidebar */}
        <AnimatePresence>
          {isTabletSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsTabletSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute left-0 top-[28px] bottom-0 w-64 z-50 bg-[#f2f2f7] dark:bg-zinc-900 border-r border-black/10 dark:border-white/10 p-4 flex flex-col justify-between overflow-y-auto select-none"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2 pt-2">
                    <span className="text-[11px] font-extrabold text-muted-foreground/80 uppercase tracking-wider">
                      Mailboxes
                    </span>
                    <button
                      onClick={() => {
                        handleNewMessage();
                        setIsTabletSidebarOpen(false);
                      }}
                      className="p-1 rounded-md text-blue-500 hover:bg-black/5 active:scale-95 transition-all"
                    >
                      <PenSquare className="size-4" />
                    </button>
                  </div>

                  {/* Favorites */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground/50 px-2 uppercase tracking-wide block mb-1">
                      Favorites
                    </span>
                    {favorites.map((fav) => {
                      const Icon = fav.icon;
                      const isActive = activeFolder === fav.id;
                      return (
                        <button
                          key={fav.id}
                          onClick={() => {
                            setActiveFolder(fav.id);
                            setIsTabletSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold rounded-lg transition-all text-left",
                            isActive
                              ? "bg-blue-500 text-white shadow-sm font-bold"
                              : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={cn(
                                "size-3.5 shrink-0",
                                isActive ? "text-white" : fav.color,
                              )}
                            />
                            <span>{fav.label}</span>
                          </div>
                          {fav.count > 0 && (
                            <span
                              className={cn(
                                "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-black/5 dark:bg-white/10 text-gray-500",
                              )}
                            >
                              {fav.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <hr className="border-border/30 mx-1" />

                  {/* iCloud folders */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground/50 px-2 uppercase tracking-wide block mb-1">
                      iCloud
                    </span>
                    {icloudFolders.map((folder) => {
                      const Icon = folder.icon;
                      const isActive = activeFolder === folder.id;
                      return (
                        <button
                          key={folder.id}
                          onClick={() => {
                            setActiveFolder(folder.id);
                            setIsTabletSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-2 py-1 text-xs rounded-lg transition-all text-left",
                            isActive
                              ? "bg-blue-500 text-white shadow-sm font-bold"
                              : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={cn(
                                "size-3.5 shrink-0 text-blue-500/80",
                                isActive && "text-white",
                              )}
                            />
                            <span>{folder.label}</span>
                          </div>
                          {folder.count > 0 && (
                            <span
                              className={cn(
                                "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-black/5 dark:bg-white/10 text-gray-500",
                              )}
                            >
                              {folder.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <p className="text-[10px] text-muted-foreground/60 text-center select-none">
                    Updated Just Now
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ==========================================
  // VIEW 3: MOBILE / IOS LAYOUT
  // ==========================================
  const renderMobileView = () => {
    return (
      <div
        className={cn(
          "flex flex-col h-full w-full bg-[#f2f2f7] dark:bg-black text-foreground font-sans select-none overflow-hidden",
          safeAreaTop,
        )}
      >
        {/* Screen 1: Folders / Mailboxes */}
        {mobileView === "folders" && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#f2f2f7] dark:bg-black p-4">
            <div className="flex items-center justify-between pb-3 select-none shrink-0">
              <span className="text-2xl font-black tracking-tight text-foreground">
                Mailboxes
              </span>
              <button className="text-blue-500 font-bold text-base hover:opacity-80">
                Edit
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pt-2">
              {/* Mailboxes Group list */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl divide-y divide-black/[0.06] dark:divide-white/[0.06] overflow-hidden border border-black/[0.04]">
                {favorites.map((fav) => {
                  const Icon = fav.icon;
                  return (
                    <button
                      key={fav.id}
                      onClick={() => {
                        setActiveFolder(fav.id);
                        setMobileView("list");
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 active:bg-gray-100 dark:active:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("size-5 shrink-0", fav.color)} />
                        <span className="text-[16px] font-semibold text-foreground">
                          {fav.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        {fav.count > 0 && (
                          <span className="text-sm font-medium">
                            {fav.count}
                          </span>
                        )}
                        <ChevronRight className="size-4" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-4 block select-none">
                iCloud Mail
              </span>

              <div className="bg-white dark:bg-zinc-900 rounded-xl divide-y divide-black/[0.06] dark:divide-white/[0.06] overflow-hidden border border-black/[0.04]">
                {icloudFolders.map((folder) => {
                  const Icon = folder.icon;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setActiveFolder(folder.id);
                        setMobileView("list");
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 active:bg-gray-100 dark:active:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-5 shrink-0 text-blue-500" />
                        <span className="text-[16px] font-semibold text-foreground">
                          {folder.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        {folder.count > 0 && (
                          <span className="text-sm font-medium">
                            {folder.count}
                          </span>
                        )}
                        <ChevronRight className="size-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compose trigger */}
            <div className="h-12 border-t border-black/5 dark:border-white/5 flex items-center justify-between shrink-0 select-none">
              <span className="text-[11px] text-gray-400">
                Updated Just Now
              </span>
              <button
                onClick={handleNewMessage}
                className="p-2 rounded-full text-blue-500 hover:bg-black/5"
              >
                <PenSquare className="size-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 2: Message list (Inbox) */}
        {mobileView === "list" && (
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-black">
            {/* Nav Header */}
            <div className="px-4 py-3 bg-[#f2f2f7]/60 dark:bg-zinc-900/40 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06] shrink-0 select-none">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setMobileView("folders")}
                  className="flex items-center text-blue-500 font-bold gap-0.5 text-base"
                >
                  <ChevronLeft className="size-5 -ml-1.5" />
                  <span>Mailboxes</span>
                </button>
                <div className="flex items-center gap-3 text-blue-500 font-bold">
                  <button className="hover:opacity-85 text-base">Select</button>
                  <button
                    className="p-1 rounded-full hover:bg-black/5"
                    onClick={handleSearchFocus}
                  >
                    <SlidersHorizontal className="size-4.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-2xl font-black capitalize text-foreground">
                {activeFolder}
              </h3>
            </div>

            <div className="px-4 py-2 shrink-0 select-none">
              {/* Search */}
              <div className="relative w-full mb-3">
                <Search className="absolute left-2.5 top-[7px] size-3.5 text-gray-400 pointer-events-none" />
                <input
                  id="mail-search-input-mobile"
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg bg-black/5 dark:bg-white/10 py-1 pl-8 pr-7 text-xs outline-none placeholder:text-gray-400 text-foreground focus:bg-black/10 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-[3px] size-5 flex items-center justify-center rounded-full text-gray-400 hover:text-foreground"
                  >
                    <span className="text-[14px]">×</span>
                  </button>
                )}
              </div>
              <TabsHeader className="mx-0 w-full mb-3" />
            </div>

            {/* List scroll */}
            <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5 border-t border-black/5">
              {filteredEmails.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-xs text-gray-400 italic">
                  No Mail
                </div>
              ) : (
                filteredEmails.map((email) => {
                  const isFlagged = flaggedEmailIds.includes(email.id);
                  return (
                    <button
                      key={email.id}
                      onClick={() => {
                        handleSelectEmail(email);
                        if (activeFolder !== "drafts") {
                          setMobileView("detail");
                        }
                      }}
                      className="w-full text-left p-4 pl-8 flex gap-3 active:bg-gray-100 dark:active:bg-white/5 transition-colors relative border-b border-black/[0.03]"
                    >
                      {/* Unread dot */}
                      {!readEmailIds.includes(email.id) &&
                        email.defaultFolder === "inbox" && (
                          <span className="absolute left-3.5 top-[34px] size-2 rounded-full bg-blue-500 shadow-sm" />
                        )}

                      <div className="size-9 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 border border-black/5">
                        {getInitials(email.fromName)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[13.5px] truncate text-foreground flex items-center gap-1">
                            {email.fromName}
                            {isFlagged && (
                              <Flag className="size-3 text-orange-500 fill-orange-500" />
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold shrink-0 inline-flex items-center gap-1.5">
                            {email.date}{" "}
                            <ChevronRight className="size-3 text-gray-400/70" />
                          </span>
                        </div>
                        <p className="text-[12px] font-bold text-foreground truncate leading-none mt-0.5">
                          {email.subject}
                        </p>
                        <p className="text-[11.5px] text-gray-400 line-clamp-2 leading-relaxed mt-1">
                          {email.body}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Compose trigger */}
            <div className="h-12 border-t border-black/5 dark:border-white/5 flex items-center justify-between shrink-0 px-4 select-none">
              <span className="text-[11px] text-gray-400">
                Updated Just Now
              </span>
              <button
                onClick={handleNewMessage}
                className="p-2 rounded-full text-blue-500 hover:bg-black/5"
              >
                <PenSquare className="size-5" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 3: Detail view */}
        {mobileView === "detail" && activeEmail && (
          <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-black select-text relative">
            {/* Header nav */}
            <div className="px-4 py-3 bg-[#f2f2f7]/60 dark:bg-zinc-900/40 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.06] shrink-0 flex items-center justify-between select-none relative">
              <button
                onClick={() => setMobileView("list")}
                className="flex items-center text-blue-500 font-bold gap-0.5 text-base"
              >
                <ChevronLeft className="size-5 -ml-1.5" />
                <span className="capitalize">{activeFolder}</span>
              </button>

              <div className="flex items-center gap-4">
                {[
                  {
                    icon: PenSquare,
                    title: "Compose",
                    action: handleNewMessage,
                  },
                  {
                    icon: Reply,
                    title: "Reply",
                    action: () => handleReply(activeEmail),
                  },
                  {
                    icon: ReplyAll,
                    title: "Reply All",
                    action: () => handleReplyAll(activeEmail),
                  },
                  {
                    icon: Forward,
                    title: "Forward",
                    action: () => handleForward(activeEmail),
                  },
                  {
                    icon: Flag,
                    title: "Flag",
                    action: () => handleToggleFlag(activeEmail),
                    active: flaggedEmailIds.includes(activeEmail.id),
                  },
                  {
                    icon: Trash,
                    title: "Delete",
                    action: () => {
                      handleDelete(activeEmail);
                      setMobileView("list");
                    },
                  },
                  {
                    icon: Folder,
                    title: "Move to Folder",
                    action: () => setShowMoveDropdown(!showMoveDropdown),
                  },
                ].map((btn, idx) => {
                  const Icon = btn.icon;
                  const isFlagged = btn.active;
                  return (
                    <button
                      key={idx}
                      onClick={btn.action}
                      className={cn(
                        "p-1 rounded-full text-blue-500 hover:bg-black/5 active:scale-95 transition-all",
                        isFlagged && "text-orange-500 hover:text-orange-600",
                      )}
                    >
                      <Icon className="size-4.5" />
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {showMoveDropdown && <MoveToFolderDropdown />}
              </AnimatePresence>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-4 select-text">
              <div className="flex justify-between items-center mb-4 select-none">
                <span className="text-[10px] font-bold text-gray-400">
                  1 Message
                </span>
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold select-none border transition-all",
                    showSummary
                      ? "bg-blue-500 text-white border-blue-500 font-bold"
                      : "bg-[#e3e3e6]/60 dark:bg-zinc-800 text-foreground border-black/10 dark:border-white/10",
                  )}
                >
                  <Sparkles className="size-3.5" />
                  <span>Summarize</span>
                </button>
              </div>

              {/* Summary block */}
              <AnimatePresence>
                {showSummary && <EmailSummaryCard />}
              </AnimatePresence>

              {/* Subject */}
              <h2 className="text-lg font-black tracking-tight text-foreground leading-snug mb-4 flex items-center gap-2">
                {activeEmail.subject}
                {flaggedEmailIds.includes(activeEmail.id) && (
                  <Flag className="size-4.5 text-orange-500 fill-orange-500 shrink-0" />
                )}
              </h2>

              {/* Sender Details */}
              <div className="flex items-center gap-3 border-b border-black/[0.06] dark:border-white/[0.06] pb-4 mb-5 select-none">
                <div className="size-10 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 border border-black/5">
                  {getInitials(activeEmail.fromName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-[14px] text-foreground">
                      {activeEmail.fromName}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {activeEmail.dateTime}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5 leading-none">
                    <span>To:</span>
                    <span className="bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full text-[10.5px] font-semibold text-foreground/85">
                      {activeEmail.recipient}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="text-[14.5px] leading-relaxed text-foreground/90 whitespace-pre-wrap font-sans select-text">
                {activeEmail.body}
              </div>

              {/* File Attachment */}
              {activeEmail.hasAttachment &&
                EMAIL_ATTACHMENTS[activeEmail.id] && (
                  <FileAttachmentWidget
                    filename={EMAIL_ATTACHMENTS[activeEmail.id]!.filename}
                    size={EMAIL_ATTACHMENTS[activeEmail.id]!.size}
                  />
                )}
            </div>

            {/* Quick reply bottom action arrow */}
            <div className="h-14 border-t border-black/5 dark:border-white/5 flex items-center justify-end px-6 shrink-0 select-none">
              <button
                onClick={() => handleReply(activeEmail)}
                className="p-2.5 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 active:scale-95 transition-all"
              >
                <Reply className="size-5 rotate-[-90deg]" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-[#f2f2f7] dark:bg-black">
      {isMobile
        ? renderMobileView()
        : isTablet
          ? renderTabletView()
          : renderDesktopView()}

      {/* ── Apple Mail Compose Overlay Sheet (Bottom Slide Up) ── */}
      <AnimatePresence>
        {isComposing && (
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.form
              onSubmit={handleSend}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full md:max-w-xl bg-white dark:bg-[#1c1c1e] rounded-t-2xl md:rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl flex flex-col max-h-[92vh] md:max-h-[85vh] text-black dark:text-white overflow-hidden"
            >
              {/* Sheet Header */}
              <div className="px-4 py-3 border-b border-black/10 dark:border-white/5 bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={handleCancelCompose}
                  className="text-[16px] text-blue-500 font-medium active:opacity-60"
                >
                  Cancel
                </button>
                <span className="font-extrabold text-[16px] tracking-tight">
                  {editingDraftId ? "Edit Draft" : "New Message"}
                </span>

                <button
                  type="submit"
                  disabled={isSending}
                  className="size-8 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-40 disabled:scale-100 hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
                  aria-label="Send message"
                >
                  {isSending ? (
                    <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <SendHorizontal className="size-4 -mr-0.5 mt-0.5 rotate-[-45deg]" />
                  )}
                </button>
              </div>

              {/* Compose Inputs */}
              <div className="divide-y divide-black/5 dark:divide-white/5 px-4 bg-white dark:bg-[#1c1c1e] shrink-0 text-xs">
                <div className="flex items-center py-2 text-[14px]">
                  <span className="w-16 text-gray-400 font-semibold select-none">
                    To:
                  </span>
                  <input
                    type="email"
                    required
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-black dark:text-white select-text font-mono text-[12px]"
                  />
                </div>
                <div className="flex items-center py-2 text-[14px]">
                  <span className="w-16 text-gray-400 font-semibold select-none">
                    Cc/Bcc:
                  </span>
                  <span className="text-gray-500 font-mono text-[12px] select-none">
                    danielalejandre1050@gmail.com
                  </span>
                </div>
                <div className="flex items-center py-2 text-[14px]">
                  <span className="w-16 text-gray-400 font-semibold select-none">
                    Subject:
                  </span>
                  <input
                    type="text"
                    required
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-black dark:text-white select-text font-bold"
                  />
                </div>
              </div>

              {/* Content text */}
              <div className="flex-1 bg-white dark:bg-[#1c1c1e] p-4 min-h-0 flex flex-col">
                <textarea
                  required
                  placeholder="Sent from my Portfolio"
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full flex-1 bg-transparent outline-none text-black dark:text-white select-text font-sans resize-none text-[15px] leading-relaxed"
                />
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification Alert Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-5 right-5 z-[99999] rounded-xl bg-green-500 text-white shadow-xl px-4 py-2.5 text-xs font-bold flex items-center gap-3 select-none"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Message Sent Successfully</span>
            </div>
            {showUndoBanner && (
              <button
                type="button"
                onClick={handleUndoSend}
                className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded font-extrabold transition-colors active:scale-95"
              >
                Undo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draft Saving Prompt Modal Dialog */}
      <AnimatePresence>
        {showDraftPrompt && <DraftPromptModal />}
      </AnimatePresence>
    </div>
  );

  // Draft prompt modal component rendering helper
  function DraftPromptModal() {
    return (
      <div className="fixed inset-0 bg-black/45 dark:bg-black/65 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 select-none">
        <div className="w-80 bg-white dark:bg-[#2c2c2e] rounded-xl border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden text-center text-black dark:text-white animate-in zoom-in-95 duration-150">
          <div className="p-5">
            <h4 className="font-bold text-[16px] mb-1">Save Draft?</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              What would you like to do with this message?
            </p>
          </div>
          <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 border-t border-black/5 dark:border-white/5">
            <button
              onClick={handleSaveDraft}
              className="w-full py-3 text-sm text-blue-500 font-bold hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={() => {
                setIsComposing(false);
                setShowDraftPrompt(false);
                setEditingDraftId(null);
              }}
              className="w-full py-3 text-sm text-red-500 font-bold hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors"
            >
              Delete Draft
            </button>
            <button
              onClick={() => setShowDraftPrompt(false)}
              className="w-full py-3 text-sm text-foreground font-semibold hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors"
            >
              Keep Editing
            </button>
          </div>
        </div>
      </div>
    );
  }
}
