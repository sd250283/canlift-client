import { createRouter, createWebHistory } from 'vue-router'
import AdminElevator from '@/views/AdminElevator.vue'
import AdminUser from '@/views/AdminUser.vue'
import AdminRecipient from '@/views/AdminRecipient.vue'
import AdminProduct from '@/views/AdminProduct.vue'
import AdminProductDetail from '@/views/AdminProductDetail.vue'
import SimulationPageNew from '@/views/SimulationPageNew.vue'
import AlertingPage from '@/views/AlertingPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import store from '@/store'
import { DISABLE_LOADING } from '@/store/action.type'

const ifNotAuthenticated = (to: any, from: any, next: any) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  store.dispatch(DISABLE_LOADING)
  next('/')
}

const ifAuthenticated = (to: any, from: any, next: any) => {
  if (store.getters.isAuthenticated && (store.getters.isManager || store.getters.isAdmin)) {
    next()
    return
  }
  store.dispatch(DISABLE_LOADING)
  next('/login')
}

const ifAuthenticatedAdmin = (to: any, from: any, next: any) => {
  if (store.getters.isAuthenticated && store.getters.isAdmin) {
    next()
    return
  }
  store.dispatch(DISABLE_LOADING)
  next('/login')
}

const routes = [
  {
    path: '/',
    name: 'simulation',
    component: SimulationPageNew,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/simulation',
    name: 'simulationAlt',
    component: SimulationPageNew,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/alerting',
    name: 'alerting', 
    component: AlertingPage,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/admin/elevators',
    name: 'adminElevator',
    component: AdminElevator,
    // beforeEnter: ifAuthenticatedAdmin
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/admin/users',
    name: 'adminUser',
    component: AdminUser,
    // beforeEnter: ifAuthenticatedAdmin
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/admin/recipients',
    name: 'adminRecipient',
    component: AdminRecipient,
    // beforeEnter: ifAuthenticatedAdmin
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/admin/products',
    name: 'adminProduct',
    component: AdminProduct,
    // beforeEnter: ifAuthenticatedAdmin
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/admin/product-details',
    name: 'adminProductDetail',
    component: AdminProductDetail,
    // beforeEnter: ifAuthenticatedAdmin
    beforeEnter: ifNotAuthenticated
  },
  // {
  //   path: '/admin/brevo/messages',
  //   name: 'adminBrevoMessages',
  //   component: AdminBrevoMessages,
  //   // beforeEnter: ifAuthenticatedAdmin
  //   beforeEnter: ifNotAuthenticated
  // },
  // {
  //   path: '/admin/brevo/templates',
  //   name: 'adminBrevoTemplates',
  //   component: AdminBrevoTemplates,
  //   // beforeEnter: ifAuthenticatedAdmin
  //   beforeEnter: ifNotAuthenticated
  // },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    beforeEnter: ifNotAuthenticated
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
