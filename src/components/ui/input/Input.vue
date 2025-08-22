<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { ref, watch } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes["class"]
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
  (e: "update:saved", payload: boolean): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

// Track the original value when input gets focus
const originalValue = ref<string | number | undefined>()
const hasChanged = ref(false)
const isUserEditing = ref(false)

const handleFocus = () => {
  // Store the original value when input gets focus
  originalValue.value = modelValue.value
  isUserEditing.value = true
}

const handleBlur = () => {
  // Check if value has changed when input loses focus
  const valueChanged = originalValue.value !== modelValue.value
  hasChanged.value = valueChanged
  isUserEditing.value = false
  
  // Emit the saved state to parent
  emits("update:saved", !valueChanged)
}

// Watch for external changes to modelValue and reset saved state
// But only when user is not actively editing
watch(() => props.modelValue, () => {
  if (!isUserEditing.value) {
    hasChanged.value = false
    emits("update:saved", true)
  }
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(
      'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      props.class,
    )"
    @focus="handleFocus"
    @blur="handleBlur"
  >
</template>
