<template>
  <div class="p-8 space-y-8">
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">Glass Switch Demo</h2>
      <p class="text-muted-foreground">
        Current environment: <span class="font-semibold">{{ environment }}</span>
      </p>
    </div>

    <!-- Basic Usage -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Basic Switch</h3>
      <SwitchGlass
        v-model="environment"
        :options="environmentOptions"
      />
    </div>

    <!-- Custom Options -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Custom Options</h3>
      <SwitchGlass
        v-model="mode"
        :options="modeOptions"
      />
      <p class="text-sm text-muted-foreground">
        Current mode: {{ mode }}
      </p>
    </div>

    <!-- Multiple Switches -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Multiple Switches</h3>
      <div class="space-y-3">
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium w-20">Theme:</span>
          <SwitchGlass
            v-model="theme"
            :options="themeOptions"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium w-20">Size:</span>
          <SwitchGlass
            v-model="size"
            :options="sizeOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SwitchGlass, type SwitchOption } from '@/components/ui/switch-glass'

// Environment switch (matching original demo)
const environment = ref('online')
const environmentOptions: SwitchOption[] = [
  { value: 'offline', label: 'Test' },
  { value: 'online', label: 'Prod' }
]

// Custom mode switch
const mode = ref('manual')
const modeOptions: SwitchOption[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'auto', label: 'Auto' }
]

// Theme switch
const theme = ref('light')
const themeOptions: SwitchOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
]

// Size switch
const size = ref('small')
const sizeOptions: SwitchOption[] = [
  { value: 'small', label: 'Small' },
  { value: 'large', label: 'Large' }
]
</script>
