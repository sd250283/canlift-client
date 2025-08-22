import {
  UPDATE_SIMULATION,
  SET_SIMULATION,
  UPDATE_SIMULATION_CONFIG_ELEVATORS,
  RESET_SIMULATION,
  UPDATE_DESK_SELLS,
  UPDATE_TIMETABLE,
  UPDATE_TO_CONTACT_ELEVATOR,
  UPDATE_TO_CONTACT_STAIR,
  UPDATE_SIMULATION_TARGET,
  UPDATE_MESSAGE_MODEL_STAIR,
  UPDATE_MESSAGE_MODEL_ELEVATOR,
  UPDATE_SIMULATION_EVENT_TARGET,
  SET_FLASH_MESSAGE_SUCCESS,
  SET_FLASH_MESSAGE_ERROR,
  DELETE_SIMULATION_SHOW_POPUP,
  UPDATE_TO_CONTACT_TOP
} from '@/store/mutations.type'
import {
  FETCH_SIMULATION,
  FETCH_SIMULATION_SELLS,
  DATE_SIMULATION,
  FETCH_SIMULATION_EVENT_LIST,
  EDIT_DESK_SELLS,
  FETCH_TIMETABLE,
  DELETE_SIMULATION,
  EDIT_TO_CONTACT_ELEVATOR,
  EDIT_TO_CONTACT_STAIR,
  EDIT_TARGET_EVENT,
  FETCH_SIMULATION_CONFIG_ELEVATORS,
  EDIT_MESSAGE_MODEL,
  POST_SIMULATION_PDF,
  EXPORT_SIMULATION_CONTACT,
  ENABLE_CONFIG,
  DISABLE_LOADING,
  ENABLE_LOADING,
  EDIT_TO_CONTACT_TOP
} from '@/store/action.type'
import { SimulationSlotService, SimulationsService } from '@/common/api.service'
import { createElevator, Elevator } from '@/models/index'
import { createSimulation, Simulation } from '@/models/index'
import { SimulationSlot } from '@/models/index'
import { ActionContext } from 'vuex'

interface SimulationState {
  simulation: Simulation;
  timetable: unknown[];
}

const initialState: SimulationState = {
  simulation: createSimulation({}),
  timetable: []
}

export const state: SimulationState = { ...initialState }

const getters = {
  simulation(state: SimulationState): Simulation {
    return state.simulation
  },
  getSimulationDate(state: SimulationState): string {
    return state.simulation.date
  },
  getSimulationSlots(state: SimulationState): SimulationSlot[] {
    return state.simulation.simulationSlots
  },
  getTimetable(state: SimulationState): unknown[] {
    return state.timetable
  }
}

const mutations = {
  [SET_SIMULATION](state: SimulationState, simulationId: number) {
    state.simulation.id = simulationId
  },
  [UPDATE_SIMULATION](state: SimulationState, simulation: Simulation) {
    state.simulation = simulation
  },
  [RESET_SIMULATION](state: SimulationState) {
    state.simulation = createSimulation({})
  },
  [UPDATE_DESK_SELLS](state: SimulationState, parameters: { id: number, value: string }) {
    const slot = state.simulation.simulationSlots.find(
      (simulationSlot: SimulationSlot) => simulationSlot.id === parameters.id
    );
    if (slot) {
      slot.deskSells = parseInt(parameters.value)
    }
  },
  [UPDATE_TIMETABLE](state: SimulationState, timetable: unknown[]) {
    state.timetable = timetable
  },
  [UPDATE_TO_CONTACT_ELEVATOR](state: SimulationState, parameters: { id: number, value: boolean }) {
    const slot = state.simulation.simulationSlots.find(
      (simulationSlot: SimulationSlot) => simulationSlot.id === parameters.id
    );
    if (slot) {
      slot.toContactElevator = parameters.value
    }
  },
  [UPDATE_TO_CONTACT_TOP](state: SimulationState, parameters: { id: number, value: boolean }) {
    const slot = state.simulation.simulationSlots.find(
      (simulationSlot: SimulationSlot) => simulationSlot.id === parameters.id
    );
    if (slot) {
      slot.toContactTop = parameters.value
    }
  },
  [UPDATE_TO_CONTACT_STAIR](state: SimulationState, parameters: { id: number, value: boolean }) {
    const slot = state.simulation.simulationSlots.find(
      (simulationSlot: SimulationSlot) => simulationSlot.id === parameters.id
    );
    if (slot) {
      slot.toContactStair = parameters.value
    }
  },
  [UPDATE_SIMULATION_TARGET](state: SimulationState, parameters: Partial<Simulation>) {
    state.simulation.elevatorsAffectedByEvents = parameters.elevatorsAffectedByEvents ?? false;
    state.simulation.stairsAffectedByEvents = parameters.stairsAffectedByEvents ?? false;
    state.simulation.topAffectedByEvents = parameters.topAffectedByEvents ?? false;
    state.simulation.guidedTourAffectedByEvents = parameters.guidedTourAffectedByEvents ?? false;
    state.simulation.brunchAffectedByEvents = parameters.brunchAffectedByEvents ?? false;
  },
  [UPDATE_MESSAGE_MODEL_ELEVATOR](state: SimulationState, parameters: { id: number, value: string }) {
    const slot = state.simulation.simulationSlots.find(
      (simulationSlot: SimulationSlot) => simulationSlot.id === parameters.id
    );
    if (slot) {
      slot.messageModelElevator = parameters.value
    }
  },
  [UPDATE_MESSAGE_MODEL_STAIR](state: SimulationState, parameters: { id: number, value: string }) {
    const slot = state.simulation.simulationSlots.find(
      (simulationSlot: SimulationSlot) => simulationSlot.id === parameters.id
    );
    if (slot) {
      slot.messageModelStair = parameters.value
    }
  }
}

const actions = {
  [FETCH_SIMULATION]({ commit, dispatch }: ActionContext<SimulationState, unknown>, simulationConfig: Simulation) {
    const type = state.simulation.id !== null ? 'put' : 'post'
    const resource =
      state.simulation.id !== null ? `simulations/${state.simulation.id}` : 'simulations'
    return SimulationsService[type](`${resource}`, simulationConfig)
      .then(({ data }) => {
        commit(UPDATE_SIMULATION, data)
        commit(
          UPDATE_SIMULATION_CONFIG_ELEVATORS,
          data.simulationElevators.map((elevator: Elevator) => createElevator(elevator))
        )
        const target = {
          elevatorsAffectedByEvents: data.elevatorsAffectedByEvents,
          stairsAffectedByEvents: data.stairsAffectedByEvents,
          topAffectedByEvents: data.topAffectedByEvents,
          guidedTourAffectedByEvents: data.guidedTourAffectedByEvents,
          guidedTourNotAffectedByEvents: data.guidedTourNotAffectedByEvents,
          brunchAffectedByEvents: data.brunchAffectedByEvents,
          brunchNotAffectedByEvents: data.brunchNotAffectedByEvents,
          upsellRstoAffectedByEvents: data.upsellRstoAffectedByEvents,
          upsellRstoNotAffectedByEvents: data.upsellRstoNotAffectedByEvents
        }
        commit(UPDATE_SIMULATION_EVENT_TARGET, target)
        if (data.id) {
          dispatch(FETCH_SIMULATION_EVENT_LIST, data.id)
        }
        dispatch(FETCH_TIMETABLE)
        commit(SET_FLASH_MESSAGE_SUCCESS, 'La configuration a bien été appliquée à la simulation.')
        dispatch(DISABLE_LOADING)
        if (type === 'post') {
          dispatch(FETCH_SIMULATION_SELLS)
        }
      })
      .catch((error: Error) => {
        commit(SET_FLASH_MESSAGE_ERROR, 'Une erreur est survenue.')
        throw new Error(error.message)
      })
  },
  [FETCH_SIMULATION_SELLS]({ commit, dispatch }: ActionContext<SimulationState, unknown>) {
    if (!state.simulation.id) return;
    return SimulationsService.getSells(state.simulation.id)
      .then(({ data }) => {
        commit(UPDATE_SIMULATION, data)
        commit(SET_FLASH_MESSAGE_SUCCESS, 'Les ventes ont bien été actualisées.')
        dispatch(DISABLE_LOADING)
      })
      .catch((error: Error) => {
        commit(SET_FLASH_MESSAGE_ERROR, 'Les ventes ne peuvent pas être actualisées.')
        throw new Error(error.message)
      })
  },
  async [DATE_SIMULATION]({ commit, dispatch, rootGetters }: ActionContext<SimulationState, any>) {
    const simulationConfigDate = rootGetters.getSimulationConfigDate

    if (!simulationConfigDate || simulationConfigDate === '') {
      commit(SET_FLASH_MESSAGE_ERROR, 'Veuillez sélectionner une date valide.')
      dispatch(ENABLE_CONFIG)
      return
    }

    try {
      const { data } = await SimulationsService.getByDate(simulationConfigDate)
      if (data.length > 0) {
        const simulation = data[0];
        await commit(
          UPDATE_SIMULATION_CONFIG_ELEVATORS,
          simulation.simulationElevators.map((elevator: Elevator) => createElevator(elevator))
        )
        simulation.simulationSlots = []
        commit(SET_SIMULATION, simulation.id)
        await commit(UPDATE_SIMULATION, simulation)

        const target = {
          elevatorsAffectedByEvents: simulation.elevatorsAffectedByEvents,
          stairsAffectedByEvents: simulation.stairsAffectedByEvents,
          topAffectedByEvents: simulation.topAffectedByEvents,
          guidedTourAffectedByEvents: simulation.guidedTourAffectedByEvents,
          guidedTourNotAffectedByEvents: simulation.guidedTourNotAffectedByEvents,
          brunchAffectedByEvents: simulation.brunchAffectedByEvents,
          brunchNotAffectedByEvents: simulation.brunchNotAffectedByEvents,
          upsellRstoAffectedByEvents: simulation.upsellRstoAffectedByEvents,
          upsellRstoNotAffectedByEvents: simulation.upsellRstoNotAffectedByEvents
        }
        commit(UPDATE_SIMULATION_EVENT_TARGET, target)

        dispatch(ENABLE_CONFIG)
        return
      }
      await commit(RESET_SIMULATION)
      dispatch(FETCH_SIMULATION_CONFIG_ELEVATORS)
      dispatch(ENABLE_CONFIG)
    } catch (exception) {
      commit(SET_FLASH_MESSAGE_ERROR, 'Erreur lors du chargement de la simulation.')
      dispatch(ENABLE_CONFIG)
      throw new Error(exception as string)
    }
  },
  async [EDIT_DESK_SELLS]({ dispatch }: ActionContext<SimulationState, unknown>, parameters: { id: number }) {
    try {
      const simulationSlot = state.simulation.simulationSlots.find(
        (slot: SimulationSlot) => slot.id === parameters.id
      )

      if (simulationSlot && state.simulation.id) {
        const response = await SimulationSlotService.put(
          `simulations/${state.simulation.id}/slots/${parameters.id}`,
          simulationSlot
        )
        if (response.data) {
          dispatch(FETCH_SIMULATION)
        }
      }
    } catch (exception) {
      throw new Error(exception as string)
    }
  },
  async [EDIT_TO_CONTACT_ELEVATOR]({ commit, dispatch }: ActionContext<SimulationState, unknown>, parameters: { id: number, value: boolean }) {
    try {
      await commit(UPDATE_TO_CONTACT_ELEVATOR, parameters)
      const simulationSlot = state.simulation.simulationSlots.find(
        (slot: SimulationSlot) => slot.id === parameters.id
      )

      if (simulationSlot && state.simulation.id) {
        const response = await SimulationSlotService.put(
          `simulations/${state.simulation.id}/slots/${parameters.id}`,
          simulationSlot
        )
        if (response.data) {
          dispatch(FETCH_SIMULATION)
        }
      }
    } catch (exception) {
      throw new Error(exception as string)
    }
  },
  async [EDIT_TO_CONTACT_TOP]({ commit, dispatch }: ActionContext<SimulationState, unknown>, parameters: { id: number, value: boolean }) {
    try {
      await commit(UPDATE_TO_CONTACT_TOP, parameters)
      const simulationSlot = state.simulation.simulationSlots.find(
        (slot: SimulationSlot) => slot.id === parameters.id
      )

      if (simulationSlot && state.simulation.id) {
        const response = await SimulationSlotService.put(
          `simulations/${state.simulation.id}/slots/${parameters.id}`,
          simulationSlot
        )
        if (response.data) {
          dispatch(FETCH_SIMULATION)
        }
      }
    } catch (exception) {
      throw new Error(exception as string)
    }
  },
  async [EDIT_TO_CONTACT_STAIR]({ commit, dispatch }: ActionContext<SimulationState, unknown>, parameters: { id: number, value: boolean }) {
    try {
      await commit(UPDATE_TO_CONTACT_STAIR, parameters)
      const simulationSlot = state.simulation.simulationSlots.find(
        (slot: SimulationSlot) => slot.id === parameters.id
      )

      if (simulationSlot && state.simulation.id) {
        const response = await SimulationSlotService.put(
          `simulations/${state.simulation.id}/slots/${parameters.id}`,
          simulationSlot
        )
        if (response.data) {
          dispatch(FETCH_SIMULATION)
        }
      }
    } catch (exception) {
      throw new Error(exception as string)
    }
  },
  async [EDIT_TARGET_EVENT]({ commit }: ActionContext<SimulationState, unknown>, simulationConfig: Partial<Simulation>) {
    if (state.simulation.id === null) {
      return
    }

    try {
      const response = await SimulationsService.put(
        `simulations/${state.simulation.id}`,
        simulationConfig as Simulation
      )
      const parameters = {
        elevatorsAffectedByEvents: response.data.elevatorsAffectedByEvents,
        stairsAffectedByEvents: response.data.stairsAffectedByEvents,
        topAffectedByEvents: response.data.topAffectedByEvents,
        guidedTourAffectedByEvents: response.data.guidedTourAffectedByEvents,
        guidedTourNotAffectedByEvents: response.data.guidedTourNotAffectedByEvents,
        brunchAffectedByEvents: response.data.brunchAffectedByEvents,
        brunchNotAffectedByEvents: response.data.brunchNotAffectedByEvents,
        upsellRstoAffectedByEvents: response.data.upsellRstoAffectedByEvents,
        upsellRstoNotAffectedByEvents: response.data.upsellRstoNotAffectedByEvents
      }
      commit(UPDATE_SIMULATION_TARGET, parameters)
      commit(UPDATE_SIMULATION, createSimulation(response.data))
    } catch (exception) {
      throw new Error(exception as string)
    }
  },
  [FETCH_TIMETABLE]({ commit }: ActionContext<SimulationState, unknown>) {
    if (!state.simulation.id) return;
    return SimulationsService.get(`simulations/${state.simulation.id}/timetable`)
      .then(({ data }) => {
        commit(UPDATE_TIMETABLE, data)
      })
      .catch((error: Error) => {
        throw new Error(error.message)
      })
  },
  [DELETE_SIMULATION]({ commit, dispatch }: ActionContext<SimulationState, unknown>) {
    if (!state.simulation.id) return;
    dispatch(ENABLE_LOADING)
    return SimulationsService.destroy(state.simulation.id)
      .then(() => {
        commit(RESET_SIMULATION)
        commit(DELETE_SIMULATION_SHOW_POPUP, false)
        commit(SET_FLASH_MESSAGE_SUCCESS, 'La configuration a bien été réinitialisée')
        dispatch(DISABLE_LOADING)
      })
      .catch((error: Error) => {
        commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
        throw new Error(error.message)
      })
  },
  async [EDIT_MESSAGE_MODEL]({ dispatch }: ActionContext<SimulationState, unknown>, simulationSlot: SimulationSlot) {
    try {
      if (state.simulation.id && simulationSlot.id) {
        const response = await SimulationSlotService.put(
          `simulations/${state.simulation.id}/slots/${simulationSlot.id}`,
          simulationSlot
        )
        if (response.data) {
          dispatch(FETCH_SIMULATION)
        }
      }
    } catch (exception) {
      throw new Error(exception as string)
    }
  },
  [POST_SIMULATION_PDF]({ commit }: ActionContext<SimulationState, unknown>, file: File) {
    if (!state.simulation.id) return;
    const formData = new FormData()
    formData.append('file', file)
    return SimulationsService.post(`simulations/${state.simulation.id}/pdf`, formData as any)
      .then(() => {
        commit(SET_FLASH_MESSAGE_SUCCESS, `L'export de la simulation a bien été envoyé.`)
      })
      .catch((error: Error) => {
        commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
        throw new Error(error.message)
      })
  },
  [EXPORT_SIMULATION_CONTACT]({ commit }: ActionContext<SimulationState, unknown>) {
    if (!state.simulation.id) return;
    return SimulationsService.post(`simulations/${state.simulation.id}/exports`, {} as any)
      .then(() => {
        commit(SET_FLASH_MESSAGE_SUCCESS, `L'export contact a bien été envoyé.`)
      })
      .catch((error: Error) => {
        commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
        throw new Error(error.message)
      })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
