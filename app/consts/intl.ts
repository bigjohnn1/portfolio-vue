import type { LocaleCode } from '~/types/i18n'

export const INTL_LOCALE_MAP: Record<LocaleCode, string> = {
  en: 'en-US',
  cs: 'cs-CZ',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
}

export const toIntlLocale = (code: string): string =>
  INTL_LOCALE_MAP[code as LocaleCode] ?? INTL_LOCALE_MAP.en
