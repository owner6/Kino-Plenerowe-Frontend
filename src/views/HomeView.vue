<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HorizontalWeekCalendar from '../components/common/HorizontalWeekCalendar.vue'
import EventsList from '../components/movies/EventsList.vue'
import { eventsService } from '../services/eventsService.js'

const route = useRoute()
const router = useRouter()

const events = ref([])
const selectedDate = ref(new Date())
const loading = ref(false)
const error = ref(null)

// Визначаємо чи це головна сторінка (сьогодні)
const isToday = computed(() => route.meta?.isToday || false)

// Форматування дати для SEO
const formatDateForSEO = (date) => {
  const months = [
    'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
  ]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  return `${day} ${month} ${year}`
}

// Оновлення SEO метаданих
const updateSEOMetadata = (date) => {
  const formattedDate = formatDateForSEO(date)
  const title = `Kino plenerowe ${formattedDate}`
  const description = `Repertuar kina plenerowego na ${formattedDate}. Sprawdź co gramy!`

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

// Функція для парсингу дати з URL
const parseDateFromUrl = (dateString) => {
  if (!dateString) return new Date()

  // Спробуємо парсити як ISO дату
  let date = new Date(dateString)

  // Якщо не вдалося, спробуємо наш формат YYYY-MM-DD
  if (isNaN(date.getTime()) && dateString.includes('-')) {
    date = parseDateFromParams(dateString)
  }

  return isNaN(date.getTime()) ? new Date() : date
}

// Функція для форматування дати для URL
const formatDateForUrl = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Функція для оновлення URL з новою датою
const updateUrlWithDate = (date) => {
  const dateString = formatDateForUrl(date)

  // Якщо це сьогоднішня дата, переходимо на головну сторінку
  const today = new Date()
  const isSelectedToday = date.toDateString() === today.toDateString()

  if (isSelectedToday) {
    router.push({ name: 'home' })
  } else {
    router.push({
      name: 'calendar-date',
      params: { date: dateString },
    })
  }
}

// Функція для парсингу дати з URL параметрів
const parseDateFromParams = (dateString) => {
  if (!dateString) return new Date()

  const [year, month, day] = dateString.split('-').map(Number)

  if (!year || !month || !day) return new Date()

  const date = new Date(year, month - 1, day)
  return isNaN(date.getTime()) ? new Date() : date
}

// Ініціалізація дати з URL при завантаженні
const initializeDateFromUrl = () => {
  if (isToday.value) {
    // Головна сторінка - завжди сьогоднішня дата
    selectedDate.value = new Date()
  } else if (route.params.date) {
    // Якщо є параметр дати в шляху
    selectedDate.value = parseDateFromParams(route.params.date)
  } else if (route.query.date) {
    // Якщо є query параметр (для зворотної сумісності)
    selectedDate.value = parseDateFromParams(route.query.date)
  }

  // Оновлюємо SEO метадані тільки для сторінок з датами
  if (!isToday.value) {
    updateSEOMetadata(selectedDate.value)
  }
}

// Спостерігаємо за змінами в URL
watch(
  () => [route.params.date, route.meta?.isToday],
  ([newDate, isHomePage]) => {
    if (isHomePage) {
      // Головна сторінка - завжди сьогоднішня дата
      selectedDate.value = new Date()
    } else if (newDate) {
      selectedDate.value = parseDateFromParams(newDate)
      updateSEOMetadata(selectedDate.value)
    }
  },
)

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
const handleDaySelected = (date) => {
  selectedDate.value = date
  updateUrlWithDate(date)
}

// Завантаження подій при монтуванні компонента
onMounted(() => {
  initializeDateFromUrl()
  fetchEvents()
})
</script>

<template>
  <main class="home-view">
    <div class="container">
      <!-- Календар -->
      <HorizontalWeekCalendar :selected-date="selectedDate" @day-select="handleDaySelected" />

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
