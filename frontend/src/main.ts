import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faRightFromBracket, faBolt, faUsers, faComments, faGear, faBars } from '@fortawesome/free-solid-svg-icons'

import App from './App.vue'
import router from './router/router'

library.add(faUser, faRightFromBracket, faBolt, faUsers, faComments, faGear, faBars)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
