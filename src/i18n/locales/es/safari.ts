export const safariEs = {
  title: "Safari",
  browserPlaceholder: "Buscar o introducir sitio web",
  cv: {
    name: "Juan Gonzalez",
    role: "Senior Fullstack Developer",
    location: "México",
    focus: "Fullstack Developer enfocado en migraciones, optimización de sistemas y soluciones web escalables.",
    aboutTitle: "Sobre mí",
    aboutText: "Soy Fullstack Developer con más de 4 años de experiencia en modernización tecnológica y desarrollo web. Me especializo en liderar proyectos de migración, optimización de sistemas y creación de soluciones innovadoras bajo metodologías Scrum. Me caracterizo por un enfoque proactivo, colaborativo y orientado a la mejora continua.",
    
    experienceTitle: "Experiencia Laboral",
    experienceItems: [
      {
        role: "Senior Frontend Developer",
        company: "Tech Studio",
        period: "2022 - Actualidad",
        bullets: [
          "Lideré la arquitectura de una plataforma frontend multi-producto.",
          "Definí estándares de componentes, estrategia de testing y quality gates en CI/CD.",
          "Mejoré Core Web Vitals y reduje el tamaño del bundle en un 28%."
        ]
      },
      {
        role: "Frontend Engineer",
        company: "Digital Labs",
        period: "2019 - 2022",
        bullets: [
          "Construí aplicaciones modulares en React con TypeScript.",
          "Colaboré de cerca con equipos de diseño y backend en ciclos ágiles de entrega."
        ]
      }
    ],

    projectsTitle: "Proyectos y Código",
    projectsItems: [
      {
        name: "Design System Enterprise",
        description: "Plataforma UI reutilizable con tokens de diseño, documentación interactiva y accesibilidad.",
        stack: ["React", "TypeScript", "Storybook", "TailwindCSS"],
        href: "https://github.com/Juanda1050"
      },
      {
        name: "Analytics Dashboard",
        description: "Dashboard en tiempo real con gráficas avanzadas, análisis de métricas y módulos basados en roles.",
        stack: ["React", "Zustand", "Framer Motion", "Recharts"],
        href: "https://github.com/Juanda1050"
      }
    ],

    skillsTitle: "Habilidades Técnicas",
    skillsGroups: {
      frontend: "Frontend Core",
      architecture: "Arquitectura & Buenas Prácticas",
      tooling: "Herramientas & DevOps"
    },
    skillsData: {
      frontend: ["React", "TypeScript", "Next.js", "TailwindCSS", "Framer Motion", "Zustand", "Redux"],
      architecture: ["SOLID", "Frontend Modular", "Design Systems", "DX (Developer Experience)", "Performance"],
      tooling: ["Vite", "ESLint", "CI/CD", "Vitest", "GitHub Actions", "Docker", "Git"]
    },

    contactTitle: "Contacto & Enlaces",
    contactText: "Si deseas ponerte en contacto para charlar sobre proyectos o vacantes, no dudes en escribirme:"
  }
} as const;
