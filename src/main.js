import './assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import Avatar from 'primevue/avatar'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

// Глобальна реєстрація Button компонента
app.component('Button', Button)
app.component('Menubar', Menubar)
app.component('Avatar', Avatar)

app.mount('#app')
