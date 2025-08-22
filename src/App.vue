<template>
  <div id="app" class="flex flex-col h-screen bg-background text-foreground">
    <CliftHeader />
    <main class="flex-1">
      <template v-if="isAdminRoute">
        <SidebarProvider :default-open=defaultOpen>
          <div class="flex h-full max-w-full">
            <AppSidebar />
            <!-- Fixed: Remove w-0, keep min-w-0 for proper flex shrinking -->
            <div class="flex-1 overflow-x-hidden max-w-full min-w-0">
              <SidebarTrigger class="fixed py-4 px-3 ml-2 mt-2 h-4 w-fit z-40" />
              <div class="flex-1 mt-8 ml-8 p-4 overflow-x-hidden max-w-full">
                <RouterView :key="$route.fullPath" />
              </div>
            </div>
          </div>
        </SidebarProvider>
      </template>

      <template v-else>
        <RouterView :key="$route.fullPath" />
      </template>
    </main>

    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CliftHeader from '@/components/TheHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SIDEBAR_STORAGE_KEY } from '@/components/ui/sidebar/utils'
export default defineComponent({
  name: 'App',
  components: {
    CliftHeader,
    AppSidebar,
    SidebarProvider,
    SidebarTrigger
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const isLoading = computed(() => store.getters.isLoading)
    const isAdminRoute = computed(() => router.currentRoute.value.path.startsWith('/admin'))
    
    // Get sidebar state from localStorage
    const defaultOpen = localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'false' ? false : true
    
    return {
      isLoading,
      isAdminRoute,
      defaultOpen
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';

#app {
  height: 100%;
}
</style>
