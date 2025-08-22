<template>
    <div class="card shadow" style="min-height: 252px">
        <div class="card-header bg-primary">
            <span class="text-white">Informations support</span>
        </div>
        <div class="card-body">
            <h6>En journée du lundi au vendredi de 9h à 18h, merci de contacter le service client interne SETE</h6>
            <ul class="list-group list-group-horizontal list-unstyled">
                <li class="me-2">N. Bruel (2434) -</li>
                <li class="me-2">C. Thomas (2314) - </li>
                <li>T. Ciano (2342)</li>
            </ul>
            <h6 class="mt-2">En dehors de ces horaires d'ouverture merci de contacter le Centre d'appel COMEARTH</h6>
            <p>01 70 56 59 32 - Ouverture de 6h30 à 23h du lundi au dimanche - <a class="text-primary" href="#">alerte-sete@comearth-france.com</a> </p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppInformations'
})
</script>

<style lang="scss" scoped>
    h6{
        font-weight: bold;
    }
</style>
