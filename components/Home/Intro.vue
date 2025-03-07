<template>
  <section
    class="relative w-full h-screen flex items-center justify-center bg-base-bg text-base-text overflow-hidden"
  >
    <div class="absolute flex flex-col items-start justify-center z-10 pl-32">
      <h1
        ref="title"
        class="text-h1 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-800 text-[clamp(52px,6vw,68px)]"
      >
        Big John
      </h1>
      <p ref="subtitle" class="text-p mt-10 text-[clamp(20px,3vw,26px)]">
        - {{ t("intro.subtitle") }}
      </p>
      <button
        ref="cta"
        class="mt-14 px-10 py-5 bg-gradient-to-r from-gray-600 to-gray-900 text-white rounded-xl shadow-lg hover:shadow-2xl hover:from-gray-700 hover:to-gray-950 text-xl font-semibold"
      >
        {{ t("intro.cta") }}
      </button>
    </div>
    <canvas
      ref="canvas"
      class="absolute top-1/2 right-0 transform -translate-y-1/2 w-[700px] h-[700px] z-0"
    ></canvas>
  </section>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { templateRef } from "@vueuse/core";
import * as THREE from "three";
const { t } = useI18n();

const title = templateRef("title");
const subtitle = templateRef("subtitle");
const cta = templateRef("cta");
const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  gsap.from(title.value, { x: -100, opacity: 0, duration: 0.8 });
  gsap.from(subtitle.value, { x: -100, opacity: 0, duration: 1, delay: 0.2 });
  gsap.from(cta.value, {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.4,
    ease: "power2.out",
  });

  const ctaEl = cta.value;
  ctaEl?.addEventListener("mouseenter", () => {
    gsap.to(ctaEl, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
      background: "linear-gradient(to right, #4b5563, #1f2937)",
    });
  });
  ctaEl?.addEventListener("mouseleave", () => {
    gsap.to(ctaEl, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      background: "linear-gradient(to right, #4b5563, #111827)",
    });
  });

  if (canvas.value) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      alpha: true,
    });
    renderer.setSize(700, 700);

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

    const updateColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const globeColor = isDark ? 0xb0b0b0 : 0x000000;
      sphereMaterial.uniforms.color.value.set(globeColor);
      ringMaterial.color.set(globeColor);
      particlesMaterial.color.set(globeColor);
    };

    updateColors();

    const observer = new MutationObserver(() => updateColors());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.001;
      ring.rotation.z += 0.001;
      sphereMaterial.uniforms.time.value += 0.01;
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    onUnmounted(() => {
      observer.disconnect();
    });
  }
});
</script>

<style scoped lang="scss">
canvas {
  filter: drop-shadow(0 0 20px var(--shadow-color));
}
</style>
