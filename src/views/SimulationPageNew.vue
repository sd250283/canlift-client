<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import InfoSupport from '@/components/InfoSupport.vue'
import SimulationChart from '@/components/SimulationChart.vue'
import SimulationChartLegend from '@/components/SimulationChartLegend.vue'
import SimulationEvent from '@/components/SimulationEvent.vue'
import SimulationEventDeleteConfirmationModal from '@/components/SimulationEventDeleteConfirmationModal.vue'
import SimulationDeleteConfirmationModal from '@/components/SimulationDeleteConfirmationModal.vue'

const store = useStore()

// Computed data from store
const getSimulationSlots = computed(() => store.getters.getSimulationSlots)
const isConfigEnabled = computed(() => store.getters.isConfigEnabled)

// Lifecycle hooks
onMounted(() => {
  // Load simulation data if needed
})

onBeforeUnmount(() => {
  // Clean up any chart instances
})
</script>

<template>
  <div class="simulation-page min-h-screen bg-background p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Simulation d'ascenseurs</h1>
        <p class="text-muted-foreground">
          Gestion et simulation des événements d'ascenseurs
        </p>
      </div>

      <!-- Configuration and Information Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Configuration -->
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Configuration de simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">Zone de configuration</p>
            </CardContent>
          </Card>
        </div>

        <!-- Right: Support Information -->
        <div>
          <InfoSupport />
        </div>
      </div>

      <!-- Event Management Section -->
      <div v-show="getSimulationSlots && getSimulationSlots.length">
        <SimulationEvent />
      </div>

      <!-- Chart Section -->
      <div v-if="getSimulationSlots && getSimulationSlots.length" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-1">
          <SimulationChartLegend />
        </div>
        <div class="lg:col-span-3 bg-card rounded-lg border shadow-sm p-6">
          <SimulationChart />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <SimulationEventDeleteConfirmationModal />
    <SimulationDeleteConfirmationModal />

    <!-- Loading Overlay -->
    <div v-if="!isConfigEnabled" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
  </div>
</template>

<style scoped>
.simulation-page {
  background: hsl(var(--background));
}
</style>
