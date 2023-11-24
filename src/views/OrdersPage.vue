<template>
  <ion-page>
    <AppHeader/>

    <ion-content :fullscreen="true">

      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-card v-if="!data.list.length">
        <ion-card-header>
          <ion-card-title>
            Você ainda não fez nenhum pedido
          </ion-card-title>
        </ion-card-header>
        <ion-card-content></ion-card-content>
      </ion-card>


      <ion-card v-for="order in data.list" :key="`order-${order.id}`" @click="toggleOrderModal(order.id)">
        <ion-card-header>

          <ion-card-subtitle>{{ order.partner.name }}</ion-card-subtitle>
          <ion-card-title>
            <ion-row>
              <ion-col>
                <small># {{ formatOrderNumber(order.id) }}</small>
              </ion-col>
              <ion-col class="ion-text-right">
                <ion-chip :color="getOrderStatusColorApp(order.status as OrderStatus)">
                  <small>{{ formatOrderStatus(order.status) }}</small>
                </ion-chip>
              </ion-col>
            </ion-row>
          </ion-card-title>

        </ion-card-header>
        <ion-card-content>

          <ion-row>
            <ion-col>
              <small><b>{{ new Date(order.statusUpdatedAt)?.toLocaleDateString() }} -
                {{ new Date(order.statusUpdatedAt)?.toLocaleTimeString() }}</b></small>
            </ion-col>
          </ion-row>

          <ul class="ion-padding-start">
            <li v-for="cartProduct in order.cart" :key="cartProduct.id">
              {{ cartProduct.quantity }}x {{ cartProduct.partnerProduct.product.name }}
              {{ cartProduct.partnerProduct.product.size }}: <b>R$
              {{ centsToCurrency(cartProduct.totalValue / cartProduct.quantity) }}</b>
            </li>
          </ul>

          <ion-row>
            <ion-col>
              <h3><b>Valor total: R$ {{ centsToCurrency(order.totalValue) }}</b></h3>
            </ion-col>
          </ion-row>

        </ion-card-content>
      </ion-card>

      <ion-infinite-scroll @ionInfinite="ionInfinite" :disabled="!shouldFindMoreOrders">
        <ion-infinite-scroll-content loadingText="Aguarde..." loadingSpinner="circles"></ion-infinite-scroll-content>
      </ion-infinite-scroll>

      <OrderDetailsModal :visible="orderVisible" @close="toggleOrderModal"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent, IonIcon, IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  loadingController,
} from '@ionic/vue'
import { useListOrders, useOrder } from "@/composables";
import AppHeader from "@/components/AppHeader.vue";
import { centsToCurrency, formatOrderNumber, formatOrderStatus, getOrderStatusColorApp } from "@/utils";
import { OrderStatus } from "@/services/api/types";
import { onMounted, onUnmounted } from "vue";
import OrderDetailsModal from "@/views/OrderDetailsModal.vue";
import { locationOutline } from "ionicons/icons";

const {
  shouldFindMoreOrders,
  data,
  reset,
  findOrders,
  ionInfinite
} = useListOrders()

const { orderVisible, toggleOrderModal } = useOrder()

const handleRefresh = (event: CustomEvent) => {
  setTimeout(async () => {
    reset()

    try {
      await findOrders()
    } catch (err) {
      console.error(err)
    } finally {
      event?.target?.complete();

    }
  }, 2000);
};

onMounted(async () => {
  const loading = await loadingController.create({
    message: 'Carregando...',
  });
  await loading.present()
  reset()

  await findOrders()

  await loading.dismiss()
})

onUnmounted(() => {
  reset()
})

</script>


<style scoped>
ion-card-header {
  padding-bottom: 0;
}

.ios > ion-chip > small {
  font-size: 72%;
}

</style>
