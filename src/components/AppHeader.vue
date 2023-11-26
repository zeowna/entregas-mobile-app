<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>
        <AppTitle/>
      </ion-title>
      <ion-buttons slot="end">
        <ion-button @click="toggleCart" :disabled="!cart.length">
          <ion-icon :icon="cartIcon" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ProductCartModal :visible="cartVisible" @close="toggleCart" />
</template>

<script setup lang="ts">
import { cart as cartIcon } from "ionicons/icons";
import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/vue";
import AppTitle from "@/components/AppTitle.vue";
import { useCart } from "@/composables";
import ProductCartModal from "@/views/ProductCartModal.vue";

const { cart, cartVisible, toggleCart } = useCart()

</script>

