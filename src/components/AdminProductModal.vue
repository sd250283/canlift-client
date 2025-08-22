<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="closeModal"
  >
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"></div>
      <div class="relative bg-white dark:bg-card rounded-2xl shadow-xl max-w-2xl w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-foreground">
            {{ isEditMode ? 'Modifier le produit' : 'Création d\'un produit' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Libellé Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Libellé</label>
              <Input
                v-model="editableProduct.libelle"
                type="text"
                placeholder="Nom du produit"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <Input
                v-model="editableProduct.type"
                type="text"
                placeholder="Type de produit"
              />
            </div>
          </div>

          <!-- GTS Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GTS Libellé</label>
              <Input
                v-model="editableProduct.gts_libelle"
                type="text"
                placeholder="Libellé GTS"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code GTS</label>
              <Input
                v-model="editableProduct.gts_code"
                type="text"
                placeholder="Code GTS"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GTS ID</label>
            <Input
              v-model="editableProduct.gts_id"
              type="text"
              placeholder="ID GTS"
            />
          </div>

          <!-- Additional Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Libellé Court</label>
              <Input
                v-model="editableProduct.libelleShorted"
                type="text"
                placeholder="Libellé court"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
              <Input
                v-model="editableProduct.destination"
                type="text"
                placeholder="Destination"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Moyen de descente</label>
            <Input
              v-model="editableProduct.ascentWay"
              type="text"
              placeholder="Moyen de descente"
            />
          </div>

          <!-- Boolean Options -->
          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Options</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="IsSession"
                  v-model="editableProduct.IsSession"
                />
                                <label for="IsSession" class="text-sm text-gray-700 dark:text-gray-300">Séance</label>
              </div>
              
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="IsContigent"
                  v-model="editableProduct.IsContigent"
                />
                <label for="IsContigent" class="text-sm text-gray-700 dark:text-gray-300">Contingent</label>
              </div>
              
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="IsBookable"
                  v-model="editableProduct.IsBookable"
                />
                <label for="IsBookable" class="text-sm text-gray-700 dark:text-gray-300">Réservable</label>
              </div>
              
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="IsFree"
                  v-model="editableProduct.IsFree"
                />
                <label for="IsFree" class="text-sm text-gray-700 dark:text-gray-300">Gratuit</label>
              </div>
              
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="IsInvite"
                  v-model="editableProduct.IsInvite"
                />
                <label for="IsInvite" class="text-sm text-gray-700 dark:text-gray-300">Invitation</label>
              </div>
              
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="IsBundle"
                  v-model="editableProduct.IsBundle"
                />
                <label for="IsBundle" class="text-sm text-gray-700 dark:text-gray-300">Bundle</label>
              </div>
              
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="IsUpsell"
                  v-model="editableProduct.IsUpsell"
                />
                <label for="IsUpsell" class="text-sm text-gray-700 dark:text-gray-300">Upsell</label>
              </div>
              
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="IsPrimeYield"
                  v-model="editableProduct.IsPrimeYield"
                />
                <label for="IsPrimeYield" class="text-sm text-gray-700 dark:text-gray-300">Prime de rendement</label>
              </div>
              
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="IsFrequented"
                  v-model="editableProduct.IsFrequented"
                />
                <label for="IsFrequented" class="text-sm text-gray-700 dark:text-gray-300">Fréquenté</label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <Button
              type="button"
              @click="closeModal"
              variant="outline"
              class="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              class="flex-1"
            >
              Valider
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType } from 'vue'
import { X } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Product } from '@/models/Product'
import { createProduct } from '@/models/Product'

export default defineComponent({
  name: 'AdminProductModal',
  components: { 
    X, 
    Checkbox,
    Button,
    Input
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    product: {
      type: Object as PropType<Partial<Product>>,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const editableProduct = ref<Product>(createProduct())

    watch(() => props.product, (newProduct) => {
      if (newProduct) {
        editableProduct.value = createProduct(newProduct)
      }
    }, { immediate: true, deep: true })

    const closeModal = () => {
      emit('close')
    }

    const submitForm = () => {
      emit('submit', editableProduct.value)
    }

    return {
      editableProduct,
      closeModal,
      submitForm,
    }
  },
})
</script>
