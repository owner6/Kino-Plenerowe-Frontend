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
    <div class="calendar-header">
      <h3 class="calendar-title">
        <i class="pi pi-calendar"></i>
        Wybierz dzień
      </h3>
    </div>
    
    <div class="days-container">
      <Button
        v-for="day in weekDays"
        :key="day.date.toISOString()"
        :class="[
          'day-button',
          {
            'day-selected': day.isSelected,
            'day-today': day.isToday && !day.isSelected
          }
        ]"
        @click="selectDay(day)"
        :outlined="!day.isSelected"
      >
        <div class="day-content">
          <span class="day-name">{{ day.name }}</span>
          <span class="day-name-short">{{ day.shortName }}</span>
          <span class="day-number">{{ day.dayNumber }}</span>
        </div>
      </Button>
    </div>
    
    <div class="selected-info">
      <p class="selected-date">
        Wybrana data: {{ selectedDate.toLocaleDateString('pl-PL', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        }) }}
      </p>
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
  margin-bottom: 20px;
}

.calendar-title {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: center;
  justify-content: center;
}

.calendar-title i {
  color: #007bff;
}

.days-container {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.day-button {
  min-width: 120px;
  height: 60px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
  background: white;
  color: #333;
}

.day-button:hover {
  background-color: #f8f9fa !important;
  border-color: #007bff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.day-button.day-selected {
  background-color: #007bff !important;
  border-color: #007bff !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.day-button.day-today {
  border-color: #28a745;
  background-color: #f8fff9;
}

.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.day-name {
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1;
}

.day-name-short {
  display: none;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1;
}

.day-number {
  font-size: 1.1rem;
  font-weight: bold;
  line-height: 1;
}

.selected-info {
  text-align: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.selected-date {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Адаптивність */
@media (max-width: 768px) {
  .horizontal-week-calendar {
    padding: 16px;
  }
  
  .days-container {
    gap: 6px;
  }
  
  .day-button {
    min-width: 80px;
    height: 55px;
  }
  
  .day-name {
    display: none;
  }
  
  .day-name-short {
    display: block;
  }
  
  .calendar-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .day-button {
    min-width: 70px;
    height: 50px;
  }
  
  .day-content {
    gap: 1px;
  }
  
  .day-name-short {
    font-size: 0.75rem;
  }
  
  .day-number {
    font-size: 1rem;
  }
}

/* Стилі для PrimeVue Button */
:deep(.p-button) {
  justify-content: center;
  align-items: center;
}

:deep(.p-button-label) {
  font-weight: inherit;
}
</style>