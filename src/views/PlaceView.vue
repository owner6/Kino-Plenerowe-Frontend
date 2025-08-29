<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { eventsService } from '@/services/eventsService'
import Card from 'primevue/card'
import GoogleMap from '@/components/common/GoogleMap.vue'
import router from '@/router/index.js'

const route = useRoute()
const loading = ref(true)
const error = ref(null)
const events = ref([])
const placeDetails = ref(null)
const allPlaces = ref([])

// Визначаємо чи це сторінка всіх місць чи конкретного місця
const isAllPlacesView = computed(() => !route.params.slug)
const placeName = computed(() => {
  return placeDetails.value?.name || events.value?.[0]?.place?.name || null
})

// Фільтруємо майбутні події
const upcomingEvents = computed(() => {
  const now = new Date()
  return events.value.filter(event => new Date(event.datetime) >= now)
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
})

// Оновлення SEO метаданих для сторінки місця
const updatePlaceSEOMetadata = (place) => {
  if (!place) return

  console.group('🔍 SEO Metadata Update Process')
  console.log('📦 Place object:', place)
  console.log('🏷️ Available seo_title:', place.seo_title)
  console.log('🏷️ Available seoTitle:', place.seoTitle)
  console.log('📄 Available seo_description:', place.seo_description)
  console.log('📄 Available seoDescription:', place.seoDescription)

  const title = place.seo_title || place.seoTitle || `${place.name} - Kino plenerowe`
  const description = place.seo_description || place.seoDescription || `Wydarzenia kinowe w lokalizacji ${place.name}. Sprawdź repertuar kina plenerowego.`

  console.log('✅ Final title:', title)
  console.log('✅ Final description:', description)
  console.groupEnd()

  document.title = title

  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = description
}

watch(placeDetails, (newPlace) => {
  if (newPlace) {
    updatePlaceSEOMetadata(newPlace)
  }
}, { immediate: true })

const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (datetime) => {
  const date = new Date(datetime)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Четверг'
  } else {
    return date.toLocaleDateString('uk-UA', {
      weekday: 'long',
    })
  }
}

const formatPrice = (price) => {
  return `${price.toFixed(2)} грн`
}

const goToPlace = (slug) => {
  router.push(`/places/${slug}`)
}

const loadAllPlaces = async () => {
  try {
    console.log('🚀 Loading all places')
    const placesData = await eventsService.getAllPlaces()
    allPlaces.value = placesData
    console.log('✅ All places loaded:', placesData)

    document.title = 'Wszystkie miejsca - Kino plenerowe'
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    metaDescription.content = 'Wszystkie lokalizacje kina plenerowego. Wybierz miejsce i sprawdź repertuar.'
  } catch (e) {
    console.error('❌ Error loading all places:', e)
    error.value = e?.message || 'Błąd ładowania miejsc'
  }
}

const loadSpecificPlace = async () => {
  try {
    console.log('🚀 Loading place data for slug:', route.params.slug)

    const placeData = await eventsService.getPlaceDetails(route.params.slug)
    placeDetails.value = placeData
    console.log('✅ Place details loaded:', placeData)

    const data = await eventsService.getEventsByPlace(route.params.slug)
    const upcoming = data?.upcoming ?? []
    const past = data?.past ?? []
    events.value = [...upcoming, ...past]

    console.log('✅ Events loaded:', { upcoming: upcoming.length, past: past.length })
  } catch (e) {
    console.error('❌ Error loading place data:', e)
    error.value = e?.message || 'Błąd przesyłania'
  }
}

onMounted(async () => {
  try {
    if (isAllPlacesView.value) {
      await loadAllPlaces()
    } else {
      await loadSpecificPlace()
    }
  } catch (error) {
    console.error('❌ Error in onMounted:', error)
  } finally {
    loading.value = false
  }
})

watch(() => route.params.slug, async (newSlug) => {
  loading.value = true
  error.value = null

  try {
    if (!newSlug) {
      await loadAllPlaces()
    } else {
      await loadSpecificPlace()
    }
  } catch (error) {
    console.error('❌ Error in route watcher:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="place-page">
    <!-- Заголовок для всіх місць -->
    <div v-if="isAllPlacesView" class="header">
      <h2 class="title">Wszystkie miejsca</h2>
      <p class="subtitle">Wybierz lokalizację, aby zobaczyć repertuar</p>
    </div>

    <!-- Заголовок та контент для конкретного місця -->
    <div v-else-if="!loading && !error && placeDetails" class="place-content">
      <!-- Заголовок місця -->
      <div class="place-header">
        <h1 class="place-title">{{ placeDetails.name }}</h1>
        <p class="place-description">
          Летний кинотеатр под открытым небом в самом сердце Мокотовского поля.
        </p>
      </div>

      <!-- Основний контент -->
      <div class="main-content">
        <!-- Лівий блок - Репертуар -->
        <div class="repertoire-section">
          <h2 class="section-title">Предстоящий репертуар</h2>
          
          <div v-if="upcomingEvents.length === 0" class="no-events">
            <p>Brak nadchodzących wydarzeń</p>
          </div>
          
          <div v-else class="events-list">
            <div v-for="event in upcomingEvents" :key="event.id" class="event-item">
              <div class="event-date">{{ formatDate(event.datetime) }}, {{ formatTime(event.datetime) }}</div>
              <div class="event-movie">{{ event.movieName }}</div>
            </div>
          </div>
        </div>

        <!-- Правий блок - Адреса -->
        <div class="address-section">
          <h3 class="address-title">Адрес</h3>
          <div class="address-content">
            <p class="address-text">{{ placeDetails.street }} {{ placeDetails.streetNr }}, {{ placeDetails.city }}</p>
            <button class="map-button">[ Карта маршрутов ]</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Стан завантаження та помилки -->
    <div v-if="loading" class="state">Завантаження...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <!-- Відображення всіх місць -->
    <div v-else-if="isAllPlacesView">
      <div v-if="allPlaces.length === 0" class="state">Brak dostępnych miejsc</div>
      <div v-else class="places-grid">
        <Card v-for="place in allPlaces" :key="place.id" class="place-card" @click="goToPlace(place.slug)">
          <template #title>
            <div class="place-title">
              <i class="pi pi-map-marker"></i>
              {{ place.name }}
            </div>
          </template>
          <template #content>
            <div class="place-info">
              <div class="address">
                <i class="pi pi-home"></i>
                {{ place.street }} {{ place.streetNr }}, {{ place.city }}
              </div>
              <div v-if="place.link" class="website">
                <i class="pi pi-globe"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Карта Google Maps -->
    <GoogleMap
      v-if="!loading && !error && !isAllPlacesView"
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.place-content {
  background: white;
  border-radius: 0;
  padding: 0;
  margin: 0;
}

.place-header {
  text-align: center;
  margin-bottom: 48px;
  padding: 40px 0;
}

.place-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.place-description {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 80px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 40px;
}

.repertoire-section {
  min-height: 300px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 32px 0;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-item {
  padding: 0;
  border-bottom: none;
}

.event-date {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.event-movie {
  font-size: 1rem;
  color: #333;
  margin-left: 0;
}

.address-section {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 8px;
  height: fit-content;
}

.address-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.address-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-text {
  font-size: 1rem;
  color: #333;
  margin: 0;
  line-height: 1.5;
}

.map-button {
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px 0;
  text-align: left;
  transition: color 0.2s ease;
}

.map-button:hover {
  color: #007bff;
}

.no-events {
  color: #666;
  font-style: italic;
  padding: 20px 0;
}

.state {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  color: #666;
}

.state.error {
  color: #dc3545;
}

/* Стилі для сторінки всіх місць */
.header {
  margin-bottom: 24px;
  text-align: center;
}

.title {
  margin: 0;
  color: #333;
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 1.1rem;
}

.places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 8px;
}

.place-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.place-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}

.place-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.place-title i {
  color: #007bff;
}

.place-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address,
.website {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.95rem;
}

.address i {
  color: #28a745;
}

.website i {
  color: #17a2b8;
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

/* Адаптивність */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .address-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .place-page {
    padding: 24px 16px;
  }

  .place-header {
    padding: 24px 0;
  }

  .place-title {
    font-size: 2rem;
  }

  .place-description {
    font-size: 1rem;
  }

  .main-content {
    padding: 0 16px;
    gap: 32px;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .places-grid {
    grid-template-columns: 1fr;
  }

  .external-link-button {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .place-page {
    padding: 16px 12px;
  }

  .main-content {
    padding: 0 8px;
  }

  .place-title {
    font-size: 1.8rem;
  }
}
</style>