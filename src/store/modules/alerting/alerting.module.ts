import {
  UPDATE_ALERTING,
  SET_ALERTING,
  UPDATE_ALERTING_CONFIG_ELEVATORS,
  RESET_ALERTING,
  UPDATE_ALERTING_TIMETABLE,
  SET_FLASH_MESSAGE_SUCCESS,
  SET_FLASH_MESSAGE_ERROR,
  UPDATE_ALERTING_CONFIG_DATE,
  SET_EXPORT_MODAL_VISIBILITY // Added new mutation type
} from '@/store/mutations.type'
import {
  FETCH_ALERTING,
  FETCH_ALERTING_CONFIG_ELEVATORS,
  DATE_ALERTING,
  FETCH_ALERTING_TIMETABLE,
  EXPORT_ALERTING_DATA,
  ENABLE_LOADING,
  DISABLE_LOADING
} from '@/store/action.type'
import { SimulationSlotService, SimulationsService } from '@/common/api.service'
import { createElevator, Elevator } from '@/models/index'
import { createSimulation, Simulation } from '@/models/index'
import { SimulationSlot } from '@/models/index'
import { ActionContext } from 'vuex'
import { extractApiPlatformData } from '@/lib/utils'

interface AlertingState {
  alerting: Simulation;
  timetable: unknown[];
  alertingConfig: {
    id: number | null;
    date: string;
    elevatorConfig: Elevator[];
  };
  showExportModal: boolean;
}

const initialState: AlertingState = {
  alerting: createSimulation({}),
  timetable: [],
  alertingConfig: {
    id: null,
    date: new Date().toISOString().slice(0, 10),
    elevatorConfig: []
  },
  showExportModal: false // Added missing property
}

export const state: AlertingState = { ...initialState }

const getters = {
  alerting(state: AlertingState): Simulation {
    return state.alerting
  },
  getAlertingDate(state: AlertingState): string {
    return state.alertingConfig.date
  },
  getAlertingSlots(state: AlertingState): SimulationSlot[] {
    return state.alerting.simulationSlots || []
  },
  getAlertingTimetable(state: AlertingState): unknown[] {
    return state.timetable
  },
  getAlertingElevatorConfig(state: AlertingState): Elevator[] {
    return state.alertingConfig.elevatorConfig
  }
}

const mutations = {
  [SET_ALERTING](state: AlertingState, alertingId: number) {
    state.alerting.id = alertingId
  },
  [UPDATE_ALERTING](state: AlertingState, alerting: Simulation) {
    state.alerting = alerting
  },
  [RESET_ALERTING](state: AlertingState) {
    Object.assign(state, initialState)
  },
  [UPDATE_ALERTING_TIMETABLE](state: AlertingState, timetable: unknown[]) {
    state.timetable = timetable
  },
  [UPDATE_ALERTING_CONFIG_ELEVATORS](state: AlertingState, elevators: Elevator[]) {
    state.alertingConfig.elevatorConfig = elevators
  },
  [UPDATE_ALERTING_CONFIG_DATE](state: AlertingState, date: string) {
    state.alertingConfig.date = date
  },
  SET_EXPORT_MODAL_VISIBILITY(state: AlertingState, visibility: boolean) {
    state.showExportModal = visibility
  }
}

const actions = {
  [FETCH_ALERTING]({ commit, dispatch }: ActionContext<AlertingState, unknown>, alertingConfig: any) {
    return new Promise((resolve, reject) => {
      SimulationsService.post('simulations', alertingConfig)
        .then(({ data }) => {
          commit(UPDATE_ALERTING, data)
          dispatch(DISABLE_LOADING)
          resolve(data)
        })
        .catch((error: Error) => {
          commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue lors de la récupération des données d'alerte.`)
          dispatch(DISABLE_LOADING)
          throw new Error(error.message)
        })
    })
  },

  [DATE_ALERTING]({ commit, dispatch, state }: ActionContext<AlertingState, unknown>) {
    dispatch(ENABLE_LOADING)
    return dispatch(FETCH_ALERTING, state.alertingConfig)
  },

  [FETCH_ALERTING_CONFIG_ELEVATORS]({ commit }: ActionContext<AlertingState, unknown>) {
    return SimulationsService.get('elevators')
      .then(({ data }) => {
        const elevators = extractApiPlatformData(data) // Corrected Hydra data extraction
        commit(UPDATE_ALERTING_CONFIG_ELEVATORS, elevators)
      })
      .catch((error: Error) => {
        throw new Error(error.message)
      })
  },

  [FETCH_ALERTING_TIMETABLE]({ commit }: ActionContext<AlertingState, unknown>) {
    if (!state.alerting.id) return;
    return SimulationsService.get(`simulations/${state.alerting.id}/timetable`)
      .then(({ data }) => {
        commit(UPDATE_ALERTING_TIMETABLE, data)
      })
      .catch((error: Error) => {
        throw new Error(error.message)
      })
  },

  [EXPORT_ALERTING_DATA]({ commit, dispatch }: ActionContext<AlertingState, unknown>, exportConfig: { format: 'csv' | 'excel' | 'mail', data: any }) {
    dispatch(ENABLE_LOADING)
    return new Promise((resolve, reject) => {
      // TODO: Implement actual export functionality based on format
      // This is a placeholder implementation
      setTimeout(() => {
        if (exportConfig.format === 'csv') {
          commit(SET_FLASH_MESSAGE_SUCCESS, 'Export CSV en cours de téléchargement...')
        } else if (exportConfig.format === 'excel') {
          commit(SET_FLASH_MESSAGE_SUCCESS, 'Export Excel en cours de téléchargement...')
        } else if (exportConfig.format === 'mail') {
          commit(SET_FLASH_MESSAGE_SUCCESS, 'Email envoyé avec succès...')
        }
        dispatch(DISABLE_LOADING)
        resolve(exportConfig)
      }, 1000)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
