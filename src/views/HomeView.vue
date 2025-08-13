<script setup>
import { ref, onMounted } from 'vue'
import EventCalendar from '../components/common/EventCalendar.vue'
import EventsList from '../components/movies/EventsList.vue'
import { eventsService } from '../services/eventsService.js'

const events = ref([])
const selectedDate = ref(new Date())
const loading = ref(false)
const error = ref(null)

// Отримання всіх подій при завантаженні
const fetchEvents = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await eventsService.getAllEvents()
    events.value = data
  } catch (err) {
    error.value = 'Błąd ładowania zdarzeń'
    console.error('Błąd ładowania zdarzeń:', err)
  } finally {
    loading.value = false
  }
}

// Обробка зміни дати
const handleDateSelected = (date) => {
  selectedDate.value = date
}

// Завантаження подій при монтуванні компонента
onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <main class="home-view">
    <div class="container">
      <!-- Календар -->
      <EventCalendar :selected-date="selectedDate" @date-selected="handleDateSelected" />

      <!-- Список подій -->
      <div v-if="loading" class="loading">
        <p>ładowanie zdarzeń...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchEvents" class="btn-retry">Spróbuj ponownie</button>
      </div>

      <EventsList v-else :events="events" :selected-date="selectedDate" />
    </div>
  </main>
</template>

<style scoped>
.home-view {
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  text-align: center;
  margin: 0 0 16px 0;
  color: #333;
  font-size: 2.5rem;
  font-weight: bold;
}

.page-subtitle {
  text-align: center;
  margin: 0 0 40px 0;
  color: #666;
  font-size: 1.1rem;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.error {
  color: #dc3545;
}

.btn-retry {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 16px;
}

.btn-retry:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }
}
</style>
