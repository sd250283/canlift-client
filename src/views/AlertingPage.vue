<template>
  <div class="alerting-page min-h-screen bg-background p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Alerting système</h1>
        <p class="text-muted-foreground">
          Surveillance et analyse des incidents d'ascenseurs en temps réel
        </p>
      </div>

      <!-- Filters and Information Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Filters -->
        <div>
          <AlertingFilters />
        </div>

        <!-- Right: App Information -->
        <div>
          <InfoSupport />
        </div>
      </div>

      <!-- Main Alerting Table -->
      <div v-show="getAlertingSlots && getAlertingSlots.length">
        <AlertingTable />
      </div>

      <!-- Export Modal -->
      <AlertingExportModal />

      <!-- Loading overlay -->
      <div v-if="!isConfigEnabled" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import InfoSupport from '@/components/InfoSupport.vue'
import AlertingFilters from '../components/alerting/AlertingFilters.vue'
import AlertingTable from '../components/alerting/AlertingTable.vue'
import AlertingExportModal from '../components/alerting/AlertingExportModal.vue'

export default defineComponent({
  name: 'AlertingPage',
  components: {
    InfoSupport,
    AlertingFilters,
    AlertingTable,
    AlertingExportModal
  },
  setup() {
    const store = useStore()
    
    const getAlertingSlots = computed(() => store.getters.getAlertingSlots)
    const isConfigEnabled = computed(() => store.getters.isConfigEnabled)

    return {
      getAlertingSlots,
      isConfigEnabled
    }
  }
})
</script>

<style scoped>
.alerting-page {
  min-height: 100vh;
}
</style>
