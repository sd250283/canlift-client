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
            {{ isEditMode ? 'Modifier le détail produit' : 'Créer un détail produit' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Product Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Produit Parent</label>
            <Select v-model="editableProductDetail.product">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="product in products" :key="product.id" :value="product['@id'] || `/api/products/${product.id}`">
                  {{ product.libelle }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Libellé</label>
              <Input
                v-model="editableProductDetail.libelle"
                type="text"
                placeholder="Nom du produit"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GTS Libellé</label>
              <Input
                v-model="editableProductDetail.gts_libelle"
                type="text"
                placeholder="Libellé GTS"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code GTS</label>
              <Input
                v-model="editableProductDetail.gts_code"
                type="text"
                placeholder="Code GTS"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GTS ID</label>
              <Input
                v-model="editableProductDetail.gts_id"
                type="text"
                placeholder="ID GTS"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <Input
                v-model="editableProductDetail.type"
                type="text"
                placeholder="Type de produit"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Libellé Court</label>
              <Input
                v-model="editableProductDetail.libelleShorted"
                type="text"
                placeholder="Libellé court"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
              <Input
                v-model="editableProductDetail.destination"
                type="text"
                placeholder="Destination"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Voie d'ascension</label>
            <Input
              v-model="editableProductDetail.ascentWay"
              type="text"
              placeholder="Moyen de descente"
            />
          </div>

          <!-- Boolean Options -->
          <div class="space-y-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Options</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label class="flex items-center">
                <Checkbox
                  :model-value="!!editableProductDetail.IsSession"
                  @update:model-value="(checked: boolean) => { editableProductDetail.IsSession = checked }"
                  class="h-4 w-4"
                />
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Séance</span>
              </label>
              
              <label class="flex items-center">
                <Checkbox
                  :model-value="!!editableProductDetail.IsContigent"
                  @update:model-value="(checked: boolean) => { editableProductDetail.IsContigent = checked }"
                  class="h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Contingent</span>
              </label>
              
              <label class="flex items-center">
                <Checkbox
                  :model-value="!!editableProductDetail.IsBookable"
                  @update:model-value="(checked: boolean) => { editableProductDetail.IsBookable = checked }"
                  class="h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Réservable</span>
              </label>
              
              <label class="flex items-center">
                <Checkbox
                  :model-value="!!editableProductDetail.IsFree"
                  @update:model-value="(checked: boolean) => { editableProductDetail.IsFree = checked }"
                  class="h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Gratuit</span>
              </label>
              
              <label class="flex items-center">
                <Checkbox
                  :model-value="!!editableProductDetail.IsInvite"
                  @update:model-value="(checked: boolean) => { editableProductDetail.IsInvite = checked }"
                  class="h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Invitation</span>
              </label>
              
              <label class="flex items-center">
                <Checkbox
                  :model-value="!!editableProductDetail.IsBundle"
                  @update:model-value="(checked: boolean) => { editableProductDetail.IsBundle = checked }"
                  class="h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Bundle</span>
              </label>
              
              <label class="flex items-center">
                <Checkbox
                  :model-value="!!editableProductDetail.IsUpsell"
                  @update:model-value="(checked: boolean) => { editableProductDetail.IsUpsell = checked }"
                  class="h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Upsell</span>
              </label>
              
              <label class="flex items-center">
                <Checkbox
                  :model-value="!!editableProductDetail.IsPrimeYield"
                  @update:model-value="(checked: boolean) => { editableProductDetail.IsPrimeYield = checked }"
                  class="h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Prime de rendement</span>
              </label>
              
              <label class="flex items-center">
                <Checkbox
                  :model-value="!!editableProductDetail.IsFrequented"
                  @update:model-value="(checked: boolean) => { editableProductDetail.IsFrequented = checked }"
                  class="h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Fréquenté</span>
              </label>
            </div>
          </div>
          
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
              {{ isEditMode ? 'Modifier' : 'Créer' }}
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ProductDetail, Product } from '@/models/Product'
import { createProductDetail } from '@/models/Product'

export default defineComponent({
  name: 'AdminProductDetailModal',
  components: { 
    X, 
    Checkbox, 
    Input, 
    Button, 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    productDetail: {
      type: Object as PropType<Partial<ProductDetail>>,
      required: true,
    },
    products: {
      type: Array as PropType<Product[]>,
      default: () => []
    },
    isEditMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const editableProductDetail = ref<ProductDetail>(createProductDetail())

    watch(() => props.productDetail, (newProductDetail) => {
      if (newProductDetail) {
        editableProductDetail.value = createProductDetail(newProductDetail)
      }
    }, { immediate: true, deep: true })

    const closeModal = () => {
      emit('close')
    }

    const submitForm = () => {
        console.log('🐛 Données avant envoi:', editableProductDetail.value)
        console.log('🐛 Boolean values:', {
            IsSession: editableProductDetail.value.IsSession,
            IsContigent: editableProductDetail.value.IsContigent,
            IsBookable: editableProductDetail.value.IsBookable,
            IsFree: editableProductDetail.value.IsFree,
            IsInvite: editableProductDetail.value.IsInvite,
            IsBundle: editableProductDetail.value.IsBundle,
            IsUpsell: editableProductDetail.value.IsUpsell,
            IsPrimeYield: editableProductDetail.value.IsPrimeYield,
            IsFrequented: editableProductDetail.value.IsFrequented
        })
      emit('submit', editableProductDetail.value)
    }

    return {
      editableProductDetail,
      closeModal,
      submitForm,
    }
  },
})
</script>