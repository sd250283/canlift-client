<template>
  <div class="modal fade" :class="{ 'show d-block': showPopup }" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ title }} pour le {{ formatDateTime(simulationConfigDate) }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="row mb-3" v-show="action === 'add'">
              <div class="col-lg-6">
                <label for="simulation-event-elevators"
                  >Ascenseur concerné
                  <font-awesome-icon
                    title="Ascenseur concerné par l'évènement"
                    class="me-2"
                    :icon="['fas', 'info-circle']"
                    size="xs"
                /></label>
              </div>
              <div class="col-lg-6">
                <div id="simulation-event-elevators">
                  <div
                    class="form-check"
                    v-for="elevator in elevatorConfig"
                    :key="elevator.key"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :value="elevator"
                      v-model="eventElevators"
                      :disabled="elevator.type !== 'standard'"
                    />
                    <label class="form-check-label">{{ elevator.name }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-lg-6">
                <label
                  >Début de l'évènement
                  <font-awesome-icon
                    title="Début de l'évènement"
                    class="me-2"
                    :icon="['fas', 'info-circle']"
                    size="xs"
                /></label>
              </div>
              <div class="col-lg-4">
                <select
                  class="form-select"
                  v-model="event.startTime"
                  required
                  :class="{ 'is-invalid': state }"
                >
                  <option v-for="time in timetable" :key="time" :value="time">
                    {{ formatTime(time) }}
                  </option>
                </select>
                <div v-if="invalidFeedback" class="invalid-feedback d-block">
                  {{ invalidFeedback }}
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-lg-6">
                <label
                  >Fin de l'évènement estimé
                  <font-awesome-icon
                    title="Fin de l'évènement"
                    class="me-2"
                    :icon="['fas', 'info-circle']"
                    size="xs"
                /></label>
              </div>
              <div class="col-lg-4">
                <select class="form-select" v-model="event.endTime">
                  <option :value="timetable[timetable.length - 1]">-</option>
                  <option v-for="time in timetable" :key="time" :value="time">
                    {{ formatTime(time) }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-lg-6">
                <label
                  >Capacité disponible
                  <font-awesome-icon
                    title="Capacité de l'ascenseur pendant l'évènement"
                    class="me-2"
                    :icon="['fas', 'info-circle']"
                    size="xs"
                /></label>
              </div>
              <div class="col-lg-4">
                <div class="input-group">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    required
                    v-model="event.rate"
                    class="form-control"
                    :class="{ 'is-invalid': event.rate < 0 || event.rate > 100 }"
                  />
                  <span class="input-group-text">%</span>
                </div>
                <div
                  v-if="event.rate < 0 || event.rate > 100"
                  role="alert"
                  class="invalid-feedback d-block"
                >
                  La capacité disponible doit être comprise entre 0 et 100.
                </div>
              </div>
            </div>
            <div class="row mb-3"
              v-show="elevatorConfig.filter((e: any) => e.type === 'reserve').length > 0"
            >
              <div class="col-lg-12">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="openReserveElevator"
                  />
                  <label class="form-check-label">Ouverture de l'ascenseur de réserve</label>
                </div>
              </div>
            </div>
            <div class="row mb-3"
              v-show="elevatorConfig.filter((e: any) => e.type === 'reserve').length > 0"
            >
              <div class="col-lg-6">
                <label
                  >Ouverture planifiée à
                  <font-awesome-icon
                    title="Heure de mise en service de l'ascenseur de réserve"
                    class="me-2"
                    :icon="['fas', 'info-circle']"
                    size="xs"
                /></label>
              </div>
              <div class="col-lg-4">
                <select
                  class="form-select"
                  :disabled="!openReserveElevator"
                  v-model="event.reserveElevatorStartTime"
                >
                  <option v-for="time in cptTimeTable" :key="time" :value="time">
                    {{ formatTime(time) }}
                  </option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-link text-secondary" @click="close">Annuler</button>
          <button
            type="button"
            class="btn btn-secondary rounded-pill text-nowrap"
            @click="submit()"
            :disabled="isSubmitDisabled"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import {
  UPDATE_SIMULATION_EVENT_ELEVATORS,
  UPDATE_SIMULATION_EVENT_SHOW_POPUP,
  SET_FLASH_MESSAGE_ERROR,
  SET_FLASH_MESSAGE_SUCCESS
} from '@/store/mutations.type'
import {
  DISABLE_LOADING,
  ENABLE_LOADING,
  FETCH_SIMULATION,
  POST_SIMULATION_EVENT
} from '@/store/action.type'
import moment from 'moment'

library.add(faInfoCircle)

export default defineComponent({
  name: 'SimulationEvent',
  setup() {
    const store = useStore()
    const openReserveElevator = ref(false)

    const showPopup = computed({
      get: () => store.getters.getShowPopup,
      set: (value) => store.commit(UPDATE_SIMULATION_EVENT_SHOW_POPUP, value)
    })

    const eventElevators = computed({
      get: () => store.getters.getEventElevators,
      set: (value) => store.commit(UPDATE_SIMULATION_EVENT_ELEVATORS, value)
    })

    const elevatorConfig = computed(() => store.getters.getElevatorConfig)
    const event = computed(() => store.getters.getEvent)
    const simulationConfigDate = computed(() => store.getters.getSimulationConfigDate)
    const timetable = computed(() => store.getters.getTimetable)
    const simulationConfig = computed(() => store.getters.simulationConfig)
    const title = computed(() => store.getters.getTitle)
    const action = computed(() => store.getters.getAction)

    const cptTimeTable = computed(() => {
      let eventEndTime = event.value.endTime
      if (eventEndTime === '') {
        eventEndTime = timetable.value[timetable.value.length - 1]
      }
      return timetable.value.filter((t: string) => t >= event.value.startTime && t <= eventEndTime)
    })

    const state = computed(() => {
      if (event.value.startTime.length === 0 && event.value.endTime.length === 0) {
        return false
      }
      return event.value.endTime && event.value.startTime > event.value.endTime
    })

    const invalidFeedback = computed(() => {
      if (event.value.endTime && event.value.startTime > event.value.endTime) {
        return 'La date de début doit être antérieure à celle de fin.'
      }
      return ''
    })

    const isSubmitDisabled = computed(() => {
      return (
        eventElevators.value.length === 0 ||
        event.value.startTime === '' ||
        (event.value.startTime > event.value.endTime && (event.value.rate < 0 || event.value.rate > 100))
      )
    })

    const submit = async () => {
      store.dispatch(ENABLE_LOADING)
      if (!openReserveElevator.value) {
        event.value.reserveElevatorStartTime = null
      }
      try {
        await store.commit(UPDATE_SIMULATION_EVENT_SHOW_POPUP, false)
        await store.dispatch(POST_SIMULATION_EVENT, { simulationId: simulationConfig.value.id, event: event.value })
        await store.dispatch(FETCH_SIMULATION, simulationConfig.value)
        store.commit(SET_FLASH_MESSAGE_SUCCESS, 'L\'événement a bien été enregistré.')
      } catch (error) {
        store.commit(SET_FLASH_MESSAGE_ERROR, 'Une erreur est survenue lors de l\'enregistrement de l\'événement.')
        process.env.NODE_ENV === 'development' && console.error(error)
      }
       finally {
        store.dispatch(DISABLE_LOADING)
      }
    }

    const close = () => {
      store.commit(UPDATE_SIMULATION_EVENT_SHOW_POPUP, [false, false])
    }

    const formatDateTime = (value: string) => {
      return moment(value).format('DD/MM/YYYY')
    }

    const formatTime = (value: string) => {
      return moment.utc(value).format('HH:mm')
    }

    watch(showPopup, (newValue) => {
      if (!newValue) {
        openReserveElevator.value = false
      }
    })

    return {
      openReserveElevator,
      showPopup,
      eventElevators,
      elevatorConfig,
      event,
      simulationConfigDate,
      timetable,
      simulationConfig,
      title,
      action,
      cptTimeTable,
      state,
      invalidFeedback,
      isSubmitDisabled,
      submit,
      close,
      formatDateTime,
      formatTime
    }
  }
})
</script>
