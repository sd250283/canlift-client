<template>
  <Card class="shadow-sm">
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle class="text-lg font-semibold">Données d'alerte</CardTitle>
      <Button @click="openExportModal" variant="outline" class="flex items-center gap-2">
        <Download class="h-4 w-4" />
        Exporter
      </Button>
    </CardHeader>
    <CardContent>
      <!-- Alerting Data Table -->
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[100px]">Heure</TableHead>
              <TableHead>Ascenseur Nord</TableHead>
              <TableHead>Ascenseur Est</TableHead>
              <TableHead>Ascenseur Ouest</TableHead>
              <TableHead class="border-l-2 border-muted">Capacité</TableHead>
              <TableHead class="border-l-2 border-muted">Visiteurs</TableHead>
              <TableHead class="border-l-2 border-muted">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="slot in alertingSlots"
              :key="slot.id"
              :class="{
                'bg-green-50 dark:bg-green-950/10': slot.isActionZone,
                'bg-red-50 dark:bg-red-950/10': slot.isRedZone
              }"
            >
              <TableCell class="font-medium">{{ formatTime(slot.startTime) }}</TableCell>
              <TableCell :class="{ 'bg-blue-50 dark:bg-blue-950/10': northElevatorConfig.type === 'reserve' }">
                <Badge 
                  :variant="slot.northElevatorRate === 0 ? 'destructive' : 'outline'"
                >
                  {{ slot.northElevatorRate }}%
                </Badge>
              </TableCell>
              <TableCell :class="{ 'bg-blue-50 dark:bg-blue-950/10': eastElevatorConfig.type === 'reserve' }">
                <Badge 
                  :variant="slot.eastElevatorRate === 0 ? 'destructive' : 'outline'"
                >
                  {{ slot.eastElevatorRate }}%
                </Badge>
              </TableCell>
              <TableCell :class="{ 'bg-blue-50 dark:bg-blue-950/10': westElevatorConfig.type === 'reserve' }">
                <Badge 
                  :variant="slot.westElevatorRate === 0 ? 'destructive' : 'outline'"
                >
                  {{ slot.westElevatorRate }}%
                </Badge>
              </TableCell>
              <TableCell class="border-l-2 border-muted">
                <Badge variant="outline">{{ slot.totalElevationCapacity }}</Badge>
              </TableCell>
              <TableCell class="border-l-2 border-muted">
                <Badge 
                  :variant="slot.waitingVisitors > 0 ? 'destructive' : 'outline'"
                >
                  {{ slot.waitingVisitors }}
                </Badge>
              </TableCell>
              <TableCell class="border-l-2 border-muted">
                <Badge 
                  :variant="getStatusVariant(slot)"
                >
                  {{ getStatusText(slot) }}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Empty State -->
      <div v-if="!alertingSlots || alertingSlots.length === 0" class="text-center py-8">
        <p class="text-muted-foreground">Aucune donnée d'alerte disponible pour cette date.</p>
        <p class="text-sm text-muted-foreground mt-2">Sélectionnez une date et cliquez sur "Rechercher".</p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Download } from 'lucide-vue-next'
import moment from 'moment'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const store = useStore()

const alertingSlots = computed(() => store.getters.getAlertingSlots)
const elevatorConfig = computed(() => store.getters.getAlertingElevatorConfig)

// Get specific elevator configs
const northElevatorConfig = computed(() => 
  elevatorConfig.value.find((e: any) => e.code === 'north_elevator') || { type: 'active' }
)
const eastElevatorConfig = computed(() => 
  elevatorConfig.value.find((e: any) => e.code === 'east_elevator') || { type: 'active' }
)
const westElevatorConfig = computed(() => 
  elevatorConfig.value.find((e: any) => e.code === 'west_elevator') || { type: 'active' }
)

const formatTime = (value: string) => {
  return moment.utc(value).format('HH:mm')
}

const getStatusVariant = (slot: any) => {
  if (slot.isRedZone) return 'destructive'
  if (slot.isActionZone) return 'default'
  return 'secondary'
}

const getStatusText = (slot: any) => {
  if (slot.isRedZone) return 'Critique'
  if (slot.isActionZone) return 'Attention'
  return 'Normal'
}

const openExportModal = () => {
  // Emit event to parent or use store to open export modal
  store.commit('SHOW_EXPORT_MODAL', true)
}
</script>
