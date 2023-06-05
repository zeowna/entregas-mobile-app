<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Valor Total</ion-card-title>
    </ion-card-header>
    <ion-card-content>

      <p v-for="product in cart" :key="product.partnerProduct.id">{{ product.quantity }}x {{
          product.partnerProduct.product.name
        }} {{ product.partnerProduct.product.size }}</p>

      <br/>

      <h1>R$ {{ (sumCartValue() / 100).toFixed(2).replace('.', ',') }}</h1>

      <br/>

      <ion-button expand="block">Comprar</ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts" setup>
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/vue';
import { useCart } from '@/composables';

const { cart, sumCartValue } = useCart()
</script>
