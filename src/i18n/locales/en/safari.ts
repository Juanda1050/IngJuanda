export const safariEn = {
  title: "Safari",
  browserPlaceholder: "Search or enter website name",
  cv: {
    name: "Juan Gonzalez",
    role: "Senior Fullstack Developer",
    location: "Mexico",
    focus: "Fullstack Developer focused on migration, optimization, and scalable web solutions.",
    aboutTitle: "About me",
    aboutText: "I'm a Fullstack Developer with over 4 years of experience in tech modernization and web development. I specialize in leading migration projects, system optimization, and building innovative solutions under scrum methodologies. Known for a proactive, collaborative, and improvement-driven approach.",
    
    experienceTitle: "Professional Experience",
    experienceItems: [
      {
        role: "Senior Frontend Developer",
        company: "Tech Studio",
        period: "2022 - Present",
        bullets: [
          "Led architecture for a multi-product frontend platform.",
          "Defined component standards, testing strategies, and CI/CD quality gates.",
          "Improved Core Web Vitals and reduced bundle size by 28%."
        ]
      },
      {
        role: "Frontend Engineer",
        company: "Digital Labs",
        period: "2019 - 2022",
        bullets: [
          "Built modular React applications with TypeScript.",
          "Collaborated closely with design and backend teams in agile Scrum cycles."
        ]
      }
    ],

    projectsTitle: "Featured Projects",
    projectsItems: [
      {
        name: "Design System Enterprise",
        description: "Reusable UI library with design tokens, interactive documentation, and accessibility compliance.",
        stack: ["React", "TypeScript", "Storybook", "TailwindCSS"],
        href: "https://github.com/Juanda1050"
      },
      {
        name: "Analytics Dashboard",
        description: "Real-time analytics dashboard featuring advanced metrics charts, filters, and role-based views.",
        stack: ["React", "Zustand", "Framer Motion", "Recharts"],
        href: "https://github.com/Juanda1050"
      }
    ],

    skillsTitle: "Technical Skills",
    skillsGroups: {
      frontend: "Frontend Core",
      architecture: "Architecture & Practices",
      tooling: "DevOps & Tools"
    },
    skillsData: {
      frontend: ["React", "TypeScript", "Next.js", "TailwindCSS", "Framer Motion", "Zustand", "Redux"],
      architecture: ["SOLID", "Modular Frontend", "Design Systems", "DX (Developer Experience)", "Performance"],
      tooling: ["Vite", "ESLint", "CI/CD", "Vitest", "GitHub Actions", "Docker", "Git"]
    },

    contactTitle: "Contact & Links",
    contactText: "If you'd like to get in touch to discuss potential projects or roles, feel free to drop me a line:"
  }
} as const;
