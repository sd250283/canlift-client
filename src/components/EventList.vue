<template>
  <div class="card shadow" id="eventList">
    <div class="card-header bg-primary">
      <span>Liste des événements</span>
      <svg width="0" height="0">
        <radialGradient id="rg" r="150%" cx="30%" cy="107%">
          <stop stop-color="#DB4144" offset="0" />
          <stop stop-color="#EB6650" offset="0.9" />
        </radialGradient>
      </svg>
      <span class="float-end" @click="showPopup()">
        <font-awesome-icon title="Ajout d'un évènement" :icon="['fa', 'plus-circle']" size="lg" />
      </span>
    </div>
    <div class="card-body" style="min-height: 64px">
      <ul class="list-group list-group-flush">
        <li
          v-for="(simulationEvent) in events"
          :key="simulationEvent.id"
          class="list-group-item d-flex justify-content-between align-items-center py-0 border-0"
        >
          {{ simulationEvent.simulationElevator.name }} : {{ formatTime(simulationEvent.startTime) }} -
          {{ formatTime(simulationEvent.endTime) }}
          <div class="btn-group" data-html2canvas-ignore="true">
            <button class="btn btn-link p-1" @click="editEvent(simulationEvent)">
              <font-awesome-icon title="Modification de l'évènement" :icon="['fas', 'pencil-alt']" />
            </button>
            <button class="btn btn-link p-1" @click="deleteEvent(simulationEvent)">
              <font-awesome-icon title="Suppression de l'énèvement" :icon="['fas', 'trash-alt']" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { UPDATE_SIMULATION_EVENT_SHOW_POPUP, DELETE_SIMULATION_EVENT_SHOW_POPUP } from '@/store/mutations.type'
import { FETCH_SIMULATION_EVENT_LIST, EDIT_SIMULATION_EVENT } from '@/store/action.type'
import moment from 'moment'

library.add(faPlusCircle, faPencilAlt, faTrashAlt)

export default defineComponent({
  name: 'EventList',
  setup() {
    const store = useStore()

    const events = computed(() => store.getters.getEventList)

    onMounted(() => {
      store.dispatch(FETCH_SIMULATION_EVENT_LIST)
    })

    // Watch for simulation changes to load events when simulation is available
    const simulation = computed(() => store.getters.simulation)
    watch(simulation, (newSimulation) => {
      if (newSimulation && newSimulation.id && newSimulation.id !== null) {
        store.dispatch(FETCH_SIMULATION_EVENT_LIST, newSimulation.id)
      }
    }, { immediate: true })

    const showPopup = () => {
      store.commit(UPDATE_SIMULATION_EVENT_SHOW_POPUP, [true, true])
    }

    const deleteEvent = (simulationEvent: any) => {
      store.commit(DELETE_SIMULATION_EVENT_SHOW_POPUP, [true, simulationEvent])
    }

    const editEvent = (simulationEvent: any) => {
      store.dispatch(EDIT_SIMULATION_EVENT, simulationEvent)
    }

    const formatTime = (time: string) => {
      return moment.utc(time).format('HH:mm')
    }

    return {
      events,
      showPopup,
      deleteEvent,
      editEvent,
      formatTime
    }
  }
})
</script>

<style lang="scss" scoped>
.fa-plus-circle {
  cursor: pointer;
}

svg * {
  fill: url(#rg);
}
</style>
