<template>
  <div class="min-h-screen bg-background dark:bg-background text-foreground min-w-full overflow-x-hidden">
    <div class="w-full overflow-x-hidden bg-card text-card-foreground rounded-lg shadow-sm mx-2 p-3">
      <div class="w-full overflow-x-hidden">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-foreground dark:text-foreground">Gestion des Détails Produits</h1>
            <p class="text-gray-600 mt-1">Gérer les détails et variations des produits</p>
          </div>
          <Button @click="openCreateModal">
            <font-awesome-icon :icon="['fas', 'plus-circle']" size="lg" class="mr-2" />
            Nouveau Produit enfant
          </Button>
        </div>

        <!-- Data Table -->
        <BasicDataTable
          :data="productDetails"
          :columns="columns"
          :loading="loading"
          :items-per-page="itemsPerPage"
          :server-side="true"
          :total-items="pagination.totalItems"
          :current-page="pagination.currentPage"
          show-pagination
          hoverable
          class="shadow-sm"
          @page-change="handlePageChange"
          @sort-change="handleSortChange"
          @filter-change="handleFilterChange"
          @boolean-filter-change="handleBooleanFilterChange"
        >
          <template #cell-product="{ row }">
            <span class="text-sm font-medium">
              {{ getProductName(row.product) }}
            </span>
          </template>
          <template #cell-libelle="{ row }">
            {{ row.libelle }}
          </template>
          <template #cell-gts_libelle="{ row }">
            {{ row.gts_libelle }}
          </template>
          <template #cell-gts_code="{ row }">
            {{ row.gts_code }}
          </template>
          <template #cell-gts_id="{ row }">
            {{ row.gts_id || '—' }}
          </template>
          <template #cell-libelleShorted="{ row }">
            {{ row.libelleShorted || '—' }}
          </template>
          <template #cell-destination="{ row }">
            {{ row.destination || '—' }}
          </template>
          <template #cell-ascentWay="{ row }">
            {{ row.ascentWay || '—' }}
          </template>

          <template #cell-type="{ row }">
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {{ row.type }}
            </span>
          </template>
          <template #cell-IsSession="{ row }">
            <div class="flex items-center justify-center">
              <Checkbox
                :model-value="row.IsSession"
                @update:model-value="(checked: boolean) => updateField(row.id, 'IsSession', checked)"
                class="size-5"
              />
            </div>
          </template>
          <template #cell-IsBookable="{ row }">
            <div class="flex items-center justify-center">
              <Checkbox
                :model-value="row.IsBookable"
                @update:model-value="(checked: boolean) => updateField(row.id, 'IsBookable', checked)"
                class="size-5"
              />
            </div>
          </template>
          <template #cell-IsFree="{ row }">
            <div class="flex items-center justify-center">
              <Checkbox
                :model-value="row.IsFree"
                @update:model-value="(checked: boolean) => updateField(row.id, 'IsFree', checked)"
                class="size-5"
              />
            </div>
          </template>
          <template #cell-IsContigent="{ row }">
            <div class="flex items-center justify-center">
              <Checkbox
                :model-value="row.IsContigent"
                @update:model-value="(checked: boolean) => updateField(row.id, 'IsContigent', checked)"
                class="size-5"
              />
            </div>
          </template>
          <template #cell-IsInvite="{ row }">
            <div class="flex items-center justify-center">
              <Checkbox
                :model-value="row.IsInvite"
                @update:model-value="(checked: boolean) => updateField(row.id, 'IsInvite', checked)"
                class="size-5"
              />
            </div>
          </template>
          <template #cell-IsBundle="{ row }">
            <div class="flex items-center justify-center">
              <Checkbox
                :model-value="row.IsBundle"
                @update:model-value="(checked: boolean) => updateField(row.id, 'IsBundle', checked)"
                class="size-5"
              />
            </div>
          </template>
          <template #cell-IsUpsell="{ row }">
            <div class="flex items-center justify-center">
              <Checkbox
                :model-value="row.IsUpsell"
                @update:model-value="(checked: boolean) => updateField(row.id, 'IsUpsell', checked)"
                class="size-5"
              />
            </div>
          </template>
          <template #cell-IsPrimeYield="{ row }">
            <div class="flex items-center justify-center">
              <Checkbox
                :model-value="row.IsPrimeYield"
                @update:model-value="(checked: boolean) => updateField(row.id, 'IsPrimeYield', checked)"
                class="size-5"
              />
            </div>
          </template>
          <template #cell-IsFrequented="{ row }">
            <div class="flex items-center justify-center">
              <Checkbox
                :model-value="row.IsFrequented"
                @update:model-value="(checked: boolean) => updateField(row.id, 'IsFrequented', checked)"
                class="size-5"
              />
            </div>
          </template>

          <template #cell-actions="{ row }">
            <div class="flex items-center justify-center">
              <Button
                @click="openEditModal(row)"
                variant="ghost"
                class="p-4 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors"
                title="Modifier"
              >
                <Pencil class="h-12 w-12" />
              </Button>
              <Button
                @click="deleteProductDetail(row)"
                variant="ghost"
                class="p-4 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="Supprimer"
              >
                <Trash2 class="h-12 w-12" />
              </Button>
            </div>
          </template>
        </BasicDataTable>
      </div>
    </div>
    
    <AdminProductDetailModal
      :show="modalShow"
      :product-detail="currentProductDetail"
      :products="products"
      :is-edit-mode="isEditMode"
      @close="modalShow = false"
      @submit="submit"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Trash2, Pencil } from 'lucide-vue-next'
import { BasicDataTable, type DataTableColumn } from '@/components/ui/data-table'
import AdminProductDetailModal from '@/components/AdminProductDetailModal.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FETCH_PRODUCT_DETAILS, FETCH_ALL_PRODUCTS, EDIT_PRODUCT_DETAIL, POST_PRODUCT_DETAIL, DELETE_PRODUCT_DETAIL } from '@/store/action.type'
import { RESET_PRODUCT_DETAIL } from '@/store/mutations.type'
import type { ProductDetail, Product } from '@/models/Product'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusCircle)

export default defineComponent({
  name: 'AdminProductDetail',
  components: {
    BasicDataTable,
    AdminProductDetailModal,
    Trash2,
    Pencil,
    Button,
    Checkbox
  },
  setup() {
    const store = useStore()
    const modalShow = ref(false)
    const loading = ref(false)
    const isEditMode = ref(false)
    const currentProductDetail = ref<Partial<ProductDetail>>({})
    const itemsPerPage = ref(15)

    const columns: DataTableColumn[] = [
      { key: 'product', header: 'Produit Parent', sortable: true, filterable: true },
      { key: 'libelle', header: 'Libellé', sortable: true, filterable: true },
      { key: 'gts_libelle', header: 'GTS Libellé', sortable: true, filterable: true },
      { key: 'gts_code', header: 'Code GTS', sortable: true, filterable: true },
      { key: 'gts_id', header: 'GTS ID', sortable: true, filterable: true },
      { key: 'libelleShorted', header: 'Libellé court', sortable: true, filterable: true },
      { key: 'destination', header: 'Destination', sortable: true, filterable: true },
      { key: 'ascentWay', header: 'Moyen de descente', sortable: true, filterable: true },
      { key: 'type', header: 'Type', sortable: true, filterable: true },
      { key: 'IsSession', header: 'Séance', sortable: true, filterable: true, type: 'boolean' },
      { key: 'IsBookable', header: 'Réservable', sortable: true, filterable: true, type: 'boolean' },
      { key: 'IsFree', header: 'Gratuit', sortable: true, filterable: true, type: 'boolean' },
      { key: 'IsContigent', header: 'Contingent', sortable: true, filterable: true, type: 'boolean' },
      { key: 'IsInvite', header: 'Invitation', sortable: true, filterable: true, type: 'boolean' },
      { key: 'IsBundle', header: 'Bundle', sortable: true, filterable: true, type: 'boolean' },
      { key: 'IsUpsell', header: 'Upsell', sortable: true, filterable: true, type: 'boolean' },
      { key: 'IsPrimeYield', header: 'Prime de rendement', sortable: true, filterable: true, type: 'boolean' },
      { key: 'IsFrequented', header: 'Fréquenté', sortable: true, filterable: true, type: 'boolean' },
      { key: 'actions', header: 'Actions', width: '120px' }
    ]

    const fetchData = async (page = 1) => {
      loading.value = true
      try {
        await Promise.all([
          store.dispatch(FETCH_PRODUCT_DETAILS, { page, itemsPerPage: itemsPerPage.value }),
          store.dispatch(FETCH_ALL_PRODUCTS)
        ])
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchData(1)
    })

    const productDetails = computed(() => {
      const allProductDetails = store.getters.productDetails
      return Array.isArray(allProductDetails) ? allProductDetails : []
    })

    const products = computed(() => {
      const allProducts = store.getters.products
      return Array.isArray(allProducts) ? allProducts : []
    })

    const pagination = computed(() => store.getters.productDetailPagination)

    const handlePageChange = (page: number) => {
      fetchData(page)
    }

    const getProductName = (productIri: string) => {
      if (!productIri) return 'Aucun produit'
      
      const productIdMatch = productIri.match(/\/products\/(\d+)$/)
      if (!productIdMatch) {
        console.warn('Could not extract product ID from IRI:', productIri)
        return 'Produit non trouvé'
      }
      const productId = parseInt(productIdMatch[1])
      
      const product = products.value.find((p: Product) => p.id === productId)
      return product ? product.libelle : 'Produit non trouvé'
    }

    const openCreateModal = () => {
      store.commit(RESET_PRODUCT_DETAIL)
      currentProductDetail.value = store.getters.getProductDetail
      isEditMode.value = false
      modalShow.value = true
    }

    const openEditModal = (productDetail: ProductDetail) => {
      currentProductDetail.value = { ...productDetail }
      isEditMode.value = true
      modalShow.value = true
    }

    const submit = async (productDetailToSubmit: ProductDetail) => {
      if (isEditMode.value) {
        await store.dispatch(EDIT_PRODUCT_DETAIL, { data: productDetailToSubmit, reloadPage: true })
      } else {
        await store.dispatch(POST_PRODUCT_DETAIL, productDetailToSubmit)
      }
      modalShow.value = false
      // Refresh current page after submit
      fetchData(pagination.value.currentPage)
    }

    const deleteProductDetail = async (productDetail: ProductDetail) => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le détail "${productDetail.libelle}" ?`)) {
        await store.dispatch(DELETE_PRODUCT_DETAIL, productDetail.id)
        // Refresh current page after delete
        fetchData(pagination.value.currentPage)
      }
    }

    const updateField = async (id: number, field: keyof ProductDetail, value: any) => {
      try {
        await store.dispatch(EDIT_PRODUCT_DETAIL, { data: { id, [field]: value }, reloadPage: false })
        // No need to refresh for field updates, they update in place
      } catch (error) {
        console.error('Error updating product detail field:', error)
        // Optionally show user feedback for error
      }
    }

    const handleSortChange = (sortConfig: { key: string; direction: 'asc' | 'desc' }) => {
      // For server-side sorting, we would implement this in the store action
      process.env.NODE_ENV === 'development' && console.log('Sort change:', sortConfig)
      // TODO: Implement server-side sorting in productDetail.module.ts
    }

    const handleFilterChange = (filters: Record<string, string>) => {
      // For server-side filtering, we would implement this in the store action
      process.env.NODE_ENV === 'development' && console.log('Filter change:', filters)
      // TODO: Implement server-side filtering in productDetail.module.ts
    }

    const handleBooleanFilterChange = (key: string, value: boolean | null) => {
      // For server-side boolean filtering, we would implement this in the store action
      process.env.NODE_ENV === 'development' && console.log('Boolean filter change:', key, value)
      // TODO: Implement server-side boolean filtering in productDetail.module.ts
    }

    return {
      modalShow,
      loading,
      columns,
      productDetails,
      products,
      currentProductDetail,
      isEditMode,
      pagination,
      itemsPerPage,
      getProductName,
      openCreateModal,
      openEditModal,
      submit,
      deleteProductDetail,
      updateField,
      handlePageChange,
      handleSortChange,
      handleFilterChange,
      handleBooleanFilterChange
    }
  }
})
</script>
