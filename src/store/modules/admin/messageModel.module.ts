import { MessageModelService } from '@/common/api.service'
import {
  DELETE_MESSAGE_MODEL,
  FETCH_MESSAGE_MODEL,
  POST_MESSAGE_MODEL,
  EDIT_MESSAGE_MODELS
} from '@/store/action.type'
import {
  SET_FLASH_MESSAGE_ERROR,
  SET_FLASH_MESSAGE_SUCCESS,
  UPDATE_MESSAGE_MODEL,
  UPDATE_MESSAGE_MODELS,
  RESET_MESSAGE
} from '@/store/mutations.type'
import { MessageModel } from '@/models/index'
import { ActionContext } from 'vuex'

interface MessageModelState {
  messageModels: MessageModel[];
  messageModel: Partial<MessageModel>;
}

const initialState: MessageModelState = {
  messageModels: [],
  messageModel: {
    name: '',
    type: '',
    cancelSlot: null
  }
}

export const state: MessageModelState = { ...initialState }

const getters = {
  getMessageModels(state: MessageModelState): MessageModel[] {
    return state.messageModels
  },
  getMessageModel(state: MessageModelState): Partial<MessageModel> {
    return state.messageModel
  },
  getMessageModelsByType: (state: MessageModelState) => (type: string): MessageModel[] => {
    return state.messageModels.filter((messageModel: MessageModel) => {
      return messageModel.type === type || messageModel.type === 'elevator/stair'
    })
  }
}

const actions = {
  async [FETCH_MESSAGE_MODEL]({ commit }: ActionContext<MessageModelState, unknown>) {
    try {
      const { data } = await MessageModelService.getList(`messagemodels`)
      commit(UPDATE_MESSAGE_MODELS, data)
    } catch (error) {
      throw new Error(error as string)
    }
  },
  async [POST_MESSAGE_MODEL]({ dispatch, getters, commit }: ActionContext<MessageModelState, unknown>) {
    const messageModel = getters['getMessageModel']
    try {
      await MessageModelService.post('messagemodels', messageModel)
      commit(SET_FLASH_MESSAGE_SUCCESS, `Le message : "${messageModel.name}" a bien été créé.`)
    } catch (e) {
      commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
      throw new Error(e as string)
    }

    dispatch(FETCH_MESSAGE_MODEL)
  },
  async [DELETE_MESSAGE_MODEL]({ dispatch, commit }: ActionContext<MessageModelState, unknown>, messageModel: MessageModel) {
    try {
      if (messageModel.id) {
        await MessageModelService.delete(`messagemodels/${messageModel.id}`)
        dispatch(FETCH_MESSAGE_MODEL)
        commit(SET_FLASH_MESSAGE_SUCCESS, `Le message : "${messageModel.name}" a bien été supprimé.`)
      }
    } catch (error) {
      commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
      throw new Error(error as string)
    }
  },
  async [EDIT_MESSAGE_MODELS]({ commit }: ActionContext<MessageModelState, unknown>, parameters: MessageModel) {
    const id = parameters.id;
    if (!id) {
      return;
    }
    
    // Create a complete MessageModel object for API call
    const updateData: MessageModel = {
      id: parameters.id,
      name: parameters.name || '',
      type: parameters.type || '',
      cancelSlot: parameters.cancelSlot
    };
    
    return MessageModelService.update(id, updateData)
      .then(({ data }) => {
        commit(UPDATE_MESSAGE_MODEL, data)
        commit(SET_FLASH_MESSAGE_SUCCESS, `Le message a bien été édité.`)
      })
      .catch((error: Error) => {
        commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
        throw new Error(error.message)
      })
  }
}

const mutations = {
  [UPDATE_MESSAGE_MODELS](state: MessageModelState, messageModels: MessageModel[]) {
    state.messageModels = messageModels
  },
  [UPDATE_MESSAGE_MODEL](state: MessageModelState, messageModel: MessageModel) {
    state.messageModels = state.messageModels.map((m) => (m.id === messageModel.id ? messageModel : m))
  },
  [RESET_MESSAGE](state: MessageModelState) {
    state.messageModel = {
      name: '',
      type: '',
      cancelSlot: null
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

