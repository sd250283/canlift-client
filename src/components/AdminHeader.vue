<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-primary shadow py-0 admin-navbar">
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="nav-collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" :to="{ name: 'adminElevator' }">Ascenseurs</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link class="nav-link" active-class="active" exact :to="{ name: 'adminSchedule' }">Horaires</router-link>
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" exact :to="{ name: 'adminUser' }">Utilisateurs</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" exact :to="{ name: 'adminLimit' }">Seuils</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" exact :to="{ name: 'adminRecipient' }">Destinataires</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" exact :to="{ name: 'adminMessage' }">Message</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto me-5 text-white">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'simulation' }">
              <button class="btn btn-secondary btn-sm rounded-pill">
                Retour à la simulation
              </button>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdminHeader'
})
</script>

<style scoped>
.navbar-dark .navbar-nav .nav-link {
  color: white !important;
}
</style>
