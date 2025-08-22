<template>
  <div
    :class="cn('grid gap-3', $attrs.class)"
    role="radiogroup"
    :aria-orientation="orientation"
    :aria-required="required"
    :aria-invalid="invalid"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { cn } from '@/lib/utils'

interface RadioGroupProps {
  modelValue?: string
  name?: string
  required?: boolean
  invalid?: boolean
  orientation?: 'horizontal' | 'vertical'
}

interface RadioGroupEmits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<RadioGroupProps>()
const emit = defineEmits<RadioGroupEmits>()

// Provide context to child RadioGroupItem components
provide('radioGroupValue', computed(() => props.modelValue || ''))
provide('radioGroupName', computed(() => props.name || ''))
provide('updateRadioGroupValue', (value: string) => {
  emit('update:modelValue', value)
})

// Remove class from $attrs to avoid duplication
defineOptions({
  inheritAttrs: false
})
</script>
