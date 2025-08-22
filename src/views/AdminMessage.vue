<template>
  <div class="w-full min-h-full bg-background dark:bg-background-header text-foreground">
    <div class="w-full p-6">
      <div class="bg-card w-full text-card-foreground rounded-lg border shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-foreground">Gestion des Messages</h1>
          <Button @click="modalShow = !modalShow">
            <font-awesome-icon :icon="['fas', 'plus-circle']" size="lg" class="mr-2" />
            Ajouter un message
          </Button>
        </div>
        <div class="w-full overflow-hidden">
          <AppTable :columns="columns" :data="messages" class="w-full">
            <template v-slot:name="{ row, index }">
              <Input 
                class="w-full p-2 font-medium text-foreground" 
                :modelValue="row.name" 
                @update:modelValue="(value: string | number) => updateField(index, 'name', value)"
                @update:saved="(isSaved: boolean) => handleSavedChange(index, isSaved, 'name')"
                type="text"
              />
            </template>
            <template v-slot:content="{ row, index }">
              <textarea 
                class="w-full p-2 font-medium text-foreground bg-transparent border rounded-md" 
                :value="row.content" 
                @input="updateField(index, 'content', ($event.target as HTMLTextAreaElement).value)"
                @blur="handleSavedChange(index, false, 'content')"
              ></textarea>
            </template>
            <template v-slot:actions="{ row }">
              <Button variant="ghost" size="icon" @click="deleteMessage(row)">
                <font-awesome-icon :icon="['fas', 'trash-alt']" />
              </Button>
            </template>
          </AppTable>
        </div>
      </div>
    </div>

    <!-- Keep old modal but hide it with d-none and control with modalShow -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': modalShow, 'd-none': !modalShow }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Création d'un message</h5>
            <button type="button" class="btn-close" @click="modalShow = false"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="row mb-3">
                <label class="col-lg-6 col-form-label">Nom</label>
                <div class="col-lg-4">
                  <input class="form-control" style="width: 160%" v-model="newMessage.name" />
                </div>
              </div>
              <div class="row mb-3">
                <label class="col-lg-6 col-form-label">Contenu</label>
                <div class="col-lg-4">
                  <textarea class="form-control" style="width: 160%" v-model="newMessage.content"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <a class="btn btn-link text-secondary" @click="modalShow = false; reset()">Annuler</a>
            <button class="btn btn-secondary rounded-pill text-nowrap" @click="submit()">Valider</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppTable from '@/components/ui/table/AppTable.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FETCH_MESSAGE_MODEL, EDIT_MESSAGE_MODELS, POST_MESSAGE_MODEL, DELETE_MESSAGE_MODEL } from '@/store/action.type'
import { RESET_MESSAGE } from '@/store/mutations.type'
import { MessageModelService } from '@/common/api.service'
import type { IMessageModel } from '@/models/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faTrashAlt, faPlusCircle)

export default defineComponent({
  name: 'AdminMessage',
  components: {
    AppTable,
    Input,
    Button,
  },
  setup() {
    const store = useStore()
    const modalShow = ref(false)
    const changedMessages = ref<Map<string, { message: IMessageModel, field: keyof IMessageModel, newValue: any }>>(new Map())

    const columns = [
      { key: 'name', label: 'Nom', width: 'w-1/4' },
      { key: 'content', label: 'Contenu', width: 'w-1/2' },
      { key: 'actions', label: 'Actions', width: 'w-1/4' }
    ]

    onMounted(() => {
      store.dispatch(FETCH_MESSAGE_MODEL)
    })

    const messages = computed(() => store.getters.getMessageModels)
    const newMessage = computed(() => store.getters.getMessageModel)

    const reset = () => {
      store.commit(RESET_MESSAGE)
    }

    const submit = () => {
      modalShow.value = false
      store.dispatch(POST_MESSAGE_MODEL)
    }

    const deleteMessage = (message: IMessageModel) => {
      store.dispatch(DELETE_MESSAGE_MODEL, message)
    }

    const updateField = (index: number, field: keyof IMessageModel, value: any) => {
      const message = messages.value[index]
      if (message) {
        const changeKey = `${message.id}-${field}`
        changedMessages.value.set(changeKey, { message, field, newValue: value })
      }
    }

    const handleSavedChange = async (index: number, isSaved: boolean, field: keyof IMessageModel) => {
      const message = messages.value[index]
      const changeKey = `${message.id}-${field}`
      
      if (isSaved) {
        changedMessages.value.delete(changeKey)
        return
      }

      const changeData = changedMessages.value.get(changeKey)
      if (changeData) {
        try {
          const { message, field, newValue } = changeData
          await MessageModelService.update(message.id!, { [field]: newValue })
          
          const updatedMessage = { ...message, [field]: newValue }
          await store.dispatch(EDIT_MESSAGE_MODELS, updatedMessage)
          
          changedMessages.value.delete(changeKey)
        } catch (error) {
          process.env.NODE_ENV === 'development' && console.error(`[AdminMessage] FAILED to save message change:`, error)
        }
      }
    }

    return {
      modalShow,
      columns,
      messages,
      newMessage,
      reset,
      submit,
      deleteMessage,
      updateField,
      handleSavedChange,
    }
  }
})
</script>

