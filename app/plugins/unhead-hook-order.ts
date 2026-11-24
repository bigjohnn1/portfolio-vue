/**
 * Workaround for a hook-ordering bug between Nuxt 4, unhead 3 and @unhead/schema-org.
 *
 * On `compatibilityVersion: 4` Nuxt creates the head with unhead's `legacyPlugins`, which include
 * PromisesPlugin. Its `entries:resolve` handler is async, and hookable runs every handler that was
 * registered after an async one inside a `.then()`. The schema-org plugin is registered later (by
 * nuxt-schema-org's init plugin), so its synchronous `entries:resolve` handler, which creates the
 * graph, runs one microtask too late: `entries:normalize` calls `graph.push()` on `undefined` and
 * throws "Cannot read properties of undefined (reading 'push')".
 *
 * It only shows on the client when nuxt-schema-org is reactive, i.e. in `nuxt dev` (in production
 * schema-org is server-only), but there it fired on every page load. Moving the promises handler to
 * the end of the chain lets the synchronous handlers run first; it still runs, so promise inputs
 * keep working (this site passes none to `useHead`).
 *
 * The move happens in `app:created`, which Nuxt calls after every plugin has been applied and
 * before the first render, so it does not depend on plugin order (nuxt-schema-org's init uses
 * `order: 999` and waits for i18n, and is server-only in production builds).
 * Remove once the app moves to `compatibilityVersion: 5` (no legacy plugins) or upstream fixes it.
 */
export default defineNuxtPlugin({
  name: 'unhead-hook-order',
  setup(nuxtApp) {
    const head = injectHead()
    nuxtApp.hook('app:created', () => {
      const handler = head.plugins.get('promises')?.hooks?.['entries:resolve']
      if (!head.hooks || !handler) return
      head.hooks.removeHook('entries:resolve', handler)
      head.hooks.hook('entries:resolve', handler)
    })
  },
})
