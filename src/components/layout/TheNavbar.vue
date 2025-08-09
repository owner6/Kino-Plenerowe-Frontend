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

const menuItems = ref([
  {
    label: 'Dom',
    icon: 'pi pi-home',
    command: () => router.push('/'),
  },
  {
    label: 'Kino',
    icon: 'pi pi-video',
    command: () => router.push('/movies'),
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
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-menubar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 0;
  padding: 0.5rem 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 2rem;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgb(0, 0, 0);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.user-section {
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1001;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
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
  color: white !important;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.p-menuitem-link:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-1px);
}

:deep(.p-menuitem-icon) {
  color: white !important;
}

:deep(.p-menuitem-text) {
  color: white !important;
}

:deep(.p-submenu-list) {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
}

:deep(.p-submenu-list .p-menuitem-link) {
  color: #495057 !important;
}

:deep(.p-submenu-list .p-menuitem-link:hover) {
  background-color: #f8f9fa !important;
  color: #212529 !important;
}

:deep(.p-submenu-list .p-menuitem-icon) {
  color: #6c757d !important;
}

:deep(.p-submenu-list .p-menuitem-text) {
  color: #495057 !important;
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
