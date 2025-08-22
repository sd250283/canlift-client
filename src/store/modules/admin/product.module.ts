import ApiService from '@/common/api.service'
import {
  FETCH_PRODUCTS,
  FETCH_ALL_PRODUCTS,
  POST_PRODUCT,
  EDIT_PRODUCT,
  DELETE_PRODUCT
} from '@/store/action.type'
import {
  SET_PRODUCTS,
  UPDATE_PRODUCT,
  REMOVE_PRODUCT,
  RESET_PRODUCT,
  SET_FLASH_MESSAGE_SUCCESS,
  SET_FLASH_MESSAGE_ERROR
} from '@/store/mutations.type'
import type { Product } from '@/models/index'
import { extractApiPlatformData } from '@/lib/utils'
import {
  computeRequiredApiPage,
  isCacheValidForPage,
  slicePage,
  extractTotalItemsFromApi,
  extractHydraFlags,
  buildPagination
} from '@/lib/paginationCache'
import { prepareProductForPost } from '@/models/Product' // Import the utility function

const initialState = {
  products: [],
  product: {
    libelle: '',
    type: '',
    gts_libelle: '',
    gts_code: '',
    gts_id: '',
    IsSession: false,
    IsContigent: false,
    IsBookable: false,
    IsFree: false,
    IsInvite: false,
    IsBundle: false,
    IsUpsell: false,
    IsPrimeYield: false,
    IsFrequented: false
  },
  pagination: {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 15,
    totalPages: 0
  },
  // NEW: cache for buffered API pages (30 items)
  dataCache: {
    items: [],
    apiPage: 0,
    totalFetched: 0,
    lastFetchTime: 0
  }
}

export const state = { ...initialState }

const getters = {
  products: (state: any) => state.products,
  getProduct: (state: any) => state.product,
  productPagination: (state: any) => state.pagination,
  // NEW: expose cache if needed elsewhere
  getProductDataCache: (state: any) => state.dataCache
}

const actions = {
  // Paginated table view with buffered 30->15 logic + cache
  [FETCH_PRODUCTS]({ commit, state }: any, { page = 1, itemsPerPage = 15, fetchAll = false } = {}) {
    const apiItemsPerPage = 30
    const tableItemsPerPage = 15
    const requiredApiPage = computeRequiredApiPage(page, apiItemsPerPage, tableItemsPerPage)

    const now = Date.now()
    const cacheValidTime = 5 * 60 * 1000 // 5 minutes
    const hasRequiredData = isCacheValidForPage(state.dataCache, requiredApiPage, now, cacheValidTime)

    if (hasRequiredData) {
      const pageItems = slicePage(state.dataCache.items, page, apiItemsPerPage, tableItemsPerPage)
      commit(SET_PRODUCTS, pageItems)
      // keep previous totalItems; just move currentPage
      commit('SET_PRODUCT_PAGINATION', {
        ...state.pagination,
        currentPage: page,
        itemsPerPage: tableItemsPerPage
      })
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      ApiService.get(`products?page=${requiredApiPage}&itemsPerPage=${apiItemsPerPage}`)
        .then(({ data }) => {
          const productsAll = extractApiPlatformData(data)

          // update cache
          commit('UPDATE_PRODUCT_CACHE', {
            items: productsAll,
            apiPage: requiredApiPage,
            totalFetched: productsAll.length,
            lastFetchTime: now
          })

          // slice for current table page
          const pageItems = slicePage(productsAll, page, apiItemsPerPage, tableItemsPerPage)
          commit(SET_PRODUCTS, pageItems)

          // pagination metadata
          const totalItems = extractTotalItemsFromApi(data)
          const { hasNextPage, isLastPage } = extractHydraFlags(data, productsAll.length, apiItemsPerPage)
          commit('SET_PRODUCT_PAGINATION', buildPagination(
            totalItems,
            page,
            tableItemsPerPage,
            hasNextPage,
            isLastPage,
            apiItemsPerPage
          ))

          resolve(pageItems)
        })
        .catch((error) => {
          process.env.NODE_ENV === 'development' && console.error('Failed to fetch products:', error)
          reject(error)
        })
    })
  },

  // Fetch all for dropdown/reference use (no pagination state changes)
  [FETCH_ALL_PRODUCTS]({ commit }: any) {
    return new Promise((resolve, reject) => {
      ApiService.get('products?pagination=false')
        .then(({ data }) => {
          const products = extractApiPlatformData(data)
          commit(SET_PRODUCTS, products)
          resolve(products)
        })
        .catch((error) => {
          process.env.NODE_ENV === 'development' && console.error('Failed to fetch all products:', error)
          reject(error)
        })
    })
  },
  [POST_PRODUCT]({ dispatch, getters, commit }: any, productData?: Product) {
    const product = productData || getters['getProduct']
    const apiPayload = prepareProductForPost(product) // Use the utility function

    return new Promise((resolve, reject) => {
      ApiService.post('products', apiPayload)
        .then(({ data }) => {
          commit(SET_FLASH_MESSAGE_SUCCESS, `Le produit "${product.libelle}" a bien été créé.`)
          // Force page reload to show changes
          window.location.reload()
          resolve(data)
        })
        .catch((error) => {
          commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
          reject(error)
        })
    })
  },
  // Updated: accept payload { data, reloadPage }
  [EDIT_PRODUCT]({ commit }: any, payload: any) {
    return new Promise((resolve, reject) => {
      const hasEnvelope = payload && typeof payload === 'object' && 'data' in payload
      const product: Partial<Product> = hasEnvelope ? payload.data : payload
      const reloadPage: boolean = hasEnvelope ? (payload.reloadPage ?? true) : true

      if (product.id === undefined || product.id === null) {
        commit(SET_FLASH_MESSAGE_ERROR, `Impossible de modifier le produit: ID manquant.`)
        return reject(new Error('Product ID is missing for update operation.'))
      }

      const apiPayload = prepareProductForPost(product as Product) // Use the utility function

      ApiService.update('products', (product.id as number).toString(), apiPayload)
        .then(({ data }) => {
          commit(UPDATE_PRODUCT, data)
          commit(SET_FLASH_MESSAGE_SUCCESS, `Le produit "${product.libelle}" a bien été modifié.`)
          // Respect reloadPage flag (no reload for checkbox toggles)
          process.env.NODE_ENV === 'development' && console.log('Product updated - reloadPage value:', reloadPage, 'Data:', data)
          reloadPage && window.location.reload()
          resolve(data)
        })
        .catch((error) => {
          commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
          reject(error)
        })
    })
  },
  [DELETE_PRODUCT]({ commit }: any, productId: number) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`products/${productId}`)
        .then(() => {
          commit(SET_FLASH_MESSAGE_SUCCESS, `Le produit a bien été supprimé.`)
          // Force page reload to show changes
          window.location.reload()
          resolve(null)
        })
        .catch((error) => {
          commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
          reject(error)
        })
    })
  }
}

const mutations = {
  [SET_PRODUCTS](state: any, products: Product[]) {
    state.products = products
  },
  [UPDATE_PRODUCT](state: any, product: Product) {
    const index = state.products.findIndex((p: Product) => p.id === product.id)
    if (index !== -1) {
      state.products.splice(index, 1, product)
    }
  },
  [REMOVE_PRODUCT](state: any, productId: number) {
    const index = state.products.findIndex((p: Product) => p.id === productId)
    if (index !== -1) {
      state.products.splice(index, 1)
    }
  },
  [RESET_PRODUCT](state: any) {
    state.product = {
      libelle: '',
      type: '',
      gts_libelle: '',
      gts_code: '',
      gts_id: '',
      IsSession: false,
      IsContigent: false,
      IsBookable: false,
      IsFree: false,
      IsInvite: false,
      IsBundle: false,
      IsUpsell: false,
      IsPrimeYield: false,
      IsFrequented: false
    }
  },
  SET_PRODUCT_PAGINATION(state: any, pagination: any) {
    state.pagination = pagination
  },
  // NEW: cache mutation
  UPDATE_PRODUCT_CACHE(state: any, cache: any) {
    state.dataCache = cache
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}