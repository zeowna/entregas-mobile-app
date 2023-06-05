<template>
  <ion-icon :icon="flameOutline" class="logo-red"/>
  Entre<span class="logo-red">Gás</span>
</template>


<script setup lang="ts">
import { flameOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/vue";
</script>

<style scoped>
.logo-red {
  color: var(--ion-color-danger);
}
</style>
