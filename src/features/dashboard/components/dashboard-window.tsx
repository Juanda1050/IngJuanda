import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'
import { 
  Mail, 
  MapPin, 
  Briefcase, 
  FileText, 
  Code2,
  Sparkles,
  ArrowRight,
  Award,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  Users,
  MonitorSmartphone,
  Database,
  Workflow,
  Compass,
  Shield
} from 'lucide-react'
import { FaReact, FaNodeJs } from 'react-icons/fa6'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiTypescript, SiFigma, SiDotnet } from 'react-icons/si'
import { Card, CardContent } from '@/shared/ui'

interface SoftSkill {
  name: string
  description: string
  icon: React.ReactNode
}

export function DashboardWindow() {
  const { t } = useTranslation('common')
  const openApp = useUiStore((state) => state.openApp)
  const closeApp = useUiStore((state) => state.closeApp)
  const setPreviewPdfUrl = useUiStore((state) => state.setPreviewPdfUrl)
  
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)

  const softSkills: SoftSkill[] = [
    { 
      name: t('dashboard.skillCriticalThinking'), 
      description: t('dashboard.skillCriticalThinkingDesc'), 
      icon: <Compass className="size-5" /> 
    },
    { 
      name: t('dashboard.skillProblemSolving'), 
      description: t('dashboard.skillProblemSolvingDesc'), 
      icon: <Lightbulb className="size-5" /> 
    },
    { 
      name: t('dashboard.skillAdaptability'), 
      description: t('dashboard.skillAdaptabilityDesc'), 
      icon: <TrendingUp className="size-5" /> 
    },
    { 
      name: t('dashboard.skillCommunication'), 
      description: t('dashboard.skillCommunicationDesc'), 
      icon: <MessageSquare className="size-5" /> 
    },
    { 
      name: t('dashboard.skillTeamwork'), 
      description: t('dashboard.skillTeamworkDesc'), 
      icon: <Users className="size-5" /> 
    },
    { 
      name: t('dashboard.skillLeadership'), 
      description: t('dashboard.skillLeadershipDesc'), 
      icon: <Award className="size-5" /> 
    },
    { 
      name: t('dashboard.skillCreativity'), 
      description: t('dashboard.skillCreativityDesc'), 
      icon: <Sparkles className="size-5" /> 
    },
    { 
      name: t('dashboard.skillResilience'), 
      description: t('dashboard.skillResilienceDesc'), 
      icon: <Shield className="size-5" /> 
    },
  ]

  const technologies = [
    { name: 'React', icon: <FaReact className="size-6 text-[#61DAFB]" />, level: t('dashboard.levelExpert'), color: 'from-[#61DAFB]/20 to-[#61DAFB]/5' },
    { name: 'TypeScript', icon: <SiTypescript className="size-5 text-[#3178C6]" />, level: t('dashboard.levelExpert'), color: 'from-[#3178C6]/20 to-[#3178C6]/5' },
    { name: 'Scrum', icon: <Users className="size-5 text-[#FFB020]" />, level: t('dashboard.levelExpert'), color: 'from-[#FFB020]/20 to-[#FFB020]/5' },
    { name: 'SAP Concur', icon: <Workflow className="size-5 text-[#008FD3]" />, level: t('dashboard.levelAdvanced'), color: 'from-[#008FD3]/20 to-[#008FD3]/5' },
    { name: 'SQL', icon: <Database className="size-5 text-[#336791]" />, level: t('dashboard.levelAdvanced'), color: 'from-[#336791]/20 to-[#336791]/5' },
    { name: 'Figma', icon: <SiFigma className="size-5 text-[#F24E1E]" />, level: t('dashboard.levelAdvanced'), color: 'from-[#F24E1E]/20 to-[#F24E1E]/5' },
    { name: t('dashboard.techResponsiveDesign'), icon: <MonitorSmartphone className="size-5 text-[#06B6D4]" />, level: t('dashboard.levelExpert'), color: 'from-[#06B6D4]/20 to-[#06B6D4]/5' },
    { name: 'Node.js', icon: <FaNodeJs className="size-6 text-[#5FA04E]" />, level: t('dashboard.levelAdvanced'), color: 'from-[#5FA04E]/20 to-[#5FA04E]/5' },
    { name: '.NET', icon: <SiDotnet className="size-6 text-[#512BD4]" />, level: t('dashboard.levelAdvanced'), color: 'from-[#512BD4]/20 to-[#512BD4]/5' },
  ]

  const handleViewResume = (lang: 'ES' | 'EN') => {
    const resumePath = lang === 'ES' 
      ? '/profile/CV Juan Daniel González Alejandre.pdf' 
      : '/profile/Resume Juan Daniel González Alejandre.pdf'
    
    setPreviewPdfUrl(resumePath)
    openApp('preview')
    closeApp('dashboard')
  }

  return (
    <div className="h-full w-full bg-background/95 dark:bg-[#121212]/96 overflow-y-auto p-4 md:p-6 text-foreground font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Sparkles className="size-6 text-yellow-500 animate-pulse" />
              <span>{t('dashboard.title')}</span>
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 flex-wrap">
              <MapPin className="size-3.5" />
              <span>{t('dashboard.location')}</span>
              <span>•</span>
              <Briefcase className="size-3.5" />
              <span>{t('dashboard.roleFull')}</span>
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Profile Card + Socials & Stats (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Glassmorphic Profile Card */}
            <Card className="overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 blur-sm opacity-60 scale-105" />
                  <img 
                    src="/profile.jpg" 
                    alt="Juan Daniel" 
                    className="relative size-24 rounded-full object-cover border-2 border-background shadow-md select-none pointer-events-none"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = "https://github.com/identicons/juan.png"
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold tracking-tight">{t('dashboard.welcome')}</h2>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/20 transition-all duration-300">
                    {t('dashboard.roleShort')}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  {t('dashboard.bio')}
                </p>

                {/* Social links */}
                <div className="flex items-center gap-3 pt-2">
                  <a 
                    href="https://github.com/Juanda1050" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="size-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/45 transition-colors shadow-sm"
                    title="GitHub"
                  >
                    <FaGithub className="size-4" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/daniel-alejandre-3331951b5/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="size-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-[#0077B5] hover:border-[#0077B5]/45 transition-colors shadow-sm"
                    title="LinkedIn"
                  >
                    <FaLinkedin className="size-4" />
                  </a>
                  <a 
                    href="mailto:danielalejandre1050@gmail.com" 
                    className="size-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/45 transition-colors shadow-sm"
                    title="Email"
                  >
                    <Mail className="size-4" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('dashboard.experienceTitle'), val: t('dashboard.experienceValue'), bg: 'from-blue-500/10 to-indigo-500/5 border-blue-500/15' },
                { label: t('dashboard.projectsTitle'), val: t('dashboard.projectsValue'), bg: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/15' },
                { label: t('dashboard.specialtyTitle'), val: t('dashboard.specialtyValue'), bg: 'from-purple-500/10 to-pink-500/5 border-purple-500/15' },
                { label: t('dashboard.cvTitle'), val: t('dashboard.cvValue'), bg: 'from-amber-500/10 to-orange-500/5 border-amber-500/15' },
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "p-3 rounded-xl border bg-gradient-to-br flex flex-col justify-between min-h-20 shadow-sm transition-all hover:scale-[1.02] duration-300",
                    stat.bg
                  )}
                >
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">
                    {stat.label}
                  </span>
                  {idx === 3 ? (
                    <div className="flex flex-col gap-1 mt-1 w-full">
                      {stat.val.split('/').map((lang, lIdx) => {
                        const trimmed = lang.trim()
                        const match = trimmed.match(/^([^(]+)\s*\(([^)]+)\)$/)
                        if (match) {
                          const [, name = '', level = ''] = match
                          return (
                            <div key={lIdx} className="flex items-center justify-between text-xs gap-1.5 w-full">
                              <span className="text-foreground font-bold truncate">{name.trim()}</span>
                              <span className="text-[8px] sm:text-[9px] font-bold px-1 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20 shrink-0">
                                {level.trim()}
                              </span>
                            </div>
                          )
                        }
                        return (
                          <span key={lIdx} className="text-xs font-bold text-foreground">
                            {trimmed}
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-extrabold tracking-tight text-foreground mt-1 leading-snug">
                      {stat.val}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Resume View Actions */}
            <div className="p-4 rounded-xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur shadow-sm hover:shadow-md transition-all duration-300 space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="size-3.5 text-blue-500" />
                <span>{t('dashboard.quickLinks')}</span>
              </h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleViewResume('ES')}
                  className="w-full flex items-center justify-between text-xs font-medium bg-background hover:bg-muted border border-border rounded-lg px-3 py-2 transition-colors text-left group"
                >
                  <span>{t('dashboard.viewResumeEs')}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button 
                  onClick={() => handleViewResume('EN')}
                  className="w-full flex items-center justify-between text-xs font-medium bg-background hover:bg-muted border border-border rounded-lg px-3 py-2 transition-colors text-left group"
                >
                  <span>{t('dashboard.viewResumeEn')}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Soft Skills & Tech Stack (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Soft Skills Section */}
            <Card className="overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5 text-foreground">
                    <Sparkles className="size-4 text-blue-500 animate-pulse" />
                    <span>{t('dashboard.softSkills')}</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t('dashboard.softSkillsDesc')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {softSkills.map((skill, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-3 rounded-xl border border-white/10 bg-white/30 dark:bg-white/5 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-sm",
                        index === softSkills.length - 1 && softSkills.length % 2 !== 0 ? "sm:col-span-2" : ""
                      )}
                    >
                      <div className="shrink-0 p-2 rounded-lg bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-300">
                        {skill.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{skill.name}</p>
                        <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{skill.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack widget */}
            <Card className="overflow-hidden border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5 text-foreground">
                    <Code2 className="size-4 text-blue-500" />
                    <span>{t('dashboard.techStack')}</span>
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {technologies.map((tech) => (
                    <div
                      key={tech.name}
                      onMouseEnter={() => setHoveredTech(tech.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                      className={cn(
                        "p-3 rounded-xl border border-border/40 bg-gradient-to-br flex items-center gap-3 transition-all duration-300 relative overflow-hidden",
                        tech.color,
                        hoveredTech === tech.name ? "shadow-sm border-border/70 scale-[1.02]" : ""
                      )}
                    >
                      <div className="shrink-0">
                        {tech.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate text-foreground">{tech.name}</p>
                        <p className="text-[9px] text-muted-foreground leading-tight mt-0.5 font-medium">{tech.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  )
}
