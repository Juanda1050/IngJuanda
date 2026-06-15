export const sectionsEn = {
  about: {
    title: "About",
    focus:
      "Fullstack Software Engineer with over 4 years of experience building digital products and enterprise applications.",
    aboutMe:
      "I'm a Full Stack Software Engineer with over 4 years of experience building digital products and enterprise applications using React, Next.js, and .NET technologies. Experienced in technology modernization initiatives, scalable software architecture design, and technical leadership of strategic projects. Proven ability to collaborate with cross-functional teams in agile environments to deliver high-quality software solutions aligned with business objectives.",
  },
  experience: {
    title: "Experience",
    items: [
      {
        role: "Software Engineer",
        company: "Axosnet",
        period: "Mar 2024 - Present",
        bullets: [
          "Led the complete redesign of Axosmoney, participating in product definition, UX/UI design in Figma, and development coordination.",
          "Designed and maintain Axosnet Components, a corporate component library that standardizes user interfaces and accelerates development across teams.",
          "Contributed to the modernization of enterprise applications through the adoption of React 18 and .NET 8.",
          "Implemented strategic product features, including user self-registration processes and customer experience improvements.",
          "Participated in the integration of a corporate rewards platform connected with Amazon Business.",
          "Supported production deployments, third-level support operations, and critical incident resolution.",
          "Promoted initiatives focused on maintainability, scalability, and code quality improvements.",
        ],
      },
      {
        role: "Software Engineer",
        company: "Axsis Tecnología S.A. de C.V.",
        period: "Jul 2022 - Mar 2024",
        bullets: [
          "Designed and implemented .NET microservices following Domain Driven Design (DDD) principles.",
          "Implemented MobX in React applications to improve state management and frontend architecture.",
          "Developed automated reporting solutions in PDF and Excel using MigraDoc and ClosedXML.",
          "Optimized data access and processing workflows through LINQ and BulkExtensions.",
          "Developed APIs and enterprise integrations to automate operational and invoicing processes.",
          "Implemented XML processing workflows for tax and fiscal information automation.",
          "Integrated transactional messaging and email services using SendGrid.",
          "Refactored monolithic frontend applications into modular architectures following Clean Code principles.",
        ],
      },
    ],
  },
  projects: {
    title: "Projects",
    items: [
      {
        name: "Axosmoney",
        description:
          "Fintech platform redesigned completely, optimizing self-registration flows and integrating an Amazon Business rewards program.",
        stack: ["React", "TypeScript", ".NET", "Figma"],
        href: "https://www.ing-juanda.com.mx",
      },
      {
        name: "Axosnet Components",
        description:
          "Reusable corporate UI library created to standardize interface design and speed up cross-team development.",
        stack: ["React", "TypeScript", "TailwindCSS", "Figma"],
        href: "https://github.com/Juanda1050",
      },
    ],
  },
  skills: {
    title: "Skills",
    groups: {
      technologies: [
        "React.js / Next.js",
        "Javascript / Typescript",
        "Node.js",
        "C# (.NET / Entity Framework)",
        "SQL",
        "UX / UI Design",
      ],
      architecture: [
        "Domain-Driven Design (DDD)",
        "Microservices",
        "REST APIs",
      ],
      tools: ["AWS", "Git", "Figma", "Open AI"],
      methodologies: ["Scrum", "Agile"],
      languages: ["English (Advanced)", "Spanish (Native)"],
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
