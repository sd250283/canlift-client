import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Form, Field, ErrorMessage } from 'vee-validate'
import ApiService from './common/api.service'
import { CHECK_AUTH } from './store/action.type'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@/assets/styles/globals.css'

const app = createApp(App)

app.component('Form', Form) // eslint-disable-line vue/multi-word-component-names
app.component('Field', Field) // eslint-disable-line vue/multi-word-component-names
app.component('ErrorMessage', ErrorMessage) // eslint-disable-line vue/multi-word-component-names
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(store)
app.use(router)

ApiService.init()

// Fix router guard for Vue 3
router.beforeEach(async (to: any, from: any, next: any) => {
  try {
    await store.dispatch(CHECK_AUTH)
    next()
  } catch (error) {
    process.env.NODE_ENV === 'development' && console.error('Router guard error:', error)
    next()
  }
})

// Wait for router to be ready before mounting (Vue 3 best practice)
store.dispatch(CHECK_AUTH).finally(() => {
  app.mount('#app')
})
