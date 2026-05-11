<template>
  <TresCanvas
    clear-color="#0b1020"
    window-size
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

    <TresGroup
      ref="parallaxGroup"
      :rotation="[0, 0, 0]"
    >
      <TresMesh :position="[0, 0, -4]">
        <TresPlaneGeometry :args="[18, 12]" />
        <TresShaderMaterial
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :uniforms="uniforms"
          :transparent="true"
          :depth-write="false"
        />
      </TresMesh>

      <TresGroup
        v-for="(logo, i) in logos"
        :key="logo.label"
        :position="logo.position"
      >
        <TresMesh
          :ref="(el: any) => { if (el) logoRefs[i] = el }"
          :rotation="[0, 0, 0]"
        >
          <TresPlaneGeometry :args="[1.8, 0.6]" />
          <TresMeshBasicMaterial
            :map="logo.texture"
            :transparent="true"
            :opacity="0.92"
            :depth-write="false"
          />
        </TresMesh>
      </TresGroup>
    </TresGroup>
  </TresCanvas>
</template>

<script setup lang="ts">
import { useRenderLoop } from '@tresjs/core'
import { useMouse, useWindowSize } from '@vueuse/core'
import * as THREE from 'three'

const { width: vw } = useWindowSize()
const isMobile = computed(() => vw.value < 640)
const dpr = computed(() => (isMobile.value ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2)))

const { x: mouseX, y: mouseY } = useMouse({ type: 'client' })

const codeLines = [
  '<script setup lang="ts">',
  'const route = useRoute()',
  'const { data } = await useFetch(\'/api/posts\')',
  'defineProps<{ open: boolean }>()',
  'const isOpen = ref(false)',
  'watch(() => props.open, (v) => emit(\'change\', v))',
  'onMounted(() => { ... })',
  'useState(\'count\', () => 0)',
  '<template><div></div></template>',
  'export default defineNuxtConfig({',
  '  modules: [\'@nuxt/content\'],',
  '})',
  'const colorMode = useColorMode()',
  'useAsyncData(\'posts\', () => $fetch(\'/api\'))',
  'queryCollection(\'blog\').order(\'id\').all()',
  'export function useToast() {',
  '  const toasts = useState(...)',
  '  return { push, dismiss }',
  '}',
  'import { useMagicKeys } from \'@vueuse/core\'',
  'navigateTo(\'/blog\')',
  'defineExpose({ open, close })',
  '<NuxtLink :to=\"`/blog/${slug}`\">',
  'const router = useRouter()',
  'useSeoMeta({ title: () => post.title })',
  'function* generate() { yield 42 }',
  'await Promise.all(tasks.map(run))',
  'const cache = new Map<string, T>()',
  'type Maybe<T> = T | null | undefined',
  'satisfies Record<string, unknown>',
  'export const useScene = () => ({...})',
]

const makeCodeTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 2048
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#0b1020'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = '18px ui-monospace, SFMono-Regular, Menlo, monospace'
  ctx.textBaseline = 'top'

  const lineHeight = 28
  const columnWidth = 360
  const columns = Math.ceil(canvas.width / columnWidth) + 1

  for (let c = 0; c < columns; c++) {
    const colX = c * columnWidth + 8 + Math.random() * 24
    const offset = Math.floor(Math.random() * codeLines.length)
    const linesInCol = Math.ceil(canvas.height / lineHeight)
    for (let l = 0; l < linesInCol; l++) {
      const line = codeLines[(offset + l) % codeLines.length]!
      const alpha = 0.15 + Math.random() * 0.25
      ctx.fillStyle = `rgba(125, 211, 252, ${alpha})`
      ctx.fillText(line, colX, l * lineHeight)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
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

    vec4 tex = texture2D(uTexture, uv * vec2(1.0, 2.0));

    float vignette = smoothstep(1.2, 0.2, length(vUv - 0.5) * 1.8);
    float scanline = 0.92 + 0.08 * sin(uv.y * 800.0);

    vec3 color = tex.rgb * scanline;
    float alpha = tex.a * uOpacity * vignette;

    gl_FragColor = vec4(color, alpha);
  }
`

const uniforms = {
  uTexture: { value: codeTexture },
  uTime: { value: 0 },
  uOpacity: { value: 0.55 },
}

interface Logo {
  label: string
  color: string
  position: [number, number, number]
  texture: THREE.CanvasTexture
}

const makeLabelTexture = (label: string, color: string): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 192
  const ctx = canvas.getContext('2d')!

  const radius = 48
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(canvas.width - radius, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius)
  ctx.lineTo(canvas.width, canvas.height - radius)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height)
  ctx.lineTo(radius, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  grad.addColorStop(0, `${color}cc`)
  grad.addColorStop(1, `${color}77`)
  ctx.fillStyle = grad
  ctx.fill()

  ctx.strokeStyle = `${color}ff`
  ctx.lineWidth = 4
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 76px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, canvas.width / 2, canvas.height / 2 + 4)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

const logoConfigs: Array<{ label: string, color: string, position: [number, number, number] }> = [
  { label: 'Vue', color: '#42b883', position: [-3.2, 1.6, 0.5] },
  { label: 'Nuxt', color: '#00dc82', position: [3.0, 1.9, -0.2] },
  { label: 'React', color: '#61dafb', position: [-2.8, -1.4, 0.8] },
  { label: 'TS', color: '#3178c6', position: [2.7, -1.6, 1.2] },
  { label: 'Tailwind', color: '#38bdf8', position: [0, 2.4, -0.5] },
  { label: 'GSAP', color: '#88ce02', position: [0, -2.2, 0.4] },
]

const logos: Logo[] = logoConfigs.map(c => ({
  ...c,
  texture: makeLabelTexture(c.label, c.color),
}))

if (isMobile.value) {
  logos.splice(3)
}

const parallaxGroup = shallowRef<THREE.Group | null>(null)
const logoRefs = shallowRef<THREE.Mesh[]>([])

const { onLoop, pause, resume } = useRenderLoop()

onLoop(({ elapsed }) => {
  uniforms.uTime.value = elapsed

  if (parallaxGroup.value) {
    const targetRotY = (mouseX.value / window.innerWidth - 0.5) * 0.35
    const targetRotX = -(mouseY.value / window.innerHeight - 0.5) * 0.2
    parallaxGroup.value.rotation.y += (targetRotY - parallaxGroup.value.rotation.y) * 0.05
    parallaxGroup.value.rotation.x += (targetRotX - parallaxGroup.value.rotation.x) * 0.05
  }

  logoRefs.value.forEach((mesh, i) => {
    if (!mesh) return
    const cfg = logoConfigs[i]!
    mesh.position.y = cfg.position[1] + Math.sin(elapsed * 0.8 + i) * 0.15
    mesh.rotation.z = Math.sin(elapsed * 0.4 + i) * 0.05
    mesh.rotation.y = Math.sin(elapsed * 0.3 + i * 1.7) * 0.12
  })
})

onBeforeUnmount(() => {
  pause()
  codeTexture.dispose()
  logos.forEach(l => l.texture.dispose())
})

defineExpose({ pause, resume })
</script>
