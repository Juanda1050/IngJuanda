export const calendarEs = {
  title: "Calendario",
  sidebar: {
    title: "Calendarios",
    work: "Experiencia Laboral",
    education: "Educación",
    projects: "Proyectos",
    listTitle: "Todos los Hitos",
    infoText: "Clic en un evento para ver detalles"
  },
  header: {
    today: "Hoy"
  },
  detailCard: {
    highlights: "Aspectos Destacados",
    dismiss: "Aceptar"
  },
  milestones: [
    {
      id: "education_uanl",
      date: "2023-12-12",
      title: "Graduación Universitaria",
      type: "education",
      location: "Nuevo León, México",
      company: "Facultad de Ingeniería Mecánica y Eléctrica (FIME)",
      description: "Graduado de la carrera de Ingeniería en Tecnología de Software.",
      bullets: [
        "Plan de estudios enfocado en diseño de software y desarrollo full-stack.",
        "Graduado de la Facultad de Ingeniería Mecánica y Eléctrica (FIME)."
      ]
    },
    {
      id: "axsis_join",
      date: "2022-07-07",
      title: "Ingreso a Axsis Tecnología",
      type: "work",
      location: "México",
      company: "Axsis Tecnología S.A. de C.V.",
      description: "Inicio de labores como Ingeniero de Software Fullstack.",
      bullets: [
        "Diseñé e implementé microservicios en .NET aplicando principios de Domain-Driven Design (DDD).",
        "Implementé MobX en aplicaciones React para mejorar la gestión de estado.",
        "Desarrollé APIs e integraciones empresariales para automatizar procesos de facturación.",
        "Refactoricé aplicaciones frontend monolíticas hacia arquitecturas modulares bajo principios de Clean Code."
      ]
    },
    {
      id: "axosnet_join",
      date: "2024-03-04",
      title: "Ingreso a Axosnet",
      type: "work",
      location: "México",
      company: "Axosnet",
      description: "Contratado como Ingeniero de Software Fullstack.",
      bullets: [
        "Lideré el rediseño integral de Axosmoney, participando en la definición funcional, diseño UX/UI en Figma y desarrollo.",
        "Diseñé y mantengo Axosnet Components, una librería corporativa de componentes reutilizables.",
        "Participé en la modernización tecnológica de aplicaciones mediante la adopción de React 18 y .NET 8."
      ]
    },
    {
      id: "portfolio_launch",
      date: "2026-06-06",
      title: "Lanzamiento de Portafolio macOS",
      type: "project",
      location: "Colima, México",
      company: "Juanda",
      description: "Publicación de esta experiencia interactiva simulando un escritorio de macOS.",
      bullets: [
        "Simulación de ventanas arrastrables, apilamiento de z-indices y terminal.",
        "Totalmente responsivo y localizado en inglés y español."
      ]
    }
  ]
} as const;
