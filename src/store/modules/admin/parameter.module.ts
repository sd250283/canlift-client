import ApiService from '@/common/api.service'
import { FETCH_PARAMETERS, EDIT_PARAMETER } from '@/store/action.type'
import {
  UPDATE_PARAMETERS,
  UPDATE_PARAMETER,
  SET_FLASH_MESSAGE_SUCCESS,
  SET_FLASH_MESSAGE_ERROR
} from '@/store/mutations.type'
import { extractApiPlatformData } from '@/lib/utils'

const initialState = {
  parameters: []
}

export const state = { ...initialState }

const getters = {
  getParameters(state: any) {
    return state.parameters
  }
}

const actions = {
  [FETCH_PARAMETERS]({ commit }: any) {
    return ApiService.get('parameters')
      .then(({ data }) => {
        const parameters = extractApiPlatformData(data)
        commit(UPDATE_PARAMETERS, parameters)
      })
      .catch((error: any) => {
        throw new Error(error)
      })
  },
  [EDIT_PARAMETER]({ commit }: any, parameter: any) {
    return ApiService.update('parameters', parameter.id, { 'value': parameter.value })
      .then(({ data }) => {
        commit(UPDATE_PARAMETER, data)
        commit(SET_FLASH_MESSAGE_SUCCESS, `Le paramètre : "${parameter.description}" a bien été édité.`)
      })
      .catch((error: any) => {
        commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
        throw new Error(error)
      })
  }
}

const mutations = {
  [UPDATE_PARAMETERS](state: any, parameters: any) {
    state.parameters = parameters
  },
  [UPDATE_PARAMETER](state: any, parameter: any) {
    state.parameters.forEach((p: any) => {
      if (p.id === parameter.id) {
        p = parameter
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
