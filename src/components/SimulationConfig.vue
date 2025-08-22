<template>
  <div class="shadow rounded pt-4 px-4 pb-1 border" style="min-height: 252px">
    <div class="row">
      <DatePicker />
      <div class="col-lg-8 py-4">
        <table id="configTab" class="table table-bordered table-condensed table-sm">
          <thead class="font-weight-bold align-middle text-center">
            <tr title="Ascenseurs actifs ou de réserve">
              <th scope="col"></th>
              <th
                :class="simulation_elevator.type === 'reserve' ? 'bg-secondary' : ''"
                v-for="(simulation_elevator, index) in simulationConfig.elevatorConfig"
                scope="col"
                :key="index"
              >
                {{ simulation_elevator.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Capacité</th>
              <td
                class="align-middle text-center"
                :class="simulation_elevator.type === 'reserve' ? 'bg-secondary' : ''"
                v-for="(simulation_elevator, index) in simulationConfig.elevatorConfig"
                :key="index"
              >
                {{ simulation_elevator.capacity }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="text-nowrap">Ascenseur Vente en ligne</th>
              <td
                class="align-middle text-center"
                :class="simulation_elevator.type === 'reserve' ? 'bg-secondary' : ''"
                v-for="(simulation_elevator, index) in simulationConfig.elevatorConfig"
                :key="index"
                @click="switchElevators(index, simulation_elevator.type, 'standard')"
              >
                <svg
                  x="0px"
                  y="0px"
                  v-if="simulation_elevator.type === 'standard'"
                  width="20"
                  height="20"
                  viewBox="0 0 26 26"
                  style="fill: #000000"
                >
                  <path
                    d="M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z"
                  ></path>
                </svg>
              </td>
            </tr>
            <tr>
              <th scope="row">Ascenseur Réserve</th>
              <td
                class="align-middle text-center"
                :class="simulation_elevator.type === 'reserve' ? 'bg-secondary' : ''"
                v-for="(simulation_elevator, index) in simulationConfig.elevatorConfig"
                :key="index"
                @click="switchElevators(index, simulation_elevator.type, 'reserve')"
              >
                <svg
                  x="0px"
                  y="0px"
                  v-if="simulation_elevator.type === 'reserve'"
                  width="20"
                  height="20"
                  viewBox="0 0 26 26"
                  style="fill: #000000"
                >
                  <path
                    d="M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z"
                  ></path>
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col d-flex justify-content-center align-items-center">
        <div>
          <button
            class="btn btn-secondary d-block w-100 rounded-pill text-nowrap shadow-none mb-2"
            @click="updateSimulation(simulationConfig)"
          >
            <font-awesome-icon class="" :icon="['fas', 'check']" size="1x" />
            Valider la configuration
          </button>
          <button
            class="btn btn-outline-secondary d-block w-100 rounded-pill text-nowrap shadow-none mb-2"
            @click="updateSells()"
            :disabled="!simulation.id"
            title="Actualisation des données de vente VivaTicket"
          >
            <font-awesome-icon class="" :icon="['fas', 'redo']" size="lg" />
            Actualiser les ventes
          </button>
          <button
            class="btn btn-outline-secondary d-block w-100 rounded-pill text-nowrap shadow-none"
            @click="deleteSimulation()"
            title="Effacement de toutes les données de la simulation"
          >
            <font-awesome-icon class="" :icon="['fas', 'times']" size="lg" />
            Réinitialiser simulation
          </button>
        </div>
      </div>
      <div class="col text-center">
        <p class="my-0" v-if="simulation.id">
          <span>
            <small>
              Créé le {{ formatDateTime(simulation.createdAt) }} par
              {{ simulation.createdBy.givenName }}
              {{ simulation.createdBy.familyName }}
            </small>
          </span>
          <span v-if="simulation.simulationSlots.length > 0">
            <small>
              - Dernière modification le
              {{ formatDateTime(simulation.simulationSlots[0].updatedAt) }}
            </small>
          </span>
        </p>
        <p class="my-0" v-if="simulation.ticketOfficeLastUpdate">
          <span>
            <small>
              Dernière maj ventes :
              {{ formatDateTime(simulation.ticketOfficeLastUpdate) }}
            </small>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faCheck, faRedo } from '@fortawesome/free-solid-svg-icons'
import {
  FETCH_SIMULATION,
  CHANGE_TYPE,
  FETCH_SIMULATION_SELLS,
  ENABLE_LOADING
} from '@/store/action.type'
import { DELETE_SIMULATION_SHOW_POPUP } from '@/store/mutations.type'
import moment from 'moment'
import DatePicker from '@/components/DatePicker.vue';

library.add(faTimes, faCheck, faRedo)

export default defineComponent({
  name: 'SimulationConfig',
  components: {
    DatePicker
  },
  setup() {
    const store = useStore()

    const simulationConfig = computed(() => store.getters.simulationConfig)
    const simulation = computed(() => store.getters.simulation)

    const switchElevators = (index: number, type: string, typeLine: string) => {
      store.dispatch(CHANGE_TYPE, [index, type, typeLine])
    }

    const updateSimulation = (simulationConfig: any) => {
      store.dispatch(ENABLE_LOADING)
      store.dispatch(FETCH_SIMULATION, simulationConfig)
    }

    const deleteSimulation = () => {
      store.commit(DELETE_SIMULATION_SHOW_POPUP, true)
    }

    const updateSells = () => {
      store.dispatch(ENABLE_LOADING)
      store.dispatch(FETCH_SIMULATION_SELLS)
    }

    const formatDateTime = (value: string) => {
      return moment(value).format('DD/MM/YYYY HH:mm')
    }

    return {
      simulationConfig,
      simulation,
      switchElevators,
      updateSimulation,
      deleteSimulation,
      updateSells,
      formatDateTime
    }
  }
})
</script>

<style scoped>
.navbar-dark .navbar-nav .nav-link {
  color: white !important;
}
.bg-secondary {
  background-color: #fcf7e4 !important;
}
</style>
