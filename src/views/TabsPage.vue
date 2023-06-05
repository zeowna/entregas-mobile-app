<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/partnerListTab">
          <ion-icon aria-hidden="true" :icon="storefrontOutline"/>
          <ion-label>Parceiros</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/ordersTab">
          <ion-icon aria-hidden="true" :icon="cardOutline"/>
          <ion-label>Pedidos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/myDataTab">
          <ion-icon aria-hidden="true" :icon="personOutline"/>
          <ion-label>Meu Dados</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { cardOutline, personOutline, storefrontOutline } from 'ionicons/icons';
</script>
