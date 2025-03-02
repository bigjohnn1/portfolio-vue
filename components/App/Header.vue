<template>
  <header class="header">
    <div class="logo">
      <NuxtLink to="/" class="logo-text">TaskFlow</NuxtLink>
    </div>
    <nav>
      <NuxtLink to="/" class="nav-link">🏠 Home</NuxtLink>
      <NuxtLink to="/tasks" class="nav-link">📋 Tasks</NuxtLink>

      <template v-if="session">
        <NuxtLink to="/profile" class="nav-link">👤 Profile</NuxtLink>
        <a @click="logout" class="nav-link logout">🚪 Logout</a>
      </template>

      <NuxtLink v-else to="/login" class="nav-link">🔑 Login</NuxtLink>
    </nav>
  </header>
</template>

<script setup>
import { useFlashStore } from "@/stores/useFlashStore";
const flashStore = useFlashStore();

const supabase = useSupabase();
const session = ref(null);

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  session.value = data.session;
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession;
  });
});

const logout = async () => {
  await supabase.auth.signOut();
  session.value = null;
  flashStore.setFlash("Logged out successfully", "success");
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo-text:hover {
  transform: scale(1.1);
}

.nav-link {
  margin: 0 10px;
  color: white;
  font-size: 18px;
  text-decoration: none;
  transition: color 0.3s;
  cursor: pointer;
}

.nav-link:hover {
  color: #ffd700;
}

.logout {
  font-weight: bold;
}
</style>
