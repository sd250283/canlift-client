import {
  FETCH_SIMULATION_EVENT_LIST,
  POST_SIMULATION_EVENT,
  DELETE_SIMULATION_EVENT,
  EDIT_SIMULATION_EVENT
} from '@/store/action.type'
import {
  SET_SIMULATION_EVENT_LIST,
  ADD_SIMULATION_EVENT,
  REMOVE_SIMULATION_EVENT,
  UPDATE_SIMULATION_EVENT_SHOW_POPUP,
  UPDATE_SIMULATION_EVENT_ELEVATORS,
  DELETE_SIMULATION_EVENT_SHOW_POPUP,
  UPDATE_SIMULATION_EVENT,
  RESET_SIMULATION_EVENT
} from '@/store/mutations.type'
import { SimulationEvent, createSimulationEvent } from '@/models/index'
import { SimulationEventService } from '@/common/api.service'
import { Elevator } from '@/models/index'
import { ActionContext } from 'vuex'

interface EventState {
  simulationEvents: SimulationEvent[];
  showPopup: boolean;
  showDeletePopup: boolean;
  eventElevators: Elevator[];
  event: SimulationEvent;
  title: string;
  action: 'add' | 'edit';
}

const state: EventState = {
  simulationEvents: [],
  showPopup: false,
  showDeletePopup: false,
  eventElevators: [],
  event: createSimulationEvent({}),
  title: '',
  action: 'add'
}

const getters = {
  simulationEvents: (state: EventState): SimulationEvent[] => state.simulationEvents,
  getEventList: (state: EventState): SimulationEvent[] => state.simulationEvents,
  getShowPopup: (state: EventState): boolean => state.showPopup,
  getShowDeletePopup: (state: EventState): boolean => state.showDeletePopup,
  getEventElevators: (state: EventState): Elevator[] => state.eventElevators,
  getEvent: (state: EventState): SimulationEvent => state.event,
  getTitle: (state: EventState): string => state.title,
  getAction: (state: EventState): 'add' | 'edit' => state.action
}

const actions = {
  [FETCH_SIMULATION_EVENT_LIST]({ commit }: ActionContext<EventState, unknown>, simulationId: number) {
    if (!simulationId || simulationId === null || simulationId === undefined) {
      return Promise.resolve([])
    }
    
    return new Promise((resolve, reject) => {
      SimulationEventService.getList(`simulations/${simulationId}/events`)
        .then(({ data }) => {
          commit(SET_SIMULATION_EVENT_LIST, data.map((event: Partial<SimulationEvent>) => createSimulationEvent(event)))
          resolve(data)
        })
        .catch(({ response }) => {
          reject(response)
        })
    })
  },
  [POST_SIMULATION_EVENT]({ commit }: ActionContext<EventState, unknown>, { simulationId, event }: { simulationId: number; event: SimulationEvent }) {
    return new Promise((resolve, reject) => {
      SimulationEventService.post(`simulations/${simulationId}/events`, event)
        .then(({ data }) => {
          commit(ADD_SIMULATION_EVENT, data)
          resolve(data)
        })
        .catch(({ response }) => {
          reject(response)
        })
    })
  },
  [EDIT_SIMULATION_EVENT]({ commit }: ActionContext<EventState, unknown>, { simulationId, event }: { simulationId: number; event: SimulationEvent }) {
    return new Promise((resolve, reject) => {
      SimulationEventService.put(`simulations/${simulationId}/events/${event.id}`, event)
        .then(({ data }) => {
          commit(UPDATE_SIMULATION_EVENT, data)
          resolve(data)
        })
        .catch(({ response }) => {
          reject(response)
        })
    })
  },
  [DELETE_SIMULATION_EVENT]({ commit }: ActionContext<EventState, unknown>, { simulationId, eventId }: { simulationId: number; eventId: number }) {
    return new Promise((resolve, reject) => {
      SimulationEventService.delete(`simulations/${simulationId}/events/${eventId}`)
        .then(() => {
          commit(REMOVE_SIMULATION_EVENT, eventId)
          resolve(null)
        })
        .catch(({ response }) => {
          reject(response)
        })
    })
  }
}

const mutations = {
  [SET_SIMULATION_EVENT_LIST](state: EventState, simulationEvents: SimulationEvent[]) {
    state.simulationEvents = simulationEvents
  },
  [ADD_SIMULATION_EVENT](state: EventState, simulationEvent: SimulationEvent) {
    state.simulationEvents.push(simulationEvent)
  },
  [UPDATE_SIMULATION_EVENT](state: EventState, simulationEvent: SimulationEvent) {
    const index = state.simulationEvents.findIndex((event: SimulationEvent) => event.id === simulationEvent.id)
    if (index !== -1) {
      state.simulationEvents.splice(index, 1, simulationEvent)
    }
  },
  [REMOVE_SIMULATION_EVENT](state: EventState, eventId: number) {
    state.simulationEvents = state.simulationEvents.filter(
      (event: SimulationEvent) => event.id !== eventId
    )
  },
  [UPDATE_SIMULATION_EVENT_SHOW_POPUP](state: EventState, showPopup: boolean) {
    state.showPopup = showPopup
  },
  [DELETE_SIMULATION_EVENT_SHOW_POPUP](state: EventState, showDeletePopup: boolean) {
    state.showDeletePopup = showDeletePopup
  },
  [UPDATE_SIMULATION_EVENT_ELEVATORS](state: EventState, eventElevators: Elevator[]) {
    state.eventElevators = eventElevators
  },
  [RESET_SIMULATION_EVENT](state: EventState) {
    state.event = createSimulationEvent({})
    state.title = ''
    state.action = 'add'
    state.showPopup = false
    state.showDeletePopup = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

