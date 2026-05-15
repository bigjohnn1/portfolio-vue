---
title: 'Bun 1.3.14: Why I Ditched pnpm, esbuild, and Vite for a Single Binary'
description: 'After running Bun v1.3.14 across real production workloads, the case for stitching together pnpm + esbuild + Vite + Jest keeps getting weaker. Here is why I moved my toolchain to a single binary.'
date: '2026-05-16'
cover: '/bun.png'
---

For years my JS toolchain looked like everyone else’s: **pnpm** for installs, **Vite** (with **esbuild** under the hood) for dev and bundling, **Vitest** for tests, **tsx** to run TypeScript scripts, and Node.js as the runtime.

It works. It’s also a Jenga tower of versions, peer-dep warnings, and config files that nobody on the team fully understands.

This week I shipped a real project entirely on **Bun v1.3.14** — runtime, package manager, bundler, test runner — and I’m not going back.

This is not a “Bun killed Node” hot take. It’s a working-engineer write-up of where Bun finally crossed the line from “interesting” to “my default”.

## 1. One Binary, Zero Toolchain Math

The thing that actually convinced me wasn’t a benchmark. It was deleting things.

After the migration, my `package.json` has no `tsx`, no `ts-node`, no `esbuild`, no `vite-node`, no `concurrently`, no `cross-env`, no `nodemon`. The CI image dropped from ~340 MB to under 80 MB because it’s literally `FROM oven/bun:1.3.14-alpine` and a copy step. The dev container starts in under a second.

`bun` is a single ~50 MB dependency-free binary that gives you:

- A Node-compatible **runtime** (JavaScriptCore, written in Zig)
- `bun install` — a **package manager** with workspaces, overrides, audits, global cache
- `bun build` — a **bundler** for browser *and* server targets
- `bun test` — a **Jest-compatible test runner** with snapshots, DOM, watch mode
- `bunx` — npx replacement
- `Bun.serve()`, `Bun.file`, `Bun.SQL`, `Bun.Image`, `Bun.Terminal` — actually-good native APIs

The cognitive load of toolchain decisions goes to roughly zero. New devs `curl | bash` once and clone the repo. That’s it.

## 2. `bun install` Is Genuinely Faster — And in 1.3.14, Smarter

`bun install` has been the easiest sell from day one. On my Nuxt monorepo (3 apps, ~1,400 deps), a cold install on Bun is ~5 seconds vs ~38 seconds on pnpm. Warm installs are basically instant.

What’s new and worth flagging in **v1.3.14** is the **global virtual store** for the isolated linker:

```toml
# bunfig.toml
[install]
globalStore = true
```

With it enabled, isolated installs went from 841ms → 115ms on the Bun team’s benchmarks because they skipped per-file `clonefileat` calls on macOS. In practice it means the strict, pnpm-style isolation model (no phantom deps) no longer costs you the speed.

This was my last real reason to keep pnpm around. It’s gone.

## 3. Native TypeScript Everywhere, No `tsx`/`ts-node` Dance

I run `.ts` files directly. Build scripts, migrations, CLIs, cron jobs — all just:

```bash
bun run scripts/seed-db.ts
```

No transpile step, no `tsx` watcher, no `--loader` flag, no `NODE_OPTIONS` gymnastics. JSX and TSX work the same way.

If you maintain a repo full of `*.cjs` shim files because `ts-node` and ESM don’t agree on which day of the week it is, this alone is worth the switch.

A small but lovely **1.3.14** detail: `using` and `await using` are no longer transpiled when targeting Bun. Native explicit resource management means cleaner cleanup code without the polyfill overhead.

## 4. `bun build` vs Vite/esbuild for Real Apps

This is where I expected to compromise — and didn’t.

esbuild is famously fast but isn’t a full bundler (no HTML, no asset graph, no dev server worth using alone). Vite is a fantastic dev experience but it’s a *stack*: esbuild for deps, Rollup for prod, multiple plugin layers, and a config that grows with you whether you want it to or not.

`bun build` covers the surface I actually use:

- TS/JSX/CSS, code splitting, tree-shaking, source maps
- HTML entry points (`bun build ./index.html` just works — it walks `<script>` and `<link>` tags)
- A plugin API close enough to esbuild’s that ports are mechanical
- Browser **and** server targets from the same CLI

For dev, `Bun.serve()` with `routes` + HMR has replaced my Vite dev server on smaller projects. For Nuxt I still let Vite drive — Bun is the runtime under it. But for any standalone React/Solid/vanilla app, I reach for `bun build` first now.

## 5. `bun test` Replaced Vitest Without Drama

Tests are where “Jest-compatible” usually means “mostly compatible, except for the bits you actually use”. With Bun I migrated a ~600-test suite (Vitest, with `@testing-library`) in an afternoon. The remaining diff was three calls to `vi.mock` becoming `mock.module`.

What I get:

- ~3–5× faster end-to-end test runs
- Built-in snapshot, DOM (via `happy-dom`), watch mode, coverage
- `expect()` API that matches Jest closely enough that LLMs and Stack Overflow are still useful
- No `vitest.config.ts`, no separate test runner process

The killer feature is just that `bun test` is *there*. No install, no config, no version-pinning Vitest against Vite against Node.

## 6. Runtime Performance That Shows Up In Production

Microbenchmarks are noise. What I actually measured on a small Hono API I moved over from Node:

- Cold start: **~4× faster** (matches the documented number)
- p50 request latency under load: ~22% lower
- Memory at idle: roughly half

In **1.3.14** specifically: a ~12% ESM parsing improvement (they fixed an 8 KB struct copy on every module load — exactly the kind of thing that compounds), 3.5% better HTTP throughput from Zig↔C++ LTO on Linux, and rewritten `fs.watch` using `inotify`/`FSEvents`/`kqueue` directly, which makes long-lived dev servers stop leaking file handles.

The HTTP/2 client in `fetch()` is the other quiet win — connection multiplexing without me having to reach for `undici` or a separate agent. And experimental HTTP/3 via `Bun.serve()` is one TLS flag away if you want it.

## 7. The Honest Trade-offs

I’m not going to pretend this is free.

- **Node-compat is excellent but not 100%.** Most of what I hit is solved; some niche native modules still don’t build against Bun. If you depend on `node-canvas`, `prisma`’s engine binaries, or a deeply custom `pg-native` setup, check before you migrate.
- **Ecosystem signal is mixed.** Tools like Sentry, OpenTelemetry, and certain APM agents lag behind Node by a release or two. Usually fine, occasionally annoying.
- **It’s still pre-1.4 for many critical surfaces.** I run Bun in production happily, but I keep a Node fallback Dockerfile around just in case.
- **LLMs are trained heavily on Node + npm.** Same problem Nuxt has versus Next — you’ll occasionally get suggested answers that assume `npm ci` or a Webpack quirk.

None of this outweighs the simplification for me. Your mileage will depend on how exotic your dependencies are.

## Conclusion

The all-in-one pitch used to feel like marketing. With **1.3.14** it stopped feeling that way for me. The pieces are individually competitive with the best-in-class tool they replace — `bun install` against pnpm, `bun build` against esbuild, `bun test` against Vitest — and together they delete an entire category of configuration from my projects.

I’m not telling anyone to rip out their Vite + Vitest + pnpm stack tomorrow. That stack is *good*.

I’m saying that for new projects, and for projects where the toolchain has become its own maintenance burden, **one binary is the right default now**. Bun finally earned that.

And the part I didn’t expect: it’s also just *nice* to use. The CLI feels coherent. Errors are readable. `Bun.serve` is what `http.createServer` should have been a decade ago.

That’s a strange thing to say about a build tool, but here we are.
