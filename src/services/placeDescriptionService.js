// Lokalne opisy miejsc
const placeDescriptions = {
  'amfiteatr-bemowo': {
    name: 'Amfiteatr Bemowo',
    description:
      'Nowoczesny amfiteatr w dzielnicy Bemowo, idealny do organizacji wydarzeń kulturalnych i koncertów plenerowych. Oferuje wygodne miejsca siedzące oraz doskonałą akustykę, co sprawia, że każdy seans filmowy lub wydarzenie nabiera wyjątkowego charakteru.',
  },
  'lazienki-krolewskie': {
    name: 'Łazienki Królewskie',
    description:
      'Najbardziej znany park Warszawy – zielona oaza pełna zabytków i pięknych alejek spacerowych. Seanse filmowe w tym miejscu to wyjątkowe połączenie sztuki i natury, a otoczenie historycznych budowli nadaje niepowtarzalny klimat.',
  },
  'nocny-market': {
    name: 'Nocny Market',
    description:
      'Kultowe miejsce spotkań mieszkańców stolicy – dawny peron dworca zamieniony w tętniący życiem targ nocny. Kino plenerowe tutaj łączy atmosferę miejskiego stylu z bogatą ofertą kulinarną i muzyką na żywo.',
  },
  'park-im-j-polinskiego': {
    name: 'Park im. J. Polińskiego',
    description:
      'Przyjemny park w dzielnicy Praga-Południe, idealny na relaks i aktywny wypoczynek. Pokazy filmowe odbywające się tutaj wprowadzają spokojny, rodzinny klimat i przyciągają mieszkańców okolicznych osiedli.',
  },
  'park-nad-balatonem': {
    name: 'Park nad Balatonem',
    description:
      'Nowoczesny park rekreacyjny z jeziorem Balaton w sercu Gocławia. To jedno z najchętniej odwiedzanych miejsc do odpoczynku na świeżym powietrzu, a wieczorne seanse filmowe z widokiem na wodę tworzą wyjątkową atmosferę.',
  },
  'park-opak': {
    name: 'Park OPAK',
    description:
      'Kameralny park na warszawskiej Pradze, znany z lokalnych wydarzeń kulturalnych i przyjaznej, sąsiedzkiej atmosfery. Pokazy filmowe w tym miejscu mają wyjątkowo intymny charakter i sprzyjają integracji społeczności.',
  },
}

export const placeDescriptionsService = {
  getDescription(slug) {
    const place = placeDescriptions[slug]
    return place
      ? place.description
      : 'Opis tego miejsca będzie dostępny wkrótce. Śledź aktualizacje!'
  },

  getName(slug) {
    const place = placeDescriptions[slug]
    return place ? place.name : null
  },

  getAllDescriptions() {
    return placeDescriptions
  },

  hasDescription(slug) {
    return slug in placeDescriptions
  },
}
