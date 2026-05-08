<template>
  <canvas
    ref="canvas"
    class="w-full max-w-[400px] sm:max-w-[600px] xl2:max-w-[800px] aspect-square z-0"
  ></canvas>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { useDark } from '@vueuse/core'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const isDark = useDark()

onMounted(() => {
  if (canvas.value) {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, 1, 1, 2000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      alpha: true,
    })
    const resizeCanvas = () => {
      const size = canvas.value?.parentElement?.clientWidth || 800
      const newSize = Math.min(size, 800)
      renderer.setSize(newSize, newSize)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const sphereGeometry = new THREE.SphereGeometry(2, 58, 58)
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x000000) },
        time: { value: 0.0 },
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying vec3 vPosition;
        void main() {
          float glow = 0.1 + abs(sin(time + vPosition.y)) * 0.15;
          gl_FragColor = vec4(color, glow);
        }
      `,
      wireframe: true,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(sphere)

    const ringGeometry = new THREE.RingGeometry(2.5, 2.7, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)

    const particleCount = 200
    const particlesGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    )
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x000000,
      size: 0.05,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    camera.position.z = 4

    watchEffect(() => {
      const globeColor = isDark.value ? 0xb0b0b0 : 0x000000
      sphereMaterial.uniforms!.color!.value.set(globeColor)
      ringMaterial.color.set(globeColor)
      particlesMaterial.color.set(globeColor)
    })

    const animate = () => {
      requestAnimationFrame(animate)
      sphere.rotation.y += 0.001
      ring.rotation.z += 0.001
      sphereMaterial.uniforms!.time!.value += 0.01
      particles.rotation.y += 0.0005
      sphere.scale.set(
        1 + Math.sin(sphereMaterial.uniforms!.time!.value * 0.5) * 0.05,
        1 + Math.sin(sphereMaterial.uniforms!.time!.value * 0.5) * 0.05,
        1 + Math.sin(sphereMaterial.uniforms!.time!.value * 0.5) * 0.05,
      )
      renderer.render(scene, camera)
    }
    animate()
  }
})
</script>
