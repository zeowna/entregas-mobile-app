<template>
  <ion-modal :isOpen="visible">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="close">Voltar</ion-button>
        </ion-buttons>
        <ion-title>
          <AppTitle />
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <CustomerAddressSelectionCard />

      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ order?.partner?.name }}
          </ion-card-title>
          <ion-card-subtitle>
            Listagem de produtos
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>

          <p v-for="product in cart" :key="product.partnerProduct.id">{{ product.quantity }}x {{
            product?.partnerProduct?.product?.name
          }} {{ product?.partnerProduct?.product?.size }} - <b v-if="product?.partnerProduct?.value">{{ centsToCurrency(product.partnerProduct.value) }}</b></p>

          <br />

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
              <ion-radio-group v-model="order.paymentMethod">
                <ion-radio :value="OrderPaymentMethods.DebitCardLocation" label-placement="end">Débito na
                  entrega</ion-radio>
                <br /><br />
                <ion-radio :value="OrderPaymentMethods.CreditCardLocation" label-placement="end">Crédito na
                  entrega</ion-radio>
                <br /><br />
                <ion-radio :value="OrderPaymentMethods.CashLocation" label-placement="end">Dinheiro na entrega</ion-radio>
                <br /><br />
                <ion-radio value="card_remote" label-placement="end" disabled>Crédito/Debito no App (Em Breve)
                </ion-radio>
              </ion-radio-group>
            </ion-col>
          </ion-row>

          <ion-row v-if="order.paymentMethod === OrderPaymentMethods.CashLocation">
            <ion-col>
              <ion-label position="stacked">Troco para</ion-label>
              <ion-input v-model="(v$.changeValue as any).$model" v-mask="'R$ ###'" placeholder="Troco para"
                aria-label="changeValue" />
              <input-error :prop="(v$ as any).changeValue" />
            </ion-col>
          </ion-row>

          <br />
          <ion-button expand="block" :disabled="disableButton" @click="createOrder">Confirmar pedido</ion-button>
        </ion-card-content>
      </ion-card>
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
  IonTitle,
  IonToolbar,
  loadingController
} from '@ionic/vue';
import { useAddress, useCart } from '@/composables';
import { centsToCurrency } from "@/utils";
import AppTitle from "@/components/AppTitle.vue";
import { computed, ref, watch } from "vue";
import { Api } from "@/services/api/Api";
import { store } from "@/store";
import { Address, CustomerUser, Order, OrderPaymentMethods, Partner } from "@/services/api/types";
import router from "@/router";
import CustomerAddressSelectionCard from "@/components/CustomerAddressSelectionCard.vue";
import useVuelidate from '@vuelidate/core';

const emit = defineEmits(['close'])

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const user = computed(() => store.getters.getUser)

const { cart, partner, sumCartValue, reset } = useCart()
const { selectedAddress } = useAddress()

const order = ref<Order>({
  partnerId: partner.value?.id as number,
  customer: user.value as CustomerUser,
  partner: partner.value as Partner,
  address: selectedAddress.value as Address,
  cart: cart.value,
  paymentMethod: OrderPaymentMethods.DebitCardLocation,
  changeValue: 0
})

const rules = computed(() => ({
  ...(order.value.paymentMethod === OrderPaymentMethods.CashLocation ? {
    changeValue: {
      valid: (value: string) => {
        const number = Number.parseInt((value as any as string).replace(/\D+/g, '')) * 100

        return number > sumCartValue()
      }
    }
  } : {})
}))

const v$ = useVuelidate(rules, order)

watch(() => partner.value, (partner) => {
  order.value.partner = partner as Partner
})

const disableButton = computed(() => {
  return !!v$.value.$errors.length
    || !order.value.paymentMethod
    ||( order.value.paymentMethod === OrderPaymentMethods.CashLocation && !order.value.changeValue) 
    || !sumCartValue()
})


const createOrder = async () => {
  const alert = await alertController.create({
    header: 'Confirmar pedido',
    message: `Podemos confirmar seu pedido?`,
    buttons: [
      {
        text: 'Sim', handler: async () => {
          const loading = await loadingController.create({
            message: 'Carregando...',
          });
          await loading.present()

          try {
            if (order.value.changeValue) {
              order.value.changeValue = Number.parseInt((order.value.changeValue as any as string).replace(/\D+/g, '')) * 100
            }

            order.value = await Api.customers.orders.create(user.value.id as number, {
              ...order.value as Order,
              partnerId: order.value?.partner?.id as number
            })
            await Api.customers.orders.addresses.create(user.value.id as number, order.value.id as number, selectedAddress.value as Address)
            await Api.customers.orders.cart.create(user.value.id as number, order.value.id as number, cart.value)

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
      },
      { text: 'Não', role: 'cancel' }
    ]
  })

  await alert.present()
}

const close = () => {
  emit('close')
}


</script>
