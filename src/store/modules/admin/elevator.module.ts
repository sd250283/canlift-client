import ApiService from '@/common/api.service'
import {
  FETCH_ELEVATORS,
  EDIT_ELEVATOR,
  DELETE_ELEVATOR
} from '@/store/action.type'
import {
  SET_ELEVATORS,
  UPDATE_ELEVATOR,
  REMOVE_ELEVATOR
} from '@/store/mutations.type'
import type { Elevator } from '@/models/index'
import { extractApiPlatformData } from '@/lib/utils'

const state = {
  elevators: []
}

const getters = {
  elevators: (state: any) => state.elevators
}

const actions = {
  [FETCH_ELEVATORS]({ commit }: any, { page = 1, itemsPerPage = 50, fetchAll = false } = {}) {
    return new Promise((resolve, reject) => {
      // For elevators, usually smaller dataset, so default to fetch all
      const endpoint = fetchAll ? 'elevators?pagination=false' : `elevators?page=${page}&itemsPerPage=${itemsPerPage}`
      
      ApiService.get(endpoint)
        .then(({ data }) => {
          const elevators = extractApiPlatformData(data)
          commit(SET_ELEVATORS, elevators)
          resolve(elevators)
        })
        .catch((error) => {
          process.env.NODE_ENV === 'development' && console.error("Failed to fetch elevators:", error);
          reject(error)
        })
    })
  },
  [EDIT_ELEVATOR]({ commit }: any, elevator: Elevator) {
    return new Promise((resolve, reject) => {
      ApiService.put(`elevators/${elevator.id}`, elevator)
        .then(({ data }) => {
          commit(UPDATE_ELEVATOR, data)
          resolve(data)
        })
        .catch((error) => {
          process.env.NODE_ENV === 'development' && console.error(`[elevator.module] PUT request failed:`, error)
          process.env.NODE_ENV === 'development' && console.error(`[elevator.module] Error details:`, {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          })
          reject(error.response || error)
        })
    })
  },
  [DELETE_ELEVATOR]({ commit }: any, elevatorId: number) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`elevators/${elevatorId}`)
        .then(() => {
          commit(REMOVE_ELEVATOR, elevatorId)
          resolve(null)
        })
        .catch(({ response }) => {
          reject(response)
        })
    })
  }
}

const mutations = {
  [SET_ELEVATORS](state: any, elevators: Elevator[]) {
    state.elevators = elevators
  },
  [UPDATE_ELEVATOR](state: any, elevator: Elevator) {
    const index = state.elevators.findIndex((e: Elevator) => e.id === elevator.id)
    if (index !== -1) {
      const oldElevator = state.elevators[index]
      state.elevators.splice(index, 1, elevator)
    } else {
      process.env.NODE_ENV === 'development' && console.warn(`[elevator.module] Elevator with ID ${elevator.id} not found in state`)
    }
  },
  [REMOVE_ELEVATOR](state: any, elevatorId: number) {
    state.elevators = state.elevators.filter((e: Elevator) => e.id !== elevatorId)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

