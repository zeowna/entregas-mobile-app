<template>
  <ion-page>
    <AppHeader />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            <app-title/>
          </ion-title>
        </ion-toolbar>
      </ion-header>


      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>Dados de Usuário</ion-card-subtitle>
          <ion-card-title>Meus dados</ion-card-title>
        </ion-card-header>
        <ion-card-content>

          <ion-row>
            <ion-col size="sm">
              <ion-avatar class="ion-text-center">
                <ion-img :src="customer?.profilePictureURI || avatarPlaceholderURI"/>
              </ion-avatar>
            </ion-col>
            <ion-col size="auto" class="personal-data">
              <p><b>{{ customer?.name }}</b></p>
              <p>{{ customer?.email }}</p>
            </ion-col>
          </ion-row>

          <br/>
          <ion-button expand="block" type="button" @click="openEditMyDataModal">
            <ion-icon :icon="personCircle" slot="start"/>
            Editar
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-list>
        <ion-item @click="signOut">
          <ion-label>
            Sair do App
          </ion-label>
          <ion-icon aria-hidden="true" :icon="exitOutline"/>
        </ion-item>
      </ion-list>
      <EditMyDataModal :visible="visible" @close="close"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAvatar,
  IonButton,
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
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { exitOutline, personCircle } from "ionicons/icons";
import AppTitle from "@/components/AppTitle.vue";
import { useMyData } from '@/composables';
import { ref } from 'vue';
import EditMyDataModal from '@/views/EditMyDataModal.vue';
import AppHeader from "@/components/AppHeader.vue";

const { customer, signOut } = useMyData()
const visible = ref(false)

const avatarPlaceholderURI = ref('https://ionicframework.com/docs/img/demos/avatar.svg')

const openEditMyDataModal = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

</script>


<style scoped>
.ios + .personal-data {
  padding-top: 9px;
}

.md + .personal-data {
  padding-top: 15px;
}


</style>
