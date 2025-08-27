<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  selectedDate: {
    type: Date,
    default: () => new Date(),
  },
})

const emit = defineEmits(['day-select'])

const selectedDate = ref(new Date(props.selectedDate))

// Назви днів тижня польською
const dayNames = [
  'Poniedziałek',
  'Wtorek', 
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela'
]

// Короткі назви для мобільних пристроїв
const shortDayNames = [
  'Pon',
  'Wt',
  'Śr', 
  'Czw',
  'Pt',
  'Sob',
  'Ndz'
]

// Генерація 7 днів тижня починаючи з понеділка поточного тижня
const weekDays = computed(() => {
  const today = new Date()
  const currentDay = today.getDay() // 0 = неділя, 1 = понеділок
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // Зміщення до понеділка
  
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  
  const days = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    
    // Визначаємо відносну назву дня
    let displayName = dayNames[i]
    const daysDiff = Math.floor((date - today) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 0) {
      displayName = 'Dzisiaj'
    } else if (daysDiff === 1) {
      displayName = 'Jutro'
    } else if (daysDiff === -1) {
      displayName = 'Wczoraj'
    }
    
    days.push({
      date: new Date(date),
      name: displayName,
      shortName: shortDayNames[i],
      dayNumber: date.getDate(),
      isToday: daysDiff === 0,
      isSelected: date.toDateString() === selectedDate.value.toDateString()
    })
  }
  
  return days
})

// Обробка вибору дня
const selectDay = (day) => {
  selectedDate.value = new Date(day.date)
  emit('day-select', new Date(day.date))
}

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

// Ініціалізація
onMounted(() => {
  if (props.selectedDate) {
    selectedDate.value = new Date(props.selectedDate)
  }
})
</script>

<template>
  <div class="horizontal-week-calendar">
    <div class="days-container">
      <button
        v-for="day in weekDays"
        :key="day.date.toISOString()"
        :class="[
          'day-button',
          {
            'day-selected': day.isSelected
          }
        ]"
        @click="selectDay(day)"
      >
        {{ day.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.horizontal-week-calendar {
  padding: 20px 0;
}

.days-container {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
}

.day-button {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.day-button.day-selected {
  background-color: #333;
  color: white;
}

.day-button:hover:not(.day-selected) {
  background-color: #e0e0e0;
}

.day-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.3);
}

/* Адаптивність для мобільних пристроїв */
@media (max-width: 768px) {
  .days-container {
    gap: 2px;
    flex-wrap: wrap;
  }
  
  .day-button {
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .day-button {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>