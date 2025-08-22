<template>
  <div class="modal fade show" style="display: block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Supprimer l'ascenseur</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <p>Êtes-vous sûr de vouloir supprimer l'ascenseur "{{ elevator.name }}" ?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Annuler</button>
          <button type="button" class="btn btn-danger" @click="$emit('confirm')">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { Elevator } from '@/models/Elevator'

export default defineComponent({
  name: 'AdminElevatorDeleteConfirmationModal',
  props: {
    elevator: {
      type: Object as PropType<Elevator>,
      required: true
    }
  }
})
</script>
