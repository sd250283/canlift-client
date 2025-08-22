<template>
  <div class="inline-flex h-9 rounded-lg bg-input/50 p-0.5">
    <RadioGroup
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :class="cn(
        'group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium',
        'after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:bg-background/80',
        'after:shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]',
        'after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
        'has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 has-[:focus-visible]:after:outline-ring/70',
        'dark:after:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]'
      )"
      :data-state="modelValue"
      :style="{ 
        '--translate-x': modelValue === firstOption?.value ? '0' : '100%'
      }"
    >
      <div
        class="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md"
        style="filter: url('#radio-glass')"
      />
      
      <label 
        v-for="option in options" 
        :key="option.value"
        :class="cn(
          'relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors',
          modelValue === option.value ? 'text-foreground' : 'text-muted-foreground/70'
        )"
      >
        {{ option.label }}
        <RadioGroupItem 
          :id="`switch-glass-${option.value}`" 
          :value="option.value" 
          class="sr-only" 
        />
      </label>
      
      <GlassFilter />
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import GlassFilter from './GlassFilter.vue'

interface SwitchOption {
  value: string
  label: string
}

interface SwitchGlassProps {
  modelValue: string
  options: SwitchOption[]
}

interface SwitchGlassEmits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<SwitchGlassProps>()
defineEmits<SwitchGlassEmits>()

const firstOption = computed(() => props.options[0])
</script>

<style scoped>
/* Dynamic positioning for the sliding indicator */
.group[data-state] {
  @apply after:data-[state]:translate-x-[var(--translate-x)];
}

/* Specific positioning for different states */
.group[data-state="offline"] {
  @apply after:translate-x-0;
}

.group[data-state="online"] {
  @apply after:translate-x-full;
}

/* Support for custom option values */
.group:has([value]:checked:first-child) {
  @apply after:translate-x-0;
}

.group:has([value]:checked:last-child) {
  @apply after:translate-x-full;
}
</style>
