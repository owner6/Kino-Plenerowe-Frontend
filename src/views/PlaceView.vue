<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { eventsService } from '@/services/eventsService'
import Card from 'primevue/card'
import GoogleMap from '@/components/common/GoogleMap.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)
const events = ref([])
const placeDetails = ref(null)

// Визначаємо чи це сторінка всіх місць чи конкретного місця
const isAllPlacesView = computed(() => !route.params.slug)
const placeName = computed(() => {
  return placeDetails.value?.name || events.value?.[0]?.place?.name || null
})

// Оновлення SEO метаданих для сторінки місця
const updatePlaceSEOMetadata = (place) => {
  if (!place) return

  // Детальне логування SEO процесу
  console.group('🔍 SEO Metadata Update Process')
  console.log('📦 Place object:', place)
  console.log('🏷️ Available seo_title:', place.seo_title)
  console.log('🏷️ Available seoTitle:', place.seoTitle)
  console.log('📄 Available seo_description:', place.seo_description)
  console.log('📄 Available seoDescription:', place.seoDescription)

  // Використовуємо SEO поля з бази даних або fallback значення
  const title = place.seo_title || place.seoTitle || `${place.name} - Kino plenerowe`
  const description = place.seo_description || place.seoDescription || `Wydarzenia kinowe w lokalizacji ${place.name}. Sprawdź repertuar kina plenerowego.`

  console.log('✅ Final title:', title)
  console.log('✅ Final description:', description)
  console.log('🎯 Title source:', place.seo_title ? 'seo_title (DB)' : place.seoTitle ? 'seoTitle (DB)' : 'fallback')
  console.log('🎯 Description source:', place.seo_description ? 'seo_description (DB)' : place.seoDescription ? 'seoDescription (DB)' : 'fallback')
  console.groupEnd()

  // Оновлюємо title
  document.title = title

  // Оновлюємо або створюємо meta description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = description
}

// Спостерігаємо за змінами деталей місця для оновлення SEO
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
  return new Date(datetime).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatPrice = (price) => {
  return `${price.toFixed(2)} грн`
}

// Перехід на сторінку конкретного місця
const goToPlace = (slug) => {
  router.push(`/places/${slug}`)
}

// Завантаження всіх місць
const loadAllPlaces = async () => {
  try {
    console.log('🚀 Loading all places')
    const data = await eventsService.getAllPlaces()
    allPlaces.value = data
    console.log('✅ All places loaded:', data)
    
    // Оновлюємо SEO для сторінки всіх місць
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

// Завантаження конкретного місця
const loadSpecificPlace = async (slug) => {
  try {
    console.log('🚀 Loading place data for slug:', route)

    // Завантажуємо деталі місця
    const placeData = await eventsService.getPlaceDetails(route.params.slug)
    placeDetails.value = placeData

    console.log('✅ Place details loaded:', placeData)

    // Завантажуємо події для місця
    const data = await eventsService.getEventsByPlace(route.params.slug)

    // Об'єднуємо всі події в один масив
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
      await loadSpecificPlace(route.params.slug)
    }
  } catch (error) {
    console.error('❌ Error in onMounted:', error)
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

    <!-- Заголовок для конкретного місця -->
    <div v-else class="header">
      <h2 class="title">
        Wydarzenia w lokalizacji
        <span v-if="placeName">"{{ placeName }}"</span>
        <span v-else>#{{ route.params.slug }}</span>
      </h2>
    </div>

    <div v-if="loading" class="state">Завантаження...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else>
      <!-- Відображення всіх місць -->
      <div v-if="isAllPlacesView">
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
                  <a :href="place.link" target="_blank" rel="noopener noreferrer" @click.stop>
                    Strona internetowa
                  </a>
                </div>
                <div class="view-events">
                  <i class="pi pi-calendar"></i>
                  Kliknij, aby zobaczyć wydarzenia
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Відображення подій для конкретного місця -->
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
  padding: 24px;
}

.header {
  margin-bottom: 24px;
}

.title {
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 1.1rem;
}

.state {
  padding: 16px 0;
  color: #666;
}

.state.error {
  color: #c0392b;
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
.website,
.view-events {
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

.website a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.website a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.view-events {
  color: #007bff;
  font-weight: 500;
  margin-top: 8px;
}

.view-events i {
  color: #007bff;
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

  .places-grid {
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

@media (max-width: 768px) {
  .external-link-button {
    font-size: 0.9rem;
  }
}
</style>
