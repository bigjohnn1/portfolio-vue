---
title: 'tRPC in Nitro: Three Ways to Wire It, One of Them Is Currently Broken'
description: 'tRPC still has no official Nitro adapter. Here are the three ways people actually wire it up, why toWebRequest blows up on Nuxt 4.4+, and the Bun-shaped escape hatch nobody mentions.'
date: '2026-08-09'
---

I lost most of a Tuesday to this, so you don't have to.

tRPC ships adapters for Express, Fastify, Next.js, AWS Lambda, standalone Node, and the Fetch API. There isn't one for Nitro. [The discussion asking for it](https://github.com/trpc/trpc/discussions/3155) has been open since Nuxt 3 was still in RC and it is, at time of writing, still open.

So everyone writes their own glue. There are three common flavours of that glue, and on Nuxt 4.4+ the most popular one kills your dev server before it finishes booting.

## Why there's no adapter

An adapter takes your framework's request object and hands tRPC something it recognises. Nitro's request object has been a moving target for two years: h3 v1 events wrap Node's `req`/`res`, h3 v2 events wrap a web-standard `Request`. Writing an adapter in the middle of that migration means maintaining two of them and then throwing one away.

Fair enough, honestly. And it turns out tRPC already ships the adapter you want, it's just filed under `fetch`.

## Option 1: the Fetch adapter

The [Fetch adapter](https://trpc.io/docs/server/adapters/fetch) turns your router into a `Request → Response` function. Same contract Cloudflare Workers and Deno Deploy speak, so this is the option that doesn't quietly nail you to a Node server.

Router first:

```ts
// server/trpc/init.ts
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure
```

```ts
// server/trpc/routers/index.ts
import { z } from 'zod'
import { publicProcedure, router } from '../init'

export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => `Hello ${input.name}`),
})

export type AppRouter = typeof appRouter
```

Then one catch-all route to mount the thing:

```ts
// server/routes/trpc/[...].ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '../../trpc/routers'

export default defineEventHandler((event) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: toWebRequest(event),
    router: appRouter,
    createContext: () => ({}),
  })
})
```

Watch the directory. That's `server/routes/`, not `server/api/`. The `endpoint` string has to match the actual URL prefix, and `server/api/` silently prepends `/api`, so if you put it there and leave `endpoint: '/trpc'` you get 404s on every procedure with a stack trace that points at nothing useful. I did this. Twice, in the same afternoon, because the second time I'd convinced myself it was a CORS thing.

On bare Nitro you skip the file convention and map it in config, which is [Nitro's own example](https://nitro.build/examples/vite-trpc):

```ts
// nitro.config.ts
export default defineNitroConfig({
  routes: {
    '/trpc/**': './server/trpc.ts',
  },
})
```

## And now the part that breaks

That `toWebRequest(event)` call up there. On Nuxt 4.4.2+ your dev server dies on startup:

```
SyntaxError: The requested module 'h3' does not provide an export named 'toWebRequest'
```

The full story is in [nuxt#34738](https://github.com/nuxt/nuxt/issues/34738). Nitro 2.13.1 bundles h3 `2.0.1-rc.x` as a scoped dep, and h3 v2 renamed `toWebRequest` to `toRequest`. The generated dev bundle hardcodes an absolute path into that h3 v2 RC. Which leaves you here:

- `toWebRequest` resolves in production against h3 v1, and doesn't exist in dev
- `toRequest` exists in dev, isn't in Nuxt's auto-import list, and blows up the production build

There is no single import that satisfies both. The issue is closed as *not planned*, with h3 v2 compat pushed to Nuxt 5.

Three ways out, in ascending order of how much I like them.

**Pin `nuxt@~4.3.1`.** Nitro 2.12.x, h3 v1 only, everything works. It's the official workaround and it also means you're a version behind on everything else in Nuxt forever, which for a bug in one function feels like a bad trade.

**Write the conversion yourself.** It's a few lines and it doesn't care which h3 you're on:

```ts
// server/utils/to-request.ts
import type { H3Event } from 'h3'

export function eventToRequest(event: H3Event): Request {
  const url = getRequestURL(event)
  const method = event.method

  return new Request(url, {
    method,
    headers: getRequestHeaders(event) as HeadersInit,
    body: method === 'GET' || method === 'HEAD' ? undefined : event.node.req as unknown as BodyInit,
    // @ts-expect-error undici wants this for streamed bodies
    duplex: 'half',
  })
}
```

This is roughly what `trpc-nuxt` does internally, for exactly the same reason. Copying a stdlib function into your own repo to dodge a rename is not something to be proud of, but it's four lines you delete later.

**Hand the problem to a package.** That's option 2.

## Option 2: trpc-nuxt

[`trpc-nuxt`](https://github.com/wobsoriano/trpc-nuxt) wraps all of the above and, more usefully, gives you the client half that the raw Fetch adapter leaves you to build. Latest is `2.1.1`, Nuxt 4 is the primary target, Node 22+.

```ts
// server/api/trpc/[trpc].ts
import { createNuxtApiHandler } from 'trpc-nuxt/server'
import { appRouter } from '~~/server/trpc/routers'

export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({}),
})
```

```ts
// app/plugins/trpc.ts
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc/routers'

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtClient<AppRouter>({
    links: [httpBatchLink({ url: '/api/trpc' })],
  })

  return { provide: { client } }
})
```

Miss this next bit and you'll burn an hour on a build error that reads like a Vite problem. The package ships compiled output referencing Nuxt's `#imports` virtual module, so it has to go through the build pipeline:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    transpile: ['trpc-nuxt'],
  },
})
```

Worth having: `useSubscription()` with connection state handled for you, `sendRedirect()` on the h3 event from inside a procedure (the raw Fetch adapter gives you no event access whatsoever, which you notice the first time you want an auth redirect), and `fetchOptions` on the links so you can hook the underlying `ofetch` instance.

The thing to be honest about is that it's one maintainer holding a bridge between two fast-moving majors. When Nitro v3 lands this is the layer that breaks first, and how long you wait for a fix isn't up to you.

## Option 3: nodeHTTPRequestHandler

You'll find this one in older posts and Discord answers:

```ts
import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http'

export default defineEventHandler(async (event) => {
  return nodeHTTPRequestHandler({
    router: appRouter,
    createContext: () => ({}),
    path: event.context.params?.trpc ?? '',
    req: event.node.req,
    res: event.node.res,
  })
})
```

It works fine. It also reaches through `event.node`, so Workers and every other edge target are off the table, and it's first in line to die under h3 v2 where `event.node` stops being the primitive. You're giving up portability and getting nothing back, since the Fetch adapter does the same job.

Only reason to pick it: you're staying on a Node server permanently and you need something off the raw `res` that tRPC won't hand you.

## What Nitro v3 fixes

[Nitro v3 is in public beta](https://nitro.build/blog/v3-beta) with h3 v2 as its default HTTP layer. Web-standard `Request`/`Response` all the way down, Rolldown builds, Vite Environment API. It ships with Nuxt 5.

When the event *is* a web request, the conversion layer just evaporates:

```ts
export default defineEventHandler((event) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: event.req,
    router: appRouter,
    createContext: () => ({}),
  })
})
```

No `toWebRequest`, no vendored helper, no import that means different things in dev and prod. The rename causing everyone grief today is the same rename that ends the problem.

Which is an argument for option 1 with your own converter, if you're starting now. One file and one line to clean up later, and you're not waiting on anyone.

## The Bun answer

Everything above assumes you've already decided the API lives inside Nitro. If that's not load-bearing, [Elysia](https://elysiajs.com/) sidesteps the whole category of problem, and since [I moved my toolchain to Bun](/blog/bun-1.3-all-in-one) this is what I actually reach for.

Eden Treaty is Elysia's answer to tRPC: same end-to-end inference, no codegen, no schema files, about 2KB on the client. The difference is that it's not a layer bolted onto a server framework, it *is* the server framework's type export. You write routes, you export `typeof app`, done.

```ts
// api.ts
import { Elysia, t } from 'elysia'

export default () => new Elysia()
  .get('/hello', () => ({ message: 'Hello world!' }))
  .post('/greet', ({ body }) => `Hello ${body.name}`, {
    body: t.Object({ name: t.String() }),
  })
```

There's a Nuxt module, [`nuxt-elysia`](https://github.com/tkesgar/nuxt-elysia), that mounts an Elysia app onto Nuxt's server and wires up Eden for you:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-elysia'],
  nuxtElysia: {
    path: '/api',
  },
  nitro: {
    preset: 'bun',
  },
})
```

```vue
<script setup lang="ts">
const { $api } = useNuxtApp()

const { data } = await useAsyncData(async () => {
  const { data, error } = await $api.hello.get()
  if (error) throw new Error('Failed to call API')
  return data
})
</script>
```

Paths become dot notation. `/hello` is `.hello.get()`, dynamic segments are function calls. Responses come back as `{ data, error }` with the error type narrowed per status code, which is genuinely nicer than tRPC's thrown-`TRPCError` model once you're handling more than one failure case.

Two catches, both real. The Bun preset isn't optional, since Elysia has Bun-specific exports that Nitro's default Node bundling won't resolve. And if both runtimes are on your machine you'll want `bun --bun nuxi dev`, otherwise the shebang wins and you're back on Node wondering why the numbers look ordinary. The maintainer's own figure is 14.7k req/s on Bun against 7k on Node for the same app, and that's the boring end of Elysia benchmarks.

You can also skip the module entirely and mount Elysia as a plain fetch handler, since it's WinterCG compliant. Nitro [documents that too](https://nitro.build/examples/elysia).

## If you want the middle path

[oRPC](https://orpc.dev/docs/adapters/nuxt) exists somewhere between the two. First-party Nuxt adapter, which it has precisely because tRPC never wanted one:

```ts
// server/routes/rpc/[...].ts
import { RPCHandler } from '@orpc/server/fetch'
import { router } from '~~/server/router'

const handler = new RPCHandler(router)

export default defineEventHandler(async (event) => {
  const { matched, response } = await handler.handle(
    toWebRequest(event),
    { prefix: '/rpc' },
  )

  if (matched) return response
  setResponseStatus(event, 404)
  return 'Not found'
})
```

Same shape as tRPC, with an OpenAPI spec falling out the other end. The argument that actually moved me is [typecheck cost on big routers](https://blog.logrocket.com/trpc-vs-orpc-type-safe-rpc/): tRPC infers through nested procedure chains, so router size compounds into `tsc` time. oRPC's contract is a plain object and doesn't.

## So

tRPC is still the one with the deepest ecosystem, the best TanStack Query story, and ten times the prior art when you're stuck at 1am. On a monorepo where you own both ends and the router stays modest, that's worth the glue code and the h3 landmine.

But if you're standing at the start of a project rather than halfway through one, look at the other two first. Elysia if you're on Bun, oRPC if you need the OpenAPI surface or your router is going to get big. I'd be lying if I said I picked tRPC on the merits the last few times, rather than out of habit.
