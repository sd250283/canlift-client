<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="closeModal"
  >
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"></div>
      <div class="relative bg-white dark:bg-card rounded-2xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Création d'un utilisateur</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              v-model="editableUser.familyName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              v-model="editableUser.givenName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input
              v-model="editableUser.username"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="editableUser.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rôles</label>
            <div class="space-y-2">
              <label v-for="option in options" :key="option.value" class="flex items-center">
                <Checkbox
                  :model-value="Array.isArray(editableUser.roles) && editableUser.roles.includes(option.value)"
                  @update:model-value="(checked: boolean) => toggleRole(option.value, checked)"
                  class="h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700">{{ option.text }}</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="flex items-center">
              <Checkbox
                :model-value="!!editableUser.enabled"
                @update:model-value="(checked: boolean) => { editableUser.enabled = checked }"
                class="h-4 w-4"
              />
              <span class="ml-2 text-sm text-gray-700">Compte activé</span>
            </label>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType } from 'vue'
import { X } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'
import type { User } from '@/models/index'

export default defineComponent({
  name: 'AdminUserModal',
  components: { X, Checkbox },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object as PropType<Partial<User>>,
      required: true,
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const editableUser = ref<Partial<User>>({})

    watch(() => props.user, (newUser) => {
      editableUser.value = { ...newUser, roles: Array.isArray(newUser.roles) ? [...newUser.roles] : [] }
    }, { immediate: true, deep: true })

    const options = [
      { text: 'Admin', value: 'ROLE_ADMIN' },
      { text: 'Manager', value: 'ROLE_MANAGER' },
    ]

    const closeModal = () => {
      emit('close')
    }

    const submitForm = () => {
      emit('submit', editableUser.value)
    }

    const toggleRole = (role: string, checked: boolean) => {
      if (!Array.isArray(editableUser.value.roles)) {
        editableUser.value.roles = []
      }
      if (checked) {
        if (!editableUser.value.roles.includes(role)) {
          editableUser.value.roles.push(role)
        }
      } else {
        const index = editableUser.value.roles.indexOf(role)
        if (index !== -1) {
          editableUser.value.roles.splice(index, 1)
        }
      }
    }

    return {
      editableUser,
      options,
      closeModal,
      submitForm,
      toggleRole,
    }
  },
})
</script>
