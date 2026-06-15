export const calendarEn = {
  title: "Calendar",
  sidebar: {
    title: "Calendars",
    work: "Work Experiences",
    education: "Education",
    projects: "Projects",
    project: "Project",
    listTitle: "All Milestones",
    infoText: "Click any event for details",
  },
  header: {
    today: "Today",
  },
  detailCard: {
    highlights: "Highlights",
    dismiss: "Dismiss",
  },
  milestones: [
    {
      id: "education_uanl",
      date: "2023-12-12",
      title: "University Graduation",
      type: "education",
      location: "Nuevo Leon, Mexico",
      company: "Facultad de Ingeniería Mecánica y Eléctrica (FIME)",
      description:
        "Graduated with a Bachelor of Science in Software Engineering.",
      bullets: [
        "Curriculum focused on software design, algorithms, and full-stack development.",
        "Graduated from the Facultad de Ingeniería Mecánica y Eléctrica (FIME).",
      ],
    },
    {
      id: "axsis_join",
      date: "2022-07-07",
      title: "Joined Axsis Tecnología",
      type: "work",
      location: "Mexico",
      company: "Axsis Tecnología S.A. de C.V.",
      description: "Started working as a Fullstack Software Engineer.",
      bullets: [
        "Designed and implemented .NET microservices following Domain Driven Design (DDD) principles.",
        "Implemented MobX in React applications to improve state management and frontend architecture.",
        "Developed APIs and enterprise integrations to automate invoicing processes.",
        "Refactored monolithic frontend applications into modular architectures following Clean Code principles.",
      ],
    },
    {
      id: "axosnet_join",
      date: "2024-03-04",
      title: "Joined Axosnet",
      type: "work",
      location: "Mexico",
      company: "Axosnet",
      description: "Hired as a Full Stack Software Engineer.",
      bullets: [
        "Led the complete redesign of Axosmoney, participating in product definition, UX/UI design in Figma, and development coordination.",
        "Designed and maintain Axosnet Components, a corporate component library.",
        "Contributed to the modernization of enterprise applications through React 18 and .NET 8.",
      ],
    },
    {
      id: "portfolio_launch",
      date: "2026-06-06",
      title: "Portfolio Launch",
      type: "project",
      location: "Colima, Mexico",
      company: "Juanda",
      description:
        "Published this fully interactive macOS desktop site experience.",
      bullets: [
        "Simulates draggable windows, stacking z-indices, dev terminal, and multi-app sync.",
        "Fully responsive and localized in English and Spanish.",
      ],
    },
  ],
} as const;
