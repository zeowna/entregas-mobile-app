<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Carrinho de compras</ion-card-title>
      <ion-card-subtitle>Listagem de produtos</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>

      <p v-for="product in cart" :key="product.partnerProduct.id">{{ product.quantity }}x {{
          product.partnerProduct.product.name
        }} {{ product.partnerProduct.product.size }}</p>

      <br/>

      <h1>{{ centsToCurrency(sumCartValue()) }}</h1>

      <br/>

      <ion-button v-if="showButton" expand="block">Fechar compra</ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts" setup>
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/vue';
import { useCart } from '@/composables';
import { centsToCurrency } from "@/utils";

defineProps({ showButton: { type: Boolean, default: false }})

const { cart, sumCartValue } = useCart()


</script>
