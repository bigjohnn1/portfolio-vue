<template>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 z-0 isolate transition-opacity duration-[600ms] ease-out"
    :class="mounted ? 'opacity-100' : 'opacity-0'"
  >
    <div class="absolute -left-[20vw] -top-[20vh] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.07),rgba(139,92,246,0.02)_45%,transparent_70%)] blur-3xl" />
    <div class="absolute -bottom-[25vh] -right-[20vw] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),rgba(99,102,241,0.015)_45%,transparent_70%)] blur-3xl" />

    <svg
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="none"
      class="absolute inset-0 h-full w-full"
    >
      <circle
        v-for="(s, i) in stars"
        :key="i"
        :cx="s.x"
        :cy="s.y"
        :r="s.r"
        :fill="s.tint"
        :class="['star', `star--${s.bucket}`]"
        :style="`--base-opacity: ${s.opacity}; animation-delay: ${s.delay}s`"
      />
    </svg>

    <svg
      viewBox="0 0 100 100"
      class="absolute right-10 top-16 hidden h-32 w-32 text-violet-300/[0.05] sm:block hex-drift"
      fill="none"
      stroke="currentColor"
      stroke-width="0.4"
      stroke-linejoin="round"
    >
      <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" />
      <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" />
      <circle
        cx="50"
        cy="50"
        r="2"
        fill="currentColor"
      />
    </svg>

    <canvas
      ref="canvasRef"
      class="absolute inset-0 h-full w-full"
    />
  </div>
</template>

<script setup lang="ts">
import {
  useDebounceFn,
  useDocumentVisibility,
  usePreferredReducedMotion,
  useWindowSize,
} from '@vueuse/core'

interface Star {
  x: number
  y: number
  r: number
  tint: string
  opacity: number
  delay: number
  bucket: 'a' | 'b'
}

interface Shooting {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

const TINTS = ['#e8edf5', '#e8edf5', '#e8edf5', '#9eb8d4', '#e8c890']
const MIN_STARS = 40
const MAX_STARS = 140
const AREA_PER_STAR = 18000

const { width, height } = useWindowSize()
const reducedMotion = usePreferredReducedMotion()
const visibility = useDocumentVisibility()

const mounted = shallowRef(false)
const stars = shallowRef<Star[]>([])
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')

const isMobile = computed(() => width.value < 640)

const pickTint = () => TINTS[Math.floor(Math.random() * TINTS.length)]!

const generateStars = () => {
  const area = width.value * height.value
  const count = Math.max(MIN_STARS, Math.min(MAX_STARS, Math.round(area / AREA_PER_STAR)))
  const list: Star[] = []
  for (let i = 0; i < count; i++) {
    const small = Math.random() < 0.8
    const r = small ? 0.4 + Math.random() * 0.6 : 0.9 + Math.random() * 0.9
    list.push({
      x: Math.random() * width.value,
      y: Math.random() * height.value,
      r,
      tint: pickTint(),
      opacity: 0.2 + Math.random() * 0.65,
      delay: -Math.random() * 7,
      bucket: Math.random() < 0.6 ? 'a' : 'b',
    })
  }
  stars.value = list
}

const shootingStars: Shooting[] = []
let rafId: number | null = null
let spawnTimer: ReturnType<typeof setTimeout> | null = null
let lastTime = 0

const spawnShooting = () => {
  const limit = isMobile.value ? 1 : 2
  if (shootingStars.length >= limit) return
  const angleDeg = 22 + Math.random() * 13
  const angle = (angleDeg * Math.PI) / 180
  const dir = Math.random() < 0.5 ? 1 : -1
  const speed = 0.85 + Math.random() * 0.45
  shootingStars.push({
    x: dir === 1 ? Math.random() * width.value * 0.5 : width.value * (0.5 + Math.random() * 0.5),
    y: Math.random() * height.value * 0.45,
    vx: Math.cos(angle) * speed * dir,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: 900 + Math.random() * 500,
  })
}

const drawCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const s of shootingStars) {
    const t = s.life / s.maxLife
    const alpha = t < 0.15 ? t / 0.15 : Math.max(0, 1 - (t - 0.15) / 0.85)
    const tailLen = isMobile.value ? 55 : 80
    const tailX = (s.x - (s.vx / 0.9) * tailLen) * dpr
    const tailY = (s.y - (s.vy / 0.9) * tailLen) * dpr
    const headX = s.x * dpr
    const headY = s.y * dpr

    const gradient = ctx.createLinearGradient(headX, headY, tailX, tailY)
    gradient.addColorStop(0, `rgba(232, 237, 245, ${alpha})`)
    gradient.addColorStop(1, 'rgba(232, 237, 245, 0)')
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1.4 * dpr
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(headX, headY)
    ctx.lineTo(tailX, tailY)
    ctx.stroke()

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.beginPath()
    ctx.arc(headX, headY, 1.4 * dpr, 0, Math.PI * 2)
    ctx.fill()
  }
}

const tick = (now: number) => {
  const dt = lastTime ? now - lastTime : 16
  lastTime = now

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i]!
    s.x += s.vx * dt
    s.y += s.vy * dt
    s.life += dt
    const off = s.life >= s.maxLife
      || s.y > height.value + 100
      || s.x < -150
      || s.x > width.value + 150
    if (off) shootingStars.splice(i, 1)
  }

  drawCanvas()

  if (shootingStars.length > 0) {
    rafId = requestAnimationFrame(tick)
  } else {
    rafId = null
    lastTime = 0
    const canvas = canvasRef.value
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
}

const startTick = () => {
  if (rafId === null) {
    lastTime = 0
    rafId = requestAnimationFrame(tick)
  }
}

const scheduleSpawn = () => {
  if (spawnTimer) clearTimeout(spawnTimer)
  const base = 6000 + Math.random() * 6000
  const delay = isMobile.value ? base * 2.5 : base
  spawnTimer = setTimeout(() => {
    spawnTimer = null
    if (visibility.value === 'visible' && reducedMotion.value !== 'reduce') {
      spawnShooting()
      startTick()
    }
    scheduleSpawn()
  }, delay)
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = Math.round(width.value * dpr)
  canvas.height = Math.round(height.value * dpr)
  canvas.style.width = `${width.value}px`
  canvas.style.height = `${height.value}px`
}

const onResize = useDebounceFn(() => {
  generateStars()
  resizeCanvas()
}, 200)

watch([width, height], onResize)

watch(visibility, (v) => {
  if (v !== 'visible') {
    if (spawnTimer) {
      clearTimeout(spawnTimer)
      spawnTimer = null
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  } else if (!spawnTimer && reducedMotion.value !== 'reduce') {
    scheduleSpawn()
  }
})

watch(reducedMotion, (v) => {
  if (v === 'reduce' && spawnTimer) {
    clearTimeout(spawnTimer)
    spawnTimer = null
  } else if (v !== 'reduce' && !spawnTimer) {
    scheduleSpawn()
  }
})

onMounted(() => {
  generateStars()
  resizeCanvas()
  requestAnimationFrame(() => {
    mounted.value = true
  })
  if (reducedMotion.value !== 'reduce') {
    scheduleSpawn()
  }
})

onBeforeUnmount(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (spawnTimer) clearTimeout(spawnTimer)
})
</script>

<style scoped>
.star {
  opacity: var(--base-opacity, 0.5);
  animation-fill-mode: both;
}
.star--a {
  animation: twinkle-a 4s ease-in-out infinite;
}
.star--b {
  animation: twinkle-b 7s ease-in-out infinite;
}
.hex-drift {
  animation: hex-drift 90s linear infinite;
  transform-origin: 50% 50%;
}
@keyframes twinkle-a {
  0%, 100% { opacity: var(--base-opacity, 0.5); }
  50% { opacity: calc(var(--base-opacity, 0.5) * 0.35); }
}
@keyframes twinkle-b {
  0%, 100% { opacity: var(--base-opacity, 0.5); }
  60% { opacity: calc(var(--base-opacity, 0.5) * 1.35); }
}
@keyframes hex-drift {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .star--a,
  .star--b,
  .hex-drift {
    animation: none;
  }
}
</style>
