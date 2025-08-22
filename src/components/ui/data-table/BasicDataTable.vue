<template>
  <div
    :class="cn(
      'w-full max-w-full bg-background mt-2 rounded-2xl overflow-hidden',
      bordered && 'border border-gray-200',
      className
    )"
  >
    <!-- Search and Filters -->
    <!-- <div
      v-if="searchable"
      class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-gray-200"
    >
      <div class="relative w-full sm:w-auto sm:flex-1 sm:max-w-sm">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          :placeholder="searchPlaceholder"
          v-model="search"
          @input="currentPage = 1"
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-2xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div> -->

    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse p-6">
      <!-- Search skeleton -->
      <div v-if="searchable" class="mb-6 h-11 bg-gray-200 rounded-2xl"></div>
      <!-- Table skeleton -->
      <div class="border border-gray-200 overflow-hidden">
        <div class="bg-gray-100 h-14"></div>
        <div
          v-for="i in 5"
          :key="i"
          class="h-14 border-t border-gray-200 bg-white"
        ></div>
      </div>
      <!-- Pagination skeleton -->
      <div class="mt-6 flex justify-between items-center">
        <div class="h-4 bg-gray-200 rounded w-48"></div>
        <div class="flex gap-2">
          <div class="h-9 w-20 bg-gray-200 rounded-2xl"></div>
          <div class="h-9 w-9 bg-gray-200 rounded-2xl"></div>
          <div class="h-9 w-9 bg-gray-200 rounded-2xl"></div>
          <div class="h-9 w-16 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div
      v-else
      :class="cn(
        'w-full overflow-x-auto overflow-hidden bg-gray-50',
        'max-w-full',
        // searchable ? 'rounded-b-2xl' : 'rounded-2xl'
      )"
      style="scroll-behavior: smooth; scrollbar-width: thin;"
    >
      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-w-full min-w-full">
        <table class="w-full min-w-full table-auto">
          <thead class="bg-gray-100">
            <tr>
              <th
                v-for="column in columns"
                :key="String(column.key)"
                :class="cn(
                  'text-left font-medium text-gray-600 bg-gray-100 min-w-0',
                  compact ? 'px-2 py-2 text-xs' : 'px-3 py-3 sm:px-6 sm:py-4',
                  column.sortable &&
                    'cursor-pointer hover:bg-gray-200 transition-colors',
                  column.width && `w-[${column.width}]`,
                  column.responsiveClasses
                )"
                :style="column.width ? { width: column.width } : undefined"
                @click="column.sortable && handleSort(String(column.key))"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1 sm:gap-2">
                    <span class="text-2xl sm:text-base font-semibold truncate">
                      {{ column.header }}
                    </span>
                    <div v-if="column.sortable" class="flex flex-col">
                      <ChevronUp
                        :class="cn(
                          'h-3 w-3',
                          sortConfig.key === column.key &&
                            sortConfig.direction === 'asc'
                            ? 'text-blue-600'
                            : 'text-gray-300'
                        )"
                      />
                      <ChevronDown
                        :class="cn(
                          'h-3 w-3 -mt-1',
                          sortConfig.key === column.key &&
                            sortConfig.direction === 'desc'
                            ? 'text-blue-600'
                            : 'text-gray-300'
                        )"
                      />
                    </div>
                  </div>
                  <div v-if="column.filterable" class="relative">
                    <Filter class="h-3 w-3 text-gray-400" />
                  </div>
                </div>
                <!-- Column Filter -->
                <div v-if="column.filterable" class="mt-3 relative">
                  <!-- Text Filter -->
                  <div v-if="!column.type || column.type === 'text'">
                    <input
                      type="text"
                      placeholder="Filter..."
                      :value="columnFilters[String(column.key)] || ''"
                      @input="handleColumnFilter(String(column.key), ($event.target as HTMLInputElement).value)"
                      @click="$event.stopPropagation()"
                      class="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      v-if="columnFilters[String(column.key)]"
                      @click="clearColumnFilter(String(column.key)); $event.stopPropagation()"
                      class="absolute right-2 top-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <!-- Boolean Filter -->
                  <div v-else-if="column.type === 'boolean'" class="flex items-center justify-center">
                    <div class="relative group">
                      <Switch
                        :model-value="booleanFilters[String(column.key)] === true"
                        @update:model-value="() => cycleBooleanFilter(String(column.key))"
                        @click="$event.stopPropagation()"
                        class="scale-95"
                        :title="booleanFilters[String(column.key)] === true ? 'Showing only TRUE (click to show all)' : 'Show all (click to filter TRUE only)'"
                      />
                      <div class="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <!-- {{ booleanFilters[String(column.key)] === true ? 'True only' : 'All' }} -->
                      </div>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <!-- Empty State -->
            <tr v-if="paginatedData.length === 0">
              <td
                :colspan="columns.length"
                :class="cn(
                  'text-center text-gray-500 bg-white',
                  compact ? 'px-4 py-12' : 'px-6 py-16'
                )"
              >
                <div class="flex flex-col items-center space-y-2">
                  <div class="text-4xl">📊</div>
                  <div class="font-medium">{{ emptyMessage }}</div>
                </div>
              </td>
            </tr>
            <!-- Data Rows -->
            <tr
              v-else
              v-for="(row, index) in paginatedData"
              :key="index"
              :class="cn(
                'border-t border-gray-200 bg-white transition-colors',
                striped && index % 2 === 0 && 'bg-gray-50',
                hoverable && 'hover:bg-gray-100',
                onRowClick && 'cursor-pointer'
              )"
              @click="onRowClick?.(row, index)"
            >
              <td
                v-for="column in columns"
                :key="String(column.key)"
                :class="cn(
                  'text-sm text-gray-900 min-w-0 break-words',
                  compact ? 'px-2 py-2 text-xs' : 'px-3 py-3 sm:px-6 sm:py-4',
                  column.responsiveClasses
                )"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  <!-- Fallback to default rendering if no slot is provided -->
                  {{ String(row[column.key] ?? '') }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="showPagination && totalPages > 1"
      class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-t border-gray-200"
    >
      <div class="text-sm text-gray-500 order-2 sm:order-1">
        <template v-if="serverSide || bufferedServerSide">
          <template v-if="paginatedData.length > 0">
            Afficher {{ (currentPage - 1) * props.itemsPerPage + 1 }} à
            {{ Math.min((currentPage - 1) * props.itemsPerPage + paginatedData.length, totalItemsCount) }} résultats sur
            {{ totalItemsCount }}
          </template>
          <template v-else>
            Aucun résultat
          </template>
        </template>
        <template v-else>
          <template v-if="paginatedData.length > 0">
            Afficher {{ (currentPage - 1) * props.itemsPerPage + 1 }} à
            {{ Math.min(currentPage * props.itemsPerPage, totalItemsCount) }} résultats sur
            {{ totalItemsCount }}
          </template>
          <template v-else>
            Aucun résultat
          </template>
        </template>
      </div>
      <div class="flex items-center gap-2 order-1 sm:order-2">
        <Button
          @click="handlePageChange(Math.max(currentPage - 1, 1))"
          :disabled="currentPage === 1 || props.loading"
          variant="outline"
          size="sm"
          class="px-3 py-2 text-sm"
        >
          Précédent
        </Button>
        <div class="hidden sm:flex items-center gap-1">
          <Button
            v-for="pageNumber in visiblePages"
            :key="pageNumber"
            @click="handlePageChange(pageNumber)"
            :disabled="props.loading"
            :variant="currentPage === pageNumber ? 'default' : 'outline'"
            size="sm"
            class="px-3 py-2 text-sm"
          >
            {{ pageNumber }}
          </Button>
        </div>
        <Button
          @click="handlePageChange(Math.min(currentPage + 1, totalPages))"
          :disabled="currentPage === totalPages || props.loading"
          variant="outline"
          size="sm"
          class="px-3 py-2 text-sm"
        >
          Suivant
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-vue-next'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface DataTableColumn {
  key: string
  header: string
  sortable?: boolean
  filterable?: boolean
  type?: 'text' | 'boolean' // NEW: Column type for different filter types
  render?: any // Vue component for custom rendering
  width?: string
  responsiveClasses?: string
}

export interface DataTableProps {
  data: Record<string, any>[]
  columns: DataTableColumn[]
  className?: string
  searchable?: boolean
  searchPlaceholder?: string
  itemsPerPage?: number
  showPagination?: boolean
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: Record<string, any>, index: number) => void
  // Server-side pagination props
  serverSide?: boolean
  totalItems?: number
  currentPage?: number
  // NEW: Intelligent caching props
  bufferedServerSide?: boolean
  cacheData?: Record<string, any>[]
  apiItemsPerPage?: number
}

const props = withDefaults(defineProps<DataTableProps>(), {
  searchable: true,
  searchPlaceholder: 'Search...',
  itemsPerPage: 10,
  showPagination: true,
  striped: false,
  hoverable: true,
  bordered: true,
  compact: false,
  loading: false,
  emptyMessage: 'No data available',
  serverSide: false,
  totalItems: 0,
  currentPage: 1,
  bufferedServerSide: false,
  cacheData: () => [],
  apiItemsPerPage: 30
})

// Define emits for server-side pagination and column filters
const emit = defineEmits<{
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
  'need-data': [page: number] // NEW: Emit when cache needs refresh
  'sort-change': [sortConfig: { key: string; direction: 'asc' | 'desc' }] // NEW: Emit for server-side sorting
  'filter-change': [filters: Record<string, string>] // NEW: Emit for server-side filtering
  'boolean-filter-change': [key: string, value: boolean | null] // NEW: Emit for boolean filters
}>()

// Reactive state
const search = ref('')
const sortConfig = ref<{
  key: string | null
  direction: 'asc' | 'desc'
}>({ key: null, direction: 'asc' })
const currentPage = ref(props.currentPage)
const columnFilters = ref<Record<string, string>>({})
const booleanFilters = ref<Record<string, boolean | null>>({}) // NEW: Boolean filters state

// Watch for external currentPage changes (server-side pagination)
watch(() => props.currentPage, (newPage) => {
  currentPage.value = newPage
})

// For server-side pagination, use the data as-is and calculate pages from totalItems
const filteredData = computed(() => {
//   if (props.serverSide || props.bufferedServerSide) {
//     return props.data // Server handles filtering
//   }
  
  let filtered = [...props.data]

  // Global search (client-side only)
  if (search.value) {
    filtered = filtered.filter((row) =>
      props.columns.some((column) => {
        const value = row[column.key]
        return value?.toString().toLowerCase().includes(search.value.toLowerCase())
      })
    )
  }

  // Column filters (client-side only)
  Object.entries(columnFilters.value).forEach(([key, value]) => {
    if (value) {
      filtered = filtered.filter((row) => {
        const rowValue = row[key]
        return rowValue
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      })
    }
  })

  // Boolean filters (client-side only)
  Object.entries(booleanFilters.value).forEach(([key, value]) => {
    if (value === true) { // Only filter when true, null means show all
      filtered = filtered.filter((row) => {
        return !!row[key] === true
      })
    }
  })

  return filtered
})

// Sort data
const sortedData = computed(() => {
  if (props.serverSide || props.bufferedServerSide) {
    return filteredData.value // Server handles sorting
  }
  
  if (!sortConfig.value.key) return filteredData.value

  return [...filteredData.value].sort((a, b) => {
    const aValue = a[sortConfig.value.key!]
    const bValue = b[sortConfig.value.key!]

    if (aValue < bValue) {
      return sortConfig.value.direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.value.direction === 'asc' ? 1 : -1
    }
    return 0
  })
})

// Pagination
const paginatedData = computed(() => {
  if (props.serverSide || props.bufferedServerSide) {
    return sortedData.value // Server/cache handles pagination
  }
  
  if (!props.showPagination) return sortedData.value

  const startIndex = (currentPage.value - 1) * props.itemsPerPage
  return sortedData.value.slice(startIndex, startIndex + props.itemsPerPage)
})

const totalPages = computed(() => {
  if (props.serverSide || props.bufferedServerSide) {
    return Math.ceil(props.totalItems / props.itemsPerPage)
  }
  return Math.ceil(sortedData.value.length / props.itemsPerPage)
})

const totalItemsCount = computed(() => {
  if (props.serverSide || props.bufferedServerSide) {
    return props.totalItems
  }
  return sortedData.value.length
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, Math.min(currentPage.value - 2, totalPages.value - 4))
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const handleSort = (key: string) => {
  const newDirection = sortConfig.value.key === key && sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  sortConfig.value = {
    key,
    direction: newDirection
  }
  
  // Emit sort change for server-side handling
  if (props.serverSide || props.bufferedServerSide) {
    emit('sort-change', { key, direction: newDirection })
  }
}

const handleColumnFilter = (key: string, value: string) => {
  columnFilters.value = {
    ...columnFilters.value,
    [key]: value
  }
  if (!props.serverSide && !props.bufferedServerSide) {
    currentPage.value = 1
  } else {
    // Emit filter change for server-side handling
    emit('filter-change', columnFilters.value)
  }
}

const handleBooleanFilter = (key: string, value: boolean | null) => {
  // Two-state logic: null = no filter (all), true = show only true
  booleanFilters.value = {
    ...booleanFilters.value,
    [key]: value
  }
  if (!props.serverSide && !props.bufferedServerSide) {
    currentPage.value = 1
  } else {
    // Emit boolean filter change for server-side handling
    emit('boolean-filter-change', key, value)
  }
}

const cycleBooleanFilter = (key: string) => {
  const currentValue = booleanFilters.value[key]
  let newValue: boolean | null
  
  // Cycle through: null -> true -> null (removed false state)
  if (currentValue === null || currentValue === undefined) {
    newValue = true
  } else {
    newValue = null
  }
  
  handleBooleanFilter(key, newValue)
}

const clearColumnFilter = (key: string) => {
  const newFilters = { ...columnFilters.value }
  delete newFilters[key]
  columnFilters.value = newFilters
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  
  if (props.bufferedServerSide) {
    // For buffered server-side, check if we need new data
    const apiItemsPerPage = props.apiItemsPerPage || 30
    const tableItemsPerPage = props.itemsPerPage
    const requiredApiPage = Math.ceil((page * tableItemsPerPage) / apiItemsPerPage)
    
    // Emit need-data if we need a new API page
    emit('need-data', page)
  } else if (props.serverSide) {
    emit('page-change', page)
  }
}

// Reset page when search changes (client-side only)
watch(search, () => {
  if (!props.serverSide && !props.bufferedServerSide) {
    currentPage.value = 1
  }
})
</script>
