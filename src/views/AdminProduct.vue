<template>
  <div class="min-h-screen bg-background dark:bg-background text-foreground min-w-full overflow-x-hidden">
    <div class="w-full overflow-x-hidden bg-card text-card-foreground rounded-lg shadow-sm mx-2 p-3">
      <div class="w-full overflow-x-hidden">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-foreground dark:text-foreground">Gestion des Produits</h1>
            <p class="text-gray-600 mt-1">Gérer les produits parents et leurs configurations</p>
          </div>
          <Button @click="openCreateModal">
            <font-awesome-icon :icon="['fas', 'plus-circle']" size="lg" class="mr-2" />
            Nouveau Produit Parent
          </Button>
        </div>

        <!-- Data Table -->
        <BasicDataTable
          :data="products"
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
          <template #cell-libelle="{ row }">
            {{ row.libelle }}
          </template>
          <template #cell-gts_libelle="{ row }">
            {{ row.gts_libelle }}
          </template>
          <template #cell-gts_code="{ row }">
            {{ row.gts_code }}
          </template>
          <!-- NEW text fields -->
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
            <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              {{ row.type }}
            </span>
          </template>
          <template #cell-productDetails="{ row }">
            <span class="text-sm text-gray-600">
              {{ row.productDetails?.length || 0 }} Enfant(s)
            </span>
          </template>
          <!-- existing booleans -->
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
          <!-- NEW boolean fields -->
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
                @click="deleteProduct(row)"
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
    
    <AdminProductModal
      :show="modalShow"
      :product="currentProduct"
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
import AdminProductModal from '@/components/AdminProductModal.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FETCH_PRODUCTS, EDIT_PRODUCT, POST_PRODUCT, DELETE_PRODUCT } from '@/store/action.type'
import { RESET_PRODUCT } from '@/store/mutations.type'
import type { Product } from '@/models/Product'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusCircle)

export default defineComponent({
  name: 'AdminProduct',
  components: {
    BasicDataTable,
    AdminProductModal,
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
    const currentProduct = ref<Partial<Product>>({})
    const itemsPerPage = ref(15)

    const columns: DataTableColumn[] = [
      { key: 'libelle', header: 'Libellé', sortable: true, filterable: true },
      { key: 'gts_libelle', header: 'GTS Libellé', sortable: true, filterable: true },
      { key: 'gts_code', header: 'Code GTS', sortable: true, filterable: true },
      { key: 'gts_id', header: 'GTS ID', sortable: true, filterable: true },
      { key: 'libelleShorted', header: 'Libellé court', sortable: true, filterable: true },
      { key: 'destination', header: 'Destination', sortable: true, filterable: true },
      { key: 'ascentWay', header: 'Moyen de descente', sortable: true, filterable: true },
      { key: 'type', header: 'Type', sortable: true, filterable: true },
      { key: 'productDetails', header: 'Enfants', sortable: false },
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
        await store.dispatch(FETCH_PRODUCTS, { page, itemsPerPage: itemsPerPage.value })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchData(1)
    })

    const products = computed(() => {
      const allProducts = store.getters.products
       console.log('🐛 Products data:', allProducts)
  console.log('🐛 First product boolean values:', allProducts[0] ? {
    IsSession: allProducts[0].IsSession,
    IsBookable: allProducts[0].IsBookable,
    IsFree: allProducts[0].IsFree,
    IsContigent: allProducts[0].IsContigent,
    IsInvite: allProducts[0].IsInvite,
    IsBundle: allProducts[0].IsBundle,
    IsUpsell: allProducts[0].IsUpsell,
    IsPrimeYield: allProducts[0].IsPrimeYield,
    IsFrequented: allProducts[0].IsFrequented
  } : 'No products')
      return Array.isArray(allProducts) ? allProducts : []
    })

    const pagination = computed(() => store.getters.productPagination)

    const handlePageChange = (page: number) => {
      fetchData(page)
    }


    const openCreateModal = () => {
      store.commit(RESET_PRODUCT)
      currentProduct.value = store.getters.getProduct
      isEditMode.value = false
      modalShow.value = true
    }

    const openEditModal = (product: Product) => {
      currentProduct.value = { ...product }
      isEditMode.value = true
      modalShow.value = true
    }

    const submit = async (productToSubmit: Product) => {
      if (isEditMode.value) {
        await store.dispatch(EDIT_PRODUCT, { data: productToSubmit, reloadPage: true })
      } else {
        await store.dispatch(POST_PRODUCT, productToSubmit)
      }
      modalShow.value = false
      // Refresh current page after submit
      fetchData(pagination.value.currentPage)
    }

    const deleteProduct = async (product: Product) => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.libelle}" ?`)) {
        await store.dispatch(DELETE_PRODUCT, product.id)
        // Refresh current page after delete
        fetchData(pagination.value.currentPage)
      }
    }

    const updateField = async (id: number, field: keyof Product, value: any) => {
      try {
        await store.dispatch(EDIT_PRODUCT, { data: { id, [field]: value }, reloadPage: false })
        // No need to refresh for field updates, they update in place
      } catch (error) {
        console.error('Error updating product field:', error)
        // Optionally show user feedback for error
      }
    }

    const handleSortChange = (sortConfig: { key: string; direction: 'asc' | 'desc' }) => {
      // For server-side sorting, we would implement this in the store action
      process.env.NODE_ENV === 'development' && console.log('Sort change:', sortConfig)
      // TODO: Implement server-side sorting in product.module.ts
    }

    const handleFilterChange = (filters: Record<string, string>) => {
      // For server-side filtering, we would implement this in the store action
      process.env.NODE_ENV === 'development' && console.log('Filter change:', filters)
      // TODO: Implement server-side filtering in product.module.ts
    }

    const handleBooleanFilterChange = (key: string, value: boolean | null) => {
      // For server-side boolean filtering, we would implement this in the store action
      process.env.NODE_ENV === 'development' && console.log('Boolean filter change:', key, value)
      // TODO: Implement server-side boolean filtering in product.module.ts
    }

    return {
      modalShow,
      loading,
      columns,
      products,
      currentProduct,
      isEditMode,
      itemsPerPage,
      pagination,
      openCreateModal,
      openEditModal,
      submit,
      deleteProduct,
      updateField,
      handlePageChange,
      handleSortChange,
      handleFilterChange,
      handleBooleanFilterChange
    }
  }
})
</script>