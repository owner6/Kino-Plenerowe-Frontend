<script setup>
import { ref, watch } from 'vue'
import Calendar from 'primevue/calendar'

const props = defineProps({
  selectedDate: {
    type: Date,
    default: () => new Date(),
  },
})

const emit = defineEmits(['date-selected'])

const selectedDate = ref(props.selectedDate)

// Обробка зміни дати
const handleDateChange = (newDate) => {
  selectedDate.value = newDate
  emit('date-selected', newDate)
}

// Форматування дати для відображення
const formatDate = (date) => {
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Спостерігаємо за змінами props
watch(
  () => props.selectedDate,
  (newDate) => {
    if (newDate) {
      selectedDate.value = newDate
    }
  },
)
</script>

<template>
  <div class="event-calendar">
    <div class="calendar-container">
      <Calendar
        v-model="selectedDate"
        inline
        showWeek
        @date-select="handleDateChange"
        :min-date="new Date()"
        :max-date="new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)"
        class="primevue-calendar"
      />
    </div>
  </div>
</template>

<style scoped>
.event-calendar {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.calendar-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
  text-align: center;
}

.calendar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.primevue-calendar {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.selected-date-info {
  text-align: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .event-calendar {
    padding: 16px;
  }

  .calendar-title {
    font-size: 1.1rem;
  }
}
</style>
