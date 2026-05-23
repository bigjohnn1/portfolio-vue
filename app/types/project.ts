export type TechCategory = 'frontend' | 'backend' | 'db' | 'misc'

export type ProjectStatus = 'production' | 'beta' | 'internal'

export type ProjectKind = 'production' | 'experiment'

export type ProjectTech = Partial<Record<TechCategory, string[]>>

export interface Project {
  key: string
  image: string
  link?: string
  tech?: ProjectTech
  status?: ProjectStatus
  kind?: ProjectKind
}

export const TECH_CATEGORIES: readonly TechCategory[] = ['frontend', 'backend', 'db', 'misc'] as const
