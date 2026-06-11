export const sectionsEs = {
  about: {
    title: "Sobre mí",
    focus:
      "Fullstack Developer enfocado en migraciones, optimización de sistemas y soluciones web escalables.",
    aboutMe:
      "Soy Fullstack Developer con más de 4 años de experiencia en modernización tecnológica y desarrollo web. Me especializo en liderar proyectos de migración, optimización de sistemas y creación de soluciones innovadoras bajo metodologías Scrum. Me caracterizo por un enfoque proactivo, colaborativo y orientado a la mejora continua.",
  },
  experience: {
    title: "Experiencia",
    items: [
      {
        role: "Senior Frontend Developer",
        company: "Tech Studio",
        period: "2022 - Actualidad",
        bullets: [
          "Lideré la arquitectura de una plataforma frontend multi-producto.",
          "Definí estándares de componentes, estrategia de testing y quality gates en CI.",
          "Mejoré Core Web Vitals y reduje bundle size en 28%.",
        ],
      },
      {
        role: "Frontend Engineer",
        company: "Digital Labs",
        period: "2019 - 2022",
        bullets: [
          "Construí aplicaciones modulares en React con TypeScript.",
          "Colaboré con diseño y backend en ciclos ágiles de entrega.",
        ],
      },
    ],
  },
  projects: {
    title: "Proyectos",
    items: [
      {
        name: "Design System Enterprise",
        description:
          "Plataforma UI reutilizable con tokens, documentación y accesibilidad.",
        stack: ["React", "TypeScript", "Storybook", "TailwindCSS"],
        href: "https://github.com/Juanda1050",
      },
      {
        name: "Analytics Dashboard",
        description:
          "Dashboard en tiempo real con gráficas avanzadas y módulos por rol.",
        stack: ["React", "Zustand", "Framer Motion"],
        href: "https://github.com/Juanda1050",
      },
    ],
  },
  skills: {
    title: "Habilidades",
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
        "Frontend Modular",
        "Design Systems",
        "DX",
        "Performance",
      ],
      tooling: ["Vite", "ESLint", "CI/CD", "Vitest", "GitHub Actions"],
    },
  },
  contact: {
    title: "Contacto",
    items: [
      {
        label: "Email",
        value: "danielalejandre1050@gmail.com",
        href: "mailto:danielalejandre1050@gmail.com",
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/daniel-alejandre/",
        href: "https://www.linkedin.com/in/daniel-alejandre-3331951b5/",
      },
      {
        label: "GitHub",
        value: "github.com/Juanda1050",
        href: "https://github.com/Juanda1050",
      },
    ],
  },
} as const;
