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
              <ion-avatar class="ion-text-center" @click="selectFile">
                <ion-img :src="customer?.profilePictureURI || avatarPlaceholderURI"/>
                <input type="file" ref="file" @change="uploadFile($event)" v-show="false" />
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
  IonToolbar,
alertController,
loadingController
} from '@ionic/vue';
import { exitOutline, personCircle } from "ionicons/icons";
import AppTitle from "@/components/AppTitle.vue";
import { useMyData } from '@/composables';
import { ref } from 'vue';
import EditMyDataModal from '@/views/EditMyDataModal.vue';
import AppHeader from "@/components/AppHeader.vue";
import { Api } from '@/services/api/Api';
import { store } from '@/store';
import { ActionTypes } from '@/store/actions';

const file = ref()
const { customer, signOut } = useMyData()
const visible = ref(false)

const avatarPlaceholderURI = ref('https://ionicframework.com/docs/img/demos/avatar.svg')

const openEditMyDataModal = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

const selectFile = () => {
  file.value.click()
}

const uploadFile = async (e: any) => {
  if (!e.target.files.length) {
    return
  }

  const loading = await loadingController.create({ message: 'Salvando...' })

  try {
    await loading.present()

    const [selectedFile] = e.target.files

    await Api.customers.uploadPicture(customer.value.id as number, selectedFile as File)
    await store.dispatch(ActionTypes.REFRESH_TOKEN, true)
  } catch (err) {
    const alert = await alertController.create({ header: 'Erro ao salvar foto', buttons: ['Ok' ]})
    await alert.present()
  } finally {
    await loading.dismiss()
  }
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
