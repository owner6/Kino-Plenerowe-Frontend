<script setup>
import { ref, onMounted } from 'vue'
import { eventsService } from '@/services/eventsService'

const props = defineProps({
  placeSlug: {
    type: String,
    required: true,
  },
  placeName: {
    type: String,
    default: '',
  },
})

const iframeUrl = ref('')
const loading = ref(true)
const error = ref(null)

const loadMapIframe = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await eventsService.getPlaceMapIframeUrl(props.placeSlug)
    iframeUrl.value = response.iframeUrl
  } catch (err) {
    error.value = 'Nie udało się załadować mapy'
    console.error('Błąd ładowania mapy:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMapIframe()
})
</script>

<template>
  <div class="google-map-container">
    <div class="map-header">
      <h3 class="map-title">
        <i class="pi pi-map-marker"></i>
        Lokalizacja
        <span v-if="placeName">- {{ placeName }}</span>
      </h3>
    </div>

    <div v-if="loading" class="map-loading">
      <div class="loading-spinner">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Ładowanie mapy...</p>
      </div>
    </div>

    <div v-else-if="error" class="map-error">
      <div class="error-content">
        <i class="pi pi-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="loadMapIframe" class="retry-button">
          <i class="pi pi-refresh"></i>
          Spróbuj ponownie
        </button>
      </div>
    </div>

    <div v-else class="map-wrapper">
      <iframe
        :src="iframeUrl"
        class="google-map-iframe"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Mapa lokalizacji"
      ></iframe>
      <div class="map-overlay">
        <div class="location-marker">
          <i class="pi pi-map-marker"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.google-map-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 24px;
}

.map-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.map-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.map-title i {
  font-size: 1.1rem;
}

.map-loading,
.map-error {
  padding: 60px 24px;
  text-align: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #666;
}

.loading-spinner i {
  font-size: 2rem;
  color: #007bff;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #dc3545;
}

.error-content i {
  font-size: 2rem;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #0056b3;
}

.map-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

.google-map-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  color: #dc3545;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translate(-50%, -100%) translateY(0);
  }
  40% {
    transform: translate(-50%, -100%) translateY(-10px);
  }
  60% {
    transform: translate(-50%, -100%) translateY(-5px);
  }
}

/* Адаптивність */
@media (max-width: 768px) {
  .map-header {
    padding: 16px 20px;
  }

  .map-title {
    font-size: 1.1rem;
  }

  .map-wrapper {
    height: 300px;
  }

  .map-loading,
  .map-error {
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .map-wrapper {
    height: 250px;
  }

  .location-marker {
    font-size: 1.5rem;
  }
}
</style>
