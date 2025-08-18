<script setup>
import { RouterView } from 'vue-router'
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
  max-width: 1600px;
  margin: 0 auto;
  background-color: #f8f9fa;
}

.main-content {
  flex: 1;
  padding: 0rem;
}

/* Адаптивність */
@media (max-width: 1680px) {
  #app {
    max-width: 1400px;
  }
}

@media (max-width: 1440px) {
  #app {
    max-width: 1200px;
  }
}

@media (max-width: 1200px) {
  #app {
    max-width: 100%;
  }

  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0.5rem;
  }
}
</style>
