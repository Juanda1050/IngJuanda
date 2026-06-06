export const notesEs = {
  title: "Notas",
  searchPlaceholder: "Buscar notas...",
  noNotes: "No se encontraron notas",
  syncText: "Sincronizado con iCloud",
  wordsCount: "{{count}} palabras",
  notesData: [
    {
      id: "about_me",
      title: "Sobre Juan Daniel",
      date: "Hoy, 12:00 PM",
      category: "Perfil",
      content: `Soy un Desarrollador Fullstack apasionado con más de 4 años de experiencia liderando migraciones, diseñando sistemas y construyendo interfaces web escalables.

Áreas de enfoque:
• Rendimiento Web (Ajuste de Core Web Vitals)
• Experiencia de Desarrollo (DX) y configuraciones limpias
• Arquitecturas modernas de componentes y diseño UI modular

Pasatiempos e Intereses:
• Programar proyectos personales y explorar nuevas APIs
• Jugar videojuegos y leer ciencia ficción
• Entusiasta del café de especialidad`
    },
    {
      id: "career_path",
      title: "Trayectoria Profesional",
      date: "Ayer, 4:30 PM",
      category: "Experiencia",
      content: `Tech Studio (2022 - Actualidad)
Puesto: Senior Frontend Developer
Logros Clave:
• Liderazgo de arquitectura frontend en portales multi-producto.
• Optimización de Core Web Vitals, reduciendo tamaño del bundle en 28%.
• Estandarización de componentes UI y automatización de pruebas en CI.

Digital Labs (2019 - 2022)
Puesto: Frontend Engineer
Logros Clave:
• Modernización de portales web legacy heredados migrándolos a React y TypeScript.
• Mantenimiento de componentes modulares y estados lógicos robustos.

Educación:
• Ingeniería en Sistemas Computacionales - Universidad de Colima (Graduado en 2018)`
    },
    {
      id: "tech_stack",
      title: "Tecnologías y Configuración",
      date: "3 de junio de 2026",
      category: "Técnico",
      content: `Tecnologías Principales:
• Lenguajes: JavaScript, TypeScript, HTML, CSS
• Frameworks: React, Next.js, Vue.js, Express
• Herramientas: Vite, Webpack, ESLint, Git, Docker, CI/CD
• Librerías: Zustand, Redux, Framer Motion, TailwindCSS
• Pruebas: Vitest, RTL (React Testing Library), Cypress

Entorno de Desarrollo:
• SO: macOS / Windows
• Editor: VS Code con temas personalizados
• Terminal: Zsh con Oh-My-Zsh y prompt Starship
• Hardware: Laptop + Monitor Ultra-wide`
    }
  ]
} as const;
