import { type LucideIcon } from 'lucide-react'

export interface PortfolioFile {
  id: SectionId
  icon: LucideIcon
  key: string
}

export type SectionId = 'about' | 'experience' | 'projects' | 'skills' | 'contact'

export interface ExperienceItem {
  role: string
  company: string
  period: string
  bullets: string[]
}

export interface ProjectItem {
  name: string
  description: string
  stack: string[]
  href: string
}

export interface ContactItem {
  label: string
  value: string
  href: string
}
