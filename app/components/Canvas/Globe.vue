<template>
  <div class="w-full max-w-[400px] sm:max-w-[600px] xl2:max-w-[800px] aspect-square">
    <TresCanvas
      :alpha="true"
      :clear-alpha="0"
      :antialias="true"
      render-mode="always"
      class="w-full h-full"
    >
      <TresPerspectiveCamera
        :position="[0, 0, 4]"
        :fov="70"
        :near="1"
        :far="2000"
      />

      <TresMesh ref="sphereRef">
        <TresSphereGeometry :args="[2, 58, 58]" />
        <TresShaderMaterial
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :uniforms="uniforms"
          :wireframe="true"
          :transparent="true"
        />
      </TresMesh>

      <TresMesh
        ref="ringRef"
        :rotation="[Math.PI / 2, 0, 0]"
      >
        <TresRingGeometry :args="[2.5, 2.7, 64]" />
        <TresMeshBasicMaterial
          :color="globeColor"
          :side="DoubleSide"
        />
      </TresMesh>

      <TresPoints ref="particlesRef">
        <TresBufferGeometry>
          <TresBufferAttribute
            attach="attributes-position"
            :args="[particlePositions, 3]"
          />
        </TresBufferGeometry>
        <TresPointsMaterial
          :color="globeColor"
          :size="0.05"
        />
      </TresPoints>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { useRenderLoop } from '@tresjs/core'
import * as THREE from 'three'

const { DoubleSide } = THREE
const Math_ = Math

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const globeColor = computed(() => (isDark.value ? '#b0b0b0' : '#000000'))

const sphereRef = shallowRef<THREE.Mesh | null>(null)
const ringRef = shallowRef<THREE.Mesh | null>(null)
const particlesRef = shallowRef<THREE.Points | null>(null)

const uniforms = {
  color: { value: new THREE.Color(0x000000) },
  time: { value: 0 },
}

watch(globeColor, (c) => {
  uniforms.color.value.set(c)
}, { immediate: true })

const particleCount = 200
const particlePositions = new Float32Array(particleCount * 3)
for (let i = 0; i < particleCount * 3; i++) {
  particlePositions[i] = (Math_.random() - 0.5) * 10
}

const vertexShader = /* glsl */ `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 color;
  uniform float time;
  varying vec3 vPosition;
  void main() {
    float glow = 0.1 + abs(sin(time + vPosition.y)) * 0.15;
    gl_FragColor = vec4(color, glow);
  }
`

const { onLoop } = useRenderLoop()

onLoop(({ delta }) => {
  uniforms.time.value += delta

  if (sphereRef.value) {
    sphereRef.value.rotation.y += 0.001
    const t = uniforms.time.value
    const scale = 1 + Math_.sin(t * 0.5) * 0.05
    sphereRef.value.scale.set(scale, scale, scale)
  }
  if (ringRef.value) {
    ringRef.value.rotation.z += 0.001
  }
  if (particlesRef.value) {
    particlesRef.value.rotation.y += 0.0005
  }
})
</script>
