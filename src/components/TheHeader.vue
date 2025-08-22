<template>
  <nav class="sticky max-w-full top-0 z-50 flex h-16 items-center gap-3 sm:gap-4 bg-background/95 dark:bg-background-header/95 border-b border-border backdrop-blur-lg backdrop-saturate-150 shadow-sm transition-all duration-200 overflow-x-hidden">
    <!-- Logo and Brand Section -->
    <div class="flex items-center flex-shrink-0">
      <svg width="130" height="100" viewBox="-10 0 100 60" xmlns="http://www.w3.org/2000/svg" class="h-6 w-8 p-0">
        <!-- C letter -->
        <path
          d="M15 15 C15 10, 20 5, 30 5 L40 5 C50 5, 55 10, 55 15 L55 20 L45 20 L45 15 C45 12, 42 10, 40 10 L30 10 C27 10, 25 12, 25 15 L25 45 C25 48, 27 50, 30 50 L40 50 C42 50, 45 48, 45 45 L45 40 L55 40 L55 45 C55 50, 50 55, 40 55 L30 55 C20 55, 15 50, 15 45 Z"
          fill="currentColor" stroke="currentColor" stroke-width="1" class="text-foreground dark:text-sete-light"></path>

        <!-- Apostrophe -->
        <path
          d="M66 6 L69 6 C70.5 6, 72 7.5, 72 9 L72 20 C72 21.5, 70.5 23, 69 23 L66 23 C64.5 23, 63 21.5, 63 20 L63 9 C63 7.5, 64.5 6, 66 6 Z"
          fill="currentColor" class="text-foreground dark:text-sete-light opacity-75"></path>
      </svg>

      
      <div class="ml-2">
        <span class="text-lg font-bold text-sete-primary dark:text-sete-secondary">Can'Lift</span>
        <span class="hidden md:inline text-xs font-medium ml-1 dark:text-foreground opacity-75">
          - Reports et Simulations d'incidents
        </span>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center gap-2 ml-auto flex-shrink-0">
      <!-- Theme Toggle - Enhanced Version -->
      <ThemeToggle variant="button" size="sm" :show-label="false" />
      
      <!-- Simulation Button -->
      <Button variant="outline" size="sm" @click="goToSimulation" class="flex items-center gap-2 py-4 mr-1">
        <font-awesome-icon :icon="['fas', 'chart-line']" class="h-4 w-4" />
        <span class="hidden md:inline">Simulation</span>
      </Button>

      <!-- Alerting Button -->
      <Button variant="outline" size="sm" @click="goToAlerting" class="flex items-center gap-2 py-4">
        <font-awesome-icon :icon="['fas', 'bell']" class="h-4 w-4" />
        <span class="hidden md:inline">Alerting</span>
      </Button>

      <!-- User Menu -->
      <template v-if="isAuthenticated">
        <!-- User Info -->
        <div class="hidden md:flex items-center text-sm text-gray-600 dark:text-gray-300 px-3">
          {{ currentUser.username }}
        </div>

        <!-- Logout Button -->
        <Button variant="destructive" size="sm" @click="logOut" class="flex items-center gap-2 py-4 mr-1">
          <font-awesome-icon :icon="['fas', 'power-off']" class="h-4 w-4" />
          <span class="hidden md:inline">Déconnexion</span>
        </Button>
      </template>

      <!-- Login Button -->
      <template v-else>
        <Button variant="ghost" size="default" @click="goToLogin">
          Se connecter
        </Button>
      </template>

      <!-- TODO: Add shadcn vue user icon here -->
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPowerOff, faSignInAlt, faChartLine, faBell } from '@fortawesome/free-solid-svg-icons'
import { POST_LOGOUT } from '../store/action.type'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

library.add(faPowerOff, faSignInAlt, faChartLine, faBell)

export default defineComponent({
  name: 'TheHeader',
  components: {
    Button,
    ThemeToggle
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    // Vue 3 Composition API best practice: Use computed for reactive state
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const currentUser = computed(() => store.getters.currentUser)
    const isAdmin = computed(() => store.getters.isAdmin)

    const logOut = () => {
      store.dispatch(POST_LOGOUT).then(() => {
        router.push({ name: 'login' })
      })
    }

    const goToLogin = () => {
      router.push({ name: 'login' })
    }

    const goToSimulation = () => {
      router.push({ name: 'simulation' })
    }

    const goToAlerting = () => {
      router.push({ name: 'alerting' })
    }

    return {
      isAuthenticated,
      currentUser,
      isAdmin,
      logOut,
      goToLogin,
      goToSimulation,
      goToAlerting
    }
  }
})
</script>
