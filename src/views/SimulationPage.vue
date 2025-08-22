<template>
  <div class="Simulation">
    <SimulationHeader />
    <div class="container-fluid px-3">
      <div class="row mt-3">
        <div class="col"><SimulationConfig /></div>
        <div class="col"><AppInformations /></div>
      </div>
      <div class="row mt-3" v-show="getSimulationSlots && getSimulationSlots.length">
        <div class="col">
          <EventList />
          <SimulationEvent />
          <SimulationEventDeleteConfirmationModal />
          <SimulationDeleteConfirmationModal />
        </div>
        <div class="col"><EventTarget /></div>
      </div>
      <div class="row" v-show="getSimulationSlots && getSimulationSlots.length">
        <div class="col"><SimulationTab /></div>
      </div>
      <div class="col-8 offset-2 shadow rounded mb-4">
        <div class="row py-4" v-if="getSimulationSlots && getSimulationSlots.length">
          <div class="col"><SimulationChartLegend /></div>
        </div>
        <div class="row" v-if="getSimulationSlots && getSimulationSlots.length">
          <div class="col"><SimulationChart id="chart" /></div>
        </div>
      </div>
    </div>
    <div class="filterDisableConfig" v-if="!isConfigEnabled"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import SimulationHeader from '../components/SimulationHeader.vue'
import SimulationConfig from '../components/SimulationConfig.vue'
import EventList from '../components/EventList.vue'
import EventTarget from '../components/EventTarget.vue'
import SimulationTab from '../components/SimulationTab.vue'
import SimulationEvent from '../components/SimulationEvent.vue'
import SimulationEventDeleteConfirmationModal from '../components/SimulationEventDeleteConfirmationModal.vue'
import SimulationDeleteConfirmationModal from '../components/SimulationDeleteConfirmationModal.vue'
import AppInformations from '../components/AppInformations.vue'
import SimulationChart from '../components/SimulationChart.vue'
import SimulationChartLegend from '../components/SimulationChartLegend.vue'

export default defineComponent({
  name: 'SimulationPage',
  components: {
    SimulationChart,
    AppInformations,
    SimulationEvent,
    SimulationEventDeleteConfirmationModal,
    SimulationDeleteConfirmationModal,
    SimulationHeader,
    SimulationConfig,
    EventList,
    EventTarget,
    SimulationTab,
    SimulationChartLegend
  },
  setup() {
    const store = useStore()
    const getSimulationSlots = computed(() => store.getters.getSimulationSlots)
    const isConfigEnabled = computed(() => store.getters.isConfigEnabled)

    return {
      getSimulationSlots,
      isConfigEnabled
    }
  }
})
</script>
