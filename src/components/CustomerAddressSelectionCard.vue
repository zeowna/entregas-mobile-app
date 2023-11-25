<template>
  <ion-card v-if="addresses.length">
    <ion-card-header>
      <ion-card-title>
        Endereço para entrega
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-button color="primary" expand="block" @click="toggleAddressesModal">
        <ion-icon :icon="locationOutline" slot="start"/>
        {{ formatAddressSmall(selectedAddress as Address) }}
      </ion-button>
    </ion-card-content>
  </ion-card>

  <CustomerAddressesModal :visible="addressesVisible" @close="toggleAddressesModal"/>
</template>
<script setup lang="ts">
import { locationOutline } from "ionicons/icons";
import { formatAddressSmall } from "@/utils";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from "@ionic/vue";

import { useAddress } from "@/composables";
import CustomerAddressesModal from "@/views/CustomerAddressesModal.vue";
import { Address } from "../services/api/types";

const { selectedAddress, addresses, addressesVisible, toggleAddressesModal } = useAddress()

</script>
