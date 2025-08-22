<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, RefreshCw, Check, Trash2 } from 'lucide-vue-next'
import {
  FETCH_SIMULATION,
  CHANGE_TYPE,
  FETCH_SIMULATION_SELLS,
  ENABLE_LOADING
} from '@/store/action.type'
import { DELETE_SIMULATION_SHOW_POPUP } from '@/store/mutations.type'

const store = useStore()

const simulationConfig = computed(() => store.getters.simulationConfig)
const simulation = computed(() => store.getters.simulation)

const switchElevators = (index: number, type: string, typeLine: string) => {
  store.dispatch(CHANGE_TYPE, [index, type, typeLine])
}

const updateSimulation = (simulationConfig: any) => {
  store.dispatch(ENABLE_LOADING)
  store.dispatch(FETCH_SIMULATION, simulationConfig)
}

const deleteSimulation = () => {
  store.commit(DELETE_SIMULATION_SHOW_POPUP, true)
}

const updateSells = () => {
  store.dispatch(ENABLE_LOADING)
  store.dispatch(FETCH_SIMULATION_SELLS)
}

const getElevatorTypeIcon = (type: string) => {
  return type === 'standard' ? CheckCircle : Circle
}

const getElevatorTypeBadge = (type: string) => {
  return type === 'standard' ? 'default' : 'secondary'
}
</script>

<template>
  <Card class="shadow-sm">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Configuration des ascenseurs</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Elevator Configuration Table -->
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="font-semibold">Configuration</TableHead>
              <TableHead 
                v-for="(elevator, index) in simulationConfig.elevatorConfig"
                :key="index"
                class="text-center font-semibold"
                :class="{ 'bg-muted': elevator.type === 'reserve' }"
              >
                {{ elevator.name }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- Capacity Row -->
            <TableRow>
              <TableCell class="font-medium">Capacité</TableCell>
              <TableCell 
                v-for="(elevator, index) in simulationConfig.elevatorConfig"
                :key="`capacity-${index}`"
                class="text-center"
                :class="{ 'bg-muted': elevator.type === 'reserve' }"
              >
                <Badge variant="outline">{{ elevator.capacity }} pers.</Badge>
              </TableCell>
            </TableRow>

            <!-- Online Sales Row -->
            <TableRow class="hover:bg-muted/50">
              <TableCell class="font-medium">Ascenseur Vente en ligne</TableCell>
              <TableCell 
                v-for="(elevator, index) in simulationConfig.elevatorConfig"
                :key="`online-${index}`"
                class="text-center cursor-pointer p-2"
                :class="{ 'bg-muted': elevator.type === 'reserve' }"
                @click="switchElevators(index, elevator.type, 'standard')"
              >
                <component 
                  :is="getElevatorTypeIcon(elevator.type)"
                  class="h-5 w-5 mx-auto"
                  :class="elevator.type === 'standard' ? 'text-green-600' : 'text-gray-400'"
                />
              </TableCell>
            </TableRow>

            <!-- Reserve Row -->
            <TableRow class="hover:bg-muted/50">
              <TableCell class="font-medium">Ascenseur Réserve</TableCell>
              <TableCell 
                v-for="(elevator, index) in simulationConfig.elevatorConfig"
                :key="`reserve-${index}`"
                class="text-center cursor-pointer p-2"
                :class="{ 'bg-muted': elevator.type === 'reserve' }"
                @click="switchElevators(index, elevator.type, 'reserve')"
              >
                <component 
                  :is="getElevatorTypeIcon(elevator.type)"
                  class="h-5 w-5 mx-auto"
                  :class="elevator.type === 'reserve' ? 'text-blue-600' : 'text-gray-400'"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3">
        <Button
          @click="updateSimulation(simulationConfig)"
          class="w-full"
          size="lg"
        >
          <Check class="mr-2 h-4 w-4" />
          Valider la configuration
        </Button>

        <Button
          @click="updateSells()"
          :disabled="!simulation.id"
          variant="outline"
          class="w-full"
        >
          <RefreshCw class="mr-2 h-4 w-4" />
          Actualiser les ventes
        </Button>

        <Button
          @click="deleteSimulation()"
          :disabled="!simulation.id"
          variant="destructive"
          class="w-full"
        >
          <Trash2 class="mr-2 h-4 w-4" />
          Supprimer la simulation
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
