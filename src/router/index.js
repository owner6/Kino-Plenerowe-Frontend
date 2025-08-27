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
      meta: { isToday: true }
    },
    {
      path: '/:date(\\d{4}-\\d{2}-\\d{2})',
      name: 'calendar-date',
      component: HomeView,
      props: true,
    },
    {
      path: '/places/:slug',
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
