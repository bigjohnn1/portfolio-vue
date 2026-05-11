import type { AsyncDataOptions } from '#app'

/**
 * Strip the null prototype that `better-sqlite3` rows carry through
 * `queryCollection()`. Without this, Pinia's payload serializer crashes
 * in SSR (`shouldHydrate` calls `obj.hasOwnProperty` directly).
 */
export const cloneContent = <T>(value: T): T =>
  value == null ? value : JSON.parse(JSON.stringify(value))

/**
 * Thin wrapper around `useAsyncData` for Nuxt Content queries — clones
 * the result into plain objects with `Object.prototype` so SSR payload
 * serialization never trips on null-prototype rows.
 */
export const useContentData = <T>(
  key: string,
  fn: () => Promise<T>,
  options?: AsyncDataOptions<T>,
) => {
  return useAsyncData<T>(key, async () => cloneContent(await fn()), options)
}
