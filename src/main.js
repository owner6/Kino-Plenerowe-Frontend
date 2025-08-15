import './assets/css/main.css'

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

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

// Глобальна реєстрація компонентів
app.component('Button', Button)
app.component('Menubar', Menubar)
app.component('Avatar', Avatar)
app.component('TabPanel', TabPanel)
app.component('Card', Card)

app.mount('#app')
