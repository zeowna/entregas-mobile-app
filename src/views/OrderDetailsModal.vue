<template>
  <ion-modal :isOpen="visible">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close()">Voltar</ion-button>
        </ion-buttons>
        <ion-title>
          <AppTitle/>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="order">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
          #{{ formatOrderNumber(order.id)}} - {{ order.partner.name }}     <ion-chip :color="getOrderStatusColorApp(order.status as OrderStatus)">
            <small>{{ formatOrderStatus(order.status) }}</small>
          </ion-chip>
          </ion-card-title>
          <ion-card-subtitle>
            {{ formatAddress(order.address) }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>

          <MapContainer :address="order.address" v-if="order.address" />

          <ul class="ion-padding-start">
            <li v-for="cartProduct in order.cart" :key="cartProduct.id">
              {{ cartProduct.quantity }}x {{ cartProduct.partnerProduct.product.name }}
              {{ cartProduct.partnerProduct.product.size }}: <b>R$
              {{ centsToCurrency(cartProduct.totalValue / cartProduct.quantity) }}</b>
            </li>
          </ul>

          <ion-row>
            <ion-col>
              <h4>{{ new Date(order.statusUpdatedAt)?.toLocaleDateString() }} -
                {{ new Date(order.statusUpdatedAt)?.toLocaleTimeString() }}</h4>
              <h2><b>Valor total: R$ {{ centsToCurrency(order.totalValue) }}</b></h2>
              <h3>{{ formatOrderPaymentMethod(order.paymentMethod) }}</h3>
            </ion-col>
          </ion-row>


          <div  v-if="order.status === OrderStatus.Created">
            <br />
            <br />
            <ion-button expand="block" color="danger" @click="cancelOrder">Cancelar Pedido</ion-button>
          </div>

        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-modal>

</template>

<script setup lang="ts">
import {
  centsToCurrency,
  formatAddress,
  formatOrderNumber,
  formatOrderPaymentMethod,
  formatOrderStatus,
  getOrderStatusColorApp
} from "@/utils";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle, IonChip,
  IonCol,
  IonContent,
  IonHeader,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar
} from "@ionic/vue";
import { useOrder } from "@/composables";
import AppTitle from "@/components/AppTitle.vue";
import MapContainer from "@/components/MapContainer.vue";
import { OrderStatus } from "@/services/api/types";

const { order, cancelOrder } = useOrder()

 defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const close = async () => {
  emit('close')
}

</script>
