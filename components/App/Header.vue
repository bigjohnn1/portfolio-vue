<template>
  <div class="flex flex-col min-h-screen">
    <header class="relative p-6 overflow-hidden sticky top-0 z-50">
      <div ref="parallaxBg" class="absolute inset-0 pointer-events-none">
        <div class="stars-bg"></div>
        <div class="gradient-overlay"></div>
      </div>
      <div class="relative z-10 flex justify-around items-center gap-8">
        <nav class="flex space-x-16">
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
  gsap.to(".stars-bg", {
    y: "30%",
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
.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 130%;
  background-image: url("https://via.placeholder.com/1920x1080?text=Stars");
  background-size: cover;
  z-index: 1;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(30, 58, 138, 0.7),
    rgba(17, 24, 39, 0.7)
  );
  z-index: 2;
}

.nav-link {
  color: white;
  font-size: 18px;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #60a5fa;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #60a5fa;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.logo-link {
  text-decoration: none;
}
</style>
