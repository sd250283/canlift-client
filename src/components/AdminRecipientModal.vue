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
          <h3 class="text-lg font-semibold text-gray-900 dark:text-foreground">Création d'un destinataire</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <Input
              v-model="editableRecipient.email"
              type="email"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de famille</label>
            <Input
              v-model="editableRecipient.familyName"
              type="text"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
            <Input
              v-model="editableRecipient.givenName"
              type="text"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <LiquidRadio
              v-model="editableRecipient.type"
              :options="[
                { value: 'to', label: 'Destinataire' },
                { value: 'cc', label: 'Copie' }
              ]"
              name="modal-recipient-type"
            />
          </div>
          
          <div class="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              class="flex-1"
              @click="closeModal"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="default"
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
import type { Recipient } from '@/models/index'
import { LiquidRadio } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-vue-next'

export default defineComponent({
  name: 'AdminRecipientModal',
  components: { X, LiquidRadio, Input, Button },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    recipient: {
      type: Object as PropType<Partial<Recipient>>,
      required: true,
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const editableRecipient = ref<Partial<Recipient>>({})

    watch(() => props.recipient, (newRecipient) => {
      editableRecipient.value = { ...newRecipient }
    }, { immediate: true, deep: true })

    const closeModal = () => {
      emit('close')
    }

    const submitForm = () => {
      emit('submit', editableRecipient.value)
    }

    return {
      editableRecipient,
      closeModal,
      submitForm,
    }
  },
})
</script>
