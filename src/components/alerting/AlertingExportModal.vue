<template>
  <Sheet :open="showModal" @update:open="closeModal">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Exporter les données d'alerte</SheetTitle>
        <SheetDescription>
          Choisissez le format d'export pour les données d'alerte sélectionnées.
        </SheetDescription>
      </SheetHeader>
      
      <div class="space-y-6 mt-6">
        <div>
          <Label class="text-sm font-medium mb-3 block">Format d'export</Label>
          <RadioGroup v-model="selectedFormat" class="space-y-3">
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label for="csv" class="text-sm font-normal cursor-pointer">
                CSV (Comma Separated Values)
              </Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="excel" id="excel" />
              <Label for="excel" class="text-sm font-normal cursor-pointer">
                Excel (.xlsx)
              </Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label for="email" class="text-sm font-normal cursor-pointer">
                Envoyer par email
              </Label>
            </div>
          </RadioGroup>
        </div>

        <!-- Email options (shown when email is selected) -->
        <div v-if="selectedFormat === 'email'" class="space-y-4">
          <div>
            <Label for="email-address" class="text-sm font-medium">Adresse email</Label>
            <Input
              id="email-address"
              v-model="emailAddress"
              type="email"
              placeholder="destinataire@example.com"
              class="mt-1"
            />
          </div>
          <div>
            <Label for="email-subject" class="text-sm font-medium">Sujet</Label>
            <Input
              id="email-subject"
              v-model="emailSubject"
              placeholder="Données d'alerte - Can'Lift"
              class="mt-1"
            />
          </div>
        </div>

        <!-- Export Options -->
        <div class="space-y-3">
          <Label class="text-sm font-medium">Options d'export</Label>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <Checkbox id="include-filters" v-model="exportOptions.includeFilters" />
              <Label for="include-filters" class="text-sm">Inclure les filtres appliqués</Label>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox id="include-summary" v-model="exportOptions.includeSummary" />
              <Label for="include-summary" class="text-sm">Inclure le résumé statistique</Label>
            </div>
          </div>
        </div>
      </div>

      <SheetFooter class="mt-6">
        <Button variant="outline" @click="closeModal">
          Annuler
        </Button>
        <Button @click="exportData" :disabled="!canExport || isExporting">
          <Download class="mr-2 h-4 w-4" v-if="!isExporting" />
          <span v-if="isExporting" class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
            Export en cours...
          </span>
          <span v-else>
            {{ getExportButtonText() }}
          </span>
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { Download } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox' // Import Checkbox
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { EXPORT_ALERTING_DATA } from '@/store/action.type'

const store = useStore()

const showModal = computed(() => store.getters.showExportModal || false)
const selectedFormat = ref<'csv' | 'excel' | 'email'>('csv')
const isExporting = ref(false)

// Email options
const emailAddress = ref('')
const emailSubject = ref('Données d\'alerte Can\'Lift')

// Export options
const exportOptions = ref({
  includeFilters: true,
  includeSummary: true
})

const canExport = computed(() => {
  if (selectedFormat.value === 'email') {
    return emailAddress.value.includes('@') && emailAddress.value.trim().length > 0 && emailSubject.value.trim().length > 0
  }
  return true
})

const closeModal = () => {
  store.commit('SET_EXPORT_MODAL_VISIBILITY', false)
  // Reset form
  selectedFormat.value = 'csv'
  emailAddress.value = ''
  emailSubject.value = 'Données d\'alerte Can\'Lift'
  exportOptions.value = {
    includeFilters: true,
    includeSummary: true
  }
}

const getExportButtonText = () => {
  switch (selectedFormat.value) {
    case 'csv':
      return 'Télécharger CSV'
    case 'excel':
      return 'Télécharger Excel'
    case 'email':
      return 'Envoyer par email'
    default:
      return 'Exporter'
  }
}

const exportData = async () => {
  if (!canExport.value) return
  
  isExporting.value = true
  try {
    const payload = {
      format: selectedFormat.value,
      data: store.getters.getAlertingSlots, // Assuming this is the data to export
      options: exportOptions.value,
      ...(selectedFormat.value === 'email' && {
        email: emailAddress.value,
        subject: emailSubject.value
      })
    }
    await store.dispatch(EXPORT_ALERTING_DATA, payload)
    closeModal()
  } catch (error) {
    console.error('Export failed:', error)
  } finally {
    isExporting.value = false
  }
}
</script>
