<template>
  <div class="modal fade show" style="display: block" tabindex="-1" role="dialog" v-if="show">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Supprimer l'utilisateur</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <p>Êtes-vous sûr de vouloir supprimer l'utilisateur "{{ user.username }}" ?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Annuler</button>
          <button type="button" class="btn btn-danger" @click="confirm">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { UPDATE_USER_SHOW_POPUP } from '@/store/mutations.type'
import { DELETE_USER } from '@/store/action.type'

export default defineComponent({
  name: 'AdminUserDeleteConfirmationModal',
  setup() {
    const store = useStore()

    const show = computed(() => store.getters.getShowDeleteUserPopup)
    const user = computed(() => store.getters.getUser)

    const close = () => {
      store.commit(UPDATE_USER_SHOW_POPUP, [false, null])
    }

    const confirm = () => {
      store.dispatch(DELETE_USER).then(() => {
        close()
      })
    }

    return {
      show,
      user,
      close,
      confirm
    }
  }
})
</script>