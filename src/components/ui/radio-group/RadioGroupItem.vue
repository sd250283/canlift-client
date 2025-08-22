<template>
  <div
    :class="cn(
      'aspect-square size-4 rounded-full border border-input shadow-sm shadow-black/5 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'relative cursor-pointer transition-all',
      $attrs.class
    )"
    :data-state="isChecked ? 'checked' : 'unchecked'"
    role="radio"
    :aria-checked="isChecked"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @click="handleClick"
    @keydown="handleKeydown"
    v-bind="$attrs"
  >
    <div 
      v-if="isChecked"
      class="flex items-center justify-center text-current"
    >
      <svg
        width="6"
        height="6"
        viewBox="0 0 6 6"
        fill="currentcolor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="3" cy="3" r="3" />
      </svg>
    </div>
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      class="sr-only"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue'
import { cn } from '@/lib/utils'

interface RadioGroupItemProps {
  value: string
  disabled?: boolean
  name?: string
  id?: string
}

interface RadioGroupItemEmits {
  (e: 'click'): void
}

const props = defineProps<RadioGroupItemProps>()
const emit = defineEmits<RadioGroupItemEmits>()

// Inject from parent RadioGroup
const groupValue = inject<ComputedRef<string>>('radioGroupValue')
const groupName = inject<ComputedRef<string>>('radioGroupName')
const updateGroupValue = inject<(value: string) => void>('updateRadioGroupValue', () => {
  // Default function when not injected
})

const isChecked = computed(() => groupValue?.value === props.value)

const handleClick = () => {
  if (!props.disabled) {
    updateGroupValue(props.value)
    emit('click')
  }
}

const handleChange = () => {
  if (!props.disabled) {
    updateGroupValue(props.value)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if ((event.key === ' ' || event.key === 'Enter') && !props.disabled) {
    event.preventDefault()
    handleClick()
  }
}

// Remove class from $attrs to avoid duplication
defineOptions({
  inheritAttrs: false
})
</script>
