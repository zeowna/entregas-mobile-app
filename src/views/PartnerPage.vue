<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""/>
        </ion-buttons>
        <ion-title>
          <AppTitle/>
        </ion-title>
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
          <ion-row>
            <ion-col class="search-col" size="sm">
              <ion-icon :icon="search"/>
            </ion-col>
            <ion-col>
              <ion-input v-model="productName" placeholder="Buscar por nome" @keyup="filterByProductName"/>
            </ion-col>
          </ion-row>

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
                  Ver
                </ion-button>
              </ion-col>
            </ion-row>
          </div>
          <br />
          <ion-button expand="block" @click="toggleCart">Ir para carrinho de compras</ion-button>
        </ion-card-content>
      </ion-card>
      <ProductDetailsModal :visible="productDetailsVisible" :selectedPartnerProduct="selectedPartnerProduct" @close="toggleProductDetails"/>
      <ProductCartModal :visible="cartVisible" @close="toggleCart"/>
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
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  loadingController
} from '@ionic/vue'
import AppTitle from '@/components/AppTitle.vue';
import { useRoute } from 'vue-router';
import { search } from 'ionicons/icons';
import { useCart, usePartner } from '@/composables';
import { onMounted, onUnmounted, ref } from "vue";
import MapContainer from "@/components/MapContainer.vue";
import { formatAddress } from "@/utils";
import { PartnerProduct } from "@/services/api/types";
import ProductDetailsModal from "@/views/ProductDetailsModal.vue";
import ProductCartModal from "@/views/ProductCartModal.vue";

const productDetailsVisible = ref(false)
const selectedPartnerProduct = ref<PartnerProduct | null>(null)
const route = useRoute()
const { cartVisible, toggleCart, getCartProduct } = useCart()
const {
  partner,
  productName,
  groupedPartnerProducts, getProducts, getPartner, filterByProductName, reset
} = usePartner()

const toggleProductDetails = () => {
  productDetailsVisible.value = !productDetailsVisible.value
}


const selectProductToShow = (partnerProduct: PartnerProduct) => {
  selectedPartnerProduct.value = partnerProduct
  toggleProductDetails()
}

onMounted(async () => {
  reset()
  const loading = await loadingController.create({
    message: 'Carregando...',
  });
  await loading.present()

  await getPartner(+route.params.id)
  await getProducts(+route.params.id)

  await loading.dismiss()
})

onUnmounted(() => {
  reset()
})
</script>

<style scoped>
.md > .search-col {
  padding-top: 6%;
}

.ios > .search-col {
  padding-top: 5%;
}

</style>
