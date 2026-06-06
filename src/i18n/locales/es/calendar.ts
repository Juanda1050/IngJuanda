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
      id: "graduation",
      date: "2018-12-10",
      title: "Graduación Universitaria",
      type: "education",
      location: "Colima, México",
      company: "Universidad de Colima",
      description: "Graduado como Ingeniero en Sistemas Computacionales.",
      bullets: [
        "Especializado en ingeniería de software y desarrollo web.",
        "Reconocimiento a la excelencia académica en proyectos terminales."
      ]
    },
    {
      id: "digital_labs_join",
      date: "2019-01-15",
      title: "Ingreso a Digital Labs",
      type: "work",
      location: "Guadalajara, México",
      company: "Digital Labs",
      description: "Inicio de labores como Frontend Engineer en desarrollo de productos web.",
      bullets: [
        "Construcción de aplicaciones dinámicas en React y TypeScript.",
        "Colaboración con equipos de diseño y backend en ciclos Scrum."
      ]
    },
    {
      id: "legacy_migration_lead",
      date: "2021-10-20",
      title: "Líder de Migración Legacy",
      type: "work",
      location: "Guadalajara, México",
      company: "Digital Labs",
      description: "Dirección del refactoring y migración de sistemas legacy críticos a arquitectura React SPA.",
      bullets: [
        "Mejora de tiempos de carga e indicadores clave de rendimiento en un 35%.",
        "Implementación de suites de prueba usando Jest y React Testing Library."
      ]
    },
    {
      id: "tech_studio_join",
      date: "2022-03-01",
      title: "Ingreso a Tech Studio",
      type: "work",
      location: "Remoto, México",
      company: "Tech Studio",
      description: "Contratado como Senior Frontend Developer, especializándome en plataformas multi-producto.",
      bullets: [
        "Definición e implementación de arquitectura frontend empresarial.",
        "Configuración de linters, calidad de código y pipelines de CI automatizados."
      ]
    },
    {
      id: "design_system_launch",
      date: "2023-06-15",
      title: "Sistema de Diseño Enterprise",
      type: "project",
      location: "Remoto, México",
      company: "Tech Studio",
      description: "Diseño e implementación de biblioteca de componentes UI empresarial con TailwindCSS y Storybook.",
      bullets: [
        "Utilizado por múltiples equipos de desarrollo, reduciendo time-to-market en 40%.",
        "Cumplimiento de estándares de accesibilidad WCAG y pruebas visuales interactivas."
      ]
    },
    {
      id: "portfolio_launch",
      date: "2026-06-06",
      title: "Lanzamiento de Portafolio macOS",
      type: "project",
      location: "Colima, México",
      company: "IngJuanda Corp",
      description: "Publicación de esta experiencia interactiva simulando un escritorio de macOS.",
      bullets: [
        "Simulación de ventanas arrastrables, apilamiento de z-indices, compilación de terminal y sincronización multi-idioma.",
        "Totalmente responsivo y localizado en inglés y español."
      ]
    }
  ]
} as const;
