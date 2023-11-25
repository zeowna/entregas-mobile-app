<template>
  <ion-modal :isOpen="visible">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close(true)">Voltar</ion-button>
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
            {{ selectedPartnerProduct?.product?.name }} {{ selectedPartnerProduct?.product?.size }}
          </ion-card-title>
          <ion-card-subtitle>{{ centsToCurrency(selectedPartnerProduct?.value!) }} por unidade
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
              <h2 v-if="getCartProduct(selectedPartnerProduct?.id!)?.quantity! > 0">
                {{ centsToCurrency(getCartProduct(selectedPartnerProduct?.id!)?.totalValue as number) }}</h2>
            </ion-col>
          </ion-row>

          <br/>

          <ion-button expand="block" @click="close(false)">Confirmar seleção</ion-button>

        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-modal>

</template>

<script setup lang="ts">
import { addOutline, removeOutline } from "ionicons/icons";
import { centsToCurrency } from "@/utils";
import {
  alertController,
  IonButton, IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent, IonHeader,
  IonIcon,
  IonModal,
  IonRow, IonTitle, IonToolbar
} from "@ionic/vue";
import { PropType } from "vue";
import { CartProduct, PartnerProduct } from "@/services/api/types";
import { useCart } from "@/composables";
import AppTitle from "@/components/AppTitle.vue";

const { getCartProduct, addProduct, removeProduct } = useCart()

const props = defineProps({
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

const close = async (cancel?: boolean) => {
  const cartProduct = getCartProduct(props.selectedPartnerProduct?.id as number) as CartProduct

  if (cancel && cartProduct?.quantity > 0) {
    const alert = await alertController.create({
      header: 'Deseja confirmar a seleção?',
      buttons: [
        {
          text: 'Confirmar seleção',
          handler: () => {
            emit('close')
          }
        },
        {
          text: 'Cancelar e voltar',
          role: 'cancel',
          handler: () => {
            cartProduct.quantity = 0
            emit('close')
          }
        }
      ]
    })

    await alert.present()
    return
  }
  emit('close')
}

</script>
