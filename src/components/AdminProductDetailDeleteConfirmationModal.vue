<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="closeModal"
  >
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"></div>
      <div class="relative bg-white dark:bg-card rounded-2xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">
            Supprimer le détail produit
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <div class="mb-6">
          <p class="text-gray-700 dark:text-gray-300 mb-2">
            Êtes-vous sûr de vouloir supprimer ce détail produit ?
          </p>
          <div v-if="productDetail" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p class="font-medium text-gray-900 dark:text-gray-100">
              Quantité: {{ productDetail.quantity }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Prix unitaire: {{ productDetail.unitPrice ? `${productDetail.unitPrice.toFixed(2)} €` : '-' }}
            </p>
            <p v-if="productDetail.product" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Produit: {{ productDetail.product.name }}
            </p>
          </div>
          <p class="text-red-600 dark:text-red-400 text-sm mt-3">
            Cette action est irréversible.
          </p>
        </div>
        
        <div class="flex gap-3">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { X } from 'lucide-vue-next'
import type { ProductDetail } from '@/models/index'

export default defineComponent({
  name: 'AdminProductDetailDeleteConfirmationModal',
  components: { X },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    productDetail: {
      type: Object as PropType<ProductDetail | null>,
      default: null,
    },
  },
  emits: ['close', 'confirm'],
  setup(_, { emit }) {
    const closeModal = () => {
      emit('close')
    }

    const confirmDelete = () => {
      emit('confirm')
    }

    return {
      closeModal,
      confirmDelete,
    }
  },
})
</script>
