import './assets/css/main.css'
import '@mdi/font/css/materialdesignicons.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import Avatar from 'primevue/avatar'
import TabPanel from 'primevue/tabpanel'
import Card from 'primevue/card'
import Panel from 'primevue/panel'
import 'primeicons/primeicons.css'

// Apply saved theme before app creation
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('app-dark')
}

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
})

// Глобальна реєстрація компонентів
app.component('Button', Button)
app.component('Menubar', Menubar)
app.component('Avatar', Avatar)
app.component('TabPanel', TabPanel)
app.component('Card', Card)
app.component('Panel', Panel)

app.mount('#app')
