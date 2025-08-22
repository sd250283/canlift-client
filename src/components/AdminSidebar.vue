<template>
    <SidebarGroup>
        <SidebarGroupLabel>{{ title }}</SidebarGroupLabel>
        <SidebarMenu>
            <template v-for="item in items" :key="`${item.title}-${item.url}`">
                <!-- Simple Link Item -->
                <SidebarMenuLink 
                    v-if="!item.items" 
                    :item="item" 
                    :href="currentPath" 
                />
                
                <!-- Collapsed Dropdown -->
                <SidebarMenuCollapsedDropdown 
                    v-else-if="sidebarState === 'collapsed' && !isMobile" 
                    :item="item" 
                    :href="currentPath" 
                />
                
                <!-- Collapsible Menu -->
                <SidebarMenuCollapsible 
                    v-else 
                    :item="item" 
                    :href="currentPath" 
                />
            </template>
        </SidebarMenu>
    </SidebarGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Types
interface NavLink {
    title: string
    url: string
    icon?: any
    badge?: string | number
}

interface NavCollapsible extends NavLink {
    items: NavLink[]
}

type NavItem = NavLink | NavCollapsible

interface NavGroup {
    title: string
    items: NavItem[]
}

// Props
interface Props {
    title: string
    items: NavItem[]
}

const props = defineProps<Props>()

// Composables
const route = useRoute()
const { state: sidebarState, isMobile, setOpenMobile } = useSidebar()

// Computed
const currentPath = computed(() => route.fullPath)

// Utility function
function checkIsActive(href: string, item: NavItem, mainNav = false): boolean {
    return (
        href === item.url || 
        href.split('?')[0] === item.url || 
        !!(item as NavCollapsible)?.items?.filter((i) => i.url === href).length || 
        (mainNav &&
            href.split('/')[1] !== '' &&
            href.split('/')[1] === item?.url?.split('/')[1])
    )
}
</script>

<!-- NavBadge Component -->
<template>
    <Badge class="rounded-full px-1 py-0 text-xs">
        <slot />
    </Badge>
</template>

<script setup lang="ts">
// NavBadge is now a separate component or can be inline
</script>

<!-- SidebarMenuLink Component -->
<template>
    <SidebarMenuItem>
        <SidebarMenuButton
            :is-active="checkIsActive(href, item)"
            :tooltip="item.title"
            @click="setOpenMobile(false)"
        >
            <router-link :to="item.url" class="flex items-center gap-2 w-full">
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
                <Badge v-if="item.badge" class="rounded-full px-1 py-0 text-xs ml-auto">
                    {{ item.badge }}
                </Badge>
            </router-link>
        </SidebarMenuButton>
    </SidebarMenuItem>
</template>

<script setup lang="ts">
interface Props {
    item: NavLink
    href: string
}

defineProps<Props>()
</script>

<!-- SidebarMenuCollapsible Component -->
<template>
    <Collapsible
        :default-open="checkIsActive(href, item, true)"
        class="group/collapsible"
    >
        <SidebarMenuItem>
            <CollapsibleTrigger>
                <SidebarMenuButton :tooltip="item.title">
                    <component :is="item.icon" v-if="item.icon" />
                    <span>{{ item.title }}</span>
                    <Badge v-if="item.badge" class="rounded-full px-1 py-0 text-xs">
                        {{ item.badge }}
                    </Badge>
                    <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent class="CollapsibleContent">
                <SidebarMenuSub>
                    <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                        <SidebarMenuSubButton
                            :is-active="checkIsActive(href, subItem)"
                            @click="setOpenMobile(false)"
                        >
                            <router-link :to="subItem.url" class="flex items-center gap-2 w-full">
                                <component :is="subItem.icon" v-if="subItem.icon" />
                                <span>{{ subItem.title }}</span>
                                <Badge v-if="subItem.badge" class="rounded-full px-1 py-0 text-xs ml-auto">
                                    {{ subItem.badge }}
                                </Badge>
                            </router-link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
            </CollapsibleContent>
        </SidebarMenuItem>
    </Collapsible>
</template>

<script setup lang="ts">
interface Props {
    item: NavCollapsible
    href: string
}

defineProps<Props>()
</script>

<!-- SidebarMenuCollapsedDropdown Component -->
<template>
    <SidebarMenuItem>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <SidebarMenuButton
                    :tooltip="item.title"
                    :is-active="checkIsActive(href, item)"
                >
                    <component :is="item.icon" v-if="item.icon" />
                    <span>{{ item.title }}</span>
                    <Badge v-if="item.badge" class="rounded-full px-1 py-0 text-xs">
                        {{ item.badge }}
                    </Badge>
                    <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" :side-offset="4">
                <DropdownMenuLabel>
                    {{ item.title }} {{ item.badge ? `(${item.badge})` : '' }}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    v-for="sub in item.items"
                    :key="`${sub.title}-${sub.url}`"
                >
                    <router-link
                        :to="sub.url"
                        :class="[
                            'flex items-center gap-2 w-full',
                            checkIsActive(href, sub) ? 'bg-secondary' : ''
                        ]"
                    >
                        <component :is="sub.icon" v-if="sub.icon" />
                        <span class="max-w-52 text-wrap">{{ sub.title }}</span>
                        <span v-if="sub.badge" class="ml-auto text-xs">{{ sub.badge }}</span>
                    </router-link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </SidebarMenuItem>
</template>

<script setup lang="ts">
interface Props {
    item: NavCollapsible
    href: string
}

defineProps<Props>()
</script>