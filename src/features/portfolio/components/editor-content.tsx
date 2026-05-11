import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { type ContactItem, type ExperienceItem, type ProjectItem, type SectionId } from '@/types/portfolio'
import { Badge, Card, CardContent, CardHeader, CardTitle, Separator } from '@/shared/ui'

interface EditorContentProps {
  section: SectionId
}

function AboutSection() {
  const { t } = useTranslation('common')
  return (
    <Card className="border-border/60 bg-background/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{t('sections.about.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>{t('sections.about.role')}</p>
        <p>{t('sections.about.summary')}</p>
      </CardContent>
    </Card>
  )
}

function ExperienceSection() {
  const { t } = useTranslation('common')
  const items = t('sections.experience.items', { returnObjects: true }) as ExperienceItem[]

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={`${item.role}-${item.company}`} className="border-border/60 bg-background/40">
          <CardHeader className="space-y-2">
            <CardTitle className="text-base">{item.role}</CardTitle>
            <div className="text-xs text-muted-foreground">{item.company} • {item.period}</div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-2 pl-5 list-disc">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ProjectsSection() {
  const { t } = useTranslation('common')
  const items = t('sections.projects.items', { returnObjects: true }) as ProjectItem[]

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((project) => (
        <Card key={project.name} className="border-border/60 bg-background/40">
          <CardHeader className="space-y-2">
            <CardTitle className="text-base">{project.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{project.description}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
            <a
              className="text-xs text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
              href={project.href}
              target="_blank"
              rel="noreferrer"
            >
              {project.href}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SkillsSection() {
  const { t } = useTranslation('common')
  const groups = t('sections.skills.groups', { returnObjects: true }) as Record<string, string[]>

  return (
    <Card className="border-border/60 bg-background/40">
      <CardContent className="space-y-4 pt-4">
        {Object.entries(groups).map(([group, values], index) => (
          <div key={group} className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{group}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <Badge key={value} variant="outline">
                  {value}
                </Badge>
              ))}
            </div>
            {index < Object.keys(groups).length - 1 ? <Separator /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ContactSection() {
  const { t } = useTranslation('common')
  const items = t('sections.contact.items', { returnObjects: true }) as ContactItem[]

  return (
    <Card className="border-border/60 bg-background/40">
      <CardHeader>
        <CardTitle>{t('sections.contact.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="flex justify-between rounded-md border border-border/60 bg-background/40 px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>{item.label}</span>
            <span>{item.value}</span>
          </a>
        ))}
      </CardContent>
    </Card>
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
      className="space-y-4"
    >
      <Component />
    </motion.section>
  )
}
