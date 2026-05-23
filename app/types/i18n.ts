export const LOCALE_CODES = ['en', 'cs', 'de', 'fr', 'es'] as const

export type LocaleCode = typeof LOCALE_CODES[number]

export interface LocaleOption {
  code: LocaleCode
  name?: string
  icon?: string
}
