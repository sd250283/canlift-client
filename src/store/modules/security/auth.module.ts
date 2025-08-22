import ApiService from '@/common/api.service'
import JwtService from '@/common/jwt.service'
import LocalStorageService from '@/common/localStorage.service'
import {
  POST_LOGIN,
  POST_LOGOUT,
  CHECK_AUTH
} from '@/store/action.type'
import {
  UPDATE_AUTH,
  RESET_AUTH,
  UPDATE_ERROR,
  UPDATE_USERNAME,
  SET_USERNAME,
  UPDATE_ROLES,
  SET_ROLES
} from '@/store/mutations.type'
import { User } from '@/models/index'
import { ActionContext } from 'vuex'

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  errors: Record<string, unknown> | null;
}

const defaultUser: User = {
  token: '',
  username: null,
  roles: []
};

const state: AuthState = {
  user: defaultUser,
  isAuthenticated: !!JwtService.getToken(),
  errors: null
}

const getters = {
  currentUser(state: AuthState): User {
    return state.user
  },
  isAuthenticated(state: AuthState): boolean {
    return state.isAuthenticated
  },
  isAdmin(state: AuthState): boolean {
    return state.user.roles?.includes('ROLE_ADMIN') ?? false
  },
  isManager(state: AuthState): boolean {
    return state.user.roles?.includes('ROLE_MANAGER') ?? false
  }
}

const actions = {
  [POST_LOGIN]({ commit }: ActionContext<AuthState, unknown>, credentials: User) {
    return new Promise(resolve => {
      ApiService.post<{ token: string, data: { roles: string[] } }>('login', credentials as any)
        .then(({ data }) => {
          commit(UPDATE_AUTH, data.token)
          commit(UPDATE_ROLES, data.data.roles)
          commit(UPDATE_USERNAME, credentials.username)
          commit(SET_USERNAME)
          commit(SET_ROLES)
          resolve(data)
        })
        .catch(({ response }) => {
          commit(UPDATE_ERROR, response.data.message)
        })
    })
  },
  [POST_LOGOUT]({ commit }: ActionContext<AuthState, unknown>) {
    commit(RESET_AUTH)
  },
  [CHECK_AUTH]({ commit }: ActionContext<AuthState, unknown>) {
    if (JwtService.getToken() && window.localStorage.getItem('USERNAME') && window.localStorage.getItem('ROLES')) {
      ApiService.setHeader()
      commit(SET_USERNAME)
      commit(SET_ROLES)
    } else {
      commit(RESET_AUTH)
    }
  }
}

const mutations = {
  [UPDATE_ERROR](state: AuthState, error: Record<string, unknown>) {
    state.errors = error
  },
  [UPDATE_AUTH](state: AuthState, token: string) {
    state.isAuthenticated = true
    state.errors = {}
    JwtService.saveToken(token)
  },
  [RESET_AUTH](state: AuthState) {
    state.isAuthenticated = false
    state.user = defaultUser
    state.errors = {}
    JwtService.destroyToken()
    LocalStorageService.destroyItem('USERNAME')
    LocalStorageService.destroyItem('ROLES')
  },
  [UPDATE_USERNAME](state: AuthState, username: string | null) {
    LocalStorageService.saveItem('USERNAME', username)
  },
  [SET_USERNAME](state: AuthState) {
    state.user.username = LocalStorageService.getItem('USERNAME')
  },
  [UPDATE_ROLES](state: AuthState, roles: string[]) {
    LocalStorageService.saveItem('ROLES', roles)
  },
  [SET_ROLES](state: AuthState) {
    state.user.roles = LocalStorageService.getItem('ROLES')
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
