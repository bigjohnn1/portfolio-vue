---
title: 'Bun Rewrote Itself in Rust: What Actually Changed, and Where It Belongs on the Edge'
description: 'A week after I moved my toolchain to Bun 1.3.14, the team merged a one-million-line Zig-to-Rust rewrite. Here is why they did it, a clear before/after table, and practical rules for when Bun belongs on the edge — and when it absolutely does not.'
date: '2026-05-25'
cover: '/bun.png'
---

![Bun — the all-in-one JavaScript runtime, now rewritten in Rust](/bun.png)

In my last post I argued that Bun **v1.3.14** had finally crossed the line from “interesting” to “my default”, and I moved a real production toolchain onto it.

Then, on **May 14**, the Bun team merged [PR #30412 — *Rewrite Bun in Rust*](https://www.theregister.com/devops/2026/05/14/anthropics-bun-rust-rewrite-merged-at-speed-of-ai/5240381): roughly **one million lines** across ~2,188 files, ported from Zig to Rust, with a large share of the porting done by Claude Code. Jarred Sumner noted that 1.3.14 would be “the last version in Zig”.

So the timing of that article was either perfect or terrible, depending on how you look at it. Either way it deserves a follow-up — because the thing the runtime is *written in* changed, and the thing **you** ship did not. Let me explain both halves of that sentence.

## First: nothing in your code changes

This is the part that matters most and gets buried under the drama.

Bun is a runtime built on **JavaScriptCore**. The rewrite re-implements Bun’s own systems layer — the I/O, the bundler, `bun install`, the glue around JSC — in Rust instead of Zig. Your JavaScript, your TypeScript, your `Bun.serve()` handlers, your `package.json`, your `bunfig.toml` — none of it knows or cares what language the binary underneath was compiled from.

The proof is in the test suite: within six days the Rust build passed **99.8% of Bun’s pre-existing tests** on Linux x64 glibc. That number is the whole story. A backend-language migration that keeps 99.8% of behavior identical is, from a consumer’s perspective, a no-op you’ll feel only as fewer crashes over time.

A regular `bun upgrade` still lands you on **v1.3.14** (the final Zig release). The Rust build is **canary-only** while the remaining optimization and cleanup PRs land:

```bash
bun upgrade --canary
```

Don’t put canary in production. But it’s worth running locally to see your own suite light up green.

## Why move off Zig at all?

Bun *became famous* for being written in Zig. Throwing that away is not a casual decision, so the reasons are worth understanding rather than dismissing as fashion.

Sumner’s own framing is refreshingly unglamorous: he got “tired of worrying about & spending lots of time fixing memory leaks and crashes.” That’s the entire thesis. The supporting reasons line up behind it:

- **Memory safety by default.** Rust’s borrow checker rejects use-after-free and data races at compile time. In a runtime that millions of requests flow through, “this class of bug can no longer be shipped” is worth more than raw speed.
- **`unsafe` is a visible keyword.** Dangerous operations have to be marked, so they stand out in review and *invite* refactoring instead of hiding in plain sight.
- **Ecosystem and hiring.** Zig is young with a small contributor pool. Rust is the de-facto language for systems rewrites, with a deep library ecosystem and a far larger pool of engineers who already know it. After the **Anthropic acquisition in late 2025**, maintainability and stability got more expensive to ignore.
- **Compile times didn’t regress.** Sumner says they’re “basically the same” using Bun’s custom Zig-compiler fork — and that fork (4× faster debug builds via parallel LLVM codegen on macOS/Linux) **can’t be upstreamed** because Zig has a strict no-AI policy on its tracker. That friction matters when AI agents are doing the porting.

It’s not that Zig is bad. It’s that for a now-commercially-backed runtime whose biggest costs were memory bugs, Rust trades raw control for guarantees — and guarantees are what a production runtime sells.

## What changed vs. what didn’t — the table

| Area | Bun 1.3.14 (Zig) | Bun Rust build (canary) |
| --- | --- | --- |
| **Core language** | Zig | Rust |
| **JS engine** | JavaScriptCore | JavaScriptCore *(unchanged)* |
| **Public APIs** (`Bun.serve`, `Bun.file`, `Bun.SQL`…) | Stable | Identical — no surface change |
| **Node compat layer** | ~Excellent, not 100% | Same behavior; 99.8% of tests pass |
| **Memory-safety model** | Manual (leaks/crashes possible) | Borrow-checked; `unsafe` explicit |
| **Compiler** | Bun’s custom Zig fork | Rust toolchain (LLVM) |
| **Debug build speed** | Baseline (custom fork) | “Basically the same” per Sumner |
| **Contributor onboarding** | Hard (small Zig pool) | Easier (large Rust pool) |
| **Your app code** | — | **No change required** |
| **Install path** | `bun upgrade` | `bun upgrade --canary` for now |

The single most important row is the last two: this is a backend swap, not a migration you perform.

## Bun on the edge: where yes, where no

This is the question I actually get asked, and the honest answer is *“it depends on the platform’s integration, not on Bun’s speed.”* The runtime is fast; the wrapper around it on each platform is what determines cold-start reality.

### Where Bun is a clear win

- **Vercel Edge Functions.** Bun is a first-class supported runtime, with internal numbers around **40% faster cold starts** vs. Node on the same network. This is the happy path — the platform manages the binary for you.
- **Long-lived servers / containers.** A `FROM oven/bun:1.3.14-alpine` image with `Bun.serve()` is where Bun shines hardest: ~4× faster cold start than Node, lower p50 latency under load, roughly half the idle memory. On the edge this maps to **regional containers** (Fly.io, Railway, Cloud Run) far better than to micro-isolates.
- **Cloudflare Workers-style isolate platforms** *when the platform ships a managed Bun integration* — not when you’re smuggling a binary in yourself.

### Where Bun does *not* belong (yet)

- **AWS Lambda via a custom runtime layer.** Counter-intuitive but measured: Bun boots **3–4× slower than Node 24 in Lambda**, because as a “Custom Runtime” the Bun binary itself has to be extracted/loaded from your layer first. The runtime being fast doesn’t help when the *bootstrap* pays I/O tax. Use Node’s managed runtime here, or move to a container.
- **Anything depending on native C++ addons.** Vercel found **~15% of customer deployments** used native addons Bun couldn’t run. If your dependency tree has a `binding.gyp` (`node-canvas`, certain `pg-native` setups, some Prisma engine paths), the edge is exactly where you don’t want that surprise.
- **APM-heavy production where you can’t tolerate gaps.** If your observability depends on Node-internal APM agent hooks, wait a couple of releases and re-evaluate.

**Rule of thumb:** Bun on the edge is a *container* story and a *first-party-integration* story. The moment you’re hand-rolling a custom Lambda layer or shipping native addons, reach for Node — not because Bun is slow, but because the boot path or the compat gap will bite you.

## Strengths, in numbers

These are the figures worth carrying in your head when someone asks “is it actually faster?”

- **Cold start:** ~**4×** faster than Node for a server process; **~8–15 ms** vs Node’s ~40–120 ms in favorable isolate environments.
- **Vercel Edge cold starts:** ~**40%** faster than Node on the same network.
- **`bun install`:** my Nuxt monorepo (~1,400 deps) did a cold install in **~5 s** vs **~38 s** on pnpm; warm is near-instant.
- **Tests:** **~3–5×** faster end-to-end than my old Vitest suite.
- **Footprint:** CI image dropped from **~340 MB → under 80 MB**; idle memory roughly **half** of Node.
- **One binary:** ~50 MB, dependency-free — runtime + package manager + bundler + test runner.

## Weaknesses, stated plainly

- **The Rust build is canary.** 99.8% is not 100%, and the remaining optimization/cleanup PRs aren’t merged. Production = 1.3.14 today.
- **Lambda custom-runtime cold starts are worse than Node’s.** Architecture-dependent, but real. Benchmark *your* deploy target, don’t trust the generic “Bun is faster” headline.
- **Native C++ addons still don’t all build.** Same caveat as before the rewrite; the language change doesn’t fix ecosystem gaps.
- **Windows is supported but rough at the edges.** Bun runs natively on Windows (ARM64 since v1.3.10), but expect “at least one confusing afternoon” if you have Windows-first devs. Linux/macOS remain the smooth paths.
- **Observability/APM lag.** Node-specific agents trail by a release or two.
- **Feature velocity vs. stability.** Built-in Markdown, DB clients, S3 — ambitious to a fault. The Rust rewrite is partly an admission that the pace needed a sturdier foundation underneath it.

## Conclusion

The headline is dramatic — *“fast runtime starts over”* — but the engineering reality is calm. Bun changed the language it’s written in to stop shipping memory bugs, kept JavaScriptCore, kept its public API, and proved equivalence with a 99.8%-passing test suite in under a week. For you, the consumer, the rewrite is something you’ll feel as *fewer crashes*, not as a migration.

My advice hasn’t moved since the last post. Run **1.3.14** in production now; run **`--canary`** locally to watch your own suite go green; and on the edge, think in terms of **containers and first-party integrations**, not hand-rolled Lambda layers. Do that and Bun is still the right default for new projects — only now with a foundation built to survive being depended on.

---

*Sources: [The Register](https://www.theregister.com/devops/2026/05/14/anthropics-bun-rust-rewrite-merged-at-speed-of-ai/5240381) · [Techzine](https://www.techzine.eu/news/devops/141364/bun-takes-a-surprising-step-from-zig-to-rust/) · [DevClass](https://www.devclass.com/software/2026/05/11/anthrophics-bun-team-trials-port-from-zig-to-rust/5237835) · [Cosmic JS — Why Bun is Rewriting in Rust](https://www.cosmicjs.com/blog/bun-rust-rewrite-javascript-runtime) · [Console — Serverless cold starts 2026](https://www.console.today/serverless/bun-vs-node-serverless-cold-starts-2026) · [Medium — The Case for Bun in 2026](https://medium.com/@oliveryasuna.main/the-case-for-bun-in-2026-where-it-works-and-where-it-doesnt-1cf61a55d1c9)*
