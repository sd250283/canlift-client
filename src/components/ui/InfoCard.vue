<script setup lang="ts">
import { computed } from 'vue'
import { LucideIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface InfoItem {
  label: string
  value: string | number
  icon?: LucideIcon
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  highlight?: boolean
}

interface InfoCardProps {
  title: string
  description?: string
  items: InfoItem[]
  icon?: LucideIcon
  className?: string
  variant?: 'default' | 'compact' | 'highlighted'
}

const props = withDefaults(defineProps<InfoCardProps>(), {
  variant: 'default'
})

const cardClasses = computed(() => {
  return cn(
    'transition-all duration-200',
    {
      'hover:shadow-md': props.variant === 'default',
      'border-primary/20': props.variant === 'highlighted',
      'p-4': props.variant === 'compact'
    },
    props.className
  )
})

const headerClasses = computed(() => {
  return cn(
    {
      'pb-2': props.variant === 'compact',
      'pb-4': props.variant !== 'compact'
    }
  )
})
</script>

<template>
  <Card :class="cardClasses">
    <CardHeader :class="headerClasses">
      <CardTitle class="flex items-center gap-2">
        <component 
          v-if="icon" 
          :is="icon" 
          class="h-5 w-5 text-primary" 
        />
        {{ title }}
      </CardTitle>
      <p v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </p>
    </CardHeader>

    <CardContent :class="{ 'pt-0': variant === 'compact' }">
      <div class="space-y-3">
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="cn(
            'flex items-center justify-between py-2',
            {
              'border-b border-border/50': index < items.length - 1 && variant !== 'compact',
              'bg-primary/5 px-3 py-2 rounded-md': item.highlight,
              'py-1': variant === 'compact'
            }
          )"
        >
          <div class="flex items-center gap-2">
            <component 
              v-if="item.icon" 
              :is="item.icon" 
              class="h-4 w-4 text-muted-foreground" 
            />
            <span class="text-sm font-medium text-muted-foreground">
              {{ item.label }}
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <span 
              :class="cn(
                'font-semibold',
                {
                  'text-lg': item.highlight && variant !== 'compact',
                  'text-primary': item.highlight
                }
              )"
            >
              {{ item.value }}
            </span>
            <Badge 
              v-if="item.badge" 
              :variant="item.badge.variant || 'default'"
              class="text-xs"
            >
              {{ item.badge.text }}
            </Badge>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
