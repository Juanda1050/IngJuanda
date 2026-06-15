export const safariEn = {
  title: "Safari",
  browserPlaceholder: "Search or enter website name",
  cv: {
    name: "Juan Daniel González Alejandre",
    role: "Software Engineer",
    location: "Mexico",
    focus: "Fullstack Software Engineer with over 4 years of experience building digital products and enterprise applications.",
    aboutTitle: "About me",
    aboutText: "I'm a Full Stack Software Engineer with over 4 years of experience building digital products and enterprise applications using React, Next.js, and .NET technologies. Experienced in technology modernization initiatives, scalable software architecture design, and technical leadership of strategic projects. Proven ability to collaborate with cross-functional teams in agile environments to deliver high-quality software solutions aligned with business objectives.",
    
    experienceTitle: "Professional Experience",
    experienceItems: [
      {
        role: "Software Engineer",
        company: "Axosnet",
        period: "Mar 2024 - Present",
        bullets: [
          "Led the complete redesign of Axosmoney, participating in product definition, UX/UI design in Figma, and development coordination.",
          "Designed and maintain Axosnet Components, a corporate component library that standardizes user interfaces and accelerates development across teams.",
          "Contributed to the modernization of enterprise applications through the adoption of React 18 and .NET 8."
        ]
      },
      {
        role: "Software Engineer",
        company: "Axsis Tecnología S.A. de C.V.",
        period: "Jul 2022 - Mar 2024",
        bullets: [
          "Designed and implemented .NET microservices following Domain Driven Design (DDD) principles.",
          "Implemented MobX in React applications to improve state management and frontend architecture.",
          "Refactored monolithic frontend applications into modular architectures following Clean Code principles."
        ]
      }
    ],

    projectsTitle: "Featured Projects",
    projectsItems: [
      {
        name: "Axosmoney",
        description: "A comprehensive application for uploading receipts, managing suppliers, invoicing, integrating third-party services with SAP Concur, and a rewards program with Amazon Business.",
        stack: ["Next.js", "TypeScript", ".NET", "Figma"],
      },
      {
        name: "Axosnet Components",
        description: "Reusable corporate UI library created to standardize interface design and speed up cross-team development.",
        stack: ["React 19", "TypeScript", "Storybook", "TailwindCSS", "shadcn", "Figma"],
      }
    ],

    skillsTitle: "Technical Skills",
    skillsGroups: {
      technologies: "Tech Stack",
      architecture: "Architecture",
      tools: "Tools & Cloud",
      methodologies: "Methodologies",
      languages: "Languages"
    },
    skillsData: {
      technologies: ["React.js / Next.js", "Javascript / Typescript", "Node.js", "C# (.NET / Entity Framework)", "SQL", "UX / UI Design"],
      architecture: ["Domain-Driven Design (DDD)", "Microservices", "REST APIs"],
      tools: ["AWS", "Git", "Figma", "Open AI"],
      methodologies: ["Scrum", "Agile"],
      languages: ["English (Advanced)", "Spanish (Native)"]
    },

    contactTitle: "Contact & Links",
    contactText: "If you'd like to get in touch to discuss potential projects or roles, feel free to drop me a line:"
  }
} as const;
