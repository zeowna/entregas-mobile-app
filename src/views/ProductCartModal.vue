<template>
  <ion-modal :isOpen="visible">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close">Voltar</ion-button>
        </ion-buttons>
        <ion-title>
          <AppTitle/>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <CustomerAddressSelectionCard/>

      <ion-card>
        <ion-card-header>
          <ion-card-title>
            Carrinho de compras
          </ion-card-title>
          <ion-card-subtitle>Listagem de produtos</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>

          <p v-for="product in cart" :key="product.partnerProduct.id">{{ product.quantity }}x {{
              product.partnerProduct.product.name
            }} {{ product.partnerProduct.product.size }}</p>

          <br/>

          <h1>{{ centsToCurrency(sumCartValue()) }}</h1>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>
            Forma de pagamento
          </ion-card-title>
          <ion-card-subtitle>Selecione como quer pagar</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-row>
            <ion-col>
              <ion-radio-group v-model="paymentMethod">
                <ion-radio value="debit_card_location" label-placement="end">Débito na entrega</ion-radio>
                <br/><br/>
                <ion-radio value="credit_card_location" label-placement="end">Crédito na entrega</ion-radio>
                <br/><br/>
                <ion-radio value="cash_location" label-placement="end">Dinheiro na entrega</ion-radio>
                <br/><br/>
                <ion-radio value="card_remote" label-placement="end" disabled>Crédito/Debito no App (Em Breve)
                </ion-radio>
              </ion-radio-group>
            </ion-col>
          </ion-row>

          <ion-row v-if="paymentMethod === 'cash_location'">
            <ion-col>
              <ion-label position="stacked">Troco para</ion-label>
              <ion-input v-model="changeValue" v-mask="'R$ ###'" placeholder="Troco para" aria-label="changeValue"/>
            </ion-col>
          </ion-row>

          <br/>
          <ion-button expand="block" :disabled="disableButton" @click="createOrder">Confirmar pedido</ion-button>
        </ion-card-content>
      </ion-card>
      <CustomerAddressesModal :visible="addressesVisible" @close="toggleAddressesModal"/>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts" setup>
import {
  alertController,
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
  IonInput,
  IonLabel,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonToolbar,
  loadingController,
} from '@ionic/vue';
import { useAddress, useCart } from '@/composables';
import { centsToCurrency } from "@/utils";
import AppTitle from "@/components/AppTitle.vue";
import { computed, ref } from "vue";
import { Dialog } from "@capacitor/dialog";
import { Api } from "@/services/api/Api";
import { store } from "@/store";
import { Address, Order } from "@/services/api/types";
import router from "@/router";
import CustomerAddressesModal from "@/views/CustomerAddressesModal.vue";
import CustomerAddressSelectionCard from "@/components/CustomerAddressSelectionCard.vue";

const emit = defineEmits(['close'])

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const user = computed(() => store.getters.getUser)

const disableButton = computed(() => {
  return !paymentMethod.value || paymentMethod.value === 'cash_location' && !changeValue.value || !sumCartValue()
})
const paymentMethod = ref(null)
const changeValue = ref(0)

const { cart, sumCartValue, reset } = useCart()
const { selectedAddress, addressesVisible, toggleAddressesModal } = useAddress()

const order = ref<Order | null>()

const createOrder = async () => {
  const { value } = await Dialog.confirm({
    title: 'Confirmar pedido',
    message: `Podemos confirmar seu pedido?`,
  });

  if (value) {
    const loading = await loadingController.create({
      message: 'Carregando...',
    });
    await loading.present()

    try {
      order.value = await Api.customers.orders.create(user.value.id as number, order.value as Order)
      await Api.customers.orders.addresses.create(order.value.id as number, selectedAddress.value as Address)
      await Api.customers.orders.cart.create(order.value.id as number, cart.value)

      await loading.dismiss()
      reset()
      await router.push('/tabs/ordersTab')
      close()
    } catch (err) {
      await loading.dismiss()
      const alert = await alertController.create({
        header: 'Erro ao criar Pedido',
        message: 'Infelizmente alguns itens se tornaram indisponíveis.',
        buttons: [
          {
            text: 'Entendi',
            handler: async () => {
              reset()
              await router.push('/tabs/ordersTab')
              close()
            }
          }
        ],
      });

      await alert.present();
    }
  }
}

const close = () => {
  emit('close')
}


</script>
