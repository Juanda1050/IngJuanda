import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { type ContactItem, type ExperienceItem, type ProjectItem, type SectionId } from '@/types/portfolio'

interface EditorContentProps {
  section: SectionId
}

const codeColor = {
  base: 'text-zinc-700 dark:text-[#d4d4d4]',
  keyword: 'text-purple-600 dark:text-[#c586c0]',
  property: 'text-blue-600 dark:text-[#9cdcfe]',
  string: 'text-amber-700 dark:text-[#ce9178]',
  value: 'text-teal-600 dark:text-[#4ec9b0]',
} as const

function toCodeString(value: string) {
  return JSON.stringify(value)
}

function CodeLine({ indent = 0, children }: { indent?: number; children: React.ReactNode }) {
  return (
    <p
      className={codeColor.base + ' whitespace-pre-wrap break-words'}
      style={{ paddingLeft: `${indent * 1.25}rem` }}
    >
      {children}
    </p>
  )
}

function CodeWrapper({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3 font-mono text-[12.5px] leading-6 md:px-5 md:py-4">{children}</div>
}

function AboutSection() {
  const { t } = useTranslation('common')
  const role = t('sections.about.focus')
  const summary = t('sections.about.aboutMe')

  return (
    <CodeWrapper>
      <CodeLine>
        <span className={codeColor.keyword}>const</span> <span className={codeColor.value}>aboutMe</span> = {'{'}
      </CodeLine>
      <CodeLine indent={1}>
        <span className={codeColor.property}>name</span>: <span className={codeColor.string}>{toCodeString('Juan Daniel González Alejandre')}</span>,
      </CodeLine>
      <CodeLine indent={1}>
        <span className={codeColor.property}>focus</span>: <span className={codeColor.string}>{toCodeString(role)}</span>,
      </CodeLine>
      <CodeLine indent={1}>
        <span className={codeColor.property}>about_me</span>: <span className={codeColor.string}>{toCodeString(summary)}</span>,
      </CodeLine>
      <CodeLine>{'};'}</CodeLine>
    </CodeWrapper>
  )
}

function ExperienceSection() {
  const { t } = useTranslation('common')
  const items = t('sections.experience.items', { returnObjects: true }) as ExperienceItem[]

  return (
    <CodeWrapper>
      <CodeLine>
        <span className={codeColor.keyword}>const</span> <span className={codeColor.value}>experience</span> = [
      </CodeLine>
      {items.map((item, itemIndex) => (
        <div key={`${item.role}-${item.company}`}>
          <CodeLine indent={1}>{'{'}</CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>role</span>: <span className={codeColor.string}>{toCodeString(item.role)}</span>,
          </CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>company</span>: <span className={codeColor.string}>{toCodeString(item.company)}</span>,
          </CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>period</span>: <span className={codeColor.string}>{toCodeString(item.period)}</span>,
          </CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>bullets</span>: [
          </CodeLine>
          {item.bullets.map((bullet, bulletIndex) => (
            <CodeLine key={bullet} indent={3}>
              <span className={codeColor.string}>{toCodeString(bullet)}</span>
              {bulletIndex < item.bullets.length - 1 ? ',' : ''}
            </CodeLine>
          ))}
          <CodeLine indent={2}>],</CodeLine>
          <CodeLine indent={1}>
            {'}'}
            {itemIndex < items.length - 1 ? ',' : ''}
          </CodeLine>
        </div>
      ))}
      <CodeLine>];</CodeLine>
    </CodeWrapper>
  )
}

function ProjectsSection() {
  const { t } = useTranslation('common')
  const items = t('sections.projects.items', { returnObjects: true }) as ProjectItem[]

  return (
    <CodeWrapper>
      <CodeLine>
        <span className={codeColor.keyword}>const</span> <span className={codeColor.value}>projects</span> = [
      </CodeLine>
      {items.map((project, projectIndex) => (
        <div key={project.name}>
          <CodeLine indent={1}>{'{'}</CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>name</span>: <span className={codeColor.string}>{toCodeString(project.name)}</span>,
          </CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>description</span>: <span className={codeColor.string}>{toCodeString(project.description)}</span>,
          </CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>stack</span>: [
          </CodeLine>
          {project.stack.map((tech, techIndex) => (
            <CodeLine key={tech} indent={3}>
              <span className={codeColor.string}>{toCodeString(tech)}</span>
              {techIndex < project.stack.length - 1 ? ',' : ''}
            </CodeLine>
          ))}
          <CodeLine indent={2}>],</CodeLine>
          {project.href && (
            <CodeLine indent={2}>
              <span className={codeColor.property}>href</span>: <span className={codeColor.string}>{toCodeString(project.href)}</span>,
            </CodeLine>
          )}
          <CodeLine indent={1}>
            {'}'}
            {projectIndex < items.length - 1 ? ',' : ''}
          </CodeLine>
        </div>
      ))}
      <CodeLine>];</CodeLine>
    </CodeWrapper>
  )
}

function SkillsSection() {
  const { t } = useTranslation('common')
  const groups = t('sections.skills.groups', { returnObjects: true }) as Record<string, string[]>

  return (
    <CodeWrapper>
      <CodeLine>
        <span className={codeColor.keyword}>const</span> <span className={codeColor.value}>skills</span> = {'{'}
      </CodeLine>
      {Object.entries(groups).map(([group, values], groupIndex, arr) => (
        <div key={group}>
          <CodeLine indent={1}>
            <span className={codeColor.property}>{group}</span>: [
          </CodeLine>
          {values.map((value, valueIndex) => (
            <CodeLine key={value} indent={2}>
              <span className={codeColor.string}>{toCodeString(value)}</span>
              {valueIndex < values.length - 1 ? ',' : ''}
            </CodeLine>
          ))}
          <CodeLine indent={1}>
            ]
            {groupIndex < arr.length - 1 ? ',' : ''}
          </CodeLine>
        </div>
      ))}
      <CodeLine>{'};'}</CodeLine>
    </CodeWrapper>
  )
}

function ContactSection() {
  const { t } = useTranslation('common')
  const items = t('sections.contact.items', { returnObjects: true }) as ContactItem[]

  return (
    <CodeWrapper>
      <CodeLine>
        <span className={codeColor.keyword}>const</span> <span className={codeColor.value}>contact</span> = [
      </CodeLine>
      {items.map((item, itemIndex) => (
        <div key={item.label}>
          <CodeLine indent={1}>{'{'}</CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>label</span>: <span className={codeColor.string}>{toCodeString(item.label)}</span>,
          </CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>value</span>: <span className={codeColor.string}>{toCodeString(item.value)}</span>,
          </CodeLine>
          <CodeLine indent={2}>
            <span className={codeColor.property}>href</span>: <span className={codeColor.string}>{toCodeString(item.href)}</span>,
          </CodeLine>
          <CodeLine indent={1}>
            {'}'}
            {itemIndex < items.length - 1 ? ',' : ''}
          </CodeLine>
        </div>
      ))}
      <CodeLine>];</CodeLine>
    </CodeWrapper>
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
