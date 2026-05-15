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

// Single-path SVGs from simple-icons (CC0). All authored in a 24x24 viewBox
// so they can be uniformly scaled into the badge.
const BRAND_PATHS: Record<string, string> = {
  Vue: 'M24,1.61H14.06L12,5.16 9.94,1.61H0L12,22.39ZM12,14.08 5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z',
  Nuxt: 'M13.5 2.6 22.9 19a2 2 0 0 1-1.7 3H14l-2.3-4 3.7-6.4-3-5.2a1.4 1.4 0 0 0-2.4 0L1 19a2 2 0 0 0 1.8 3h4.6c1.7 0 2.9-.7 3.7-2.1l5.3-9.2H13l-2 3.5-2-3.5L11.1 2.6a1.4 1.4 0 0 1 2.4 0z',
  Tailwind:
    'M12 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.7.2 1.3.7 1.9 1.4 1 1.1 2.2 2.4 4.9 2.4 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.7-.2-1.3-.7-1.9-1.4-1-1.1-2.2-2.4-4.9-2.4zm-5 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.7.2 1.3.7 1.9 1.4 1 1.1 2.2 2.4 4.9 2.4 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.7-.2-1.3-.7-1.9-1.4-1-1.1-2.2-2.4-4.9-2.4z',
  React: 'M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z',
  TS: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z',
  GSAP: 'M17.21 0c-.545.003-1.084.134-1.256.367-.11.165-.192 1.196-.11 1.718 0 0 .032.345.09.614a14.6 14.6 0 0 1-.02.182 7.024 7.024 0 0 1-.097.605c-.01.056-.207.095-.425.152a2.495 2.495 0 0 0-.138-.042c-.234-.069-.385.123-.618.26-.069-.04-.371-.178-.536-.082-.165.096-.275.193-.44.261-.082-.041-.302-.041-.48.028a1.27 1.27 0 0 0-.483.278c-2.314.58-4.813 1.635-5.012 1.741-1.017.522-2.679 1.415-3.434 2.033-1.291 1.071-2.06 2.322-2.363 3.242-.385 1.14-.275 1.827.096 1.387.298-.366 1.632-1.454 2.475-1.999l-.002.007a3.219 3.219 0 0 1 .44-.26l.233-.124.505-.323c.602.552.803 1.433.937 2.63.22 1.841 1.704 2.693 3.434 2.72 1.8.028 2.446.399 3.119 1.305.153.201.318.307.47.368a1.954 1.954 0 0 0-.16.405c-.075.17-.125.38-.157.608a.157.157 0 0 0-.03.075c-.068.536-.055 1.8-.068 2.473-.014.673-.028.77-.083.866-.055.11-.11.178-.178.467-.069.302-.193.384-.316.631-.206.385-.165.81.041 1.003.206.192.77.481 1.538.385.77-.096.88-.151.756-.893-.014-.11-.192-.605-.137-.797.082-.206-.096-.563-.055-.577.041-.014.096-.288.096-.426 0-.137-.014-.796.137-1.14.062-.14.193-.46.326-.785.442-.723.459-1.161.48-1.41.03-.202.046-.46.018-.744.055-.083.289-.275.316-.646 0 0 .644-.337 1.102-1.148.16.557.31.91.286 1.272-.499.39-.684.678-.76.959-.048-.02-.076-.037-.11-.04h-.027a.437.437 0 0 0-.106.029c-.192.068-.041 1.318.165 1.827.206.508.316.81.398 1.36.083.549-.192 1.222-.302 1.524 0 0-.179.536.233.824.358.248 1.704.18 2.308.18.605 0 1.511.219 2.088.109.715-.124.824-.55.399-.77-.426-.22-1.072-.329-1.91-.933-.22-.152-.522-.289-.563-.412-.041-.124-.041-.838-.027-1.457.013-.618.22-1.414.288-1.84.064-.398-.076-.388-.262-.351.032-.147.066-.292.097-.446.344-.632.193-1.223.193-1.223.82-1.044.4-3.27.22-4.048.64.303.96.188.96.188.102-.055.192-.134.274-.224.337-.362.51-.916.51-.916V11c.782-.783 1.151-1.936.26-2.692a1.331 1.331 0 0 0-.219-1.263 1.56 1.56 0 0 0-.37-1.731 1.36 1.36 0 0 0-.487-.297c-.2-.295-.245-.417-.572-.349-.15-.165-.178-.288-.494-.178 0 0-.096-.234-.275-.289a.25.25 0 0 0-.05-.015c-.302-.21-.576-.215-.772-.16-.064-.048-.061-.124-.07-.388-.008-.2-.019-.486-.031-.744.027-.328.102-.974.126-1.303.028-.37.042-.948-.123-1.195C18.303.12 17.754-.003 17.21 0zm-.005.34c.7 0 1.002.22 1.044.343.013.028.082.495.04.797-.013.11-.027.509-.054.687-.014.179-.069.385-.124.673-.041.234-.233.495-.384.536-.261.069-.742.055-1.017 0-.069-.014-.124-.055-.192-.096-.151-.248-.234-.44-.261-.742-.028-.289-.083-.412-.096-.632-.014-.33-.014-.55-.014-.55.014-.178.069-.618.069-.659.013-.123.233-.357.989-.357z',
}

const drawBrandIcon = (
  ctx: CanvasRenderingContext2D,
  label: string,
  cx: number,
  cy: number,
  r: number,
) => {
  const path = BRAND_PATHS[label]
  if (!path) return
  ctx.save()
  ctx.translate(cx, cy)
  const s = (2 * r) / 24
  ctx.scale(s, s)
  ctx.translate(-12, -12)
  ctx.fillStyle = '#ffffff'
  ctx.fill(new Path2D(path))
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
// Damping rate (higher = snappier). Frame-rate independent via MathUtils.damp.
const PARALLAX_LAMBDA = 4

const { off: stopLoop } = onLoop(({ elapsed, delta }) => {
  if (!introStart) introStart = elapsed
  uniforms.uTime.value = elapsed

  if (parallaxGroup.value) {
    const targetRotY = (mouseX.value / window.innerWidth - 0.5) * 0.35
    const targetRotX = -(mouseY.value / window.innerHeight - 0.5) * 0.2
    parallaxGroup.value.rotation.y = THREE.MathUtils.damp(
      parallaxGroup.value.rotation.y,
      targetRotY,
      PARALLAX_LAMBDA,
      delta,
    )
    parallaxGroup.value.rotation.x = THREE.MathUtils.damp(
      parallaxGroup.value.rotation.x,
      targetRotX,
      PARALLAX_LAMBDA,
      delta,
    )
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
