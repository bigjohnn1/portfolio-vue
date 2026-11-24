export type TechCategory = 'frontend' | 'backend' | 'db' | 'misc'

export type ProjectStatus = 'production' | 'beta' | 'internal' | 'merged'

export type ProjectTech = Partial<Record<TechCategory, string[]>>

export interface Project {
  key: string
  /** Cover image in `public/`. Without one the card renders an icon banner. */
  image?: string
  /** Icon shown in the banner when there is no cover image. */
  bannerIcon?: string
  link?: string
  /** Public source code, rendered as a secondary link next to `link`. */
  repo?: string
  tech?: ProjectTech
  status?: ProjectStatus
}

export const TECH_CATEGORIES: readonly TechCategory[] = ['frontend', 'backend', 'db', 'misc'] as const
