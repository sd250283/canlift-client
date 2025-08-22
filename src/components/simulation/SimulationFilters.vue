<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import DatePickerForm from '@/components/ui/DatePickerForm.vue'
import { UPDATE_SIMULATION_CONFIG_DATE } from '@/store/mutations.type'
import { DATE_SIMULATION } from '@/store/action.type'

const store = useStore()

const date = computed({
  get: () => store.getters.getSimulationConfigDate,
  set: (value: string) => store.commit(UPDATE_SIMULATION_CONFIG_DATE, value)
})

const elevators = computed(() => store.getters.getElevators)
const selectedElevator = computed(() => store.getters.selectedElevator || 'all')

const onDateSubmit = (selectedDate: string) => {
  date.value = selectedDate
  store.dispatch(DATE_SIMULATION)
}

const onElevatorChange = (elevatorId: string) => {
  // Handle elevator selection change
  store.commit('SET_SELECTED_ELEVATOR', elevatorId)
}
</script>

<template>
  <Card class="shadow-sm">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Filtres de simulation</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Date Picker -->
      <div class="space-y-2">
        <DatePickerForm 
          v-model="date"
          label="Date de simulation"
          description="Sélectionnez la date pour la simulation"
          @submit="onDateSubmit"
        />
      </div>

      <!-- Elevator Selection -->
      <div class="space-y-2">
        <Label for="elevator-select">Sélectionner l'ascenseur</Label>
        <Select 
          :model-value="selectedElevator" 
          @update:model-value="onElevatorChange"
        >
          <SelectTrigger id="elevator-select" class="w-[280px]">
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
    </CardContent>
  </Card>
</template>
