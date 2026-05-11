import {
  Briefcase,
  CircleUser,
  Code2,
  FolderGit2,
  Mail,
  type LucideIcon,
} from 'lucide-react'
import { type PortfolioFile, type SectionId } from '@/types/portfolio'

const iconMap: Record<SectionId, LucideIcon> = {
  about: CircleUser,
  experience: Briefcase,
  projects: FolderGit2,
  skills: Code2,
  contact: Mail,
}

export const portfolioFiles: PortfolioFile[] = [
  { id: 'about', key: 'files.about', icon: iconMap.about },
  { id: 'experience', key: 'files.experience', icon: iconMap.experience },
  { id: 'projects', key: 'files.projects', icon: iconMap.projects },
  { id: 'skills', key: 'files.skills', icon: iconMap.skills },
  { id: 'contact', key: 'files.contact', icon: iconMap.contact },
]
