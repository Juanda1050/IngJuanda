export const sectionsEn = {
  about: {
    title: "About",
    focus:
      "Fullstack Developer focused on migration, optimization, and scalable web solutions.",
    aboutMe:
      "I'm a Fullstack Developer with over 4 years of experience in tech modernization and web development. I am specialized in leading migration projects, system optimization, and building innovative solutions under scrum methodologies. Known for a proactive, collaborative, and improvement-driven approach.",
  },
  experience: {
    title: "Experience",
    items: [
      {
        role: "Senior Frontend Developer",
        company: "Tech Studio",
        period: "2022 - Present",
        bullets: [
          "Led architecture for multi-product frontend platform.",
          "Defined component standards, testing strategy, and CI quality gates.",
          "Improved Core Web Vitals and reduced bundle size by 28%.",
        ],
      },
      {
        role: "Frontend Engineer",
        company: "Digital Labs",
        period: "2019 - 2022",
        bullets: [
          "Built modular React applications with TypeScript.",
          "Collaborated with design and backend teams in agile delivery cycles.",
        ],
      },
    ],
  },
  projects: {
    title: "Projects",
    items: [
      {
        name: "Design System Enterprise",
        description:
          "Reusable UI platform with tokens, documentation and accessibility.",
        stack: ["React", "TypeScript", "Storybook", "TailwindCSS"],
        href: "https://github.com/Juanda1050",
      },
      {
        name: "Analytics Dashboard",
        description:
          "Real-time dashboard with advanced charts and role-based modules.",
        stack: ["React", "Zustand", "Framer Motion"],
        href: "https://github.com/Juanda1050",
      },
    ],
  },
  skills: {
    title: "Skills",
    groups: {
      frontend: [
        "React",
        "TypeScript",
        "Next.js",
        "TailwindCSS",
        "Framer Motion",
      ],
      architecture: [
        "SOLID",
        "Modular Frontend",
        "Design Systems",
        "DX",
        "Performance",
      ],
      tooling: ["Vite", "ESLint", "CI/CD", "Vitest", "GitHub Actions"],
    },
  },
  contact: {
    title: "Contact",
    items: [
      {
        label: "Email",
        value: "danielalejandre1050@gmail.com",
        href: "mailto:danielalejandre1050@gmail.com",
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/danielalejandre1050",
        href: "https://linkedin.com/in/danielalejandre1050",
      },
      {
        label: "GitHub",
        value: "github.com/Juanda1050",
        href: "https://github.com/Juanda1050",
      },
    ],
  },
} as const;
