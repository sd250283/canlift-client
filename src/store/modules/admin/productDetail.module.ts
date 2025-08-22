import ApiService from '@/common/api.service'
import {
  FETCH_PRODUCT_DETAILS,
  POST_PRODUCT_DETAIL,
  EDIT_PRODUCT_DETAIL,
  DELETE_PRODUCT_DETAIL
} from '@/store/action.type'
import {
  SET_PRODUCT_DETAILS,
  UPDATE_PRODUCT_DETAIL,
  REMOVE_PRODUCT_DETAIL,
  RESET_PRODUCT_DETAIL,
  SET_FLASH_MESSAGE_SUCCESS,
  SET_FLASH_MESSAGE_ERROR
} from '@/store/mutations.type'
import type { ProductDetail } from '@/models/Product'
import { extractApiPlatformData } from '@/lib/utils'
import {
  computeRequiredApiPage,
  isCacheValidForPage,
  slicePage,
  extractTotalItemsFromApi,
  extractHydraFlags,
  buildPagination
} from '@/lib/paginationCache'
import { prepareProductDetailForPost } from '@/models/Product' // Import the utility function

const initialState = {
  productDetails: [],
  productDetail: {
    libelle: '',
    gts_libelle: '',
    gts_code: '',
    gts_id: '',
    type: '',
    product: '',
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
  // Enhanced caching for 30-item API responses
  dataCache: {
    items: [],
    apiPage: 0,
    totalFetched: 0,
    lastFetchTime: 0
  },
  pagination: {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 15,
    totalPages: 0,
    hasNextPage: false,
    isLastPage: false,
    apiItemsPerPage: 30,
    tableItemsPerPage: 15
  }
}

export const state = { ...initialState }

const getters = {
  productDetails: (state: any) => state.productDetails,
  getProductDetail: (state: any) => state.productDetail,
  productDetailPagination: (state: any) => state.pagination,
  // NEW: Get cached data for intelligent pagination
  getProductDetailDataCache: (state: any) => state.dataCache
}

const actions = {
  [FETCH_PRODUCT_DETAILS]({ commit, state }: any, { page = 1, itemsPerPage = 15 } = {}) {
    // Calculate which API page we need based on table page
    const apiItemsPerPage = 30
    const tableItemsPerPage = 15
    const requiredApiPage = computeRequiredApiPage(page, apiItemsPerPage, tableItemsPerPage)

    const now = Date.now()
    const cacheValidTime = 5 * 60 * 1000 // 5 minutes
    const hasRequiredData = isCacheValidForPage(state.dataCache, requiredApiPage, now, cacheValidTime)

    if (hasRequiredData) {
      const pageProductDetails = slicePage(state.dataCache.items, page, apiItemsPerPage, tableItemsPerPage)
      commit(SET_PRODUCT_DETAILS, pageProductDetails)
      commit('SET_PRODUCT_DETAIL_PAGINATION', {
        ...state.pagination,
        currentPage: page
      })
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      // Fetch product details with intelligent pagination (30 items at a time)
      ApiService.get(`product_details?page=${requiredApiPage}&itemsPerPage=${apiItemsPerPage}`)
        .then(({ data }) => {
          const productDetails = extractApiPlatformData(data)

          // Cache the full API response (30 items)
          commit('UPDATE_PRODUCT_DETAIL_CACHE', {
            items: productDetails,
            apiPage: requiredApiPage,
            totalFetched: productDetails.length,
            lastFetchTime: now
          })

          // Extract the specific page data for display (15 items)
          const pageProductDetails = slicePage(productDetails, page, apiItemsPerPage, tableItemsPerPage)
          commit(SET_PRODUCT_DETAILS, pageProductDetails)

          const totalItems = extractTotalItemsFromApi(data)
          const { hasNextPage, isLastPage } = extractHydraFlags(data, productDetails.length, apiItemsPerPage)

          commit('SET_PRODUCT_DETAIL_PAGINATION', buildPagination(
            totalItems,
            page,
            tableItemsPerPage,
            hasNextPage,
            isLastPage,
            apiItemsPerPage
          ))

          resolve(data)
        })
        .catch((error) => reject(error))
    })
  },
  [POST_PRODUCT_DETAIL]({ dispatch, getters, commit }: any, productDetailData?: ProductDetail) {
    const productDetail = productDetailData || getters['getProductDetail']
    const apiPayload = prepareProductDetailForPost(productDetail) // Use the utility function
    
    return new Promise((resolve, reject) => {
      ApiService.post('product_details', apiPayload)
        .then(({ data }) => {
          commit(SET_FLASH_MESSAGE_SUCCESS, `Le détail produit "${productDetail.libelle}" a bien été créé.`)
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
  [EDIT_PRODUCT_DETAIL]({ commit }: any, payload: any) {
    return new Promise((resolve, reject) => {
      const hasEnvelope = payload && typeof payload === 'object' && 'data' in payload
      const productDetail: Partial<ProductDetail> = hasEnvelope ? payload.data : payload
      const reloadPage: boolean = hasEnvelope ? (payload.reloadPage ?? true) : true

      if (productDetail.id === undefined || productDetail.id === null) {
        commit(SET_FLASH_MESSAGE_ERROR, `Impossible de modifier le détail produit: ID manquant.`)
        return reject(new Error('Product detail ID is missing for update operation.'))
      }
      
      const apiPayload = prepareProductDetailForPost(productDetail as ProductDetail) // Use the utility function
      
      ApiService.update('product_details', (productDetail.id as number).toString(), apiPayload)
        .then(({ data }) => {
          commit(UPDATE_PRODUCT_DETAIL, data)
          commit(SET_FLASH_MESSAGE_SUCCESS, `Le détail produit "${(productDetail as any).libelle ?? 'sans nom'}" a bien été modifié.`)
          // Respect reloadPage flag (no reload for checkbox toggles)
          reloadPage && window.location.reload()
          resolve(data)
        })
        .catch((error) => {
          commit(SET_FLASH_MESSAGE_ERROR, `Une erreur est survenue.`)
          reject(error)
        })
    })
  },
  [DELETE_PRODUCT_DETAIL]({ commit }: any, productDetailId: number) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`product_details/${productDetailId}`)
        .then(() => {
          commit(SET_FLASH_MESSAGE_SUCCESS, `Le détail produit a bien été supprimé.`)
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
  [SET_PRODUCT_DETAILS](state: any, productDetails: ProductDetail[]) {
    state.productDetails = productDetails
  },
  [UPDATE_PRODUCT_DETAIL](state: any, productDetail: ProductDetail) {
    const index = state.productDetails.findIndex((pd: ProductDetail) => pd.id === productDetail.id)
    if (index !== -1) {
      state.productDetails.splice(index, 1, productDetail)
    }
  },
  [REMOVE_PRODUCT_DETAIL](state: any, productDetailId: number) {
    const index = state.productDetails.findIndex((pd: ProductDetail) => pd.id === productDetailId)
    if (index !== -1) {
      state.productDetails.splice(index, 1)
    }
  },
  [RESET_PRODUCT_DETAIL](state: any) {
    state.productDetail = {
      libelle: '',
      gts_libelle: '',
      gts_code: '',
      gts_id: '',
      type: '',
      product: '',
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
  SET_PRODUCT_DETAIL_PAGINATION(state: any, pagination: any) {
    state.pagination = pagination
  },
  // NEW: Update cached data for intelligent pagination
  UPDATE_PRODUCT_DETAIL_CACHE(state: any, cache: any) {
    state.dataCache = cache
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
