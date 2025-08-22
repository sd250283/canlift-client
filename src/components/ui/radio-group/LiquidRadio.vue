<template>
  <div class="inline-flex h-9 rounded-lg bg-input/50 p-0.5">
    <div
      :class="cn(
        'group relative inline-grid items-center gap-0 text-sm font-medium',
        'after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-background/80',
        'after:shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]',
        'after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
        'has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 has-[:focus-visible]:after:outline-ring/70',
        'dark:after:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]',
        gridColsClass,
        afterTransformClass
      )"
      :data-state="modelValue"
    >
      <div
        class="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md"
        :style="{ filter: 'url(#radio-glass)' }"
      />
      
      <label
        v-for="option in options"
        :key="option.value"
        :class="cn(
          'relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors',
          getOptionClasses(option.value)
        )"
      >
        {{ option.label }}
        <input
          :id="`${name}-${option.value}`"
          :value="option.value"
          :checked="modelValue === option.value"
          :name="name"
          type="radio"
          class="sr-only"
          @change="handleChange(option.value)"
        />
      </label>
      
      <GlassFilter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import GlassFilter from './GlassFilter.vue'

interface LiquidRadioOption {
  label: string
  value: string
}

interface LiquidRadioProps {
  modelValue: string
  options: LiquidRadioOption[]
  name?: string
}

interface LiquidRadioEmits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<LiquidRadioProps>(), {
  name: 'liquid-radio'
})

const emit = defineEmits<LiquidRadioEmits>()

const gridColsClass = computed(() => {
  const cols = props.options.length
  if (cols === 2) return 'grid-cols-2'
  if (cols === 3) return 'grid-cols-3'
  if (cols === 4) return 'grid-cols-4'
  return `grid-cols-${cols}`
})

const afterTransformClass = computed(() => {
  const selectedIndex = props.options.findIndex(option => option.value === props.modelValue)
  if (selectedIndex === -1) return ''
  
  if (selectedIndex === 0) {
    return 'after:translate-x-0'
  } else {
    return 'after:translate-x-full'
  }
})

const getOptionClasses = (value: string) => {
  const isSelected = props.modelValue === value
  return isSelected ? 'text-foreground' : 'text-muted-foreground/70'
}

const handleChange = (value: string) => {
  emit('update:modelValue', value)
}
</script>
