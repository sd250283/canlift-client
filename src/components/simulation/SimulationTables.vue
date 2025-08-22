<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  EDIT_DESK_SELLS,
  EDIT_MESSAGE_MODEL,
  EDIT_TO_CONTACT_ELEVATOR,
  EDIT_TO_CONTACT_STAIR,
  EDIT_TO_CONTACT_TOP,
  FETCH_MESSAGE_MODEL,
  FETCH_SIMULATION
} from '@/store/action.type'
import { UPDATE_DESK_SELLS } from '@/store/mutations.type'
import moment from 'moment'

const store = useStore()

onMounted(() => {
  store.dispatch(FETCH_MESSAGE_MODEL)
})

// Computed properties
const simulation = computed(() => store.getters.simulation)
const getElevatorCodeAffectedByEvents = computed(() => store.getters.getElevatorCodeAffectedByEvents)
const northElevatorConfig = computed(() => store.getters.getElevatorConfigByCode('north_elevator'))
const westElevatorConfig = computed(() => store.getters.getElevatorConfigByCode('west_elevator'))
const eastElevatorConfig = computed(() => store.getters.getElevatorConfigByCode('east_elevator'))
const messageModelStair = computed(() => store.getters.getMessageModelsByType('stair'))
const messageModelElevator = computed(() => store.getters.getMessageModelsByType('elevator'))

const simulationSlots = computed(() => {
  const temp = simulation.value.simulationSlots || []
  return temp.map((slot: any) => ({
    ...slot,
    isActionZone: slot.isActionZone,
    isRedZone: slot.isRedZone
  }))
})

// Table 1 Columns - Elevator and Capacity Data
const table1Columns = [
  { key: 'startTime', label: 'Créneau' },
  { key: 'northElevatorRate', label: 'Nord' },
  { key: 'eastElevatorRate', label: 'Est' },
  { key: 'westElevatorRate', label: 'Ouest' },
  { key: 'totalElevationCapacity', label: 'Capacité d\'ascension' },
  { key: 'onlineSells', label: 'Ventes en ligne' },
  { key: 'deskSells', label: 'Ventes sur place' },
  { key: 'waitingVisitors', label: 'Visiteurs en attente' }
]

// Table 2 Columns - Contact and Message Data
const table2Columns = [
  { key: 'startTime', label: 'Créneau' },
  { key: 'toContactElevator', label: 'Contacter ascenseur' },
  { key: 'restaurantSells', label: 'RSTO' },
  { key: 'receptionRoomSells', label: 'SGE' },
  { key: 'stairVisitors', label: 'Visiteurs escalier' },
  { key: 'toContactStair', label: 'Contacter escalier' },
  { key: 'toContactTop', label: 'Contacter sommet' },
  { key: 'messageModelElevator', label: 'Message ascenseur' },
  { key: 'messageModelStair', label: 'Message escalier' }
]

// Methods
const updateDeskSells = async (id: number, value: string) => {
  await store.commit(UPDATE_DESK_SELLS, { id, value })
  if (parseInt(value) >= 0) {
    await store.dispatch(EDIT_DESK_SELLS, { id, value: parseInt(value) })
    await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
  }
}

const updateToContactElevator = async (id: number, value: boolean) => {
  await store.dispatch(EDIT_TO_CONTACT_ELEVATOR, { id, value })
  await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
}

const updateToContactTop = async (id: number, value: boolean) => {
  await store.dispatch(EDIT_TO_CONTACT_TOP, { id, value })
  await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
}

const updateToContactStair = async (id: number, value: boolean) => {
  await store.dispatch(EDIT_TO_CONTACT_STAIR, { id, value })
  await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
}

const updateMessageModel = async (simulationSlot: any) => {
  await store.dispatch(EDIT_MESSAGE_MODEL, simulationSlot)
  await store.dispatch(FETCH_SIMULATION, store.getters.simulationConfig)
}

const formatTime = (value: string) => {
  return moment.utc(value).format('HH:mm')
}

const getCellVariant = (slot: any, key: string) => {
  if (key.includes('ElevatorRate')) {
    const elevatorCode = key.replace('ElevatorRate', '_elevator')
    const config = elevatorCode === 'north_elevator' ? northElevatorConfig.value :
                   elevatorCode === 'east_elevator' ? eastElevatorConfig.value :
                   westElevatorConfig.value
    
    if (config?.type === 'reserve') return 'secondary'
    if (slot[key] === 0) return 'destructive'
  }
  return 'default'
}
</script>

<template>
  <div v-if="simulation" class="space-y-6">
    <!-- Table 1: Elevator and Capacity Data -->
    <Card class="shadow-sm">
      <CardHeader>
        <CardTitle class="text-lg font-semibold">
          Données d'ascenseurs et capacités
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  v-for="column in table1Columns" 
                  :key="column.key"
                  class="text-center font-semibold"
                >
                  {{ column.label }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="slot in simulationSlots"
                :key="`table1-${slot.id}`"
                :class="{
                  'bg-green-50 hover:bg-green-100': slot.isActionZone,
                  'bg-red-50 hover:bg-red-100': slot.isRedZone
                }"
              >
                <!-- Time Slot -->
                <TableCell class="font-medium text-center">
                  {{ formatTime(slot.startTime) }}
                </TableCell>

                <!-- Elevator Rates -->
                <TableCell class="text-center">
                  <Badge 
                    v-if="(slot.isAffectedByEvents && getElevatorCodeAffectedByEvents.includes('north_elevator')) ||
                          (slot.northElevatorRate === 100 && northElevatorConfig.type === 'reserve')"
                    :variant="getCellVariant(slot, 'northElevatorRate')"
                  >
                    {{ slot.northElevatorRate }}%
                  </Badge>
                </TableCell>

                <TableCell class="text-center">
                  <Badge 
                    v-if="(slot.isAffectedByEvents && getElevatorCodeAffectedByEvents.includes('east_elevator')) ||
                          (slot.eastElevatorRate === 100 && eastElevatorConfig.type === 'reserve')"
                    :variant="getCellVariant(slot, 'eastElevatorRate')"
                  >
                    {{ slot.eastElevatorRate }}%
                  </Badge>
                </TableCell>

                <TableCell class="text-center">
                  <Badge 
                    v-if="(slot.isAffectedByEvents && getElevatorCodeAffectedByEvents.includes('west_elevator')) ||
                          (slot.westElevatorRate === 100 && westElevatorConfig.type === 'reserve')"
                    :variant="getCellVariant(slot, 'westElevatorRate')"
                  >
                    {{ slot.westElevatorRate }}%
                  </Badge>
                </TableCell>

                <!-- Capacity and Sales -->
                <TableCell class="text-center">
                  <Badge variant="outline">{{ slot.totalElevationCapacity }}</Badge>
                </TableCell>

                <TableCell class="text-center">
                  <Badge variant="outline">{{ slot.onlineSells }}</Badge>
                </TableCell>

                <TableCell class="text-center">
                  <Input
                    :model-value="slot.deskSells"
                    @update:model-value="updateDeskSells(slot.id, $event)"
                    type="number"
                    class="w-20 text-center"
                    min="0"
                  />
                </TableCell>

                <TableCell class="text-center">
                  <Badge 
                    :variant="slot.waitingVisitors > 0 ? 'destructive' : 'outline'"
                  >
                    {{ slot.waitingVisitors }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Separator />

    <!-- Table 2: Contact and Message Data -->
    <Card class="shadow-sm">
      <CardHeader>
        <CardTitle class="text-lg font-semibold">
          Messages et contacts visiteurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  v-for="column in table2Columns" 
                  :key="column.key"
                  class="text-center font-semibold"
                >
                  {{ column.label }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="slot in simulationSlots"
                :key="`table2-${slot.id}`"
                :class="{
                  'bg-green-50 hover:bg-green-100': slot.isActionZone,
                  'bg-red-50 hover:bg-red-100': slot.isRedZone
                }"
              >
                <!-- Time Slot -->
                <TableCell class="font-medium text-center">
                  {{ formatTime(slot.startTime) }}
                </TableCell>

                <!-- Contact Checkboxes -->
                <TableCell class="text-center">
                  <Checkbox
                    :checked="slot.toContactElevator"
                    @update:checked="updateToContactElevator(slot.id, $event)"
                    :disabled="!simulation.elevatorsAffectedByEvents"
                  />
                </TableCell>

                <!-- Restaurant & Reception Room Sales -->
                <TableCell class="text-center">
                  <Badge variant="outline">{{ slot.restaurantSells }}</Badge>
                </TableCell>

                <TableCell class="text-center">
                  <Badge variant="outline">{{ slot.receptionRoomSells }}</Badge>
                </TableCell>

                <TableCell class="text-center">
                  <Badge variant="outline">{{ slot.stairVisitors }}</Badge>
                </TableCell>

                <TableCell class="text-center">
                  <Checkbox
                    :checked="slot.toContactStair"
                    @update:checked="updateToContactStair(slot.id, $event)"
                    :disabled="!simulation.stairsAffectedByEvents"
                  />
                </TableCell>

                <TableCell class="text-center">
                  <Checkbox
                    :checked="slot.toContactTop"
                    @update:checked="updateToContactTop(slot.id, $event)"
                    :disabled="!simulation.topAffectedByEvents"
                  />
                </TableCell>

                <!-- Message Models -->
                <TableCell class="text-center">
                  <Select
                    :model-value="slot.messageModelElevator?.toString()"
                    @update:model-value="updateMessageModel({...slot, messageModelElevator: $event})"
                    :disabled="!slot.toContactElevator && !slot.toContactTop"
                  >
                    <SelectTrigger class="w-40">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      <SelectItem 
                        v-for="message in messageModelElevator"
                        :key="message.id"
                        :value="message.id.toString()"
                      >
                        {{ message.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell class="text-center">
                  <Select
                    :model-value="slot.messageModelStair?.toString()"
                    @update:model-value="updateMessageModel({...slot, messageModelStair: $event})"
                    :disabled="!slot.toContactStair"
                  >
                    <SelectTrigger class="w-40">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      <SelectItem 
                        v-for="message in messageModelStair"
                        :key="message.id"
                        :value="message.id.toString()"
                      >
                        {{ message.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
