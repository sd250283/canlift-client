<template>
  <Card class="shadow-sm">
    <CardHeader>
      <CardTitle class="text-lg font-semibold">Informations support</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div>
          <p class="font-medium text-sm">En journée du lundi au vendredi de 9h à 18h, merci de contacter le service client interne SETE</p>
          <div class="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
            <span>N. Bruel (2434) -</span>
            <span>C. Thomas (2314) -</span>
            <span>T. Ciano (2342)</span>
          </div>
        </div>
        
        <div>
          <p class="font-medium text-sm">En dehors de ces horaires d'ouverture merci de contacter le Centre d'appel COMEARTH</p>
          <div class="mt-2 text-sm text-muted-foreground">
            <p><strong>01 70 56 59 32</strong></p>
            <p>Ouverture de 6h30 à 23h du lundi au dimanche</p>
            <p>
              <a href="mailto:alerte-sete@comearth-france.com" class="text-primary hover:underline">
                alerte-sete@comearth-france.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default defineComponent({
  name: 'InfoSupport',
  components: {
    Card,
    CardContent,
    CardHeader,
    CardTitle
  }
})
</script>
