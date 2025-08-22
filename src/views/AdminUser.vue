<template>
  <div class="min-h-screen bg-background dark:bg-background text-foreground min-w-full overflow-x-hidden">
    <div class="w-full overflow-x-hidden bg-card text-card-foreground rounded-lg shadow-sm mx-2 p-3">
      <div class="w-full overflow-x-hidden">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-foreground dark:text-foreground">Gestion des utilisateurs</h1>
            <p class="text-gray-600 mt-1">Gérer les comptes utilisateurs et leurs permissions</p>
          </div>
          <Button @click="openCreateModal">
            <font-awesome-icon :icon="['fas', 'plus-circle']" size="lg" class="mr-2" />
            Nouvel utilisateur
          </Button>
        </div>

        <!-- Data Table -->
        <BasicDataTable
          :data="users"
          :columns="columns"
          :loading="loading"
          :items-per-page="15"
          :server-side="true"
          :total-items="pagination.totalItems"
          :current-page="pagination.currentPage"
          show-pagination
          hoverable
          class="shadow-sm"
          @page-change="handlePageChange"
          @sort-change="handleSortChange"
          @filter-change="handleFilterChange"
          @boolean-filter-change="handleBooleanFilterChange"
        >
          <template #cell-familyName="{ row }">
            {{ row.familyName }}
          </template>
          <template #cell-givenName="{ row }">
            {{ row.givenName }}
          </template>
          <template #cell-username="{ row }">
            {{ row.username }}
          </template>
          <template #cell-email="{ row }">
            {{ row.email }}
          </template>
          <template #cell-roles="{ row }">
            <div class="space-y-1">
              <label v-for="option in options" :key="option.value" class="flex items-center text-xs cursor-pointer">
                <Checkbox
                  :model-value="Array.isArray(row.roles) && row.roles.includes(option.value)"
                  @update:model-value="(checked: boolean) => toggleRole(row, option.value, checked)"
                  class="mr-1 size-5"
                />
                <span>{{ option.text }}</span>
              </label>
            </div>
          </template>
          <template #cell-enabled="{ row }">
            <div class="flex items-center justify-center">
              <span
                :class="`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                  row.enabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700'
                }`"
              >
                {{ row.enabled ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </template>
          <template #cell-lastLogin="{ value }">
            <div class="text-xs text-gray-500 flex items-center gap-1 min-w-[80px]">
              <Calendar class="h-3 w-3 hidden sm:block" />
              <span class="truncate">{{ value ? formatDateTime(value) : 'Jamais' }}</span>
            </div>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex items-center align-items-center">
              <Button
                @click="openEditModal(row)"
                variant="ghost"
                class="p-4 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors"
                title="Modifier"
              >
                <Pencil class="h-12 w-12" />
              </Button>
              <Button
                @click="deleteUser(row)"
                variant="ghost"
                class="p-4 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="Supprimer"
              >
                <Trash2 class="h-12 w-12" />
              </Button>
            </div>
          </template>
        </BasicDataTable>
      </div>
    </div>
    
    <AdminUserModal
      :show="modalShow"
      :user="currentUser"
      :is-edit-mode="isEditMode"
      @close="modalShow = false"
      @submit="submit"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Trash2, Calendar, Pencil } from 'lucide-vue-next'
import { BasicDataTable, type DataTableColumn } from '@/components/ui/data-table'
import AdminUserModal from '@/components/AdminUserModal.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FETCH_USERS, EDIT_USER, POST_USER } from '@/store/action.type'
import { UPDATE_USER_SHOW_POPUP, RESET_USER } from '@/store/mutations.type'
import moment from 'moment'
import type { User } from '@/models/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusCircle)

export default defineComponent({
  name: 'AdminUser',
  components: {
    BasicDataTable,
    AdminUserModal,
    Trash2, Calendar, Pencil,
    Button,
    Checkbox
  },
  setup() {
    const store = useStore()
    const modalShow = ref(false)
    const loading = ref(false)
    const isEditMode = ref(false)
    const currentUser = ref<Partial<User>>({})
    const itemsPerPage = ref(15)

    const options = [
      { text: 'Admin', value: 'ROLE_ADMIN' },
      { text: 'Manager', value: 'ROLE_MANAGER' }
    ]

    const columns: DataTableColumn[] = [
      { key: 'familyName', header: 'Nom', sortable: true, filterable: true },
      { key: 'givenName', header: 'Prénom', sortable: true, filterable: true },
      { key: 'username', header: 'Nom d\'utilisateur', sortable: true, filterable: true },
      { key: 'email', header: 'Email', sortable: true, filterable: true },
      { key: 'roles', header: 'Rôles' },
      { key: 'enabled', header: 'Actif', sortable: true, filterable: true, type: 'boolean' },
      { key: 'lastLogin', header: 'Dernière connexion', sortable: true },
      { key: 'actions', header: 'Actions', width: '80px' }
    ]

    const fetchData = async (page = 1) => {
      loading.value = true
      try {
        await store.dispatch(FETCH_USERS, { page, itemsPerPage: itemsPerPage.value })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchData(1)
    })

    const users = computed(() => {
      const allUsers = store.getters.users
      return Array.isArray(allUsers) ? allUsers : []
    })

    const pagination = computed(() => store.getters.userPagination)

    // Standard page change handler for server-side pagination
    const handlePageChange = (page: number) => {
      fetchData(page)
    }

    // Server-side sorting handler
    const handleSortChange = (column: string, direction: 'asc' | 'desc' | null) => {
      console.log('Sort change:', column, direction)
      // TODO: Implement server-side sorting in store action
      // fetchData(pagination.value.currentPage, { sortBy: column, sortOrder: direction })
    }

    // Server-side text filtering handler
    const handleFilterChange = (filters: Record<string, string>) => {
      console.log('Filter change:', filters)
      // TODO: Implement server-side filtering in store action
      // fetchData(pagination.value.currentPage, { filters })
    }

    // Server-side boolean filtering handler
    const handleBooleanFilterChange = (filters: Record<string, boolean | null>) => {
      console.log('Boolean filter change:', filters)
      // TODO: Implement server-side boolean filtering in store action
      // fetchData(pagination.value.currentPage, { booleanFilters: filters })
    }

    const openCreateModal = () => {
      store.commit(RESET_USER)
      currentUser.value = store.getters.getUser
      isEditMode.value = false
      modalShow.value = true
    }

    const openEditModal = (user: User) => {
      currentUser.value = { ...user }
      isEditMode.value = true
      modalShow.value = true
    }

    const submit = async (userToSubmit: User) => {
      if (isEditMode.value) {
        await store.dispatch(EDIT_USER, userToSubmit)
      } else {
        store.commit('UPDATE_USER_IN_FORM', userToSubmit)
        await store.dispatch(POST_USER)
      }
      modalShow.value = false
    }

    const deleteUser = (user: any) => {
      store.commit(UPDATE_USER_SHOW_POPUP, [true, user])
    }

    const updateEnabled = async (id: number, value: boolean) => {
      await store.dispatch(EDIT_USER, { id, enabled: value })
    }

    const toggleRole = async (user: any, role: string, checked: boolean) => {
      const roles = Array.isArray(user.roles) ? user.roles : []
      const newRoles = checked
        ? [...roles, role]
        : roles.filter((r: string) => r !== role)
      await store.dispatch(EDIT_USER, { id: user.id, roles: newRoles })
    }

    const formatDateTime = (value: string) => {
      return moment.utc(value).format('DD/MM/YYYY HH:mm')
    }

    return {
      modalShow,
      loading,
      itemsPerPage,
      columns,
      options,
      users,
      pagination,
      currentUser,
      isEditMode,
      handlePageChange,
      openCreateModal,
      openEditModal,
      submit,
      deleteUser,
      updateEnabled,
      toggleRole,
      formatDateTime
    }
  }
})
</script>
