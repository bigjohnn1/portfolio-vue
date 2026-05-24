<template>
  <div
    ref="hero"
    class="relative grid aspect-square w-full max-w-[320px] place-items-center [perspective:1200px] sm:max-w-[420px] lg:max-w-[540px]"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div
      ref="stage"
      class="absolute inset-0 grid place-items-center will-change-transform [transform-style:preserve-3d]"
      :style="tiltStyle"
    >
      <div
        data-anim="halo"
        aria-hidden="true"
        class="absolute inset-[12%] rounded-full bg-primary-500/30 blur-3xl animate-aura-pulse dark:bg-primary-400/25"
      />

      <svg
        class="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <defs>
          <radialGradient
            id="rune-flash"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop
              offset="0%"
              stop-color="rgb(0 220 130)"
              stop-opacity="0.85"
            />
            <stop
              offset="100%"
              stop-color="rgb(0 220 130)"
              stop-opacity="0"
            />
          </radialGradient>
          <filter
            id="soft-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="1.5"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g class="text-primary-500/70 animate-spin-slow [transform-origin:100px_100px] dark:text-primary-300/55">
          <circle
            data-anim="outer-circle"
            cx="100"
            cy="100"
            r="96"
            stroke-width="0.45"
          />
          <circle
            data-anim="outer-circle-dashed"
            cx="100"
            cy="100"
            r="93"
            stroke-width="0.3"
            stroke-dasharray="2 5"
            opacity="0.7"
          />
          <g
            v-for="i in 24"
            :key="i"
            :transform="`rotate(${(i - 1) * 15} 100 100)`"
          >
            <line
              data-anim="tick"
              x1="100"
              :y1="i % 2 === 0 ? 2 : 3"
              x2="100"
              y2="6"
              :stroke-width="i % 2 === 0 ? '0.8' : '0.4'"
              :opacity="i % 2 === 0 ? 1 : 0.55"
            />
          </g>
        </g>

        <g class="text-primary-600/85 dark:text-primary-300/85">
          <line
            v-for="(seg, i) in hexEdges"
            :key="i"
            data-anim="hex-edge"
            :x1="seg.x1"
            :y1="seg.y1"
            :x2="seg.x2"
            :y2="seg.y2"
            stroke-width="0.8"
            filter="url(#soft-glow)"
          />
        </g>

        <polygon
          data-anim="inner-hex"
          points="100,28 162,64 162,136 100,172 38,136 38,64"
          stroke-width="0.35"
          stroke-dasharray="0.7 3.5"
          class="text-primary-500/40 dark:text-primary-300/35"
        />

        <g class="text-primary-500/55 animate-spin-slow-reverse [transform-origin:100px_100px] dark:text-primary-300/45">
          <circle
            data-anim="inner-circle"
            cx="100"
            cy="100"
            r="62"
            stroke-width="0.4"
            stroke-dasharray="1 4"
          />
        </g>

        <g class="text-primary-400/0">
          <line
            v-for="(pos, i) in runeSvgPositions"
            :key="i"
            data-anim="energy-line"
            x1="100"
            y1="100"
            :x2="pos.x"
            :y2="pos.y"
            stroke-width="0.4"
            stroke-dasharray="1 2"
            opacity="0"
          />
        </g>

        <g>
          <circle
            v-for="(pos, i) in runeSvgPositions"
            :key="i"
            data-anim="rune-flash"
            :cx="pos.x"
            :cy="pos.y"
            r="2"
            fill="url(#rune-flash)"
            opacity="0"
          />
        </g>

        <g class="text-primary-400">
          <circle
            data-anim="shockwave"
            cx="100"
            cy="100"
            r="20"
            stroke-width="0.6"
            opacity="0"
          />
        </g>

        <g class="text-primary-400 dark:text-primary-300">
          <circle
            v-for="(p, i) in particles"
            :key="i"
            data-anim="particle"
            :cx="p.x"
            :cy="p.y"
            r="0.6"
            fill="currentColor"
            :opacity="p.o"
          />
        </g>
      </svg>

      <div
        v-for="(pos, i) in runeCssPositions"
        :key="i"
        data-anim="rune"
        aria-hidden="true"
        :style="{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          animationDelay: `${i * 0.4}s`,
        }"
        class="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-primary-500 opacity-0 animate-rune-float sm:h-9 sm:w-9 lg:h-11 lg:w-11 dark:text-primary-300"
      >
        <Icon
          name="game-icons:rune-stone"
          class="h-full w-full drop-shadow-[0_0_10px_rgba(0,220,130,0.65)]"
        />
      </div>

      <div
        ref="critFlash"
        aria-hidden="true"
        class="pointer-events-none absolute inset-[10%] z-[15] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.55),transparent_68%)] opacity-0"
      />

      <button
        ref="d20Wrap"
        type="button"
        :aria-label="t('intro.roll.aria')"
        :disabled="rolling"
        class="group/d20 relative z-10 grid h-[42%] w-[42%] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 opacity-0 appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-default"
        @click="roll"
      >
        <span class="pointer-events-none absolute inset-[8%] rounded-full bg-primary-400/35 blur-2xl opacity-0 transition-opacity duration-300 group-hover/d20:opacity-100 group-focus-visible/d20:opacity-100" />
        <Icon
          name="game-icons:dice-twenty-faces-twenty"
          aria-hidden="true"
          class="relative h-full w-full text-primary-600 drop-shadow-[0_0_22px_rgba(0,220,130,0.7)] transition-transform duration-300 group-hover/d20:scale-105 dark:text-primary-300"
        />
      </button>

      <div
        ref="resultBadge"
        aria-hidden="true"
        class="pointer-events-none absolute bottom-[78%] left-1/2 z-20 flex w-max flex-col items-center gap-1 text-center opacity-0"
      >
        <span
          v-if="!result.crit"
          class="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-600/75 dark:text-primary-300/75"
        >{{ t('intro.roll.lead') }}</span>
        <span
          class="font-display text-5xl font-bold leading-none sm:text-6xl"
          :class="result.crit
            ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.75)]'
            : 'text-primary-700 drop-shadow-[0_0_18px_rgba(0,220,130,0.6)] dark:text-primary-200'"
        >{{ result.crit ? '20' : result.value }}</span>
        <span
          class="max-w-[9rem] text-xs font-medium uppercase tracking-[0.12em]"
          :class="result.crit
            ? 'text-amber-500 dark:text-amber-300'
            : 'text-gray-600 dark:text-gray-300'"
        >{{ result.crit ? t('intro.roll.crit') : (result.labelKey ? t(result.labelKey) : '') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement, useElementVisibility, usePreferredReducedMotion } from '@vueuse/core'

const { $gsap } = useNuxtApp()
const { t } = useI18n()

const hero = useTemplateRef<HTMLElement>('hero')
const stage = useTemplateRef<HTMLElement>('stage')
const d20Wrap = useTemplateRef<HTMLButtonElement>('d20Wrap')
const critFlash = useTemplateRef<HTMLElement>('critFlash')
const resultBadge = useTemplateRef<HTMLElement>('resultBadge')

const reducedMotion = usePreferredReducedMotion()
const prefersReducedMotion = computed(() => reducedMotion.value === 'reduce')

const queryOne = <T extends Element = Element>(key: string) =>
  stage.value?.querySelector<T>(`[data-anim="${key}"]`) ?? null
const queryAll = <T extends Element = Element>(key: string) =>
  stage.value ? Array.from(stage.value.querySelectorAll<T>(`[data-anim="${key}"]`)) : []

const hexVertices = [
  { x: 100, y: 18 },
  { x: 171, y: 59 },
  { x: 171, y: 141 },
  { x: 100, y: 182 },
  { x: 29, y: 141 },
  { x: 29, y: 59 },
]

const hexEdges = hexVertices.map((v, i) => {
  const next = hexVertices[(i + 1) % hexVertices.length]!
  return { x1: v.x, y1: v.y, x2: next.x, y2: next.y }
})

const runeSvgPositions = hexVertices
const runeCssPositions = hexVertices.map(v => ({ x: (v.x / 200) * 100, y: (v.y / 200) * 100 }))

const particles = Array.from({ length: 18 }, () => {
  const angle = Math.random() * Math.PI * 2
  const radius = 78 + Math.random() * 18
  return {
    x: 100 + Math.cos(angle) * radius,
    y: 100 + Math.sin(angle) * radius,
    o: 0.2 + Math.random() * 0.5,
  }
})

type RollDestination = { id: string, labelKey: string }

const fateDestinations: RollDestination[] = [
  { id: 'references', labelKey: 'nav.references' },
  { id: 'stack', labelKey: 'nav.stack' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'blog-preview', labelKey: 'nav.blog' },
]
const critDestination: RollDestination = { id: 'contact', labelKey: 'nav.contact' }

const rolling = shallowRef(false)
const result = shallowRef({ value: 0, labelKey: '', crit: false })

const scrollToSection = (id: string) => {
  if (!import.meta.client) return
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
    block: 'start',
  })
}

const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(hero)
const visible = useElementVisibility(hero)

const tiltStyle = computed(() => {
  if (prefersReducedMotion.value || isOutside.value || !elementWidth.value) {
    return { transform: 'rotateX(0deg) rotateY(0deg)' }
  }
  const nx = (elementX.value / elementWidth.value) * 2 - 1
  const ny = (elementY.value / elementHeight.value) * 2 - 1
  return {
    transform: `rotateX(${-ny * 4}deg) rotateY(${nx * 5}deg)`,
    transition: 'transform 0.4s ease-out',
  }
})

const flashAt = (idx: number) => {
  const el = queryAll<SVGCircleElement>('rune-flash')[idx]
  if (!el) return
  $gsap.fromTo(
    el,
    { opacity: 0.95, attr: { r: 2 } },
    { opacity: 0, attr: { r: 14 }, duration: 0.7, ease: 'power2.out' },
  )
}

const roll = () => {
  if (rolling.value || !d20Wrap.value) return
  rolling.value = true

  const value = Math.floor(Math.random() * 20) + 1
  const crit = value === 20
  const dest = crit ? critDestination : fateDestinations[value % fateDestinations.length]!
  result.value = { value, labelKey: dest.labelKey, crit }

  if (prefersReducedMotion.value) {
    $gsap.set(resultBadge.value, { opacity: 1, xPercent: -50 })
    scrollToSection(dest.id)
    window.setTimeout(() => {
      $gsap.to(resultBadge.value, { opacity: 0, duration: 0.3 })
      rolling.value = false
    }, 1400)
    return
  }

  $gsap.fromTo(
    queryOne('shockwave'),
    { opacity: 0.6, attr: { r: 22 } },
    { opacity: 0, attr: { r: 70 }, duration: 0.9, ease: 'power2.out' },
  )

  const tl = $gsap.timeline({ onComplete: () => { rolling.value = false } })

  tl.fromTo(
    d20Wrap.value,
    { rotateZ: 0, scale: 1 },
    { rotateZ: 720, scale: 1.12, duration: 0.55, ease: 'power2.in' },
  )
    .to(d20Wrap.value, {
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.8)',
      onComplete: () => $gsap.set(d20Wrap.value, { rotateZ: 0 }),
    })
    .fromTo(
      resultBadge.value,
      { opacity: 0, scale: 0.6, y: 8, xPercent: -50 },
      { opacity: 1, scale: 1, y: 0, xPercent: -50, duration: 0.4, ease: 'back.out(2)' },
      '-=0.2',
    )

  if (crit) {
    tl.fromTo(
      critFlash.value,
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1.12, duration: 0.28, ease: 'power2.out', yoyo: true, repeat: 1 },
      '-=0.4',
    )
  }

  tl.to(
    resultBadge.value,
    {
      opacity: 0,
      duration: 0.45,
      onStart: () => scrollToSection(dest.id),
    },
    `+=${crit ? 1.1 : 0.7}`,
  )
}

const skipToFinalState = () => {
  const targets = [
    queryOne('halo'),
    queryOne('inner-hex'),
    d20Wrap.value,
    ...queryAll('rune'),
    ...queryAll('hex-edge'),
  ].filter(Boolean) as Element[]
  $gsap.set(targets, { opacity: 1, scale: 1, rotateZ: 0, clearProps: 'strokeDasharray,strokeDashoffset' })
  $gsap.set(queryAll('tick'), { opacity: (i: number) => (i % 2 === 0 ? 1 : 0.55) })
  $gsap.set(queryAll('energy-line'), { opacity: 0.12 })
  $gsap.set(queryOne('outer-circle'), { strokeDashoffset: 0, clearProps: 'strokeDasharray' })
  $gsap.set(queryOne('outer-circle-dashed'), { strokeDashoffset: 0, strokeDasharray: '2 5' })
  $gsap.set(queryOne('inner-circle'), { strokeDashoffset: 0, clearProps: 'strokeDasharray' })
}

const composeScene = () => {
  if (!stage.value) return

  if (prefersReducedMotion.value) {
    skipToFinalState()
    return
  }

  const halo = queryOne('halo')
  const outerCircle = queryOne<SVGCircleElement>('outer-circle')
  const outerCircleDashed = queryOne<SVGCircleElement>('outer-circle-dashed')
  const ticks = queryAll<SVGLineElement>('tick')
  const hexEdgeEls = queryAll<SVGLineElement>('hex-edge')
  const innerHex = queryOne<SVGPolygonElement>('inner-hex')
  const innerCircle = queryOne<SVGCircleElement>('inner-circle')
  const energyLines = queryAll<SVGLineElement>('energy-line')
  const runeEls = queryAll<HTMLElement>('rune')
  const shockwave = queryOne<SVGCircleElement>('shockwave')
  const particleEls = queryAll<SVGCircleElement>('particle')

  const tl = $gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from(halo, { opacity: 0, scale: 0.4, duration: 1.0 }, 0)

  if (outerCircle && outerCircleDashed) {
    const r = 96
    const c = 2 * Math.PI * r
    $gsap.set([outerCircle, outerCircleDashed], {
      strokeDasharray: c,
      strokeDashoffset: c,
    })
    tl.to(outerCircle, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.15)
      .to(outerCircleDashed, {
        strokeDasharray: '2 5',
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power1.out',
      }, 1.3)
  }

  if (ticks.length) {
    $gsap.set(ticks, { opacity: 0, transformOrigin: '100px 100px' })
    tl.to(ticks, {
      opacity: (i: number) => (i % 2 === 0 ? 1 : 0.55),
      duration: 0.08,
      stagger: { each: 0.04, from: 'start' },
      ease: 'power1.out',
    }, 0.4)
  }

  if (hexEdgeEls.length) {
    hexEdgeEls.forEach((el) => {
      const length = el.getTotalLength()
      $gsap.set(el, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 })
    })
    tl.to(hexEdgeEls, {
      strokeDashoffset: 0,
      duration: 0.32,
      stagger: 0.12,
      ease: 'power2.out',
    }, 0.9)
  }

  tl.from(innerHex, {
    opacity: 0,
    scale: 1.4,
    duration: 0.7,
    transformOrigin: '100px 100px',
    ease: 'power2.out',
  }, 1.45)

  if (innerCircle) {
    const r = 62
    const c = 2 * Math.PI * r
    $gsap.set(innerCircle, { strokeDasharray: c, strokeDashoffset: c })
    tl.to(innerCircle, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, 1.55)
  }

  if (energyLines.length) {
    energyLines.forEach((el) => {
      const length = el.getTotalLength()
      $gsap.set(el, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 })
    })
    tl.to(energyLines, {
      strokeDashoffset: 0,
      opacity: 0.45,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.inOut',
    }, 1.75)
      .to(energyLines, {
        opacity: 0.12,
        duration: 0.8,
        ease: 'power2.inOut',
      }, '>-0.1')
  }

  runeSvgPositions.forEach((_, i) => {
    tl.call(() => flashAt(i), [], 2.0 + i * 0.09)
  })

  if (runeEls.length) {
    tl.fromTo(
      runeEls,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.09,
        ease: 'back.out(2)',
      },
      2.05,
    )
  }

  tl.fromTo(
    d20Wrap.value,
    { opacity: 0, scale: 0.2, rotateZ: -540 },
    {
      opacity: 1,
      scale: 1,
      rotateZ: 0,
      duration: 1.1,
      ease: 'back.out(1.5)',
    },
    2.4,
  ).fromTo(
    shockwave,
    { opacity: 0.7, attr: { r: 18 } },
    { opacity: 0, attr: { r: 95 }, duration: 1.0, ease: 'power2.out' },
    2.55,
  )

  if (particleEls.length) {
    tl.from(particleEls, {
      opacity: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: 'power1.out',
    }, 2.6)
    particleEls.forEach((el, i) => {
      const p = particles[i]
      if (!p) return
      $gsap.to(el, {
        opacity: p.o * 0.3,
        duration: 1.6 + Math.random() * 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 3 + Math.random() * 1.5,
      })
    })
  }
}

const fadeEnergyLines = (target: number) => {
  if (prefersReducedMotion.value) return
  const lines = queryAll('energy-line')
  if (!lines.length) return
  $gsap.to(lines, { opacity: target, duration: 0.5, ease: 'power2.out' })
}

const onEnter = () => fadeEnergyLines(0.4)
const onLeave = () => fadeEnergyLines(0.12)

let composed = false
watch(visible, (v) => {
  if (!v || composed) return
  composed = true
  composeScene()
}, { immediate: true })
</script>
