<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Calendar from 'primevue/calendar'
import OverlayPanel from 'primevue/overlaypanel'

const props = defineProps({
  selectedDate: {
    type: Date,
    default: () => new Date(),
  },
})

const emit = defineEmits(['day-select'])

const selectedDate = ref(new Date(props.selectedDate))

// Overlay panel for date picker
const calendarPanelRef = ref(null)
const toggleCalendar = (event) => {
  calendarPanelRef.value?.toggle(event)
}
const onDatePick = (value) => {
  selectedDate.value = new Date(value)
  emit('day-select', new Date(value))
  // Hide after selection
  calendarPanelRef.value?.hide()
}

// Назви днів тижня польською
const dayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']

// Короткі назви для мобільних пристроїв
const shortDayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz']

const weekDays = computed(() => {
  const today = new Date()
  const days = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Індекс дня тижня для назв (0 = неділя → у нас 6)
    let dayIndex = date.getDay()
    if (dayIndex === 0)
      dayIndex = 6 // неділя → останній елемент
    else dayIndex = dayIndex - 1 // решта зсуваємо (пон = 0, вт = 1, ...)

    // Відносні назви
    const daysDiff = i
    let displayName = dayNames[dayIndex]

    if (daysDiff === 0) displayName = 'Dzisiaj'
    else if (daysDiff === 1) displayName = 'Jutro'
    else if (daysDiff === -1) displayName = 'Wczoraj'

    days.push({
      date,
      name: displayName,
      shortName: shortDayNames[dayIndex],
      dayNumber: date.getDate(),
      isToday: daysDiff === 0,
      isSelected: date.toDateString() === selectedDate.value.toDateString(),
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
  { immediate: true },
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
        <i class=""></i>
        Dzisiejsze pokazy
      </h3>
      <OverlayPanel ref="calendarPanelRef">
        <Calendar v-model="selectedDate" inline :showIcon="false" @update:modelValue="onDatePick" />
      </OverlayPanel>
    </div>

    <div class="days-container">
      <ButtonCalendar
        v-for="day in weekDays"
        :key="day.date.toISOString()"
        :class="[
          'day-button',
          {
            'day-selected': day.isSelected,
            'day-today': day.isToday && !day.isSelected,
          },
        ]"
        @click="selectDay(day)"
        :outlined="!day.isSelected"
      >
        <div class="day-content">
          <span class="day-name">{{ day.name }}</span>
          <span class="day-name-short">{{ day.shortName }}</span>
        </div>
      </ButtonCalendar>
      <button
        class="calendar-trigger"
        type="button"
        @click="toggleCalendar($event)"
        aria-label="Open calendar"
      >
        <i class="pi pi-calendar-plus"></i>
      </button>
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

.calendar-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.calendar-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.calendar-logo i {
  font-size: 22px;
  color: #111827;
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
  color: #4299e1;
}

.calendar-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: #f3f4f6;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.calendar-trigger:hover {
  background: #e5e7eb;
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
  align-items: center; /* по вертикалі */
  width: 87px;
  height: 36px;
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  text-align: center;
  cursor: pointer;
}

.day-button:hover {
  background-color: #e5e7eb;
}

.day-button.day-selected {
  background-color: #000000 !important;
  color: white !important;
}

.day-button.day-today {
  background-color: #3b82f6 !important;
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

/* Базовий стиль (desktop, >1024px) */
.days-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  justify-content: flex-start;
}

/* --- Середні екрани (tablet, ≤1024px) --- */
@media (max-width: 1024px) {
  .day-button {
    gap: 5px;
    width: 70px;
    height: 34px;
  }

  .day-name {
    font-size: 0.8rem;
  }
}

/* --- Маленькі екрани (phone, ≤768px) --- */
@media (max-width: 768px) {
  .days-container {
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: 4px;
  }

  .day-button {
    width: 65px;
    height: 32px;
  }

  .day-name {
    display: none; /* ховаємо повну назву */
  }

  .day-name-short {
    display: block; /* показуємо скорочену */
  }
}

/* --- Дуже маленькі екрани (≤480px) --- */
@media (max-width: 480px) {
  .day-button {
    gap: 4px;
    width: 50px;
    height: 30px;
  }

  .day-name-short {
    font-size: 0.7rem;
  }
}

/* Стилі для PrimeVue Button */
:deep(.p-button) {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

:deep(.p-button-label) {
  font-weight: inherit;
  padding: 0;
}
</style>
