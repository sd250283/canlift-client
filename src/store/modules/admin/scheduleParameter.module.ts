import ApiService from '@/common/api.service'
import { FETCH_SCHEDULE_PARAMETERS, EDIT_SCHEDULE_PARAMETER } from '@/store/action.type'
import {
  UPDATE_SCHEDULE_PARAMETERS,
  UPDATE_SCHEDULE_PARAMETER,
  SET_FLASH_MESSAGE_ERROR,
  SET_FLASH_MESSAGE_SUCCESS
} from '@/store/mutations.type'
import { extractApiPlatformData } from '@/lib/utils'

const initialState = {
  scheduleParameter: {
    start: null,
    end: null
  }
}

export const state = { ...initialState }

const getters = {
  scheduleParameter(state: any) {
    return state.scheduleParameter[0]
  }
}

const actions = {
  [FETCH_SCHEDULE_PARAMETERS]({ commit }: any) {
    return ApiService.get('scheduleparameters')
      .then(({ data }) => {
        const scheduleParameters = extractApiPlatformData(data)
        commit(UPDATE_SCHEDULE_PARAMETERS, scheduleParameters)
      })
      .catch((error: any) => {
        throw new Error(error)
      })
  },
  [EDIT_SCHEDULE_PARAMETER]({ commit }: any, p: any) {
    return ApiService.update('scheduleparameters', '1', p)
      .then(({ data }) => {
        commit(UPDATE_SCHEDULE_PARAMETER, p)
        commit(SET_FLASH_MESSAGE_SUCCESS, `L'heure a bien été éditée.`)
      })
      .catch((error: any) => {
        commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
        throw new Error(error)
      })
  }
}

const mutations = {
  [UPDATE_SCHEDULE_PARAMETERS](state: any, scheduleParameter: any) {
    state.scheduleParameter = scheduleParameter
  },
  [UPDATE_SCHEDULE_PARAMETER](state: any, params: any) {
    if (params.key === 'start') {
      state.scheduleParameter[0].start = params.value
    }
    if (params.key === 'end') {
      state.scheduleParameter[0].end = params.value
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
