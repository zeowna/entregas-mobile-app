<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <app-title/>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            <app-title/>
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-row class="location-row">
        <ion-col class="location-col" size="sm">
          <ion-icon :icon="locationOutline"/>
        </ion-col>
        <ion-col>
          <ion-input placeholder="Sua Localização" v-model="location"/>
        </ion-col>
      </ion-row>

      <ion-card v-for="partner in partners" :key="partner.id" @click="goToPartner(partner.id)">
        <ion-card-header>
          <ion-card-subtitle>{{ getAddressText(partner.address) }}</ion-card-subtitle>
          <ion-card-title>{{ partner.name }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-img v-show="partner.pictureURI" class="partner-img" :src="partner.pictureURI"/>
        </ion-card-content>
      </ion-card>

      <br/><br/><br/>

      <ion-infinite-scroll @ionInfinite="ionInfinite" :disabled="!shouldFindMorePartners">
        <ion-infinite-scroll-content loadingText="Aguarde..." loadingSpinner="circles"></ion-infinite-scroll-content>
      </ion-infinite-scroll>

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
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import AppTitle from "@/components/AppTitle.vue";
import { locationOutline } from "ionicons/icons";
import { useListPartners } from '@/composables';
import router from '@/router';

const {
  shouldFindMorePartners,
  location,
  partners,
  getAddressText,
  ionInfinite
} = useListPartners()

const goToPartner = (partnerId: number) => {
  router.push(`/tabs/partnerListTab/partner/${partnerId}`)
}
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
