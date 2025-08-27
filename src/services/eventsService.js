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

  async getPlaceDetails(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${slug}?include=seo`)
      if (!response.ok) {
        throw new Error('Błąd pobierania szczegółów lokalizacji')
      }
      const data = await response.json()

      // Логування для перевірки даних з бази
      console.group(`🏢 Place Details for: ${slug}`)
      console.log('📊 Full API Response:', data)
      console.log('📝 Place Name:', data.name)
      console.log('🔗 Place Link:', data.link)
      console.log('🏷️ SEO Title (seo_title):', data.seo_title)
      console.log('🏷️ SEO Title (seoTitle):', data.seoTitle)
      console.log('📄 SEO Description (seo_description):', data.seo_description)
      console.log('📄 SEO Description (seoDescription):', data.seoDescription)
      console.groupEnd()

      return data
    } catch (error) {
      console.error('Błąd:', error)
      throw error
    }
  },

  async getPlaceDetails(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${slug}?include=seo`)
      if (!response.ok) {
        throw new Error('Błąd pobierania szczegółów lokalizacji')
      }
      const data = await response.json()
      
      // Логування для перевірки даних з бази
      console.group(`🏢 Place Details for: ${slug}`)
      console.log('📊 Full API Response:', data)
      console.log('📝 Place Name:', data.name)
      console.log('🔗 Place Link:', data.link)
      console.log('🏷️ SEO Title (seo_title):', data.seo_title)
      console.log('🏷️ SEO Title (seoTitle):', data.seoTitle)
      console.log('📄 SEO Description (seo_description):', data.seo_description)
      console.log('📄 SEO Description (seoDescription):', data.seoDescription)
      console.groupEnd()
      
      return data
    } catch (error) {
      console.error('Błąd:', error)
      throw error
    }
  },

  async getAllPlaces() {
    try {
      const response = await fetch(`${API_BASE_URL}/places`)
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania miejsc')
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
