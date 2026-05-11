import { type PortfolioFile, type SectionId } from '@/types/portfolio'
import { FaReact } from 'react-icons/fa6'
import { SiJson, SiMarkdown, SiTailwindcss, SiTypescript } from 'react-icons/si'

const iconMap: Record<SectionId, PortfolioFile['icon']> = {
  about: FaReact,
  experience: SiTypescript,
  projects: SiJson,
  skills: SiTailwindcss,
  contact: SiMarkdown,
}

export const portfolioFiles: PortfolioFile[] = [
  { id: 'about', key: 'files.about', icon: iconMap.about },
  { id: 'experience', key: 'files.experience', icon: iconMap.experience },
  { id: 'projects', key: 'files.projects', icon: iconMap.projects },
  { id: 'skills', key: 'files.skills', icon: iconMap.skills },
  { id: 'contact', key: 'files.contact', icon: iconMap.contact },
]
