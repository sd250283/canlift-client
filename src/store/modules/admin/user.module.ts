import ApiService, { UsersService } from '@/common/api.service'
import { FETCH_USERS, EDIT_USER, POST_USER, DELETE_USER } from '@/store/action.type'
import {
  UPDATE_USERS,
  UPDATE_USER,
  SET_FLASH_MESSAGE_SUCCESS,
  SET_FLASH_MESSAGE_ERROR,
  RESET_USER,
  UPDATE_USER_SHOW_POPUP
} from '@/store/mutations.type'
import { User } from '@/models/index'
import { ActionContext } from 'vuex'
import { extractApiPlatformData } from '@/lib/utils'

interface UserState {
  users: User[];
  user: Partial<User>;
  showDeleteUserPopup: boolean;
  // Simplified pagination for filtered results
  pagination: {
    currentPage: number;
    totalItems: number; // Exact count: totalUsers - anonymousUsers
    itemsPerPage: number;
    totalPages: number;
    hasNextPage: boolean;
    isLastPage: boolean;
  };
}

const initialState: UserState = {
  users: [],
  user: {
    username: null,
    email: null,
    plainPassword: 'password',
    roles: null,
    enabled: null,
    familyName: null,
    givenName: null,
    lastLogin: null
  },
  showDeleteUserPopup: false,
  pagination: {
    currentPage: 1,
    totalItems: 0, // Exact count: totalUsers - anonymousUsers
    itemsPerPage: 15,
    totalPages: 0,
    hasNextPage: false,
    isLastPage: false
  }
}

export const state: UserState = { ...initialState }

const getters = {
  getUser(state: UserState): Partial<User> {
    return state.user
  },
  users(state: UserState): User[] {
    return state.users
  },
  getShowDeleteUserPopup(state: UserState): boolean {
    return state.showDeleteUserPopup
  },
  userPagination(state: UserState) {
    return state.pagination
  }
}

const actions = {
  [FETCH_USERS]({ commit }: ActionContext<UserState, unknown>, { page = 1, itemsPerPage = 15, fetchAll = false } = {}) {
    if (fetchAll) {
      return ApiService.get('users?pagination=false')
        .then(({ data }) => {
          const allUsers = extractApiPlatformData(data)
          const filteredUsers = allUsers.filter((user: User) => user.familyName !== 'anonymous')
          commit(UPDATE_USERS, filteredUsers)
          return Promise.resolve()
        })
        .catch((error: Error) => {
          throw new Error(error.message)
        })
    }

    // Get anonymous count and total count, then fetch data
    return ApiService.get('users')
      .then(({ data: allUsersData }) => {
        const totalAllUsers = (allUsersData as any).totalItems || (allUsersData as any)['hydra:totalItems'] || 0

        return ApiService.get('users?familyName=anonymous')
          .then(({ data: anonymousData }) => {
            const totalAnonymousUsers = (anonymousData as any).totalItems || (anonymousData as any)['hydra:totalItems'] || 0
            const exactTotalItems = totalAllUsers - totalAnonymousUsers

            const apiPage = Math.ceil(page / 2)

            return ApiService.get(`users?page=${apiPage}`)
              .then(({ data }) => {
                const apiUsers = extractApiPlatformData(data)
                const filteredApiUsers = apiUsers.filter((user: User) => user.familyName !== 'anonymous')

                const isFirstPageOfApiData = (page % 2) === 1
                let displayUsers: User[]
                if (isFirstPageOfApiData) {
                  displayUsers = filteredApiUsers.slice(0, itemsPerPage)
                } else {
                  displayUsers = filteredApiUsers.slice(itemsPerPage, itemsPerPage * 2)
                }

                const totalPages = Math.ceil(exactTotalItems / itemsPerPage)
                commit(UPDATE_USERS, displayUsers)
                commit('SET_USER_PAGINATION', {
                  currentPage: page,
                  totalItems: exactTotalItems,
                  itemsPerPage,
                  totalPages,
                  hasNextPage: page < totalPages,
                  isLastPage: page >= totalPages
                })

                return Promise.resolve()
              })
          })
      })
      .catch((error: Error) => {
        throw new Error(error.message)
      })
  },
  async [EDIT_USER]({ commit }: ActionContext<UserState, unknown>, parameters: User) {
    const id = parameters.id;
    if (!id) {
      return;
    }
    delete parameters.id
    return UsersService.update(id, parameters)
      .then(({ data }) => {
        commit(SET_FLASH_MESSAGE_SUCCESS, `L'utilisateur a bien été édité.`)
        // Force page reload to show changes
        window.location.reload()
      })
      .catch((error: Error) => {
        commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
        throw new Error(error.message)
      })
  },
  async [POST_USER]({ dispatch, getters, commit }: ActionContext<UserState, unknown>) {
    const user = getters['getUser']
    try {
      await UsersService.post('users', user)
      commit(SET_FLASH_MESSAGE_SUCCESS, `L'utilisateur : "${user.familyName} ${user.givenName}" a bien été créé.`)
      commit(RESET_USER)
      // Force page reload to show changes
      window.location.reload()
    } catch (e) {
      commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
      throw new Error(e as string)
    }
  },
  async [DELETE_USER]({ dispatch, commit, state }: ActionContext<UserState, unknown>) {
    try {
      if (state.user.id) {
        await UsersService.delete(`users/${state.user.id}`)
        commit(SET_FLASH_MESSAGE_SUCCESS, `L'utilisateur : "${state.user.familyName} ${state.user.givenName}" a bien été supprimé.`)
        // Force page reload to show changes
        window.location.reload()
      }
    } catch (error) {
      commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
      throw new Error(error as string)
    }
  }
}

const mutations = {
  [UPDATE_USERS](state: UserState, users: User[]) {
    state.users = users
  },
  [UPDATE_USER](state: UserState, user: User) {
    state.users = state.users.map((u) => (u.id === user.id ? user : u))
  },
  [RESET_USER](state: UserState) {
    state.user = {
      username: null,
      email: null,
      plainPassword: 'password',
      roles: null,
      enabled: null,
      familyName: null,
      givenName: null,
      lastLogin: null
    }
  },
  [UPDATE_USER_SHOW_POPUP](state: UserState, params: [boolean, User | null]) {
    state.showDeleteUserPopup = params[0]
    state.user = params[1] || {
      username: null,
      email: null,
      plainPassword: 'password',
      roles: null,
      enabled: null,
      familyName: null,
      givenName: null,
      lastLogin: null
    }
  },
  SET_USER_PAGINATION(state: UserState, pagination: any) {
    state.pagination = pagination
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

