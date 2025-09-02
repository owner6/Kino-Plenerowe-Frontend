<template>
  <div class="navbar-container">
    <Menubar :model="menuItems" class="custom-menubar">
      <template #start>
        <div class="logo-container">
          <span class="logo-text">Kino plenerowe</span>
        </div>
      </template>

      <template #end>
        <div class="user-section">
          <Button
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            class="p-button-text p-button-rounded"
            @click="toggleTheme"
            aria-label="Toggle theme"
            :title="isDark ? 'Tryb jasny' : 'Tryb ciemny'"
          />
          <Button
            icon="pi pi-user"
            class="p-button-text p-button-rounded"
            @click="showUserMenu = !showUserMenu"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showUserMenu = ref(false)
const isDark = ref(document.documentElement.classList.contains('app-dark'))

const toggleTheme = () => {
  const root = document.documentElement
  const nowDark = root.classList.toggle('app-dark')
  isDark.value = nowDark
  localStorage.setItem('theme', nowDark ? 'dark' : 'light')
}

const menuItems = ref([
  {
    label: 'Dom',
    icon: 'pi pi-home',
    command: () => router.push('/'),
  },
  {
    label: 'Miejsca',
    icon: 'pi pi-map-marker',
    items: [
      {
        label: 'Wszystkie miejsca',
        icon: 'pi pi-list',
        command: () => router.push('/places'),
      },
      {
        label: 'Mapa',
        icon: 'pi pi-map',
        command: () => router.push('/places/map'),
      },
    ],
  },
  {
    label: 'Harmonogram',
    icon: 'pi pi-calendar',
    command: () => router.push('/schedule'),
  },
  {
    label: 'O nas',
    icon: 'pi pi-info-circle',
    command: () => router.push('/about'),
  },
])
</script>

<style scoped>
.navbar-container {
  max-width: 100%;
  position: sticky;
  top: 0;
  z-index: 1001;
  border-bottom: solid 1px var(--border);
  background-color: var(--card);
}

.custom-menubar {
  background: var(--card);
  border: none;
  border-radius: 0;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
}

.user-section {
  position: relative;
}

.dropdown-item i {
  color: #6c757d;
}

.dropdown-item span {
  color: #495057;
  font-weight: 500;
}

/* Стилі для меню PrimeVue */
:deep(.p-menubar) {
  background: transparent;
}

:deep(.p-menubar-root-list) {
  background: transparent;
}

:deep(.p-menuitem-link) {
  color: var(--text) !important;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.p-menuitem-link:hover) {
  background-color: var(--bg) !important;
  transform: translateY(-1px);
}

:deep(.p-menuitem-icon) {
  color: var(--text) !important;
}

:deep(.p-menuitem-text) {
  color: var(--text) !important;
}

:deep(.p-submenu-list) {
  background: var(--card);
  border-radius: 8px;
  border: none;
}

:deep(.p-submenu-list .p-menuitem-link) {
  color: var(--text) !important;
}

:deep(.p-submenu-list .p-menuitem-link:hover) {
  background-color: var(--bg) !important;
  color: var(--text) !important;
}

:deep(.p-submenu-list .p-menuitem-icon) {
  color: var(--muted) !important;
}

:deep(.p-submenu-list .p-menuitem-text) {
  color: var(--text) !important;
}

/* Адаптивність */
@media (max-width: 768px) {
  .logo-text {
    display: none;
  }

  .custom-menubar {
    padding: 0.5rem;
  }
}
</style>
