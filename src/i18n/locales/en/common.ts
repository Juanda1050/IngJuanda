export const enCommon = {
  app: {
    title: 'Portfolio',
    subtitle: 'Senior Frontend Developer',
    status: 'Ready',
    branch: 'main',
    language: 'Language',
    theme: 'Theme',
    commandPlaceholder: 'Type a command or search file...',
    openCommand: 'Open command palette',
    explorer: 'Explorer',
    portfolioFiles: 'Portfolio Files',
    terminal: 'Terminal',
  },
  files: {
    about: 'about.tsx',
    experience: 'experience.ts',
    projects: 'projects.json',
    skills: 'skills.ts',
    contact: 'README.md',
  },
  actions: {
    close: 'Close',
    minimize: 'Minimize',
    maximize: 'Maximize',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  sections: {
    about: {
      title: 'About',
      role: 'Building scalable frontend systems with product focus.',
      summary:
        "I'm a Fullstack Developer with over 4 years of experience in tech modernization and web development. I am specialized in leading migration projects, system optimization, and building innovative solutions under scrum methodologies. Known for a proactive, collaborative, and improvement-driven approach.",
    },
    experience: {
      title: 'Experience',
      items: [
        {
          role: 'Senior Frontend Developer',
          company: 'Tech Studio',
          period: '2022 - Present',
          bullets: [
            'Led architecture for multi-product frontend platform.',
            'Defined component standards, testing strategy, and CI quality gates.',
            'Improved Core Web Vitals and reduced bundle size by 28%.',
          ],
        },
        {
          role: 'Frontend Engineer',
          company: 'Digital Labs',
          period: '2019 - 2022',
          bullets: [
            'Built modular React applications with TypeScript.',
            'Collaborated with design and backend teams in agile delivery cycles.',
          ],
        },
      ],
    },
    projects: {
      title: 'Projects',
      items: [
        {
          name: 'Design System Enterprise',
          description: 'Reusable UI platform with tokens, documentation and accessibility.',
          stack: ['React', 'TypeScript', 'Storybook', 'TailwindCSS'],
          href: 'https://github.com',
        },
        {
          name: 'Analytics Dashboard',
          description: 'Real-time dashboard with advanced charts and role-based modules.',
          stack: ['React', 'Zustand', 'Framer Motion'],
          href: 'https://github.com',
        },
      ],
    },
    skills: {
      title: 'Skills',
      groups: {
        frontend: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Framer Motion'],
        architecture: ['SOLID', 'Modular Frontend', 'Design Systems', 'DX', 'Performance'],
        tooling: ['Vite', 'ESLint', 'CI/CD', 'Vitest', 'GitHub Actions'],
      },
    },
    contact: {
      title: 'Contact',
      items: [
        { label: 'Email', value: 'hello@portfolio.dev', href: 'mailto:hello@portfolio.dev' },
        { label: 'LinkedIn', value: 'linkedin.com/in/portfolio', href: 'https://linkedin.com' },
        { label: 'GitHub', value: 'github.com/portfolio', href: 'https://github.com' },
      ],
    },
  },
} as const
