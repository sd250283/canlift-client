import {
  UPDATE_SIMULATION_CONFIG,
  UPDATE_TYPE,
  UPDATE_SIMULATION_CONFIG_ELEVATORS,
  UPDATE_SIMULATION_CONFIG_DATE,
  UPDATE_SIMULATION_ELEVATORS_AFFECTED_BY_EVENTS,
  UPDATE_SIMULATION_STAIRS_AFFECTED_BY_EVENTS,
  UPDATE_SIMULATION_ALL_AFFECTED_BY_EVENTS,
  UPDATE_SIMULATION_GUIDED_TOUR_AFFECTED_BY_EVENTS,
  UPDATE_SIMULATION_GUIDED_TOUR_NOT_AFFECTED_BY_EVENTS,
  UPDATE_SIMULATION_BRUNCH_AFFECTED_BY_EVENTS,
  UPDATE_SIMULATION_BRUNCH_NOT_AFFECTED_BY_EVENTS,
  UPDATE_SIMULATION_UPSELL_RSTO_AFFECTED_BY_EVENTS,
  UPDATE_SIMULATION_UPSELL_RSTO_NOT_AFFECTED_BY_EVENTS,
  UPDATE_SIMULATION_EVENT_TARGET,
  DELETE_SIMULATION_SHOW_POPUP,
  UPDATE_TOGGLE_CONFIG,
  UPDATE_TOGGLE_LOADING,
  UPDATE_SIMULATION_TOP_AFFECTED_BY_EVENTS
} from '@/store/mutations.type'
import {
  FETCH_SIMULATION_CONFIG_ELEVATORS,
  EDIT_SIMULATION_CONFIG,
  CHANGE_TYPE,
  RESET_SIMULATION_CONFIG,
  ENABLE_CONFIG,
  DISABLE_CONFIG,
  ENABLE_LOADING,
  DISABLE_LOADING
} from '@/store/action.type'
import { SimulationConfigsService, ElevatorsService } from '@/common/api.service'
import { SimulationConfig, Elevator } from '@/models/index'
import { ActionContext } from 'vuex'

interface ConfigState {
  simulationConfig: SimulationConfig;
  showSimulationDeletePopup: boolean;
  enabled: boolean;
  loading: boolean;
}

export const state: ConfigState = {
  simulationConfig: {
    id: null,
    date: new Date().toISOString().slice(0, 10),
    elevatorConfig: [],
    elevatorsAffectedByEvents: true,
    stairsAffectedByEvents: true,
    topAffectedByEvents: true,
    guidedTourAffectedByEvents: true,
    guidedTourNotAffectedByEvents: false,
    brunchAffectedByEvents: false,
    brunchNotAffectedByEvents: false,
    upsellRstoAffectedByEvents: false,
    upsellRstoNotAffectedByEvents: false
  },
  showSimulationDeletePopup: false,
  enabled: true,
  loading: false
}

const getters = {
  simulationConfig(state: ConfigState): SimulationConfig {
    return state.simulationConfig
  },
  getSimulationConfigDate(state: ConfigState): string {
    return state.simulationConfig.date
  },
  getElevatorConfig(state: ConfigState): Elevator[] {
    return state.simulationConfig.elevatorConfig
  },
  getElevatorConfigByCode: (state: ConfigState) => (code: string): Elevator | undefined => {
    return state.simulationConfig.elevatorConfig.find(
      (elevatorConfig: Elevator) => elevatorConfig.code === code
    )
  },
  getShowSimulationDeletePopup(state: ConfigState): boolean {
    return state.showSimulationDeletePopup
  },
  isConfigEnabled(state: ConfigState): boolean {
    return state.enabled
  },
  isLoading(state: ConfigState): boolean {
    return state.loading
  }
}

const mutations = {
  [UPDATE_SIMULATION_CONFIG](state: ConfigState, simulationConfig: SimulationConfig) {
    state.simulationConfig = simulationConfig
  },
  [UPDATE_TYPE](state: ConfigState, params: [number, string, string]) {
    const [index, type, typeLine] = params;
    const elevator = state.simulationConfig.elevatorConfig[index];
    if (elevator) {
      if (typeLine === type) {
        elevator.type = ''
        elevator.active = false
      } else {
        elevator.type = typeLine
        elevator.active = true
      }
    }
  },
  [UPDATE_SIMULATION_CONFIG_DATE](state: ConfigState, date: string) {
    state.simulationConfig.date = date
  },
  [UPDATE_SIMULATION_CONFIG_ELEVATORS](state: ConfigState, elevators: Elevator[]) {
    state.simulationConfig.elevatorConfig = elevators
  },
  [UPDATE_SIMULATION_ELEVATORS_AFFECTED_BY_EVENTS](state: ConfigState) {
    state.simulationConfig.elevatorsAffectedByEvents = true
    state.simulationConfig.stairsAffectedByEvents = false
    state.simulationConfig.topAffectedByEvents = false
    state.simulationConfig.brunchAffectedByEvents = false
    state.simulationConfig.upsellRstoAffectedByEvents = false
    state.simulationConfig.guidedTourAffectedByEvents = false
  },
  [UPDATE_SIMULATION_STAIRS_AFFECTED_BY_EVENTS](state: ConfigState) {
    state.simulationConfig.stairsAffectedByEvents = true
    state.simulationConfig.elevatorsAffectedByEvents = false
    state.simulationConfig.topAffectedByEvents = false
    state.simulationConfig.brunchAffectedByEvents = false
    state.simulationConfig.upsellRstoAffectedByEvents = false
    state.simulationConfig.guidedTourAffectedByEvents = false
  },
  [UPDATE_SIMULATION_TOP_AFFECTED_BY_EVENTS](state: ConfigState) {
    state.simulationConfig.stairsAffectedByEvents = false
    state.simulationConfig.elevatorsAffectedByEvents = false
    state.simulationConfig.topAffectedByEvents = true
    state.simulationConfig.brunchAffectedByEvents = false
    state.simulationConfig.upsellRstoAffectedByEvents = false
    state.simulationConfig.guidedTourAffectedByEvents = false
  },
  [UPDATE_SIMULATION_GUIDED_TOUR_AFFECTED_BY_EVENTS](state: ConfigState) {
    state.simulationConfig.stairsAffectedByEvents = false
    state.simulationConfig.elevatorsAffectedByEvents = false
    state.simulationConfig.topAffectedByEvents = false
    state.simulationConfig.brunchAffectedByEvents = false
    state.simulationConfig.upsellRstoAffectedByEvents = false
    state.simulationConfig.guidedTourAffectedByEvents = true
    state.simulationConfig.guidedTourNotAffectedByEvents = false
    state.simulationConfig.brunchNotAffectedByEvents = false
    state.simulationConfig.upsellRstoNotAffectedByEvents = false
  },
  [UPDATE_SIMULATION_GUIDED_TOUR_NOT_AFFECTED_BY_EVENTS](state: ConfigState, data: string[]) {
    state.simulationConfig.guidedTourNotAffectedByEvents = data.includes('exclude_guided_tour')
  },
  [UPDATE_SIMULATION_BRUNCH_AFFECTED_BY_EVENTS](state: ConfigState) {
    state.simulationConfig.stairsAffectedByEvents = false
    state.simulationConfig.elevatorsAffectedByEvents = false
    state.simulationConfig.topAffectedByEvents = false
    state.simulationConfig.brunchAffectedByEvents = true
    state.simulationConfig.upsellRstoAffectedByEvents = false
    state.simulationConfig.guidedTourAffectedByEvents = false
    state.simulationConfig.guidedTourNotAffectedByEvents = false
    state.simulationConfig.brunchNotAffectedByEvents = false
    state.simulationConfig.upsellRstoNotAffectedByEvents = false
  },
  [UPDATE_SIMULATION_BRUNCH_NOT_AFFECTED_BY_EVENTS](state: ConfigState, data: string[]) {
    state.simulationConfig.brunchNotAffectedByEvents = data.includes('exclude_brunch')
  },
  [UPDATE_SIMULATION_UPSELL_RSTO_AFFECTED_BY_EVENTS](state: ConfigState) {
    state.simulationConfig.stairsAffectedByEvents = false
    state.simulationConfig.elevatorsAffectedByEvents = false
    state.simulationConfig.topAffectedByEvents = false
    state.simulationConfig.brunchAffectedByEvents = false
    state.simulationConfig.upsellRstoAffectedByEvents = true
    state.simulationConfig.guidedTourAffectedByEvents = false
    state.simulationConfig.guidedTourNotAffectedByEvents = false
    state.simulationConfig.brunchNotAffectedByEvents = false
    state.simulationConfig.upsellRstoNotAffectedByEvents = false
  },
  [UPDATE_SIMULATION_UPSELL_RSTO_NOT_AFFECTED_BY_EVENTS](state: ConfigState, data: string[]) {
    state.simulationConfig.upsellRstoNotAffectedByEvents = data.includes('exclude_upsell_rsto')
  },
  [UPDATE_SIMULATION_ALL_AFFECTED_BY_EVENTS](state: ConfigState) {
    state.simulationConfig.elevatorsAffectedByEvents = true
    state.simulationConfig.stairsAffectedByEvents = true
    state.simulationConfig.topAffectedByEvents = false
    state.simulationConfig.brunchAffectedByEvents = false
    state.simulationConfig.upsellRstoAffectedByEvents = false
    state.simulationConfig.guidedTourAffectedByEvents = false
  },
  [UPDATE_SIMULATION_EVENT_TARGET](state: ConfigState, target: Partial<SimulationConfig>) {
    state.simulationConfig.elevatorsAffectedByEvents = target.elevatorsAffectedByEvents ?? false;
    state.simulationConfig.stairsAffectedByEvents = target.stairsAffectedByEvents ?? false;
    state.simulationConfig.topAffectedByEvents = target.topAffectedByEvents ?? false;
    state.simulationConfig.guidedTourAffectedByEvents = target.guidedTourAffectedByEvents ?? false;
    state.simulationConfig.guidedTourNotAffectedByEvents = target.guidedTourNotAffectedByEvents ?? false;
    state.simulationConfig.brunchNotAffectedByEvents = target.brunchNotAffectedByEvents ?? false;
    state.simulationConfig.upsellRstoNotAffectedByEvents = target.upsellRstoNotAffectedByEvents ?? false;
  },
  [DELETE_SIMULATION_SHOW_POPUP](state: ConfigState, params: boolean) {
    state.showSimulationDeletePopup = params
  },
  [UPDATE_TOGGLE_CONFIG](state: ConfigState, parameter: boolean) {
    state.enabled = parameter
  },
  [UPDATE_TOGGLE_LOADING](state: ConfigState, parameter: boolean) {
    state.loading = parameter
  }
}

const actions = {
  [EDIT_SIMULATION_CONFIG]({ commit }: ActionContext<ConfigState, unknown>, simulationConfig: SimulationConfig) {
    if (!simulationConfig.id) return;
    return SimulationConfigsService.update(simulationConfig.id)
      .then(({ data }) => {
        commit(UPDATE_SIMULATION_CONFIG, data)
      })
      .catch((error: Error) => {
        throw new Error(error.message)
      })
  },
  [CHANGE_TYPE]({ commit }: ActionContext<ConfigState, unknown>, params: [number, string, string]) {
    commit(UPDATE_TYPE, params)
  },
  [FETCH_SIMULATION_CONFIG_ELEVATORS]({ commit }: ActionContext<ConfigState, unknown>) {
    ElevatorsService.get()
      .then(({ data }) => {
        commit(
          UPDATE_SIMULATION_CONFIG_ELEVATORS,
          data.map((elevator: Elevator) => elevator)
        )
      })
      .catch((error: Error) => {
        throw new Error(error.message)
      })
  },
  async [RESET_SIMULATION_CONFIG]({ commit, dispatch }: ActionContext<ConfigState, unknown>) {
    commit(UPDATE_SIMULATION_CONFIG_DATE, state.simulationConfig.date)
    dispatch(FETCH_SIMULATION_CONFIG_ELEVATORS)
  },
  [ENABLE_CONFIG]({ commit }: ActionContext<ConfigState, unknown>) {
    commit(UPDATE_TOGGLE_CONFIG, true)
  },
  [DISABLE_CONFIG]({ commit }: ActionContext<ConfigState, unknown>) {
    commit(UPDATE_TOGGLE_CONFIG, false)
  },
  [ENABLE_LOADING]({ commit }: ActionContext<ConfigState, unknown>) {
    commit(UPDATE_TOGGLE_LOADING, true)
  },
  [DISABLE_LOADING]({ commit }: ActionContext<ConfigState, unknown>) {
    commit(UPDATE_TOGGLE_LOADING, false)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
