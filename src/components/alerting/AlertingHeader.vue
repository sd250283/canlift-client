<template>
  <div class="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
    <div class="container-fluid px-6 py-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Date Selection -->
        <div class="flex items-center gap-4">
          <div class="flex flex-col space-y-2">
            <Label for="alerting-date" class="text-sm font-medium">Date d'alerte</Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  id="alerting-date"
                  variant="outline"
                  :class="cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  <span>{{ date ? df.format(toDate(parseDate(date))) : "Sélectionner une date" }}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar
                  v-model="calendarDate"
                  initial-focus
                  :max-value="today(getLocalTimeZone())"
                  @update:model-value="handleDateChange"
                />
              </PopoverContent>
            </Popover>
          </div>

          <!-- Submit Button -->
          <div class="flex flex-col space-y-2">
            <Label class="text-sm font-medium opacity-0">Action</Label>
            <Button @click="updateAlertingDate" :disabled="!date" class="bg-primary hover:bg-primary/90">
              Rechercher
            </Button>
          </div>
        </div>

        <!-- Export Button -->
        <div class="flex items-center gap-2">
          <Button variant="outline" @click="exportToPDF" v-if="getAlertingSlots && getAlertingSlots.length">
            <FileText class="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from "@internationalized/date"
import { CalendarIcon, FileText } from "lucide-vue-next"
import { toDate } from "reka-ui/date"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DATE_ALERTING, DISABLE_CONFIG } from '@/store/action.type'
import { UPDATE_ALERTING_CONFIG_DATE } from '@/store/mutations.type'

const store = useStore()

const df = new DateFormatter("fr-FR", {
  dateStyle: "long",
})

const calendarDate = ref<CalendarDate>()

const date = computed({
  get: () => store.getters.getAlertingDate,
  set: (value: string) => store.commit(UPDATE_ALERTING_CONFIG_DATE, value)
})

const getAlertingSlots = computed(() => store.getters.getAlertingSlots)

const handleDateChange = (newDate: CalendarDate | undefined) => {
  if (newDate) {
    date.value = newDate.toString()
  }
}

const focusDate = () => {
  store.dispatch(DISABLE_CONFIG)
}

const updateAlertingDate = () => {
  store.dispatch(DATE_ALERTING)
}

const exportToPDF = async () => {
  // TODO: Implement PDF export functionality for alerting
  console.log('Export PDF for alerting data')
}
</script>
