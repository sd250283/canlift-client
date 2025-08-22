<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

interface EventSelection {
  id: string
  startTime: string
  endTime: string
  messageId: string | null
}

const store = useStore()

const eventSelections = ref<EventSelection[]>([
  {
    id: '1',
    startTime: '',
    endTime: '',
    messageId: null
  }
])

const timeSlots = computed(() => {
  // Generate time slots from 9:00 to 18:00 in 30-minute intervals
  const slots = []
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(time)
    }
  }
  return slots
})

const messageModels = computed(() => store.getters.getMessageModels || [])

const addEventSelection = () => {
  eventSelections.value.push({
    id: Date.now().toString(),
    startTime: '',
    endTime: '',
    messageId: null
  })
}

const removeEventSelection = (id: string) => {
  eventSelections.value = eventSelections.value.filter(event => event.id !== id)
}

const selectSlots = (event: EventSelection) => {
  if (!event.startTime || !event.endTime) {
    return
  }
  
  // Logic to select all slots between start and end time
  store.dispatch('SELECT_SIMULATION_SLOTS', {
    startTime: event.startTime,
    endTime: event.endTime,
    messageId: event.messageId
  })
}

const isValidSelection = (event: EventSelection) => {
  return event.startTime && event.endTime && event.startTime < event.endTime
}
</script>

<template>
  <Card class="shadow-sm">
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle class="text-lg font-semibold">Sélection d'événements</CardTitle>
      <Button
        variant="outline"
        size="sm"
        @click="addEventSelection"
        class="h-8 w-8 p-0"
      >
        <Plus class="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div 
          v-for="(event, index) in eventSelections" 
          :key="event.id"
          class="p-4 border rounded-lg space-y-4"
        >
          <!-- Event Header with Remove Button -->
          <div class="flex items-center justify-between">
            <Badge variant="outline">Événement {{ index + 1 }}</Badge>
            <Button
              v-if="eventSelections.length > 1"
              variant="ghost"
              size="sm"
              @click="removeEventSelection(event.id)"
              class="h-6 w-6 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>

          <!-- Time Selection Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Start Time -->
            <div class="space-y-2">
              <Label>Heure de début</Label>
              <Select v-model="event.startTime">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem 
                    v-for="slot in timeSlots" 
                    :key="`start-${slot}`" 
                    :value="slot"
                  >
                    {{ slot }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- End Time -->
            <div class="space-y-2">
              <Label>Heure de fin</Label>
              <Select v-model="event.endTime">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem 
                    v-for="slot in timeSlots" 
                    :key="`end-${slot}`" 
                    :value="slot"
                    :disabled="event.startTime && slot <= event.startTime"
                  >
                    {{ slot }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Message Model -->
            <div class="space-y-2">
              <Label>Modèle de message</Label>
              <Select v-model="event.messageId">
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un message" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun message</SelectItem>
                  <SelectItem 
                    v-for="message in messageModels" 
                    :key="message.id" 
                    :value="message.id.toString()"
                  >
                    {{ message.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Select Button -->
          <div class="flex justify-end">
            <Button
              @click="selectSlots(event)"
              :disabled="!isValidSelection(event)"
              variant="default"
              size="sm"
            >
              Sélectionner
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
