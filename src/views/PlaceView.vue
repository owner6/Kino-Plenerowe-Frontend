<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { eventsService } from '@/services/eventsService'
import Card from 'primevue/card'
import GoogleMap from '@/components/common/GoogleMap.vue'

const route = useRoute()
const loading = ref(true)
const error = ref(null)
const events = ref([])
const placeDetails = ref(null)

const placeName = computed(() => {
  return placeDetails.value?.name || events.value?.[0]?.place?.name || null
})

const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (datetime) => {
  return new Date(datetime).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatPrice = (price) => {
  return `${price.toFixed(2)} грн`
}

onMounted(async () => {
  try {
    // Завантажуємо деталі місця
    const placeData = await eventsService.getPlaceDetails(route.params.slug)
    placeDetails.value = placeData

    // Завантажуємо події для місця
    const data = await eventsService.getEventsByPlace(route.params.slug)
    // Об'єднуємо всі події в один масив
    const upcoming = data?.upcoming ?? []
    const past = data?.past ?? []
    events.value = [...upcoming, ...past]
  } catch (e) {
    error.value = e?.message || 'Błąd przesyłania'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="place-page">
    <div class="header">
      <h2 class="title">
        Wydarzenia w lokalizacji
        <span v-if="placeName">"{{ placeName }}"</span>
        <span v-else>#{{ route.params.slug }}</span>
      </h2>
    </div>

    <div v-if="loading" class="state">Завантаження...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else>
      <div v-if="events.length === 0" class="state">Brak wydarzeń w tej lokalizacji</div>
      <div v-else class="events-grid">
        <Card v-for="ev in events" :key="ev.id" class="event-card">
          <template #title>
            {{ ev.movieName }}
          </template>
          <template #subtitle>
            {{ formatDate(ev.datetime) }} • {{ formatTime(ev.datetime) }}
          </template>
          <template #content>
            <div class="event-meta">
              <div class="row">
                <strong>Адреса:</strong> {{ ev.place.street }} {{ ev.place.streetNr }},
                {{ ev.place.city }}
              </div>
              <div class="row"><strong>Ціна:</strong> {{ formatPrice(ev.price) }}</div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Карта Google Maps -->
    <GoogleMap
      v-if="!loading && !error"
      :place-slug="route.params.slug"
      :place-name="placeName"
    />

    <!-- Посилання на місце -->
    <Panel 
      v-if="placeDetails?.link && !loading && !error" 
      header="Dodatkowe informacje"
      class="place-link-panel"
    >
      <template #header>
        <div class="panel-header">
          <i class="pi pi-external-link"></i>
          <span>Dodatkowe informacje</span>
        </div>
      </template>
      
      <p class="link-description">Więcej informacji o tej lokalizacji:</p>
      
      <Button 
        :label="placeDetails.link"
        icon="pi pi-globe"
        iconPos="left"
        @click="() => window.open(placeDetails.link, '_blank', 'noopener,noreferrer')"
        class="external-link-button"
        outlined
      >
        <template #default>
          <i class="pi pi-globe"></i>
          <span class="button-text">{{ placeDetails.link }}</span>
          <i class="pi pi-external-link"></i>
        </template>
      </Button>
    </Panel>
  </div>
</template>

<style scoped>
.place-page {
  padding: 24px;
}

.header {
  margin-bottom: 24px;
}

.title {
  margin: 0;
  color: #333;
}

.events-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.state {
  padding: 16px 0;
  color: #666;
}

.state.error {
  color: #c0392b;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.event-card :deep(.p-card-content) {
  padding-top: 0;
}

.event-meta .row {
  margin-bottom: 6px;
  color: #555;
}

@media (max-width: 768px) {
  .place-page {
    padding: 16px;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}

.place-link-panel {
  margin-top: 24px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.link-description {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 1rem;
}

.external-link-button {
  width: 100%;
  justify-content: flex-start;
  word-break: break-all;
}

.external-link-button .button-text {
  flex: 1;
  text-align: left;
  margin: 0 8px;
}

@media (max-width: 768px) {
  .external-link-button {
    font-size: 0.9rem;
  }
}
</style>
