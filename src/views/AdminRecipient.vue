<template>
  <div class="w-full min-h-full bg-background dark:bg-background-header text-foreground">
    <div class="w-full p-6">
      <div class="bg-card w-full text-card-foreground rounded-lg  shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Gestion des Destinataires</h1>
            <p class="text-gray-600 mt-1">Gérer les adresses email de destination</p>
          </div>
          <Button @click="openCreateModal">
            <font-awesome-icon :icon="['fas', 'plus-circle']" size="lg" class="mr-2" />
            Nouveau destinataire
          </Button>
        </div>
        <div class="w-full overflow-hidden">
          <BasicDataTable
            :data="recipients"
            :columns="columns"
            :loading="loading"
            :server-side="true"
            :total-items="pagination.totalItems"
            :current-page="pagination.currentPage"
            :items-per-page="15"
            show-pagination
            hoverable
            @page-change="handlePageChange"
            @boolean-filter-change="handleBooleanFilterChange"
            class="shadow-sm"
          >
            <template #cell-email="{ row }">
              <Input 
                class="w-full p-2 font-medium text-foreground" 
                :modelValue="row.email" 
                @update:modelValue="(value: string) => updateField(row.id, 'email', value, true)"
                type="email"
              />
            </template>
            <template #cell-familyName="{ row }">
              <Input 
                class="w-full p-2 font-medium text-foreground" 
                :modelValue="row.familyName" 
                @update:modelValue="(value: string) => updateField(row.id, 'familyName', value, true)"
                type="text"
              />
            </template>
            <template #cell-givenName="{ row }">
              <Input 
                class="w-full p-2 font-medium text-foreground" 
                :modelValue="row.givenName" 
                @update:modelValue="(value: string) => updateField(row.id, 'givenName', value, true)"
                type="text"
              />
            </template>
            <template #cell-type="{ row }">
              <div class="flex items-center justify-center">
                <LiquidRadio
                  :model-value="row.type"
                  :options="[
                    { value: 'to', label: 'Dest.' }, 
                    { value: 'cc', label: 'Copie' }
                  ]"
                  @update:modelValue="(value: string) => updateField(row.id, 'type', value)"
                  :name="`recipient-type-${row.id}`"
                />
              </div>
            </template>
            <template #cell-actions="{ row }">
              <div class="flex items-center justify-center">
                <Button
                  @click="deleteRecipient(row)"
                  variant="ghost"
                  class="p-4 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </template>
          </BasicDataTable>
        </div>
        <div class="mt-6 flex justify-end">
          <Button 
            @click="saveChanges" 
            :disabled="!hasUnsavedChanges" 
            variant="default"
          >
            Sauvegarder les modifications
          </Button>
        </div>
      </div>
    </div>
    
    <AdminRecipientModal
      :show="modalShow"
      :recipient="currentRecipient"
      @close="modalShow = false"
      @submit="submit"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Trash2 } from 'lucide-vue-next'
import { BasicDataTable, type DataTableColumn } from '@/components/ui/data-table'
import AdminRecipientModal from '@/components/AdminRecipientModal.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LiquidRadio } from '@/components/ui/radio-group'
import { FETCH_RECIPIENTS, EDIT_RECIPIENT, POST_RECIPIENT, DELETE_RECIPIENT } from '@/store/action.type'
import { RESET_RECIPIENT } from '@/store/mutations.type'
import type { Recipient } from '@/models/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusCircle)

export default defineComponent({
  name: 'AdminRecipient',
  components: {
    BasicDataTable,
    AdminRecipientModal,
    Trash2,
    Input,
    Button,
    LiquidRadio
  },
  setup() {
    const store = useStore()
    const modalShow = ref(false)
    const loading = ref(false)
    const currentRecipient = ref<Partial<Recipient>>({})
    const changedRecipients = ref<Map<string, { recipient: Recipient, field: keyof Recipient, newValue: any }>>(new Map())
    const itemsPerPage = ref(15)

    const columns: DataTableColumn[] = [
      { key: 'email', header: 'Email', sortable: true, filterable: true },
      { key: 'familyName', header: 'Nom de famille', sortable: true, filterable: true },
      { key: 'givenName', header: 'Prénom', sortable: true, filterable: true },
      { key: 'type', header: 'Type', sortable: true, filterable: false, type: 'boolean' },
      { key: 'actions', header: 'Actions', width: '120px' }
    ]

    const fetchData = async (page = 1) => {
      loading.value = true
      try {
        await store.dispatch(FETCH_RECIPIENTS, { page, itemsPerPage: itemsPerPage.value })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchData(1)
    })

    const recipients = computed(() => store.getters.recipients)
    const pagination = computed(() => store.getters.recipientPagination)

    const hasUnsavedChanges = computed(() => {
      return changedRecipients.value.size > 0
    })

    const handlePageChange = (page: number) => {
      fetchData(page)
    }

    const handleBooleanFilterChange = (key: string, value: boolean | null) => {
      // For type column boolean filtering: 'to' = 0 (false), 'cc' = 1 (true)
      process.env.NODE_ENV === 'development' && console.log('Boolean filter change:', key, value)
      // TODO: Implement filtering logic if needed
    }

    const openCreateModal = () => {
      store.commit(RESET_RECIPIENT)
      currentRecipient.value = store.getters.getRecipient
      modalShow.value = true
    }

    const submit = async (recipientToSubmit: Recipient) => {
      await store.dispatch(POST_RECIPIENT, recipientToSubmit)
      modalShow.value = false
    }

    const deleteRecipient = (recipient: Recipient) => {
      store.dispatch(DELETE_RECIPIENT, recipient.id)
    }

    const updateField = async (id: number, field: keyof Recipient, value: any, delayedSave = false) => {
      // Find recipient by ID
      const recipient = recipients.value.find((r: Recipient) => r.id === id)
      if (!recipient) return

      // Store original value for comparison
      const originalValue = recipient[field]

      // For radio buttons (type field), save immediately like Product checkboxes
      if (field === 'type' && !delayedSave) {
        try {
          await store.dispatch(EDIT_RECIPIENT, { data: { id, [field]: value }, reloadPage: false })
          // Update local state immediately
          recipient[field] = value
        } catch (error) {
          console.error('Error updating recipient field:', error)
        }
        return
      }

      // For text inputs, use delayed save logic
      if (originalValue !== value) {
        const changeKey = `${id}-${field}`
        changedRecipients.value.set(changeKey, { 
          recipient, 
          field, 
          newValue: value
        })
        // Update the local reactive data immediately for display
        recipient[field] = value
      } else {
        // If value is reverted to original, remove from changed list
        const changeKey = `${id}-${field}`
        changedRecipients.value.delete(changeKey)
      }
    }

    const saveChanges = async () => {
      const changeEntries = Array.from(changedRecipients.value.entries())
      
      for (const [changeKey, changeData] of changeEntries) {
        try {
          const { recipient, field, newValue } = changeData
          await store.dispatch(EDIT_RECIPIENT, { 
            data: { id: recipient.id, [field]: newValue }, 
            reloadPage: false 
          })
          // Remove from changed list after successful save
          changedRecipients.value.delete(changeKey)
        } catch (error) {
          console.error(`Failed to save recipient change for ${changeData.field}:`, error)
          // Don't clear the change if it failed to save
        }
      }
      
      // Show success message if all changes were saved
      if (changedRecipients.value.size === 0) {
        // Could add a success toast here
        console.log('All changes saved successfully')
      }
    }

    return {
      modalShow,
      loading,
      columns,
      recipients,
      pagination,
      currentRecipient,
      hasUnsavedChanges,
      handlePageChange,
      handleBooleanFilterChange,
      openCreateModal,
      submit,
      deleteRecipient,
      updateField,
      saveChanges,
    }
  }
})
</script>

