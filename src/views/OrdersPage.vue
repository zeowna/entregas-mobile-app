<template>
  <ion-page>
    <AppHeader />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            <app-title/>
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card v-for="order in orders" :key="order.id">
        <ion-card-header>

          <ion-card-subtitle>{{ order.partner.name }}</ion-card-subtitle>
          <ion-card-title>
            <ion-row>
              <ion-col>
                <small># {{ String(order.id).padStart(4, '0') }}</small>
              </ion-col>
              <ion-col class="ion-text-right">
                <ion-chip :color="getOrderStatusColor(order.status)">
                  <small>{{ getOrderStatusText(order.status) }}</small>
                </ion-chip>
              </ion-col>
            </ion-row>
          </ion-card-title>

        </ion-card-header>
        <ion-card-content>

          <ion-row>
            <ion-col>
              <small><b>{{ order.statusUpdatedAt.toLocaleString() }}</b></small>
            </ion-col>
            <ion-col class="ion-text-right ion-padding-end">
              <small><b>Valor total: R$ {{ (order.value / 100).toFixed(2).replace('.', ',') }}</b></small>
            </ion-col>
          </ion-row>

          <ul class="ion-padding-start">
            <li v-for="product in order.cart" :key="product.id">
              {{ product.quantity }}x {{ product.name }} {{ product.size }}: <b>R$
              {{ (product.value / 100).toFixed(2).replace('.', ',') }}</b>
            </li>
          </ul>

          <map-container :address="order.address"/>

        </ion-card-content>
      </ion-card>

      <ion-infinite-scroll @ionInfinite="ionInfinite" :disabled="!shouldFindMorePartners">
        <ion-infinite-scroll-content loadingText="Aguarde..." loadingSpinner="circles"></ion-infinite-scroll-content>
      </ion-infinite-scroll>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useListOrders } from "@/composables";
import AppHeader from "@/components/AppHeader.vue";

const {
  orders,
  getOrderStatusText,
  getOrderStatusColor,
  shouldFindMorePartners,
  ionInfinite
} = useListOrders()

</script>


<style scoped>
ion-card-header {
  padding-bottom: 0;
}

.ios > ion-chip > small {
  font-size: 72%;
}

</style>
