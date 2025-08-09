<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TheNavbar from './components/layout/TheNavbar.vue'
</script>

<template>
  <div id="app">
    <TheNavbar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
}

/* Адаптивність */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>
