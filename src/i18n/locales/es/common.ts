export const esCommon = {
  app: {
    title: 'Portafolio',
    subtitle: 'Senior Frontend Architect',
    status: 'Listo',
    branch: 'main',
    language: 'Idioma',
    theme: 'Tema',
    commandPlaceholder: 'Escribe un comando o busca un archivo...',
    openCommand: 'Abrir command palette',
    explorer: 'Explorador',
    portfolioFiles: 'Archivos del portafolio',
    terminal: 'Terminal',
  },
  files: {
    about: 'about.tsx',
    experience: 'experience.ts',
    projects: 'projects.json',
    skills: 'skills.tailwind.ts',
    contact: 'README.md',
  },
  actions: {
    close: 'Cerrar',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
  },
  sections: {
    about: {
      title: 'Sobre mí',
      role: 'Construyendo sistemas frontend escalables con enfoque de producto.',
      summary:
        'Arquitecto frontend con experiencia creando design systems, interfaces de alto rendimiento y bases de código mantenibles para productos enterprise.',
    },
    experience: {
      title: 'Experiencia',
      items: [
        {
          role: 'Senior Frontend Architect',
          company: 'Tech Studio',
          period: '2022 - Actualidad',
          bullets: [
            'Lideré la arquitectura de una plataforma frontend multi-producto.',
            'Definí estándares de componentes, estrategia de testing y quality gates en CI.',
            'Mejoré Core Web Vitals y reduje bundle size en 28%.',
          ],
        },
        {
          role: 'Frontend Engineer',
          company: 'Digital Labs',
          period: '2019 - 2022',
          bullets: [
            'Construí aplicaciones modulares en React con TypeScript.',
            'Colaboré con diseño y backend en ciclos ágiles de entrega.',
          ],
        },
      ],
    },
    projects: {
      title: 'Proyectos',
      items: [
        {
          name: 'Design System Enterprise',
          description: 'Plataforma UI reutilizable con tokens, documentación y accesibilidad.',
          stack: ['React', 'TypeScript', 'Storybook', 'TailwindCSS'],
          href: 'https://github.com',
        },
        {
          name: 'Analytics Dashboard',
          description: 'Dashboard en tiempo real con gráficas avanzadas y módulos por rol.',
          stack: ['React', 'Zustand', 'Framer Motion'],
          href: 'https://github.com',
        },
      ],
    },
    skills: {
      title: 'Habilidades',
      groups: {
        frontend: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Framer Motion'],
        architecture: ['SOLID', 'Frontend Modular', 'Design Systems', 'DX', 'Performance'],
        tooling: ['Vite', 'ESLint', 'CI/CD', 'Vitest', 'GitHub Actions'],
      },
    },
    contact: {
      title: 'Contacto',
      items: [
        { label: 'Email', value: 'hello@portfolio.dev', href: 'mailto:hello@portfolio.dev' },
        { label: 'LinkedIn', value: 'linkedin.com/in/portfolio', href: 'https://linkedin.com' },
        { label: 'GitHub', value: 'github.com/portfolio', href: 'https://github.com' },
      ],
    },
  },
} as const
