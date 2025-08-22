<template>
    <div class="col-6 offset-3 d-flex flex-row justify-content-between">
        <div class="d-flex flex-row"><div id="redZoneLegend"></div><div class="mt-2 ps-2">Zone rouge</div></div>
        <div class="d-flex flex-row"><div id="wVisitorsLegend"></div><div class="mt-2 ps-2">Visiteurs en attente</div></div>
        <div class="d-flex flex-row"><div id="actionZoneLegend"></div><div class="mt-2 ps-2">Zone verte</div></div>
        <div class="d-flex flex-row"><div id="limitLegend"></div><div class="mt-2 ps-2">Seuil</div></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SimulationChartLegend'
});
</script>

<style scoped>
#redZoneLegend{
    height: 2.5rem;
    width: 2.5rem;
    background-color: rgba(239, 223, 223, 0.8);
}
#wVisitorsLegend{
    height: 2.5rem;
    width: 0.6rem;
    background-color: #A94442;
}
#actionZoneLegend{
    height: 2.5rem;
    width: 2.5rem;
    background-color: rgba(226, 238, 216, 0.8);
}
#limitLegend{
    height: 0.3rem;
    width: 2.5rem;
    background-color: rgba(0, 0, 0, 1);
    margin-top: 1.1rem;
}
</style>
