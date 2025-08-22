<template>
  <div v-if="simulation">
    <table id="simulationTab" class="table table-responsive table-striped table-hover shadow mt-3 text-center table-sm">
      <thead class="table-dark">
        <tr>
          <th v-for="column in columns" :key="column.key" :title="column.headerTitle">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="slot in cptItems"
          :key="slot.id"
          :class="{
            'table-success': slot.isActionZone,
            'table-danger': slot.isRedZone
          }"
        >
          <td class="p-0">{{ formatTime(slot.startTime) }}</td>
          <td class="p-0 td-elevator" :class="{ 'bg-info': northElevatorConfig.type === 'reserve' }">
            <div
              v-show="
                (slot.isAffectedByEvents && getElevatorCodeAffectedByEvents.includes('north_elevator')) ||
                (slot.northElevatorRate === 100 && northElevatorConfig.type === 'reserve')
              "
              :class="{ 'bg-danger text-white': slot.northElevatorRate === 0 }"
            >
              {{ slot.northElevatorRate }}%
            </div>
          </td>
          <td class="p-0 td-elevator" :class="{ 'bg-info': eastElevatorConfig.type === 'reserve' }">
            <div
              v-show="
                (slot.isAffectedByEvents && getElevatorCodeAffectedByEvents.includes('east_elevator')) ||
                (slot.eastElevatorRate === 100 && eastElevatorConfig.type === 'reserve')
              "
              :class="{ 'bg-danger text-white': slot.eastElevatorRate === 0 }"
            >
              {{ slot.eastElevatorRate }}%
            </div>
          </td>
          <td class="p-0 td-elevator" :class="{ 'bg-info': westElevatorConfig.type === 'reserve' }">
            <div
              v-show="
                (slot.isAffectedByEvents && getElevatorCodeAffectedByEvents.includes('west_elevator')) ||
                (slot.westElevatorRate === 100 && westElevatorConfig.type === 'reserve')
              "
              :class="{ 'bg-danger text-white': slot.westElevatorRate === 0 }"
            >
              {{ slot.westElevatorRate }}%
            </div>
          </td>
          <td class="p-0">{{ slot.totalElevationCapacity }}</td>
          <td class="p-0">{{ slot.onlineSells }}</td>
          <td class="p-0">
            <input
              type="number"
              min="0"
              class="form-control form-control-sm text-center"
              :class="{ 'is-invalid': slot.deskSells < 0 }"
              v-model="slot.deskSells"
              @blur="updateDeskSells(slot.id, slot.deskSells)"
            />
          </td>
          <td class="p-0">
            <div class="text-danger">{{ slot.waitingVisitors }}</div>
          </td>
          <td class="p-0">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="slot.toContactElevator"
                @change="updateToContactElevator(slot.id, slot.toContactElevator)"
                :disabled="
                  !simulation.elevatorsAffectedByEvents &&
                  !simulation.guidedTourAffectedByEvents &&
                  !simulation.brunchAffectedByEvents &&
                  !simulation.upsellRstoAffectedByEvents
                "
              />
            </div>
          </td>
          <td class="p-0">{{ slot.restaurantSells }}</td>
          <td class="p-0">{{ slot.receptionRoomSells }}</td>
          <td class="p-0">{{ slot.stairVisitors }}</td>
          <td class="p-0">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="slot.toContactStair"
                @change="updateToContactStair(slot.id, slot.toContactStair)"
                :disabled="!simulation.stairsAffectedByEvents && !simulation.upsellRstoAffectedByEvents"
              />
            </div>
          </td>
          <td class="p-0">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="slot.toContactTop"
                @change="updateToContactTop(slot.id, slot.toContactTop)"
                :disabled="!simulation.topAffectedByEvents"
              />
            </div>
          </td>
          <td class="p-0">
            <select
              class="form-select form-select-sm"
              v-model="slot.messageModelElevator"
              @change="updateMessageModel(slot)"
              :disabled="!slot.toContactElevator && !slot.toContactTop"
            >
              <option
                v-for="message in messageModelElevator"
                :key="message.id"
                :value="message.id"
              >
                {{ message.name }}
              </option>
            </select>
          </td>
          <td class="p-0">
            <select
              class="form-select form-select-sm"
              v-model="slot.messageModelStair"
              @change="updateMessageModel(slot)"
              :disabled="!slot.toContactStair"
            >
              <option
                v-for="message in messageModelStair"
                :key="message.id"
                :value="message.id"
              >
                {{ message.name }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import {
  EDIT_DESK_SELLS,
  EDIT_MESSAGE_MODEL,
  EDIT_TO_CONTACT_ELEVATOR,
  EDIT_TO_CONTACT_STAIR,
  EDIT_TO_CONTACT_TOP,
  FETCH_MESSAGE_MODEL,
  FETCH_SIMULATION
} from '@/store/action.type'
import { UPDATE_DESK_SELLS } from '@/store/mutations.type'
import moment from 'moment'

export default defineComponent({
  name: 'SimulationTab',
  setup() {
    const store = useStore()

    onMounted(() => {
      store.dispatch(FETCH_MESSAGE_MODEL)
    })

    const columns = [
      { key: 'startTime', label: 'Créneau', tdClass: 'p-0' },
      { key: 'northElevatorRate', label: 'Nord', tdClass: 'p-0 td-elevator' },
      { key: 'eastElevatorRate', label: 'Est', tdClass: 'p-0 td-elevator' },
      { key: 'westElevatorRate', label: 'Ouest', tdClass: 'p-0 td-elevator' },
      {
        key: 'totalElevationCapacity',
        label: 'Capacité d\'ascension',
        tdClass: 'p-0',
        headerTitle: 'Capacité cumulée des ascenseurs en service'
      },
      { key: 'onlineSells', label: 'Ventes en ligne', tdClass: 'p-0', headerTitle: 'Ventes en ligne réelles' },
      { key: 'deskSells', label: 'Ventes sur place', tdClass: 'p-0', headerTitle: 'Ventes sur place saisies' },
      { key: 'waitingVisitors', label: 'Visiteurs en attente', tdClass: 'p-0', headerTitle: 'Visiteurs en attente' },
      {
        key: 'toContactElevator',
        label: 'Contacter ascenseur',
        tdClass: 'p-0',
        headerTitle: 'Permet de sélectionner un message pour les visiteurs ascenseur'
      },
      { key: 'restaurantSells', label: 'RSTO', tdClass: 'p-0', headerTitle: 'Ventes en ligne pour le restaurant' },
      { key: 'receptionRoomSells', label: 'SGE', tdClass: 'p-0', headerTitle: 'Ventes en ligne pour le salon SGE' },
      { key: 'stairVisitors', label: 'Visiteurs escalier', tdClass: 'p-0', headerTitle: 'Ventes en ligne pour l’escalier' },
      {
        key: 'toContactStair',
        label: 'Contacter escalier',
        tdClass: 'p-0',
        headerTitle: 'Permet de sélectionner un message pour les visiteurs escalier'
      },
      {
        key: 'toContactTop',
        label: 'Contacter sommet',
        tdClass: 'p-0',
        headerTitle: 'Permet de sélectionner un message pour les visiteurs sommet'
      },
      {
        key: 'messageModelElevator',
        label: 'Modèle de message ascenseur',
        tdClass: 'p-0',
        headerTitle: 'Message à envoyer aux visiteurs ascenseur'
      },
      { key: 'messageModelStair', label: 'Modèle de message escalier', tdClass: 'p-0', headerTitle: 'Message à envoyer aux visiteurs escalier' }
    ]

    const simulation = computed(() => store.getters.simulation)
    const getElevatorCodeAffectedByEvents = computed(() => store.getters.getElevatorCodeAffectedByEvents)
    const northElevatorConfig = computed(() => store.getters.getElevatorConfigByCode('north_elevator'))
    const westElevatorConfig = computed(() => store.getters.getElevatorConfigByCode('west_elevator'))
    const eastElevatorConfig = computed(() => store.getters.getElevatorConfigByCode('east_elevator'))

    const cptItems = computed(() => {
      const temp = simulation.value.simulationSlots
      temp.forEach((slot: any) => {
        slot._cellVariants = {}
        if (slot.isActionZone) {
          slot._rowVariant = 'success'
        }
        if (slot.isRedZone) {
          slot._rowVariant = 'danger'
        }
        if (northElevatorConfig.value.type === 'reserve') {
          slot._cellVariants['northElevatorRate'] = 'info'
        }

        if (westElevatorConfig.value.type === 'reserve') {
          slot._cellVariants['westElevatorRate'] = 'info'
        }
        if (eastElevatorConfig.value.type === 'reserve') {
          slot._cellVariants['eastElevatorRate'] = 'info'
        }
      })
      return temp
    })

    const messageModelStair = computed(() => store.getters.getMessageModelsByType('stair'))
    const messageModelElevator = computed(() => store.getters.getMessageModelsByType('elevator'))

    const updateDeskSells = async (id: number, value: string) => {
      await store.commit(UPDATE_DESK_SELLS, { id, value })
      if (parseInt(value) >= 0) {
        await store.dispatch(EDIT_DESK_SELLS, { id, value: parseInt(value) })
        await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
      }
    }

    const updateToContactElevator = async (id: number, value: boolean) => {
      await store.dispatch(EDIT_TO_CONTACT_ELEVATOR, { id, value })
      await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
    }

    const updateToContactTop = async (id: number, value: boolean) => {
      await store.dispatch(EDIT_TO_CONTACT_TOP, { id, value })
      await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
    }

    const updateToContactStair = async (id: number, value: boolean) => {
      await store.dispatch(EDIT_TO_CONTACT_STAIR, { id, value })
      await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
    }

    const updateMessageModel = async (simulationSlot: any) => {
      await store.dispatch(EDIT_MESSAGE_MODEL, simulationSlot)
      await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
    }

    const formatTime = (value: string) => {
      return moment.utc(value).format('HH:mm')
    }

    return {
      columns,
      simulation,
      cptItems,
      northElevatorConfig,
      eastElevatorConfig,
      westElevatorConfig,
      getElevatorCodeAffectedByEvents,
      messageModelStair,
      messageModelElevator,
      updateDeskSells,
      updateToContactElevator,
      updateToContactTop,
      updateToContactStair,
      updateMessageModel,
      formatTime
    }
  }
})
</script>

<style scoped>
td {
  padding: 0 !important;
}
.blankSelect {
  background-image: none;
}
</style>
