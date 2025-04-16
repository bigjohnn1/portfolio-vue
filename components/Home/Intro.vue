<template>
  <section
    class="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-light-bg to-primary-50 overflow-hidden"
  >
    <div class="absolute top-10 right-10 z-20">
      <AppLocaleSwitcher />
    </div>
    <div
      class="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 relative z-10"
    >
      <div class="flex flex-col gap-8">
        <h1
          ref="title"
          class="text-h1 font-extrabold bg-gradient-to-r from-primary-500 to-primary-800 text-[clamp(52px,6vw,68px)] [text-shadow:_0_0_1px_#000,0_0_4px_#000]"
        >
          Big John
        </h1>
        <p
          ref="subtitle"
          class="text-p text-[clamp(20px,3vw,26px)] text-fantasy-text"
        >
          - {{ t("intro.subtitle") }}
        </p>
        <button
          ref="cta"
          class="px-12 py-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-2xl font-bold rounded-xl shadow-xl hover:shadow-2xl hover:from-primary-700 hover:to-primary-900 transition-all duration-300 transform hover:scale-110 animate-fade-up"
        >
          {{ t("intro.cta") }}
        </button>
      </div>
      <canvas ref="canvas" class="lg:w-1/2 w-[800px] h-[800px] z-0"></canvas>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { templateRef } from "@vueuse/core";
import * as THREE from "three";
import { useDark } from "@vueuse/core";

const { t } = useI18n();

const title = templateRef("title");
const subtitle = templateRef("subtitle");
const cta = templateRef("cta");
const canvas = ref<HTMLCanvasElement | null>(null);

const isDark = useDark();

onMounted(() => {
  gsap.from(title.value, { x: -100, opacity: 0, duration: 0.8 });
  gsap.from(subtitle.value, { x: -100, opacity: 0, duration: 1, delay: 0.2 });

  if (canvas.value) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 1, 2000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      alpha: true,
    });
    renderer.setSize(800, 800);

    const sphereGeometry = new THREE.SphereGeometry(2, 58, 58);
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
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    const ringGeometry = new THREE.RingGeometry(2.5, 2.7, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x000000,
      size: 0.05,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 4;

    watchEffect(() => {
      const globeColor = isDark.value ? 0xb0b0b0 : 0x000000;
      sphereMaterial.uniforms.color.value.set(globeColor);
      ringMaterial.color.set(globeColor);
      particlesMaterial.color.set(globeColor);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.001;
      ring.rotation.z += 0.001;
      sphereMaterial.uniforms.time.value += 0.01;
      particles.rotation.y += 0.0005;
      sphere.scale.set(
        1 + Math.sin(sphereMaterial.uniforms.time.value * 0.5) * 0.05,
        1 + Math.sin(sphereMaterial.uniforms.time.value * 0.5) * 0.05,
        1 + Math.sin(sphereMaterial.uniforms.time.value * 0.5) * 0.05
      );
      renderer.render(scene, camera);
    };
    animate();
  }
});
</script>

<style>
.animate-fade-up {
  animation: fadeUp 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
