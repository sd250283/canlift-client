<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sun, Monitor, Check, ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'switch'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  variant: 'button',
  size: 'md',
  showLabel: false,
})

// Vue composables for dark mode
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  initialValue: 'auto', // Respects system preference
})
const toggleDark = useToggle(isDark)

// Theme options
const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const

type ThemeValue = typeof themes[number]['value']

// Current theme state
const currentTheme = ref<ThemeValue>('system')

// Update current theme based on isDark value and system preference
const updateCurrentTheme = () => {
  if (isDark.value === true) {
    currentTheme.value = 'dark'
  } else if (isDark.value === false) {
    currentTheme.value = 'light'
  } else {
    currentTheme.value = 'system'
  }
}

// Set theme function
const setTheme = (theme: ThemeValue) => {
  currentTheme.value = theme
  
  if (theme === 'dark') {
    isDark.value = true
  } else if (theme === 'light') {
    isDark.value = false
  } else {
    // System theme - respect system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = systemPrefersDark
  }
}

// Watch for system changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme.value === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = systemPrefersDark
    }
  })
}

// Initialize theme
updateCurrentTheme()

// Computed properties
const currentThemeData = computed(() => 
  themes.find(theme => theme.value === currentTheme.value) || themes[0]
)

const nextTheme = computed(() => {
  const currentIndex = themes.findIndex(theme => theme.value === currentTheme.value)
  return themes[(currentIndex + 1) % themes.length]
})

// Size classes
const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm', 
  lg: 'h-10 w-10 text-base',
}

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
}

// Button click handler for simple toggle
const handleButtonClick = () => {
  setTheme(nextTheme.value.value)
}
</script>

<template>
  <div>
    <!-- Simple Button Toggle -->
    <Button
      v-if="variant === 'button'"
      variant="ghost"
      :size="size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'icon'"
      @click="handleButtonClick"
      :class="cn(
        'relative transition-all duration-200 hover:scale-105 active:scale-95',
        !showLabel && sizeClasses[size],
        showLabel && 'px-3 gap-2',
        props.class
      )"
      :title="`Switch to ${nextTheme.label.toLowerCase()} mode`"
    >
      <component
        :is="currentThemeData.icon"
        :size="iconSizes[size]"
        class="transition-all duration-300"
        :class="[
          currentTheme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0',
          currentTheme === 'light' ? '' : 'absolute'
        ]"
        v-if="currentTheme === 'light'"
      />
      <component
        :is="currentThemeData.icon"
        :size="iconSizes[size]"
        class="transition-all duration-300"
        :class="[
          currentTheme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0',
          currentTheme === 'dark' ? '' : 'absolute'
        ]"
        v-if="currentTheme === 'dark'"
      />
      <component
        :is="currentThemeData.icon"
        :size="iconSizes[size]"
        class="transition-all duration-300"
        v-if="currentTheme === 'system'"
      />
      <span v-if="showLabel" class="font-medium">
        {{ currentThemeData.label }}
      </span>
      <span class="sr-only">Toggle theme</span>
    </Button>

    <!-- Dropdown Toggle -->
    <DropdownMenu v-else-if="variant === 'dropdown'">
      <DropdownMenuTrigger as-child>
        <Button
          variant="outline"
          :size="size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'"
          :class="cn(
            'gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
            !showLabel && sizeClasses[size],
            props.class
          )"
        >
          <component
            :is="currentThemeData.icon"
            :size="iconSizes[size]"
          />
          <span v-if="showLabel" class="font-medium">
            {{ currentThemeData.label }}
          </span>
          <ChevronDown :size="iconSizes[size]" class="opacity-50" />
          <span class="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="min-w-[120px]">
        <DropdownMenuItem
          v-for="theme in themes"
          :key="theme.value"
          @click="setTheme(theme.value)"
          :class="cn(
            'flex items-center gap-2 cursor-pointer',
            currentTheme === theme.value && 'bg-accent text-accent-foreground'
          )"
        >
          <component :is="theme.icon" :size="iconSizes[size]" />
          <span class="flex-1">{{ theme.label }}</span>
          <Check
            :size="iconSizes[size]"
            v-if="currentTheme === theme.value"
            class="ml-auto"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Switch Toggle -->
    <Button
      v-else-if="variant === 'switch'"
      variant="ghost"
      @click="toggleDark()"
      :class="cn(
        'relative rounded-full border-2 transition-all duration-300',
        'border-border bg-background',
        size === 'sm' ? 'h-6 w-11' : size === 'md' ? 'h-7 w-12' : 'h-8 w-14',
        props.class
      )"
    >
      <div
        :class="cn(
          'absolute rounded-full bg-foreground transition-all duration-300 flex items-center justify-center',
          size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6',
          isDark
            ? (size === 'sm' ? 'translate-x-5' : size === 'md' ? 'translate-x-5' : 'translate-x-6')
            : 'translate-x-0'
        )"
      >
        <Sun
          v-if="!isDark"
          :size="size === 'sm' ? 10 : size === 'md' ? 12 : 14"
          class="text-background"
        />
        <Moon
          v-else
          :size="size === 'sm' ? 10 : size === 'md' ? 12 : 14"
          class="text-background"
        />
      </div>
      <span class="sr-only">Toggle dark mode</span>
    </Button>
  </div>
</template>
