<script setup>
import { ref, computed } from 'vue'

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

// Форматування часу
const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Форматування дати
const formatDate = (datetime) => {
  return new Date(datetime).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Форматування ціни
const formatPrice = (price) => {
  return `${price.toFixed(2)} грн`
}
</script>

<template>
  <div class="events-list">
    <h3 class="events-title">
      Події на {{ formatDate(selectedDate) }}
      <span class="events-count">({{ filteredEvents.length }})</span>
    </h3>

    <div v-if="filteredEvents.length === 0" class="no-events">
      <p>Nie znaleziono wydarzeń na tę datę</p>
    </div>

    <div v-else class="events-grid">
      <div v-for="event in filteredEvents" :key="event.id" class="event-card">
        <div class="event-header">
          <h4 class="movie-title">{{ event.movieName }}</h4>
          <div class="event-time">{{ formatTime(event.datetime) }}</div>
        </div>

        <div class="event-details">
          <div class="event-place"><strong>Miejsce:</strong> {{ event.place.name }}</div>
          <div class="event-address">
            {{ event.place.street }} {{ event.place.streetNr }}, {{ event.place.city }}
          </div>
          <div class="event-price"><strong>Cena:</strong> {{ formatPrice(event.price) }}</div>
        </div>

        <div class="event-actions">
          <button class="btn-details">Więcej szczegółów</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.events-list {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.event-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
}

.event-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.movie-title {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  flex: 1;
  margin-right: 16px;
}

.event-time {
  background-color: #28a745;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  white-space: nowrap;
}

.event-details {
  margin-bottom: 20px;
}

.event-place,
.event-address,
.event-price {
  margin-bottom: 8px;
  color: #666;
}

.event-address {
  font-size: 0.9rem;
  color: #888;
}

.event-price {
  color: #28a745;
  font-size: 1.1rem;
}

.event-actions {
  display: flex;
  gap: 12px;
}

.btn-details,
.btn-book {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-details {
  background-color: #6c757d;
  color: white;
}

.btn-details:hover {
  background-color: #5a6268;
}

.btn-book {
  background-color: #007bff;
  color: white;
  flex: 1;
}

.btn-book:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }

  .event-header {
    flex-direction: column;
    gap: 12px;
  }

  .event-actions {
    flex-direction: column;
  }
}
</style>
