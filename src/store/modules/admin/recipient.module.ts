import ApiService from '@/common/api.service'
import { DELETE_RECIPIENT, EDIT_RECIPIENT, FETCH_RECIPIENTS, POST_RECIPIENT } from '@/store/action.type'
import {
  RESET_RECIPIENT,
  SET_FLASH_MESSAGE_ERROR,
  SET_FLASH_MESSAGE_SUCCESS,
  UPDATE_RECIPIENT,
  UPDATE_RECIPIENTS
} from '@/store/mutations.type'
import { extractApiPlatformData } from '@/lib/utils'

const initialState = {
  recipients: [],
  recipient: {
    email: null,
    type: null,
    familyName: null,
    givenName: null
  },
  pagination: {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 15,
    totalPages: 0
  }
}

export const state = { ...initialState }

const getters = {
  getRecipient() {
    return state.recipient
  },
  recipients(state: any) {
    return state.recipients
  },
  recipientPagination(state: any) {
    return state.pagination
  }
}

const actions = {
  [FETCH_RECIPIENTS]({ commit }: any, { page = 1, itemsPerPage = 15 } = {}) {
    return ApiService.get(`recipients?page=${page}&itemsPerPage=${itemsPerPage}`)
      .then(({ data }) => {
        const recipients = extractApiPlatformData(data)
        commit(UPDATE_RECIPIENTS, recipients)
        
        // Store pagination info
        const apiData = data as any
        commit('SET_RECIPIENT_PAGINATION', {
          currentPage: page,
          totalItems: apiData.totalItems || apiData['hydra:totalItems'] || 0,
          itemsPerPage,
          totalPages: Math.ceil((apiData.totalItems || apiData['hydra:totalItems'] || 0) / itemsPerPage)
        })
      })
      .catch((error: any) => {
        throw new Error(error)
      })
  },
  async [EDIT_RECIPIENT]({ commit }: any, payload: any) {
    return new Promise((resolve, reject) => {
      const hasEnvelope = payload && typeof payload === 'object' && 'data' in payload
      const recipientData: Partial<any> = hasEnvelope ? payload.data : payload
      const reloadPage: boolean = hasEnvelope ? (payload.reloadPage ?? true) : true

      if (!recipientData.id) {
        commit(SET_FLASH_MESSAGE_ERROR, `Impossible de modifier le destinataire: ID manquant.`)
        return reject(new Error('Recipient ID is missing for update operation.'))
      }

      const id = recipientData.id
      const updateData = { ...recipientData }
      delete updateData.id

      ApiService.update('recipients', id, updateData)
        .then(({ data }) => {
          commit(UPDATE_RECIPIENT, data)
          commit(SET_FLASH_MESSAGE_SUCCESS, `Le destinataire a bien été édité.`)
          
          if (reloadPage) {
            window.location.reload()
          }
          resolve(data)
        })
        .catch((error: any) => {
          commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
          reject(error)
        })
    })
  },
  async [POST_RECIPIENT]({ dispatch, getters, commit }: any) {
    const recipient = getters['getRecipient']
    try {
      await ApiService.post('recipients', recipient)
      commit(SET_FLASH_MESSAGE_SUCCESS, `Le destinataire : "${recipient.familyName} ${recipient.givenName}" a bien été créé.`)
    } catch (e) {
      commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
      throw new Error(e as string)
    }
    dispatch(FETCH_RECIPIENTS)
  },
  async [DELETE_RECIPIENT]({ dispatch, commit }: any, recipient: any) {
    try {
      await ApiService.delete(`recipients/${recipient.id}`)
      dispatch(FETCH_RECIPIENTS)
      commit(SET_FLASH_MESSAGE_SUCCESS, `Le destinataire : "${recipient.familyName} ${recipient.givenName}" a bien été supprimé.`)
    } catch (error) {
      commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
      throw new Error(error as string)
    }
  }
}

const mutations = {
  [UPDATE_RECIPIENTS](state: any, recipients: any) {
    state.recipients = recipients
  },
  [UPDATE_RECIPIENT](state: any, recipient: any) {
    state.recipients = state.recipients.map((r: any) => 
      r.id === recipient.id ? { ...r, ...recipient } : r
    )
  },
  [RESET_RECIPIENT](state: any) {
    state.recipient = {
      email: null,
      type: null,
      familyName: null,
      givenName: null
    }
  },
  SET_RECIPIENT_PAGINATION(state: any, pagination: any) {
    state.pagination = pagination
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
