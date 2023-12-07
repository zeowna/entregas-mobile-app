<template>
  <ion-page>
    <AppHeader />

    <ion-content>
      <CustomerAddressSelectionCard />


      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ partner?.name }}
          </ion-card-title>
          <ion-card-subtitle>
            {{ formatAddress(partner?.address!) }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <MapContainer :address="partner?.address!"/>
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
              <ion-input v-model="productName" clear-input clear-on-edit placeholder="Buscar por nome" />
            </ion-col>
          </ion-row>

          <div v-for="group in Object.keys(groupedPartnerProducts)" :key="group">
            <ion-row>
              <ion-col>
                <h2><b>{{ group }}</b></h2>
              </ion-col>
            </ion-row>
            <ion-grid>
              <ion-row v-for="partnerProduct in groupedPartnerProducts[group]" :key="`partner-product${partnerProduct.id}`" @click="selectProductToShow(partnerProduct)">
                <ion-col size="2">
                  {{ getCartProduct(partnerProduct?.id!)?.quantity || 0 }}
                </ion-col>
                <ion-col size="8">
                  <p>{{ partnerProduct.product!.name }} {{ partnerProduct.product!.size }}</p>
                  <b>+ R$ {{ (partnerProduct.value / 100).toFixed(2).replace('.', ',') }}</b>
                </ion-col>
                <ion-col size="2">
                  <ion-img :src="partnerProduct.product?.pictureURI" />
                </ion-col>
              </ion-row>
          </ion-grid>
          </div>
          <br/>
          <ion-button expand="block" @click="toggleCart">Ir para carrinho de compras</ion-button>
        </ion-card-content>
      </ion-card>
      <ProductDetailsModal :visible="productDetailsVisible" :selectedPartnerProduct="selectedPartnerProduct"
                           @close="toggleProductDetails"/>
    </ion-content>
  </ion-page>

</template>

<script lang="ts" setup>
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  loadingController,
  alertController
} from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router';
import { search } from 'ionicons/icons';
import { useCart, usePartner } from '@/composables';
import { onMounted, onUnmounted, ref, watch } from "vue";
import MapContainer from "@/components/MapContainer.vue";
import { formatAddress } from "@/utils";
import { PartnerProduct } from "@/services/api/types";
import ProductDetailsModal from "@/views/ProductDetailsModal.vue";
import AppHeader from "@/components/AppHeader.vue";
import CustomerAddressSelectionCard from "@/components/CustomerAddressSelectionCard.vue";

const productDetailsVisible = ref(false)
const selectedPartnerProduct = ref<PartnerProduct | null>(null)
const router = useRouter()
const route = useRoute()
const { toggleCart, getCartProduct } = useCart()
const {
  partner,
  productName,
  groupedPartnerProducts, getProducts, getPartner, filterByProductName, reset
} = usePartner()

const {
 partner: cartPartner
 reset: resetCart
} = useCart()

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

  if(cartPartner.value && (partner.id !== cartPartner?.id)) {
    const alert = await alertController.create({ header: 'Você já estava comprando de outro Parceiro', buttons: [
      { 
        text: 'Voltar para o Parceiro anterior',
        handler: async () => { 
          await router.push(`/tabs/partnerListTab/partner/${cartPartner?.value?.id}`)
        }
      },
      {
        text: 'Voltar para o Parceiro anterior',
        handler: async () => { 
          resetCart()
        }
      }
    ]})

    await alert.present()
  }
})

watch(() => productName.value, ()=> {
  filterByProductName()
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
