export const sectionsEs = {
  about: {
    title: "Sobre mí",
    focus:
      "Ingeniero de Software Fullstack con más de 4 años de experiencia desarrollando productos digitales y aplicaciones empresariales.",
    aboutMe:
      "Soy Ingeniero de Software Fullstack con más de 4 años de experiencia desarrollando productos digitales y aplicaciones empresariales utilizando React, Next.js y .NET. He participado en iniciativas de modernización tecnológica, diseño de arquitecturas escalables y liderazgo técnico de proyectos estratégicos, colaborando con equipos multidisciplinarios bajo metodologías ágiles.",
  },
  experience: {
    title: "Experiencia",
    items: [
      {
        role: "Software Engineer",
        company: "Axosnet",
        period: "Mar 2024 - Actualidad",
        bullets: [
          "Lideré el rediseño integral de Axosmoney, participando en la definición funcional, diseño UX/UI en Figma y coordinación de su desarrollo.",
          "Diseñé y mantengo Axosnet Components, una librería corporativa de componentes reutilizables que permite estandarizar interfaces y acelerar el desarrollo entre equipos.",
          "Participé en la modernización tecnológica de aplicaciones empresariales mediante la adopción de React 18 y .NET 8.",
          "Implementé funcionalidades estratégicas para el producto, incluyendo procesos de autorregistro de usuarios y mejoras orientadas a la experiencia de cliente.",
          "Participé en la integración de un sistema corporativo de recompensas conectado con Amazon Business.",
          "Participé en despliegues productivos, soporte de tercer nivel y resolución de incidencias críticas.",
          "Impulsé iniciativas de optimización enfocadas en mantenibilidad, escalabilidad y calidad de código.",
        ],
      },
      {
        role: "Software Engineer",
        company: "Axsis Tecnología S.A. de C.V.",
        period: "Jul 2022 - Mar 2024",
        bullets: [
          "Diseñé e implementé microservicios en .NET aplicando principios de Domain-Driven Design (DDD).",
          "Implementé MobX en aplicaciones React para mejorar la gestión de estado y la organización del frontend.",
          "Desarrollé soluciones automatizadas para generación de reportes corporativos en PDF y Excel utilizando MigraDoc y ClosedXML.",
          "Optimicé procesos de acceso y procesamiento de datos mediante LINQ y BulkExtensions.",
          "Desarrollé APIs e integraciones empresariales para automatizar procesos operativos y de facturación.",
          "Implementé flujos de procesamiento de XML para automatización de información fiscal.",
          "Integré servicios de mensajería y correos transaccionales mediante SendGrid.",
          "Refactoricé aplicaciones frontend monolíticas hacia arquitecturas modulares basadas en principios de Clean Code.",
        ],
      },
    ],
  },
  projects: {
    title: "Proyectos",
    items: [
      {
        name: "Axosmoney",
        description:
          "Aplicación integral para la carga de recibos, la posibilidad de gestionar a tus proveedores, toda su facturación, servicios de terceros con SAP Concur y el programa de rewards con Amazon Business.",
        stack: ["Next.js", "TypeScript", ".NET", "Figma"],
      },
      {
        name: "Axosnet Components",
        description:
          "Biblioteca de componentes UI corporativa y reutilizable construida para estandarizar interfaces y acelerar el desarrollo.",
        stack: ["React 19", "TypeScript", "Storybook", "TailwindCSS", "shadcn", "Figma"],
      },
    ],
  },
  skills: {
    title: "Habilidades",
    groups: {
      tecnologias: [
        "React.js / Next.js",
        "Javascript / Typescript",
        "Node.js",
        "C# (.NET / Entity Framework)",
        "SQL",
        "Diseño UX / UI",
      ],
      arquitectura: [
        "Domain-Driven Design (DDD)",
        "Microservicios",
        "APIs REST",
      ],
      herramientas: ["AWS", "Git", "Figma", "Open AI", "Jira"],
      metodologias: ["Scrum", "Agile"],
      idiomas: ["Inglés (Avanzado)", "Español (Nativo)"],
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
