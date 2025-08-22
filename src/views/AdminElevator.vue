<template>
  <div class="w-full min-h-full bg-background dark:bg-background-header text-foreground">
    <div class="w-full p-6">
      <div class="bg-card w-full text-card-foreground rounded-lg  shadow-sm p-6">
        <h1 class="text-2xl font-bold mb-6 text-foreground">Gestion des Ascenseurs</h1>
        <div class="w-full overflow-hidden">
          <AppTable :columns="columns" :data="elevators" class="w-full">
            <template v-slot:capacity="{ row, index }">
              <Input 
                class="w-full p-2 font-medium text-foreground" 
                :modelValue="row.capacity" 
                @update:modelValue="(value: string | number) => updateCapacity(index, value)"
                type="number"
                min="1"
              />
            </template>
          </AppTable>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import AppTable from '@/components/ui/table/AppTable.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' // Import Button component
import { FETCH_ELEVATORS, EDIT_ELEVATOR } from '../store/action.type'
import { ElevatorsService } from '@/common/api.service'
import type { IElevator } from '@/models/index'

export default defineComponent({
  name: 'AdminElevator',
  components: {
    AppTable,
    Input,
    Button, // Register Button component
  },
  setup() {
    const store = useStore()
    
    // Reactive state for tracking changes
    const changedElevators = ref<Map<number, { elevator: IElevator, newCapacity: number }>>(new Map())

    const columns = [
      { key: 'name', label: 'Nom', width: 'w-1/4' },
      { key: 'capacity', label: 'Capacité', width: 'w-3/4' }
    ]

    const elevators = computed(() => {
      return store.getters.elevators
    })

    // Computed to check if there are unsaved changes
    const hasUnsavedChanges = computed(() => {
      return changedElevators.value.size > 0
    })

    // Update capacity value locally and track for saving
    const updateCapacity = (index: number, value: string | number) => {
      const elevator = elevators.value[index]
      if (elevator) {
        const numericValue = typeof value === 'string' ? parseInt(value, 10) : value

        // Only track if the capacity has actually changed
        if (elevator.capacity !== numericValue) {
          // Update the local reactive data
          elevator.capacity = numericValue
          
          // Track this change for later saving
          changedElevators.value.set(index, {
            elevator: elevator,
            newCapacity: numericValue
          })
        } else {
          // If capacity is reverted to original, remove from changed list
          changedElevators.value.delete(index)
        }
      }
    }

    // Save all tracked changes
    const saveChanges = async () => {
      for (const [index, changeData] of changedElevators.value.entries()) {
        try {
          const { elevator, newCapacity } = changeData
          
          // Send only the changed data for PATCH
          await ElevatorsService.update(elevator.id!, newCapacity)
          
          // Update in Vuex store
          const updatedElevator = { ...elevator, capacity: newCapacity }
          await store.dispatch(EDIT_ELEVATOR, updatedElevator)
          
          // Remove from changed list since it's now saved
          changedElevators.value.delete(index)
          
        } catch (error) {
          process.env.NODE_ENV === 'development' && console.error(`[AdminElevator] FAILED to save elevator change for index ${index}:`, error)
          // Keep the change in the map for potential retry or display error to user
        }
      }
    }

    // Original updateParameter function (kept for compatibility, though likely unused now)
    const updateParameter = (index: number) => {
      store.dispatch(EDIT_ELEVATOR, elevators.value[index])
    }

    onMounted(() => {
      store.dispatch(FETCH_ELEVATORS)
    })

    return {
      columns,
      elevators,
      hasUnsavedChanges,
      updateCapacity,
      saveChanges, // Expose saveChanges
      updateParameter,
    }
  }
})
</script>

<style scoped>
.td {
  padding-left: 2%;
}
</style>
