import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, RotateCw, Globe, ArrowUpRight, Mail } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { Badge } from '@/shared/ui'
import { type ExperienceItem, type ProjectItem, type ContactItem } from '@/types/portfolio'
import { formatWithAppleEmojis } from '@/components/apple-emoji'

export function SafariWindow() {
  const { t } = useTranslation('common')

  const role = t('sections.about.focus')
  const summary = t('sections.about.aboutMe')
  const experienceItems = t('sections.experience.items', { returnObjects: true }) as ExperienceItem[]
  const projectItems = t('sections.projects.items', { returnObjects: true }) as ProjectItem[]
  const skillsGroups = t('sections.skills.groups', { returnObjects: true }) as Record<string, string[]>
  const contactItems = t('sections.contact.items', { returnObjects: true }) as ContactItem[]

  // Icon mapper for contact links
  const getContactIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'email':
        return <Mail className="size-4" />
      case 'linkedin':
        return <FaLinkedin className="size-4" />
      case 'github':
        return <FaGithub className="size-4" />
      default:
        return <Globe className="size-4" />
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#f6f6f6] dark:bg-[#1a1a1a] text-[#333] dark:text-[#f3f3f3] font-sans">
      {/* Mock Browser Header (Address bar and Navigation controls) */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-black/10 dark:border-white/10 bg-[#ededed] dark:bg-[#2c2c2c] px-4 gap-4">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button className="flex size-7 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40" disabled>
            <ChevronLeft className="size-4 text-muted-foreground" />
          </button>
          <button className="flex size-7 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40" disabled>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
          <button className="flex size-7 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/5">
            <RotateCw className="size-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Address Input Bar */}
        <div className="flex-1 max-w-xl">
          <div className="flex h-7 w-full items-center justify-center gap-1.5 rounded-lg border border-black/5 bg-white/70 px-3 py-1 text-center text-xs shadow-inner dark:border-white/5 dark:bg-black/40">
            <Globe className="size-3 text-emerald-500" />
            <span className="text-muted-foreground select-all font-mono">localhost:5174/cv</span>
          </div>
        </div>

        {/* Right spacing matching navigation arrows width */}
        <div className="w-20 hidden md:block" />
      </div>

      {/* Rendered Web Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-text">
        {/* Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Juan Daniel González Alejandre
              </h1>
              <p className="text-lg font-medium text-blue-100">
                {formatWithAppleEmojis(t('app.subtitle'))}
              </p>
              <p className="text-sm max-w-xl text-blue-50/90 leading-relaxed pt-2">
                {formatWithAppleEmojis(role)}
              </p>
            </div>
            <div className="shrink-0 flex items-center justify-center">
              <img 
                src="/profile.jpg" 
                alt="Juan Daniel" 
                className="size-24 rounded-full border-4 border-white/20 object-cover shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Experience, Projects) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Me Details */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold border-b border-black/10 dark:border-white/10 pb-1.5 text-blue-600 dark:text-blue-400">
                {t('sections.about.title')}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {formatWithAppleEmojis(summary)}
              </p>
            </section>

            {/* Work Experience */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold border-b border-black/10 dark:border-white/10 pb-1.5 text-blue-600 dark:text-blue-400">
                {t('sections.experience.title')}
              </h2>
              <div className="space-y-6 relative border-l border-blue-500/20 pl-4 ml-2">
                {experienceItems.map((item) => (
                  <div key={`${item.role}-${item.company}`} className="relative space-y-1">
                    {/* Circle Bullet on Timeline */}
                    <div className="absolute -left-[21px] top-1.5 size-3 rounded-full border-2 border-blue-500 bg-background" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-bold text-sm">{formatWithAppleEmojis(item.role)}</h3>
                      <Badge variant="secondary" className="w-fit text-[10px] font-semibold">
                        {formatWithAppleEmojis(item.company)} | {formatWithAppleEmojis(item.period)}
                      </Badge>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground pl-1">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="leading-relaxed">{formatWithAppleEmojis(bullet)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects Grid */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold border-b border-black/10 dark:border-white/10 pb-1.5 text-blue-600 dark:text-blue-400">
                {t('sections.projects.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectItems.map((project) => (
                  <div key={project.name} className="flex flex-col rounded-xl border border-black/5 bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:border-white/5 dark:bg-black/20 justify-between">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm flex items-center justify-between gap-2">
                        {formatWithAppleEmojis(project.name)}
                        {project.href && (
                          <a href={project.href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                            <ArrowUpRight className="size-4" />
                          </a>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {formatWithAppleEmojis(project.description)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.stack.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-[9px] px-1 py-0 border-black/10 dark:border-white/10">
                          {formatWithAppleEmojis(tech)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Content (Skills, Contact) */}
          <div className="space-y-8">
            {/* Skills Tags */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold border-b border-black/10 dark:border-white/10 pb-1.5 text-blue-600 dark:text-blue-400">
                {t('sections.skills.title')}
              </h2>
              <div className="space-y-4">
                {Object.entries(skillsGroups).map(([group, values]) => (
                  <div key={group} className="space-y-1.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {formatWithAppleEmojis(group)}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {values.map((skill) => (
                        <Badge key={skill} className="text-xs bg-blue-600/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300 hover:bg-blue-600/15">
                          {formatWithAppleEmojis(skill)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Badges */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold border-b border-black/10 dark:border-white/10 pb-1.5 text-blue-600 dark:text-blue-400">
                {t('sections.contact.title')}
              </h2>
              <div className="flex flex-col gap-2">
                {contactItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-lg border border-black/5 bg-white px-3 py-2 text-xs font-medium shadow-sm transition-all hover:bg-black/5 hover:translate-x-0.5 dark:border-white/5 dark:bg-black/20 dark:hover:bg-white/5"
                  >
                    <span className="text-blue-500 dark:text-blue-400 shrink-0">
                      {getContactIcon(item.label)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
                      <p className="font-semibold truncate">{formatWithAppleEmojis(item.value)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
