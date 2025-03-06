<template>
  <section
    class="relative w-full h-screen flex items-center justify-center bg-base-bg text-base-text overflow-hidden"
  >
    <div class="text-center z-10">
      <h1
        ref="title"
        class="text-h1 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-700"
      >
        Big John
      </h1>
      <p ref="subtitle" class="text-p mt-4">Tvořím weby s Vue a PHP</p>
      <button
        ref="cta"
        class="mt-8 px-6 py-3 bg-button-bg rounded-lg hover:scale-105 transition duration-300"
      >
        Můj progres
      </button>
    </div>
    <canvas
      ref="canvas"
      class="absolute bottom-0 right-0 w-[300px] h-[300px]"
    ></canvas>
  </section>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { templateRef } from "@vueuse/core";
import * as THREE from "three";

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
    ease: "bounce",
  });

  if (canvas.value) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      alpha: true,
    });
    renderer.setSize(300, 300);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }
});
</script>

<style scoped lang="scss">
// Pokud chceš extra SCSS styly
canvas {
  filter: drop-shadow(0 0 10px var(--shadow-color));
}
</style>
