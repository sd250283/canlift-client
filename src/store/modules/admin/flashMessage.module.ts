import { SET_FLASH_MESSAGE_ERROR, SET_FLASH_MESSAGE_SUCCESS } from '@/store/mutations.type';

const initialState = {
    flashMessage: {
        text: '',
        type: '',
        dismissCountDown: 0
    }
};

export const state = { ...initialState };

const getters = {
    flashMessage (state: any) {
        return state.flashMessage;
    }
};

const actions = {
};

const mutations = {
    [SET_FLASH_MESSAGE_SUCCESS] (state: any, message: any) {
        state.flashMessage.text = message;
        state.flashMessage.type = 'success';
        state.flashMessage.dismissCountDown = 5;
    },
    [SET_FLASH_MESSAGE_ERROR] (state: any, message: any) {
        state.flashMessage.text = message;
        state.flashMessage.type = 'danger';
        state.flashMessage.dismissCountDown = 5;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
