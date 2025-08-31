<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  selectedDate: {
    type: Date,
    default: () => new Date(),
  },
})

const emit = defineEmits(['day-select'])

const selectedDate = ref(new Date())
const currentWeekStart = ref(new Date())

// Список днів тижня українською
const weekDaysUkrainian = [
  'Понеділок',
  'Вівторок', 
  'Середа',
  'Четвер',
  "П'ятниця",
  'Субота',
  'Неділя'
]

// Генеруємо список днів починаючи з сьогоднішнього
const weekDays = computed(() => {
  const today = new Date()
  const todayIndex = (today.getDay() + 6) % 7 // Конвертуємо з воскресенья=0 в понеділок=0
  
  const reorderedDays = []
  for (let i = 0; i < 7; i++) {
    const dayIndex = (todayIndex + i) % 7
    reorderedDays.push(weekDaysUkrainian[dayIndex])
  }
  
  return reorderedDays
})

// Генеруємо дати для тижня починаючи з сьогодні
const weekDates = computed(() => {
  const today = new Date()
  const dates = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }
  
  return dates
})

// Перевіряємо чи дата є сьогоднішньою
const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// Перевіряємо чи дата вибрана
const isSelected = (date) => {
  return selectedDate.value && date.toDateString() === selectedDate.value.toDateString()
}

// Форматуємо день місяця
const formatDay = (date) => {
  return date.getDate()
}

// Форматуємо місяць
const formatMonth = (date) => {
  const months = [
    'січ', 'лют', 'бер', 'кві', 'тра', 'чер',
    'лип', 'сер', 'вер', 'жов', 'лис', 'гру'
  ]
  return months[date.getMonth()]
}

// Обробка вибору дня
const selectDay = (date) => {
  selectedDate.value = new Date(date)
  emit('day-select', new Date(date))
}

// Навігація по тижнях
const goToPreviousWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() - 7)
  currentWeekStart.value = newStart
}

const goToNextWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() + 7)
  currentWeekStart.value = newStart
}

// Повернення до поточного тижня
const goToCurrentWeek = () => {
  currentWeekStart.value = new Date()
}

// Ініціалізація
onMounted(() => {
  if (props.selectedDate) {
    selectedDate.value = new Date(props.selectedDate)
  }
  currentWeekStart.value = new Date()
})

// Спостерігаємо за змінами props
watch(
  () => props.selectedDate,
  (newDate) => {
    if (newDate) {
      selectedDate.value = new Date(newDate)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="horizontal-week-calendar">
    <div class="calendar-header">
      <button @click="goToPreviousWeek" class="nav-button">
        <i class="pi pi-chevron-left"></i>
      </button>
      
      <h3 class="calendar-title">Тиждень</h3>
      
      <button @click="goToNextWeek" class="nav-button">
        <i class="pi pi-chevron-right"></i>
      </button>
    </div>

    <div class="week-container">
      <div 
        v-for="(date, index) in weekDates" 
        :key="index"
        class="day-item"
        :class="{
          'selected': isSelected(date),
          'today': isToday(date)
        }"
        @click="selectDay(date)"
      >
        <div class="day-name">{{ weekDays[index] }}</div>
        <div class="day-number">{{ formatDay(date) }}</div>
        <div class="day-month">{{ formatMonth(date) }}</div>
      </div>
    </div>

    <div class="calendar-actions">
      <button @click="goToCurrentWeek" class="current-week-button">
        Поточний тиждень
      </button>
    </div>
  </div>
</template>

<style scoped>
.horizontal-week-calendar {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-title {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-button {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.nav-button:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.week-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.day-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  background: #f8f9fa;
}

.day-item:hover {
  background: #e3f2fd;
  transform: translateY(-2px);
}

.day-item.selected {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.day-item.today {
  border-color: #28a745;
  background: #d4edda;
}

.day-item.today.selected {
  background: #007bff;
  border-color: #28a745;
}

.day-name {
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 4px;
  text-align: center;
}

.day-number {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 2px;
}

.day-month {
  font-size: 0.7rem;
  opacity: 0.8;
  text-transform: uppercase;
}

.calendar-actions {
  display: flex;
  justify-content: center;
}

.current-week-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.current-week-button:hover {
  background: #5a6268;
}

/* Адаптивність */
@media (max-width: 768px) {
  .horizontal-week-calendar {
    padding: 16px;
  }

  .week-container {
    gap: 4px;
  }

  .day-item {
    padding: 12px 4px;
  }

  .day-name {
    font-size: 0.7rem;
  }

  .day-number {
    font-size: 1.2rem;
  }

  .day-month {
    font-size: 0.6rem;
  }

  .calendar-title {
    font-size: 1.1rem;
  }

  .nav-button {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .day-name {
    font-size: 0.6rem;
  }

  .day-number {
    font-size: 1rem;
  }

  .day-item {
    padding: 8px 2px;
  }
}
</style>