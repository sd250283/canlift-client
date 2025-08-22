<template>
    <div class="modal fade" :class="{ 'show d-block': showDeletePopup }" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirmation</h5>
                    <button type="button" class="btn-close" @click="showDeletePopup = false"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0">
                        Confirmez-vous la suppression de l'événement ?
                    </p>
                </div>
                <div class="modal-footer">
                    <a class="btn btn-link text-secondary" @click="showDeletePopup = false">Annuler</a>
                    <button class="btn btn-secondary rounded-pill text-nowrap" @click="submit()">Valider</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { DELETE_SIMULATION_EVENT_SHOW_POPUP } from '../store/mutations.type';
import { mapGetters } from 'vuex';
import { FETCH_SIMULATION, DELETE_SIMULATION_EVENT } from '../store/action.type';

export default {
    name: 'SimulationEventDeleteConfirmationModal',
    computed: {
        showDeletePopup: {
            get () {
                return this.$store.getters['getShowDeletePopup'];
            },
            set (data) {
                this.$store.commit(DELETE_SIMULATION_EVENT_SHOW_POPUP, [data, this.event]);
            }
        },
        ...mapGetters({
            event: 'getEvent',
            simulationConfig: 'simulationConfig'
        })
    },
    methods: {
        async submit () {
            await this.$store.dispatch(DELETE_SIMULATION_EVENT, this.event);
            await this.$store.dispatch(FETCH_SIMULATION, this.simulationConfig);
        }
    }
};
</script>

<style scoped>

</style>
