<template>
  <div class="w-full overflow-auto">
    <div v-if="!data || data.length === 0" class="no-data p-4 text-center text-muted-foreground">
      No data available
    </div>
    <div v-else class="rounded-lg border border-border overflow-hidden bg-card shadow-sm">
      <table class="w-full table-fixed border-collapse bg-card text-card-foreground">
        <thead>
          <tr class="bg-muted dark:bg-muted">
            <th 
              v-for="column in columns" 
              :key="column.key" 
              :class="[
                'border-r border-border px-4 py-3 text-left font-medium text-muted-foreground last:border-r-0',
                column.width || 'w-auto'
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index" class="hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors border-t border-border">
            <td 
              v-for="column in columns" 
              :key="column.key" 
              :class="[
                'border-r border-border px-4 py-3 last:border-r-0',
                column.width || 'w-auto'
              ]"
            >
              <slot :name="column.key" :row="row" :index="index">
                {{ getNestedProperty(row, column.key) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Column {
  key: string
  label: string
  width?: string
}

export default defineComponent({
  name: 'AppTable',
  props: {
    columns: {
      type: Array as PropType<Column[]>,
      required: true
    },
    data: {
      type: Array as PropType<any[]>,
      required: true
    }
  },
  setup() {
    const getNestedProperty = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    return {
      getNestedProperty
    }
  }
})
</script>

<style scoped>
/* Table takes full width of its container */
</style>
