const API_BASE_URL = 'http://localhost:3000'

export const eventsService = {
  // Отримати всі події
  async getAllEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`)
      if (!response.ok) {
        throw new Error('Błąd podczas odbierania zdarzeń')
      }
      return await response.json()
    } catch (error) {
      console.error('Błąd:', error)
      throw error
    }
  },

  // Отримати подію за ID
  async getEventById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`)
      if (!response.ok) {
        throw new Error('Błąd podczas odbierania zdarzenia')
      }
      return await response.json()
    } catch (error) {
      console.error('Błąd:', error)
      throw error
    }
  },
}
