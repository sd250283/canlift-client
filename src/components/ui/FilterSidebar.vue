<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ChevronDown, Filter, X, RotateCcw } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

interface FilterOption {
  value: string | number
  label: string
  count?: number
}

interface FilterGroup {
  key: string
  label: string
  type: 'checkbox' | 'select' | 'multiselect' | 'search' | 'range'
  options?: FilterOption[]
  placeholder?: string
  min?: number
  max?: number
  defaultOpen?: boolean
}

interface FilterSidebarProps {
  filters: FilterGroup[]
  title?: string
  isLoading?: boolean
  resultCount?: number
}

interface FilterSidebarEmits {
  (e: 'apply', filters: Record<string, any>): void
  (e: 'reset'): void
  (e: 'search', query: string): void
}

const props = withDefaults(defineProps<FilterSidebarProps>(), {
  title: 'Filtres',
  isLoading: false,
  resultCount: 0
})

const emit = defineEmits<FilterSidebarEmits>()

const store = useStore()

// Filter values state
const filterValues = ref<Record<string, any>>({})
const searchQuery = ref('')
const openGroups = ref<Set<string>>(new Set())

// Initialize filter values
const initializeFilters = () => {
  props.filters.forEach(filter => {
    if (filter.type === 'checkbox' || filter.type === 'multiselect') {
      filterValues.value[filter.key] = []
    } else if (filter.type === 'range') {
      filterValues.value[filter.key] = { min: filter.min, max: filter.max }
    } else {
      filterValues.value[filter.key] = ''
    }
    
    // Set default open state
    if (filter.defaultOpen !== false) {
      openGroups.value.add(filter.key)
    }
  })
}

// Toggle group open/close
const toggleGroup = (key: string) => {
  if (openGroups.value.has(key)) {
    openGroups.value.delete(key)
  } else {
    openGroups.value.add(key)
  }
}

// Check if group is open
const isGroupOpen = (key: string) => openGroups.value.has(key)

// Handle filter changes
const handleFilterChange = (key: string, value: any) => {
  filterValues.value[key] = value
  applyFilters()
}

// Handle checkbox changes
const handleCheckboxChange = (filterKey: string, optionValue: string, checked: boolean) => {
  if (!Array.isArray(filterValues.value[filterKey])) {
    filterValues.value[filterKey] = []
  }
  
  if (checked) {
    if (!filterValues.value[filterKey].includes(optionValue)) {
      filterValues.value[filterKey].push(optionValue)
    }
  } else {
    filterValues.value[filterKey] = filterValues.value[filterKey].filter(
      (v: any) => v !== optionValue
    )
  }
  
  applyFilters()
}

// Apply filters
const applyFilters = () => {
  const activeFilters = { ...filterValues.value }
  
  // Remove empty filters
  Object.keys(activeFilters).forEach(key => {
    const value = activeFilters[key]
    if (Array.isArray(value) && value.length === 0) {
      delete activeFilters[key]
    } else if (!value && value !== 0) {
      delete activeFilters[key]
    }
  })
  
  emit('apply', activeFilters)
}

// Reset all filters
const resetFilters = () => {
  initializeFilters()
  searchQuery.value = ''
  emit('reset')
}

// Handle search
const handleSearch = () => {
  emit('search', searchQuery.value)
}

// Count active filters
const activeFilterCount = computed(() => {
  let count = 0
  Object.values(filterValues.value).forEach(value => {
    if (Array.isArray(value) && value.length > 0) {
      count += value.length
    } else if (value && value !== '') {
      count += 1
    }
  })
  return count
})

onMounted(() => {
  initializeFilters()
})
</script>

<template>
  <Card class="w-80 h-fit">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="flex items-center gap-2 text-lg">
          <Filter class="h-5 w-5" />
          {{ title }}
          <span v-if="activeFilterCount > 0" class="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {{ activeFilterCount }}
          </span>
        </CardTitle>
        <Button
          v-if="activeFilterCount > 0"
          variant="ghost"
          size="sm"
          @click="resetFilters"
          class="h-8 w-8 p-0"
        >
          <RotateCcw class="h-4 w-4" />
        </Button>
      </div>
      
      <div v-if="resultCount !== undefined" class="text-sm text-muted-foreground">
        {{ resultCount }} résultat{{ resultCount !== 1 ? 's' : '' }}
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Global Search -->
      <div class="space-y-2">
        <Label for="search">Recherche globale</Label>
        <div class="flex gap-2">
          <Input
            id="search"
            v-model="searchQuery"
            placeholder="Rechercher..."
            @keyup.enter="handleSearch"
          />
          <Button size="sm" @click="handleSearch" :disabled="isLoading">
            <Filter class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <!-- Filter Groups -->
      <div class="space-y-4">
        <div v-for="filter in filters" :key="filter.key" class="space-y-2">
          <Collapsible :open="isGroupOpen(filter.key)" @update:open="() => toggleGroup(filter.key)">
            <CollapsibleTrigger class="flex w-full items-center justify-between py-2 text-sm font-medium hover:bg-muted/50 rounded px-2">
              {{ filter.label }}
              <ChevronDown :class="cn('h-4 w-4 transition-transform', isGroupOpen(filter.key) && 'rotate-180')" />
            </CollapsibleTrigger>
            
            <CollapsibleContent class="space-y-3 pt-2">
              <!-- Checkbox Filter -->
              <div v-if="filter.type === 'checkbox'" class="space-y-2">
                <div
                  v-for="option in filter.options"
                  :key="option.value"
                  class="flex items-center space-x-2"
                >
                  <Checkbox
                    :id="`${filter.key}-${option.value}`"
                    :checked="filterValues[filter.key]?.includes(option.value)"
                    @update:checked="(checked) => handleCheckboxChange(filter.key, option.value.toString(), checked)"
                  />
                  <Label
                    :for="`${filter.key}-${option.value}`"
                    class="text-sm font-normal cursor-pointer flex-1"
                  >
                    {{ option.label }}
                    <span v-if="option.count !== undefined" class="text-muted-foreground ml-1">
                      ({{ option.count }})
                    </span>
                  </Label>
                </div>
              </div>

              <!-- Select Filter -->
              <div v-if="filter.type === 'select'">
                <Select
                  :model-value="filterValues[filter.key]"
                  @update:model-value="(value) => handleFilterChange(filter.key, value)"
                >
                  <SelectTrigger>
                    <SelectValue :placeholder="filter.placeholder || 'Sélectionner...'" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem
                      v-for="option in filter.options"
                      :key="option.value"
                      :value="option.value.toString()"
                    >
                      {{ option.label }}
                      <span v-if="option.count !== undefined" class="text-muted-foreground ml-1">
                        ({{ option.count }})
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Search Filter -->
              <div v-if="filter.type === 'search'">
                <Input
                  :model-value="filterValues[filter.key]"
                  @update:model-value="(value) => handleFilterChange(filter.key, value)"
                  :placeholder="filter.placeholder || 'Rechercher...'"
                />
              </div>

              <!-- Range Filter -->
              <div v-if="filter.type === 'range'" class="space-y-2">
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <Label class="text-xs">Min</Label>
                    <Input
                      type="number"
                      :model-value="filterValues[filter.key]?.min"
                      @update:model-value="(value) => handleFilterChange(filter.key, { ...filterValues[filter.key], min: value })"
                      :min="filter.min"
                      :max="filter.max"
                    />
                  </div>
                  <div>
                    <Label class="text-xs">Max</Label>
                    <Input
                      type="number"
                      :model-value="filterValues[filter.key]?.max"
                      @update:model-value="(value) => handleFilterChange(filter.key, { ...filterValues[filter.key], max: value })"
                      :min="filter.min"
                      :max="filter.max"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 pt-4">
        <Button @click="applyFilters" class="flex-1" :disabled="isLoading">
          Appliquer
        </Button>
        <Button variant="outline" @click="resetFilters" :disabled="isLoading">
          Réinitialiser
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
