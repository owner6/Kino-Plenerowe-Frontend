<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { eventsService } from '../services/eventsService'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Card from 'primevue/card'

const route = useRoute()
const loading = ref(true)
const error = ref(null)
const upcoming = ref([])
const past = ref([])

const placeName = computed(() => {
  return upcoming.value?.[0]?.place?.name || past.value?.[0]?.place?.name || null
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
    const data = await eventsService.getEventsByPlace(route.params.placeId)
    upcoming.value = data?.upcoming ?? []
    past.value = data?.past ?? []
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
        <span v-else>#{{ route.params.placeId }}</span>
      </h2>
    </div>

    <div v-if="loading" class="state">Завантаження...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else>
      <TabView class="events-tabs">
        <TabPanel header="Всі майбутні">
          <div v-if="upcoming.length === 0" class="state">Brak nadchodzących wydarzeń</div>
          <div v-else class="events-grid">
            <Card v-for="ev in upcoming" :key="ev.id" class="event-card">
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
        </TabPanel>

        <TabPanel header="Всі минулі">
          <div v-if="past.length === 0" class="state">Brak wydarzeń z przeszłości</div>
          <div v-else class="events-grid">
            <Card v-for="ev in past" :key="ev.id" class="event-card">
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
        </TabPanel>
      </TabView>
    </div>
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
</style>
