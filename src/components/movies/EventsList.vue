<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  selectedDate: {
    type: Date,
    default: () => new Date(),
  },
})

// Фільтрація подій по вибраній даті
const filteredEvents = computed(() => {
  if (!props.selectedDate || props.events.length === 0) return []

  const selectedDateStr = props.selectedDate.toDateString()

  return props.events.filter((event) => {
    const eventDate = new Date(event.datetime)
    return eventDate.toDateString() === selectedDateStr
  })
})

// Перехід на сторінку місця
const goToPlace = (slug) => {
  router.push(`/places/${slug}`)
}

// Форматування часу
const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Форматування дати
const formatDate = (datetime) => {
  return new Date(datetime).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="events-list">
    <h3 class="events-title">
      Wydarzenia na {{ formatDate(selectedDate) }}
      <span class="events-count">({{ filteredEvents.length }})</span>
    </h3>

    <div v-if="filteredEvents.length === 0" class="no-events">
      <p>Nie znaleziono wydarzeń na tę datę</p>
    </div>

    <div v-else class="events-container">
      <div v-for="event in filteredEvents" :key="event.id" class="event-card">
        <div class="event-time">{{ formatTime(event.datetime) }}</div>
        <div class="event-details">
          <h4 class="movie-title">{{ event.movieName }}</h4>
          <div class="event-place">
            <span
              class="place-name"
              @click="goToPlace(event.place.slug)"
              role="button"
              tabindex="0"
              @keydown.enter="goToPlace(event.place.slug)"
              @keydown.space="goToPlace(event.place.slug)"
            >
              {{ event.place.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.events-list {
  background: white;
  border-radius: 12px;
  padding: 32px 0;
  max-width: 100%;
  margin: 0 auto;
}

.events-title {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.events-count {
  background-color: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: normal;
}

.no-events {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-card {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
  height: 82px;
  padding: 0 16px;
}

.event-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.event-time {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  min-width: 70px;
  color: #333;
  margin-right: 16px;
  border-right: solid 1px #e5e7eb;
  height: 48px;
}

.event-details {
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: center;
}

.movie-title {
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
}

.event-place {
  color: #666;
}

.place-name {
  color: #007bff;
  cursor: pointer;
  transition: color 0.2s ease;
}

.place-name:hover {
  color: #0056b3;
  text-decoration: underline;
}

.place-name:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .event-card {
    flex-direction: column;
  }

  .event-time {
    margin-right: 0;
    margin-bottom: 12px;
  }
}
</style>
