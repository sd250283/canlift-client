<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from "@internationalized/date"
import { toTypedSchema } from "@vee-validate/zod"
import { CalendarIcon } from "lucide-vue-next"
import { toDate } from "reka-ui/date"
import { useForm } from "vee-validate"
import { computed, watch, ref } from "vue"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Props {
  modelValue?: string
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Date de simulation',
  description: 'Date de la journée concernée',
  placeholder: 'Choisir une date',
  disabled: false
})

const emit = defineEmits<Emits>()

const df = new DateFormatter("fr-FR", {
  dateStyle: "long",
})

const formSchema = toTypedSchema(z.object({
  date: z
    .string()
    .refine(v => v, { message: "Une date est requise." }),
}))

const placeholder = ref()

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    date: props.modelValue || new Date().toISOString().slice(0, 10)
  },
})

const value = computed({
  get: () => values.date ? parseDate(values.date) : undefined,
  set: val => val,
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== values.date) {
    setFieldValue('date', newValue)
  }
}, { immediate: true })

// Watch for internal changes and emit
watch(() => values.date, (newValue) => {
  if (newValue && newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
  }
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values.date)
})
</script>

<template>
  <div class="space-y-4">
    <form @submit="onSubmit">
      <FormField name="date">
        <FormItem class="flex flex-col">
          <FormLabel>{{ label }}</FormLabel>
          <Popover>
            <PopoverTrigger as-child>
              <FormControl>
                <Button
                  variant="outline" 
                  :disabled="disabled"
                  :class="cn(
                    'w-[280px] ps-3 text-start font-normal',
                    !value && 'text-muted-foreground',
                  )"
                >
                  <span>{{ value ? df.format(toDate(value)) : placeholder }}</span>
                  <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                </Button>
                <input hidden>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar
                v-model:placeholder="placeholder"
                :model-value="value"
                calendar-label="Date de simulation"
                initial-focus
                :min-value="new CalendarDate(1900, 1, 1)"
                :max-value="today(getLocalTimeZone())"
                @update:model-value="(v) => {
                  if (v) {
                    setFieldValue('date', v.toString())
                  }
                  else {
                    setFieldValue('date', undefined)
                  }
                }"
              />
            </PopoverContent>
          </Popover>
          <FormDescription v-if="description">
            {{ description }}
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" class="mt-4">
        Rechercher
      </Button>
    </form>
  </div>
</template>
