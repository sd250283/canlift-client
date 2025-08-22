<template>
    <div class="modal fade" :class="{ 'show d-block': showSimulationDeletePopup }" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirmation</h5>
                    <button type="button" class="btn-close" @click="showSimulationDeletePopup = false"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0">
                        Confirmez-vous la réinitialisation de la simulation ?
                    </p>
                </div>
                <div class="modal-footer">
                    <a class="btn btn-link text-secondary" @click="showSimulationDeletePopup = false">Annuler</a>
                    <button class="btn btn-secondary rounded-pill text-nowrap" @click="submit()">Valider</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { DELETE_SIMULATION_SHOW_POPUP, RESET_SIMULATION_EVENT } from '../store/mutations.type';
import { DELETE_SIMULATION, RESET_SIMULATION_CONFIG } from '../store/action.type';

export default {
    name: 'SimulationDeleteConfirmationModal',
    computed: {
        showSimulationDeletePopup: {
            get () {
                return this.$store.getters['getShowSimulationDeletePopup'];
            },
            set (data) {
                this.$store.commit(DELETE_SIMULATION_SHOW_POPUP, data);
            }
        }
    },
    methods: {
        async submit () {
            await this.$store.dispatch(DELETE_SIMULATION);
            await this.$store.dispatch(RESET_SIMULATION_CONFIG);
            await this.$store.commit(RESET_SIMULATION_EVENT);
        }
    }
};
</script>

<style scoped>

</style>
