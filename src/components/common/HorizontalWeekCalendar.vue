<script setup>
import { ref, computed, onMounted, watch } from 'vue'

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
        Dzisiejsze pokazy
      </h3>
    </div>

    <div class="days-container">
      <ButtonCalendar
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
        </div>
      </ButtonCalendar>
    </div>
  </div>
</template>

<style scoped>
.horizontal-week-calendar {
  background: white;
  border-radius: 16px;
}

.calendar-header {
  margin-bottom: 20px;
}

.calendar-title {
  margin: 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: start;
  font-weight: 600;
}

.calendar-title i {
  color: #4299E1;
}

.days-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.day-button {
  display: flex;
  justify-content: center; /* по горизонталі */
  align-items: center;     /* по вертикалі */
  width: 87px;
  height: 36px;
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  text-align: center;
}


.day-button:hover {
  background-color: #E5E7EB;
}

.day-button.day-selected {
  background-color: #000000 !important;
  color: white !important;
}

.day-button.day-today {
  background-color: #3B82F6 !important;
  color: white !important;
}

.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-name {
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.2;
}

.day-name-short {
  display: none;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1;
}

/* Адаптивність */
@media (max-width: 768px) {
  .horizontal-week-calendar {
  }

  .days-container {
    cursor: pointer;
    gap: 8px;
  }

  .day-button {
    min-width: 70px;
    height: 75px;
    border-radius: 12px;
  }

  .day-name-short {
    display: block;
    font-size: 0.75rem;
  }

  .calendar-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .day-button {
    min-width: 60px;
    height: 65px;
    border-radius: 10px;
  }

  .day-content {
    gap: 3px;
  }

  .day-name-short {
    font-size: 0.7rem;
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
