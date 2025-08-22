<template>
    <div class="card shadow">
        <div class="card-header bg-primary text-white">
            <span>
                Impact des événements
                <font-awesome-icon title="Visiteurs susceptibles d'être contactés pour ces évènements"
                                   class="me-2 text-white"
                                   :icon="['fas', 'info-circle']"
                                   size="xs"/>
            </span>
            <small class="ms-2">(Par défaut VG inclus et Brunch exclus dans l'export des contacts.)</small>
        </div>
        <div class="card-body" style="min-height: 50px;">
            <div class="card-text">
                <div class="d-flex justify-content-between flex-wrap mb-3">
                    <div v-for="option in eventTargets" :key="option.value" class="form-check form-check-inline">
                        <input 
                            class="form-check-input" 
                            type="radio" 
                            :id="'eventTarget_' + option.value"
                            :value="option.value"
                            v-model="simulation.eventTarget"
                            @change="updateEvent($event.target.value)"
                        />
                        <label class="form-check-label" :for="'eventTarget_' + option.value">
                            {{ option.text }}
                        </label>
                    </div>
                </div>

                <div class="d-flex justify-content-between flex-wrap">
                    <div v-for="option in options" :key="option.value" class="form-check form-check-inline">
                        <input 
                            class="form-check-input" 
                            type="checkbox" 
                            :id="'eventTargetOption_' + option.value"
                            :value="option.value"
                            v-model="simulation.eventTargetOptions"
                            @change="updateEventOptions(simulation.eventTargetOptions, true)"
                            :disabled="['brunch', 'guided_tour', 'upsell_rsto'].includes(simulation.eventTarget)"
                        />
                        <label class="form-check-label" :for="'eventTargetOption_' + option.value">
                            {{ option.text }}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {
    UPDATE_SIMULATION_ALL_AFFECTED_BY_EVENTS,
    UPDATE_SIMULATION_ELEVATORS_AFFECTED_BY_EVENTS,
    UPDATE_SIMULATION_STAIRS_AFFECTED_BY_EVENTS,
    UPDATE_SIMULATION_TOP_AFFECTED_BY_EVENTS,
    UPDATE_SIMULATION_GUIDED_TOUR_AFFECTED_BY_EVENTS,
    UPDATE_SIMULATION_GUIDED_TOUR_NOT_AFFECTED_BY_EVENTS,
    UPDATE_SIMULATION_BRUNCH_AFFECTED_BY_EVENTS,
    UPDATE_SIMULATION_BRUNCH_NOT_AFFECTED_BY_EVENTS,
    UPDATE_SIMULATION_UPSELL_RSTO_AFFECTED_BY_EVENTS,
    UPDATE_SIMULATION_UPSELL_RSTO_NOT_AFFECTED_BY_EVENTS
} from '../store/mutations.type';
import { mapGetters } from 'vuex';
import { EDIT_TARGET_EVENT } from '../store/action.type';

library.add(faPlusCircle);
library.add(faInfoCircle);

export default {
    name: 'EventTarget',
    data () {
        return {
            eventTargets: [
                { text: 'Ascenseur seul', value: 'elevator' },
                { text: 'Tous', value: 'elevator/stair' },
                { text: 'Escalier seul', value: 'stair' },
                { text: 'Sommet', value: 'top' },
                { text: 'Visites guidées', value: 'guided_tour' },
                { text: 'Brunch', value: 'brunch' },
                { text: 'Upsell Rsto', value: 'upsell_rsto' }
            ],
            options: [
                { text: 'Hors visites guidées', value: 'exclude_guided_tour' },
                { text: 'Hors brunch', value: 'exclude_brunch' },
                { text: 'Hors Upsell Rsto', value: 'exclude_upsell_rsto' }
            ]
        };
    },
    computed: {
        ...mapGetters(['simulationConfig', 'simulation'])
    },
    methods: {
        updateEvent (value) {
            switch (value) {
            case 'elevator':
                this.$store.commit(UPDATE_SIMULATION_ELEVATORS_AFFECTED_BY_EVENTS);
                break;
            case 'elevator/stair':
                this.$store.commit(UPDATE_SIMULATION_ALL_AFFECTED_BY_EVENTS);
                break;
            case 'stair':
                this.$store.commit(UPDATE_SIMULATION_STAIRS_AFFECTED_BY_EVENTS);
                break;
            case 'top':
                this.$store.commit(UPDATE_SIMULATION_TOP_AFFECTED_BY_EVENTS);
                break;
            case 'brunch':
                this.$store.commit(UPDATE_SIMULATION_BRUNCH_AFFECTED_BY_EVENTS);
                this.updateEventOptions(['no_guided_tour', 'no_brunch', 'no_upsell_rsto']);
                break;
            case 'upsell_rsto':
                this.$store.commit(UPDATE_SIMULATION_UPSELL_RSTO_AFFECTED_BY_EVENTS);
                this.updateEventOptions(['no_guided_tour', 'no_brunch', 'no_upsell_rsto']);
                break;
            case 'guided_tour':
                this.$store.commit(UPDATE_SIMULATION_GUIDED_TOUR_AFFECTED_BY_EVENTS);
                this.updateEventOptions(['no_guided_tour', 'no_brunch', 'no_upsell_rsto']);
                break;
            }

            this.$store.dispatch(EDIT_TARGET_EVENT, this.simulationConfig);
        },

        updateEventOptions (value, update) {
            this.$store.commit(UPDATE_SIMULATION_GUIDED_TOUR_NOT_AFFECTED_BY_EVENTS, value);
            this.$store.commit(UPDATE_SIMULATION_BRUNCH_NOT_AFFECTED_BY_EVENTS, value);
            this.$store.commit(UPDATE_SIMULATION_UPSELL_RSTO_NOT_AFFECTED_BY_EVENTS, value);

            if (update) {
                this.$store.dispatch(EDIT_TARGET_EVENT, this.simulationConfig);
            }
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
