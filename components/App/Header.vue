<template>
  <header class="header"></header>
</template>

<script setup></script>

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
