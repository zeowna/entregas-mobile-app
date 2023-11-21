<template>
  <ion-modal :isOpen="visible">
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            <AppTitle/>
            <h4> {{ selectedPartnerProduct?.product?.name }} {{ selectedPartnerProduct?.product?.size }}</h4>
          </ion-card-title>
          <ion-card-subtitle>{{ centsToCurrency(selectedPartnerProduct.value) }} por unidade
          </ion-card-subtitle>
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
              <h2> Quantidade: {{
                  getCartProduct(selectedPartnerProduct?.id!)?.quantity || 0
                }}</h2>
              <h3 v-if="!getCartProduct(selectedPartnerProduct?.id!)?.quantity">Adicione a quantidade desejada</h3>
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

          <ion-row>
            <ion-col class="ion-text-center">
              <h2 v-if="getCartProduct(selectedPartnerProduct?.id!)?.quantity > 0">{{ centsToCurrency(getCartProduct(selectedPartnerProduct?.id!)?.totalValue) }}</h2>
            </ion-col>
          </ion-row>

          <br/>

          <ion-button expand="block" @click="close">Confirmar seleção</ion-button>

        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-modal>

</template>

<script setup lang="ts">
import { addOutline, removeOutline } from "ionicons/icons";
import { centsToCurrency } from "@/utils";
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
  IonModal,
  IonRow
} from "@ionic/vue";
import { PropType } from "vue";
import { PartnerProduct } from "@/services/api/types";
import { useCart } from "@/composables";
import AppTitle from "@/components/AppTitle.vue";

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
