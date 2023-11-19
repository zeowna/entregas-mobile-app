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
            {{ partner?.name }}
          </ion-card-title>
          <ion-card-subtitle>
            {{ formatAddress(partner?.address) }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <MapContainer :address="partner?.address"/>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            Lista de produtos
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div v-for="group in Object.keys(groupedPartnerProducts)" :key="group">
            <ion-row>
              <ion-col>
                <h2><b>{{ group }}</b></h2>
              </ion-col>
            </ion-row>
            <ion-row v-for="partnerProduct in groupedPartnerProducts[group]" :key="partnerProduct.id">
              <ion-col size="sm">
                {{ getCartProduct(partnerProduct?.id!)?.quantity || 0 }}
              </ion-col>
              <ion-col>
                <p>{{ partnerProduct.product!.name }} {{ partnerProduct.product!.size }}</p>
                <b>+ R$ {{ (partnerProduct.value / 100).toFixed(2).replace('.', ',') }}</b>
              </ion-col>
              <ion-col size="sm">
                <ion-button size="small" @click="selectProductToShow(partnerProduct)">
                  <ion-icon slot="icon-only" :icon="cart"/>
                </ion-button>
              </ion-col>
            </ion-row>
          </div>
        </ion-card-content>
      </ion-card>
      <ProductCart show-button/>
      <ProductDetailsModal :visible="visible" :selectedPartnerProduct="selectedPartnerProduct" @close="close" />
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
  IonIcon, IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/vue'
import AppTitle from '@/components/AppTitle.vue';
import { useRoute } from 'vue-router';
import { addOutline, trash, cart } from 'ionicons/icons';
import { useCart, usePartner } from '@/composables';
import ProductCart from '@/components/ProductCart.vue';
import { onMounted, ref } from "vue";
import MapContainer from "@/components/MapContainer.vue";
import { centsToCurrency, formatAddress } from "@/utils";
import { PartnerProduct } from "@/services/api/types";
import ProductDetailsModal from "@/views/ProductDetailsModal.vue";

const visible = ref(false)
const selectedPartnerProduct = ref<PartnerProduct | null>(null)
const route = useRoute()
const { getCartProduct, addProduct, removeProduct } = useCart()
const {
  partner,
  groupedPartnerProducts, getProducts, getPartner
} = usePartner()

const close = () => {
  visible.value = false
}

const selectProductToShow = (partnerProduct: PartnerProduct) => {
  selectedPartnerProduct.value = partnerProduct
  visible.value = true
}

onMounted(async () => {
  await getPartner(+route.params.id)
  await getProducts(+route.params.id)
})


</script>


<style scoped>

</style>
