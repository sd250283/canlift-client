<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next"
import { Calendar, Home, Users, Building, AtSign, Settings, Clock, UserCheck, Blocks, Package } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const items = [
  {
    title: "Ascenseurs",
    url: "/admin/elevators",
    icon: Building,
    disabled: false,
  },
  {
    title: "Utilisateurs",
    url: "/admin/users", 
    icon: Users,
    disabled: false,
  },
  {
    title: "Destinataires",
    url: "/admin/recipients",
    icon: UserCheck,
    disabled: false,
  },
  {
    title: "Produits",
    url: "/admin/products",
    icon: Blocks,
    disabled: false,
    items: [
      {
        title: "Produits Parent",
        url: "/admin/products",
        icon: Blocks,
        disabled: false,
      },
      {
        title: "Produits Enfant",
        url: "/admin/product-details",
        icon: Package,
        disabled: false,
      },
    ],
  },
  {
    title: "Brevo",
    url: "/admin/messages",
    icon: AtSign,
    disabled: false,
    items: [
      {
        title: "Messages",
        url: "/admin/brevo/messages",
        icon: AtSign,
        disabled: true,
      },
      {
        title: "Modèles",
        url: "/admin/brevo/templates",
        icon: Calendar,
        disabled: true,
      },
    ],
  },
];
</script>

<template>
  <Sidebar variant='floating'>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Admin Interface</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <!-- Simple menu item without subitems -->
              <template v-if="!item.items">
                <SidebarMenuButton 
                  :asChild="!item.disabled"
                  :class="{
                    'text-gray-400 cursor-not-allowed': item.disabled,
                    'hover:text-gray-300': item.disabled
                  }"
                  :title="item.disabled ? 'Soon available' : ''"
                >
                  <router-link 
                    v-if="!item.disabled"
                    :to="item.url"
                    class="flex items-center gap-2 w-full h-full py-2 px-3"
                  >
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </router-link>
                  <div 
                    v-else
                    class="flex items-center gap-2 w-full h-full py-2 px-3"
                  >
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </div>
                </SidebarMenuButton>
              </template>
              
              <!-- Collapsible menu item with subitems -->
              <template v-else>
                <Collapsible asChild class="group/collapsible">
                  <div>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        :class="{
                          'text-gray-400 cursor-not-allowed': item.disabled,
                          'hover:text-gray-300': item.disabled
                        }"
                        :title="item.disabled ? 'Soon available' : ''"
                        :disabled="item.disabled"
                        class="w-full py-2 px-3"
                      >
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                        <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                          <SidebarMenuSubButton 
                            :asChild="!subItem.disabled"
                            :class="{
                              'text-gray-400 cursor-not-allowed': subItem.disabled,
                              'hover:text-gray-300': subItem.disabled
                            }"
                            :title="subItem.disabled ? 'Soon available' : ''"
                          >
                            <router-link 
                              v-if="!subItem.disabled"
                              :to="subItem.url"
                              class="flex items-center gap-2 w-full h-full py-2 px-3"
                            >
                              <component :is="subItem.icon" />
                              <span>{{ subItem.title }}</span>
                            </router-link>
                            <div 
                              v-else
                              class="flex items-center gap-2 w-full h-full py-2 px-3"
                            >
                              <component :is="subItem.icon" />
                              <span>{{ subItem.title }}</span>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </template>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>