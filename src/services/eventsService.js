const API_BASE_URL = 'http://localhost:3000'

export const eventsService = {
  async getAllEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`)
      if (!response.ok) {
        throw new Error('Błąd podczas odbierania zdarzeń')
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
        throw new Error('Błąd podczas odbierania zdarzenia')
      }
      return await response.json()
    } catch (error) {
      console.error('Błąd:', error)
      throw error
    }
  },

  async getEventsByPlace(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${slug}/events`)
      if (!response.ok) {
        throw new Error('Błąd pobierania zdarzeń dla lokalizacji')
      }
      return await response.json()
    } catch (error) {
      console.error('Błąd:', error)
      throw error
    }
  },

  async getPlaceMapIframeUrl(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${slug}/map-iframe-url`)
      if (!response.ok) {
        throw new Error('Błąd pobierania URL mapy')
      }
      return await response.json()
    } catch (error) {
      console.error('Błąd:', error)
      throw error
    }
  },
}
