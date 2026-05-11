import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { type ContactItem, type ExperienceItem, type ProjectItem, type SectionId } from '@/types/portfolio'

interface EditorContentProps {
  section: SectionId
}

function AboutSection() {
  const { t } = useTranslation('common')
  return (
    <div className="px-5 pb-8 space-y-5 bg-white dark:bg-[#0d0d0d]">
      {/* Profile card */}
      <div className="flex flex-col items-center gap-3 pt-4 pb-4">
        <div
          className="flex size-[72px] items-center justify-center rounded-[22px] text-white text-2xl font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4facfe 0%, #0077cc 100%)' }}
        >
          JF
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold text-foreground dark:text-white">{t('sections.about.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('sections.about.role')}</p>
        </div>
      </div>
      {/* Divider */}
      <div className="h-px bg-border/50" />
      {/* Bio */}
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">{t('sections.about.summary')}</p>
      </div>
    </div>
  )
}

function ExperienceSection() {
  const { t } = useTranslation('common')
  const items = t('sections.experience.items', { returnObjects: true }) as ExperienceItem[]
  return (
    <div className="px-4 pb-8 space-y-4 bg-white dark:bg-[#0d0d0d]">
      <h2 className="pt-4 text-base font-bold text-foreground dark:text-white">{t('sections.experience.title') || 'Experience'}</h2>
      {items.map((item) => (
        <div
          key={`${item.role}-${item.company}`}
          className="rounded-2xl border border-border/40 bg-muted/30 dark:bg-white/5 p-4 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground dark:text-white">{item.role}</p>
              <p className="text-xs text-muted-foreground">{item.company}</p>
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{item.period}</span>
          </div>
          <ul className="space-y-1 pl-3">
            {item.bullets.slice(0, 2).map((bullet) => (
              <li key={bullet} className="text-xs text-muted-foreground list-disc list-inside">{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const PROJECT_ICON_GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
] as const

const MAX_VISIBLE_STACK_ITEMS = 4

function ProjectsSection() {
  const { t } = useTranslation('common')
  const items = t('sections.projects.items', { returnObjects: true }) as ProjectItem[]
  return (
    <div className="px-4 pb-8 space-y-4 bg-white dark:bg-[#0d0d0d]">
      <h2 className="pt-4 text-base font-bold text-foreground dark:text-white">{t('sections.projects.title') || 'Projects'}</h2>
      {items.map((project, i) => (
        <div
          key={project.name}
          className="rounded-2xl border border-border/40 bg-muted/30 dark:bg-white/5 p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white text-sm font-bold shadow"
              style={{ background: PROJECT_ICON_GRADIENTS[i % PROJECT_ICON_GRADIENTS.length] }}
            >
              {project.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground dark:text-white truncate">{project.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, MAX_VISIBLE_STACK_ITEMS).map((tech) => (
              <span key={tech} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SkillsSection() {
  const { t } = useTranslation('common')
  const groups = t('sections.skills.groups', { returnObjects: true }) as Record<string, string[]>
  return (
    <div className="px-4 pb-8 space-y-5 bg-white dark:bg-[#0d0d0d]">
      <h2 className="pt-4 text-base font-bold text-foreground dark:text-white">{t('sections.skills.title') || 'Skills'}</h2>
      {Object.entries(groups).map(([group, values]) => (
        <div key={group} className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{group}</p>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <span
                key={value}
                className="rounded-full border border-border/60 bg-muted/40 dark:bg-white/5 px-3 py-1 text-xs font-medium text-foreground dark:text-white/80"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ContactSection() {
  const { t } = useTranslation('common')
  const items = t('sections.contact.items', { returnObjects: true }) as ContactItem[]
  return (
    <div className="px-4 pb-8 space-y-4 bg-white dark:bg-[#0d0d0d]">
      <h2 className="pt-4 text-base font-bold text-foreground dark:text-white">{t('sections.contact.title')}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-border/40 bg-muted/30 dark:bg-white/5 px-4 py-3 transition-colors hover:bg-muted/50"
          >
            <span className="text-sm font-medium text-foreground dark:text-white">{item.label}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[140px] text-right">{item.value}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

const sectionMap: Record<SectionId, () => ReturnType<typeof AboutSection>> = {
  about: AboutSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  contact: ContactSection,
}

export function EditorContent({ section }: EditorContentProps) {
  const Component = sectionMap[section]
  return (
    <motion.section
      key={section}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <Component />
    </motion.section>
  )
}
