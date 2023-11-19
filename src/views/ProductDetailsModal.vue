<template>
  <ion-modal :isOpen="visible">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close">Voltar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ selectedPartnerProduct?.product?.name }} {{ selectedPartnerProduct?.product?.size }}
          </ion-card-title>
          <ion-card-subtitle>Adicione a quantidade que deseja comprar</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-row>
            <ion-col class="ion-text-center">
              <img
                  :src="selectedPartnerProduct?.product?.pictureURI"
                  style="width: 50%"
              />
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col class="ion-text-center">
              <h1> Quantidade: {{
                  getCartProduct(selectedPartnerProduct?.id!)?.quantity || 0
                }}</h1>
              <h2> + {{ centsToCurrency(getCartProduct(selectedPartnerProduct?.id!)?.totalValue) }}</h2>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="ion-text-center">
              <ion-button @click="addProduct(selectedPartnerProduct!)"
                          :disabled="selectedPartnerProduct?.inStockQuantity === getCartProduct(selectedPartnerProduct?.id!)?.quantity">
                <ion-icon slot="icon-only" :icon="addOutline"/>
              </ion-button>
              <ion-button color="danger" @click="removeProduct(selectedPartnerProduct!)"
                          :disabled="!getCartProduct(selectedPartnerProduct?.id!)">
                <ion-icon slot="icon-only" :icon="removeOutline"/>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
      <ProductCart/>
      <br/>
      <br/>
      <br/>
    </ion-content>
  </ion-modal>

</template>

<script setup lang="ts">
import { addOutline, removeOutline } from "ionicons/icons";
import { centsToCurrency } from "@/utils";
import {
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
  IonModal,
  IonRow,
  IonToolbar
} from "@ionic/vue";
import ProductCart from "@/components/ProductCart.vue";
import { PropType } from "vue";
import { PartnerProduct } from "@/services/api/types";
import { useCart } from "@/composables";

const { getCartProduct, addProduct, removeProduct } = useCart()

defineProps({
  selectedPartnerProduct: {
    type: Object as PropType<PartnerProduct | null>,
    default: () => null
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

</script>
