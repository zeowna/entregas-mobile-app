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
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            Meus Endereços
          </ion-card-title>
          <ion-card-subtitle>
            <ion-icon :icon="locationOutline"/>
            {{ formatAddressSmall(selectedAddress as Address) }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>

          <h2>Selecione ou adicione um endereço para entrega</h2>

          <ion-list v-if="!showForm">
              <div v-for="address in addresses" :key="address.id">
                <ion-item-sliding>
                  <ion-item @click="assignSelectedAddress(address)">
                    <ion-icon aria-hidden="true" slot="end" :icon="caretForwardOutline" />

                    {{ formatAddress(address) }}
                  </ion-item>
                  <ion-item-options side="end">
                    <ion-item-option color="danger" @click="removeAddress(address.id as number)">
                      <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                    </ion-item-option>
                  </ion-item-options>
                </ion-item-sliding>
              </div>
          </ion-list>
          <br/>

          <ion-button color="light" @click="toggleForm" v-if="!showForm">
            <ion-icon :icon="addOutline"/>
            Adicionar um novo endereço
          </ion-button>

          <ion-row v-if="showForm">
            <ion-col>
              <form @submit.prevent="submitAddress">
                <ion-label position="stacked">CEP</ion-label>
                <ion-input v-model="(v$ as any).cep.$model" type="text" v-mask="'########'" placeholder="Seu CEP"
                           @keyup="findAddressByCep"/>
                <input-error :prop="(v$ as any).cep"/>

                <ion-label position="stacked">Rua</ion-label>
                <ion-input v-model="(v$ as any).street.$model" type="text" placeholder="Sua Rua" disabled/>
                <input-error :prop="(v$ as any).street"/>

                <ion-label position="stacked">Bairro</ion-label>
                <ion-input v-model="(v$ as any).neighbourhood.$model" type="text" placeholder="Seu Bairro" disabled/>
                <input-error :prop="(v$ as any).neighbourhood"/>

                <ion-label position="stacked">Numero</ion-label>
                <ion-input v-model="(v$ as any).number.$model" type="number" :maxlength="4" placeholder="Seu Numero"/>
                <input-error :prop="(v$ as any).number"/>

                <ion-label position="stacked">Complemento</ion-label>
                <ion-input v-model="address.complement" type="text" placeholder="Seu Complemento"/>

                <ion-label position="stacked">Cidade</ion-label>
                <ion-input v-model="(v$ as any).city.$model" type="text" placeholder="Sua Cidade" disabled/>
                <input-error :prop="(v$ as any).city"/>

                <ion-label position="stacked">UF</ion-label>
                <ion-input v-model="(v$ as any).state.$model" type="text" placeholder="Seu UF" disabled/>
                <input-error :prop="(v$ as any).state"/>


                <ion-button expand="block" type="submit" :disabled="(v$ as any).$error">
                  Adicionar endereço
                </ion-button>
              </form>
            </ion-col>
          </ion-row>
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
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { useAddress, useCart } from '@/composables';
import { formatAddress, formatAddressSmall } from "@/utils";
import AppTitle from "@/components/AppTitle.vue";
import { onMounted, onUnmounted } from "vue";
import { addOutline, caretForwardOutline, locationOutline, trash } from "ionicons/icons";
import InputError from "@/components/InputError.vue";
import { Address } from "@/services/api/types";
import { useRouter } from "vue-router";

const emit = defineEmits(['close'])

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const {
  selectedAddress,
  addresses,
  showForm,
  address,
  v$,
  reset,
  toggleForm,
  findAddressByCep,
  createAddress,
  removeAddress
} = useAddress()

const { cart, reset: resetCart } = useCart()
const router = useRouter()

const assignSelectedAddress = async (newAddress: Address) => {
  if(cart.value.length && newAddress?.id !== selectedAddress.value?.id) {
    const alert = await alertController.create({
      header: 'Deseja mudar o endereço para entrega?',
      message: 'Seu carrinho de compras será descartado',
      buttons: [
        {
          text: 'Trocar endereço',
          handler:async  () => {
            resetCart()
            selectedAddress.value = newAddress
            emit('close')
            await router.push('/tabs')
          }
        },
        {
          text: 'Manter endereço',
          role: "cancel",
          handler: () => {
            emit('close')
          }
        }
      ]
    })

    await alert.present()
    return
  }

  selectedAddress.value = newAddress
  emit('close')
}

const close = () => {
  emit('close')
}

const submitAddress = async () => {
  await createAddress()
  toggleForm()
  await close()
}

onMounted(() => {
  reset()
})

onUnmounted(() => {
  reset()
})
</script>
