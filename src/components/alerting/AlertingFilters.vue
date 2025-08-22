<template>
  <Card class="shadow-sm">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Filtres d'alerting</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Date Picker -->
      <div class="space-y-2">
        <DatePickerForm 
          v-model="date"
          label="Date d'alerting"
          description="Sélectionnez la date pour consulter les alertes"
          @submit="onDateSubmit"
        />
      </div>

      <!-- Elevator Selection -->
      <div class="space-y-2">
        <Label for="alerting-elevator-select">Sélectionner l'ascenseur</Label>
        <Select 
          :model-value="selectedElevator" 
          @update:model-value="onElevatorChange"
        >
          <SelectTrigger id="alerting-elevator-select" class="w-[280px]">
            <SelectValue placeholder="Choisir un ascenseur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les ascenseurs</SelectItem>
            <SelectItem 
              v-for="elevator in elevators" 
              :key="elevator.id" 
              :value="elevator.id.toString()"
            >
              {{ elevator.name }} ({{ elevator.capacity }} pers.)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Alert Type Filter -->
      <div class="space-y-2">
        <Label class="text-sm font-medium">Type d'alerte</Label>
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <Checkbox id="incidents" v-model="filters.incidents" />
            <Label for="incidents" class="text-sm">Incidents techniques</Label>
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox id="maintenance" v-model="filters.maintenance" />
            <Label for="maintenance" class="text-sm">Maintenance préventive</Label>
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox id="emergency" v-model="filters.emergency" />
            <Label for="emergency" class="text-sm">Urgences</Label>
          </div>
        </div>
      </div>

      <!-- Priority Filter -->
      <div class="space-y-2">
        <Label for="priority-select" class="text-sm font-medium">Priorité</Label>
        <Select v-model="selectedPriority">
          <SelectTrigger id="priority-select" class="w-full">
            <SelectValue placeholder="Toutes les priorités" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les priorités</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="low">Basse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Apply Filters Button -->
      <Button @click="applyFilters" class="w-full mt-4">
        <Filter class="mr-2 h-4 w-4" />
        Appliquer les filtres
      </Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Filter } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DatePickerForm from '@/components/ui/DatePickerForm.vue'
import { FETCH_ALERTING_CONFIG_ELEVATORS, DATE_ALERTING } from '@/store/action.type'
import { UPDATE_ALERTING_CONFIG_DATE } from '@/store/mutations.type'

const store = useStore()

const selectedElevator = ref('all')
const selectedPriority = ref('all')
const filters = ref({
  incidents: true,
  maintenance: true,
  emergency: true
})

const date = computed({
  get: () => store.getters.getAlertingConfigDate || new Date().toISOString().slice(0, 10),
  set: (value: string) => store.commit(UPDATE_ALERTING_CONFIG_DATE, value)
})

const elevators = computed(() => store.getters.getAlertingElevators || [])

onMounted(() => {
  store.dispatch(FETCH_ALERTING_CONFIG_ELEVATORS)
})

const onDateSubmit = (selectedDate: string) => {
  date.value = selectedDate
  store.dispatch(DATE_ALERTING)
}

const onElevatorChange = (elevatorId: string) => {
  selectedElevator.value = elevatorId
}

const applyFilters = () => {
  // Apply filters logic
  store.dispatch('APPLY_ALERTING_FILTERS', {
    elevator: selectedElevator.value,
    priority: selectedPriority.value,
    types: filters.value
  })
}
</script>
