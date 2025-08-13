const API_BASE_URL = 'http://localhost:3000'

export const eventsService = {
  async getAllEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`)
      if (!response.ok) {
        throw new Error('Помилка отримання подій')
      }
      return await response.json()
    } catch (error) {
      console.error('Помилка:', error)
      throw error
    }
  },

  async getEventById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`)
      if (!response.ok) {
        throw new Error('Помилка отримання події')
      }
      return await response.json()
    } catch (error) {
      console.error('Помилка:', error)
      throw error
    }
  },

  async getEventsByPlace(placeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${placeId}/events`)
      if (!response.ok) {
        throw new Error('Помилка отримання подій для місця')
      }
      return await response.json()
    } catch (error) {
      console.error('Помилка:', error)
      throw error
    }
  },
}
