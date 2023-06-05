<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text=""/>
          <ion-title>
            <app-title/>
          </ion-title>
        </ion-buttons>

      </ion-toolbar>
    </ion-header>

    <ion-content>

      <ion-card>
        <ion-card-header>
          <ion-card-title>
            Saldanha Distribuidora
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-row v-for="{ product, ...partnerProduct} in partnerProducts" :key="partnerProduct.id">
            <ion-col size="sm">
              {{ getCartProduct(partnerProduct.id)?.quantity || 0 }}
            </ion-col>
            <ion-col size="">
              <p>{{ product.name }} {{ product.size }}</p>
              <b>R$ {{ (partnerProduct.value / 100).toFixed(2).replace('.', ',') }}</b>
            </ion-col>
            <ion-col size="sm">
              <ion-button size="small" @click="addProduct({...partnerProduct, product})">
                <ion-icon slot="icon-only" :icon="addOutline"/>
              </ion-button>
              <ion-button size="small" color="danger" @click="removeProduct({...partnerProduct, product})">
                <ion-icon slot="icon-only" :icon="trash"/>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>

      <cart/>

    </ion-content>

  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/vue'
import AppTitle from '@/components/AppTitle.vue';
import { useRoute } from 'vue-router';
import { addOutline, trash } from 'ionicons/icons';
import { useCart, usePartner } from '@/composables';
import Cart from '@/components/Cart.vue';


const route = useRoute()


const { partnerProducts } = usePartner(+route.params.id)

const { getCartProduct, addProduct, removeProduct } = useCart()

</script>


<style scoped>

</style>
