export const calendarEn = {
  title: "Calendar",
  sidebar: {
    title: "Calendars",
    work: "Work Experiences",
    education: "Education",
    projects: "Projects",
    listTitle: "All Milestones",
    infoText: "Click any event for details"
  },
  header: {
    today: "Today"
  },
  detailCard: {
    highlights: "Highlights",
    dismiss: "Dismiss"
  },
  milestones: [
    {
      id: "graduation",
      date: "2018-12-10",
      title: "University Graduation",
      type: "education",
      location: "Colima, Mexico",
      company: "Universidad de Colima",
      description: "Graduated with a Bachelor's Degree in Computer Systems Engineering.",
      bullets: [
        "Specialized in software engineering and web technologies.",
        "Academic excellence award in final year projects."
      ]
    },
    {
      id: "digital_labs_join",
      date: "2019-01-15",
      title: "Joined Digital Labs",
      type: "work",
      location: "Guadalajara, Mexico",
      company: "Digital Labs",
      description: "Started working as a Frontend Engineer building scalable web products.",
      bullets: [
        "Built dynamic React applications with TypeScript.",
        "Collaborated with design and backend teams in agile Scrum cycles."
      ]
    },
    {
      id: "legacy_migration_lead",
      date: "2021-10-20",
      title: "Legacy Migration Lead",
      type: "work",
      location: "Guadalajara, Mexico",
      company: "Digital Labs",
      description: "Led the refactoring and migration of core legacy portal systems to modern React SPA architecture.",
      bullets: [
        "Improved load times and performance indicators by 35%.",
        "Introduced testing suites using Jest/React Testing Library."
      ]
    },
    {
      id: "tech_studio_join",
      date: "2022-03-01",
      title: "Joined Tech Studio",
      type: "work",
      location: "Remote, Mexico",
      company: "Tech Studio",
      description: "Senior Frontend Developer. Multi-product platform architecture development.",
      bullets: [
        "Landed architecture definitions for front-end portals.",
        "Configured quality gates, ESLint rulesets, and automated CI pipelines."
      ]
    },
    {
      id: "design_system_launch",
      date: "2023-06-15",
      title: "Design System Enterprise",
      type: "project",
      location: "Remote, Mexico",
      company: "Tech Studio",
      description: "Designed and implemented an Enterprise-grade UI component library with TailwindCSS & Storybook.",
      bullets: [
        "Used by multiple engineering teams, cutting time-to-market by 40%.",
        "Full WCAG accessibility compliance and interactive visual tests."
      ]
    },
    {
      id: "portfolio_launch",
      date: "2026-06-06",
      title: "MacOS Portfolio Launch",
      type: "project",
      location: "Colima, Mexico",
      company: "IngJuanda Corp",
      description: "Published this fully interactive macOS desktop site experience.",
      bullets: [
        "Simulates draggable windows, stacking z-indices, dev terminal triggers, and multi-app sync.",
        "Fully responsive and localized in English and Spanish."
      ]
    }
  ]
} as const;
