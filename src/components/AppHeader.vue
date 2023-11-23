<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>
        <AppTitle/>
      </ion-title>
      <ion-buttons slot="end">
        <ion-button @click="toggleCart">
          <ion-icon :icon="cart" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ProductCartModal :visible="cartVisible" @close="toggleCart" />
</template>

<script setup lang="ts">
import { cart } from "ionicons/icons";
import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/vue";
import AppTitle from "@/components/AppTitle.vue";
import { useCart } from "@/composables";
import ProductCartModal from "@/views/ProductCartModal.vue";

const { cartVisible, toggleCart, getCartProduct } = useCart()

</script>

