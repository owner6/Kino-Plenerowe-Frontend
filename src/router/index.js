import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlaceView from '../views/PlaceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/kino/warszawa/:date',
      name: 'calendar-date',
      component: HomeView,
      props: true,
    },
    {
      path: '/places/:placeId',
      name: 'place-details',
      component: PlaceView,
    },
    {
      path: '/places',
      name: 'places',
      component: PlaceView,
    },
  ],
})

export default router
