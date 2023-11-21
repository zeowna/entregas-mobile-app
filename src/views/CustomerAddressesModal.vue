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
            Selecione ou adicione um endereço para entrega
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-list v-if="!showForm">
            <ion-radio-group v-model="selectedAddress">
              <div v-for="address in addresses" :key="address.id">
                <ion-item-sliding>
                  <ion-item @click="close">
                    <ion-radio label-placement="start" :value="address">
                      {{ formatAddress(address) }}
                    </ion-radio>
                  </ion-item>
                  <ion-item-options side="end">
                    <ion-item-option color="danger" @click="removeAddress(address.id as number)">
                      <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                    </ion-item-option>
                  </ion-item-options>
                </ion-item-sliding>
              </div>
            </ion-radio-group>
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
                <ion-input v-model="v$.cep.$model" type="text" v-mask="'########'" placeholder="Seu CEP"
                           @keyup="findAddressByCep"/>
                <input-error :prop="v$.cep"/>

                <ion-label position="stacked">Rua</ion-label>
                <ion-input v-model="v$.street.$model" type="text" placeholder="Sua Rua" disabled/>
                <input-error :prop="v$.street"/>

                <ion-label position="stacked">Bairro</ion-label>
                <ion-input v-model="v$.neighbourhood.$model" type="text" placeholder="Seu Bairro" disabled/>
                <input-error :prop="v$.neighbourhood"/>

                <ion-label position="stacked">Numero</ion-label>
                <ion-input v-model="v$.number.$model" type="number" maxlength="4" placeholder="Seu Numero"/>
                <input-error :prop="v$.number"/>

                <ion-label position="stacked">Complemento</ion-label>
                <ion-input v-model="address.complement" type="text" placeholder="Seu Complemento"/>

                <ion-label position="stacked">Cidade</ion-label>
                <ion-input v-model="v$.city.$model" type="text" placeholder="Sua Cidade" disabled/>
                <input-error :prop="v$.city"/>

                <ion-label position="stacked">UF</ion-label>
                <ion-input v-model="v$.state.$model" type="text" placeholder="Seu UF" disabled/>
                <input-error :prop="v$.state"/>


                <ion-button expand="block" type="submit" :disabled="v$.$error">
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
  IonTitle,
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
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonToolbar
} from '@ionic/vue';
import { useAddress } from '@/composables';
import { formatAddress } from "@/utils";
import AppTitle from "@/components/AppTitle.vue";
import { onMounted, onUnmounted } from "vue";
import { addOutline, trash } from "ionicons/icons";
import InputError from "@/components/InputError.vue";

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

const close = () => {
  emit('close')
}

const submitAddress = async () => {
  await createAddress()
  toggleForm()
  close()
}

onMounted(() => {
  reset()
})

onUnmounted(() => {
  reset()
})
</script>
