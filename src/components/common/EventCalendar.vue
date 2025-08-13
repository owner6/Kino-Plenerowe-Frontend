<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectedDate: {
    type: Date,
    default: () => new Date(),
  },
})

const emit = defineEmits(['date-selected'])

const selectedDate = ref(props.selectedDate)

// Обробка зміни дати
const handleDateChange = (event) => {
  const newDate = new Date(event.target.value)
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

// Форматування дати для input type="date"
const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0]
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
    <h3 class="calendar-title">Оберіть дату для перегляду подій</h3>

    <div class="calendar-container">
      <div class="date-input-wrapper">
        <label for="date-picker" class="date-label">Дата:</label>
        <input
          id="date-picker"
          type="date"
          :value="formatDateForInput(selectedDate)"
          @change="handleDateChange"
          :min="formatDateForInput(new Date())"
          :max="formatDateForInput(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))"
          class="date-input"
        />
      </div>
    </div>

    <div class="selected-date-info">
      Обрана дата: <strong>{{ formatDate(selectedDate) }}</strong>
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

.date-input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.date-label {
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}

.date-input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: white;
  color: #333;
  cursor: pointer;
}

.date-input:hover {
  border-color: #007bff;
}

.date-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(0.5);
}

.date-input::-webkit-calendar-picker-indicator:hover {
  filter: invert(0.3);
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

  .date-input {
    width: 100%;
    max-width: 300px;
  }
}
</style>
