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

    // Завантажуємо всі місця з сервера
    const placesData = await eventsService.getAllPlaces()
    allPlaces.value = placesData

    console.log('✅ All places loaded:', placesData)

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
const loadSpecificPlace = async () => {
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

// Спостерігаємо за змінами маршруту
watch(() => route.params.slug, async (newSlug) => {
  loading.value = true
  error.value = null

  try {
    if (!newSlug) {
      // Перехід на сторінку всіх місць
      await loadAllPlaces()
    } else {
      // Перехід на сторінку конкретного місця
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
/* Замість .events-grid з картками */
.events-grid {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  gap: 16px;
}

/* Подія тепер як рядок списку */
.event-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s ease;
  cursor: default;
}

/* останній рядок без бордера */
.event-card:last-child {
  border-bottom: none;
}

/* hover */
.event-card:hover {
  background: #f9f9f9;
}

/* всередині PrimeVue card */
.event-card :deep(.p-card-body) {
  padding: 0;
  width: 100%;
}

.event-card :deep(.p-card-title) {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.event-card :deep(.p-card-subtitle) {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 8px;
}

.event-meta .row {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 4px;
}

/* мобільна версія */
@media (max-width: 768px) {
  .event-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>

