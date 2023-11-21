<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <AppTitle/>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)" v-if="selectedAddress && addresses.length">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            <app-title/>
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <CustomerAddressSelectionCard  v-if="addresses.length" />

      <ion-card v-if="!selectedAddress || !addresses.length">
        <ion-card-header>
          <ion-card-title>
            Selecione ou adicione seu endereço
          </ion-card-title>
          <ion-card-subtitle>
            Para encontrar <b>Parceiros</b> por perto
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-img src="/public/img/address-pin.svg" style="fill: red"/>

          <ion-button expand="block" @click="toggleAddressesModal">
            <ion-icon :icon="locationOutline"/>
            Selecionar ou adicionar um endereço
          </ion-button>
        </ion-card-content>
      </ion-card>

      <div v-if="selectedAddress && addresses.length">
        <ion-card v-for="partner in data.list" :key="partner.id" @click="goToPartner(partner.id as number)">
          <ion-card-header>
            <ion-card-subtitle>{{ formatAddress(partner.address) }}</ion-card-subtitle>
            <ion-card-title>{{ partner.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-img v-show="partner.pictureURI" class="partner-img" :src="partner.pictureURI as string"/>
          </ion-card-content>
        </ion-card>
      </div>

      <br/><br/><br/>

      <ion-infinite-scroll @ionInfinite="ionInfinite" :disabled="!shouldFindMorePartners">
        <ion-infinite-scroll-content loadingText="Aguarde..." loadingSpinner="circles"></ion-infinite-scroll-content>
      </ion-infinite-scroll>
      <CustomerAddressesModal :visible="addressesVisible" @close="toggleAddressesModal"/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonTitle,
  IonToolbar,
  IonButton, loadingController,
} from '@ionic/vue'
import AppTitle from "@/components/AppTitle.vue";
import { locationOutline } from "ionicons/icons";
import { useAddress, useListPartners } from '@/composables';
import router from '@/router';
import { onMounted, onUnmounted, ref } from "vue";
import { formatAddress, formatAddressSmall } from "../utils";
import CustomerAddressesModal from "@/views/CustomerAddressesModal.vue";
import CustomerAddressSelectionCard from "@/components/CustomerAddressSelectionCard.vue";

const {
  shouldFindMorePartners,
  data,
  reset,
  findPartners,
  ionInfinite
} = useListPartners()

const { selectedAddress, addresses, addressesVisible, toggleAddressesModal } = useAddress()

const goToPartner = async (partnerId: number) => {
  await router.push(`/tabs/partnerListTab/partner/${partnerId}`)
}

const handleRefresh = (event: CustomEvent) => {
  setTimeout(async () => {
    reset()

    await findPartners()
    // Any calls to load data go here
    event?.target?.complete();
  }, 2000);
};


onMounted(async () => {
  const loading = await loadingController.create({
    message: 'Carregando...',
  });
  await loading.present()
  reset()
  if (selectedAddress.value) {
    await findPartners()
  }

  await loading.dismiss()
})

onUnmounted(() => {
  reset()
})


</script>

<style scoped>
.location-row {
  padding: 0 16px 0 16px;
}

.md > .location-col {
  padding-top: 6%;
}

.ios > .location-col {
  padding-top: 5%;
}


.partner-img {
  padding-left: 50px;
  padding-right: 50px;
}
</style>
