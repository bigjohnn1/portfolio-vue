<template>
  <TresCanvas
    clear-color="#0b1020"
    window-size
    render-mode="always"
    :dpr="dpr"
    :antialias="!isMobile"
    class="absolute inset-0"
  >
    <TresPerspectiveCamera
      :position="[0, 0, 6]"
      :fov="55"
      :near="0.1"
      :far="100"
    />
    <TresAmbientLight :intensity="0.7" />
    <TresDirectionalLight
      :position="[5, 5, 5]"
      :intensity="0.6"
    />

    <TresGroup ref="parallaxGroup">
      <TresMesh
        :position="[0, 0, -4]"
        :render-order="0"
      >
        <TresPlaneGeometry :args="[20, 14]" />
        <TresShaderMaterial
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :uniforms="uniforms"
          :transparent="true"
          :depth-write="false"
        />
      </TresMesh>

      <TresMesh
        v-for="(logo, i) in logos"
        :key="logo.label"
        :ref="
          (el: any) => {
            if (el) logoRefs[i] = el;
          }
        "
        :position="logo.position"
        :scale="0"
        :render-order="10"
      >
        <TresPlaneGeometry :args="[LOGO_W, LOGO_H]" />
        <TresMeshBasicMaterial
          :map="logo.texture"
          :transparent="true"
          :opacity="0"
        />
      </TresMesh>
    </TresGroup>
  </TresCanvas>
</template>

<script setup lang="ts">
import { useRenderLoop } from '@tresjs/core'
import { useMouse, useWindowSize } from '@vueuse/core'
import * as THREE from 'three'

const { width: vw } = useWindowSize()
const isMobile = computed(() => vw.value < 640)
const dpr = computed(() =>
  isMobile.value
    ? Math.min(window.devicePixelRatio, 1.5)
    : Math.min(window.devicePixelRatio, 2),
)

const { x: mouseX, y: mouseY } = useMouse({ type: 'client' })

// ── Code-rain background ─────────────────────────────────────────────

const codeLines = [
  '<script setup lang="ts">',
  'const route = useRoute()',
  'const { data } = await useFetch(\'/api/posts\')',
  'defineProps<{ open: boolean }>()',
  'const isOpen = ref(false)',
  'watch(() => props.open, (v) => emit(\'change\', v))',
  'onMounted(() => { /* ... */ })',
  'useState(\'count\', () => 0)',
  '<template><div /></template>',
  'export default defineNuxtConfig({',
  '  modules: [\'@nuxt/content\'],',
  '})',
  'const colorMode = useColorMode()',
  'useAsyncData(\'posts\', () => $fetch(\'/api\'))',
  'queryCollection(\'blog\').order(\'id\').all()',
  'export function useToast() { /* ... */ }',
  'import { useMagicKeys } from \'@vueuse/core\'',
  'navigateTo(\'/blog\')',
  'defineExpose({ open, close })',
  '<NuxtLink :to="`/blog/${slug}`">',
  'const router = useRouter()',
  'useSeoMeta({ title: () => post.title })',
  'await Promise.all(tasks.map(run))',
  'const cache = new Map<string, T>()',
  'type Maybe<T> = T | null | undefined',
  'satisfies Record<string, unknown>',
  'export const useScene = () => ({ ... })',
  'const colors = tw`bg-primary-600 text-white`',
  'definePageMeta({ layout: \'blog\' })',
  'useHead({ link: [{ rel: \'preconnect\' }] })',
  'const { copy } = useClipboard()',
  'const { y } = useWindowScroll()',
]

const CODE_CANVAS_W = 2048
const CODE_CANVAS_H = 4096
const CODE_FONT_PX = 36
const CODE_LINE_HEIGHT = 56
const CODE_COLUMN_W = 720

const makeCodeTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas')
  canvas.width = CODE_CANVAS_W
  canvas.height = CODE_CANVAS_H

  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = `${CODE_FONT_PX}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.textBaseline = 'top'

  const columns = Math.ceil(canvas.width / CODE_COLUMN_W) + 1

  for (let c = 0; c < columns; c++) {
    const colX = c * CODE_COLUMN_W + 16 + Math.random() * 48
    const offset = Math.floor(Math.random() * codeLines.length)
    const linesInCol = Math.ceil(canvas.height / CODE_LINE_HEIGHT)
    for (let l = 0; l < linesInCol; l++) {
      const line = codeLines[(offset + l) % codeLines.length]!
      const alpha = 0.4 + Math.random() * 0.45
      ctx.fillStyle = `rgba(125, 211, 252, ${alpha})`
      ctx.fillText(line, colX, l * CODE_LINE_HEIGHT)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  return texture
}

const codeTexture = makeCodeTexture()

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    uv.y -= uTime * 0.04;
    uv.y = fract(uv.y);

    vec4 tex = texture2D(uTexture, uv * vec2(1.5, 2.0));

    float vignette = smoothstep(1.2, 0.2, length(vUv - 0.5) * 1.7);
    float scanline = 0.92 + 0.08 * sin(uv.y * 1200.0);

    vec3 color = tex.rgb * scanline;
    float alpha = tex.a * uOpacity * vignette;

    gl_FragColor = vec4(color, alpha);
  }
`

const uniforms = {
  uTexture: { value: codeTexture },
  uTime: { value: 0 },
  uOpacity: { value: 0.9 },
}

// ── Logo pills ───────────────────────────────────────────────────────

interface Logo {
  label: string
  sublabel: string
  color: string
  position: [number, number, number]
  texture: THREE.CanvasTexture
}

const LOGO_W = 3
const LOGO_H = 1.1

const BRAND_PATHS: Record<string, string> = {
  Vue: 'M24,1.61H14.06L12,5.16 9.94,1.61H0L12,22.39ZM12,14.08 5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z',
  Nuxt: 'M13.5 2.6 22.9 19a2 2 0 0 1-1.7 3H14l-2.3-4 3.7-6.4-3-5.2a1.4 1.4 0 0 0-2.4 0L1 19a2 2 0 0 0 1.8 3h4.6c1.7 0 2.9-.7 3.7-2.1l5.3-9.2H13l-2 3.5-2-3.5L11.1 2.6a1.4 1.4 0 0 1 2.4 0z',
  Tailwind:
    'M12 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.7.2 1.3.7 1.9 1.4 1 1.1 2.2 2.4 4.9 2.4 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.7-.2-1.3-.7-1.9-1.4-1-1.1-2.2-2.4-4.9-2.4zm-5 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.7.2 1.3.7 1.9 1.4 1 1.1 2.2 2.4 4.9 2.4 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.7-.2-1.3-.7-1.9-1.4-1-1.1-2.2-2.4-4.9-2.4z',
  React: '',
  TS: '',
  GSAP: '',
}

const drawBrandIcon = (
  ctx: CanvasRenderingContext2D,
  label: string,
  cx: number,
  cy: number,
  r: number,
) => {
  ctx.save()
  ctx.translate(cx, cy)
  const s = (2 * r) / 24
  ctx.scale(s, s)
  ctx.translate(-12, -12)
  ctx.fillStyle = '#ffffff'

  const path = BRAND_PATHS[label]
  if (path) {
    ctx.fill(new Path2D(path))
    ctx.restore()
    return
  }

  ctx.restore()
  ctx.save()
  ctx.translate(cx, cy)

  if (label === 'React') {
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = r * 0.11
    for (let i = 0; i < 3; i++) {
      ctx.save()
      ctx.rotate((i * Math.PI) / 3)
      ctx.beginPath()
      ctx.ellipse(0, 0, r * 0.95, r * 0.38, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  }
  else if (label === 'TS') {
    ctx.fillStyle = '#ffffff'
    ctx.font = `800 ${r * 1.25}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('TS', 0, r * 0.08)
  }
  else if (label === 'GSAP') {
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = r * 0.18
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.7, Math.PI * 0.25, Math.PI * 1.9)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(r * 0.05, 0)
    ctx.lineTo(r * 0.75, 0)
    ctx.lineTo(r * 0.45, r * 0.35)
    ctx.stroke()
  }
  ctx.restore()
}

const makeLabelTexture = (
  label: string,
  sublabel: string,
  color: string,
): THREE.CanvasTexture => {
  const W = 768
  const H = 280

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H

  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, W, H)

  const radius = 64
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(W - radius, 0)
  ctx.quadraticCurveTo(W, 0, W, radius)
  ctx.lineTo(W, H - radius)
  ctx.quadraticCurveTo(W, H, W - radius, H)
  ctx.lineTo(radius, H)
  ctx.quadraticCurveTo(0, H, 0, H - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()

  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, 'rgba(17, 24, 39, 0.85)')
  bgGrad.addColorStop(1, 'rgba(17, 24, 39, 0.55)')
  ctx.fillStyle = bgGrad
  ctx.fill()

  ctx.strokeStyle = `${color}cc`
  ctx.lineWidth = 4
  ctx.stroke()

  const badgeX = 105
  const badgeY = H / 2
  const badgeR = 75

  const badgeGrad = ctx.createRadialGradient(
    badgeX - 18,
    badgeY - 22,
    10,
    badgeX,
    badgeY,
    badgeR,
  )
  badgeGrad.addColorStop(0, `${color}ff`)
  badgeGrad.addColorStop(1, `${color}aa`)

  ctx.shadowColor = `${color}88`
  ctx.shadowBlur = 22
  ctx.beginPath()
  ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2)
  ctx.fillStyle = badgeGrad
  ctx.fill()
  ctx.shadowBlur = 0

  ctx.strokeStyle = 'rgba(255,255,255,0.4)'
  ctx.lineWidth = 2
  ctx.stroke()

  drawBrandIcon(ctx, label, badgeX, badgeY, badgeR * 0.78)

  const textX = badgeX + badgeR + 30
  ctx.textAlign = 'left'

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 64px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(label, textX, badgeY - 26)

  ctx.fillStyle = `${color}ee`
  ctx.font = '500 28px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(sublabel, textX, badgeY + 32)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  return texture
}

const logoConfigs: Array<{
  label: string
  sublabel: string
  color: string
  position: [number, number, number]
}> = [
  {
    label: 'Vue',
    sublabel: 'Reactive UI framework',
    color: '#42b883',
    position: [-3.5, 1.8, 0.3],
  },
  {
    label: 'Nuxt',
    sublabel: 'Full-stack meta-framework',
    color: '#00dc82',
    position: [3.5, 1.8, -0.4],
  },
  {
    label: 'Tailwind',
    sublabel: 'Utility-first CSS',
    color: '#38bdf8',
    position: [0, 2.4, -0.6],
  },
  {
    label: 'React',
    sublabel: 'Component UI library',
    color: '#61dafb',
    position: [-3.5, -1.8, 0.6],
  },
  {
    label: 'TS',
    sublabel: 'Static typing for JS',
    color: '#3178c6',
    position: [3.5, -1.8, -0.2],
  },
  {
    label: 'GSAP',
    sublabel: 'Animation engine',
    color: '#88ce02',
    position: [0, -2.4, 0.5],
  },
]

const logos: Logo[] = logoConfigs.map(c => ({
  ...c,
  texture: makeLabelTexture(c.label, c.sublabel, c.color),
}))

if (isMobile.value) {
  logos.splice(3)
}

const parallaxGroup = shallowRef<THREE.Group | null>(null)
const logoRefs: THREE.Mesh[] = []

// `useRenderLoop` is a Tres-wide singleton — never call its `pause()` here,
// it would also freeze other TresCanvas instances (e.g. CanvasGlobe).
const { onLoop } = useRenderLoop()

const INTRO_STAGGER = 0.12
const INTRO_DURATION = 0.9
const easeOutBack = (t: number) => {
  const c = 1.70158
  const p = t - 1
  return 1 + (c + 1) * p * p * p + c * p * p
}

let introStart = 0

const { off: stopLoop } = onLoop(({ elapsed }) => {
  if (!introStart) introStart = elapsed
  uniforms.uTime.value = elapsed

  if (parallaxGroup.value) {
    const targetRotY = (mouseX.value / window.innerWidth - 0.5) * 0.35
    const targetRotX = -(mouseY.value / window.innerHeight - 0.5) * 0.2
    parallaxGroup.value.rotation.y
      += (targetRotY - parallaxGroup.value.rotation.y) * 0.05
    parallaxGroup.value.rotation.x
      += (targetRotX - parallaxGroup.value.rotation.x) * 0.05
  }

  logoRefs.forEach((mesh, i) => {
    if (!mesh) return
    const cfg = logoConfigs[i]!

    const t = Math.min(
      Math.max((elapsed - introStart - i * INTRO_STAGGER) / INTRO_DURATION, 0),
      1,
    )
    const intro = easeOutBack(t)
    mesh.scale.setScalar(intro)
    const material = mesh.material as THREE.MeshBasicMaterial
    material.opacity = t

    mesh.position.y = cfg.position[1] + Math.sin(elapsed * 0.8 + i) * 0.15
    mesh.rotation.z = Math.sin(elapsed * 0.4 + i) * 0.05
    mesh.rotation.y = Math.sin(elapsed * 0.3 + i * 1.7) * 0.12
  })
})

onUnmounted(() => {
  stopLoop()
  codeTexture.dispose()
  logos.forEach(l => l.texture.dispose())
})
</script>
