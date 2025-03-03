<template>
  <div class="flex flex-col min-h-screen">
    <header class="relative p-6 overflow-hidden sticky top-0 z-50">
      <div ref="parallaxBg" class="absolute inset-0 pointer-events-none">
        <div class="bg-gradient"></div>
        <div class="gradient-overlay"></div>
      </div>
      <div class="relative z-10 flex justify-around items-center gap-8">
        <nav class="flex space-x-24">
          <NuxtLink
            v-for="link in leftLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
          >
            {{ $t(link.label) }}
          </NuxtLink>
          <NuxtLink to="/" class="logo-link">
            <NuxtImg
              src="/logo_bj.webp"
              alt="Site Logo"
              class="h-12 w-auto transform hover:scale-110 transition-transform duration-300"
            />
          </NuxtLink>
          <NuxtLink
            v-for="link in rightLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
          >
            {{ $t(link.label) }}
          </NuxtLink>
        </nav>
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const parallaxBg = ref(null);

const links = [
  { to: "/contact", label: "nav.contact" },
  { to: "/references", label: "nav.references" },
  { to: "/progress", label: "nav.progress" },
  { to: "/about", label: "nav.about" },
];

const midIndex = Math.floor(links.length / 2);
const leftLinks = links.slice(0, midIndex);
const rightLinks = links.slice(midIndex);

onMounted(() => {
  gsap.to(parallaxBg.value, {
    y: "20%",
    ease: "none",
    scrollTrigger: {
      trigger: parallaxBg.value,
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });

  gsap.from(".logo-link", {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: "power2.out",
  });
});
</script>

<style scoped>
header {
  background-color: #f9fafb;
  height: 100px;
}

.bg-gradient {
  position: absolute;
  top: -40%;
  left: 0;
  width: 100%;
  height: 180%;
  background: radial-gradient(
    circle at center,
    #e5e7eb 0%,
    #d1d5db 50%,
    #f9fafb 100%
  );
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(249, 250, 251, 0.5),
    rgba(249, 250, 251, 0.5)
  );
}

.nav-link {
  color: #1f2937;
  font-size: 18px;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.logo-link {
  text-decoration: none;
}
</style>
