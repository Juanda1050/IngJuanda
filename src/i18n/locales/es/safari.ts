export const safariEs = {
  title: "Safari",
  browserPlaceholder: "Buscar o introducir sitio web",
  cv: {
    name: "Juan Daniel González Alejandre",
    role: "Software Engineer",
    location: "México",
    focus:
      "Ingeniero de Software Fullstack con más de 4 años de experiencia desarrollando productos digitales y aplicaciones empresariales.",
    aboutTitle: "Sobre mí",
    aboutText:
      "Soy Ingeniero de Software Fullstack con más de 4 años de experiencia desarrollando productos digitales y aplicaciones empresariales utilizando React, Next.js y .NET. He participado en iniciativas de modernización tecnológica, diseño de arquitecturas escalables y liderazgo técnico de proyectos estratégicos, colaborando con equipos multidisciplinarios bajo metodologías ágiles.",

    experienceTitle: "Experiencia Laboral",
    experienceItems: [
      {
        role: "Software Engineer",
        company: "Axosnet",
        period: "Mar 2024 - Actualidad",
        bullets: [
          "Lideré el rediseño integral de Axosmoney, participando en la definición funcional, diseño UX/UI en Figma y coordinación de su desarrollo.",
          "Diseñé y mantengo Axosnet Components, una librería corporativa de componentes reutilizables que permite estandarizar interfaces y acelerar el desarrollo entre equipos.",
          "Participé en la modernización tecnológica de aplicaciones empresariales mediante la adopción de React 18 y .NET 8.",
        ],
      },
      {
        role: "Software Engineer",
        company: "Axsis Tecnología S.A. de C.V.",
        period: "Jul 2022 - Mar 2024",
        bullets: [
          "Diseñé e implementé microservicios en .NET aplicando principios de Domain-Driven Design (DDD).",
          "Implementé MobX en aplicaciones React para mejorar la gestión de estado y la organización del frontend.",
          "Refactoricé aplicaciones frontend monolíticas hacia arquitecturas modulares basadas en principios de Clean Code.",
        ],
      },
    ],

    projectsTitle: "Proyectos y Código",
    projectsItems: [
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

    skillsTitle: "Habilidades Técnicas",
    skillsGroups: {
      technologies: "Tecnologías",
      architecture: "Arquitectura",
      tools: "Herramientas",
      methodologies: "Metodologías",
      languages: "Idiomas",
    },
    skillsData: {
      technologies: [
        "React.js / Next.js",
        "Javascript / Typescript",
        "Node.js",
        "C# (.NET / Entity Framework)",
        "SQL",
        "Diseño UX / UI",
      ],
      architecture: [
        "Domain-Driven Design (DDD)",
        "Microservicios",
        "APIs REST",
      ],
      tools: [
        "AWS",
        "Git",
        "Figma",
        "Open AI",
      ],
      methodologies: [
        "Scrum",
        "Agile",
      ],
      languages: [
        "Inglés (Avanzado)",
        "Español (Nativo)",
      ],
    },

    contactTitle: "Contacto & Enlaces",
    contactText:
      "Siempre estoy abierto a nuevas oportunidades. Si deseas platicar sobre posibles colaboraciones, proyectos o vacantes, estaré encantado de leerte:",
  },
} as const;
